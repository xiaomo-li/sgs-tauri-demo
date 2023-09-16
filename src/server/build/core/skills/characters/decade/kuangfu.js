"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KuangFu = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let KuangFu = class KuangFu extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return room.getPlayerById(target).getCardIds(1 /* EquipArea */).length > 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableCard() {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        const options = {
            [1 /* EquipArea */]: room.getPlayerById(toIds[0]).getCardIds(1 /* EquipArea */),
        };
        const response = await room.askForChoosingPlayerCard({
            fromId,
            toId: toIds[0],
            options,
            triggeredBySkills: [this.Name],
        }, fromId, true, true);
        if (!response) {
            return false;
        }
        await room.dropCards(fromId === toIds[0] ? 4 /* SelfDrop */ : 5 /* PassiveDrop */, [response.selectedCard], toIds[0], fromId, this.Name);
        const virtualSlash = card_1.VirtualCard.create({ cardName: 'slash', bySkill: this.Name }).Id;
        const canSlashTo = room
            .getOtherPlayers(fromId)
            .filter(player => room.canUseCardTo(virtualSlash, room.getPlayerById(fromId), player, true))
            .map(player => player.Id);
        if (canSlashTo.length > 0) {
            const askForPlayerChoose = {
                toId: fromId,
                players: canSlashTo,
                requiredAmount: 1,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose a target to use a virtual slash to him', this.Name).extract(),
                triggeredBySkills: [this.Name],
            };
            const response = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, askForPlayerChoose, fromId, true);
            response.selectedPlayers = response.selectedPlayers || [
                canSlashTo[Math.floor(Math.random() * canSlashTo.length)],
            ];
            const useCardEvent = {
                fromId,
                targetGroup: [response.selectedPlayers],
                cardId: virtualSlash,
                extraUse: true,
            };
            await room.useCard(useCardEvent);
            if (fromId === toIds[0]) {
                event_packer_1.EventPacker.getDamageSignatureInCardUse(useCardEvent) &&
                    (await room.drawCards(2, fromId, 'top', fromId, this.Name));
            }
            else if (!event_packer_1.EventPacker.getDamageSignatureInCardUse(useCardEvent)) {
                const resp = await room.askForCardDrop(fromId, 2, [0 /* HandArea */], true, undefined, this.Name);
                resp.droppedCards.length > 0 &&
                    (await room.dropCards(4 /* SelfDrop */, resp.droppedCards, fromId, fromId, this.Name));
            }
        }
        return true;
    }
};
KuangFu = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'kuangfu', description: 'kuangfu_description' })
], KuangFu);
exports.KuangFu = KuangFu;
