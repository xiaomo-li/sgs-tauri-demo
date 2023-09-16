"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GongXin = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let GongXin = class GongXin extends skill_1.ActiveSkill {
    get RelatedCharacters() {
        return ['lvmeng', 'gexuan'];
    }
    audioIndex(characterName) {
        return characterName && characterName === this.RelatedCharacters[1] ? 1 : 2;
    }
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    isRefreshAt(room, owner, phase) {
        return phase === 4 /* PlayCardStage */;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target && room.getPlayerById(target).getCardIds(0 /* HandArea */).length > 0;
    }
    isAvailableCard(owner, room, cardId) {
        return false;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { toIds, fromId } = skillUseEvent;
        const to = room.getPlayerById(toIds[0]);
        const from = room.getPlayerById(fromId);
        const handCards = to.getCardIds(0 /* HandArea */);
        const askForChooseCardEvent = {
            toId: fromId,
            cardIds: handCards,
            cardMatcher: new card_matcher_1.CardMatcher({ suit: [2 /* Heart */] }).toSocketPassenger(),
            amount: 1,
            triggeredBySkills: [this.Name],
        };
        room.notify(165 /* AskForChoosingCardEvent */, askForChooseCardEvent, fromId);
        const { selectedCards } = await room.onReceivingAsyncResponseFrom(165 /* AskForChoosingCardEvent */, fromId);
        if (selectedCards === undefined) {
            return true;
        }
        const showCardEvent = {
            displayCards: selectedCards,
            fromId: toIds[0],
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} display hand card {1} from {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), translation_json_tool_1.TranslationPack.patchCardInTranslation(...selectedCards), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to)).extract(),
        };
        room.broadcast(126 /* CardDisplayEvent */, showCardEvent);
        const askForChooseOptionsEvent = {
            options: ['gongxin:dropcard', 'gongxin:putcard'],
            toId: fromId,
            conversation: 'please choose',
            triggeredBySkills: [this.Name],
        };
        room.notify(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForChooseOptionsEvent), fromId);
        const { selectedOption } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, fromId);
        if (selectedOption === 'gongxin:putcard') {
            await room.moveCards({
                movingCards: selectedCards.map(card => ({ card, fromArea: 0 /* HandArea */ })),
                fromId: to.Id,
                moveReason: 3 /* PassiveMove */,
                toArea: 5 /* DrawStack */,
                proposer: fromId,
                movedByReason: this.Name,
            });
            room.broadcast(103 /* CustomGameDialog */, {
                translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} place card {1} from {2} on the top of draw stack', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), translation_json_tool_1.TranslationPack.patchCardInTranslation(...selectedCards), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to)).extract(),
            });
        }
        else {
            await room.dropCards(5 /* PassiveDrop */, selectedCards, to.Id, fromId, this.Name);
        }
        return true;
    }
};
GongXin = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'gongxin', description: 'gongxin_description' })
], GongXin);
exports.GongXin = GongXin;
