"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XiangShu = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let XiangShu = class XiangShu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, event) {
        return (event.playerId === owner.Id &&
            event.toStage === 19 /* FinishStageStart */ &&
            room.Analytics.getDamageRecord(owner.Id, 'round', undefined, 1).length > 0);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return room.getPlayerById(target).LostHp > 0;
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a wounded target to recover {1} hp and draw {1} cards?', this.Name, Math.min(room.Analytics.getDamage(owner.Id, 'round'), 5)).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const damagePoint = Math.min(room.Analytics.getDamage(event.fromId, 'round'), 5);
        await room.recover({
            toId: event.toIds[0],
            recoveredHp: damagePoint,
            recoverBy: event.fromId,
        });
        await room.drawCards(damagePoint, event.toIds[0], 'top', event.fromId, this.Name);
        return true;
    }
};
XiangShu = tslib_1.__decorate([
    skill_wrappers_1.LimitSkill({ name: 'xiangshu', description: 'xiangshu_description' })
], XiangShu);
exports.XiangShu = XiangShu;
