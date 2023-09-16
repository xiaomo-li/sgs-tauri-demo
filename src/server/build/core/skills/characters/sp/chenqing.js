"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChenQing = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ChenQing = class ChenQing extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PlayerDying" /* PlayerDying */;
    }
    canUse(room, owner, content) {
        return (!owner.hasUsedSkill(this.Name) &&
            room.getPlayerById(content.dying).Hp < 1 &&
            room.getOtherPlayers(owner.Id).find(player => player.Id !== content.dying) !== undefined);
    }
    async beforeUse(room, event) {
        const response = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
            players: room
                .getOtherPlayers(event.triggeredOnEvent.dying)
                .filter(player => player.Id !== event.fromId)
                .map(player => player.Id),
            toId: event.fromId,
            requiredAmount: 1,
            conversation: 'do you want to choose a target to use chenqing?',
            triggeredBySkills: [this.Name],
        }, event.fromId);
        if (response.selectedPlayers && response.selectedPlayers.length > 0) {
            event.toIds = response.selectedPlayers;
            return true;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { toIds } = event;
        if (!toIds) {
            return false;
        }
        await room.drawCards(4, toIds[0], 'top', event.fromId, this.Name);
        const dying = event.triggeredOnEvent.dying;
        const response = await room.askForCardDrop(toIds[0], 4, [0 /* HandArea */, 1 /* EquipArea */], true, undefined, this.Name, translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please discard 4 cards, if these cards have different suit between each other, you use a virtual peach to {1}?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(dying))).extract());
        if (response.droppedCards.length > 0) {
            await room.dropCards(4 /* SelfDrop */, response.droppedCards, toIds[0], toIds[0], this.Name);
            if (response.droppedCards.length < 4) {
                return false;
            }
            const virtualPeach = card_1.VirtualCard.create({ cardName: 'peach', bySkill: this.Name }).Id;
            const suits = [];
            for (const cardId of response.droppedCards) {
                const suit = engine_1.Sanguosha.getCardById(cardId).Suit;
                if (suits.includes(suit)) {
                    break;
                }
                suits.push(suit);
            }
            if (suits.length === response.droppedCards.length &&
                room.getPlayerById(toIds[0]).canUseCardTo(room, virtualPeach, dying, true)) {
                await room.useCard({
                    fromId: toIds[0],
                    targetGroup: [[dying]],
                    cardId: virtualPeach,
                });
            }
        }
        return true;
    }
};
ChenQing = tslib_1.__decorate([
    skill_wrappers_1.CircleSkill,
    skill_wrappers_1.CommonSkill({ name: 'chenqing', description: 'chenqing_description' })
], ChenQing);
exports.ChenQing = ChenQing;
