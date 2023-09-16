"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KouLve = void 0;
const tslib_1 = require("tslib");
const card_props_1 = require("core/cards/libs/card_props");
const engine_1 = require("core/game/engine");
const algorithm_1 = require("core/shares/libs/algorithm");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let KouLve = class KouLve extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamageEffect" /* AfterDamageEffect */;
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            content.toId !== owner.Id &&
            room.CurrentPhasePlayer === owner &&
            room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
            !room.getPlayerById(content.toId).Dead &&
            room.getPlayerById(content.toId).LostHp > 0 &&
            room.getPlayerById(content.toId).getCardIds(0 /* HandArea */).length > 0);
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to display {1} card from {2}’s hand?', this.Name, room.getPlayerById(event.toId).LostHp, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.toId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const victim = event.triggeredOnEvent.toId;
        const handCards = room.getPlayerById(victim).getCardIds(0 /* HandArea */);
        let selectedCards = handCards;
        if (handCards.length > room.getPlayerById(victim).LostHp) {
            const response = await room.doAskForCommonly(166 /* AskForChoosingCardWithConditionsEvent */, {
                toId: victim,
                customCardFields: {
                    [0 /* HandArea */]: handCards.length,
                },
                customTitle: this.Name,
                amount: room.getPlayerById(victim).LostHp,
                triggeredBySkills: [this.Name],
            }, fromId, true);
            response.selectedCardsIndex = response.selectedCardsIndex || [0];
            selectedCards = algorithm_1.Algorithm.randomPick(response.selectedCardsIndex.length, handCards);
        }
        const showCardEvent = {
            displayCards: selectedCards,
            fromId: victim,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} display hand card {1} from {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(...selectedCards), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(victim))).extract(),
        };
        room.broadcast(126 /* CardDisplayEvent */, showCardEvent);
        const movingCards = [];
        let hasRed = false;
        for (const id of selectedCards) {
            const card = engine_1.Sanguosha.getCardById(id);
            if (Object.values(card_props_1.DamageCardEnum).includes(card.GeneralName)) {
                movingCards.push({ card: id, fromArea: 0 /* HandArea */ });
            }
            hasRed = hasRed || card.isRed();
        }
        await room.moveCards({
            movingCards,
            fromId: victim,
            toId: fromId,
            toArea: 0 /* HandArea */,
            moveReason: 1 /* ActivePrey */,
            proposer: fromId,
            triggeredBySkills: [this.Name],
        });
        if (hasRed) {
            if (room.getPlayerById(fromId).LostHp > 0) {
                await room.changeMaxHp(fromId, -1);
            }
            else {
                await room.loseHp(fromId, 1);
            }
            await room.drawCards(2, event.fromId, 'top', event.fromId, this.Name);
        }
        return true;
    }
};
KouLve = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'koulve', description: 'koulve_description' })
], KouLve);
exports.KouLve = KouLve;
