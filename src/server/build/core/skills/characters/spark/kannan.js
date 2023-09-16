"use strict";
var KanNan_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanNanBuff = exports.KanNanShadow = exports.KanNan = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let KanNan = KanNan_1 = class KanNan extends skill_1.ActiveSkill {
    canUse(room, owner) {
        var _a;
        return owner.hasUsedSkillTimes(this.Name) < owner.Hp && !((_a = owner.getFlag(this.Name)) === null || _a === void 0 ? void 0 : _a.includes(owner.Id));
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableTarget(owner, room, target) {
        var _a;
        return room.canPindian(owner, target) && !((_a = room.getFlag(owner, this.Name)) === null || _a === void 0 ? void 0 : _a.includes(target));
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
        const originalTargets = room.getFlag(fromId, this.Name) || [];
        originalTargets.push(toIds[0]);
        room.setFlag(fromId, this.Name, originalTargets);
        const { pindianRecord } = await room.pindian(fromId, toIds, this.Name);
        if (!pindianRecord.length) {
            return false;
        }
        const winner = pindianRecord[0].winner;
        if (winner) {
            const originalNum = room.getFlag(winner, KanNan_1.KanNanDamage) || 0;
            room.setFlag(winner, KanNan_1.KanNanDamage, originalNum + 1, translation_json_tool_1.TranslationPack.translationJsonPatcher('kannan damage: {0}', originalNum + 1).toString());
            room.getPlayerById(winner).hasShadowSkill(KanNanBuff.Name) || (await room.obtainSkill(winner, KanNanBuff.Name));
            if (winner === fromId) {
                originalTargets.push(fromId);
                room.setFlag(fromId, this.Name, originalTargets);
            }
        }
        return true;
    }
};
KanNan.KanNanDamage = 'kannan_damage';
KanNan = KanNan_1 = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'kannan', description: 'kannan_description' })
], KanNan);
exports.KanNan = KanNan;
let KanNanShadow = class KanNanShadow extends skill_1.TriggerSkill {
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
            owner.getFlag(this.GeneralName) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, this.GeneralName);
        return true;
    }
};
KanNanShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: KanNan.Name, description: KanNan.Description })
], KanNanShadow);
exports.KanNanShadow = KanNanShadow;
let KanNanBuff = class KanNanBuff extends skill_1.TriggerSkill {
    async whenDead(room, player) {
        await room.loseSkill(player.Id, this.Name);
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */;
    }
    canUse(room, owner, event) {
        return event.fromId === owner.Id && engine_1.Sanguosha.getCardById(event.cardId).GeneralName === 'slash';
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const cardUseEvent = event.triggeredOnEvent;
        const additionalDMG = room.getFlag(event.fromId, KanNan.KanNanDamage);
        if (additionalDMG) {
            cardUseEvent.additionalDamage = cardUseEvent.additionalDamage
                ? cardUseEvent.additionalDamage + additionalDMG
                : additionalDMG;
        }
        room.removeFlag(event.fromId, KanNan.KanNanDamage);
        await room.loseSkill(event.fromId, this.Name);
        return true;
    }
};
KanNanBuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_kannan_buff', description: 's_kannan_buff_description' })
], KanNanBuff);
exports.KanNanBuff = KanNanBuff;
