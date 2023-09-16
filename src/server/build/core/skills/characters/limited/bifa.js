"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiFaEffect = exports.BiFa = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let BiFa = class BiFa extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 19 /* FinishStageStart */ &&
            owner.getCardIds(0 /* HandArea */).length > 0);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableCard(owner, room, pendingCardId) {
        return true;
    }
    isAvailableTarget(owner, room, target) {
        return (target !== owner && room.getPlayerById(target).getCardIds(3 /* OutsideArea */, this.Name).length === 0);
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    getSkillLog(room, player) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to put a hand card on another player’s general card?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds, cardIds } = event;
        if (!toIds || !cardIds) {
            return false;
        }
        await room.moveCards({
            movingCards: [{ card: cardIds[0], fromArea: 0 /* HandArea */ }],
            fromId,
            toId: toIds[0],
            toArea: 3 /* OutsideArea */,
            moveReason: 2 /* ActiveMove */,
            toOutsideArea: this.Name,
            isOutsideAreaInPublic: false,
            proposer: fromId,
            movedByReason: this.Name,
        });
        room.getPlayerById(toIds[0]).setFlag(this.Name, fromId);
        room.getPlayerById(toIds[0]).hasShadowSkill(BiFaEffect.Name) || (await room.obtainSkill(toIds[0], BiFaEffect.Name));
        return true;
    }
};
BiFa = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'bifa', description: 'bifa_description' })
], BiFa);
exports.BiFa = BiFa;
let BiFaEffect = class BiFaEffect extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return (content.toPlayer === owner &&
            content.to === 0 /* PhaseBegin */ &&
            stage === "AfterPhaseChanged" /* AfterPhaseChanged */);
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    canUse(room, owner, event) {
        return owner.Id === event.toPlayer && event.to === 0 /* PhaseBegin */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const bifa = room.getPlayerById(event.fromId).getCardIds(3 /* OutsideArea */, BiFa.Name);
        if (bifa.length > 0) {
            const bifaUser = room.getFlag(event.fromId, BiFa.Name);
            let selectedCard;
            if (bifaUser && !room.getPlayerById(bifaUser).Dead) {
                const observeCardsEvent = {
                    cardIds: bifa,
                    selected: [],
                };
                room.notify(129 /* ObserveCardsEvent */, observeCardsEvent, event.fromId);
                const { selectedCards } = await room.doAskForCommonly(163 /* AskForCardEvent */, {
                    cardAmount: 1,
                    toId: event.fromId,
                    reason: this.GeneralName,
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please give {1} a same type card, or you will lose 1 hp', BiFa.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(bifaUser))).extract(),
                    cardMatcher: new card_matcher_1.CardMatcher({ type: [engine_1.Sanguosha.getCardById(bifa[0]).BaseType] }).toSocketPassenger(),
                    fromArea: [0 /* HandArea */],
                    triggeredBySkills: [BiFa.Name],
                }, event.fromId);
                room.notify(130 /* ObserveCardFinishEvent */, {}, event.fromId);
                selectedCard = selectedCards[0];
            }
            if (selectedCard) {
                await room.moveCards({
                    movingCards: [{ card: selectedCard, fromArea: 0 /* HandArea */ }],
                    fromId: event.fromId,
                    toId: bifaUser,
                    toArea: 0 /* HandArea */,
                    moveReason: 2 /* ActiveMove */,
                    proposer: event.fromId,
                    triggeredBySkills: [BiFa.Name],
                });
                await room.moveCards({
                    movingCards: [{ card: bifa[0], fromArea: 3 /* OutsideArea */ }],
                    fromId: event.fromId,
                    toId: event.fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 1 /* ActivePrey */,
                    proposer: event.fromId,
                    triggeredBySkills: [BiFa.Name],
                });
            }
            else {
                await room.moveCards({
                    movingCards: [{ card: bifa[0], fromArea: 3 /* OutsideArea */ }],
                    fromId: event.fromId,
                    toArea: 4 /* DropStack */,
                    moveReason: 6 /* PlaceToDropStack */,
                    proposer: event.fromId,
                    triggeredBySkills: [BiFa.Name],
                });
                await room.loseHp(event.fromId, 1);
            }
        }
        await room.loseSkill(event.fromId, this.Name);
        return true;
    }
};
BiFaEffect = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_bifa_effect', description: 's_bifa_effect_description' })
], BiFaEffect);
exports.BiFaEffect = BiFaEffect;
