"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FenLi = void 0;
const tslib_1 = require("tslib");
const functional_1 = require("core/shares/libs/functional");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let FenLi = class FenLi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    canUse(room, owner, content) {
        return (content.toPlayer === owner.Id &&
            ((content.to === 3 /* DrawCardStage */ &&
                room
                    .getOtherPlayers(owner.Id)
                    .find(player => player.getCardIds(0 /* HandArea */).length > owner.getCardIds(0 /* HandArea */).length) === undefined) ||
                (content.to === 4 /* PlayCardStage */ &&
                    room.getOtherPlayers(owner.Id).find(player => player.Hp > owner.Hp) === undefined) ||
                (content.to === 5 /* DropCardStage */ &&
                    owner.getCardIds(1 /* EquipArea */).length > 0 &&
                    room
                        .getOtherPlayers(owner.Id)
                        .find(player => player.getCardIds(1 /* EquipArea */).length >
                        owner.getCardIds(1 /* EquipArea */).length) === undefined)));
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to skip {1} ?', this.Name, functional_1.Functional.getPlayerPhaseRawText(event.to)).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.skip(event.fromId, event.triggeredOnEvent.to);
        return true;
    }
};
FenLi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'fenli', description: 'fenli_description' })
], FenLi);
exports.FenLi = FenLi;
