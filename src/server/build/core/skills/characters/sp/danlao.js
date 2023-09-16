"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DanLao = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let DanLao = class DanLao extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterAimmed" /* AfterAimmed */;
    }
    canUse(room, owner, content) {
        return (content.toId === owner.Id &&
            (engine_1.Sanguosha.getCardById(content.byCardId).GeneralName === 'slash' ||
                engine_1.Sanguosha.getCardById(content.byCardId).is(7 /* Trick */)) &&
            aim_group_1.AimGroupUtil.getAllTargets(content.allTargets).length > 1);
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw a card and let {1} nullify to you?', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(event.byCardId)).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const aimEvent = event.triggeredOnEvent;
        await room.drawCards(1, fromId, 'top', fromId, this.Name);
        aimEvent.nullifiedTargets.push(fromId);
        return true;
    }
};
DanLao = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'danlao', description: 'danlao_description' })
], DanLao);
exports.DanLao = DanLao;
