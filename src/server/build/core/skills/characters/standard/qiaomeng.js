"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiaoMeng = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let QiaoMeng = class QiaoMeng extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamageEffect" /* AfterDamageEffect */;
    }
    canUse(room, owner, content) {
        const damageCard = content.cardIds && engine_1.Sanguosha.getCardById(content.cardIds[0]);
        const to = room.getPlayerById(content.toId);
        return (owner.Id === content.fromId &&
            (content.toId === owner.Id
                ? to.getCardIds().filter(id => room.canDropCard(owner.Id, id)).length > 0
                : to.getCardIds().length > 0) &&
            !!damageCard &&
            damageCard.GeneralName === 'slash' &&
            !content.isFromChainedDamage);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const { fromId, toId } = triggeredOnEvent;
        const to = room.getPlayerById(toId);
        const options = {
            [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
            [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
            [2 /* JudgeArea */]: to.getCardIds(2 /* JudgeArea */),
        };
        const askForChooseCardEvent = {
            options,
            fromId: fromId,
            toId,
            triggeredBySkills: [this.Name],
        };
        const response = await room.askForChoosingPlayerCard(askForChooseCardEvent, askForChooseCardEvent.fromId, true, true);
        if (response && response.selectedCard !== undefined) {
            const card = engine_1.Sanguosha.getCardById(response.selectedCard);
            await room.dropCards(5 /* PassiveDrop */, [response.selectedCard], toId, fromId, this.Name);
            if ((card.is(5 /* DefenseRide */) || card.is(4 /* OffenseRide */)) && room.isCardInDropStack(card.Id)) {
                await room.moveCards({
                    movingCards: [{ card: response.selectedCard, fromArea: 4 /* DropStack */ }],
                    moveReason: 1 /* ActivePrey */,
                    fromId: toId,
                    toId: fromId,
                    toArea: 0 /* HandArea */,
                });
            }
        }
        return true;
    }
};
QiaoMeng = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'qiaomeng', description: 'qiaomeng_description' })
], QiaoMeng);
exports.QiaoMeng = QiaoMeng;
