"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuaiRou = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let HuaiRou = class HuaiRou extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return owner.getPlayerCards().length > 0;
    }
    numberOfTargets() {
        return 0;
    }
    isAvailableTarget(owner, room, target) {
        return false;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return engine_1.Sanguosha.getCardById(cardId).is(1 /* Equip */);
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, cardIds } = event;
        if (!cardIds) {
            return false;
        }
        await room.reforge(cardIds[0], room.getPlayerById(fromId));
        return true;
    }
};
HuaiRou = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'huairou', description: 'huairou_description' })
], HuaiRou);
exports.HuaiRou = HuaiRou;
