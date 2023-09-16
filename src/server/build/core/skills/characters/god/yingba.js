"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YingBaShadow = exports.YingBa = void 0;
const tslib_1 = require("tslib");
const game_props_1 = require("core/game/game_props");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let YingBa = class YingBa extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return room.getPlayerById(target).MaxHp > 1 && owner !== target;
    }
    isAvailableCard() {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const toId = event.toIds[0];
        await room.changeMaxHp(toId, -1);
        room.addMark(toId, "pingding" /* PingDing */, 1);
        await room.changeMaxHp(event.fromId, -1);
        return true;
    }
};
YingBa = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'yingba', description: 'yingba_description' })
], YingBa);
exports.YingBa = YingBa;
let YingBaShadow = class YingBaShadow extends skill_1.RulesBreakerSkill {
    breakCardUsableDistanceTo(cardId, room, owner, target) {
        if (target.getMark("pingding" /* PingDing */) > 0) {
            return game_props_1.INFINITE_DISTANCE;
        }
        else {
            return 0;
        }
    }
};
YingBaShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: YingBa.Name, description: YingBa.Description })
], YingBaShadow);
exports.YingBaShadow = YingBaShadow;
