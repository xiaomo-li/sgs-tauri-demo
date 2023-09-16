"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZiYuan = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ZiYuan = class ZiYuan extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.getPlayerCards().length > 0;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target;
    }
    cardFilter(room, owner, cards) {
        return (cards.length > 0 && cards.reduce((sum, id) => (sum += engine_1.Sanguosha.getCardById(id).CardNumber), 0) === 13);
    }
    isAvailableCard(owner, room, cardId, selectedCards) {
        if (selectedCards.length > 0) {
            return (engine_1.Sanguosha.getCardById(cardId).CardNumber <=
                13 - selectedCards.reduce((sum, id) => (sum += engine_1.Sanguosha.getCardById(id).CardNumber), 0));
        }
        return engine_1.Sanguosha.getCardById(cardId).CardNumber <= 13;
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds, cardIds } = event;
        if (!toIds || !cardIds) {
            return false;
        }
        await room.moveCards({
            movingCards: cardIds.map(card => ({ card, fromArea: 0 /* HandArea */ })),
            fromId,
            toId: toIds[0],
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: fromId,
            triggeredBySkills: [this.Name],
        });
        await room.recover({
            toId: toIds[0],
            recoveredHp: 1,
            recoverBy: fromId,
        });
        return true;
    }
};
ZiYuan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'ziyuan', description: 'ziyuan_description' })
], ZiYuan);
exports.ZiYuan = ZiYuan;
