"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiLinGongSkill = void 0;
const tslib_1 = require("tslib");
const qilingong_1 = require("core/ai/skills/cards/qilingong");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
let QiLinGongSkill = class QiLinGongSkill extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "DamageEffect" /* DamageEffect */ && !event.isFromChainedDamage;
    }
    canUse(room, owner, content) {
        if (!content) {
            return false;
        }
        const { cardIds, fromId, toId } = content;
        const to = room.getPlayerById(toId);
        const horses = to.getCardIds(1 /* EquipArea */).filter(cardId => {
            const card = engine_1.Sanguosha.getCardById(cardId);
            return card.is(4 /* OffenseRide */) || card.is(5 /* DefenseRide */);
        });
        if (horses.length === 0) {
            return false;
        }
        if (!cardIds || cardIds.length === 0 || !fromId) {
            return false;
        }
        return owner.Id === fromId && engine_1.Sanguosha.getCardById(cardIds[0]).GeneralName === 'slash';
    }
    async onTrigger(room, content) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const event = precondition_1.Precondition.exists(triggeredOnEvent, 'Unable to get damage event');
        const to = room.getPlayerById(event.toId);
        const chooseCardEvent = {
            toId: to.Id,
            cardIds: to.getCardIds(1 /* EquipArea */).filter(cardId => {
                const card = engine_1.Sanguosha.getCardById(cardId);
                return card.is(4 /* OffenseRide */) || card.is(5 /* DefenseRide */);
            }),
            amount: 1,
            triggeredBySkills: [this.Name],
        };
        room.notify(165 /* AskForChoosingCardEvent */, event_packer_1.EventPacker.createUncancellableEvent(chooseCardEvent), event.fromId);
        const response = await room.onReceivingAsyncResponseFrom(165 /* AskForChoosingCardEvent */, event.fromId);
        if (response.selectedCards === undefined) {
            return true;
        }
        await room.dropCards(5 /* PassiveDrop */, response.selectedCards, to.Id, skillUseEvent.fromId, this.Name);
        return true;
    }
};
QiLinGongSkill = tslib_1.__decorate([
    skill_1.AI(qilingong_1.QiLinGongSkillTrigger),
    skill_1.CommonSkill({ name: 'qilingong', description: 'qilingong_description' })
], QiLinGongSkill);
exports.QiLinGongSkill = QiLinGongSkill;
