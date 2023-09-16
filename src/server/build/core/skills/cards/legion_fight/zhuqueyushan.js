"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhuQueYuShanSkill = void 0;
const tslib_1 = require("tslib");
const zhuqueyushan_1 = require("core/ai/skills/cards/zhuqueyushan");
const card_1 = require("core/cards/card");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhuQueYuShanSkill = class ZhuQueYuShanSkill extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardUseDeclared" /* AfterCardUseDeclared */;
    }
    canUse(room, owner, event) {
        return engine_1.Sanguosha.getCardById(event.cardId).Name === 'slash' && owner.Id === event.fromId;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const cardUseEvent = event.triggeredOnEvent;
        const { cardId } = cardUseEvent;
        const fireSlash = card_1.VirtualCard.create({
            cardName: 'fire_slash',
            bySkill: this.Name,
        }, [cardId]);
        room.endProcessOnTag(cardUseEvent.cardId.toString());
        cardUseEvent.cardId = fireSlash.Id;
        room.addProcessingCards(cardUseEvent.cardId.toString(), cardUseEvent.cardId);
        room.broadcast(103 /* CustomGameDialog */, {
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}, transfrom {2} into {3}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId)), this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(cardId), translation_json_tool_1.TranslationPack.patchCardInTranslation(fireSlash.Id)).extract(),
        });
        return true;
    }
};
ZhuQueYuShanSkill = tslib_1.__decorate([
    skill_wrappers_1.AI(zhuqueyushan_1.ZhuQueYuShanSkillTrigger),
    skill_1.CommonSkill({ name: 'zhuqueyushan', description: 'zhuqueyushan_description' })
], ZhuQueYuShanSkill);
exports.ZhuQueYuShanSkill = ZhuQueYuShanSkill;
