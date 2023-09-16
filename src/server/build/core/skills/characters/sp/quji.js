"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuJi = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let QuJi = class QuJi extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.LostHp > 0;
    }
    numberOfTargets() {
        return [];
    }
    targetFilter(room, owner, targets) {
        return targets.length > 0 && targets.length <= owner.LostHp;
    }
    isAvailableTarget(owner, room, target) {
        return room.getPlayerById(target).LostHp > 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === owner.LostHp;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds || !event.cardIds) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, event.cardIds, event.fromId, event.fromId, this.Name);
        for (const toId of event.toIds) {
            await room.recover({
                toId,
                recoveredHp: 1,
                recoverBy: event.fromId,
            });
        }
        event.cardIds.find(id => engine_1.Sanguosha.getCardById(id).isBlack()) && (await room.loseHp(event.fromId, 1));
        return true;
    }
};
QuJi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'quji', description: 'quji_description' })
], QuJi);
exports.QuJi = QuJi;
