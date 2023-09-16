"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChunLaoShadow = exports.ChunLao = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ChunLao = class ChunLao extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ && event.toStage === 15 /* PlayCardStageEnd */;
    }
    canUse(room, owner, event) {
        return (event.playerId === owner.Id &&
            owner.getCardIds(3 /* OutsideArea */, this.Name).length === 0 &&
            owner
                .getCardIds(0 /* HandArea */)
                .find(cardId => engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash') !== undefined);
    }
    cardFilter(room, owner, cards) {
        return cards.length > 0;
    }
    isAvailableCard(owner, room, cardId) {
        return engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash';
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to put at least one slash on your general card?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, cardIds } = event;
        await room.moveCards({
            movingCards: cardIds.map(card => ({ card, fromArea: 0 /* HandArea */ })),
            fromId,
            toId: fromId,
            toArea: 3 /* OutsideArea */,
            moveReason: 2 /* ActiveMove */,
            toOutsideArea: this.Name,
            isOutsideAreaInPublic: true,
            proposer: fromId,
            movedByReason: this.Name,
        });
        return true;
    }
};
ChunLao = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'chunlao', description: 'chunlao_description' })
], ChunLao);
exports.ChunLao = ChunLao;
let ChunLaoShadow = class ChunLaoShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PlayerDying" /* PlayerDying */;
    }
    canUse(room, owner, event) {
        return (room.getPlayerById(event.dying).Hp < 1 &&
            owner.getCardIds(3 /* OutsideArea */, this.GeneralName).length > 0);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        const ownerPlayer = room.getPlayerById(owner);
        return ownerPlayer.getCardIds(3 /* OutsideArea */, this.GeneralName).includes(cardId);
    }
    availableCardAreas() {
        return [3 /* OutsideArea */];
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to remove a Chun to let {1} uses an alchol?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.dying))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, cardIds, triggeredOnEvent } = event;
        const playerDyingEvent = triggeredOnEvent;
        const chun = engine_1.Sanguosha.getCardById(cardIds[0]);
        await room.moveCards({
            movingCards: [{ card: cardIds[0], fromArea: 3 /* OutsideArea */ }],
            fromId,
            moveReason: 6 /* PlaceToDropStack */,
            toArea: 4 /* DropStack */,
            proposer: fromId,
            movedByReason: this.GeneralName,
        });
        const alcohol = card_1.VirtualCard.create({ cardName: 'alcohol', bySkill: this.GeneralName });
        const user = room.getPlayerById(playerDyingEvent.dying);
        if (user.canUseCardTo(room, alcohol.Id, playerDyingEvent.dying)) {
            await room.useCard({
                fromId: playerDyingEvent.dying,
                cardId: alcohol.Id,
                targetGroup: [[playerDyingEvent.dying]],
            });
            if (chun.Name === 'thunder_slash') {
                await room.drawCards(2, fromId, 'top', fromId, this.GeneralName);
            }
            else if (chun.Name === 'fire_slash') {
                await room.recover({
                    toId: fromId,
                    recoveredHp: 1,
                    recoverBy: fromId,
                });
            }
        }
        return true;
    }
};
ChunLaoShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_1.CommonSkill({ name: ChunLao.Name, description: ChunLao.Description })
], ChunLaoShadow);
exports.ChunLaoShadow = ChunLaoShadow;
