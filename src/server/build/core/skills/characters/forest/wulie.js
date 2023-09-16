"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WuLieShadow = exports.WuLie = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let WuLie = class WuLie extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "BeforeStageChange" /* BeforeStageChange */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.playerId && 19 /* FinishStageStart */ === content.toStage;
    }
    targetFilter(room, owner, targets) {
        return targets.length > 0 && targets.length < owner.Hp;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { toIds } = event;
        if (!toIds || toIds.length === 0) {
            return false;
        }
        await room.loseHp(event.fromId, toIds.length);
        for (const target of toIds) {
            await room.obtainSkill(target, WuLieShadow.Name);
            room.addMark(target, "lie" /* Lie */, 1);
        }
        return true;
    }
};
WuLie = tslib_1.__decorate([
    skill_wrappers_1.LimitSkill({ name: 'wulie', description: 'wulie_description' })
], WuLie);
exports.WuLie = WuLie;
let WuLieShadow = class WuLieShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "DamagedEffect" /* DamagedEffect */;
    }
    canUse(room, owner, content) {
        return content.toId === owner.Id && owner.getMark("lie" /* Lie */) > 0;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const damageEvent = event.triggeredOnEvent;
        room.addMark(event.fromId, "lie" /* Lie */, -1);
        room.broadcast(103 /* CustomGameDialog */, {
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}, prevent the damage', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId)), this.Name).extract(),
        });
        event_packer_1.EventPacker.terminate(damageEvent);
        return true;
    }
};
WuLieShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: 'wulie_shadow', description: 'wulie_shadow_description' })
], WuLieShadow);
exports.WuLieShadow = WuLieShadow;
