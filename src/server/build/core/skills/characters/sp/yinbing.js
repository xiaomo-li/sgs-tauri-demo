"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YinBing = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YinBing = class YinBing extends skill_1.TriggerSkill {
    isAutoTrigger(room, owner, event) {
        return event !== undefined && event_packer_1.EventPacker.getIdentifier(event) === 137 /* DamageEvent */;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ || stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = content;
            return (phaseStageChangeEvent.toStage === 19 /* FinishStageStart */ &&
                phaseStageChangeEvent.playerId === owner.Id &&
                owner.getPlayerCards().length > 0);
        }
        else if (identifier === 137 /* DamageEvent */) {
            const damageEvent = content;
            return (damageEvent.toId === owner.Id &&
                damageEvent.cardIds !== undefined &&
                owner.getCardIds(3 /* OutsideArea */, this.Name).length > 0 &&
                (engine_1.Sanguosha.getCardById(damageEvent.cardIds[0]).GeneralName === 'slash' ||
                    engine_1.Sanguosha.getCardById(damageEvent.cardIds[0]).GeneralName === 'duel'));
        }
        return false;
    }
    cardFilter(room, owner, cards) {
        return cards.length > 0;
    }
    isAvailableCard(owner, room, cardId) {
        return !engine_1.Sanguosha.getCardById(cardId).is(0 /* Basic */);
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to put at least 1 un-basic cards on your general card as ‘Yin Bing’?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event.triggeredOnEvent);
        if (identifier === 105 /* PhaseStageChangeEvent */) {
            if (!event.cardIds) {
                return false;
            }
            await room.moveCards({
                movingCards: event.cardIds.map(card => ({ card, fromArea: room.getPlayerById(event.fromId).cardFrom(card) })),
                fromId: event.fromId,
                toId: event.fromId,
                toArea: 3 /* OutsideArea */,
                isOutsideAreaInPublic: true,
                toOutsideArea: this.Name,
                moveReason: 2 /* ActiveMove */,
                proposer: event.fromId,
                triggeredBySkills: [this.Name],
            });
        }
        else {
            const options = {
                [3 /* OutsideArea */]: room
                    .getPlayerById(event.fromId)
                    .getCardIds(3 /* OutsideArea */, this.Name),
            };
            const chooseCardEvent = {
                fromId: event.fromId,
                toId: event.fromId,
                options,
                triggeredBySkills: [this.Name],
            };
            const response = await room.askForChoosingPlayerCard(chooseCardEvent, event.fromId, true, true);
            if (!response) {
                return false;
            }
            await room.moveCards({
                movingCards: [{ card: response.selectedCard, fromArea: 3 /* OutsideArea */ }],
                fromId: event.fromId,
                toArea: 4 /* DropStack */,
                moveReason: 6 /* PlaceToDropStack */,
                proposer: event.fromId,
                triggeredBySkills: [this.Name],
            });
        }
        return true;
    }
};
YinBing = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'yinbing', description: 'yinbing_description' })
], YinBing);
exports.YinBing = YinBing;
