"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QingJianShadow = exports.QingJian = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let QingJian = class QingJian extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        return (content.infos.find(info => owner.Id === info.toId && info.toArea === 0 /* HandArea */) !== undefined &&
            (room.CurrentPhasePlayer.Id !== owner.Id ||
                (room.CurrentPhasePlayer.Id === owner.Id && room.CurrentPlayerPhase !== 3 /* DrawCardStage */)) &&
            !owner.hasUsedSkill(this.Name) &&
            owner.getPlayerCards().length !== 0);
    }
    isRefreshAt(room, owner, phase) {
        return phase === 0 /* PhaseBegin */;
    }
    targetFilter(room, owner, targets) {
        return targets.length === 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length > 0;
    }
    isAvailableCard(owner, room, cardId) {
        return true;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target;
    }
    async onTrigger(room, skillUseEvent) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { toIds, cardIds, fromId } = skillUseEvent;
        if (cardIds === undefined || cardIds.length === 0) {
            return false;
        }
        const types = [];
        for (const cardId of cardIds) {
            const card = engine_1.Sanguosha.getCardById(cardId);
            if (!types.includes(card.BaseType)) {
                types.push(card.BaseType);
            }
        }
        const to = room.getPlayerById(toIds[0]);
        const from = room.getPlayerById(fromId);
        const displayEvent = {
            fromId,
            displayCards: cardIds,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} displayed cards {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), translation_json_tool_1.TranslationPack.patchCardInTranslation(...cardIds)).extract(),
        };
        room.broadcast(126 /* CardDisplayEvent */, displayEvent);
        await room.moveCards({
            movingCards: cardIds.map(card => ({ card, fromArea: from.cardFrom(card) })),
            fromId,
            toId: to.Id,
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: fromId,
            movedByReason: this.GeneralName,
        });
        room.syncGameCommonRules(room.CurrentPlayer.Id, user => {
            user.addInvisibleMark(this.Name, types.length);
            room.CommonRules.addAdditionalHoldCardNumber(user, types.length);
        });
        return true;
    }
};
QingJian = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'qingjian', description: 'qingjian_description' })
], QingJian);
exports.QingJian = QingJian;
let QingJianShadow = class QingJianShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */ && event.from === 7 /* PhaseFinish */;
    }
    canUse(room, owner, content) {
        return true;
    }
    async onTrigger(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const { triggeredOnEvent } = event;
        const phaseChangeEvent = precondition_1.Precondition.exists(triggeredOnEvent, 'Unknown phase change event in qingjian');
        phaseChangeEvent.fromPlayer &&
            room.syncGameCommonRules(phaseChangeEvent.fromPlayer, user => {
                const extraHold = user.getInvisibleMark(this.GeneralName);
                user.removeInvisibleMark(this.GeneralName);
                room.CommonRules.addAdditionalHoldCardNumber(user, -extraHold);
            });
        return true;
    }
};
QingJianShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: 'qingjian', description: 'qingjian_description' })
], QingJianShadow);
exports.QingJianShadow = QingJianShadow;
