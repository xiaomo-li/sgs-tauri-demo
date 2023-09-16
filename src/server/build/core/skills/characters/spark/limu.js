"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiMuShadow = exports.LiMu = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const skill_1 = require("core/skills/skill");
let LiMu = class LiMu extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return owner.canUseCardTo(room, card_1.VirtualCard.create({ cardName: 'lebusishu', cardSuit: 4 /* Diamond */, bySkill: this.Name }).Id, owner.Id);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    numberOfTargets() {
        return 0;
    }
    isAvailableTarget(owner, room, target) {
        return false;
    }
    isAvailableCard(owner, room, cardId) {
        return engine_1.Sanguosha.getCardById(cardId).Suit === 4 /* Diamond */;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, cardIds } = event;
        if (!cardIds) {
            return false;
        }
        await room.useCard({
            fromId,
            targetGroup: [[fromId]],
            cardId: card_1.VirtualCard.create({ cardName: 'lebusishu', bySkill: this.Name }, cardIds).Id,
        });
        await room.recover({
            toId: fromId,
            recoveredHp: 1,
            recoverBy: fromId,
        });
        return true;
    }
};
LiMu = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'limu', description: 'limu_description' })
], LiMu);
exports.LiMu = LiMu;
let LiMuShadow = class LiMuShadow extends skill_1.RulesBreakerSkill {
    breakCardUsableDistanceTo(cardId, room, owner, target) {
        if (owner.getCardIds(2 /* JudgeArea */).length > 0 && room.withinAttackDistance(owner, target)) {
            return game_props_1.INFINITE_DISTANCE;
        }
        else {
            return 0;
        }
    }
    breakCardUsableTimesTo(cardId, room, owner, target) {
        if (owner.getCardIds(2 /* JudgeArea */).length > 0 && room.withinAttackDistance(owner, target)) {
            return game_props_1.INFINITE_TRIGGERING_TIMES;
        }
        else {
            return 0;
        }
    }
};
LiMuShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: LiMu.Name, description: LiMu.Description })
], LiMuShadow);
exports.LiMuShadow = LiMuShadow;
