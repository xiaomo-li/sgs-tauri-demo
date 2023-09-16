"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TuoGu = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let TuoGu = class TuoGu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PlayerDied" /* PlayerDied */;
    }
    canUse(room, owner, content) {
        return (content.playerId !== owner.Id &&
            room
                .getPlayerById(content.playerId)
                .getPlayerSkills(undefined, true)
                .find(skill => !skill.isShadowSkill() &&
                !skill.isLordSkill() &&
                skill.SkillType !== 3 /* Limit */ &&
                skill.SkillType !== 2 /* Awaken */ &&
                skill.SkillType !== 4 /* Quest */ &&
                !skill.isStubbornSkill()) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const deadMan = event.triggeredOnEvent.playerId;
        const skillNames = room
            .getPlayerById(deadMan)
            .getPlayerSkills(undefined, true)
            .filter(skill => !skill.isShadowSkill() &&
            !skill.isLordSkill() &&
            skill.SkillType !== 3 /* Limit */ &&
            skill.SkillType !== 2 /* Awaken */ &&
            skill.SkillType !== 4 /* Quest */ &&
            !skill.isStubbornSkill())
            .map(skill => skill.Name);
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent({
            options: skillNames,
            toId: deadMan,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose a skill to let {1} gain it', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId))).extract(),
            triggeredBySkills: [this.Name],
        }), deadMan);
        response.selectedOption = response.selectedOption || skillNames[Math.floor(Math.random() * skillNames.length)];
        const from = room.getPlayerById(fromId);
        const lastSkillName = room.getFlag(fromId, this.Name);
        lastSkillName && (await room.loseSkill(fromId, lastSkillName, true));
        room.removeFlag(fromId, this.Name);
        if (!from.hasSkill(response.selectedOption)) {
            await room.obtainSkill(fromId, response.selectedOption);
            from.setFlag(this.Name, response.selectedOption);
        }
        return true;
    }
};
TuoGu = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'tuogu', description: 'tuogu_description' })
], TuoGu);
exports.TuoGu = TuoGu;
