"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QianXunShadow = exports.QianXun = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let QianXun = class QianXun extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardEffecting" /* CardEffecting */;
    }
    canUse(room, owner, content) {
        if (engine_1.Sanguosha.getCardById(content.cardId).BaseType !== 7 /* Trick */ ||
            owner.getCardIds(0 /* HandArea */).length === 0) {
            return false;
        }
        return (!!content.allTargets &&
            content.allTargets.length === 1 &&
            content.fromId !== owner.Id &&
            content.allTargets.includes(owner.Id));
    }
    async onTrigger(room, skillUseEvent) {
        skillUseEvent.messages = skillUseEvent.messages || [];
        skillUseEvent.messages.push(translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} moved all hand cards out of the game', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId))).toString());
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId } = skillUseEvent;
        const from = room.getPlayerById(fromId);
        await room.moveCards({
            movingCards: from.getCardIds(0 /* HandArea */).map(card => ({ card, fromArea: 0 /* HandArea */ })),
            fromId,
            toId: fromId,
            toArea: 3 /* OutsideArea */,
            moveReason: 2 /* ActiveMove */,
            toOutsideArea: this.Name,
            proposer: fromId,
            movedByReason: this.Name,
        });
        return true;
    }
};
QianXun = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'qianxun', description: 'qianxun_description' })
], QianXun);
exports.QianXun = QianXun;
let QianXunShadow = class QianXunShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */ && event.from === 7 /* PhaseFinish */;
    }
    canUse(room, owner, content) {
        return owner.getCardIds(3 /* OutsideArea */, this.GeneralName).length > 0;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId } = skillUseEvent;
        const from = room.getPlayerById(fromId);
        const qianxunCards = from.getCardIds(3 /* OutsideArea */, this.GeneralName).slice();
        await room.moveCards({
            movingCards: qianxunCards.map(card => ({ card, fromArea: 3 /* OutsideArea */ })),
            fromId,
            toId: fromId,
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: fromId,
            movedByReason: this.GeneralName,
            hideBroadcast: true,
        });
        return true;
    }
};
QianXunShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: QianXun.GeneralName, description: QianXun.Description })
], QianXunShadow);
exports.QianXunShadow = QianXunShadow;
