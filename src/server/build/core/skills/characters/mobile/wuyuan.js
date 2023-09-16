"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WuYuan = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let WuYuan = class WuYuan extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.getCardIds(0 /* HandArea */).length > 0;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash';
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds || !event.cardIds) {
            return false;
        }
        const { fromId } = event;
        await room.moveCards({
            movingCards: [{ card: event.cardIds[0], fromArea: 0 /* HandArea */ }],
            fromId,
            toId: event.toIds[0],
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            triggeredBySkills: [this.Name],
        });
        await room.recover({
            toId: fromId,
            recoveredHp: 1,
            recoverBy: fromId,
        });
        const cardGiven = engine_1.Sanguosha.getCardById(event.cardIds[0]);
        await room.drawCards(['thunder_slash', 'fire_slash'].includes(cardGiven.Name) ? 2 : 1, event.toIds[0], 'top', fromId, this.Name);
        if (cardGiven.isRed()) {
            await room.recover({
                toId: event.toIds[0],
                recoveredHp: 1,
                recoverBy: fromId,
            });
        }
        return true;
    }
};
WuYuan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'wuyuan', description: 'wuyuan_description' })
], WuYuan);
exports.WuYuan = WuYuan;
