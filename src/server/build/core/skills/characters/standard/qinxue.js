"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QinXue = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let QinXue = class QinXue extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return ['gongxin'];
    }
    isTriggerable(event, stage) {
        return (stage === "StageChanged" /* StageChanged */ &&
            [3 /* PrepareStageStart */, 19 /* FinishStageStart */].includes(event.toStage));
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && room.enableToAwaken(this.Name, owner);
    }
    async onTrigger(room, skillUseEvent) {
        skillUseEvent.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} activated awakening skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId)), this.Name).extract();
        return true;
    }
    async onEffect(room, skillUseEvent) {
        await room.changeMaxHp(skillUseEvent.fromId, -1);
        let selectedOption = 'qinxue:draw2';
        if (room.getPlayerById(skillUseEvent.fromId).LostHp > 0) {
            const options = ['qinxue:draw2', 'qinxue:recover'];
            const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                options,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose', this.Name).extract(),
                toId: skillUseEvent.fromId,
                triggeredBySkills: [this.Name],
            }, skillUseEvent.fromId);
            response.selectedOption && (selectedOption = response.selectedOption);
        }
        if (selectedOption === 'qinxue:recover') {
            await room.recover({
                toId: skillUseEvent.fromId,
                recoveredHp: 1,
                recoverBy: skillUseEvent.fromId,
            });
        }
        else {
            await room.drawCards(2, skillUseEvent.fromId, 'top', skillUseEvent.fromId, this.Name);
        }
        await room.obtainSkill(skillUseEvent.fromId, this.RelatedSkills[0], true);
        return true;
    }
};
QinXue = tslib_1.__decorate([
    skill_1.AwakeningSkill({ name: 'qinxue', description: 'qinxue_description' })
], QinXue);
exports.QinXue = QinXue;
