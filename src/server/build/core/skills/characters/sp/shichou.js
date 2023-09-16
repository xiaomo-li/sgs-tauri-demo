"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiChou = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const target_group_1 = require("core/shares/libs/utils/target_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ShiChou = class ShiChou extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardTargetDeclared" /* AfterCardTargetDeclared */;
    }
    canUse(room, owner, content) {
        if (owner.getFlag(this.Name)) {
            room.removeFlag(owner.Id, this.Name);
        }
        let canUse = content.fromId === owner.Id && engine_1.Sanguosha.getCardById(content.cardId).GeneralName === 'slash';
        if (canUse) {
            const targets = room
                .getOtherPlayers(owner.Id)
                .filter(player => room.canAttack(owner, player, content.cardId, undefined, true) &&
                !target_group_1.TargetGroupUtil.getRealTargets(content.targetGroup).includes(player.Id));
            canUse = targets.length > 0;
            if (canUse) {
                room.setFlag(owner.Id, this.Name, targets.map(player => player.Id));
            }
        }
        return canUse;
    }
    targetFilter(room, owner, targets) {
        return targets.length > 0 && targets.length <= Math.max(1, owner.LostHp);
    }
    isAvailableTarget(owner, room, target) {
        var _a;
        return (_a = room.getFlag(owner, this.Name)) === null || _a === void 0 ? void 0 : _a.includes(target);
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to add at least {1} targets for {2} ?', this.Name, Math.max(1, owner.LostHp), translation_json_tool_1.TranslationPack.patchCardInTranslation(event.cardId)).extract();
    }
    getAnimationSteps(event) {
        return event.toIds ? [{ from: event.fromId, tos: event.toIds }] : [];
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { toIds } = event;
        if (!toIds) {
            return false;
        }
        const targetGroup = event.triggeredOnEvent.targetGroup;
        if (targetGroup) {
            for (const toId of toIds) {
                target_group_1.TargetGroupUtil.pushTargets(targetGroup, toId);
            }
        }
        return true;
    }
};
ShiChou = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'shichou', description: 'shichou_description' })
], ShiChou);
exports.ShiChou = ShiChou;
