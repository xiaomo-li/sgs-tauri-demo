"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhongZuo = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhongZuo = class ZhongZuo extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.toStage === 19 /* FinishStageStart */ &&
            room.Analytics.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 137 /* DamageEvent */ &&
                (event.fromId === owner.Id || event.toId === owner.Id), undefined, 'round', undefined, 1).length > 0);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget() {
        return true;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target to draw 2 cards? If he is wounded, you draw 1 card', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        await room.drawCards(2, event.toIds[0], 'top', event.toIds[0], this.Name);
        room.getPlayerById(event.toIds[0]).LostHp > 0 &&
            (await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name));
        return true;
    }
};
ZhongZuo = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'zhongzuo', description: 'zhongzuo_description' })
], ZhongZuo);
exports.ZhongZuo = ZhongZuo;
