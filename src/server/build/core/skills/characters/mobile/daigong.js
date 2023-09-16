"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaiGong = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let DaiGong = class DaiGong extends skill_1.TriggerSkill {
    isRefreshAt(room, owner, stage) {
        return stage === 0 /* PhaseBegin */;
    }
    isTriggerable(event, stage) {
        return stage === "DamagedEffect" /* DamagedEffect */;
    }
    canUse(room, owner, content) {
        return (content.fromId !== undefined &&
            !owner.hasUsedSkill(this.Name) &&
            !room.getPlayerById(content.fromId).Dead &&
            content.toId === owner.Id &&
            owner.getCardIds(0 /* HandArea */).length > 0);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const from = room.getPlayerById(event.fromId);
        const hancards = room.getPlayerById(event.fromId).getCardIds(0 /* HandArea */);
        room.broadcast(126 /* CardDisplayEvent */, {
            fromId: event.fromId,
            displayCards: hancards,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} display hand card {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), translation_json_tool_1.TranslationPack.patchCardInTranslation(...hancards)).extract(),
        });
        const suits = hancards.reduce((allsuits, id) => {
            const suit = engine_1.Sanguosha.getCardById(id).Suit;
            allsuits.includes(suit) || allsuits.push(suit);
            return allsuits;
        }, []);
        const source = event.triggeredOnEvent.fromId;
        if (suits.length < 4 && room.getPlayerById(source).getPlayerCards().length > 0) {
            const response = await room.doAskForCommonly(163 /* AskForCardEvent */, {
                cardAmount: 1,
                toId: source,
                reason: this.Name,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: you need to give a card to {1}, otherwise the damage to {1} will be terminated', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from)).extract(),
                fromArea: [0 /* HandArea */, 1 /* EquipArea */],
                cardMatcher: new card_matcher_1.CardMatcher({
                    suit: [3 /* Club */, 4 /* Diamond */, 2 /* Heart */, 1 /* Spade */].filter(suit => !suits.includes(suit)),
                }).toSocketPassenger(),
                triggeredBySkills: [this.Name],
            }, source);
            if (response.selectedCards.length > 0) {
                await room.moveCards({
                    movingCards: [
                        {
                            card: response.selectedCards[0],
                            fromArea: room.getPlayerById(source).cardFrom(response.selectedCards[0]),
                        },
                    ],
                    fromId: source,
                    toId: event.fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 2 /* ActiveMove */,
                    proposer: source,
                    triggeredBySkills: [this.Name],
                });
                return true;
            }
        }
        event_packer_1.EventPacker.terminate(event.triggeredOnEvent);
        return true;
    }
};
DaiGong = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'daigong', description: 'daigong_description' })
], DaiGong);
exports.DaiGong = DaiGong;
