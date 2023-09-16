"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuangKong = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let HuangKong = class HuangKong extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterAimmed" /* AfterAimmed */;
    }
    canUse(room, owner, content) {
        return (content.toId === owner.Id &&
            room.CurrentPlayer !== owner &&
            owner.getCardIds(0 /* HandArea */).length === 0 &&
            (engine_1.Sanguosha.getCardById(content.byCardId).GeneralName === 'slash' ||
                engine_1.Sanguosha.getCardById(content.byCardId).isCommonTrick()));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(2, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
HuangKong = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'huangkong', description: 'huangkong_description' })
], HuangKong);
exports.HuangKong = HuangKong;
