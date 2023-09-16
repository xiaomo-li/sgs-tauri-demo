"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FanXiang = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const liangzhu_1 = require("./liangzhu");
const xiaoji_1 = require("../standard/xiaoji");
let FanXiang = class FanXiang extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return ['xiaoji'];
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
        await room.changeMaxHp(fromId, 1);
        await room.recover({
            toId: fromId,
            recoveredHp: 1,
            recoverBy: fromId,
        });
        await room.loseSkill(fromId, liangzhu_1.LiangZhu.Name, true);
        await room.obtainSkill(event.fromId, xiaoji_1.XiaoJi.Name, true);
        return true;
    }
};
FanXiang = tslib_1.__decorate([
    skill_wrappers_1.AwakeningSkill({ name: 'fanxiang', description: 'fanxiang_description' })
], FanXiang);
exports.FanXiang = FanXiang;
