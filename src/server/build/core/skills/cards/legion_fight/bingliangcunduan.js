"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BingLiangCunDuanSkill = void 0;
const tslib_1 = require("tslib");
const bingliangcunduan_1 = require("core/ai/skills/cards/bingliangcunduan");
const engine_1 = require("core/game/engine");
const judge_matchers_1 = require("core/shares/libs/judge_matchers");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let BingLiangCunDuanSkill = class BingLiangCunDuanSkill extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return true;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter() {
        return true;
    }
    isAvailableCard() {
        return false;
    }
    isCardAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard) {
        const from = room.getPlayerById(owner);
        const to = room.getPlayerById(target);
        return (owner !== target &&
            from.canUseCardTo(room, containerCard, target) &&
            to
                .getCardIds(2 /* JudgeArea */)
                .find(cardId => engine_1.Sanguosha.getCardById(cardId).GeneralName === 'bingliangcunduan') === undefined);
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard) {
        return (this.isCardAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard) &&
            room.cardUseDistanceBetween(room, containerCard, room.getPlayerById(owner), room.getPlayerById(target)) <=
                engine_1.Sanguosha.getCardById(containerCard).EffectUseDistance);
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { toIds, cardId } = event;
        const to = precondition_1.Precondition.exists(toIds, 'Unknown targets in bingliangcunduan')[0];
        const judgeEvent = await room.judge(to, cardId, this.Name, 2 /* BingLiangCunDuan */);
        const card = engine_1.Sanguosha.getCardById(judgeEvent.judgeCardId);
        if (judge_matchers_1.JudgeMatcher.onJudge(judgeEvent.judgeMatcherEnum, card)) {
            room.broadcast(103 /* CustomGameDialog */, {
                translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} skipped draw stage', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(to))).extract(),
            });
            await room.skip(to, 3 /* DrawCardStage */);
        }
        return true;
    }
};
BingLiangCunDuanSkill = tslib_1.__decorate([
    skill_1.AI(bingliangcunduan_1.BingLiangCunDuanSkillTrigger),
    skill_1.CommonSkill({ name: 'bingliangcunduan', description: 'bingliangcunduan_description' })
], BingLiangCunDuanSkill);
exports.BingLiangCunDuanSkill = BingLiangCunDuanSkill;
