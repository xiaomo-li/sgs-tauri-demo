"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CangZhuoShadow = exports.CangZhuo = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let CangZhuo = class CangZhuo extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.playerId &&
            content.toStage === 16 /* DropCardStageStart */ &&
            room.Analytics.getUsedCard(owner.Id, 'round', undefined, 1).filter(cardId => engine_1.Sanguosha.getCardById(cardId).is(7 /* Trick */)).length === 0);
    }
    async onTrigger(room, event) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId } = skillUseEvent;
        room.getPlayerById(fromId).setFlag(this.Name, true);
        return true;
    }
};
CangZhuo = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'cangzhuo', description: 'cangzhuo_description' })
], CangZhuo);
exports.CangZhuo = CangZhuo;
let CangZhuoShadow = class CangZhuoShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isTriggerable(event, stage) {
        return (event_packer_1.EventPacker.getIdentifier(event) === 162 /* AskForCardDropEvent */ ||
            stage === "PhaseChanged" /* PhaseChanged */);
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        let canTrigger = false;
        if (event_packer_1.EventPacker.getIdentifier(content) === 162 /* AskForCardDropEvent */) {
            canTrigger = room.CurrentPlayerPhase === 5 /* DropCardStage */ && room.CurrentPhasePlayer.Id === owner.Id;
        }
        else if (event_packer_1.EventPacker.getIdentifier(content) === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = content;
            canTrigger = owner.Id === phaseChangeEvent.fromPlayer && phaseChangeEvent.from === 7 /* PhaseFinish */;
        }
        return canTrigger && owner.getFlag(this.GeneralName) === true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 162 /* AskForCardDropEvent */) {
            const askForCardDropEvent = unknownEvent;
            const player = room.getPlayerById(askForCardDropEvent.toId);
            const tricks = player
                .getCardIds(0 /* HandArea */)
                .filter(cardId => engine_1.Sanguosha.getCardById(cardId).is(7 /* Trick */));
            if (tricks.length > 0) {
                const otherHandCards = player.getCardIds(0 /* HandArea */).filter(card => !tricks.includes(card));
                const discardAmount = otherHandCards.length - player.getMaxCardHold(room);
                askForCardDropEvent.cardAmount = discardAmount;
                askForCardDropEvent.except = askForCardDropEvent.except ? [...askForCardDropEvent.except, ...tricks] : tricks;
            }
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = unknownEvent;
            const { fromPlayer } = phaseChangeEvent;
            room.getPlayerById(fromPlayer).removeFlag(this.GeneralName);
        }
        return true;
    }
};
CangZhuoShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: CangZhuo.GeneralName, description: CangZhuo.Description })
], CangZhuoShadow);
exports.CangZhuoShadow = CangZhuoShadow;
