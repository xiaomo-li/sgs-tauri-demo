"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QingJiaoShadow = exports.QingJiao = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const functional_1 = require("core/shares/libs/functional");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let QingJiao = class QingJiao extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && content.toStage === 13 /* PlayCardStageStart */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.getPlayerById(event.fromId).setFlag(this.Name, true);
        await room.dropCards(4 /* SelfDrop */, room.getPlayerById(event.fromId).getPlayerCards(), event.fromId, event.fromId, this.Name);
        const dic = {};
        for (const cardId of [
            ...room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ type: [0 /* Basic */, 7 /* Trick */, 1 /* Equip */] })),
            ...room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ type: [0 /* Basic */, 7 /* Trick */, 1 /* Equip */] }), false),
        ]) {
            const card = engine_1.Sanguosha.getCardById(cardId);
            const index = card.is(1 /* Equip */)
                ? functional_1.Functional.getCardTypeRawText(card.EquipType)
                : card.GeneralName;
            if (dic[index] === undefined) {
                dic[index] = [];
            }
            else {
                dic[index].push(cardId);
            }
        }
        const toGain = [];
        while (toGain.length < 8) {
            let sum = 0;
            for (const [, cardIds] of Object.entries(dic)) {
                sum += cardIds.length;
            }
            const randomValue = Math.floor(Math.random() * sum + 1);
            let currentSum = 0;
            let currentCardName = 'slash';
            for (const [cardName, cardIds] of Object.entries(dic)) {
                currentSum += cardIds.length;
                if (randomValue <= currentSum) {
                    currentCardName = cardName;
                    toGain.push(cardIds[cardIds.length - (currentSum - randomValue) - 1]);
                    break;
                }
            }
            delete dic[currentCardName];
        }
        await room.moveCards({
            movingCards: toGain.map(card => ({
                card,
                fromArea: room.isCardInDropStack(card) ? 4 /* DropStack */ : 5 /* DrawStack */,
            })),
            toId: event.fromId,
            toArea: 0 /* HandArea */,
            moveReason: 1 /* ActivePrey */,
            triggeredBySkills: [this.Name],
        });
        return true;
    }
};
QingJiao = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'qingjiao', description: 'qingjiao_description' })
], QingJiao);
exports.QingJiao = QingJiao;
let QingJiaoShadow = class QingJiaoShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner) {
        return !room.getFlag(owner, this.GeneralName);
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 19 /* FinishStageStart */ &&
            owner.getPlayerCards().length > 0 &&
            owner.getFlag(this.GeneralName) === true);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.getPlayerById(event.fromId).removeFlag(this.GeneralName);
        await room.dropCards(4 /* SelfDrop */, room.getPlayerById(event.fromId).getPlayerCards(), event.fromId, event.fromId, this.Name);
        return true;
    }
};
QingJiaoShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: QingJiao.Name, description: QingJiao.Description })
], QingJiaoShadow);
exports.QingJiaoShadow = QingJiaoShadow;
