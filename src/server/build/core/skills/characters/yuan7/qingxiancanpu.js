"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeXian = exports.RouXian = exports.LieXian = exports.JiXian = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JiXian = class JiXian extends skill_1.TriggerSkill {
    audioIndex() {
        return 1;
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        if (content.toId !== owner.Id || room.AlivePlayers.find(player => player.Dying)) {
            return false;
        }
        const source = content.fromId;
        return !!source && !room.getPlayerById(source).Dead;
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to let {1} lose 1 hp and use a equip card from draw pile?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const source = event.triggeredOnEvent.fromId;
        await room.loseHp(source, 1);
        const equips = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ type: [1 /* Equip */] }));
        if (equips.length > 0) {
            const randomEquip = equips[Math.floor(Math.random() * equips.length)];
            await room.useCard({
                fromId: source,
                targetGroup: [[source]],
                cardId: randomEquip,
                customFromArea: 5 /* DrawStack */,
            });
        }
        return true;
    }
};
JiXian = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'jixian', description: 'jixian_description' })
], JiXian);
exports.JiXian = JiXian;
let LieXian = class LieXian extends skill_1.TriggerSkill {
    audioIndex() {
        return 1;
    }
    isTriggerable(event, stage) {
        return stage === "AfterRecoverEffect" /* AfterRecoverEffect */;
    }
    canUse(room, owner, content) {
        return content.toId === owner.Id && !room.AlivePlayers.find(player => player.Dying);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target to lose 1 hp and use a equip card from draw pile?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        await room.loseHp(event.toIds[0], 1);
        const equips = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ type: [1 /* Equip */] }));
        if (equips.length > 0) {
            const randomEquip = equips[Math.floor(Math.random() * equips.length)];
            await room.useCard({
                fromId: event.toIds[0],
                targetGroup: [[event.toIds[0]]],
                cardId: randomEquip,
                customFromArea: 5 /* DrawStack */,
            });
        }
        return true;
    }
};
LieXian = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'liexian', description: 'liexian_description' })
], LieXian);
exports.LieXian = LieXian;
let RouXian = class RouXian extends skill_1.TriggerSkill {
    audioIndex() {
        return 1;
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        if (content.toId !== owner.Id || room.AlivePlayers.find(player => player.Dying)) {
            return false;
        }
        const source = content.fromId;
        return !!source && !room.getPlayerById(source).Dead && room.getPlayerById(source).LostHp > 0;
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to let {1} recover 1 hp and discard a equip card?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const source = event.triggeredOnEvent.fromId;
        await room.recover({
            toId: source,
            recoveredHp: 1,
            recoverBy: event.fromId,
        });
        const playerEquips = room
            .getPlayerById(source)
            .getPlayerCards()
            .filter(cardId => engine_1.Sanguosha.getCardById(cardId).is(1 /* Equip */));
        if (playerEquips.length > 0) {
            const randomEquip = playerEquips[Math.floor(Math.random() * playerEquips.length)];
            await room.dropCards(4 /* SelfDrop */, [randomEquip], source, source, this.Name);
        }
        return true;
    }
};
RouXian = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'rouxian', description: 'rouxian_description' })
], RouXian);
exports.RouXian = RouXian;
let HeXian = class HeXian extends skill_1.TriggerSkill {
    audioIndex() {
        return 1;
    }
    isTriggerable(event, stage) {
        return stage === "AfterRecoverEffect" /* AfterRecoverEffect */;
    }
    canUse(room, owner, content) {
        return content.toId === owner.Id && !room.AlivePlayers.find(player => player.Dying);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner && room.getPlayerById(target).LostHp > 0;
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target to recover 1 hp and discard a equip card?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        await room.recover({
            toId: event.toIds[0],
            recoveredHp: 1,
            recoverBy: event.fromId,
        });
        const playerEquips = room
            .getPlayerById(event.toIds[0])
            .getPlayerCards()
            .filter(cardId => engine_1.Sanguosha.getCardById(cardId).is(1 /* Equip */));
        if (playerEquips.length > 0) {
            const randomEquip = playerEquips[Math.floor(Math.random() * playerEquips.length)];
            await room.dropCards(4 /* SelfDrop */, [randomEquip], event.toIds[0], event.toIds[0], this.Name);
        }
        return true;
    }
};
HeXian = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'hexian', description: 'hexian_description' })
], HeXian);
exports.HeXian = HeXian;
