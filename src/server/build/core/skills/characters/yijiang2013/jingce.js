"use strict";
var JingCe_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JingCeShadow = exports.JingCeRecorder = exports.JingCe = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JingCe = JingCe_1 = class JingCe extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        const types = owner.getFlag(JingCe_1.JingCeTypes);
        return (owner.Id === content.playerId &&
            content.toStage === 15 /* PlayCardStageEnd */ &&
            types !== undefined &&
            types.length > 0);
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw {1} card(s)?', this.Name, owner.getFlag(JingCe_1.JingCeTypes).length).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const player = room.getPlayerById(event.fromId);
        const drawNum = player.getFlag(JingCe_1.JingCeTypes).length;
        await room.drawCards(drawNum, event.fromId, undefined, event.fromId, this.Name);
        return true;
    }
};
JingCe.JingCeSuits = 'jingce_suits';
JingCe.JingCeTypes = 'jingce_types';
JingCe = JingCe_1 = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'jingce', description: 'jingce_description' })
], JingCe);
exports.JingCe = JingCe;
let JingCeRecorder = class JingCeRecorder extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */;
    }
    canUse(room, owner, content) {
        return room.CurrentPlayer.Id === owner.Id && content.fromId === owner.Id;
    }
    isAutoTrigger() {
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const CardUseEvent = event.triggeredOnEvent;
        room.syncGameCommonRules(event.fromId, user => {
            const card = engine_1.Sanguosha.getCardById(CardUseEvent.cardId);
            const jingceTypes = JingCe.JingCeTypes;
            const JingCeSuits = JingCe.JingCeSuits;
            const types = user.getFlag(jingceTypes) || [];
            if (!types.includes(card.BaseType)) {
                types.push(card.BaseType);
                user.setFlag(jingceTypes, types);
            }
            const suits = user.getFlag(JingCeSuits) || [];
            if (!suits.includes(card.Suit)) {
                suits.push(card.Suit);
                user.setFlag(JingCeSuits, suits);
                room.CommonRules.addAdditionalHoldCardNumber(user, 1);
            }
        });
        return true;
    }
};
JingCeRecorder = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: JingCe.Name, description: JingCe.Description })
], JingCeRecorder);
exports.JingCeRecorder = JingCeRecorder;
let JingCeShadow = class JingCeShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    isFlaggedSkill() {
        return true;
    }
    canUse(room, owner, content) {
        return content.fromPlayer === owner.Id && content.from === 7 /* PhaseFinish */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.syncGameCommonRules(event.fromId, user => {
            const jingceSuits = JingCe.JingCeSuits;
            const suits = user.getFlag(jingceSuits);
            if (suits) {
                room.CommonRules.addAdditionalHoldCardNumber(user, -suits.length);
                user.removeFlag(jingceSuits);
            }
            user.removeFlag(JingCe.JingCeTypes);
        });
        return true;
    }
};
JingCeShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: JingCeRecorder.Name, description: JingCeRecorder.Description })
], JingCeShadow);
exports.JingCeShadow = JingCeShadow;
