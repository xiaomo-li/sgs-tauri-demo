"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YingYuanShadow = exports.YingYuan = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YingYuan = class YingYuan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */;
    }
    canUse(room, owner, content) {
        const yingYuanUsed = owner.getFlag(this.Name) || [];
        return (room.CurrentPlayer === owner &&
            content.fromId === owner.Id &&
            room.isCardOnProcessing(content.cardId) &&
            !yingYuanUsed.includes(engine_1.Sanguosha.getCardById(content.cardId).GeneralName));
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, targetId) {
        return targetId !== owner;
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to give {1} to another player?', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(event.cardId)).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds, triggeredOnEvent } = event;
        const toId = precondition_1.Precondition.exists(toIds, 'Unable to get yingyuan target')[0];
        const cardUseEvent = triggeredOnEvent;
        if (room.isCardOnProcessing(cardUseEvent.cardId)) {
            await room.moveCards({
                movingCards: [{ card: cardUseEvent.cardId, fromArea: 6 /* ProcessingArea */ }],
                toId,
                toArea: 0 /* HandArea */,
                moveReason: 2 /* ActiveMove */,
                proposer: fromId,
            });
            const from = room.getPlayerById(fromId);
            const yingYuanUsed = from.getFlag(this.Name) || [];
            yingYuanUsed.push(engine_1.Sanguosha.getCardById(cardUseEvent.cardId).GeneralName);
            from.setFlag(this.Name, yingYuanUsed);
        }
        return true;
    }
};
YingYuan = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'yingyuan', description: 'yingyuan_description' })
], YingYuan);
exports.YingYuan = YingYuan;
let YingYuanShadow = class YingYuanShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
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
    canUse(room, owner, content) {
        return owner.getFlag(this.GeneralName) && content.from === 7 /* PhaseFinish */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, this.GeneralName);
        return true;
    }
};
YingYuanShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: YingYuan.Name, description: YingYuan.Description })
], YingYuanShadow);
exports.YingYuanShadow = YingYuanShadow;
