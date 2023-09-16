"use strict";
var JiGong_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiGongRemover = exports.JiGongShadow = exports.JiGong = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JiGong = JiGong_1 = class JiGong extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, event) {
        return owner.Id === event.playerId && event.toStage === 13 /* PlayCardStageStart */;
    }
    async beforeUse(room, event) {
        const { fromId } = event;
        const options = ['jigong:draw1', 'jigong:draw2', 'jigong:draw3'];
        room.notify(168 /* AskForChoosingOptionsEvent */, {
            options,
            toId: fromId,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose jigong options', this.Name).extract(),
        }, fromId);
        const { selectedOption } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, fromId);
        if (selectedOption) {
            event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: options.findIndex(option => option === selectedOption) + 1 }, event);
            return true;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const num = event_packer_1.EventPacker.getMiddleware(this.Name, event);
        if (!num) {
            return false;
        }
        await room.drawCards(num, event.fromId, 'top', event.fromId, this.Name);
        const damage = room.Analytics.getDamageRecord(event.fromId, 'phase').reduce((sum, event) => sum + event.damage, 0);
        room.setFlag(event.fromId, this.Name, damage, translation_json_tool_1.TranslationPack.translationJsonPatcher('jigong damage: {0}', damage).toString());
        room.getPlayerById(event.fromId).setFlag(JiGong_1.JiGongNum, num);
        return true;
    }
};
JiGong.JiGongNum = 'jigong_num';
JiGong = JiGong_1 = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'jigong', description: 'jigong_description' })
], JiGong);
exports.JiGong = JiGong;
let JiGongShadow = class JiGongShadow extends skill_1.RulesBreakerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    breakBaseCardHoldNumber(room, owner) {
        return owner.getFlag(this.GeneralName) !== undefined ? owner.getFlag(this.GeneralName) : -1;
    }
};
JiGongShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: JiGong.Name, description: JiGong.Description })
], JiGongShadow);
exports.JiGongShadow = JiGongShadow;
let JiGongRemover = class JiGongRemover extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill(room, event, stage) {
        return stage !== "StageChanged" /* StageChanged */;
    }
    isTriggerable(event, stage) {
        return (stage === "DamageDone" /* DamageDone */ ||
            stage === "StageChanged" /* StageChanged */ ||
            stage === "PhaseChanged" /* PhaseChanged */);
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        const damage = owner.getFlag(this.GeneralName);
        if (identifier === 137 /* DamageEvent */) {
            const damageEvent = event;
            return damageEvent.fromId === owner.Id && damage !== undefined;
        }
        else if (identifier === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = event;
            return (phaseStageChangeEvent.playerId === owner.Id &&
                phaseStageChangeEvent.toStage === 16 /* DropCardStageStart */ &&
                damage !== undefined);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return phaseChangeEvent.from === 7 /* PhaseFinish */ && damage !== undefined;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 137 /* DamageEvent */) {
            const num = room.getFlag(fromId, this.GeneralName) +
                unknownEvent.damage;
            room.setFlag(fromId, this.GeneralName, num, translation_json_tool_1.TranslationPack.translationJsonPatcher('jigong damage: {0}', num).toString());
        }
        else if (identifier === 105 /* PhaseStageChangeEvent */) {
            room.getFlag(fromId, this.GeneralName) >= room.getFlag(fromId, JiGong.JiGongNum) &&
                (await room.recover({
                    toId: fromId,
                    recoveredHp: 1,
                    recoverBy: fromId,
                }));
            room.getPlayerById(fromId).removeFlag(JiGong.JiGongNum);
        }
        else {
            room.removeFlag(fromId, this.GeneralName);
            room.getFlag(fromId, JiGong.JiGongNum) !== undefined &&
                room.getPlayerById(fromId).removeFlag(JiGong.JiGongNum);
        }
        return true;
    }
};
JiGongRemover = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: JiGongShadow.Name, description: JiGongShadow.Description })
], JiGongRemover);
exports.JiGongRemover = JiGongRemover;
