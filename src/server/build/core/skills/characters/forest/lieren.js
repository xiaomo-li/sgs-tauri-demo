"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LieRen = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let LieRen = class LieRen extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterAim" /* AfterAim */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.fromId &&
            room.getPlayerById(content.fromId).getCardIds(0 /* HandArea */).length > 0 &&
            content.byCardId !== undefined &&
            engine_1.Sanguosha.getCardById(content.byCardId).GeneralName === 'slash' &&
            owner.Id !== content.toId &&
            room.getPlayerById(content.toId).getCardIds(0 /* HandArea */).length > 0 &&
            room.canPindian(owner.Id, content.toId));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const aimEvent = triggeredOnEvent;
        const { toId } = aimEvent;
        const toIds = [toId];
        const { pindianCardId, pindianRecord } = await room.pindian(fromId, toIds, this.Name);
        if (!pindianRecord.length) {
            return false;
        }
        if (pindianRecord[0].winner === fromId) {
            const to = room.getPlayerById(toId);
            if (to.getPlayerCards().length > 0) {
                const options = {
                    [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
                    [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
                };
                const chooseCardEvent = {
                    fromId,
                    toId,
                    options,
                    triggeredBySkills: [this.Name],
                };
                const response = await room.askForChoosingPlayerCard(chooseCardEvent, fromId, false, true);
                if (!response) {
                    return false;
                }
                await room.moveCards({
                    movingCards: [{ card: response.selectedCard, fromArea: response.fromArea }],
                    fromId: chooseCardEvent.toId,
                    toId: chooseCardEvent.fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 1 /* ActivePrey */,
                    proposer: chooseCardEvent.fromId,
                    movedByReason: this.Name,
                });
            }
        }
        else {
            const playerIds = [fromId, toId];
            room.sortPlayersByPosition(playerIds);
            const moveInfos = [];
            for (const playerId of playerIds) {
                const cardId = fromId === playerId ? pindianCardId : pindianRecord[0].cardId;
                if (cardId && room.isCardInDropStack(cardId)) {
                    moveInfos.push({
                        movingCards: [{ card: cardId, fromArea: 4 /* DropStack */ }],
                        toId: playerIds.filter(id => id !== playerId)[0],
                        toArea: 0 /* HandArea */,
                        moveReason: 1 /* ActivePrey */,
                        proposer: playerId,
                        movedByReason: this.Name,
                    });
                }
            }
            await room.moveCards(...moveInfos);
        }
        return true;
    }
};
LieRen = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'lieren', description: 'lieren_description' })
], LieRen);
exports.LieRen = LieRen;
