"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JieXun = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const funan_1 = require("./funan");
let JieXun = class JieXun extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && content.toStage === 19 /* FinishStageStart */;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target to use this skill(draw {1} card(s), discard {2} card(s))?', this.Name, room.AlivePlayers.reduce((sum, player) => sum +
            [...player.getCardIds(1 /* EquipArea */), ...player.getCardIds(2 /* JudgeArea */)].filter(cardId => engine_1.Sanguosha.getCardById(cardId).Suit === 4 /* Diamond */).length, 0), owner.hasUsedSkillTimes(this.Name)).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const toId = event.toIds[0];
        const drawNum = room.AlivePlayers.reduce((sum, player) => sum +
            [...player.getCardIds(1 /* EquipArea */), ...player.getCardIds(2 /* JudgeArea */)].filter(cardId => engine_1.Sanguosha.getCardById(cardId).Suit === 4 /* Diamond */).length, 0);
        drawNum > 0 && (await room.drawCards(drawNum, toId, 'top', event.fromId, this.Name));
        const discardableCardIds = room
            .getPlayerById(toId)
            .getPlayerCards()
            .filter(cardId => room.canDropCard(toId, cardId));
        const discardNum = room.getPlayerById(event.fromId).hasUsedSkillTimes(this.Name) - 1;
        if (discardNum > 0) {
            if (discardableCardIds.length <= discardNum) {
                const canUpdate = discardableCardIds.length === room.getPlayerById(toId).getPlayerCards().length;
                await room.moveCards({
                    movingCards: discardableCardIds.map(card => ({ card, fromArea: room.getPlayerById(toId).cardFrom(card) })),
                    fromId: toId,
                    toArea: 4 /* DropStack */,
                    moveReason: 4 /* SelfDrop */,
                    proposer: toId,
                    triggeredBySkills: [this.Name],
                });
                if (canUpdate) {
                    await room.loseSkill(event.fromId, this.Name);
                    await room.updateSkill(event.fromId, funan_1.FuNan.Name, funan_1.FuNanEX.Name);
                }
            }
            else {
                const response = await room.askForCardDrop(toId, discardNum, [0 /* HandArea */, 1 /* EquipArea */], true, undefined, this.Name);
                response.droppedCards.length > 0 &&
                    (await room.dropCards(4 /* SelfDrop */, response.droppedCards, toId, toId, this.Name));
            }
        }
        return true;
    }
};
JieXun = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'jiexun', description: 'jiexun_description' })
], JieXun);
exports.JieXun = JieXun;
