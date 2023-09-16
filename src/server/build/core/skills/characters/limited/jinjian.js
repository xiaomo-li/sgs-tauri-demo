"use strict";
var JinJian_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JinJianShadow = exports.JinJian = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JinJian = JinJian_1 = class JinJian extends skill_1.TriggerSkill {
    constructor() {
        super(...arguments);
        this.JinJianStage = 'jinjian_stage';
    }
    isTriggerable(event, stage) {
        return stage === "DamageEffect" /* DamageEffect */ || stage === "DamagedEffect" /* DamagedEffect */;
    }
    canUse(room, owner, content, stage) {
        if (event_packer_1.EventPacker.getMiddleware(JinJianShadow.Name, content)) {
            return false;
        }
        if (stage === "DamageEffect" /* DamageEffect */
            ? content.fromId === owner.Id && !owner.getFlag(this.Name)
            : content.toId === owner.Id && !owner.getFlag(JinJian_1.Debuff)) {
            owner.setFlag(this.JinJianStage, stage);
            return true;
        }
        return false;
    }
    getSkillLog(room, owner, event) {
        return owner.getFlag(this.JinJianStage) === "DamageEffect" /* DamageEffect */
            ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to increase the damage {1} will take by 1?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.toId))).extract()
            : translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to reduce the damage you will take by 1?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const damageEvent = event.triggeredOnEvent;
        if (room.getFlag(event.fromId, this.JinJianStage) === "DamageEffect" /* DamageEffect */) {
            damageEvent.damage++;
            room.setFlag(event.fromId, this.Name, true, 'jinjian-1');
        }
        else {
            damageEvent.damage--;
            room.setFlag(event.fromId, JinJian_1.Debuff, true, 'jinjian+1');
            if (damageEvent.damage < 1) {
                event_packer_1.EventPacker.terminate(damageEvent);
            }
        }
        event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: true }, damageEvent);
        return true;
    }
};
JinJian.Debuff = 'jinjian_debuff';
JinJian = JinJian_1 = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'jinjian', description: 'jinjian_description' })
], JinJian);
exports.JinJian = JinJian;
let JinJianShadow = class JinJianShadow extends skill_1.TriggerSkill {
    constructor() {
        super(...arguments);
        this.JinJianShadowStage = 'jinjian_shadow_stage';
    }
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    async whenDead(room, player) {
        for (const flagName of [this.GeneralName, JinJian.Debuff]) {
            player.getFlag(flagName) !== undefined && room.removeFlag(player.Id, flagName);
        }
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    isTriggerable(event, stage) {
        return (stage === "DamageEffect" /* DamageEffect */ ||
            stage === "DamagedEffect" /* DamagedEffect */ ||
            stage === "PhaseChanged" /* PhaseChanged */);
    }
    canUse(room, owner, content, stage) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 137 /* DamageEvent */ &&
            !event_packer_1.EventPacker.getMiddleware(this.GeneralName, content)) {
            const damageEvent = content;
            if (stage === "DamageEffect" /* DamageEffect */
                ? damageEvent.fromId === owner.Id && owner.getFlag(this.GeneralName)
                : damageEvent.toId === owner.Id && owner.getFlag(JinJian.Debuff)) {
                owner.setFlag(this.JinJianShadowStage, stage);
                return true;
            }
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            return content.from === 7 /* PhaseFinish */;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        if (event_packer_1.EventPacker.getIdentifier(unknownEvent) === 137 /* DamageEvent */) {
            const damageEvent = unknownEvent;
            if (room.getFlag(event.fromId, this.JinJianShadowStage) === "DamagedEffect" /* DamagedEffect */) {
                damageEvent.damage++;
                room.removeFlag(event.fromId, JinJian.Debuff);
            }
            else {
                damageEvent.damage--;
                room.removeFlag(event.fromId, this.GeneralName);
                if (damageEvent.damage < 1) {
                    event_packer_1.EventPacker.terminate(damageEvent);
                }
            }
            event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: true }, damageEvent);
        }
        else {
            for (const flagName of [this.GeneralName, JinJian.Debuff]) {
                room.getFlag(event.fromId, flagName) !== undefined && room.removeFlag(event.fromId, flagName);
            }
        }
        return true;
    }
};
JinJianShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: JinJian.Name, description: JinJian.Description })
], JinJianShadow);
exports.JinJianShadow = JinJianShadow;
