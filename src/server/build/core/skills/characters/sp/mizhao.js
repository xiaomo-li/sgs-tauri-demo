"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiZhao = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let MiZhao = class MiZhao extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.getCardIds(0 /* HandArea */).length > 0;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
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
        await room.moveCards({
            movingCards: room
                .getPlayerById(fromId)
                .getCardIds(0 /* HandArea */)
                .map(card => ({ card, fromArea: 0 /* HandArea */ })),
            fromId,
            toId: toIds[0],
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: fromId,
            triggeredBySkills: [this.Name],
        });
        const availablePinDianTargets = room
            .getOtherPlayers(fromId)
            .filter(player => room.canPindian(toIds[0], player.Id))
            .map(player => player.Id);
        if (availablePinDianTargets.length === 0) {
            return false;
        }
        let chosen = availablePinDianTargets[0];
        if (availablePinDianTargets.length > 1) {
            const response = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                players: availablePinDianTargets,
                toId: fromId,
                requiredAmount: 1,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose a target to pindian with {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(toIds[0]))).extract(),
                triggeredBySkills: [this.Name],
            }, fromId, true);
            response.selectedPlayers = response.selectedPlayers || [
                availablePinDianTargets[Math.floor(Math.random() * availablePinDianTargets.length)],
            ];
            chosen = response.selectedPlayers[0];
        }
        const pindianEvent = await room.pindian(toIds[0], [chosen], this.Name);
        const virtualSlash = card_1.VirtualCard.create({ cardName: 'slash', bySkill: this.Name }).Id;
        const result = pindianEvent.pindianRecord[0];
        if (result.winner &&
            room
                .getPlayerById(result.winner)
                .canUseCardTo(room, virtualSlash, result.winner === toIds[0] ? chosen : toIds[0], true)) {
            await room.useCard({
                fromId: result.winner,
                targetGroup: result.winner === toIds[0] ? [[chosen]] : [toIds],
                cardId: virtualSlash,
                extraUse: true,
                triggeredBySkills: [this.Name],
            });
        }
        return true;
    }
};
MiZhao = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'mizhao', description: 'mizhao_description' })
], MiZhao);
exports.MiZhao = MiZhao;
