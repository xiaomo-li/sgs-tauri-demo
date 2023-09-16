"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaoNve = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const judge_matchers_1 = require("core/shares/libs/judge_matchers");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let BaoNve = class BaoNve extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamageEffect" /* AfterDamageEffect */;
    }
    triggerableTimes(event) {
        return event.damage;
    }
    canUse(room, owner, event) {
        const { fromId } = event;
        if (fromId === undefined || room.getPlayerById(fromId).Dead) {
            return false;
        }
        return owner.Id !== fromId && room.getPlayerById(fromId).Nationality === 3 /* Qun */;
    }
    async onTrigger(room, content) {
        content.translationsMessage = undefined;
        return true;
    }
    async onEffect(room, event) {
        const { triggeredOnEvent } = event;
        const { fromId } = triggeredOnEvent;
        if (fromId === undefined) {
            return false;
        }
        const askForInvokeSkill = {
            toId: fromId,
            options: ['yes', 'no'],
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('do you want to trigger skill {0} from {1} ?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract(),
            triggeredBySkills: [this.Name],
        };
        room.notify(168 /* AskForChoosingOptionsEvent */, askForInvokeSkill, fromId);
        const { selectedOption } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, fromId);
        if (selectedOption === 'yes') {
            room.broadcast(103 /* CustomGameDialog */, {
                translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId)), this.Name).extract(),
            });
            const judge = await room.judge(event.fromId, undefined, this.Name, 5 /* BaoNve */);
            if (judge_matchers_1.JudgeMatcher.onJudge(judge.judgeMatcherEnum, engine_1.Sanguosha.getCardById(judge.judgeCardId))) {
                await room.recover({
                    toId: event.fromId,
                    recoveredHp: 1,
                    recoverBy: event.fromId,
                });
                await room.moveCards({
                    movingCards: [{ card: judge.judgeCardId, fromArea: 6 /* ProcessingArea */ }],
                    toArea: 0 /* HandArea */,
                    toId: event.fromId,
                    moveReason: 1 /* ActivePrey */,
                    movedByReason: this.Name,
                    proposer: event.fromId,
                });
            }
        }
        return true;
    }
};
BaoNve = tslib_1.__decorate([
    skill_wrappers_1.LordSkill,
    skill_wrappers_1.CommonSkill({ name: 'baonve', description: 'baonve_description' })
], BaoNve);
exports.BaoNve = BaoNve;
