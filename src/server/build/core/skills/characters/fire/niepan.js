"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NiePan = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
let NiePan = class NiePan extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return ['bazhen', 'huoji', 'kanpo'];
    }
    isTriggerable(event, stage) {
        return stage === "RequestRescue" /* RequestRescue */;
    }
    canUse(room, owner, content) {
        return content.dying === owner.Id && content.rescuer === owner.Id;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillEffectEvent) {
        const { fromId } = skillEffectEvent;
        const from = room.getPlayerById(fromId);
        let wholeCards = from.getCardIds();
        wholeCards = wholeCards.filter(id => room.canDropCard(fromId, id));
        wholeCards.length > 0 && (await room.dropCards(4 /* SelfDrop */, wholeCards, fromId, fromId, this.Name));
        !from.isFaceUp() && (await room.turnOver(skillEffectEvent.fromId));
        from.ChainLocked && (await room.chainedOn(fromId));
        await room.drawCards(3, fromId, 'top', fromId, this.Name);
        await room.recover({
            recoveredHp: 3 - from.Hp,
            recoverBy: fromId,
            toId: fromId,
        });
        const options = ['bazhen', 'huoji', 'kanpo'];
        options.filter(option => !from.hasSkill(option));
        if (options.length > 0) {
            const askForChooseEvent = event_packer_1.EventPacker.createUncancellableEvent({
                options,
                conversation: 'please choose',
                toId: fromId,
                triggeredBySkills: [this.Name],
            });
            room.notify(168 /* AskForChoosingOptionsEvent */, askForChooseEvent, fromId);
            const response = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, fromId);
            response.selectedOption = response.selectedOption || options[0];
            await room.obtainSkill(fromId, response.selectedOption, true);
        }
        return true;
    }
};
NiePan = tslib_1.__decorate([
    skill_1.LimitSkill({ name: 'niepan', description: 'niepan_description' })
], NiePan);
exports.NiePan = NiePan;
