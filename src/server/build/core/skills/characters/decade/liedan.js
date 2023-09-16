"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LieDan = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const zhuangdan_1 = require("./zhuangdan");
let LieDan = class LieDan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (((content.playerId !== owner.Id && !room.getPlayerById(content.playerId).Dead) ||
            (content.playerId === owner.Id && owner.getMark("danlie" /* DanLie */) >= 5)) &&
            content.toStage === 3 /* PrepareStageStart */ &&
            !owner.getFlag(zhuangdan_1.ZhuangDan.Name));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const currentPlayer = event.triggeredOnEvent
            .playerId;
        const from = room.getPlayerById(event.fromId);
        if (currentPlayer !== event.fromId) {
            let num = 0;
            const opponent = room.getPlayerById(currentPlayer);
            from.Hp > opponent.Hp && num++;
            from.getCardIds(0 /* HandArea */).length > opponent.getCardIds(0 /* HandArea */).length && num++;
            from.getCardIds(1 /* EquipArea */).length > opponent.getCardIds(1 /* EquipArea */).length &&
                num++;
            if (num > 0) {
                await room.drawCards(num, event.fromId, 'top', event.fromId, this.Name);
                num === 3 && from.MaxHp < 8 && (await room.changeMaxHp(event.fromId, 1));
            }
            else {
                await room.loseHp(event.fromId, 1);
                room.addMark(event.fromId, "danlie" /* DanLie */, 1);
            }
        }
        else {
            await room.kill(from);
        }
        return true;
    }
};
LieDan = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'liedan', description: 'liedan_description' })
], LieDan);
exports.LieDan = LieDan;
