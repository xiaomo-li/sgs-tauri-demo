"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouKeJiBlocker = exports.MouKeJiShadow = exports.MouKeJi = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const dujiang_1 = require("./dujiang");
let MouKeJi = class MouKeJi extends skill_1.ActiveSkill {
    whenRefresh(room, owner) {
        room.removeFlag(owner.Id, this.Name);
    }
    canUse(room, owner) {
        return ((owner.hasUsedSkill(dujiang_1.DuJiang.Name) ? !owner.hasUsedSkill(this.Name) : owner.hasUsedSkillTimes(this.Name) < 2) &&
            (owner.Hp > 0 || owner.getPlayerCards().length > 0));
    }
    cardFilter(room, owner, cards) {
        const optionsChosen = owner.getFlag(this.Name) || [];
        if (optionsChosen.length === 0) {
            return cards.length < 2;
        }
        return owner.getFlag(this.Name)[0] === 0 /* Discard */
            ? cards.length === 0
            : cards.length === 1;
    }
    numberOfTargets() {
        return 0;
    }
    isAvailableTarget(owner, room, target) {
        return false;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const optionsChosen = room.getFlag(event.fromId, this.Name) || [];
        if (event.cardIds) {
            await room.dropCards(4 /* SelfDrop */, event.cardIds, event.fromId, event.fromId, this.Name);
            await room.changeArmor(event.fromId, 1);
            optionsChosen.push(0 /* Discard */);
        }
        else {
            await room.loseHp(event.fromId, 1);
            await room.changeArmor(event.fromId, 2);
            optionsChosen.push(1 /* LoseHp */);
        }
        room.setFlag(event.fromId, this.Name, optionsChosen);
        return true;
    }
};
MouKeJi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'mou_keji', description: 'mou_keji_description' })
], MouKeJi);
exports.MouKeJi = MouKeJi;
let MouKeJiShadow = class MouKeJiShadow extends skill_1.RulesBreakerSkill {
    breakAdditionalCardHoldNumber(room, owner) {
        return owner.Armor;
    }
};
MouKeJiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: MouKeJi.Name, description: MouKeJi.Description })
], MouKeJiShadow);
exports.MouKeJiShadow = MouKeJiShadow;
let MouKeJiBlocker = class MouKeJiBlocker extends skill_1.FilterSkill {
    canUseCard(cardId, room, owner, onResponse, isCardResponse) {
        if (isCardResponse || room.getPlayerById(owner).Dying) {
            return true;
        }
        if (cardId instanceof card_matcher_1.CardMatcher) {
            return !cardId.match(new card_matcher_1.CardMatcher({ name: ['peach'] }));
        }
        else {
            return engine_1.Sanguosha.getCardById(cardId).GeneralName !== 'peach';
        }
    }
};
MouKeJiBlocker = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: MouKeJiShadow.Name, description: MouKeJiShadow.Description })
], MouKeJiBlocker);
exports.MouKeJiBlocker = MouKeJiBlocker;
