"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KongShengShadow = exports.KongSheng = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let KongSheng = class KongSheng extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && content.toStage === 3 /* PrepareStageStart */;
    }
    cardFilter(room, owner, cards) {
        return cards.length > 0;
    }
    isAvailableCard(owner, room, cardId) {
        return true;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to put at least 1 card on your general card as ‘Kong’?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, cardIds } = event;
        if (!cardIds) {
            return false;
        }
        await room.moveCards({
            movingCards: cardIds.map(card => ({ card, fromArea: room.getPlayerById(fromId).cardFrom(card) })),
            fromId,
            toId: fromId,
            toArea: 3 /* OutsideArea */,
            moveReason: 2 /* ActiveMove */,
            toOutsideArea: this.Name,
            isOutsideAreaInPublic: true,
            proposer: fromId,
            movedByReason: this.Name,
        });
        return true;
    }
};
KongSheng = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'kongsheng', description: 'kongsheng_description' })
], KongSheng);
exports.KongSheng = KongSheng;
let KongShengShadow = class KongShengShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 19 /* FinishStageStart */ &&
            owner.getCardIds(3 /* OutsideArea */, this.GeneralName).length > 0);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const from = room.getPlayerById(fromId);
        const kong = from.getCardIds(3 /* OutsideArea */, this.GeneralName);
        const useableEquips = kong.filter(card => engine_1.Sanguosha.getCardById(card).is(1 /* Equip */) && from.canUseCardTo(room, card, fromId));
        while (useableEquips.length > 0) {
            const response = await room.doAskForCommonly(163 /* AskForCardEvent */, event_packer_1.EventPacker.createUncancellableEvent({
                cardAmount: 1,
                toId: fromId,
                reason: this.GeneralName,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please use a equip from ‘Kong’', this.GeneralName).extract(),
                fromArea: [3 /* OutsideArea */],
                cardMatcher: new card_matcher_1.CardMatcher({
                    cards: useableEquips,
                }).toSocketPassenger(),
                triggeredBySkills: [this.GeneralName],
            }), fromId);
            response.selectedCards = response.selectedCards || [useableEquips[0]];
            await room.useCard({ fromId, cardId: response.selectedCards[0] });
            const index = useableEquips.findIndex(equip => equip === response.selectedCards[0]);
            useableEquips.splice(index, 1);
        }
        const leftCards = from.getCardIds(3 /* OutsideArea */, this.GeneralName);
        if (leftCards.length > 0) {
            await room.moveCards({
                movingCards: leftCards.map(card => ({ card, fromArea: 3 /* OutsideArea */ })),
                fromId,
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
KongShengShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_1.CommonSkill({ name: KongSheng.Name, description: KongSheng.Description })
], KongShengShadow);
exports.KongShengShadow = KongShengShadow;
