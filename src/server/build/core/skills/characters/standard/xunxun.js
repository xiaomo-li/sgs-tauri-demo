"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XunXun = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
let XunXun = class XunXun extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterStageChanged" /* AfterStageChanged */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && content.toStage === 10 /* DrawCardStageStart */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const cards = room.getCards(4, 'top');
        const askForChooseCards = {
            toId: skillUseEvent.fromId,
            cardIds: cards,
            top: 4,
            topStackName: 'draw stack bottom',
            bottom: 2,
            bottomStackName: 'draw stack top',
            bottomMaxCard: 2,
            bottomMinCard: 2,
            movable: true,
            triggeredBySkills: [this.Name],
        };
        room.notify(172 /* AskForPlaceCardsInDileEvent */, askForChooseCards, skillUseEvent.fromId);
        const { top, bottom } = await room.onReceivingAsyncResponseFrom(172 /* AskForPlaceCardsInDileEvent */, skillUseEvent.fromId);
        room.putCards('top', ...bottom);
        room.putCards('bottom', ...top);
        return true;
    }
};
XunXun = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'xunxun', description: 'xunxun_description' })
], XunXun);
exports.XunXun = XunXun;
