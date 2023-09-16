"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShanLi = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ShanLi = class ShanLi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ && event.toStage === 3 /* PrepareStageStart */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && room.enableToAwaken(this.Name, owner);
    }
    async onTrigger(room, skillUseEvent) {
        skillUseEvent.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} activated awakening skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId)), this.Name).extract();
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        await room.changeMaxHp(fromId, -1);
        const players = room.AlivePlayers.map(player => player.Id);
        const resp = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
            players,
            toId: fromId,
            requiredAmount: 1,
            conversation: 'shanli: please choose a target to gain a lord skill',
            triggeredBySkills: [this.Name],
        }, fromId, true);
        resp.selectedPlayers = resp.selectedPlayers || [players[Math.floor(Math.random() * players.length)]];
        const lordSkills = engine_1.Sanguosha.getRandomCharacters(3, undefined, [], character => character.isLord()).reduce((skills, general) => {
            skills.push(...general.Skills.filter(skill => skill.isLordSkill() && !skill.isShadowSkill()).map(skill => skill.Name));
            return skills;
        }, []);
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options: lordSkills,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose shanli options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(resp.selectedPlayers[0]))).extract(),
            toId: fromId,
            triggeredBySkills: [this.Name],
        }, fromId, true);
        response.selectedOption = response.selectedOption || lordSkills[0];
        await room.obtainSkill(resp.selectedPlayers[0], response.selectedOption);
        return true;
    }
};
ShanLi = tslib_1.__decorate([
    skill_wrappers_1.AwakeningSkill({ name: 'shanli', description: 'shanli_description' })
], ShanLi);
exports.ShanLi = ShanLi;
