"use strict";
var JiangChi_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiangChiRemove = exports.JiangChiBlock = exports.JiangChiExtra = exports.JiangChi = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const skill_1 = require("core/skills/skill");
let JiangChi = JiangChi_1 = class JiangChi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.playerId && 13 /* PlayCardStageStart */ === content.toStage;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const options = ['jiangchi:draw2', 'jiangchi:draw1', 'jiangchi:drop'];
        if (room
            .getPlayerById(skillUseEvent.fromId)
            .getPlayerCards()
            .filter(id => room.canDropCard(skillUseEvent.fromId, id)).length === 0) {
            options.pop();
        }
        const askForChooseOptionsEvent = {
            options,
            toId: skillUseEvent.fromId,
            conversation: 'please choose jiangchi options',
            triggeredBySkills: [this.Name],
        };
        room.notify(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForChooseOptionsEvent), skillUseEvent.fromId);
        const response = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, skillUseEvent.fromId);
        response.selectedOption = response.selectedOption || options[1];
        if (response.selectedOption === options[0]) {
            await room.drawCards(2, skillUseEvent.fromId, 'top', skillUseEvent.fromId, this.Name);
            room.setFlag(skillUseEvent.fromId, this.Name, JiangChi_1.BlockFlag);
        }
        else if (response.selectedOption === options[1]) {
            await room.drawCards(1, skillUseEvent.fromId, 'top', skillUseEvent.fromId, this.Name);
        }
        else {
            const response = await room.askForCardDrop(skillUseEvent.fromId, 1, [0 /* HandArea */, 1 /* EquipArea */], true, undefined, this.Name);
            if (response.droppedCards.length > 0) {
                await room.dropCards(4 /* SelfDrop */, response.droppedCards, skillUseEvent.fromId, skillUseEvent.fromId, this.Name);
                room.setFlag(skillUseEvent.fromId, this.Name, JiangChi_1.ExtraFlag);
            }
        }
        return true;
    }
};
JiangChi.ExtraFlag = 'jiangchi_extra';
JiangChi.BlockFlag = 'jiangchi_block';
JiangChi = JiangChi_1 = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'jiangchi', description: 'jiangchi_description' })
], JiangChi);
exports.JiangChi = JiangChi;
let JiangChiExtra = class JiangChiExtra extends skill_1.RulesBreakerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    breakCardUsableDistance(cardId, room, owner) {
        if (room.getFlag(owner.Id, this.GeneralName) !== JiangChi.ExtraFlag) {
            return 0;
        }
        let match = false;
        if (cardId instanceof card_matcher_1.CardMatcher) {
            match = cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] }));
        }
        else {
            match = engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash';
        }
        if (match) {
            return game_props_1.INFINITE_DISTANCE;
        }
        else {
            return 0;
        }
    }
    breakCardUsableTimes(cardId, room, owner) {
        if (room.getFlag(owner.Id, this.GeneralName) !== JiangChi.ExtraFlag) {
            return 0;
        }
        let match = false;
        if (cardId instanceof card_matcher_1.CardMatcher) {
            match = cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] }));
        }
        else {
            match = engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash';
        }
        if (match) {
            return 1;
        }
        else {
            return 0;
        }
    }
};
JiangChiExtra = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: JiangChi.Name, description: JiangChi.Description })
], JiangChiExtra);
exports.JiangChiExtra = JiangChiExtra;
let JiangChiBlock = class JiangChiBlock extends skill_1.FilterSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUseCard(cardId, room, owner) {
        if (room.getFlag(owner, this.GeneralName) !== JiangChi.BlockFlag) {
            return true;
        }
        return cardId instanceof card_matcher_1.CardMatcher
            ? !cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] }))
            : engine_1.Sanguosha.getCardById(cardId).GeneralName !== 'slash';
    }
};
JiangChiBlock = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: JiangChiExtra.Name, description: JiangChiExtra.Description })
], JiangChiBlock);
exports.JiangChiBlock = JiangChiBlock;
let JiangChiRemove = class JiangChiRemove extends skill_1.TriggerSkill {
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
JiangChiRemove = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: JiangChiBlock.Name, description: JiangChiBlock.Description })
], JiangChiRemove);
exports.JiangChiRemove = JiangChiRemove;
