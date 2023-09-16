"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuanFeng = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const hongyi_1 = require("./hongyi");
let QuanFeng = class QuanFeng extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterPlayerDied" /* AfterPlayerDied */ || stage === "RequestRescue" /* RequestRescue */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 153 /* PlayerDiedEvent */) {
            return (owner.hasSkill(hongyi_1.HongYi.Name) &&
                content.playerId !== owner.Id);
        }
        else if (identifier === 152 /* PlayerDyingEvent */) {
            return content.dying === owner.Id;
        }
        return false;
    }
    getSkillLog(room, owner, event) {
        return event_packer_1.EventPacker.getIdentifier(event) === 153 /* PlayerDiedEvent */
            ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to lose skill ‘Hong Yi’ to gain {1}’s skills?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.playerId))).extract()
            : translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to gain 2 max hp and recover 4 hp?').extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const unknownEvent = event.triggeredOnEvent;
        if (event_packer_1.EventPacker.getIdentifier(unknownEvent) === 153 /* PlayerDiedEvent */) {
            const whoDead = unknownEvent.playerId;
            const skillNames = room
                .getPlayerById(whoDead)
                .getPlayerSkills(undefined, true)
                .filter(skill => !skill.isShadowSkill() && !skill.isLordSkill() && !skill.isStubbornSkill())
                .map(skill => skill.Name);
            await room.loseSkill(fromId, hongyi_1.HongYi.Name);
            for (const skillName of skillNames) {
                await room.obtainSkill(fromId, skillName, true);
            }
            await room.changeMaxHp(fromId, 1);
            await room.recover({
                toId: fromId,
                recoveredHp: 1,
                recoverBy: fromId,
            });
        }
        else {
            await room.changeMaxHp(fromId, 2);
            await room.recover({
                toId: fromId,
                recoveredHp: 4,
                recoverBy: fromId,
            });
        }
        return true;
    }
};
QuanFeng = tslib_1.__decorate([
    skill_wrappers_1.LimitSkill({ name: 'quanfeng', description: 'quanfeng_description' })
], QuanFeng);
exports.QuanFeng = QuanFeng;
