"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoXi = void 0;
const tslib_1 = require("tslib");
const algorithm_1 = require("core/shares/libs/algorithm");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let PoXi = class PoXi extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    cardFilter() {
        return true;
    }
    isAvailableCard() {
        return false;
    }
    numberOfTargets() {
        return 1;
    }
    targetFilter(room, owner, targets) {
        return targets.length === 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner && room.getPlayerById(target).getCardIds(0 /* HandArea */).length > 0;
    }
    whenRefresh(room, owner) {
        if (owner.getFlag(this.Name)) {
            owner.removeFlag(this.Name);
            room.syncGameCommonRules(owner.Id, from => {
                room.CommonRules.addAdditionalHoldCardNumber(from, 1);
            });
        }
    }
    async onUse() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, toIds } = skillUseEvent;
        const from = room.getPlayerById(fromId);
        const to = room.getPlayerById(toIds[0]);
        const askForCards = {
            toId: to.Id,
            cardFilter: 1 /* PoXi */,
            customCardFields: {
                [from.Character.Name]: from.getCardIds(0 /* HandArea */),
                [to.Character.Name]: to.getCardIds(0 /* HandArea */).filter(id => room.canDropCard(fromId, id)),
            },
            customTitle: this.Name,
            amount: 4,
            triggeredBySkills: [this.Name],
        };
        room.notify(166 /* AskForChoosingCardWithConditionsEvent */, askForCards, from.Id);
        const { selectedCards } = await room.onReceivingAsyncResponseFrom(166 /* AskForChoosingCardWithConditionsEvent */, from.Id);
        if (!selectedCards) {
            return false;
        }
        const fromCards = algorithm_1.Algorithm.intersection(from.getCardIds(0 /* HandArea */), selectedCards);
        const toCards = algorithm_1.Algorithm.intersection(to.getCardIds(0 /* HandArea */), selectedCards);
        await room.moveCards({
            moveReason: 4 /* SelfDrop */,
            fromId: from.Id,
            movingCards: fromCards.map(card => ({ card, fromArea: 0 /* HandArea */ })),
            movedByReason: this.Name,
            toArea: 4 /* DropStack */,
        }, {
            moveReason: 5 /* PassiveDrop */,
            fromId: to.Id,
            movingCards: toCards.map(card => ({ card, fromArea: 0 /* HandArea */ })),
            movedByReason: this.Name,
            toArea: 4 /* DropStack */,
        });
        if (fromCards.length === 0) {
            await room.changeMaxHp(from.Id, -1);
        }
        else if (fromCards.length === 1) {
            from.setFlag(this.Name, true);
            room.syncGameCommonRules(from.Id, from => {
                room.CommonRules.addAdditionalHoldCardNumber(from, -1);
            });
            room.endPhase(4 /* PlayCardStage */);
        }
        else if (fromCards.length === 3 && from.isInjured()) {
            await room.recover({
                toId: from.Id,
                recoveredHp: 1,
                recoverBy: from.Id,
            });
        }
        else if (fromCards.length === 4) {
            await room.drawCards(4, from.Id, undefined, from.Id, this.Name);
        }
        return true;
    }
};
PoXi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'poxi', description: 'poxi_description' })
], PoXi);
exports.PoXi = PoXi;
