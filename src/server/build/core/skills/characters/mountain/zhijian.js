"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhiJianShadow = exports.ZhiJian = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ZhiJian = class ZhiJian extends skill_1.ActiveSkill {
    canUse() {
        return true;
    }
    cardFilter(room, owner, cards, selectedTargets, cardId) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId, selectedCards, selectedTargets, containerCard) {
        return engine_1.Sanguosha.getCardById(cardId).is(1 /* Equip */);
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard) {
        if (selectedCards.length === 1) {
            return room.canPlaceCardTo(selectedCards[0], target);
        }
        else {
            return false;
        }
    }
    async onUse() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, toIds, cardIds } = skillUseEvent;
        const from = room.getPlayerById(fromId);
        const card = cardIds[0];
        await room.moveCards({
            movingCards: [{ card, fromArea: from.cardFrom(card) }],
            moveReason: 2 /* ActiveMove */,
            fromId,
            toId: toIds[0],
            toArea: 1 /* EquipArea */,
            proposer: fromId,
            triggeredBySkills: [this.Name],
        });
        await room.drawCards(1, fromId, undefined, fromId, this.Name);
        return true;
    }
};
ZhiJian = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'zhijian', description: 'zhijian_description' })
], ZhiJian);
exports.ZhiJian = ZhiJian;
let ZhiJianShadow = class ZhiJianShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */;
    }
    canUse(room, owner, content) {
        const card = engine_1.Sanguosha.getCardById(content.cardId);
        return content.fromId === owner.Id && card.is(1 /* Equip */);
    }
    getSkillLog(room, owner) {
        return 'zhijian: do you wanna use draw 1 card';
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(1, event.fromId, undefined, event.fromId, this.GeneralName);
        return true;
    }
};
ZhiJianShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: ZhiJian.Name, description: ZhiJian.Description })
], ZhiJianShadow);
exports.ZhiJianShadow = ZhiJianShadow;
