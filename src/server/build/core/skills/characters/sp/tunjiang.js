"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TunJiang = void 0;
const tslib_1 = require("tslib");
const target_group_1 = require("core/shares/libs/utils/target_group");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let TunJiang = class TunJiang extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 19 /* FinishStageStart */ &&
            room.Analytics.getRecordEvents(event => event.fromId === owner.Id &&
                event.targetGroup !== undefined &&
                target_group_1.TargetGroupUtil.getRealTargets(event.targetGroup).find(player => player !== owner.Id) !== undefined, owner.Id, 'round', [4 /* PlayCardStage */], 1).length === 0);
    }
    getSkillLog(room, owner) {
        const nations = room.AlivePlayers.reduce((allNations, player) => {
            if (!allNations.includes(player.Nationality)) {
                allNations.push(player.Nationality);
            }
            return allNations;
        }, []);
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw {1} card(s) additionally?', this.Name, nations.length).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const nations = room.AlivePlayers.reduce((allNations, player) => {
            if (!allNations.includes(player.Nationality)) {
                allNations.push(player.Nationality);
            }
            return allNations;
        }, []);
        await room.drawCards(nations.length, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
TunJiang = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'tunjiang', description: 'tunjiang_description' })
], TunJiang);
exports.TunJiang = TunJiang;
