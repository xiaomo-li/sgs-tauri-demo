"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuaiJu = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
let HuaiJu = class HuaiJu extends skill_1.TriggerSkill {
    async whenLosingSkill(room) {
        for (const player of room.getAlivePlayersFrom()) {
            if (player.getMark("orange" /* Orange */) > 0) {
                room.removeMark(player.Id, "orange" /* Orange */);
            }
        }
    }
    async whenDead(room) {
        for (const player of room.getAlivePlayersFrom()) {
            if (player.getMark("orange" /* Orange */) > 0) {
                room.removeMark(player.Id, "orange" /* Orange */);
            }
        }
    }
    isTriggerable(event, stage) {
        return (stage === "AfterGameBegan" /* AfterGameBegan */ ||
            stage === "CardDrawing" /* CardDrawing */ ||
            stage === "DamagedEffect" /* DamagedEffect */);
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 127 /* DrawCardEvent */) {
            const drawEvent = content;
            return (room.getPlayerById(drawEvent.fromId).getMark("orange" /* Orange */) > 0 &&
                room.CurrentPlayerPhase === 3 /* DrawCardStage */ &&
                drawEvent.bySpecialReason === 0 /* GameStage */);
        }
        else if (identifier === 137 /* DamageEvent */) {
            const damageEvent = content;
            return room.getPlayerById(damageEvent.toId).getMark("orange" /* Orange */) > 0;
        }
        return identifier === 143 /* GameBeginEvent */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const unknownEvent = triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 127 /* DrawCardEvent */) {
            const drawEvent = unknownEvent;
            drawEvent.drawAmount += 1;
        }
        else if (identifier === 137 /* DamageEvent */) {
            const damageEvent = unknownEvent;
            room.addMark(damageEvent.toId, "orange" /* Orange */, -1);
            damageEvent.damage = 0;
            event_packer_1.EventPacker.terminate(damageEvent);
        }
        else {
            room.addMark(fromId, "orange" /* Orange */, 3);
        }
        return true;
    }
};
HuaiJu = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'huaiju', description: 'huaiju_description' })
], HuaiJu);
exports.HuaiJu = HuaiJu;
