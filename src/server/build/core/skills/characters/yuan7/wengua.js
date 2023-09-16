"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WenGuaSide = exports.WenGuaShadow = exports.WenGua = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let WenGua = class WenGua extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    numberOfTargets() {
        return 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return true;
    }
    isAvailableTarget(owner, room, target) {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.cardIds) {
            return false;
        }
        const options = ['wengua:top', 'wengua:bottom'];
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose wengua options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(event.cardIds[0])).extract(),
            toId: event.fromId,
            triggeredBySkills: [this.Name],
        }, event.fromId, true);
        response.selectedOption = response.selectedOption || options[0];
        await room.moveCards({
            movingCards: [{ card: event.cardIds[0], fromArea: room.getPlayerById(event.fromId).cardFrom(event.cardIds[0]) }],
            fromId: event.fromId,
            toArea: 5 /* DrawStack */,
            placeAtTheBottomOfDrawStack: response.selectedOption !== options[0],
            moveReason: 7 /* PlaceToDrawStack */,
            proposer: event.fromId,
            triggeredBySkills: [this.Name],
        });
        await room.drawCards(1, event.fromId, response.selectedOption === options[0] ? 'bottom' : 'top', event.fromId, this.Name);
        return true;
    }
};
WenGua = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'wengua', description: 'wengua_description' })
], WenGua);
exports.WenGua = WenGua;
let WenGuaShadow = class WenGuaShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    async whenLosingSkill(room) {
        room.uninstallSideEffectSkill(5 /* WenGua */);
    }
    async whenObtainingSkill(room, owner) {
        room.installSideEffectSkill(5 /* WenGua */, WenGuaSide.Name, owner.Id);
    }
    isTriggerable(event, stage) {
        return stage === "BeforeGameStart" /* BeforeGameStart */;
    }
    canUse(room, owner, content) {
        return true;
    }
    async onTrigger(room, event) {
        event.translationsMessage = undefined;
        return true;
    }
    async onEffect(room, event) {
        room.installSideEffectSkill(5 /* WenGua */, WenGuaSide.Name, event.fromId);
        return true;
    }
};
WenGuaShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: WenGua.Name, description: WenGua.Description })
], WenGuaShadow);
exports.WenGuaShadow = WenGuaShadow;
let WenGuaSide = class WenGuaSide extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return true;
    }
    isAvailableTarget(owner, room, target) {
        return (!!room
            .getPlayerById(target)
            .getPlayerSkills('common')
            .find(skill => skill.Name === WenGua.Name) && target !== owner);
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.cardIds || !event.toIds) {
            return false;
        }
        const owner = event.toIds[0];
        await room.moveCards({
            movingCards: [{ card: event.cardIds[0], fromArea: room.getPlayerById(event.fromId).cardFrom(event.cardIds[0]) }],
            fromId: event.fromId,
            toId: owner,
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: event.fromId,
            triggeredBySkills: [WenGua.Name],
        });
        const resp = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options: ['yes', 'no'],
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to use this skill for {1}: {2}', WenGua.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(event.cardIds[0])).extract(),
            toId: owner,
            triggeredBySkills: [WenGua.Name],
        }, owner, true);
        if (resp.selectedOption !== 'yes') {
            return true;
        }
        const options = ['wengua:top', 'wengua:bottom'];
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose wengua options: {1} {2}', WenGua.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(event.cardIds[0]), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract(),
            toId: owner,
            triggeredBySkills: [WenGua.Name],
        }, owner, true);
        response.selectedOption = response.selectedOption || options[0];
        await room.moveCards({
            movingCards: [{ card: event.cardIds[0], fromArea: 0 /* HandArea */ }],
            fromId: owner,
            toArea: 5 /* DrawStack */,
            placeAtTheBottomOfDrawStack: response.selectedOption !== options[0],
            moveReason: 7 /* PlaceToDrawStack */,
            proposer: owner,
            triggeredBySkills: [WenGua.Name],
        });
        for (const player of [event.fromId, owner]) {
            await room.drawCards(1, player, response.selectedOption === options[0] ? 'bottom' : 'top', player, WenGua.Name);
        }
        return true;
    }
};
WenGuaSide = tslib_1.__decorate([
    skill_wrappers_1.SideEffectSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 'side_wengua_s', description: 'side_wengua_s_description' })
], WenGuaSide);
exports.WenGuaSide = WenGuaSide;
