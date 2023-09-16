"use strict";
var DuoRui_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuoRuiShadow = exports.DuoRuiProhibited = exports.DuoRui = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_hooks_1 = require("core/skills/skill_hooks");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let DuoRui = DuoRui_1 = class DuoRui extends skill_1.TriggerSkill {
    async whenDead(room, player) {
        const toId = player.getFlag(DuoRui_1.DuoRuiTarget);
        if (toId) {
            const to = room.getPlayerById(toId);
            if (to && to.hasShadowSkill(DuoRuiProhibited.Name)) {
                await room.loseSkill(toId, DuoRuiProhibited.Name);
            }
            room.removeFlag(toId, this.GeneralName);
            room.removeFlag(player.Id, DuoRui_1.DuoRuiTarget);
        }
        const skill = player.getFlag(DuoRui_1.DuoRuiSkill);
        if (skill) {
            room.removeFlag(player.Id, DuoRui_1.DuoRuiSkill);
            player.hasSkill(skill) && (await room.loseSkill(player.Id, skill));
        }
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamageEffect" /* AfterDamageEffect */;
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
            room.CurrentPhasePlayer === owner &&
            content.toId !== owner.Id &&
            owner.AvailableEquipSections.length > 0 &&
            (owner.getFlag(DuoRui_1.DuoRuiTarget) === undefined ||
                owner.getFlag(DuoRui_1.DuoRuiSkill) === undefined));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, triggeredOnEvent } = skillUseEvent;
        const from = room.getPlayerById(fromId);
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent({
            options: from.AvailableEquipSections,
            toId: fromId,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose and abort an equip section', this.Name).extract(),
            triggeredBySkills: [this.Name],
        }), fromId);
        response.selectedOption = response.selectedOption || from.AvailableEquipSections[0];
        await room.abortPlayerEquipSections(fromId, response.selectedOption);
        const damageEvent = triggeredOnEvent;
        const toId = damageEvent.toId;
        const to = room.getPlayerById(toId);
        const skills = to
            .getPlayerSkills()
            .filter(skill => !skill.isShadowSkill() &&
            skill.SkillType !== 2 /* Awaken */ &&
            skill.SkillType !== 3 /* Limit */ &&
            skill.SkillType !== 4 /* Quest */ &&
            !skill.isLordSkill() &&
            !skill.isStubbornSkill());
        if (!to.Dead && skills.length > 0) {
            const skillNames = skills.map(skill => skill.Name);
            const resp = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent({
                options: skillNames,
                toId: fromId,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose a skill to nullify and you obtain it until the end of target’s turn', this.Name).extract(),
                triggeredBySkills: [this.Name],
            }), fromId);
            resp.selectedOption = resp.selectedOption || skillNames[0];
            room.setFlag(toId, this.Name, resp.selectedOption, translation_json_tool_1.TranslationPack.translationJsonPatcher('duorui target skill: {0}', resp.selectedOption).toString());
            from.setFlag(DuoRui_1.DuoRuiTarget, toId);
            room.setFlag(fromId, DuoRui_1.DuoRuiSkill, resp.selectedOption, translation_json_tool_1.TranslationPack.translationJsonPatcher('duorui skill: {0}', resp.selectedOption).toString());
            await room.obtainSkill(toId, DuoRuiProhibited.Name);
            await room.obtainSkill(fromId, resp.selectedOption);
        }
        return true;
    }
};
DuoRui.DuoRuiTarget = 'duorui_target';
DuoRui.DuoRuiSkill = 'duorui_skill';
DuoRui = DuoRui_1 = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'duorui', description: 'duorui_description' })
], DuoRui);
exports.DuoRui = DuoRui;
let DuoRuiProhibited = class DuoRuiProhibited extends skill_1.SkillProhibitedSkill {
    async whenObtainingSkill(room, player) {
        if (!player.getFlag(DuoRui.Name)) {
            return;
        }
        for (const playerSkill of player.getSkillProhibitedSkills(true)) {
            this.skillFilter(playerSkill, player) &&
                (await skill_hooks_1.SkillLifeCycle.executeHookedOnNullifying(playerSkill, room, player));
        }
    }
    async whenLosingSkill(room, player) {
        if (!player.getFlag(DuoRui.Name)) {
            return;
        }
        for (const playerSkill of player.getSkillProhibitedSkills(true)) {
            this.skillFilter(playerSkill, player) &&
                (await skill_hooks_1.SkillLifeCycle.executeHookedOnEffecting(playerSkill, room, player));
        }
    }
    skillFilter(skill, owner) {
        return skill.GeneralName === owner.getFlag(DuoRui.Name);
    }
};
DuoRuiProhibited = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: 'shadow_duorui', description: 'shadow_duorui_description' })
], DuoRuiProhibited);
exports.DuoRuiProhibited = DuoRuiProhibited;
let DuoRuiShadow = class DuoRuiShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return (room.CurrentPlayerPhase === 7 /* PhaseFinish */ &&
            stage === "PhaseChanged" /* PhaseChanged */ &&
            !room.getPlayerById(owner).getFlag(DuoRui.DuoRuiTarget));
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */ || stage === "AfterPlayerDied" /* AfterPlayerDied */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = content;
            return (phaseChangeEvent.from === 7 /* PhaseFinish */ &&
                phaseChangeEvent.fromPlayer === owner.getFlag(DuoRui.DuoRuiTarget));
        }
        else if (identifier === 153 /* PlayerDiedEvent */) {
            const playerDiedEvent = content;
            return playerDiedEvent.playerId === owner.getFlag(DuoRui.DuoRuiTarget);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const from = room.getPlayerById(fromId);
        const toId = from.getFlag(DuoRui.DuoRuiTarget);
        if (toId) {
            const to = room.getPlayerById(toId);
            if (to && to.hasShadowSkill(DuoRuiProhibited.Name)) {
                await room.loseSkill(toId, DuoRuiProhibited.Name);
            }
            room.removeFlag(toId, this.GeneralName);
            room.removeFlag(fromId, DuoRui.DuoRuiTarget);
        }
        const skill = from.getFlag(DuoRui.DuoRuiSkill);
        if (skill) {
            room.removeFlag(fromId, DuoRui.DuoRuiSkill);
            from.hasSkill(skill) && (await room.loseSkill(fromId, skill));
        }
        return true;
    }
};
DuoRuiShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: DuoRui.Name, description: DuoRui.Description })
], DuoRuiShadow);
exports.DuoRuiShadow = DuoRuiShadow;
