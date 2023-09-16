"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaiYi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let BaiYi = class BaiYi extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return owner.LostHp > 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    numberOfTargets() {
        return 2;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    isAvailableCard() {
        return false;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const firstPosition = room.getPlayerById(event.toIds[0]).Position;
        const secondPosition = room.getPlayerById(event.toIds[1]).Position;
        room.changePlayerProperties({
            changedProperties: [
                { toId: event.toIds[0], playerPosition: secondPosition },
                { toId: event.toIds[1], playerPosition: firstPosition },
            ],
        });
        return true;
    }
};
BaiYi = tslib_1.__decorate([
    skill_wrappers_1.LimitSkill({ name: 'baiyi', description: 'baiyi_description' })
], BaiYi);
exports.BaiYi = BaiYi;
