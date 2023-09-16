"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingKou = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let PingKou = class PingKou extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "BeforePhaseChange" /* BeforePhaseChange */;
    }
    canUse(room, owner, content) {
        if (owner.getFlag(this.Name)) {
            room.removeFlag(owner.Id, this.Name);
        }
        let canUse = content.fromPlayer === owner.Id && content.from === 7 /* PhaseFinish */;
        if (canUse) {
            const skipped = room.Analytics.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 154 /* PhaseSkippedEvent */ && event.playerId === owner.Id, owner.Id, 'round').length;
            canUse = skipped > 0;
            canUse && room.setFlag(owner.Id, this.Name, skipped);
        }
        return canUse;
    }
    targetFilter(room, owner, targets) {
        return targets.length > 0 && targets.length <= owner.getFlag(this.Name);
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target;
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose at least {1} target(s) to deal 1 damage each?', this.Name, owner.getFlag(this.Name)).extract();
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
                triggeredBySkills: [this.Name],
            });
        }
        return true;
    }
};
PingKou = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'pingkou', description: 'pingkou_description' })
], PingKou);
exports.PingKou = PingKou;
