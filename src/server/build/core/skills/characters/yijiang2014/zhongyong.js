"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhongYong = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const target_group_1 = require("core/shares/libs/utils/target_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhongYong = class ZhongYong extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */;
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            engine_1.Sanguosha.getCardById(content.cardId).GeneralName === 'slash' &&
            room
                .getOtherPlayers(owner.Id)
                .find(player => !target_group_1.TargetGroupUtil.getRealTargets(content.targetGroup).includes(player.Id)) !== undefined &&
            ((card_1.VirtualCard.getActualCards([content.cardId]).length > 0 && room.isCardOnProcessing(content.cardId)) ||
                (content.cardIdsResponded !== undefined &&
                    content.cardIdsResponded.find(id => card_1.VirtualCard.getActualCards([id]).length > 0 &&
                        card_1.VirtualCard.getActualCards([id]).find(cardId => !room.isCardInDropStack(cardId)) === undefined) !== undefined)));
    }
    async beforeUse(room, event) {
        const { fromId } = event;
        const cardUseEvent = event.triggeredOnEvent;
        const allCards = [];
        room.isCardOnProcessing(cardUseEvent.cardId) && allCards.push(...card_1.VirtualCard.getActualCards([cardUseEvent.cardId]));
        cardUseEvent.cardIdsResponded &&
            allCards.push(...card_1.VirtualCard.getActualCards(cardUseEvent.cardIdsResponded.filter(id => card_1.VirtualCard.getActualCards([id]).length > 0 &&
                card_1.VirtualCard.getActualCards([id]).find(cardId => !room.isCardInDropStack(cardId)) === undefined)));
        const observeCardsEvent = {
            cardIds: allCards,
            selected: [],
        };
        room.notify(129 /* ObserveCardsEvent */, observeCardsEvent, fromId);
        const response = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
            players: room
                .getOtherPlayers(fromId)
                .filter(player => !target_group_1.TargetGroupUtil.getRealTargets(cardUseEvent.targetGroup).includes(player.Id))
                .map(player => player.Id),
            toId: fromId,
            requiredAmount: 1,
            conversation: 'zhongyong: do you want to choose a target to gain these cards?',
            triggeredBySkills: [this.Name],
        }, fromId);
        room.notify(130 /* ObserveCardFinishEvent */, {}, fromId);
        if (response.selectedPlayers && response.selectedPlayers.length > 0) {
            event.toIds = response.selectedPlayers;
            event.cardIds = allCards;
            return true;
        }
        return false;
    }
    getAnimationSteps(event) {
        return event.toIds ? [{ from: event.fromId, tos: event.toIds }] : [];
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds, cardIds } = event;
        if (!toIds || !cardIds) {
            return false;
        }
        const hasRed = cardIds.find(id => engine_1.Sanguosha.getCardById(id).isRed());
        const hasBlack = cardIds.find(id => engine_1.Sanguosha.getCardById(id).isBlack());
        await room.moveCards({
            movingCards: cardIds.map(card => ({
                card,
                fromArea: room.isCardOnProcessing(card) ? 6 /* ProcessingArea */ : 4 /* DropStack */,
            })),
            toId: toIds[0],
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: fromId,
            triggeredBySkills: [this.Name],
        });
        const cardId = event.triggeredOnEvent.cardId;
        if (card_1.VirtualCard.getActualCards([cardId]).length > 0 && room.isCardOnProcessing(cardId)) {
            room.endProcessOnTag(cardId.toString());
        }
        hasBlack && (await room.drawCards(1, toIds[0], 'top', fromId, this.Name));
        if (hasRed) {
            const availableTargets = room
                .getOtherPlayers(fromId)
                .filter(player => room.withinAttackDistance(room.getPlayerById(fromId), player) &&
                room.canUseCardTo(new card_matcher_1.CardMatcher({ generalName: ['slash'] }), room.getPlayerById(toIds[0]), player, true))
                .map(player => player.Id);
            if (availableTargets.length > 0) {
                const askForUseCard = {
                    toId: toIds[0],
                    scopedTargets: availableTargets,
                    extraUse: true,
                    cardMatcher: new card_matcher_1.CardMatcher({ generalName: ['slash'] }).toSocketPassenger(),
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to use a slash to zhongyong {1} targets?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId))).extract(),
                    triggeredBySkills: [this.Name],
                };
                const response = await room.askForCardUse(askForUseCard, toIds[0]);
                if (response.cardId && response.toIds) {
                    await room.useCard({
                        fromId: toIds[0],
                        targetGroup: [response.toIds],
                        cardId: response.cardId,
                        extraUse: true,
                    }, true);
                }
            }
        }
        return true;
    }
};
ZhongYong = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'zhongyong', description: 'zhongyong_description' })
], ZhongYong);
exports.ZhongYong = ZhongYong;
