"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhuangRong = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const shenwei_1 = require("./shenwei");
const wushuang_1 = require("../standard/wushuang");
let ZhuangRong = class ZhuangRong extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return [shenwei_1.ShenWei.Name, wushuang_1.WuShuang.Name];
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        return content.from === 7 /* PhaseFinish */ && room.enableToAwaken(this.Name, owner);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.changeMaxHp(event.fromId, -1);
        const from = room.getPlayerById(event.fromId);
        await room.recover({
            toId: event.fromId,
            recoveredHp: from.MaxHp - from.Hp,
            recoverBy: event.fromId,
        });
        const diff = from.MaxHp - from.getCardIds(0 /* HandArea */).length;
        diff && (await room.drawCards(diff, event.fromId, 'top', event.fromId, this.Name));
        for (const skillName of this.RelatedSkills) {
            await room.obtainSkill(event.fromId, skillName);
        }
        return true;
    }
};
ZhuangRong = tslib_1.__decorate([
    skill_wrappers_1.AwakeningSkill({ name: 'zhuangrong', description: 'zhuangrong_description' })
], ZhuangRong);
exports.ZhuangRong = ZhuangRong;
