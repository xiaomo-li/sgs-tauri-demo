"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhenNan = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhenNan = class ZhenNan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterAim" /* AfterAim */;
    }
    canUse(room, owner, event) {
        return (event.isFirstTarget &&
            engine_1.Sanguosha.getCardById(event.byCardId).isCommonTrick() &&
            aim_group_1.AimGroupUtil.getAllTargets(event.allTargets).length > 1);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target && room.getPlayerById(target).getPlayerCards().length > 0;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to deal 1 damage to another player?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        await room.damage({
            fromId: event.fromId,
            toId: event.toIds[0],
            damage: 1,
            damageType: "normal_property" /* Normal */,
            triggeredBySkills: [this.Name],
        });
        return true;
    }
};
ZhenNan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'zhennan', description: 'zhennan_description' })
], ZhenNan);
exports.ZhenNan = ZhenNan;
