"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaGuaZhenSkill = void 0;
const tslib_1 = require("tslib");
const baguazhen_1 = require("core/ai/skills/cards/baguazhen");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const baguazhen_2 = require("core/cards/standard/baguazhen");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const judge_matchers_1 = require("core/shares/libs/judge_matchers");
const skill_1 = require("core/skills/skill");
let BaGuaZhenSkill = class BaGuaZhenSkill extends skill_1.TriggerSkill {
    get Muted() {
        return true;
    }
    isAutoTrigger() {
        return false;
    }
    isTriggerable(event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        return (!event_packer_1.EventPacker.isDisresponsiveEvent(event) &&
            (identifier === 159 /* AskForCardResponseEvent */ ||
                identifier === 160 /* AskForCardUseEvent */));
    }
    canUse(room, owner, content) {
        if (!content) {
            return true;
        }
        const { cardMatcher } = content;
        const jinkMatcher = new card_matcher_1.CardMatcher({ name: ['jink'] });
        return (owner.Id === content.toId &&
            card_matcher_1.CardMatcher.match(cardMatcher, jinkMatcher) &&
            owner.getSkills('filter').find(skill => !skill.canUseCard(jinkMatcher, room, owner.Id, content)) ===
                undefined);
    }
    async onTrigger(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const { triggeredOnEvent, fromId } = event;
        const jinkCardEvent = triggeredOnEvent;
        const judgeEvent = await room.judge(event.fromId, undefined, baguazhen_2.BaGuaZhen.name, 3 /* BaGuaZhen */);
        if (judge_matchers_1.JudgeMatcher.onJudge(judgeEvent.judgeMatcherEnum, engine_1.Sanguosha.getCardById(judgeEvent.judgeCardId))) {
            const jink = card_1.VirtualCard.create({
                cardName: 'jink',
                bySkill: this.Name,
            });
            const cardUseEvent = {
                cardId: jink.Id,
                fromId,
                toCardIds: jinkCardEvent.byCardId === undefined ? undefined : [jinkCardEvent.byCardId],
                responseToEvent: jinkCardEvent.triggeredOnEvent,
            };
            jinkCardEvent.responsedEvent = cardUseEvent;
        }
        return true;
    }
};
BaGuaZhenSkill = tslib_1.__decorate([
    skill_1.AI(baguazhen_1.BaGuaZhenSkillTrigger),
    skill_1.CommonSkill({ name: 'baguazhen', description: 'baguazhen_description' })
], BaGuaZhenSkill);
exports.BaGuaZhenSkill = BaGuaZhenSkill;
