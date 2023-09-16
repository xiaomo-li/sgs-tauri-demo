"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MingCe = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let MingCe = class MingCe extends skill_1.ActiveSkill {
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
                .find(player => room.canAttack(first, player) && room.withinAttackDistance(first, player))
                ? true
                : false;
        }
        return canSlash ? targets.length === 2 : targets.length === 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets) {
        if (selectedTargets.length === 1) {
            const first = room.getPlayerById(selectedTargets[0]);
            const second = room.getPlayerById(target);
            return room.canAttack(first, second) && room.withinAttackDistance(first, second);
        }
        return owner !== target;
    }
    isAvailableCard(owner, room, cardId) {
        const card = engine_1.Sanguosha.getCardById(cardId);
        return card.GeneralName === 'slash' || card.is(1 /* Equip */);
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
        const { fromId, toIds, cardIds } = skillUseEvent;
        const first = toIds[0];
        const second = toIds[1];
        await room.moveCards({
            movingCards: cardIds.map(card => ({ card, fromArea: room.getPlayerById(fromId).cardFrom(card) })),
            fromId: skillUseEvent.fromId,
            toId: first,
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: fromId,
        });
        const options = ['mingce:draw'];
        if (second && room.canAttack(room.getPlayerById(first), room.getPlayerById(second))) {
            options.unshift('mingce:slash');
        }
        const askForChooseEvent = event_packer_1.EventPacker.createUncancellableEvent({
            options,
            conversation: second
                ? translation_json_tool_1.TranslationPack.translationJsonPatcher('please choose mingce options:{0}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(second))).extract()
                : translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose', this.Name).extract(),
            toId: first,
            triggeredBySkills: [this.Name],
        });
        room.notify(168 /* AskForChoosingOptionsEvent */, askForChooseEvent, first);
        const response = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, first);
        response.selectedOption = response.selectedOption || 'mingce:draw';
        if (response.selectedOption === 'mingce:slash') {
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
            await room.drawCards(1, first, 'top', first, this.Name);
        }
        return true;
    }
};
MingCe = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'mingce', description: 'mingce_description' })
], MingCe);
exports.MingCe = MingCe;
