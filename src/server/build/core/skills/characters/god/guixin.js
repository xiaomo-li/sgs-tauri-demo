"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuiXin = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
let GuiXin = class GuiXin extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.toId;
    }
    triggerableTimes(event) {
        return event.damage;
    }
    async onTrigger() {
        return true;
    }
    async doGuiXin(room, caocao) {
        for (const player of room.getOtherPlayers(caocao)) {
            const options = {};
            if (player.getCardIds(0 /* HandArea */).length > 0) {
                options[0 /* HandArea */] = player.getCardIds(0 /* HandArea */).length;
            }
            if (player.getCardIds(1 /* EquipArea */).length > 0) {
                options[1 /* EquipArea */] = player.getCardIds(1 /* EquipArea */);
            }
            if (player.getCardIds(2 /* JudgeArea */).length > 0) {
                options[2 /* JudgeArea */] = player.getCardIds(2 /* JudgeArea */);
            }
            if (Object.keys(options).length === 0) {
                continue;
            }
            const chooseCardEvent = {
                options,
                fromId: caocao,
                toId: player.Id,
                triggeredBySkills: [this.Name],
            };
            room.notify(170 /* AskForChoosingCardFromPlayerEvent */, event_packer_1.EventPacker.createUncancellableEvent(chooseCardEvent), caocao);
            const { selectedCard, selectedCardIndex, fromArea } = await room.onReceivingAsyncResponseFrom(170 /* AskForChoosingCardFromPlayerEvent */, caocao);
            const moveCard = selectedCard !== undefined ? selectedCard : player.getCardIds(0 /* HandArea */)[selectedCardIndex];
            await room.moveCards({
                movingCards: [{ card: moveCard, fromArea }],
                fromId: player.Id,
                toId: caocao,
                moveReason: 1 /* ActivePrey */,
                toArea: 0 /* HandArea */,
                proposer: caocao,
                movedByReason: this.Name,
            });
        }
        await room.turnOver(caocao);
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const { toId } = triggeredOnEvent;
        await this.doGuiXin(room, toId);
        return true;
    }
};
GuiXin = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'guixin', description: 'guixin_description' })
], GuiXin);
exports.GuiXin = GuiXin;
