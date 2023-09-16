"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WangLieRemove = exports.WangLieDebuff = exports.WangLieBuff = exports.WangLieShadow = exports.WangLie = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let WangLie = class WangLie extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */;
    }
    canUse(room, owner, content) {
        const card = engine_1.Sanguosha.getCardById(content.cardId);
        return (content.fromId === owner.Id &&
            room.CurrentPhasePlayer === owner &&
            room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
            (card.GeneralName === 'slash' || (card.is(7 /* Trick */) && !card.is(8 /* DelayedTrick */))));
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to make {1} disreponsive, then you cannot use card this phase?', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(event.cardId)).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const cardUseEvent = triggeredOnEvent;
        cardUseEvent.disresponsiveList = room.getAlivePlayersFrom().map(player => player.Id);
        room.setFlag(fromId, this.Name, true);
        return true;
    }
};
WangLie = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'wanglie', description: 'wanglie_description' })
], WangLie);
exports.WangLie = WangLie;
let WangLieShadow = class WangLieShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    getPriority() {
        return 0 /* High */;
    }
    isTriggerable(event, stage) {
        return stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */;
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            room.CurrentPhasePlayer === owner &&
            room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
            !owner.getFlag(this.Name));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.setFlag(event.fromId, this.Name, true);
        return true;
    }
};
WangLieShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: WangLie.Name, description: WangLie.Description })
], WangLieShadow);
exports.WangLieShadow = WangLieShadow;
let WangLieBuff = class WangLieBuff extends skill_1.RulesBreakerSkill {
    breakCardUsableDistance(cardId, room, owner) {
        return owner.getFlag(WangLieShadow.Name) ? 0 : game_props_1.INFINITE_TRIGGERING_TIMES;
    }
};
WangLieBuff = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: WangLieShadow.Name, description: WangLieShadow.Description })
], WangLieBuff);
exports.WangLieBuff = WangLieBuff;
let WangLieDebuff = class WangLieDebuff extends skill_1.FilterSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUseCard(cardId, room, owner, onResponse, isCardResponse) {
        return !room.getPlayerById(owner).getFlag(this.GeneralName) || isCardResponse === true;
    }
};
WangLieDebuff = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: WangLieBuff.Name, description: WangLieBuff.Description })
], WangLieDebuff);
exports.WangLieDebuff = WangLieDebuff;
let WangLieRemove = class WangLieRemove extends skill_1.TriggerSkill {
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
                owner.getFlag(WangLieShadow.Name) !== undefined));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const from = room.getPlayerById(event.fromId);
        if (from.getFlag(this.GeneralName)) {
            room.removeFlag(event.fromId, this.GeneralName);
        }
        if (from.getFlag(WangLieShadow.Name)) {
            room.removeFlag(event.fromId, WangLieShadow.Name);
        }
        return true;
    }
};
WangLieRemove = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: WangLieDebuff.Name, description: WangLieDebuff.Description })
], WangLieRemove);
exports.WangLieRemove = WangLieRemove;
