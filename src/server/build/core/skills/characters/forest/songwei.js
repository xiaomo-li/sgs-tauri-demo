"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongWei = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let SongWei = class SongWei extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterJudgeEffect" /* AfterJudgeEffect */;
    }
    canUse(room, owner, content) {
        const to = room.getPlayerById(content.toId);
        return (owner.Id !== content.toId &&
            to.Nationality === 0 /* Wei */ &&
            engine_1.Sanguosha.getCardById(content.judgeCardId).isBlack());
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const judgeEvent = triggeredOnEvent;
        const askForInvokeSkill = {
            toId: judgeEvent.toId,
            options: ['yes', 'no'],
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('do you want to trigger skill {0} from {1} ?', this.GeneralName, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId))).extract(),
            triggeredBySkills: [this.Name],
        };
        room.notify(168 /* AskForChoosingOptionsEvent */, askForInvokeSkill, judgeEvent.toId);
        const { selectedOption } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, judgeEvent.toId);
        if (selectedOption === 'yes') {
            await room.drawCards(1, skillUseEvent.fromId, undefined, skillUseEvent.fromId, this.Name);
        }
        return true;
    }
};
SongWei = tslib_1.__decorate([
    skill_wrappers_1.LordSkill,
    skill_wrappers_1.CommonSkill({ name: 'songwei', description: 'songwei_description' })
], SongWei);
exports.SongWei = SongWei;
