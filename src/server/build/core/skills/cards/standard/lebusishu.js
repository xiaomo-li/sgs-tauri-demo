"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeBuSiShuSkill = void 0;
const tslib_1 = require("tslib");
const lebusishu_1 = require("core/ai/skills/cards/lebusishu");
const engine_1 = require("core/game/engine");
const judge_matchers_1 = require("core/shares/libs/judge_matchers");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let LeBuSiShuSkill = class LeBuSiShuSkill extends skill_1.ActiveSkill {
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
        return (owner !== target &&
            room.getPlayerById(owner).canUseCardTo(room, containerCard, target) &&
            room
                .getPlayerById(target)
                .getCardIds(2 /* JudgeArea */)
                .find(cardId => engine_1.Sanguosha.getCardById(cardId).GeneralName === 'lebusishu') === undefined);
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard) {
        return this.isCardAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard);
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { toIds, cardId } = event;
        const to = precondition_1.Precondition.exists(toIds, 'Unknown targets in lebusishu')[0];
        const judgeEvent = await room.judge(to, cardId, this.Name, 1 /* LeBuSiShu */);
        const card = engine_1.Sanguosha.getCardById(judgeEvent.judgeCardId);
        if (judge_matchers_1.JudgeMatcher.onJudge(judgeEvent.judgeMatcherEnum, card)) {
            room.broadcast(103 /* CustomGameDialog */, {
                translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} skipped play stage', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(to))).extract(),
            });
            await room.skip(to, 4 /* PlayCardStage */);
        }
        return true;
    }
};
LeBuSiShuSkill = tslib_1.__decorate([
    skill_1.AI(lebusishu_1.LeBuSiShuSkillTrigger),
    skill_1.CommonSkill({ name: 'lebusishu', description: 'lebusishu_description' })
], LeBuSiShuSkill);
exports.LeBuSiShuSkill = LeBuSiShuSkill;
