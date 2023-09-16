"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TianXiang = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let TianXiang = class TianXiang extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "DamagedEffect" /* DamagedEffect */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.toId && owner.getCardIds(0 /* HandArea */).length > 0;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target;
    }
    targetFilter(room, owner, targets) {
        return targets.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return engine_1.Sanguosha.getCardById(cardId).Suit === 2 /* Heart */ && room.canDropCard(owner, cardId);
    }
    availableCardAreas() {
        return [0 /* HandArea */, 1 /* EquipArea */];
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent, fromId, cardIds, toIds } = skillUseEvent;
        await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
        const damageEvent = triggeredOnEvent;
        event_packer_1.EventPacker.terminate(damageEvent);
        const chooseOptions = {
            options: ['option-one', 'option-two'],
            toId: fromId,
            conversation: 'please choose tianxiang options',
            triggeredBySkills: [this.Name],
        };
        room.notify(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent(chooseOptions), fromId);
        const response = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, fromId);
        if (response.selectedOption === 'option-one') {
            await room.damage({
                toId: toIds[0],
                damage: 1,
                damageType: "normal_property" /* Normal */,
                triggeredBySkills: [this.Name],
            });
            const to = room.getPlayerById(toIds[0]);
            await room.drawCards(Math.min(to.LostHp, 5), to.Id, undefined, undefined, this.Name);
        }
        else {
            await room.loseHp(toIds[0], 1);
            let droppedCardIds = cardIds;
            if (card_1.Card.isVirtualCardId(droppedCardIds[0])) {
                droppedCardIds = engine_1.Sanguosha.getCardById(droppedCardIds[0]).ActualCardIds;
            }
            for (const cardId of droppedCardIds) {
                if (room.isCardInDropStack(cardId)) {
                    await room.moveCards({
                        movingCards: [{ card: cardId, fromArea: 4 /* DropStack */ }],
                        toId: toIds[0],
                        toArea: 0 /* HandArea */,
                        moveReason: 3 /* PassiveMove */,
                        proposer: fromId,
                        movedByReason: this.Name,
                    });
                }
            }
        }
        return true;
    }
};
TianXiang = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'tianxiang', description: 'tianxiang_description' })
], TianXiang);
exports.TianXiang = TianXiang;
