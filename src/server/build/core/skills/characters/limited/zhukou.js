"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhuKouShadow = exports.ZhuKouDamage = exports.ZhuKou = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhuKou = class ZhuKou extends skill_1.TriggerSkill {
    async whenObtainingSkill(room, owner) {
        const records = room.Analytics.getDamageRecord(owner.Id, 'round', [4 /* PlayCardStage */], 1);
        if (records.length > 0) {
            owner.setFlag(ZhuKouDamage.Name, true);
            event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: true }, records[0]);
        }
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamageEffect" /* AfterDamageEffect */;
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
            event_packer_1.EventPacker.getMiddleware(this.Name, content) === true &&
            room.Analytics.getCardUseRecord(owner.Id, 'round', undefined, 1).length > 0);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(room.Analytics.getCardUseRecord(event.fromId, 'round').length, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
ZhuKou = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'zhukou', description: 'zhukou_description' })
], ZhuKou);
exports.ZhuKou = ZhuKou;
let ZhuKouDamage = class ZhuKouDamage extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 19 /* FinishStageStart */ &&
            room.getOtherPlayers(owner.Id).length > 1 &&
            room.Analytics.getDamageRecord(owner.Id, 'round', undefined, 1).length < 1);
    }
    numberOfTargets() {
        return 2;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose two targets to deal 1 damage each?', this.GeneralName).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        for (const toId of event.toIds) {
            await room.damage({
                fromId: event.fromId,
                toId,
                damage: 1,
                damageType: "normal_property" /* Normal */,
                triggeredBySkills: [this.GeneralName],
            });
        }
        return true;
    }
};
ZhuKouDamage = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: ZhuKou.Name, description: ZhuKou.Description })
], ZhuKouDamage);
exports.ZhuKouDamage = ZhuKouDamage;
let ZhuKouShadow = class ZhuKouShadow extends skill_1.TriggerSkill {
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
        return stage === "DamageDone" /* DamageDone */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 137 /* DamageEvent */) {
            const damageEvent = event;
            return (damageEvent.fromId === owner.Id &&
                !owner.getFlag(this.Name) &&
                room.CurrentPlayerPhase === 4 /* PlayCardStage */);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return phaseChangeEvent.from === 7 /* PhaseFinish */ && owner.getFlag(this.Name);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 137 /* DamageEvent */) {
            room.getPlayerById(event.fromId).setFlag(this.Name, true);
            event_packer_1.EventPacker.addMiddleware({ tag: this.GeneralName, data: true }, unknownEvent);
        }
        else {
            room.removeFlag(event.fromId, this.Name);
        }
        return true;
    }
};
ZhuKouShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: ZhuKouDamage.Name, description: ZhuKouDamage.Description })
], ZhuKouShadow);
exports.ZhuKouShadow = ZhuKouShadow;
