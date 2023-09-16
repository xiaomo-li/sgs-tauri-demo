"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PiaoLing = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let PiaoLing = class PiaoLing extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner) {
        return room.CurrentPlayerStage === 22 /* PhaseFinishStart */ && room.CurrentPlayer.Id === owner.Id;
    }
    async onTrigger(room, skillUseEvent) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId } = skillUseEvent;
        const judgeResult = await room.judge(fromId, undefined, this.Name);
        const card = engine_1.Sanguosha.getCardById(judgeResult.judgeCardId);
        if (card.Suit !== 2 /* Heart */) {
            return false;
        }
        const askForOptions = {
            toId: fromId,
            options: ['option-one', 'option-two'],
            conversation: '#piaoling-select',
            triggeredBySkills: [this.Name],
        };
        room.notify(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForOptions), fromId);
        const { selectedOption } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, fromId);
        const cards = [];
        if (card_1.Card.isVirtualCardId(judgeResult.judgeCardId)) {
            cards.push(...card.ActualCardIds);
        }
        else {
            cards.push(card.Id);
        }
        if (selectedOption === askForOptions.options[0]) {
            await room.moveCards({
                movingCards: cards.map(card => ({ card, fromArea: 4 /* DropStack */ })),
                moveReason: 2 /* ActiveMove */,
                toArea: 5 /* DrawStack */,
                movedByReason: this.Name,
            });
        }
        else {
            const askForPlayer = {
                toId: fromId,
                players: room.AlivePlayers.map(p => p.Id),
                conversation: 'piaoling: select a player to obtain the judge card',
                requiredAmount: 1,
                triggeredBySkills: [this.Name],
            };
            room.notify(167 /* AskForChoosingPlayerEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForPlayer), fromId);
            const { selectedPlayers } = await room.onReceivingAsyncResponseFrom(167 /* AskForChoosingPlayerEvent */, fromId);
            await room.moveCards({
                movingCards: cards.map(card => ({ card, fromArea: 4 /* DropStack */ })),
                moveReason: 2 /* ActiveMove */,
                toArea: 0 /* HandArea */,
                toId: selectedPlayers[0],
                movedByReason: this.Name,
            });
            if (fromId === selectedPlayers[0]) {
                const resp = await room.askForCardDrop(fromId, 1, [0 /* HandArea */, 1 /* EquipArea */], true, undefined, this.Name);
                resp.droppedCards.length > 0 &&
                    (await room.dropCards(4 /* SelfDrop */, resp.droppedCards, fromId, fromId, this.Name));
            }
        }
        return true;
    }
};
PiaoLing = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'piaoling', description: 'piaoling_description' })
], PiaoLing);
exports.PiaoLing = PiaoLing;
