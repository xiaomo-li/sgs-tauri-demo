"use strict";
var SiDi_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiDiRemover = exports.SiDiBlocker = exports.SiDiShadow = exports.SiDi = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const functional_1 = require("core/shares/libs/functional");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let SiDi = SiDi_1 = class SiDi extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return ((content.toStage === 19 /* FinishStageStart */ &&
            content.playerId === owner.Id &&
            owner.getPlayerCards().find(id => !engine_1.Sanguosha.getCardById(id).is(0 /* Basic */)) !== undefined) ||
            (content.toStage === 13 /* PlayCardStageStart */ &&
                content.playerId !== owner.Id &&
                owner.getCardIds(3 /* OutsideArea */, this.Name).length > 0));
    }
    async beforeUse(room, event) {
        const { fromId } = event;
        const phaseStageChangeEvent = event.triggeredOnEvent;
        const availableCards = phaseStageChangeEvent.toStage === 19 /* FinishStageStart */
            ? room
                .getPlayerById(fromId)
                .getPlayerCards()
                .filter(id => !engine_1.Sanguosha.getCardById(id).is(0 /* Basic */))
            : room.getPlayerById(fromId).getCardIds(3 /* OutsideArea */, this.Name);
        const response = await room.doAskForCommonly(163 /* AskForCardEvent */, {
            cardAmount: 1,
            toId: fromId,
            reason: this.Name,
            conversation: phaseStageChangeEvent.toStage === 19 /* FinishStageStart */
                ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to put a card except basic card onto your general card?', this.Name).extract()
                : translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to remove a ‘Si’ to let {1} be unable to use card?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(phaseStageChangeEvent.playerId))).extract(),
            fromArea: phaseStageChangeEvent.toStage === 19 /* FinishStageStart */
                ? [0 /* HandArea */, 1 /* EquipArea */]
                : [3 /* OutsideArea */],
            cardMatcher: new card_matcher_1.CardMatcher({ cards: availableCards }).toSocketPassenger(),
            triggeredBySkills: [this.Name],
        }, fromId);
        if (response && response.selectedCards.length > 0) {
            event.cardIds = response.selectedCards;
            return true;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, cardIds } = event;
        if (!cardIds) {
            return false;
        }
        const phaseStageChangeEvent = event.triggeredOnEvent;
        if (phaseStageChangeEvent.toStage === 19 /* FinishStageStart */) {
            await room.moveCards({
                movingCards: [
                    {
                        card: cardIds[0],
                        fromArea: room.getPlayerById(fromId).cardFrom(cardIds[0]),
                    },
                ],
                fromId,
                toId: fromId,
                toArea: 3 /* OutsideArea */,
                moveReason: 2 /* ActiveMove */,
                toOutsideArea: this.Name,
                isOutsideAreaInPublic: true,
                proposer: fromId,
                movedByReason: this.Name,
                triggeredBySkills: [this.Name],
            });
        }
        else {
            await room.moveCards({
                movingCards: [{ card: cardIds[0], fromArea: 3 /* OutsideArea */ }],
                fromId,
                toArea: 4 /* DropStack */,
                moveReason: 6 /* PlaceToDropStack */,
                proposer: fromId,
                triggeredBySkills: [this.Name],
            });
            const originalColor = room.getFlag(phaseStageChangeEvent.playerId, this.Name) || [];
            originalColor.includes(engine_1.Sanguosha.getCardById(cardIds[0]).Color) ||
                originalColor.push(engine_1.Sanguosha.getCardById(cardIds[0]).Color);
            let text = '{0}[';
            for (let i = 1; i <= originalColor.length; i++) {
                text = text + '{' + i + '}';
            }
            text = text + ']';
            room.setFlag(phaseStageChangeEvent.playerId, this.Name, originalColor, translation_json_tool_1.TranslationPack.translationJsonPatcher(text, this.Name, ...originalColor.map(color => functional_1.Functional.getCardColorRawText(color))).toString());
            room.getPlayerById(phaseStageChangeEvent.playerId).hasShadowSkill(SiDiBlocker.Name) ||
                (await room.obtainSkill(phaseStageChangeEvent.playerId, SiDiBlocker.Name));
            room.getPlayerById(phaseStageChangeEvent.playerId).hasShadowSkill(SiDiRemover.Name) ||
                (await room.obtainSkill(phaseStageChangeEvent.playerId, SiDiRemover.Name));
            room.getPlayerById(fromId).setFlag(SiDi_1.SiDiTarget, true);
        }
        return true;
    }
};
SiDi.SiDiTarget = 'sidi_target';
SiDi = SiDi_1 = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'sidi', description: 'sidi_description' })
], SiDi);
exports.SiDi = SiDi;
let SiDiShadow = class SiDiShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return stage === "StageChanged" /* StageChanged */ && content.toStage === 15 /* PlayCardStageEnd */;
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, event) {
        return owner.getFlag(SiDi.SiDiTarget) && event.toStage === 15 /* PlayCardStageEnd */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, SiDi.SiDiTarget);
        const current = event.triggeredOnEvent.playerId;
        const records = room.Analytics.getCardUseRecord(current, 'phase');
        if (!records.find(event => engine_1.Sanguosha.getCardById(event.cardId).GeneralName === 'slash')) {
            const slash = card_1.VirtualCard.create({ cardName: 'slash', bySkill: this.GeneralName }).Id;
            room.getPlayerById(event.fromId).canUseCardTo(room, slash, current, true) &&
                (await room.useCard({
                    fromId: event.fromId,
                    targetGroup: [[current]],
                    cardId: slash,
                    triggeredBySkills: [this.GeneralName],
                }));
        }
        records.find(event => engine_1.Sanguosha.getCardById(event.cardId).is(7 /* Trick */)) ||
            (await room.drawCards(2, event.fromId, 'top', event.fromId, this.GeneralName));
        return true;
    }
};
SiDiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: SiDi.Name, description: SiDi.Description })
], SiDiShadow);
exports.SiDiShadow = SiDiShadow;
let SiDiBlocker = class SiDiBlocker extends skill_1.FilterSkill {
    canUseCard(cardId, room, owner) {
        const colors = room.getFlag(owner, SiDi.Name);
        if (colors === undefined) {
            return true;
        }
        if (cardId instanceof card_matcher_1.CardMatcher) {
            const suits = [];
            colors.includes(0 /* Red */) && suits.push(...[4 /* Diamond */, 2 /* Heart */]);
            colors.includes(1 /* Black */) && suits.push(...[1 /* Spade */, 3 /* Club */]);
            return !cardId.match(new card_matcher_1.CardMatcher({ suit: suits }));
        }
        else {
            return !colors.includes(engine_1.Sanguosha.getCardById(cardId).Color);
        }
    }
};
SiDiBlocker = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_sidi_blocker', description: 's_sidi_blocker_description' })
], SiDiBlocker);
exports.SiDiBlocker = SiDiBlocker;
let SiDiRemover = class SiDiRemover extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    async whenDead(room, player) {
        room.removeFlag(player.Id, SiDi.Name);
        room.getPlayerById(player.Id).hasShadowSkill(SiDiBlocker.Name) &&
            (await room.loseSkill(player.Id, SiDiBlocker.Name));
        room.getPlayerById(player.Id).hasShadowSkill(this.Name) && (await room.loseSkill(player.Id, this.Name));
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        return (owner.Id === event.fromPlayer &&
            event.from === 4 /* PlayCardStage */ &&
            owner.getFlag(SiDi.Name) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, SiDi.Name);
        room.getPlayerById(event.fromId).hasShadowSkill(SiDiBlocker.Name) &&
            (await room.loseSkill(event.fromId, SiDiBlocker.Name));
        room.getPlayerById(event.fromId).hasShadowSkill(this.Name) && (await room.loseSkill(event.fromId, this.Name));
        return true;
    }
};
SiDiRemover = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_sidi_remover', description: 's_sidi_remover_description' })
], SiDiRemover);
exports.SiDiRemover = SiDiRemover;
