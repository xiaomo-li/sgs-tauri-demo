"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuHuoShadow = exports.GuHuo = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const chanyuan_1 = require("./chanyuan");
let GuHuo = class GuHuo extends skill_1.ViewAsSkill {
    get RelatedSkills() {
        return [chanyuan_1.ChanYuan.Name];
    }
    canViewAs() {
        return engine_1.Sanguosha.getCardNameByType(types => (types.includes(7 /* Trick */) || types.includes(0 /* Basic */)) && !types.includes(8 /* DelayedTrick */));
    }
    isRefreshAt(room, owner, phase) {
        return phase === 0 /* PhaseBegin */;
    }
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.getCardIds(0 /* HandArea */).length > 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(room, owner, pendingCardId) {
        return true;
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    viewAs(selectedCards, owner, viewAs) {
        precondition_1.Precondition.assert(!!viewAs, 'Unknown guhuo card');
        return card_1.VirtualCard.create({
            cardName: viewAs,
            bySkill: this.Name,
            cardNumber: 0,
            cardSuit: 0 /* NoSuit */,
            hideActualCard: true,
        }, selectedCards);
    }
};
GuHuo = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'guhuo', description: 'guhuo_description' })
], GuHuo);
exports.GuHuo = GuHuo;
let GuHuoShadow = class GuHuoShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    getPriority() {
        return 0 /* High */;
    }
    isTriggerable(event, stage) {
        return ((stage === "PreCardUse" /* PreCardUse */ || stage === "PreCardResponse" /* PreCardResponse */) &&
            card_1.Card.isVirtualCardId(event.cardId));
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            engine_1.Sanguosha.getCardById(content.cardId).findByGeneratedSkill(this.GeneralName));
    }
    async onTrigger(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const cardEvent = event.triggeredOnEvent;
        const preuseCard = engine_1.Sanguosha.getCardById(cardEvent.cardId);
        const realCard = engine_1.Sanguosha.getCardById(preuseCard.ActualCardIds[0]);
        const from = room.getPlayerById(cardEvent.fromId);
        preuseCard.Suit = realCard.Suit;
        preuseCard.CardNumber = realCard.CardNumber;
        if (!room.isCardOnProcessing(preuseCard.Id)) {
            await room.moveCards({
                movingCards: [{ card: preuseCard.Id }],
                fromId: cardEvent.fromId,
                toArea: 6 /* ProcessingArea */,
                moveReason: 8 /* CardUse */,
                movedByReason: this.GeneralName,
                hideBroadcast: true,
            });
        }
        const chooseOptionEvent = event_packer_1.EventPacker.createUncancellableEvent({
            toId: event.fromId,
            options: ['guhuo:doubt', 'guhuo:no-doubt'],
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('do you doubt the pre-use of {0} from {1}', translation_json_tool_1.TranslationPack.patchCardInTranslation(cardEvent.cardId), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from)).extract(),
            ignoreNotifiedStatus: true,
            triggeredBySkills: [this.Name],
        });
        const askingResponses = [];
        const askForPlayers = room
            .getAlivePlayersFrom()
            .filter(player => !player.hasSkill(chanyuan_1.ChanYuan.Name) && player.Id !== cardEvent.fromId)
            .map(player => player.Id);
        room.doNotify(askForPlayers);
        for (const playerId of askForPlayers) {
            chooseOptionEvent.toId = playerId;
            room.notify(168 /* AskForChoosingOptionsEvent */, chooseOptionEvent, playerId);
            askingResponses.push(room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, playerId));
        }
        const responses = await Promise.all(askingResponses);
        const messages = responses.map(response => translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} selected {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(response.fromId)), response.selectedOption).toString());
        messages.push(translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} displayed guhuo cards {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), translation_json_tool_1.TranslationPack.patchCardInTranslation(realCard.Id)).toString());
        room.broadcast(103 /* CustomGameDialog */, {
            messages,
        });
        let success = true;
        const chooseOptions = event_packer_1.EventPacker.createUncancellableEvent({
            options: ['guhuo:lose-hp', 'guhuo:drop-card'],
            toId: '',
            conversation: 'please choose',
            triggeredBySkills: [this.Name],
        });
        for (const response of responses) {
            if (preuseCard.Name === realCard.Name) {
                if (response.selectedOption === 'guhuo:doubt') {
                    const player = room.getPlayerById(response.fromId);
                    if (player.getPlayerCards().find(id => room.canDropCard(response.fromId, id))) {
                        chooseOptions.toId = response.fromId;
                        room.notify(168 /* AskForChoosingOptionsEvent */, chooseOptions, response.fromId);
                        const { selectedOption } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, response.fromId);
                        if (selectedOption === 'guhuo:lose-hp') {
                            await room.loseHp(response.fromId, 1);
                        }
                        else {
                            const dropResponse = await room.askForCardDrop(response.fromId, 1, [0 /* HandArea */, 1 /* EquipArea */], true, undefined, this.Name);
                            if (dropResponse.droppedCards.length > 0) {
                                await room.dropCards(4 /* SelfDrop */, dropResponse.droppedCards, response.fromId, response.fromId, this.Name);
                            }
                            else {
                                await room.loseHp(response.fromId, 1);
                            }
                        }
                    }
                    else {
                        await room.loseHp(response.fromId, 1);
                    }
                    await room.obtainSkill(response.fromId, chanyuan_1.ChanYuan.Name, true);
                    room.setFlag(response.fromId, chanyuan_1.ChanYuan.Name, true, chanyuan_1.ChanYuan.Name);
                }
            }
            else {
                if (response.selectedOption === 'guhuo:doubt') {
                    success = false;
                    await room.drawCards(1, response.fromId, undefined, event.fromId, this.GeneralName);
                }
            }
        }
        if (!success) {
            event_packer_1.EventPacker.terminate(cardEvent);
            await room.moveCards({
                movingCards: [{ card: realCard.Id, fromArea: 6 /* ProcessingArea */ }],
                moveReason: 6 /* PlaceToDropStack */,
                toArea: 4 /* DropStack */,
                hideBroadcast: true,
                movedByReason: this.Name,
            });
            room.endProcessOnTag(preuseCard.Id.toString());
            return false;
        }
        else {
            cardEvent.cardId = preuseCard.Id;
        }
        return true;
    }
};
GuHuoShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_1.CommonSkill({ name: GuHuo.Name, description: GuHuo.Description })
], GuHuoShadow);
exports.GuHuoShadow = GuHuoShadow;
