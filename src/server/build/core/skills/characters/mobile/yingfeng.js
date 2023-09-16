"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YingFengShadow = exports.YingFeng = void 0;
const tslib_1 = require("tslib");
const game_props_1 = require("core/game/game_props");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let YingFeng = class YingFeng extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 3 /* PrepareStageStart */ &&
            !!room.AlivePlayers.find(player => player.getMark("feng" /* Feng */) === 0));
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return room.getPlayerById(target).getMark("feng" /* Feng */) === 0;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const fengOwner = room.AlivePlayers.find(player => player.getMark("feng" /* Feng */) > 0);
        fengOwner && room.removeMark(fengOwner.Id, "feng" /* Feng */);
        room.addMark(event.toIds[0], "feng" /* Feng */, 1);
        return true;
    }
};
YingFeng = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'yingfeng', description: 'yingfeng_description' })
], YingFeng);
exports.YingFeng = YingFeng;
let YingFengShadow = class YingFengShadow extends skill_1.GlobalRulesBreakerSkill {
    breakGlobalCardUsableDistance(cardId, room, owner, target) {
        return target.getMark("feng" /* Feng */) > 0 ? game_props_1.INFINITE_DISTANCE : 0;
    }
};
YingFengShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: YingFeng.Name, description: YingFeng.Description })
], YingFengShadow);
exports.YingFengShadow = YingFengShadow;
