"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewAsSkillTriggerClass = void 0;
const ai_lib_1 = require("core/ai/ai_lib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const base_trigger_1 = require("./base_trigger");
class ViewAsSkillTriggerClass extends base_trigger_1.BaseSkillTrigger {
    static createViewAsPossibilties(room, ai, cards, skill, viewAs, targets) {
        const selectedCards = [];
        cards = ai_lib_1.AiLibrary.sortCardbyValue(cards, false);
        const cardIndex = cards.findIndex(card => skill.isAvailableCard(room, ai, card, selectedCards, undefined, viewAs));
        selectedCards.push(...cards.splice(cardIndex, 1));
        if (skill.cardFilter(room, ai, selectedCards, targets)) {
            return selectedCards;
        }
    }
}
exports.ViewAsSkillTriggerClass = ViewAsSkillTriggerClass;
ViewAsSkillTriggerClass.skillTrigger = (room, ai, skill, onEvent) => {
    if (!skill.canUse(room, ai, onEvent)) {
        return;
    }
    const cards = skill.availableCardAreas().reduce((savedCards, area) => {
        savedCards.push(...ai.getCardIds(area));
        return savedCards;
    }, []);
    const cardMacter = new card_matcher_1.CardMatcher(onEvent.cardMatcher);
    const viewAsCards = ViewAsSkillTriggerClass.createViewAsPossibilties(room, ai, ai_lib_1.AiLibrary.sortCardbyValue(cards, false), skill, cardMacter, onEvent.scopedTargets || []);
    return viewAsCards ? skill.viewAs(viewAsCards, ai) : undefined;
};
