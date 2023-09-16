"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XueYiBuff = exports.XueYiShadow = exports.XueYi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
let XueYi = class XueYi extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(content, stage) {
        return stage === "GameStarting" /* GameStarting */;
    }
    canUse(room, owner, content) {
        return room.getAlivePlayersFrom().filter(player => player.Nationality === 3 /* Qun */).length > 0;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const allies = room.getAlivePlayersFrom().filter(player => player.Nationality === 3 /* Qun */).length;
        allies > 0 && room.setMark(event.fromId, "xueyi" /* XueYi */, allies);
        return true;
    }
};
XueYi = tslib_1.__decorate([
    skill_1.LordSkill,
    skill_1.CommonSkill({ name: 'xueyi', description: 'xueyi_description' })
], XueYi);
exports.XueYi = XueYi;
let XueYiShadow = class XueYiShadow extends skill_1.TriggerSkill {
    isTriggerable(content, stage) {
        return content.to === 0 /* PhaseBegin */ && stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.toPlayer && owner.getMark("xueyi" /* XueYi */) > 0;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        room.addMark(fromId, "xueyi" /* XueYi */, -1);
        await room.drawCards(1, fromId, 'top', fromId, this.Name);
        return true;
    }
};
XueYiShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.LordSkill,
    skill_1.CommonSkill({ name: XueYi.GeneralName, description: XueYi.Description })
], XueYiShadow);
exports.XueYiShadow = XueYiShadow;
let XueYiBuff = class XueYiBuff extends skill_1.RulesBreakerSkill {
    breakAdditionalCardHoldNumber(room, owner) {
        return owner.getMark("xueyi" /* XueYi */) * 2;
    }
};
XueYiBuff = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.LordSkill,
    skill_1.CommonSkill({ name: XueYiShadow.Name, description: XueYiShadow.Description })
], XueYiBuff);
exports.XueYiBuff = XueYiBuff;
