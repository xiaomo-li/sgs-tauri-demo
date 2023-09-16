"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TunJun = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const lveming_1 = require("./lveming");
let TunJun = class TunJun extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return (owner.getFlag(lveming_1.LveMing.Name) || 0) > 0;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return room.getPlayerById(target).getEmptyEquipSections().length > 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableCard() {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { toIds } = event;
        if (!toIds) {
            return false;
        }
        const times = room.getFlag(event.fromId, lveming_1.LveMing.Name);
        const emptyEquipSections = room.getPlayerById(toIds[0]).getEmptyEquipSections();
        let usedNum = 0;
        for (let i = 0; i < times; i++) {
            const equips = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ type: [emptyEquipSections[i]] }));
            if (equips.length === 0) {
                continue;
            }
            const randomEquip = equips[Math.floor(Math.random() * equips.length)];
            if (room.getPlayerById(toIds[0]).canUseCardTo(room, randomEquip, toIds[0])) {
                await room.useCard({
                    fromId: toIds[0],
                    targetGroup: [[toIds[0]]],
                    cardId: randomEquip,
                    customFromArea: 5 /* DrawStack */,
                });
                if (usedNum++ === times) {
                    break;
                }
            }
        }
        return true;
    }
};
TunJun = tslib_1.__decorate([
    skill_wrappers_1.LimitSkill({ name: 'tunjun', description: 'tunjun_description' })
], TunJun);
exports.TunJun = TunJun;
