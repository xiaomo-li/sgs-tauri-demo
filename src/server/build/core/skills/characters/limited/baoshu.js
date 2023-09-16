"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaoShuBuff = exports.BaoShu = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let BaoShu = class BaoShu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && content.toStage === 3 /* PrepareStageStart */;
    }
    targetFilter(room, owner, targets) {
        return targets.length > 0 && targets.length <= owner.MaxHp;
    }
    isAvailableTarget() {
        return true;
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose at most {1} target(s) to gain ‘Shu’ marks each?', this.Name, owner.MaxHp).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const markNum = room.getPlayerById(event.fromId).MaxHp + 1 - event.toIds.length;
        for (const toId of event.toIds) {
            room.addMark(toId, "mark_shu" /* Shu */, markNum);
            room.getPlayerById(toId).hasShadowSkill(BaoShuBuff.Name) || (await room.obtainSkill(toId, BaoShuBuff.Name));
        }
        return true;
    }
};
BaoShu = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'baoshu', description: 'baoshu_description' })
], BaoShu);
exports.BaoShu = BaoShu;
let BaoShuBuff = class BaoShuBuff extends skill_1.TriggerSkill {
    async whenDead(room, player) {
        await room.loseSkill(player.Id, this.Name);
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "CardDrawing" /* CardDrawing */;
    }
    canUse(room, owner, content) {
        return content.fromId === owner.Id && content.bySpecialReason === 0 /* GameStage */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (room.getMark(event.fromId, "mark_shu" /* Shu */) > 0) {
            event.triggeredOnEvent.drawAmount += room.getMark(event.fromId, "mark_shu" /* Shu */);
            room.removeMark(event.fromId, "mark_shu" /* Shu */);
        }
        await room.loseSkill(event.fromId, this.Name);
        return true;
    }
};
BaoShuBuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_baoshu_buff', description: 's_baoshu_buff_description' })
], BaoShuBuff);
exports.BaoShuBuff = BaoShuBuff;
