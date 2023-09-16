"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WuYan = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let WuYan = class WuYan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "DamageEffect" /* DamageEffect */ || stage === "DamagedEffect" /* DamagedEffect */;
    }
    canUse(room, owner, content, stage) {
        if (content.cardIds === undefined || !engine_1.Sanguosha.getCardById(content.cardIds[0]).is(7 /* Trick */)) {
            return false;
        }
        if (stage === "DamageEffect" /* DamageEffect */) {
            return content.fromId === owner.Id;
        }
        else {
            return content.toId === owner.Id;
        }
    }
    async onTrigger(room, content) {
        const damageEvent = content.triggeredOnEvent;
        content.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}, prevent the damage of {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(content.fromId)), this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(...damageEvent.cardIds)).extract();
        return true;
    }
    async onEffect(room, event) {
        const damageEvent = event.triggeredOnEvent;
        event_packer_1.EventPacker.terminate(damageEvent);
        return true;
    }
};
WuYan = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'wuyan', description: 'wuyan_description' })
], WuYan);
exports.WuYan = WuYan;
