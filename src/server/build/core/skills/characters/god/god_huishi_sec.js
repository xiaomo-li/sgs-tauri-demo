"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GodHuiShiSecRemover = exports.GodHuiShiSec = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let GodHuiShiSec = class GodHuiShiSec extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return true;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableTarget() {
        return true;
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
        const awakeningSkills = [];
        const to = room.getPlayerById(toIds[0]);
        for (const skill of to.getPlayerSkills('awaken', true)) {
            to.hasUsedSkill(skill.Name) || awakeningSkills.push(skill);
        }
        if (room.getPlayerById(fromId).MaxHp >= room.AlivePlayers.length && awakeningSkills.length > 0) {
            const options = awakeningSkills.map(skill => skill.Name);
            const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                options,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose god_huishi_sec options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to)).extract(),
                toId: fromId,
                triggeredBySkills: [this.Name],
            }, fromId, true);
            response.selectedOption = response.selectedOption || options[0];
            const originalSkillNames = to.getFlag("flag:enable_to_awaken" /* EnableToAwaken */) || [];
            if (!originalSkillNames.includes(response.selectedOption)) {
                originalSkillNames.push(response.selectedOption);
                let tag = '{0}[';
                for (let i = 1; i <= originalSkillNames.length; i++) {
                    tag = tag + '{' + i + '}';
                }
                tag = tag + ']';
                room.setFlag(toIds[0], "flag:enable_to_awaken" /* EnableToAwaken */, originalSkillNames, translation_json_tool_1.TranslationPack.translationJsonPatcher(tag, this.Name, ...originalSkillNames).toString());
                to.hasShadowSkill(GodHuiShiSecRemover.Name) || (await room.obtainSkill(toIds[0], GodHuiShiSecRemover.Name));
            }
        }
        else {
            await room.drawCards(4, toIds[0], 'top', fromId, this.Name);
        }
        await room.changeMaxHp(fromId, -2);
        return true;
    }
};
GodHuiShiSec = tslib_1.__decorate([
    skill_wrappers_1.LimitSkill({ name: 'god_huishi_sec', description: 'god_huishi_sec_description' })
], GodHuiShiSec);
exports.GodHuiShiSec = GodHuiShiSec;
let GodHuiShiSecRemover = class GodHuiShiSecRemover extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "BeforeSkillUse" /* BeforeSkillUse */;
    }
    canUse(room, owner, content) {
        var _a;
        return owner.Id === content.fromId && ((_a = owner.getFlag("flag:enable_to_awaken" /* EnableToAwaken */)) === null || _a === void 0 ? void 0 : _a.includes(content.skillName));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const content = event.triggeredOnEvent;
        const originalSkillNames = room.getFlag(content.fromId, "flag:enable_to_awaken" /* EnableToAwaken */) || [];
        if (originalSkillNames.includes(content.skillName)) {
            const index = originalSkillNames.findIndex(name => name === content.skillName);
            originalSkillNames.splice(index, 1);
            if (originalSkillNames.length === 0) {
                room.removeFlag(content.fromId, "flag:enable_to_awaken" /* EnableToAwaken */);
                await room.loseSkill(content.fromId, this.Name);
            }
            else {
                let tag = '{0}[';
                for (let i = 1; i <= originalSkillNames.length; i++) {
                    tag = tag + '{' + i + '}';
                }
                tag = tag + ']';
                room.setFlag(content.fromId, "flag:enable_to_awaken" /* EnableToAwaken */, originalSkillNames, translation_json_tool_1.TranslationPack.translationJsonPatcher(tag, GodHuiShiSec.Name, ...originalSkillNames).toString());
            }
        }
        return true;
    }
};
GodHuiShiSecRemover = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_god_huishi_sec_remover', description: 's_god_huishi_sec_remover_description' })
], GodHuiShiSecRemover);
exports.GodHuiShiSecRemover = GodHuiShiSecRemover;
