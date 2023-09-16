"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuDingDaoSkill = void 0;
const tslib_1 = require("tslib");
const gudingdao_1 = require("core/ai/skills/cards/gudingdao");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let GuDingDaoSkill = class GuDingDaoSkill extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "DamageEffect" /* DamageEffect */ && event.isFromChainedDamage !== true;
    }
    canUse(room, owner, event) {
        if (!event.cardIds || engine_1.Sanguosha.getCardById(event.cardIds[0]).GeneralName !== 'slash') {
            return false;
        }
        return (event.fromId === owner.Id && room.getPlayerById(event.toId).getCardIds(0 /* HandArea */).length === 0);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const damageEvent = event.triggeredOnEvent;
        damageEvent.damage++;
        damageEvent.messages = damageEvent.messages || [];
        damageEvent.messages.push(translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}, damage increases to {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId)), this.Name, damageEvent.damage).toString());
        return true;
    }
};
GuDingDaoSkill = tslib_1.__decorate([
    skill_1.AI(gudingdao_1.GuDingDaoSkillTrigger),
    skill_1.CompulsorySkill({ name: 'gudingdao', description: 'gudingdao_description' })
], GuDingDaoSkill);
exports.GuDingDaoSkill = GuDingDaoSkill;
