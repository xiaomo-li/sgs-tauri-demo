"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhanJi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const zishu_1 = require("../sp/zishu");
let ZhanJi = class ZhanJi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        return (room.CurrentPhasePlayer === owner &&
            room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
            content.infos.find(info => info.toId === owner.Id &&
                info.toArea === 0 /* HandArea */ &&
                info.moveReason === 0 /* CardDraw */ &&
                info.movedByReason !== this.Name &&
                info.movedByReason !== zishu_1.ZiShu.Name) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
ZhanJi = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'zhanji', description: 'zhanji_description' })
], ZhanJi);
exports.ZhanJi = ZhanJi;
