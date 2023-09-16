"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XingShang = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let XingShang = class XingShang extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PlayerDied" /* PlayerDied */;
    }
    canUse(room, owner, content) {
        const to = room.getPlayerById(content.playerId);
        return (!owner.Dead && owner.Id !== content.playerId && !(owner.Hp >= owner.MaxHp && to.getPlayerCards().length <= 0));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const { playerId } = triggeredOnEvent;
        const fromId = skillUseEvent.fromId;
        const dead = room.getPlayerById(playerId);
        const caopi = room.getPlayerById(fromId);
        if (dead.getPlayerCards().length <= 0) {
            await room.recover({
                recoveredHp: 1,
                toId: fromId,
                recoverBy: fromId,
            });
        }
        else if (caopi.Hp >= caopi.MaxHp) {
            const heritage = dead.getPlayerCards();
            await room.moveCards({
                movingCards: heritage.map(cardId => ({ card: cardId, fromArea: dead.cardFrom(cardId) })),
                fromId: playerId,
                moveReason: 1 /* ActivePrey */,
                toId: fromId,
                toArea: 0 /* HandArea */,
                proposer: fromId,
                movedByReason: this.Name,
            });
        }
        else {
            const askForOptionsEvent = {
                options: ['xingshang:recover', 'xingshang:pickup'],
                conversation: 'please choose',
                toId: fromId,
                triggeredBySkills: [this.Name],
            };
            room.notify(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForOptionsEvent), fromId);
            const response = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, fromId);
            response.selectedOption = response.selectedOption || 'xingshang:pickup';
            if (response.selectedOption === 'xingshang:recover') {
                await room.recover({
                    recoveredHp: 1,
                    toId: fromId,
                    recoverBy: fromId,
                });
            }
            else {
                const heritage = dead.getPlayerCards();
                await room.moveCards({
                    movingCards: heritage.map(cardId => ({ card: cardId, fromArea: dead.cardFrom(cardId) })),
                    fromId: playerId,
                    moveReason: 1 /* ActivePrey */,
                    toId: fromId,
                    toArea: 0 /* HandArea */,
                    proposer: fromId,
                    movedByReason: this.Name,
                });
            }
        }
        return true;
    }
};
XingShang = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'xingshang', description: 'xingshang_description' })
], XingShang);
exports.XingShang = XingShang;
