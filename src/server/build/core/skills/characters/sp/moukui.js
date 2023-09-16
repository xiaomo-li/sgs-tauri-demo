"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouKuiShadow = exports.MouKui = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let MouKui = class MouKui extends skill_1.TriggerSkill {
    constructor() {
        super(...arguments);
        this.MouKuiOptions = ['moukui:draw', 'moukui:discard'];
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterAimmed" /* AfterAimmed */;
    }
    canUse(room, owner, content) {
        return content.fromId === owner.Id && engine_1.Sanguosha.getCardById(content.byCardId).GeneralName === 'slash';
    }
    async beforeUse(room, event) {
        const options = this.MouKuiOptions.slice();
        const to = room.getPlayerById(event.triggeredOnEvent.toId);
        if (to.Id === event.fromId
            ? !to.getPlayerCards().find(id => room.canDropCard(event.fromId, id))
            : to.getPlayerCards().length === 0) {
            options.pop();
        }
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose moukui options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to)).extract(),
            toId: event.fromId,
            triggeredBySkills: [this.Name],
        }, event.fromId);
        if (response.selectedOption) {
            event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: response.selectedOption }, event);
            return true;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const chosen = event_packer_1.EventPacker.getMiddleware(this.Name, event);
        if (chosen === this.MouKuiOptions[0]) {
            await room.drawCards(1, fromId, 'top', fromId, this.Name);
        }
        else {
            const to = room.getPlayerById(event.triggeredOnEvent.toId);
            const options = {
                [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
                [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
            };
            const chooseCardEvent = {
                fromId,
                toId: to.Id,
                options,
                triggeredBySkills: [this.Name],
            };
            const resp = await room.askForChoosingPlayerCard(chooseCardEvent, fromId, true, true);
            if (!resp) {
                return false;
            }
            await room.dropCards(fromId === to.Id ? 4 /* SelfDrop */ : 5 /* PassiveDrop */, [resp.selectedCard], to.Id, fromId, this.Name);
        }
        event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: event.fromId }, event.triggeredOnEvent);
        return true;
    }
};
MouKui = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'moukui', description: 'moukui_description' })
], MouKui);
exports.MouKui = MouKui;
let MouKuiShadow = class MouKuiShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 0 /* PhaseBegin */ && stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "CardEffectCancelledOut" /* CardEffectCancelledOut */;
    }
    canUse(room, owner, content) {
        return (content.toIds !== undefined &&
            event_packer_1.EventPacker.getMiddleware(this.GeneralName, content) === owner.Id &&
            engine_1.Sanguosha.getCardById(content.cardId).GeneralName === 'slash');
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const from = room.getPlayerById(event.fromId);
        const toId = event.triggeredOnEvent.toIds[0];
        if (toId === event.fromId
            ? from.getPlayerCards().find(id => room.canDropCard(event.fromId, id))
            : from.getPlayerCards().length > 0) {
            const options = {
                [1 /* EquipArea */]: from.getCardIds(1 /* EquipArea */),
                [0 /* HandArea */]: from.getCardIds(0 /* HandArea */).length,
            };
            const chooseCardEvent = {
                fromId: toId,
                toId: event.fromId,
                options,
                triggeredBySkills: [this.Name],
            };
            const resp = await room.askForChoosingPlayerCard(chooseCardEvent, toId, true, true);
            if (!resp) {
                return false;
            }
            await room.dropCards(event.fromId === toId ? 4 /* SelfDrop */ : 5 /* PassiveDrop */, [resp.selectedCard], event.fromId, toId, this.Name);
        }
        return true;
    }
};
MouKuiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: MouKui.Name, description: MouKui.Description })
], MouKuiShadow);
exports.MouKuiShadow = MouKuiShadow;
