"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiFei = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ShiFei = class ShiFei extends skill_1.TriggerSkill {
    isTriggerable(event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        return (!event_packer_1.EventPacker.isDisresponsiveEvent(event) &&
            (identifier === 159 /* AskForCardResponseEvent */ ||
                identifier === 160 /* AskForCardUseEvent */));
    }
    canUse(room, owner, content) {
        const { cardMatcher } = content;
        const jinkMatcher = new card_matcher_1.CardMatcher({ name: ['jink'] });
        return (owner.Id === content.toId &&
            card_matcher_1.CardMatcher.match(cardMatcher, jinkMatcher) &&
            room.CurrentPlayer &&
            !room.CurrentPlayer.Dead);
    }
    getSkillLog(room) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to let {1} draw a card?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.CurrentPlayer)).extract();
    }
    async onTrigger(room, event) {
        event.animation = [{ from: event.fromId, tos: [room.CurrentPlayer.Id] }];
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        await room.drawCards(1, room.CurrentPlayer.Id, 'top', fromId, this.Name);
        if (room
            .getOtherPlayers(room.CurrentPlayer.Id)
            .find(player => player.getCardIds(0 /* HandArea */).length >=
            room.CurrentPlayer.getCardIds(0 /* HandArea */).length)) {
            const most = room
                .getAlivePlayersFrom()
                .reduce((most, player) => player.getCardIds(0 /* HandArea */).length > most
                ? player.getCardIds(0 /* HandArea */).length
                : most, 0);
            const targets = room
                .getAlivePlayersFrom()
                .filter(player => player.getCardIds(0 /* HandArea */).length === most)
                .map(player => player.Id);
            if (targets.includes(fromId)) {
                const canDrop = room
                    .getPlayerById(fromId)
                    .getPlayerCards()
                    .find(id => room.canDropCard(fromId, id));
                if (!canDrop) {
                    const index = targets.findIndex(target => target === fromId);
                    targets.splice(index, 1);
                }
            }
            if (targets.length > 0) {
                const response = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                    players: targets,
                    toId: fromId,
                    requiredAmount: 1,
                    conversation: 'shifei: do you want to choose a target to drop 1 card by you? and you will use/response a virtual Jink',
                    triggeredBySkills: [this.Name],
                }, fromId);
                if (response.selectedPlayers && response.selectedPlayers.length > 0) {
                    const to = room.getPlayerById(response.selectedPlayers[0]);
                    const options = {
                        [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
                        [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
                    };
                    const chooseCardEvent = {
                        fromId,
                        toId: response.selectedPlayers[0],
                        options,
                        triggeredBySkills: [this.Name],
                    };
                    const resp = await room.askForChoosingPlayerCard(chooseCardEvent, fromId, true, true);
                    if (!resp) {
                        return false;
                    }
                    await room.dropCards(fromId === chooseCardEvent.toId ? 4 /* SelfDrop */ : 5 /* PassiveDrop */, [resp.selectedCard], chooseCardEvent.toId, fromId, this.Name);
                    const jink = card_1.VirtualCard.create({
                        cardName: 'jink',
                        bySkill: this.Name,
                    }).Id;
                    if (!room
                        .getPlayerById(fromId)
                        .getSkills('filter')
                        .find(skill => !skill.canUseCard(jink, room, fromId, event.triggeredOnEvent))) {
                        const jinkCardEvent = event.triggeredOnEvent;
                        const cardUseEvent = {
                            cardId: jink,
                            fromId,
                            toCardIds: jinkCardEvent.byCardId === undefined ? undefined : [jinkCardEvent.byCardId],
                            responseToEvent: jinkCardEvent.triggeredOnEvent,
                        };
                        jinkCardEvent.responsedEvent = cardUseEvent;
                    }
                }
            }
        }
        return true;
    }
};
ShiFei = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'shifei', description: 'shifei_description' })
], ShiFei);
exports.ShiFei = ShiFei;
