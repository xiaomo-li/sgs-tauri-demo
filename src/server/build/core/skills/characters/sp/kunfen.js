"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KunFenEX = exports.KunFen = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let KunFen = class KunFen extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && content.toStage === 19 /* FinishStageStart */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: true }, event.triggeredOnEvent);
        await room.loseHp(event.fromId, 1);
        room.getPlayerById(event.fromId).Dead || (await room.drawCards(2, event.fromId, 'top', event.fromId, this.Name));
        return true;
    }
};
KunFen = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'kunfen', description: 'kunfen_description' })
], KunFen);
exports.KunFen = KunFen;
let KunFenEX = class KunFenEX extends KunFen {
    get GeneralName() {
        return KunFen.Name;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 19 /* FinishStageStart */ &&
            !event_packer_1.EventPacker.getMiddleware(this.GeneralName, content) &&
            owner.Hp > 0);
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to lose 1 hp to draw 2 cards?', this.Name).extract();
    }
};
KunFenEX = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'kunfen_EX', description: 'kunfen_EX_description' })
], KunFenEX);
exports.KunFenEX = KunFenEX;
