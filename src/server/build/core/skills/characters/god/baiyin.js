"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaiYin = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const jilve_1 = require("./jilve");
let BaiYin = class BaiYin extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return ['jilve', 'guicai', 'fangzhu', 'jizhi', 'zhiheng', 'wansha'];
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ && event.toStage === 4 /* PrepareStage */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.playerId && room.enableToAwaken(this.Name, owner);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        await room.changeMaxHp(skillUseEvent.fromId, -1);
        await room.obtainSkill(skillUseEvent.fromId, jilve_1.JiLve.GeneralName, true);
        return true;
    }
};
BaiYin = tslib_1.__decorate([
    skill_wrappers_1.AwakeningSkill({ name: 'baiyin', description: 'baiyin_description' })
], BaiYin);
exports.BaiYin = BaiYin;
