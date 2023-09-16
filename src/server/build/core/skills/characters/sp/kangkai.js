"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KangKai = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let KangKai = class KangKai extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterAimmed" /* AfterAimmed */;
    }
    canUse(room, owner, content) {
        return (engine_1.Sanguosha.getCardById(content.byCardId).GeneralName === 'slash' &&
            room.distanceBetween(owner, room.getPlayerById(content.toId)) <= 1);
    }
    getSkillLog(room, owner, event) {
        return event.toId === owner.Id
            ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw a card?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.toId))).extract()
            : translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw 1 card, and then give {1} a card?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.toId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        await room.drawCards(1, fromId, 'top', fromId, this.Name);
        const toId = event.triggeredOnEvent.toId;
        if (fromId !== toId && !room.getPlayerById(toId).Dead && room.getPlayerById(fromId).getPlayerCards().length > 0) {
            const resp = await room.doAskForCommonly(163 /* AskForCardEvent */, {
                cardAmount: 1,
                toId: fromId,
                reason: this.Name,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose a card to display and give it to {1} ? If this card is eqiup card, {1} can use it', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(toId))).extract(),
                fromArea: [0 /* HandArea */, 1 /* EquipArea */],
                triggeredBySkills: [this.Name],
            }, fromId, true);
            const wholeCards = room.getPlayerById(fromId).getPlayerCards();
            resp.selectedCards = resp.selectedCards || [wholeCards[Math.floor(Math.random() * wholeCards.length)]];
            const showCardEvent = {
                displayCards: [resp.selectedCards[0]],
                fromId,
                translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} displays card {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(resp.selectedCards[0])).extract(),
            };
            room.broadcast(126 /* CardDisplayEvent */, showCardEvent);
            const realCardId = card_1.VirtualCard.getActualCards([resp.selectedCards[0]])[0];
            await room.moveCards({
                movingCards: [
                    { card: resp.selectedCards[0], fromArea: room.getPlayerById(fromId).cardFrom(resp.selectedCards[0]) },
                ],
                fromId,
                toId,
                toArea: 0 /* HandArea */,
                moveReason: 2 /* ActiveMove */,
                proposer: fromId,
                triggeredBySkills: [this.Name],
            });
            const toUse = room
                .getPlayerById(toId)
                .getCardIds(0 /* HandArea */)
                .find(id => card_1.VirtualCard.getActualCards([id])[0] === realCardId);
            if (toUse && engine_1.Sanguosha.getCardById(toUse).is(1 /* Equip */)) {
                const { selectedOption } = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                    toId,
                    options: ['yes', 'no'],
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to use {1}', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(toUse)).extract(),
                }, toId, true);
                selectedOption === 'yes' &&
                    (await room.useCard({
                        fromId: toId,
                        targetGroup: [[toId]],
                        cardId: toUse,
                    }, true));
            }
        }
        return true;
    }
};
KangKai = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'kangkai', description: 'kangkai_description' })
], KangKai);
exports.KangKai = KangKai;
