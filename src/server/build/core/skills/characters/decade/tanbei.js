"use strict";
var TanBei_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TanBeiRemover = exports.TanBeiDebuff = exports.TanBeiBuff = exports.TanBei = void 0;
const tslib_1 = require("tslib");
const game_props_1 = require("core/game/game_props");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let TanBei = TanBei_1 = class TanBei extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
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
        const options = ['tanbei:prey', 'tanbei:unlimited'];
        room.getPlayerById(toIds[0]).getCardIds().length === 0 && options.shift();
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose tanbei options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId))).extract(),
            toId: toIds[0],
            triggeredBySkills: [this.Name],
        }, toIds[0], true);
        response.selectedOption = response.selectedOption || options[0];
        if (response.selectedOption === 'tanbei:prey') {
            const wholeCards = room.getPlayerById(toIds[0]).getCardIds();
            const randomCard = wholeCards[Math.floor(Math.random() * wholeCards.length)];
            await room.moveCards({
                movingCards: [{ card: randomCard, fromArea: room.getPlayerById(fromId).cardFrom(randomCard) }],
                fromId: toIds[0],
                toId: fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: fromId,
                triggeredBySkills: [this.Name],
            });
            room.setFlag(fromId, this.Name, toIds[0]);
        }
        else {
            room.setFlag(fromId, TanBei_1.TanBeiTarget, toIds[0], this.Name);
        }
        return true;
    }
};
TanBei.TanBeiTarget = 'tanbei_target';
TanBei = TanBei_1 = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'tanbei', description: 'tanbei_description' })
], TanBei);
exports.TanBei = TanBei;
let TanBeiBuff = class TanBeiBuff extends skill_1.RulesBreakerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    breakCardUsableDistanceTo(cardId, room, owner, target) {
        if (owner.getFlag(TanBei.TanBeiTarget) === target.Id) {
            return game_props_1.INFINITE_DISTANCE;
        }
        else {
            return 0;
        }
    }
    breakCardUsableTimesTo(cardId, room, owner, target) {
        if (owner.getFlag(TanBei.TanBeiTarget) === target.Id) {
            return game_props_1.INFINITE_TRIGGERING_TIMES;
        }
        else {
            return 0;
        }
    }
};
TanBeiBuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: TanBei.Name, description: TanBei.Description })
], TanBeiBuff);
exports.TanBeiBuff = TanBeiBuff;
let TanBeiDebuff = class TanBeiDebuff extends skill_1.GlobalFilterSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUseCardTo(_, __, owner, from, to) {
        return !(owner === from && to.Id === owner.getFlag(this.GeneralName));
    }
};
TanBeiDebuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: TanBeiBuff.Name, description: TanBeiBuff.Description })
], TanBeiDebuff);
exports.TanBeiDebuff = TanBeiDebuff;
let TanBeiRemover = class TanBeiRemover extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
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
            (owner.getFlag(this.GeneralName) !== undefined ||
                owner.getFlag(TanBei.TanBeiTarget) !== undefined));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, this.GeneralName);
        room.removeFlag(event.fromId, TanBei.TanBeiTarget);
        return true;
    }
};
TanBeiRemover = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: TanBeiDebuff.Name, description: TanBeiDebuff.Description })
], TanBeiRemover);
exports.TanBeiRemover = TanBeiRemover;
