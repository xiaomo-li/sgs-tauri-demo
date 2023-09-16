"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeJi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let KeJi = class KeJi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "BeforePhaseChange" /* BeforePhaseChange */;
    }
    canUse(room, owner, content) {
        if (content.to === 5 /* DropCardStage */ && owner.Id === content.toPlayer) {
            return (room.Analytics.getRecordEvents(event => (event_packer_1.EventPacker.getIdentifier(event) === 124 /* CardUseEvent */ ||
                event_packer_1.EventPacker.getIdentifier(event) === 123 /* CardResponseEvent */) &&
                event.fromId === owner.Id &&
                engine_1.Sanguosha.getCardById(event.cardId).GeneralName === 'slash', owner.Id, 'round', [4 /* PlayCardStage */], 1).length === 0);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        await room.skip(skillUseEvent.fromId, 5 /* DropCardStage */);
        return true;
    }
};
KeJi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'keji', description: 'keji_description' })
], KeJi);
exports.KeJi = KeJi;
