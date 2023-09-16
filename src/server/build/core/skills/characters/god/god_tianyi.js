"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GodTianYi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let GodTianYi = class GodTianYi extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return ['zuoxing'];
    }
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
        await room.changeMaxHp(fromId, 2);
        await room.recover({
            toId: fromId,
            recoveredHp: 1,
            recoverBy: fromId,
        });
        const players = room.getAlivePlayersFrom().map(player => player.Id);
        const resp = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
            players,
            toId: fromId,
            requiredAmount: 1,
            conversation: 'god_tianyi:please choose a target to obtain ‘Zuo Xing’',
            triggeredBySkills: [this.Name],
        }, fromId, true);
        resp.selectedPlayers = resp.selectedPlayers || [players[Math.floor(Math.random() * players.length)]];
        await room.obtainSkill(resp.selectedPlayers[0], 'zuoxing');
        return true;
    }
};
GodTianYi = tslib_1.__decorate([
    skill_wrappers_1.AwakeningSkill({ name: 'god_tianyi', description: 'god_tianyi_description' })
], GodTianYi);
exports.GodTianYi = GodTianYi;
