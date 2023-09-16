"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeJiShadow = exports.HeJi = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const target_group_1 = require("core/shares/libs/utils/target_group");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let HeJi = class HeJi extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */;
    }
    canUse(room, owner, content) {
        if (target_group_1.TargetGroupUtil.getRealTargets(content.targetGroup).length !== 1) {
            return false;
        }
        const target = target_group_1.TargetGroupUtil.getRealTargets(content.targetGroup)[0];
        const card = engine_1.Sanguosha.getCardById(content.cardId);
        return (card.GeneralName === 'slash' || card.GeneralName === 'duel') && card.isRed() && target !== owner.Id;
    }
    async beforeUse(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const target = target_group_1.TargetGroupUtil.getRealTargets(triggeredOnEvent.targetGroup)[0];
        const askForUseCard = {
            toId: fromId,
            scopedTargets: [target],
            extraUse: true,
            cardMatcher: new card_matcher_1.CardMatcher({ generalName: ['slash', 'duel'] }).toSocketPassenger(),
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to use a slash or duel to {1} ?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(target))).extract(),
            triggeredBySkills: [this.Name],
        };
        const response = await room.askForCardUse(askForUseCard, fromId);
        if (response.cardId) {
            room.getPlayerById(fromId).setFlag(this.Name, response.cardId);
            return true;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const cardId = room.getFlag(fromId, this.Name);
        const cardUseEvent = {
            fromId,
            cardId,
            targetGroup: triggeredOnEvent.targetGroup,
            extraUse: true,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId)), this.Name).extract(),
        };
        event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: true }, cardUseEvent);
        await room.useCard(cardUseEvent, true);
        return true;
    }
};
HeJi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'heji', description: 'heji_description' })
], HeJi);
exports.HeJi = HeJi;
let HeJiShadow = class HeJiShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 0 /* PhaseBegin */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */;
    }
    canUse(room, owner, content) {
        return (event_packer_1.EventPacker.getMiddleware(this.GeneralName, content) === true &&
            !engine_1.Sanguosha.getCardById(content.cardId).isVirtualCard());
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const cards = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ type: [0 /* Basic */, 7 /* Trick */, 1 /* Equip */] }));
        if (cards.length > 0) {
            await room.moveCards({
                movingCards: [{ card: cards[Math.floor(Math.random() * cards.length)], fromArea: 5 /* DrawStack */ }],
                toId: fromId,
                toArea: 0 /* HandArea */,
                moveReason: 2 /* ActiveMove */,
                proposer: fromId,
                triggeredBySkills: [this.GeneralName],
            });
        }
        return true;
    }
};
HeJiShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: HeJi.Name, description: HeJi.Description })
], HeJiShadow);
exports.HeJiShadow = HeJiShadow;
