"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JianZhan = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JianZhan = class JianZhan extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    numberOfTargets() {
        return [];
    }
    targetFilter(room, owner, targets) {
        let canSlash = true;
        if (targets[0]) {
            const first = room.getPlayerById(targets[0]);
            canSlash = room
                .getOtherPlayers(targets[0])
                .find(player => first.Hp > player.Hp && room.canAttack(first, player) && room.withinAttackDistance(first, player))
                ? true
                : false;
        }
        return canSlash ? targets.length === 2 : targets.length === 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets) {
        if (selectedTargets.length === 1) {
            const first = room.getPlayerById(selectedTargets[0]);
            const second = room.getPlayerById(target);
            return first.Hp > second.Hp && room.canAttack(first, second) && room.withinAttackDistance(first, second);
        }
        return owner !== target;
    }
    isAvailableCard(owner, room, cardId) {
        return false;
    }
    getAnimationSteps(event) {
        var _a;
        const { fromId, toIds } = event;
        if (((_a = event.toIds) === null || _a === void 0 ? void 0 : _a.length) === 2) {
            return [
                { from: fromId, tos: [toIds[0]] },
                { from: toIds[0], tos: [toIds[1]] },
            ];
        }
        return event.toIds ? [{ from: event.fromId, tos: event.toIds }] : [];
    }
    resortTargets() {
        return false;
    }
    async onUse(room, event) {
        event.animation = this.getAnimationSteps(event);
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, toIds } = skillUseEvent;
        const first = toIds[0];
        const second = toIds[1];
        const options = ['jianzhan:draw'];
        if (second && room.canAttack(room.getPlayerById(first), room.getPlayerById(second))) {
            options.unshift('jianzhan:slash');
        }
        const askForChooseEvent = event_packer_1.EventPacker.createUncancellableEvent({
            options,
            conversation: second
                ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose jianzhan options: {1} {2}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(second))).extract()
                : translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId))).extract(),
            toId: first,
            triggeredBySkills: [this.Name],
        });
        room.notify(168 /* AskForChoosingOptionsEvent */, askForChooseEvent, first);
        const response = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, first);
        response.selectedOption = response.selectedOption || options[0];
        if (response.selectedOption === 'jianzhan:slash') {
            const slash = card_1.VirtualCard.create({
                cardName: 'slash',
                bySkill: this.Name,
            }).Id;
            const slashUseEvent = {
                fromId: first,
                cardId: slash,
                targetGroup: [[second]],
            };
            await room.useCard(slashUseEvent);
        }
        else {
            await room.drawCards(1, fromId, 'top', fromId, this.Name);
        }
        return true;
    }
};
JianZhan = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'jianzhan', description: 'jianzhan_description' })
], JianZhan);
exports.JianZhan = JianZhan;
