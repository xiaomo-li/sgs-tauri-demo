"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileYiZhengDebuff = exports.MobileYiZheng = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let MobileYiZheng = class MobileYiZheng extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.getCardIds(0 /* HandArea */).length > 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return room.getPlayerById(owner).Hp >= room.getPlayerById(target).Hp && room.canPindian(owner, target);
    }
    isAvailableCard() {
        return false;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        const pindianReport = await room.pindian(fromId, toIds, this.Name);
        if (pindianReport.pindianRecord[0].winner === fromId) {
            room.getFlag(toIds[0], this.Name) || room.setFlag(toIds[0], this.Name, true, this.Name);
            room.getPlayerById(toIds[0]).hasShadowSkill(MobileYiZhengDebuff.Name) ||
                (await room.obtainSkill(toIds[0], MobileYiZhengDebuff.Name));
        }
        else {
            await room.changeMaxHp(fromId, -1);
        }
        return true;
    }
};
MobileYiZheng = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'mobile_yizheng', description: 'mobile_yizheng_description' })
], MobileYiZheng);
exports.MobileYiZheng = MobileYiZheng;
let MobileYiZhengDebuff = class MobileYiZhengDebuff extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    canUse(room, owner, content) {
        return content.toPlayer === owner.Id && content.to === 3 /* DrawCardStage */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, MobileYiZheng.Name);
        await room.skip(event.fromId, 3 /* DrawCardStage */);
        await room.loseSkill(event.fromId, this.Name);
        return true;
    }
};
MobileYiZhengDebuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_myizheng_debuff', description: 's_myizheng_debuff_description' })
], MobileYiZhengDebuff);
exports.MobileYiZhengDebuff = MobileYiZhengDebuff;
