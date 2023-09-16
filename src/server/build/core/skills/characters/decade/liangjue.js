"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiangJue = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let LiangJue = class LiangJue extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        return (owner.Hp > 1 &&
            content.infos.find(info => (info.toId === owner.Id &&
                (info.toArea === 2 /* JudgeArea */ || info.toArea === 1 /* EquipArea */) &&
                info.movingCards.find(cardInfo => engine_1.Sanguosha.getCardById(cardInfo.card).isBlack())) ||
                (info.fromId === owner.Id &&
                    info.movingCards.find(cardInfo => engine_1.Sanguosha.getCardById(cardInfo.card).isBlack() &&
                        (cardInfo.fromArea === 1 /* EquipArea */ || cardInfo.fromArea === 2 /* JudgeArea */)))) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.loseHp(event.fromId, 1);
        await room.drawCards(2, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
LiangJue = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'liangjue', description: 'liangjue_description' })
], LiangJue);
exports.LiangJue = LiangJue;
