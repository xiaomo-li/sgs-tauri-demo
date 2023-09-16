"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeiYang = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let FeiYang = class FeiYang extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    getPriority() {
        return 0 /* High */;
    }
    get Muted() {
        return true;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.playerId &&
            content.toStage === 7 /* JudgeStageStart */ &&
            owner.getCardIds(2 /* JudgeArea */).length > 0 &&
            owner.getCardIds(0 /* HandArea */).filter(id => room.canDropCard(owner.Id, id)).length >= 2);
    }
    async onTrigger(room, event) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId } = skillUseEvent;
        const response = await room.askForCardDrop(fromId, 2, [0 /* HandArea */], false, undefined, this.Name);
        if (response.droppedCards.length > 0) {
            await room.dropCards(4 /* SelfDrop */, response.droppedCards, fromId, fromId, this.Name);
            const from = room.getPlayerById(fromId);
            const askForChoosingCard = {
                toId: fromId,
                amount: 1,
                customCardFields: {
                    [2 /* JudgeArea */]: from.getCardIds(2 /* JudgeArea */),
                },
                customTitle: 'please drop a judge card',
                triggeredBySkills: [this.Name],
            };
            room.notify(165 /* AskForChoosingCardEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForChoosingCard), fromId);
            const { selectedCards } = await room.onReceivingAsyncResponseFrom(165 /* AskForChoosingCardEvent */, fromId);
            await room.moveCards({
                movingCards: [
                    {
                        fromArea: 2 /* JudgeArea */,
                        card: selectedCards[0],
                    },
                ],
                fromId,
                moveReason: 2 /* ActiveMove */,
                toArea: 4 /* DropStack */,
                movedByReason: this.Name,
            });
        }
        return true;
    }
};
FeiYang = tslib_1.__decorate([
    skill_wrappers_1.PersistentSkill({ stubbornSkill: true }),
    skill_wrappers_1.CommonSkill({ name: 'feiyang', description: 'feiyang_description' })
], FeiYang);
exports.FeiYang = FeiYang;
