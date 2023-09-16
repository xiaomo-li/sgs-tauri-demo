"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hujia = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let Hujia = class Hujia extends skill_1.TriggerSkill {
    isTriggerable(event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        return (identifier === 159 /* AskForCardResponseEvent */ ||
            identifier === 160 /* AskForCardUseEvent */);
    }
    canUse(room, owner, content) {
        const { cardMatcher } = content;
        return (owner.Id === content.toId &&
            room.AlivePlayers.filter(player => player !== owner && player.Nationality === 0 /* Wei */).length >
                0 &&
            card_matcher_1.CardMatcher.match(cardMatcher, new card_matcher_1.CardMatcher({
                name: ['jink'],
            })));
    }
    async onTrigger(room, event) {
        event.toIds = room
            .getAlivePlayersFrom()
            .filter(player => player.Nationality === 0 /* Wei */ && player.Id !== event.fromId)
            .map(player => player.Id);
        return true;
    }
    async onEffect(room, event) {
        const { triggeredOnEvent, fromId, toIds } = event;
        const jinkCardEvent = triggeredOnEvent;
        const from = room.getPlayerById(fromId);
        for (const playerId of toIds) {
            const responseJinkEvent = {
                cardMatcher: new card_matcher_1.CardMatcher({ name: ['jink'] }).toSocketPassenger(),
                toId: playerId,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('do you wanna response a {0} card for skill {1} from {2}', 'jink', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from)).extract(),
                triggeredBySkills: [this.Name],
            };
            room.notify(159 /* AskForCardResponseEvent */, responseJinkEvent, playerId);
            const response = await room.askForCardResponse(responseJinkEvent, playerId);
            if (response.cardId !== undefined) {
                const responseCard = engine_1.Sanguosha.getCardById(response.cardId);
                const cardUseEvent = {
                    cardId: card_1.VirtualCard.create({
                        cardName: responseCard.Name,
                        cardNumber: responseCard.CardNumber,
                        cardSuit: responseCard.Suit,
                        bySkill: this.Name,
                    }).Id,
                    fromId,
                };
                await room.responseCard(event_packer_1.EventPacker.createIdentifierEvent(123 /* CardResponseEvent */, {
                    cardId: responseCard.Id,
                    fromId: playerId,
                    responseToEvent: responseJinkEvent,
                }));
                jinkCardEvent.responsedEvent = cardUseEvent;
                break;
            }
        }
        return true;
    }
};
Hujia = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'hujia', description: 'hujia_description' }),
    skill_1.LordSkill
], Hujia);
exports.Hujia = Hujia;
