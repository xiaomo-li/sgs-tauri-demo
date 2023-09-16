"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeiZhong = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let WeiZhong = class WeiZhong extends skill_1.TriggerSkill {
    audioIndex() {
        return 1;
    }
    isTriggerable(event) {
        return event_packer_1.EventPacker.getIdentifier(event) === 136 /* ChangeMaxHpEvent */;
    }
    canUse(room, owner, content) {
        return content.toId === owner.Id;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(room
            .getOtherPlayers(event.fromId)
            .find(player => room.getPlayerById(event.fromId).getCardIds(0 /* HandArea */).length >
            player.getCardIds(0 /* HandArea */).length)
            ? 1
            : 2, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
WeiZhong = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'weizhong', description: 'weizhong_description' })
], WeiZhong);
exports.WeiZhong = WeiZhong;
