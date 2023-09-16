"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhuangDanShadow = exports.ZhuangDan = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ZhuangDan = class ZhuangDan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        return (content.fromPlayer !== owner.Id &&
            content.from === 6 /* FinishStage */ &&
            !room
                .getOtherPlayers(owner.Id)
                .find(player => player.getCardIds(0 /* HandArea */).length >= owner.getCardIds(0 /* HandArea */).length));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.setFlag(event.fromId, this.Name, true);
        return true;
    }
};
ZhuangDan = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'zhuangdan', description: 'zhuangdan_description' })
], ZhuangDan);
exports.ZhuangDan = ZhuangDan;
let ZhuangDanShadow = class ZhuangDanShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        return (owner.Id === event.fromPlayer &&
            event.from === 7 /* PhaseFinish */ &&
            owner.getFlag(this.GeneralName) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, this.GeneralName);
        return true;
    }
};
ZhuangDanShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: ZhuangDan.Name, description: ZhuangDan.Description })
], ZhuangDanShadow);
exports.ZhuangDanShadow = ZhuangDanShadow;
