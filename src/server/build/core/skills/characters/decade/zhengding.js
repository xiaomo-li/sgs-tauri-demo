"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhengDing = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ZhengDing = class ZhengDing extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */ || stage === "CardResponsing" /* CardResponsing */;
    }
    canUse(room, owner, content) {
        if (content.fromId !== owner.Id ||
            !content.responseToEvent ||
            room.CurrentPlayer === owner ||
            event_packer_1.EventPacker.getIdentifier(content.responseToEvent) !== 125 /* CardEffectEvent */) {
            return false;
        }
        const responseToEvent = content.responseToEvent;
        return (responseToEvent.fromId !== owner.Id &&
            engine_1.Sanguosha.getCardById(content.cardId).Color === engine_1.Sanguosha.getCardById(responseToEvent.cardId).Color);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.changeMaxHp(event.fromId, 1);
        return true;
    }
};
ZhengDing = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'zhengding', description: 'zhengding_description' })
], ZhengDing);
exports.ZhengDing = ZhengDing;
