"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FenJi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
let FenJi = class FenJi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, event) {
        return (event.infos.find(info => {
            if (!info.movingCards.find(card => card.fromArea === 0 /* HandArea */)) {
                return false;
            }
            if (info.moveReason === 1 /* ActivePrey */) {
                return !!info.fromId && !!info.toId && info.fromId !== info.toId;
            }
            else if (info.moveReason === 5 /* PassiveDrop */) {
                return !!info.fromId;
            }
            else if (info.moveReason === 3 /* PassiveMove */) {
                return !!info.toId && info.toArea === 0 /* HandArea */;
            }
            return false;
        }) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const moveCardEvent = triggeredOnEvent;
        await room.loseHp(skillUseEvent.fromId, 1);
        const info = moveCardEvent.infos.length === 1
            ? moveCardEvent.infos[0]
            : moveCardEvent.infos.find(info => {
                if (!info.movingCards.find(card => card.fromArea === 0 /* HandArea */)) {
                    return false;
                }
                if (info.moveReason === 1 /* ActivePrey */) {
                    return !!info.fromId && !!info.toId && info.fromId !== info.toId;
                }
                else if (info.moveReason === 5 /* PassiveDrop */) {
                    return !!info.fromId;
                }
                else if (info.moveReason === 3 /* PassiveMove */) {
                    return !!info.toId && info.toArea === 0 /* HandArea */;
                }
                return false;
            });
        await room.drawCards(2, info.fromId, 'top', undefined, this.Name);
        return true;
    }
};
FenJi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'fenji', description: 'fenji_description' })
], FenJi);
exports.FenJi = FenJi;
