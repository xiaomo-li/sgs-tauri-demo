"use strict";
var TongYe_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TongYeShadow = exports.TongYe = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let TongYe = TongYe_1 = class TongYe extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, event) {
        return event.playerId === owner.Id && event.toStage === 19 /* FinishStageStart */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options: TongYe_1.Options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose tongye options', this.Name).extract(),
            toId: event.fromId,
            triggeredBySkills: [this.Name],
        }, event.fromId, true);
        response.selectedOption = response.selectedOption || TongYe_1.Options[0];
        const currentEquipsNum = room.AlivePlayers.reduce((sum, player) => sum + player.getCardIds(1 /* EquipArea */).length, 0);
        room.setFlag(event.fromId, this.Name, response.selectedOption + '+' + currentEquipsNum, translation_json_tool_1.TranslationPack.translationJsonPatcher('tongye: {0} {1}', response.selectedOption, currentEquipsNum).toString());
        room.getPlayerById(event.fromId).setFlag(TongYeShadow.Name, true);
        return true;
    }
};
TongYe.Options = ['tongye:change', 'tongye:unchange'];
TongYe = TongYe_1 = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'tongye', description: 'tongye_description' })
], TongYe);
exports.TongYe = TongYe;
let TongYeShadow = class TongYeShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner) {
        return !!room.getPlayerById(owner).getFlag(this.GeneralName);
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = event;
            return (phaseStageChangeEvent.playerId === owner.Id &&
                phaseStageChangeEvent.toStage === 3 /* PrepareStageStart */ &&
                !!owner.getFlag(this.GeneralName) &&
                !owner.getFlag(this.Name));
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return (phaseChangeEvent.from === 7 /* PhaseFinish */ &&
                phaseChangeEvent.fromPlayer === owner.Id &&
                (!!owner.getFlag(this.GeneralName) || owner.getFlag(this.Name)));
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        if (event_packer_1.EventPacker.getIdentifier(unknownEvent) === 105 /* PhaseStageChangeEvent */) {
            const tongyeRecord = room.getFlag(event.fromId, this.GeneralName).split('+');
            room.removeFlag(event.fromId, this.GeneralName);
            room.getPlayerById(event.fromId).removeFlag(this.Name);
            const currentEquipsNum = room.AlivePlayers.reduce((sum, player) => sum + player.getCardIds(1 /* EquipArea */).length, 0);
            if ((tongyeRecord[0] === TongYe.Options[0] && parseInt(tongyeRecord[1], 10) !== currentEquipsNum) ||
                (tongyeRecord[0] === TongYe.Options[1] && parseInt(tongyeRecord[1], 10) === currentEquipsNum)) {
                room.getMark(event.fromId, "ye" /* Ye */) < 2 && room.addMark(event.fromId, "ye" /* Ye */, 1);
            }
            else {
                room.getMark(event.fromId, "ye" /* Ye */) > 0 && room.addMark(event.fromId, "ye" /* Ye */, -1);
            }
        }
        else {
            if (room.getFlag(event.fromId, this.Name)) {
                room.getPlayerById(event.fromId).removeFlag(this.Name);
            }
            else {
                room.removeFlag(event.fromId, this.GeneralName);
            }
        }
        return true;
    }
};
TongYeShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: TongYe.Name, description: TongYe.Description })
], TongYeShadow);
exports.TongYeShadow = TongYeShadow;
