"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiYuan = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
let JiYuan = class JiYuan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PlayerDying" /* PlayerDying */ || stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 128 /* MoveCardEvent */) {
            const moveEvent = content;
            return (moveEvent.infos.find(info => info.toId !== undefined &&
                info.toId !== owner.Id &&
                info.proposer === owner.Id &&
                info.toArea === 0 /* HandArea */) !== undefined);
        }
        else if (identifier === 152 /* PlayerDyingEvent */) {
            return true;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const unknownEvent = skillUseEvent.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 128 /* MoveCardEvent */) {
            const moveEvent = unknownEvent;
            const infos = moveEvent.infos.length === 1
                ? moveEvent.infos
                : moveEvent.infos.filter(info => info.toId !== undefined &&
                    info.toId !== skillUseEvent.fromId &&
                    info.proposer === skillUseEvent.fromId &&
                    info.toArea === 0 /* HandArea */);
            for (const info of infos) {
                info.toId && (await room.drawCards(1, info.toId, 'top', skillUseEvent.fromId, this.Name));
            }
        }
        else {
            const dyingEvent = unknownEvent;
            await room.drawCards(1, dyingEvent.dying, 'top', undefined, this.Name);
        }
        return true;
    }
};
JiYuan = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'jiyuan', description: 'jiyuan_description' })
], JiYuan);
exports.JiYuan = JiYuan;
