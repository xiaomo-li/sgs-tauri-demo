"use strict";
var PinDi_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinDiShadow = exports.PinDi = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let PinDi = PinDi_1 = class PinDi extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return owner.getPlayerCards().length > 0;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableTarget(owner, room, target) {
        var _a;
        return owner !== target && !((_a = room.getFlag(owner, this.Name)) === null || _a === void 0 ? void 0 : _a.includes(target));
    }
    isAvailableCard(owner, room, cardId) {
        var _a;
        return (room.canDropCard(owner, cardId) &&
            !((_a = room.getFlag(owner, PinDi_1.PinDiType)) === null || _a === void 0 ? void 0 : _a.includes(engine_1.Sanguosha.getCardById(cardId).BaseType)));
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds, cardIds } = event;
        if (!toIds || !cardIds) {
            return false;
        }
        const originalTargets = room.getFlag(fromId, this.Name) || [];
        originalTargets.includes(toIds[0]) || originalTargets.push(toIds[0]);
        room.setFlag(fromId, this.Name, originalTargets);
        const originalTypes = room.getFlag(fromId, PinDi_1.PinDiType) || [];
        const type = engine_1.Sanguosha.getCardById(cardIds[0]).BaseType;
        originalTypes.includes(type) || originalTypes.push(type);
        room.setFlag(fromId, PinDi_1.PinDiType, originalTypes);
        await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
        const options = ['pindi:draw'];
        room.getPlayerById(toIds[0]).getPlayerCards().length > 0 && options.push('pindi:discard');
        let chosen = options[0];
        const skillUsedTimes = room.getPlayerById(fromId).hasUsedSkillTimes(this.Name);
        if (options.length > 1) {
            const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                options,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose pindi options: {1} {2}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(toIds[0])), skillUsedTimes).extract(),
                toId: fromId,
                triggeredBySkills: [this.Name],
            }, fromId, true);
            response.selectedOption && (chosen = response.selectedOption);
        }
        if (chosen === options[0]) {
            await room.drawCards(skillUsedTimes, toIds[0], 'top', fromId, this.Name);
        }
        else {
            const response = await room.askForCardDrop(toIds[0], skillUsedTimes, [0 /* HandArea */, 1 /* EquipArea */], true, undefined, this.Name);
            if (response.droppedCards.length > 0) {
                await room.dropCards(4 /* SelfDrop */, response.droppedCards, toIds[0], toIds[0], this.Name);
            }
        }
        if (!room.getPlayerById(toIds[0]).Dead && room.getPlayerById(toIds[0]).LostHp > 0) {
            room.getPlayerById(fromId).ChainLocked || (await room.chainedOn(fromId));
        }
        return true;
    }
};
PinDi.PinDiType = 'pindi_type';
PinDi = PinDi_1 = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'pindi', description: 'pindi_description' })
], PinDi);
exports.PinDi = PinDi;
let PinDiShadow = class PinDiShadow extends skill_1.TriggerSkill {
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
                owner.getFlag(PinDi.PinDiType) !== undefined));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.getFlag(event.fromId, this.GeneralName) && room.removeFlag(event.fromId, this.GeneralName);
        room.getFlag(event.fromId, PinDi.PinDiType) && room.removeFlag(event.fromId, PinDi.PinDiType);
        return true;
    }
};
PinDiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: PinDi.Name, description: PinDi.Description })
], PinDiShadow);
exports.PinDiShadow = PinDiShadow;
