"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BingJieShadow = exports.BingJie = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let BingJie = class BingJie extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && content.toStage === 13 /* PlayCardStageStart */;
    }
    getSkillLog(room) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to reduce 1 max hp to use this skill?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.changeMaxHp(event.fromId, -1);
        room.getPlayerById(event.fromId).setFlag(this.Name, true);
        return true;
    }
};
BingJie = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'bingjie', description: 'bingjie_description' })
], BingJie);
exports.BingJie = BingJie;
let BingJieShadow = class BingJieShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    isTriggerable(event, stage) {
        return stage === "AfterAim" /* AfterAim */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        if (!owner.getFlag(this.GeneralName)) {
            return false;
        }
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 131 /* AimEvent */) {
            const aimEvent = content;
            return (aimEvent.fromId === owner.Id &&
                aimEvent.isFirstTarget &&
                (engine_1.Sanguosha.getCardById(aimEvent.byCardId).GeneralName === 'slash' ||
                    engine_1.Sanguosha.getCardById(aimEvent.byCardId).isCommonTrick()) &&
                !!aim_group_1.AimGroupUtil.getAllTargets(aimEvent.allTargets).find(playerId => playerId !== owner.Id));
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            return content.from === 7 /* PhaseFinish */;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        if (event_packer_1.EventPacker.getIdentifier(unknownEvent) === 131 /* AimEvent */) {
            const allTargets = aim_group_1.AimGroupUtil.getAllTargets(unknownEvent.allTargets);
            for (const toId of allTargets) {
                if (toId === event.fromId || room.getPlayerById(toId).getPlayerCards().length === 0) {
                    continue;
                }
                const response = await room.askForCardDrop(toId, 1, [0 /* HandArea */, 1 /* EquipArea */], true, undefined, this.GeneralName);
                response.droppedCards.length > 0 &&
                    (await room.dropCards(4 /* SelfDrop */, response.droppedCards, toId, toId, this.GeneralName));
            }
        }
        else {
            room.getPlayerById(event.fromId).removeFlag(this.GeneralName);
        }
        return true;
    }
};
BingJieShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: BingJie.Name, description: BingJie.Description })
], BingJieShadow);
exports.BingJieShadow = BingJieShadow;
