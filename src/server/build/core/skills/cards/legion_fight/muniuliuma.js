"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuNiuLiuMaSkill = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let MuNiuLiuMaSkill = class MuNiuLiuMaSkill extends skill_1.ActiveSkill {
    get Muted() {
        return true;
    }
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.getCardIds(3 /* OutsideArea */, this.Name).length < 5;
    }
    isRefreshAt(room, owner, stage) {
        return stage === 4 /* PlayCardStage */;
    }
    numberOfTargets() {
        return 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard() {
        return true;
    }
    isAvailableTarget() {
        return false;
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    async whenLosingSkill(room, player) {
        const cards = player.getCardIds(3 /* OutsideArea */, this.GeneralName);
        await room.moveCards({
            movingCards: cards.map(card => ({ card, fromArea: 3 /* OutsideArea */ })),
            toArea: 4 /* DropStack */,
            fromId: player.Id,
            moveReason: 6 /* PlaceToDropStack */,
            movedByReason: this.Name,
            proposer: player.Id,
        });
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, cardIds } = event;
        const from = room.getPlayerById(fromId);
        await room.moveCards({
            movingCards: [{ card: cardIds[0], fromArea: 0 /* HandArea */ }],
            moveReason: 2 /* ActiveMove */,
            movedByReason: this.Name,
            fromId,
            toArea: 3 /* OutsideArea */,
            toId: fromId,
            toOutsideArea: this.Name,
            isOutsideAreaInPublic: false,
            proposer: fromId,
            engagedPlayerIds: [fromId],
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} move cards {1} onto the top of {2} character card', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), translation_json_tool_1.TranslationPack.patchCardInTranslation(...cardIds), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from)).extract(),
            unengagedMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} move {1} cards onto the top of {2} character card', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), cardIds.length, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from)).extract(),
        });
        const askForDeliverTo = {
            players: room
                .getOtherPlayers(fromId)
                .filter(player => player.getEquipment(6 /* Precious */) === undefined)
                .map(p => p.Id),
            toId: fromId,
            conversation: 'do you wish to deliver muniuliuma to another player?',
            requiredAmount: 1,
            triggeredBySkills: [this.Name],
        };
        room.notify(167 /* AskForChoosingPlayerEvent */, askForDeliverTo, fromId);
        const { selectedPlayers } = await room.onReceivingAsyncResponseFrom(167 /* AskForChoosingPlayerEvent */, fromId);
        if (selectedPlayers !== undefined && selectedPlayers.length > 0) {
            const toId = selectedPlayers[0];
            const to = room.getPlayerById(toId);
            await room.moveCards({
                movingCards: [{ card: from.getEquipment(6 /* Precious */), fromArea: 1 /* EquipArea */ }],
                toArea: 1 /* EquipArea */,
                toId,
                fromId,
                moveReason: 2 /* ActiveMove */,
                movedByReason: this.Name,
                proposer: fromId,
                translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} place card {1} from {2} into equip area of {3}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), translation_json_tool_1.TranslationPack.patchCardInTranslation(...cardIds), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to)).extract(),
            }, {
                movingCards: from
                    .getCardIds(3 /* OutsideArea */, this.Name)
                    .map(card => ({ card, fromArea: 3 /* OutsideArea */ })),
                fromId,
                toId,
                toArea: 3 /* OutsideArea */,
                toOutsideArea: this.Name,
                isOutsideAreaInPublic: false,
                engagedPlayerIds: [fromId, toId],
                moveReason: 2 /* ActiveMove */,
                movedByReason: this.Name,
                proposer: fromId,
                translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} move cards {1} onto the top of {2} character card', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), translation_json_tool_1.TranslationPack.patchCardInTranslation(...cardIds), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to)).extract(),
                unengagedMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} move {1} cards onto the top of {2} character card', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), cardIds.length, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to)).extract(),
            });
        }
        return true;
    }
};
MuNiuLiuMaSkill = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'muniuliuma', description: 'muniuliuma_description' })
], MuNiuLiuMaSkill);
exports.MuNiuLiuMaSkill = MuNiuLiuMaSkill;
