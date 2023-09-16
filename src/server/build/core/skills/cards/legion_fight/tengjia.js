"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TengJiaSkill = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let TengJiaSkill = class TengJiaSkill extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PreCardEffect" /* PreCardEffect */ || stage === "DamagedEffect" /* DamagedEffect */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 125 /* CardEffectEvent */) {
            const effectEvent = content;
            return (effectEvent.toIds !== undefined &&
                effectEvent.toIds.includes(owner.Id) &&
                (engine_1.Sanguosha.getCardById(effectEvent.cardId).Name === 'slash' ||
                    engine_1.Sanguosha.getCardById(effectEvent.cardId).GeneralName === 'nanmanruqing' ||
                    engine_1.Sanguosha.getCardById(effectEvent.cardId).GeneralName === 'wanjianqifa'));
        }
        else if (identifier === 137 /* DamageEvent */) {
            const damageEvent = content;
            return damageEvent.toId === owner.Id && damageEvent.damageType === "fire_property" /* Fire */;
        }
        return false;
    }
    async onTrigger(room, content) {
        content.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(content.fromId)), this.Name).extract();
        return true;
    }
    async onEffect(room, skillUseEvent) {
        var _a;
        const unknownEvent = skillUseEvent.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 125 /* CardEffectEvent */) {
            const effectEvent = unknownEvent;
            (_a = effectEvent.nullifiedTargets) === null || _a === void 0 ? void 0 : _a.push(skillUseEvent.fromId);
        }
        else if (identifier === 137 /* DamageEvent */) {
            const damageEvent = unknownEvent;
            damageEvent.damage++;
            damageEvent.messages = damageEvent.messages || [];
            damageEvent.messages.push(translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}, damage increases to {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId)), this.Name, damageEvent.damage).toString());
        }
        return true;
    }
};
TengJiaSkill = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'tengjia', description: 'tengjia_description' })
], TengJiaSkill);
exports.TengJiaSkill = TengJiaSkill;
