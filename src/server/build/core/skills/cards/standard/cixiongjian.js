"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CiXiongJianSkill = void 0;
const tslib_1 = require("tslib");
const cixiongjian_1 = require("core/ai/skills/cards/cixiongjian");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
let CiXiongJianSkill = class CiXiongJianSkill extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return false;
    }
    isTriggerable(event, stage) {
        return (stage === "AfterAim" /* AfterAim */ &&
            event.byCardId !== undefined &&
            engine_1.Sanguosha.getCardById(event.byCardId).GeneralName === 'slash');
    }
    canUse(room, owner, content) {
        if (!content) {
            return false;
        }
        const target = room.getPlayerById(content.toId);
        return (content.fromId === owner.Id &&
            target.Gender !== owner.Gender &&
            owner.Gender !== 2 /* Neutral */ &&
            target.Gender !== 2 /* Neutral */);
    }
    isAvailableCard() {
        return false;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    async onTrigger(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const { triggeredOnEvent, fromId } = event;
        const aimEvent = precondition_1.Precondition.exists(triggeredOnEvent, 'Cannot find aim event in cixiongjian');
        const from = room.getPlayerById(fromId);
        const { toId } = aimEvent;
        const to = room.getPlayerById(toId);
        if (to.Gender === from.Gender) {
            return false;
        }
        if (to.getCardIds(0 /* HandArea */).length === 0) {
            await room.drawCards(1, fromId, undefined, toId, this.Name);
            return true;
        }
        const askForOptionsEvent = {
            options: ['cixiongjian:drop-card', 'cixiongjian:draw-card'],
            conversation: 'please choose',
            toId,
            askedBy: fromId,
            triggeredBySkills: [this.Name],
        };
        room.notify(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForOptionsEvent), toId);
        const response = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, toId);
        response.selectedOption = response.selectedOption || 'cixiongjian:draw-card';
        if (response.selectedOption === 'cixiongjian:drop-card') {
            const response = await room.askForCardDrop(toId, 1, [0 /* HandArea */], true, undefined, this.Name);
            response.droppedCards.length > 0 && (await room.dropCards(4 /* SelfDrop */, response.droppedCards, toId));
        }
        else {
            await room.drawCards(1, fromId, undefined, toId, this.Name);
        }
        return true;
    }
};
CiXiongJianSkill = tslib_1.__decorate([
    skill_1.AI(cixiongjian_1.CiXiongJianSkillTrigger),
    skill_1.CommonSkill({ name: 'cixiongjian', description: 'cixiongjian_description' })
], CiXiongJianSkill);
exports.CiXiongJianSkill = CiXiongJianSkill;
