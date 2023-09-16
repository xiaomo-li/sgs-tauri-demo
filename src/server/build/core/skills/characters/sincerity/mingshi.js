"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MingShi = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let MingShi = class MingShi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        return (content.toId === owner.Id &&
            content.fromId !== undefined &&
            owner.getMark("qian" /* Qian */) > 0 &&
            !room.getPlayerById(content.fromId).Dead &&
            room.getPlayerById(content.fromId).getPlayerCards().length > 0);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { triggeredOnEvent } = event;
        const source = triggeredOnEvent.fromId;
        const sourcePlayer = room.getPlayerById(source);
        const options = {
            [2 /* JudgeArea */]: sourcePlayer.getCardIds(2 /* JudgeArea */),
            [1 /* EquipArea */]: sourcePlayer.getCardIds(1 /* EquipArea */),
            [0 /* HandArea */]: sourcePlayer.getCardIds(0 /* HandArea */),
        };
        const chooseCardEvent = {
            fromId: source,
            toId: source,
            options,
            triggeredBySkills: [this.Name],
        };
        const response = await room.askForChoosingPlayerCard(chooseCardEvent, source, true, true);
        if (!response) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, [response.selectedCard], source, source, this.Name);
        if (engine_1.Sanguosha.getCardById(response.selectedCard).isBlack() && room.isCardInDropStack(response.selectedCard)) {
            await room.moveCards({
                movingCards: [{ card: response.selectedCard, fromArea: 4 /* DropStack */ }],
                toId: event.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: event.fromId,
                triggeredBySkills: [this.Name],
            });
        }
        else if (engine_1.Sanguosha.getCardById(response.selectedCard).isRed()) {
            await room.recover({
                toId: event.fromId,
                recoveredHp: 1,
                recoverBy: event.fromId,
            });
        }
        return true;
    }
};
MingShi = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'mingshi', description: 'mingshi_description' })
], MingShi);
exports.MingShi = MingShi;
