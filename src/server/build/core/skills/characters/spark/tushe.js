"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TuShe = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let TuShe = class TuShe extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterAim" /* AfterAim */;
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            content.isFirstTarget &&
            !engine_1.Sanguosha.getCardById(content.byCardId).is(1 /* Equip */) &&
            owner.getCardIds(0 /* HandArea */).find(id => engine_1.Sanguosha.getCardById(id).is(0 /* Basic */)) === undefined);
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw {1} card(s)?', this.Name, aim_group_1.AimGroupUtil.getAllTargets(event.allTargets).length).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const num = aim_group_1.AimGroupUtil.getAllTargets(event.triggeredOnEvent.allTargets).length;
        await room.drawCards(num, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
TuShe = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'tushe', description: 'tushe_description' })
], TuShe);
exports.TuShe = TuShe;
