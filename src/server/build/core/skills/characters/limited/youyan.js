"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouYan = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const algorithm_1 = require("core/shares/libs/algorithm");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let YouYan = class YouYan extends skill_1.TriggerSkill {
    isRefreshAt(room, owner, stage) {
        return [0 /* PhaseBegin */, 5 /* DropCardStage */].includes(stage);
    }
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, event) {
        if (owner.hasUsedSkill(this.Name) || room.CurrentPlayer !== owner) {
            return false;
        }
        const suitsRecorded = [];
        for (const info of event.infos) {
            if (info.fromId !== owner.Id ||
                ![4 /* SelfDrop */, 5 /* PassiveDrop */].includes(info.moveReason)) {
                continue;
            }
            for (const cardInfo of info.movingCards) {
                if (cardInfo.asideMove ||
                    (cardInfo.fromArea !== 0 /* HandArea */ && cardInfo.fromArea !== 1 /* EquipArea */)) {
                    continue;
                }
                const suit = engine_1.Sanguosha.getCardById(cardInfo.card).Suit;
                suitsRecorded.includes(suit) || suitsRecorded.push(suit);
            }
            if (suitsRecorded.length > 3) {
                break;
            }
        }
        if (suitsRecorded.length > 0 && suitsRecorded.length < 4) {
            owner.setFlag(this.Name, suitsRecorded);
            return true;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const suitsDiscarded = room.getFlag(event.fromId, this.Name) || [];
        const uncontainedSuits = algorithm_1.Algorithm.unique([3 /* Club */, 1 /* Spade */, 4 /* Diamond */, 2 /* Heart */], suitsDiscarded);
        const toObtain = [];
        for (const cardSuit of uncontainedSuits) {
            const cardsMatched = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ suit: [cardSuit] }));
            cardsMatched.length > 0 && toObtain.push(cardsMatched[Math.floor(Math.random() * cardsMatched.length)]);
        }
        toObtain.length > 0 &&
            (await room.moveCards({
                movingCards: toObtain.map(card => ({ card, fromArea: 5 /* DrawStack */ })),
                toId: event.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: event.fromId,
                triggeredBySkills: [this.Name],
            }));
        return true;
    }
};
YouYan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'youyan', description: 'youyan_description' })
], YouYan);
exports.YouYan = YouYan;
