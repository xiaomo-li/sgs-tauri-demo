"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhenLiangYin = exports.ZhenLiang = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const mingren_1 = require("./mingren");
let ZhenLiang = class ZhenLiang extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.getSwitchSkillState(this.Name, true) === 0 /* Yang */;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target, selectedCards) {
        return room.withinAttackDistance(room.getPlayerById(owner), room.getPlayerById(target), undefined, selectedCards);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId, selectedCards, selectedTargets) {
        if (!room.canDropCard(owner, cardId)) {
            return false;
        }
        const ownerPlayer = room.getPlayerById(owner);
        const ren = ownerPlayer.getCardIds(3 /* OutsideArea */, mingren_1.MingRen.Name);
        return (ren &&
            engine_1.Sanguosha.getCardById(ren[0]).Color === engine_1.Sanguosha.getCardById(cardId).Color &&
            (selectedTargets.length > 0
                ? room.withinAttackDistance(ownerPlayer, room.getPlayerById(selectedTargets[0]), undefined, [cardId])
                : true));
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds, cardIds } = event;
        if (!toIds || !cardIds) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
        await room.damage({
            fromId,
            toId: toIds[0],
            damage: 1,
            damageType: "normal_property" /* Normal */,
            triggeredBySkills: [this.Name],
        });
        return true;
    }
};
ZhenLiang = tslib_1.__decorate([
    skill_1.SwitchSkill(),
    skill_1.CommonSkill({ name: 'zhenliang', description: 'zhenliang_description' })
], ZhenLiang);
exports.ZhenLiang = ZhenLiang;
let ZhenLiangYin = class ZhenLiangYin extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */ || stage === "AfterCardResponseEffect" /* AfterCardResponseEffect */;
    }
    canUse(room, owner, content) {
        const ren = owner.getCardIds(3 /* OutsideArea */, mingren_1.MingRen.Name);
        return (room.CurrentPlayer !== owner &&
            content.fromId === owner.Id &&
            owner.getSwitchSkillState(this.GeneralName, true) === 1 /* Yin */ &&
            ren &&
            engine_1.Sanguosha.getCardById(content.cardId).Color === engine_1.Sanguosha.getCardById(ren[0]).Color);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return true;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target to draw a card?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        await room.drawCards(1, toIds[0], 'top', fromId, this.GeneralName);
        return true;
    }
};
ZhenLiangYin = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.SwitchSkill(),
    skill_1.CommonSkill({ name: ZhenLiang.Name, description: ZhenLiang.Description })
], ZhenLiangYin);
exports.ZhenLiangYin = ZhenLiangYin;
