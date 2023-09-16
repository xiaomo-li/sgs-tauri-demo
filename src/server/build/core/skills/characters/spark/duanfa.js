"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuanFaShadow = exports.DuanFa = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let DuanFa = class DuanFa extends skill_1.ActiveSkill {
    async whenObtainingSkill(room, player) {
        const num = room.Analytics.getCardDropRecord(player.Id, 'phase').reduce((sum, event) => {
            const infos = event.infos.filter(info => info.movedByReason === this.Name);
            for (const info of infos) {
                sum += info.movingCards.filter(card => !engine_1.Sanguosha.isVirtualCardId(card.card)).map(card => card.card).length;
            }
            return sum;
        }, 0);
        room.setFlag(player.Id, this.Name, num);
    }
    canUse(room, owner) {
        return owner.getPlayerCards().length > 0 && (owner.getFlag(this.Name) || 0) < owner.MaxHp;
    }
    numberOfTargets() {
        return 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length > 0 && cards.length <= owner.MaxHp - (owner.getFlag(this.Name) || 0);
    }
    isAvailableTarget(owner, room, target) {
        return false;
    }
    isAvailableCard(owner, room, cardId) {
        return engine_1.Sanguosha.getCardById(cardId).isBlack() && room.canDropCard(owner, cardId);
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, cardIds } = event;
        if (!cardIds) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
        const originalSum = room.getFlag(fromId, this.Name) || 0;
        room.setFlag(fromId, this.Name, originalSum + cardIds.length);
        await room.drawCards(cardIds.length, fromId, 'top', fromId, this.Name);
        return true;
    }
};
DuanFa = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'duanfa', description: 'duanfa_description' })
], DuanFa);
exports.DuanFa = DuanFa;
let DuanFaShadow = class DuanFaShadow extends skill_1.TriggerSkill {
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
        return (owner.Id === event.fromPlayer &&
            event.from === 4 /* PlayCardStage */ &&
            owner.getFlag(this.GeneralName) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, this.GeneralName);
        return true;
    }
};
DuanFaShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: DuanFa.Name, description: DuanFa.Description })
], DuanFaShadow);
exports.DuanFaShadow = DuanFaShadow;
