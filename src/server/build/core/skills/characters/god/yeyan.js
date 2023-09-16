"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YeYan = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YeYan = class YeYan extends skill_1.ActiveSkill {
    canUse() {
        return true;
    }
    numberOfTargets() {
        return [1, 3];
    }
    numberOfCards() {
        return [0, 4];
    }
    cardFilter(room, owner, cards) {
        return cards.length <= 4;
    }
    isAvailableCard(owner, room, cardId, selectedCards, selectedTargets) {
        if (!room.canDropCard(owner, cardId) || selectedTargets.length === 3) {
            return false;
        }
        return !selectedCards.find(id => engine_1.Sanguosha.getCardById(id).Suit === engine_1.Sanguosha.getCardById(cardId).Suit);
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets) {
        if (selectedCards.length === 4) {
            return selectedTargets.length < 2;
        }
        return true;
    }
    async beforeUse(room, skillUseEvent) {
        let options = [];
        let conversation = '';
        const targets = skillUseEvent.toIds;
        if (!skillUseEvent.cardIds) {
            options = ['yeyan: 1 point'];
            conversation = translation_json_tool_1.TranslationPack.translationJsonPatcher('please assign damage for {0}' + (targets.length > 1 ? ', {1}' : '') + (targets.length > 2 ? ', {2}' : ''), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(targets[0])), targets.length > 1 ? translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(targets[1])) : '', targets.length > 2 ? translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(targets[2])) : '').extract();
        }
        else {
            if (targets.length === 1) {
                options = ['yeyan: 2 point', 'yeyan: 3 point'];
                conversation = translation_json_tool_1.TranslationPack.translationJsonPatcher('please assign damage for {0}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(targets[0]))).extract();
            }
            else if (targets.length === 2) {
                options = ['yeyan: 1 point', 'yeyan: 2 point'];
                conversation = translation_json_tool_1.TranslationPack.translationJsonPatcher('please assign x damage for {0}, and {1} will get (3 - x) damage', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(targets[0])), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(targets[1]))).extract();
            }
        }
        options.push('yeyan: cancel');
        const askForChoosingOptionsEvent = {
            options,
            toId: skillUseEvent.fromId,
            conversation,
            ignoreNotifiedStatus: true,
            triggeredBySkills: [this.Name],
        };
        room.notify(168 /* AskForChoosingOptionsEvent */, askForChoosingOptionsEvent, skillUseEvent.fromId);
        const { selectedOption } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, skillUseEvent.fromId);
        if (selectedOption === 'yeyan: 1 point') {
            if (!skillUseEvent.cardIds) {
                targets.forEach(target => {
                    event_packer_1.EventPacker.addMiddleware({ tag: target, data: 1 }, skillUseEvent);
                });
            }
            else {
                event_packer_1.EventPacker.addMiddleware({ tag: targets[0], data: 1 }, skillUseEvent);
                event_packer_1.EventPacker.addMiddleware({ tag: targets[1], data: 2 }, skillUseEvent);
            }
        }
        else if (selectedOption === 'yeyan: 2 point') {
            if (targets.length === 1) {
                event_packer_1.EventPacker.addMiddleware({ tag: targets[0], data: 2 }, skillUseEvent);
            }
            else {
                event_packer_1.EventPacker.addMiddleware({ tag: targets[0], data: 2 }, skillUseEvent);
                event_packer_1.EventPacker.addMiddleware({ tag: targets[1], data: 1 }, skillUseEvent);
            }
        }
        else if (selectedOption === 'yeyan: 3 point') {
            event_packer_1.EventPacker.addMiddleware({ tag: targets[0], data: 3 }, skillUseEvent);
        }
        else {
            return false;
        }
        return true;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        if (skillUseEvent.cardIds && skillUseEvent.cardIds.length === 4) {
            await room.dropCards(4 /* SelfDrop */, skillUseEvent.cardIds, skillUseEvent.fromId, skillUseEvent.fromId, this.Name);
            await room.loseHp(skillUseEvent.fromId, 3);
        }
        const targets = skillUseEvent.toIds;
        for (const target of targets) {
            await room.damage({
                fromId: skillUseEvent.fromId,
                toId: target,
                damage: event_packer_1.EventPacker.getMiddleware(target, skillUseEvent),
                damageType: "fire_property" /* Fire */,
                triggeredBySkills: [this.Name],
            });
        }
        return true;
    }
};
YeYan = tslib_1.__decorate([
    skill_wrappers_1.LimitSkill({ name: 'yeyan', description: 'yeyan_description' })
], YeYan);
exports.YeYan = YeYan;
