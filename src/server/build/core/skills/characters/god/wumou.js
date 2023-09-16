"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WuMou = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let WuMou = class WuMou extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */;
    }
    canUse(room, owner, event) {
        const usedCard = engine_1.Sanguosha.getCardById(event.cardId);
        return usedCard.is(7 /* Trick */) && !usedCard.is(8 /* DelayedTrick */) && event.fromId === owner.Id;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const options = ['wumou: loseHp'];
        room.getMark(skillUseEvent.fromId, "nu" /* Wrath */) && options.unshift('wumou: loseMark');
        const askForChoosingOptionsEvent = {
            options,
            toId: skillUseEvent.fromId,
            conversation: 'wumou: please choose the cost for your Normal Trick',
            triggeredBySkills: [this.Name],
        };
        room.notify(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForChoosingOptionsEvent), skillUseEvent.fromId);
        const { selectedOption } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, skillUseEvent.fromId);
        if (selectedOption === 'wumou: loseMark') {
            room.addMark(skillUseEvent.fromId, "nu" /* Wrath */, -1);
        }
        else {
            await room.loseHp(skillUseEvent.fromId, 1);
        }
        return true;
    }
};
WuMou = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'wumou', description: 'wumou_description' })
], WuMou);
exports.WuMou = WuMou;
