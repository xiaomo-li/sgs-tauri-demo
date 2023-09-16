"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeiJun = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let FeiJun = class FeiJun extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.getPlayerCards().length > 0;
    }
    numberOfTargets() {
        return 0;
    }
    isAvailableTarget() {
        return false;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard() {
        return true;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, cardIds } = event;
        if (!cardIds) {
            return false;
        }
        const from = room.getPlayerById(fromId);
        await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
        const targets = room
            .getOtherPlayers(fromId)
            .filter(player => player.getCardIds(1 /* EquipArea */).length > from.getCardIds(1 /* EquipArea */).length ||
            player.getCardIds(0 /* HandArea */).length > from.getCardIds(0 /* HandArea */).length)
            .map(player => player.Id);
        const resp = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
            players: targets,
            toId: fromId,
            requiredAmount: 1,
            conversation: 'feijun: please choose a target',
            triggeredBySkills: [this.Name],
        }, fromId);
        if (resp.selectedPlayers && resp.selectedPlayers.length > 0) {
            const originalPlayers = room.getFlag(resp.selectedPlayers[0], this.Name) || [];
            if (!originalPlayers.includes(fromId)) {
                originalPlayers.push(fromId);
                room.setFlag(resp.selectedPlayers[0], this.Name, originalPlayers, this.Name, originalPlayers);
                event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: true }, event);
            }
            const target = room.getPlayerById(resp.selectedPlayers[0]);
            let selected = '';
            if (target.getCardIds(1 /* EquipArea */).length > from.getCardIds(1 /* EquipArea */).length &&
                target.getCardIds(0 /* HandArea */).length > from.getCardIds(0 /* HandArea */).length) {
                const options = ['feijun:hand', 'feijun:equip'];
                const { selectedOption } = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent({
                    options,
                    toId: fromId,
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose feijun options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(target)).extract(),
                }), fromId);
                selected = selectedOption || options[0];
            }
            if (selected === 'feijun:hand' ||
                (selected === '' &&
                    target.getCardIds(0 /* HandArea */).length > from.getCardIds(0 /* HandArea */).length)) {
                const response = await room.doAskForCommonly(163 /* AskForCardEvent */, event_packer_1.EventPacker.createUncancellableEvent({
                    cardAmount: 1,
                    toId: resp.selectedPlayers[0],
                    reason: this.Name,
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: you need to give a card to {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId))).extract(),
                    fromArea: [0 /* HandArea */, 1 /* EquipArea */],
                    triggeredBySkills: [this.Name],
                }), resp.selectedPlayers[0]);
                const wholeCards = target.getPlayerCards();
                response.selectedCards = response.selectedCards || wholeCards[Math.floor(Math.random() * wholeCards.length)];
                await room.moveCards({
                    movingCards: [{ card: response.selectedCards[0], fromArea: target.cardFrom(response.selectedCards[0]) }],
                    moveReason: 2 /* ActiveMove */,
                    fromId: resp.selectedPlayers[0],
                    toId: fromId,
                    toArea: 0 /* HandArea */,
                    proposer: fromId,
                });
            }
            else {
                const response = await room.askForCardDrop(resp.selectedPlayers[0], 1, [0 /* HandArea */, 1 /* EquipArea */], true, target.getPlayerCards().filter(id => !engine_1.Sanguosha.getCardById(id).is(1 /* Equip */)), this.Name, translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please drop a equip card', this.Name).extract());
                response.droppedCards.length > 0 &&
                    (await room.dropCards(4 /* SelfDrop */, response.droppedCards, resp.selectedPlayers[0], resp.selectedPlayers[0], this.Name));
            }
        }
        return true;
    }
};
FeiJun = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'feijun', description: 'feijun_description' })
], FeiJun);
exports.FeiJun = FeiJun;
