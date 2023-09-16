"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JuShou = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JuShou = class JuShou extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.playerId && 19 /* FinishStageStart */ === content.toStage;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        await room.turnOver(skillUseEvent.fromId);
        await room.drawCards(4, skillUseEvent.fromId, 'top', undefined, this.Name);
        const player = room.getPlayerById(skillUseEvent.fromId);
        const handCards = player
            .getCardIds(0 /* HandArea */)
            .filter(id => engine_1.Sanguosha.getCardById(id).is(1 /* Equip */)
            ? player.canUseCardTo(room, id, skillUseEvent.fromId)
            : room.canDropCard(skillUseEvent.fromId, id));
        if (handCards.length === 0) {
            return false;
        }
        const { selectedCards } = await room.doAskForCommonly(163 /* AskForCardEvent */, {
            cardAmount: 1,
            toId: skillUseEvent.fromId,
            reason: this.Name,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose a hand card, if it’s equipment, use it, otherwise drop it', this.Name).extract(),
            fromArea: [0 /* HandArea */],
            cardMatcher: new card_matcher_1.CardMatcher({ cards: handCards }).toSocketPassenger(),
            triggeredBySkills: [this.Name],
        }, skillUseEvent.fromId, true);
        const card = engine_1.Sanguosha.getCardById(selectedCards[0]);
        if (card.is(1 /* Equip */)) {
            const cardUseEvent = {
                fromId: skillUseEvent.fromId,
                cardId: selectedCards[0],
            };
            await room.useCard(cardUseEvent);
        }
        else {
            await room.dropCards(4 /* SelfDrop */, selectedCards, skillUseEvent.fromId, skillUseEvent.fromId, this.Name);
        }
        return true;
    }
};
JuShou = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'jushou', description: 'jushou_description' })
], JuShou);
exports.JuShou = JuShou;
