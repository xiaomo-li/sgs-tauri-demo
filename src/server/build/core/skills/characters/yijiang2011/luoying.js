"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuoYing = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let LuoYing = class LuoYing extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, event) {
        return !!event.infos.find(info => !!info.movingCards.find(node => engine_1.Sanguosha.getCardById(node.card).Suit === 3 /* Club */) &&
            ((info.fromId &&
                info.fromId !== owner.Id &&
                (info.moveReason === 5 /* PassiveDrop */ || info.moveReason === 4 /* SelfDrop */)) ||
                (info.proposer &&
                    info.proposer !== owner.Id &&
                    info.movedByReason === "JudgeProcess" /* JudgeProcess */)));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillEffectEvent) {
        const moveCardEvent = skillEffectEvent.triggeredOnEvent;
        const luoyingCard = [];
        if (moveCardEvent.infos.length === 1) {
            luoyingCard.push(...moveCardEvent.infos[0].movingCards
                .filter(node => engine_1.Sanguosha.getCardById(node.card).Suit === 3 /* Club */)
                .map(node => node.card));
        }
        else {
            const infos = moveCardEvent.infos.filter(info => (info.fromId &&
                info.fromId !== skillEffectEvent.fromId &&
                (info.moveReason === 5 /* PassiveDrop */ || info.moveReason === 4 /* SelfDrop */)) ||
                (info.proposer &&
                    info.proposer !== skillEffectEvent.fromId &&
                    info.movedByReason === "JudgeProcess" /* JudgeProcess */));
            luoyingCard.push(...infos.reduce((cardIds, info) => cardIds.concat(info.movingCards
                .filter(node => engine_1.Sanguosha.getCardById(node.card).Suit === 3 /* Club */)
                .map(node => node.card)), []));
        }
        const askForChoosingLuoYingCard = {
            amount: [1, luoyingCard.length],
            cardIds: luoyingCard,
            toId: skillEffectEvent.fromId,
            customTitle: this.GeneralName,
            triggeredBySkills: [this.Name],
        };
        room.notify(166 /* AskForChoosingCardWithConditionsEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForChoosingLuoYingCard), skillEffectEvent.fromId);
        const { selectedCards } = await room.onReceivingAsyncResponseFrom(166 /* AskForChoosingCardWithConditionsEvent */, skillEffectEvent.fromId);
        await room.moveCards({
            movingCards: ((selectedCards === null || selectedCards === void 0 ? void 0 : selectedCards.length) ? selectedCards : luoyingCard).map(cardId => ({
                card: cardId,
                fromArea: 4 /* DropStack */,
            })),
            moveReason: 1 /* ActivePrey */,
            toId: skillEffectEvent.fromId,
            toArea: 0 /* HandArea */,
            proposer: skillEffectEvent.fromId,
            movedByReason: this.Name,
        });
        return true;
    }
};
LuoYing = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'luoying', description: 'luoying_description' })
], LuoYing);
exports.LuoYing = LuoYing;
