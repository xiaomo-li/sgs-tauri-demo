"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YuCe = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YuCe = class YuCe extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.toId && owner.getCardIds(0 /* HandArea */).length > 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard() {
        return true;
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, cardIds, triggeredOnEvent } = skillUseEvent;
        const showCardEvent = {
            displayCards: cardIds,
            fromId,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} display hand card {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(...cardIds)).extract(),
        };
        room.broadcast(126 /* CardDisplayEvent */, showCardEvent);
        const damageEvent = triggeredOnEvent;
        const damageFromId = damageEvent.fromId;
        if (damageFromId !== undefined && !room.getPlayerById(damageFromId).Dead) {
            const handCards = room.getPlayerById(damageFromId).getCardIds(0 /* HandArea */);
            if (handCards.length <= 0) {
                await room.recover({
                    toId: fromId,
                    recoveredHp: 1,
                });
            }
            else {
                const type = engine_1.Sanguosha.getCardById(cardIds[0]).BaseType;
                const response = await room.askForCardDrop(damageFromId, 1, [0 /* HandArea */], false, room
                    .getPlayerById(damageFromId)
                    .getCardIds(0 /* HandArea */)
                    .filter(id => engine_1.Sanguosha.getCardById(id).BaseType === type), this.Name);
                if (response.droppedCards.length > 0) {
                    await room.dropCards(4 /* SelfDrop */, response.droppedCards, damageFromId, damageFromId, this.Name);
                }
                else {
                    await room.recover({
                        toId: fromId,
                        recoveredHp: 1,
                    });
                }
            }
        }
        return true;
    }
};
YuCe = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'yuce', description: 'yuce_description' })
], YuCe);
exports.YuCe = YuCe;
