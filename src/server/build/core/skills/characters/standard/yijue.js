"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YiJueBlocker = exports.YiJueShadow = exports.YiJue = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const uncompulsory_blocker_1 = require("./uncompulsory_blocker");
let YiJue = class YiJue extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target && room.getPlayerById(target).getCardIds(0 /* HandArea */).length > 0;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, toIds, cardIds } = skillUseEvent;
        const from = room.getPlayerById(fromId);
        const to = room.getPlayerById(toIds[0]);
        await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
        const askForDisplayCardEvent = event_packer_1.EventPacker.createUncancellableEvent({
            cardAmount: 1,
            toId: to.Id,
            triggeredBySkills: [this.Name],
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1} to you, please present a hand card', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), this.Name).extract(),
        });
        room.notify(161 /* AskForCardDisplayEvent */, askForDisplayCardEvent, to.Id);
        const { selectedCards } = await room.onReceivingAsyncResponseFrom(161 /* AskForCardDisplayEvent */, to.Id);
        room.broadcast(126 /* CardDisplayEvent */, {
            displayCards: selectedCards,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} display hand card {1} from {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), translation_json_tool_1.TranslationPack.patchCardInTranslation(...selectedCards), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to)).extract(),
        });
        const card = engine_1.Sanguosha.getCardById(selectedCards[0]);
        if (card.isBlack()) {
            await room.obtainSkill(to.Id, YiJueBlocker.Name);
            room.setFlag(to.Id, this.Name, true, this.Name);
            to.hasShadowSkill(uncompulsory_blocker_1.UncompulsoryBlocker.Name) || (await room.obtainSkill(to.Id, uncompulsory_blocker_1.UncompulsoryBlocker.Name));
        }
        else {
            await room.moveCards({
                movingCards: selectedCards.map(card => ({ card, fromArea: 0 /* HandArea */ })),
                fromId: to.Id,
                toArea: 0 /* HandArea */,
                toId: from.Id,
                proposer: from.Id,
                moveReason: 3 /* PassiveMove */,
                movedByReason: this.Name,
            });
            if (to.MaxHp > to.Hp) {
                const askForChooseEvent = {
                    options: ['yijue:recover', 'yijue:cancel'],
                    toId: from.Id,
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('recover {0} hp for {1}', 1, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to)).extract(),
                    triggeredBySkills: [this.Name],
                };
                room.notify(168 /* AskForChoosingOptionsEvent */, askForChooseEvent, from.Id);
                const { selectedOption } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, from.Id);
                if (selectedOption === 'yijue:recover') {
                    await room.recover({
                        recoveredHp: 1,
                        recoverBy: from.Id,
                        toId: to.Id,
                    });
                }
            }
        }
        return true;
    }
};
YiJue = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'yijue', description: 'yijue_description' })
], YiJue);
exports.YiJue = YiJue;
let YiJueShadow = class YiJueShadow extends skill_1.TriggerSkill {
    afterDead(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    getPriority() {
        return 0 /* High */;
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    isTriggerable(event, stage) {
        return stage === "DamageEffect" /* DamageEffect */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 137 /* DamageEvent */) {
            content = content;
            return room.getPlayerById(content.toId).getFlag(this.GeneralName) && owner.Id === content.fromId;
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            content = content;
            return owner.Id === content.fromPlayer && content.from === 7 /* PhaseFinish */;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent, fromId } = skillUseEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(triggeredOnEvent);
        if (identifier === 137 /* DamageEvent */) {
            const content = triggeredOnEvent;
            const card = content.cardIds && engine_1.Sanguosha.getCardById(content.cardIds[0]);
            if ((card === null || card === void 0 ? void 0 : card.GeneralName) === 'slash' && card.Suit === 2 /* Heart */) {
                content.damage++;
                content.messages = content.messages || [];
                content.messages.push(translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}, damage increases to {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId)), this.Name, content.damage).toString());
            }
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            for (const player of room.AlivePlayers) {
                room.removeFlag(player.Id, this.GeneralName);
                if (player.hasSkill(YiJueBlocker.Name)) {
                    await room.loseSkill(player.Id, YiJueBlocker.Name);
                }
                player.hasShadowSkill(uncompulsory_blocker_1.UncompulsoryBlocker.Name) && (await room.loseSkill(player.Id, uncompulsory_blocker_1.UncompulsoryBlocker.Name));
            }
        }
        return true;
    }
};
YiJueShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CompulsorySkill({ name: YiJue.GeneralName, description: YiJue.Description })
], YiJueShadow);
exports.YiJueShadow = YiJueShadow;
let YiJueBlocker = class YiJueBlocker extends skill_1.FilterSkill {
    canUseCard(cardId, room, owner) {
        return cardId instanceof card_matcher_1.CardMatcher
            ? false
            : room.getPlayerById(owner).cardFrom(cardId) !== 0 /* HandArea */;
    }
};
YiJueBlocker = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CompulsorySkill({ name: 'shadowYijueBlocker', description: 'shadowYijueBlocker_description' })
], YiJueBlocker);
exports.YiJueBlocker = YiJueBlocker;
