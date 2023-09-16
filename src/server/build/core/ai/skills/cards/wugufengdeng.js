"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WuGuFengDengSkillTrigger = void 0;
const ai_lib_1 = require("core/ai/ai_lib");
const active_skill_trigger_1 = require("core/ai/skills/base/active_skill_trigger");
class WuGuFengDengSkillTrigger extends active_skill_trigger_1.ActiveSkillTriggerClass {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill, skillInCard) => {
            const friends = ai_lib_1.AiLibrary.sortFriendsFromWeakToStrong(room, ai).filter(f => room.canUseCardTo(skillInCard, ai, f));
            if (friends.length + 1 < room.AlivePlayers.length / 2) {
                return;
            }
            return {
                fromId: ai.Id,
                cardId: skillInCard,
            };
        };
        this.onAskForContinuouslyChoosingCardEvent = (content, room) => {
            const selectedCards = content.selected.map(selected => selected.card);
            const availableCards = content.cardIds.filter(cardId => !selectedCards.includes(cardId));
            return {
                fromId: content.toId,
                selectedCard: ai_lib_1.AiLibrary.sortCardbyValue(availableCards)[0],
            };
        };
    }
}
exports.WuGuFengDengSkillTrigger = WuGuFengDengSkillTrigger;
