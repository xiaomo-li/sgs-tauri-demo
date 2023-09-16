"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiYuanShadow = exports.ShiYuan = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const yuwei_1 = require("./yuwei");
let ShiYuan = class ShiYuan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterAimmed" /* AfterAimmed */;
    }
    canUse(room, owner, content) {
        const flag = owner.getFlag(this.Name) || [];
        const yuweiEffected = owner.getPlayerSkills().find(skill => skill.Name === yuwei_1.YuWei.Name) &&
            room.CurrentPlayer !== owner &&
            room.CurrentPlayer.Nationality === 3 /* Qun */;
        if (flag.length === (yuweiEffected ? 6 : 3)) {
            return false;
        }
        const user = room.getPlayerById(content.fromId);
        return (content.toId === owner.Id &&
            content.fromId !== owner.Id &&
            !user.Dead &&
            !(flag.length > 0 &&
                ((user.Hp > owner.Hp &&
                    (yuweiEffected ? flag.includes(3 /* MoreHpSec */) : flag.includes(0 /* MoreHp */))) ||
                    (user.Hp === owner.Hp &&
                        (yuweiEffected ? flag.includes(4 /* SameHpSec */) : flag.includes(1 /* SameHp */))) ||
                    (user.Hp < owner.Hp &&
                        (yuweiEffected ? flag.includes(5 /* LesserHpSec */) : flag.includes(2 /* LesserHp */))))));
    }
    getSkillLog(room, owner, event) {
        let num = 1;
        if (room.getPlayerById(event.fromId).Hp > owner.Hp) {
            num = 3;
        }
        else if (room.getPlayerById(event.fromId).Hp === owner.Hp) {
            num = 2;
        }
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw {1} card(s)?', this.Name, num).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const from = room.getPlayerById(event.triggeredOnEvent.fromId);
        let num = 1;
        const originalFlags = room.getFlag(event.fromId, this.Name) || [];
        let flag = originalFlags.includes(2 /* LesserHp */) ? 5 /* LesserHpSec */ : 2 /* LesserHp */;
        if (from.Hp > room.getPlayerById(event.fromId).Hp) {
            num = 3;
            flag = originalFlags.includes(0 /* MoreHp */) ? 3 /* MoreHpSec */ : 0 /* MoreHp */;
        }
        else if (from.Hp === room.getPlayerById(event.fromId).Hp) {
            num = 2;
            flag = originalFlags.includes(1 /* SameHp */) ? 4 /* SameHpSec */ : 1 /* SameHp */;
        }
        originalFlags.includes(flag) || originalFlags.push(flag);
        room.getPlayerById(event.fromId).setFlag(this.Name, originalFlags);
        await room.drawCards(num, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
ShiYuan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'shiyuan', description: 'shiyuan_description' })
], ShiYuan);
exports.ShiYuan = ShiYuan;
let ShiYuanShadow = class ShiYuanShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        return event.from === 7 /* PhaseFinish */ && owner.getFlag(this.GeneralName) !== undefined;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, this.GeneralName);
        return true;
    }
};
ShiYuanShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: ShiYuan.Name, description: ShiYuan.Description })
], ShiYuanShadow);
exports.ShiYuanShadow = ShiYuanShadow;
