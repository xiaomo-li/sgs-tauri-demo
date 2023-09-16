"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiaoBianSkipPlay = exports.QiaoBianSkipDraw = exports.QiaoBian = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const functional_1 = require("core/shares/libs/functional");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let QiaoBian = class QiaoBian extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return (stage === "AfterPhaseChanged" /* AfterPhaseChanged */ &&
            [
                2 /* JudgeStage */,
                3 /* DrawCardStage */,
                4 /* PlayCardStage */,
                5 /* DropCardStage */,
            ].includes(event.to));
    }
    canUse(room, owner, content) {
        if (content.toPlayer !== owner.Id) {
            return false;
        }
        return owner.getCardIds(0 /* HandArea */).length > 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to drop a hand card to skip {1} ?', this.Name, functional_1.Functional.getPlayerPhaseRawText(event.to)).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent, fromId, cardIds } = skillUseEvent;
        const phaseChangeEvent = triggeredOnEvent;
        if (!cardIds || cardIds.length < 1) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
        const from = room.getPlayerById(fromId);
        from.setFlag(this.Name, true);
        await room.skip(fromId, phaseChangeEvent.to);
        from.removeFlag(this.Name);
        return true;
    }
};
QiaoBian = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'qiaobian', description: 'qiaobian_description' })
], QiaoBian);
exports.QiaoBian = QiaoBian;
let QiaoBianSkipDraw = class QiaoBianSkipDraw extends skill_1.TriggerSkill {
    isTriggerable(event) {
        return (event_packer_1.EventPacker.getIdentifier(event) === 154 /* PhaseSkippedEvent */ &&
            event.skippedPhase === 3 /* DrawCardStage */);
    }
    canUse(room, owner, content) {
        return owner.Id === content.playerId && owner.getFlag(this.GeneralName) === true;
    }
    get Priority() {
        return 2 /* Low */;
    }
    targetFilter(room, owner, targets) {
        return targets.length >= 1 && targets.length <= 2;
    }
    isAvailableTarget(owner, room, target) {
        const to = room.getPlayerById(target);
        return target !== owner && to.getCardIds(0 /* HandArea */).length > 0;
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose one or two targets to obtain a hand card from each of them', this.GeneralName).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, toIds } = skillUseEvent;
        for (const toId of toIds) {
            const cardIds = room.getPlayerById(toId).getCardIds(0 /* HandArea */);
            const askForChoosingCard = {
                fromId,
                toId,
                options: {
                    [0 /* HandArea */]: cardIds.length,
                },
                triggeredBySkills: [this.GeneralName],
            };
            room.notify(170 /* AskForChoosingCardFromPlayerEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForChoosingCard), fromId);
            let { selectedCard } = await room.onReceivingAsyncResponseFrom(170 /* AskForChoosingCardFromPlayerEvent */, fromId);
            selectedCard = selectedCard !== undefined ? selectedCard : cardIds[Math.floor(Math.random() * cardIds.length)];
            await room.moveCards({
                movingCards: [{ card: selectedCard, fromArea: 0 /* HandArea */ }],
                fromId: toId,
                toId: fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: fromId,
                movedByReason: this.GeneralName,
            });
        }
        return true;
    }
};
QiaoBianSkipDraw = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: QiaoBian.Name, description: QiaoBian.Description })
], QiaoBianSkipDraw);
exports.QiaoBianSkipDraw = QiaoBianSkipDraw;
let QiaoBianSkipPlay = class QiaoBianSkipPlay extends skill_1.TriggerSkill {
    isTriggerable(event) {
        return (event_packer_1.EventPacker.getIdentifier(event) === 154 /* PhaseSkippedEvent */ &&
            event.skippedPhase === 4 /* PlayCardStage */);
    }
    canUse(room, owner, content) {
        return owner.Id === content.playerId && owner.getFlag(this.GeneralName) === true;
    }
    get Priority() {
        return 2 /* Low */;
    }
    targetFilter(room, owner, targets) {
        return targets.length === 2;
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets) {
        const to = room.getPlayerById(target);
        const equiprCardIds = to.getCardIds(1 /* EquipArea */);
        const judgeCardIds = to.getCardIds(2 /* JudgeArea */);
        if (selectedTargets.length === 0) {
            return equiprCardIds.length + judgeCardIds.length > 0;
        }
        else if (selectedTargets.length === 1) {
            let canBeTarget = false;
            const from = room.getPlayerById(selectedTargets[0]);
            const fromEquipArea = from.getCardIds(1 /* EquipArea */);
            canBeTarget = canBeTarget || fromEquipArea.find(id => room.canPlaceCardTo(id, target)) !== undefined;
            const fromJudgeArea = from.getCardIds(2 /* JudgeArea */);
            canBeTarget = canBeTarget || fromJudgeArea.find(id => room.canPlaceCardTo(id, target)) !== undefined;
            return canBeTarget;
        }
        return false;
    }
    getAnimationSteps(event) {
        const { fromId, toIds } = event;
        return [
            { from: fromId, tos: [toIds[0]] },
            { from: toIds[0], tos: [toIds[1]] },
        ];
    }
    resortTargets() {
        return false;
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to move a card in the battlefield?', this.GeneralName).extract();
    }
    async onTrigger(room, event) {
        event.animation = this.getAnimationSteps(event);
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, toIds } = skillUseEvent;
        const moveFrom = room.getPlayerById(toIds[0]);
        const moveTo = room.getPlayerById(toIds[1]);
        const canMovedEquipCardIds = [];
        const canMovedJudgeCardIds = [];
        const fromEquipArea = moveFrom.getCardIds(1 /* EquipArea */);
        canMovedEquipCardIds.push(...fromEquipArea.filter(id => room.canPlaceCardTo(id, moveTo.Id)));
        const fromJudgeArea = moveFrom.getCardIds(2 /* JudgeArea */);
        canMovedJudgeCardIds.push(...fromJudgeArea.filter(id => room.canPlaceCardTo(id, moveTo.Id)));
        const options = {
            [2 /* JudgeArea */]: canMovedJudgeCardIds,
            [1 /* EquipArea */]: canMovedEquipCardIds,
        };
        const chooseCardEvent = {
            fromId,
            toId: fromId,
            options,
            triggeredBySkills: [this.Name],
        };
        room.notify(170 /* AskForChoosingCardFromPlayerEvent */, event_packer_1.EventPacker.createUncancellableEvent(chooseCardEvent), fromId);
        const response = await room.onReceivingAsyncResponseFrom(170 /* AskForChoosingCardFromPlayerEvent */, fromId);
        await room.moveCards({
            movingCards: [{ card: response.selectedCard, fromArea: response.fromArea }],
            moveReason: 3 /* PassiveMove */,
            toId: moveTo.Id,
            fromId: moveFrom.Id,
            toArea: response.fromArea,
            proposer: chooseCardEvent.fromId,
            movedByReason: this.GeneralName,
        });
        return true;
    }
};
QiaoBianSkipPlay = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: QiaoBianSkipDraw.Name, description: QiaoBianSkipDraw.Description })
], QiaoBianSkipPlay);
exports.QiaoBianSkipPlay = QiaoBianSkipPlay;
