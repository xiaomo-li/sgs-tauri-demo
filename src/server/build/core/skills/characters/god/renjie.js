"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenJie = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let RenJie = class RenJie extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */ || stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 137 /* DamageEvent */) {
            return content.toId === owner.Id;
        }
        else {
            const moveCardEvent = content;
            return (room.CurrentPlayerPhase === 5 /* DropCardStage */ &&
                moveCardEvent.infos.find(info => (info.moveReason === 4 /* SelfDrop */ || info.moveReason === 5 /* PassiveDrop */) &&
                    info.fromId === owner.Id) !== undefined);
        }
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(triggeredOnEvent);
        if (identifier === 137 /* DamageEvent */) {
            const damageEvent = triggeredOnEvent;
            room.addMark(skillUseEvent.fromId, "ren" /* Ren */, damageEvent.damage);
        }
        else {
            const moveCardEvent = triggeredOnEvent;
            let num = 0;
            if (moveCardEvent.infos.length === 1) {
                num += moveCardEvent.infos[0].movingCards.filter(card => !engine_1.Sanguosha.isVirtualCardId(card.card)).length;
            }
            else {
                const infos = moveCardEvent.infos.filter(info => (info.moveReason === 4 /* SelfDrop */ || info.moveReason === 5 /* PassiveDrop */) &&
                    info.fromId === skillUseEvent.fromId);
                for (const info of infos) {
                    num += info.movingCards.filter(card => !engine_1.Sanguosha.isVirtualCardId(card.card)).length;
                }
            }
            room.addMark(skillUseEvent.fromId, "ren" /* Ren */, num);
        }
        return true;
    }
};
RenJie = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'renjie', description: 'renjie_description' })
], RenJie);
exports.RenJie = RenJie;
