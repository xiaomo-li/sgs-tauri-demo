"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FangTong = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const jijun_1 = require("./jijun");
let FangTong = class FangTong extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 19 /* FinishStageStart */ &&
            owner.getCardIds(3 /* OutsideArea */, jijun_1.JiJun.Name).length > 0 &&
            owner.getPlayerCards().length > 0);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, cardIds } = event;
        if (!cardIds) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
        const fang = room.getPlayerById(fromId).getCardIds(3 /* OutsideArea */, jijun_1.JiJun.Name);
        const response = await room.doAskForCommonly(163 /* AskForCardEvent */, {
            cardAmountRange: [1, fang.length],
            toId: fromId,
            reason: this.Name,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose at least 1 ‘Fang’ to remove', this.Name).extract(),
            fromArea: [3 /* OutsideArea */],
            cardMatcher: new card_matcher_1.CardMatcher({ cards: fang }).toSocketPassenger(),
            triggeredBySkills: [this.Name],
        }, fromId, true);
        response.selectedCards = response.selectedCards || fang[Math.floor(Math.random() * fang.length)];
        await room.dropCards(4 /* SelfDrop */, response.selectedCards, fromId, fromId, this.Name);
        if (engine_1.Sanguosha.getCardById(cardIds[0]).CardNumber +
            response.selectedCards.reduce((sum, id) => sum + engine_1.Sanguosha.getCardById(id).CardNumber, 0) ===
            36) {
            const others = room.getOtherPlayers(fromId).map(player => player.Id);
            const resp = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                players: others,
                toId: fromId,
                requiredAmount: 1,
                conversation: 'fangtong: please choose a target to deal 3 thunder damage to him?',
                triggeredBySkills: [this.Name],
            }, fromId, true);
            resp.selectedPlayers = resp.selectedPlayers || [others[Math.floor(Math.random() * others.length)]];
            await room.damage({
                fromId,
                toId: resp.selectedPlayers[0],
                damage: 3,
                damageType: "thunder_property" /* Thunder */,
                triggeredBySkills: [this.Name],
            });
        }
        return true;
    }
};
FangTong = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'fangtong', description: 'fangtong_description' })
], FangTong);
exports.FangTong = FangTong;
