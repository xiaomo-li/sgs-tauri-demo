"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JueQing = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JueQing = class JueQing extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "DamageStart" /* DamageStart */;
    }
    canUse(room, owner, event) {
        return event.fromId === owner.Id && !room.getPlayerById(event.toId).Dead;
    }
    async onTrigger(room, event) {
        event.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId)), this.Name).extract();
        return true;
    }
    async onEffect(room, event) {
        const damageEvent = event.triggeredOnEvent;
        event_packer_1.EventPacker.terminate(damageEvent);
        await room.loseHp(damageEvent.toId, damageEvent.damage);
        return true;
    }
};
JueQing = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'jueqing', description: 'jueqing_description' })
], JueQing);
exports.JueQing = JueQing;
