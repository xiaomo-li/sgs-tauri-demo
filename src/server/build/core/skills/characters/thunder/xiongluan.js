"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XiongLuanDeBuff = exports.XiongLuanBuff = exports.XiongLuanShadow = exports.XiongLuan = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const game_props_1 = require("core/game/game_props");
const skill_1 = require("core/skills/skill");
let XiongLuan = class XiongLuan extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return owner.AvailableEquipSections.length > 0 && !owner.judgeAreaDisabled();
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target;
    }
    isAvailableCard(owner, room, cardId) {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        const from = room.getPlayerById(fromId);
        const equipSections = from.AvailableEquipSections;
        if (equipSections.length > 0) {
            await room.abortPlayerEquipSections(fromId, ...equipSections);
        }
        if (!from.judgeAreaDisabled()) {
            await room.abortPlayerJudgeArea(fromId);
        }
        room.setFlag(toIds[0], this.Name, fromId, this.Name);
        from.setFlag(XiongLuanShadow.Name, true);
        await room.obtainSkill(toIds[0], XiongLuanDeBuff.Name);
        return true;
    }
};
XiongLuan = tslib_1.__decorate([
    skill_1.LimitSkill({ name: 'xiongluan', description: 'xiongluan_description' })
], XiongLuan);
exports.XiongLuan = XiongLuan;
let XiongLuanShadow = class XiongLuanShadow extends skill_1.TriggerSkill {
    afterDead(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
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
        return (owner.Id === event.fromPlayer && event.from === 4 /* PlayCardStage */ && owner.getFlag(this.Name));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, this.Name);
        for (const other of room.getOtherPlayers(event.fromId)) {
            if (room.getFlag(other.Id, this.GeneralName)) {
                room.removeFlag(other.Id, this.GeneralName);
                if (other.hasShadowSkill(XiongLuanDeBuff.Name)) {
                    await room.loseSkill(other.Id, XiongLuanDeBuff.Name);
                }
            }
        }
        return true;
    }
};
XiongLuanShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: XiongLuan.Name, description: XiongLuan.Description })
], XiongLuanShadow);
exports.XiongLuanShadow = XiongLuanShadow;
let XiongLuanBuff = class XiongLuanBuff extends skill_1.RulesBreakerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    breakCardUsableDistanceTo(cardId, room, owner, target) {
        if (target.getFlag(this.GeneralName) === owner.Id) {
            return game_props_1.INFINITE_DISTANCE;
        }
        else {
            return 0;
        }
    }
    breakCardUsableTimesTo(cardId, room, owner, target) {
        if (target.getFlag(this.GeneralName) === owner.Id) {
            return game_props_1.INFINITE_TRIGGERING_TIMES;
        }
        else {
            return 0;
        }
    }
};
XiongLuanBuff = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: XiongLuanShadow.Name, description: XiongLuanShadow.Description })
], XiongLuanBuff);
exports.XiongLuanBuff = XiongLuanBuff;
let XiongLuanDeBuff = class XiongLuanDeBuff extends skill_1.FilterSkill {
    canUseCard(cardId, room, owner) {
        return cardId instanceof card_matcher_1.CardMatcher
            ? true
            : room.getPlayerById(owner).cardFrom(cardId) !== 0 /* HandArea */;
    }
};
XiongLuanDeBuff = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: 's_xiongluan_debuff', description: 's_xiongluan_debuff_description' })
], XiongLuanDeBuff);
exports.XiongLuanDeBuff = XiongLuanDeBuff;
