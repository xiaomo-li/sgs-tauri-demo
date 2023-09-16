"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanShiShadow = exports.CanShi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const guiming_1 = require("./guiming");
let CanShi = class CanShi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardDrawing" /* CardDrawing */;
    }
    canUse(room, owner, content) {
        if (!(owner.Id === content.fromId &&
            room.CurrentPlayerPhase === 3 /* DrawCardStage */ &&
            content.bySpecialReason === 0 /* GameStage */ &&
            content.drawAmount > 0)) {
            return false;
        }
        const hasGuiMing = owner.getPlayerSkills().find(skill => skill.Name === guiming_1.GuiMing.Name);
        return (room
            .getAlivePlayersFrom()
            .find(player => player.LostHp > 0 || (owner !== player && hasGuiMing && player.Nationality === 2 /* Wu */)) !== undefined);
    }
    getSkillLog(room, owner) {
        const hasGuiMing = owner.getPlayerSkills().find(skill => skill.Name === guiming_1.GuiMing.Name);
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw {1} card(s) additionally?', this.Name, room
            .getAlivePlayersFrom()
            .filter(player => player.LostHp > 0 || (owner !== player && hasGuiMing && player.Nationality === 2 /* Wu */)).length).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const from = room.getPlayerById(event.fromId);
        const drawCardEvent = event.triggeredOnEvent;
        const hasGuiMing = from.getPlayerSkills().find(skill => skill.Name === guiming_1.GuiMing.Name);
        drawCardEvent.drawAmount += room
            .getAlivePlayersFrom()
            .filter(player => player.LostHp > 0 || (from !== player && hasGuiMing && player.Nationality === 2 /* Wu */)).length;
        from.setFlag(this.Name, true);
        return true;
    }
};
CanShi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'canshi', description: 'canshi_description' })
], CanShi);
exports.CanShi = CanShi;
let CanShiShadow = class CanShiShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        if (!owner.getFlag(this.GeneralName)) {
            return false;
        }
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = content;
            return (cardUseEvent.fromId === owner.Id &&
                (engine_1.Sanguosha.getCardById(cardUseEvent.cardId).GeneralName === 'slash' ||
                    engine_1.Sanguosha.getCardById(cardUseEvent.cardId).isCommonTrick()) &&
                owner.getPlayerCards().find(id => room.canDropCard(owner.Id, id)) !== undefined);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = content;
            return phaseChangeEvent.fromPlayer === owner.Id && phaseChangeEvent.from === 7 /* PhaseFinish */;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event.triggeredOnEvent);
        if (identifier === 124 /* CardUseEvent */) {
            const response = await room.askForCardDrop(event.fromId, 1, [0 /* HandArea */, 1 /* EquipArea */], true, undefined, this.GeneralName);
            response.droppedCards.length > 0 &&
                (await room.dropCards(4 /* SelfDrop */, response.droppedCards, event.fromId, event.fromId, this.GeneralName));
        }
        else {
            room.removeFlag(event.fromId, this.GeneralName);
        }
        return true;
    }
};
CanShiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: CanShi.Name, description: CanShi.Description })
], CanShiShadow);
exports.CanShiShadow = CanShiShadow;
