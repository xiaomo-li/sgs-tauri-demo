"use strict";
var LiangYin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiangYinShadow = exports.LiangYin = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let LiangYin = LiangYin_1 = class LiangYin extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        return (content.infos.find(info => !LiangYin_1.LiangYinAreas.includes(info.toArea) &&
            room
                .getOtherPlayers(owner.Id)
                .find(player => owner.getCardIds(0 /* HandArea */).length < player.getCardIds(0 /* HandArea */).length) !== undefined) !== undefined);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return (room.getPlayerById(owner).getCardIds(0 /* HandArea */).length <
            room.getPlayerById(target).getCardIds(0 /* HandArea */).length);
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a liangyin target to draw 1 card?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        await room.drawCards(1, toIds[0], 'top', fromId, this.Name);
        return true;
    }
};
LiangYin.LiangYinAreas = [
    5 /* DrawStack */,
    4 /* DropStack */,
    1 /* EquipArea */,
    0 /* HandArea */,
    2 /* JudgeArea */,
    6 /* ProcessingArea */,
];
LiangYin = LiangYin_1 = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'liangyin', description: 'liangyin_description' })
], LiangYin);
exports.LiangYin = LiangYin;
let LiangYinShadow = class LiangYinShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        return (content.infos.find(info => info.movingCards &&
            info.movingCards.find(card => card.fromArea && !LiangYin.LiangYinAreas.includes(card.fromArea)) !== undefined &&
            info.toArea === 0 /* HandArea */ &&
            room
                .getOtherPlayers(owner.Id)
                .find(player => owner.getCardIds(0 /* HandArea */).length >
                player.getCardIds(0 /* HandArea */).length && player.getPlayerCards().length > 0) !== undefined) !== undefined);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        const to = room.getPlayerById(target);
        return (room.getPlayerById(owner).getCardIds(0 /* HandArea */).length >
            to.getCardIds(0 /* HandArea */).length && to.getPlayerCards().length > 0);
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a liangyin target to drop 1 card?', this.GeneralName).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { toIds } = event;
        if (!toIds) {
            return false;
        }
        const response = await room.askForCardDrop(toIds[0], 1, [0 /* HandArea */, 1 /* EquipArea */], true, undefined, this.Name);
        response.droppedCards.length > 0 &&
            (await room.dropCards(4 /* SelfDrop */, response.droppedCards, toIds[0], toIds[0], this.Name));
        return true;
    }
};
LiangYinShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: LiangYin.Name, description: LiangYin.Description })
], LiangYinShadow);
exports.LiangYinShadow = LiangYinShadow;
