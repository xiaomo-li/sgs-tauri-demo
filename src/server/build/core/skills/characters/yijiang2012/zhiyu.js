"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhiYu = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhiYu = class ZhiYu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.toId;
    }
    targetFilter(room, owner, targets) {
        return targets.length === 0;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const from = room.getPlayerById(skillUseEvent.fromId);
        const damageEvent = skillUseEvent.triggeredOnEvent;
        const handCards = from.getCardIds(0 /* HandArea */);
        await room.drawCards(1, skillUseEvent.fromId, undefined, skillUseEvent.fromId, this.Name);
        room.broadcast(126 /* CardDisplayEvent */, {
            fromId: skillUseEvent.fromId,
            displayCards: handCards,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} display hand card {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), translation_json_tool_1.TranslationPack.patchCardInTranslation(...handCards)).extract(),
        });
        if (!damageEvent.fromId ||
            room.getPlayerById(damageEvent.fromId).getCardIds(0 /* HandArea */).length === 0) {
            return true;
        }
        const firstCardColor = engine_1.Sanguosha.getCardById(handCards[0]).Color;
        const inSameColor = handCards.find(cardId => engine_1.Sanguosha.getCardById(cardId).Color !== firstCardColor) === undefined;
        if (inSameColor) {
            const response = await room.askForCardDrop(damageEvent.fromId, 1, [0 /* HandArea */], true, undefined, this.Name);
            response.droppedCards.length > 0 &&
                (await room.dropCards(4 /* SelfDrop */, response.droppedCards, damageEvent.fromId, damageEvent.fromId, this.Name));
        }
        return true;
    }
};
ZhiYu = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'zhiyu', description: 'zhiyu_description' })
], ZhiYu);
exports.ZhiYu = ZhiYu;
