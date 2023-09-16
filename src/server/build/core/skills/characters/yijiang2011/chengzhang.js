"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChengZhang = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const jiushi_1 = require("./jiushi");
let ChengZhang = class ChengZhang extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, event) {
        return (event.playerId === owner.Id &&
            event.toStage === 3 /* PrepareStageStart */ &&
            room.enableToAwaken(this.Name, owner));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillEffectEvent) {
        const player = room.getPlayerById(skillEffectEvent.fromId);
        await room.recover({
            recoveredHp: 1,
            toId: skillEffectEvent.fromId,
            recoverBy: skillEffectEvent.fromId,
        });
        await room.drawCards(1, skillEffectEvent.fromId, 'top', undefined, this.Name);
        player.setFlag(jiushi_1.JiuShi.levelUp, true);
        return true;
    }
};
ChengZhang = tslib_1.__decorate([
    skill_wrappers_1.AwakeningSkill({ name: 'chengzhang', description: 'chengzhang_description' })
], ChengZhang);
exports.ChengZhang = ChengZhang;
