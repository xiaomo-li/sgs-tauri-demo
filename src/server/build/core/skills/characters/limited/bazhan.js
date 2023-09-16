"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaZhan = void 0;
const tslib_1 = require("tslib");
const alcohol_1 = require("core/cards/legion_fight/alcohol");
const engine_1 = require("core/game/engine");
const algorithm_1 = require("core/shares/libs/algorithm");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let BaZhan = class BaZhan extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return (!owner.hasUsedSkill(this.Name) &&
            !(owner.getSwitchSkillState(this.Name, true) === 0 /* Yang */ &&
                owner.getCardIds(0 /* HandArea */).length === 0));
    }
    cardFilter(room, owner, cards) {
        return owner.getSwitchSkillState(this.Name, true) === 0 /* Yang */
            ? cards.length > 0 && cards.length < 3
            : cards.length === 0;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return (target !== owner &&
            !(room.getPlayerById(owner).getSwitchSkillState(this.Name, true) === 1 /* Yin */ &&
                room.getPlayerById(target).getCardIds(0 /* HandArea */).length === 0));
    }
    isAvailableCard(owner, room) {
        return room.getPlayerById(owner).getSwitchSkillState(this.Name, true) === 0 /* Yang */;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const currentSkillState = room.getPlayerById(event.fromId).getSwitchSkillState(this.Name);
        if (!event.toIds || (currentSkillState === 0 /* Yang */ && !event.cardIds)) {
            return false;
        }
        let hasHeartOrAlcohol = false;
        if (currentSkillState === 0 /* Yang */) {
            await room.moveCards({
                movingCards: event.cardIds.map(card => ({ card, fromArea: 0 /* HandArea */ })),
                fromId: event.fromId,
                toId: event.toIds[0],
                toArea: 0 /* HandArea */,
                moveReason: 2 /* ActiveMove */,
                proposer: event.fromId,
                triggeredBySkills: [this.Name],
            });
            hasHeartOrAlcohol = !!event.cardIds.find(cardId => engine_1.Sanguosha.getCardById(cardId).GeneralName === alcohol_1.Alcohol.name ||
                engine_1.Sanguosha.getCardById(cardId).Suit === 2 /* Heart */);
        }
        else {
            const handCards = room.getPlayerById(event.toIds[0]).getCardIds(0 /* HandArea */);
            const response = await room.doAskForCommonly(166 /* AskForChoosingCardWithConditionsEvent */, {
                toId: event.toIds[0],
                customCardFields: {
                    [0 /* HandArea */]: handCards.length,
                },
                customTitle: this.Name,
                amount: [1, 2],
                triggeredBySkills: [this.Name],
            }, event.fromId, true);
            response.selectedCardsIndex = response.selectedCardsIndex || [0];
            response.selectedCards = algorithm_1.Algorithm.randomPick(response.selectedCardsIndex.length, handCards);
            await room.moveCards({
                movingCards: response.selectedCards.map(card => ({ card, fromArea: 0 /* HandArea */ })),
                fromId: event.toIds[0],
                toId: event.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: event.fromId,
                triggeredBySkills: [this.Name],
            });
            hasHeartOrAlcohol = !!response.selectedCards.find(cardId => engine_1.Sanguosha.getCardById(cardId).GeneralName === alcohol_1.Alcohol.name ||
                engine_1.Sanguosha.getCardById(cardId).Suit === 2 /* Heart */);
        }
        if (hasHeartOrAlcohol) {
            const options = ['cancel'];
            const to = room.getPlayerById(event.toIds[0]);
            to.LostHp > 0 && options.push('bazhan:recover');
            if (to.ChainLocked || !to.isFaceUp()) {
                options.push('bazhan:resume');
            }
            if (options.length === 1) {
                return true;
            }
            const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                options,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose bazhan options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to)).extract(),
                toId: event.fromId,
                triggeredBySkills: [this.Name],
            }, event.fromId, true);
            const handler = currentSkillState === 0 /* Yang */ ? event.toIds[0] : event.fromId;
            if (response.selectedOption === 'bazhan:recover') {
                await room.recover({
                    toId: handler,
                    recoveredHp: 1,
                    recoverBy: event.fromId,
                });
            }
            else if (response.selectedOption === 'bazhan:resume') {
                to.ChainLocked && (await room.chainedOn(handler));
                to.isFaceUp() || (await room.turnOver(handler));
            }
        }
        return true;
    }
};
BaZhan = tslib_1.__decorate([
    skill_wrappers_1.SwitchSkill(),
    skill_wrappers_1.CommonSkill({ name: 'bazhan', description: 'bazhan_description' })
], BaZhan);
exports.BaZhan = BaZhan;
