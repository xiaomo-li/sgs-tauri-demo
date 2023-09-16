"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JuZhanRemove = exports.JuZhanShadow = exports.JuZhanYin = exports.JuZhan = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JuZhan = class JuZhan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterAimmed" /* AfterAimmed */;
    }
    canUse(room, owner, content) {
        return (content.toId === owner.Id &&
            content.fromId !== owner.Id &&
            content.byCardId !== undefined &&
            engine_1.Sanguosha.getCardById(content.byCardId).GeneralName === 'slash' &&
            !room.getPlayerById(content.fromId).Dead &&
            owner.getSwitchSkillState(this.Name, true) === 0 /* Yang */);
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw a card with {1} , then he cannot use card to you this round?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const user = triggeredOnEvent.fromId;
        const players = [fromId, user];
        room.sortPlayersByPosition(players);
        for (const playerId of players) {
            await room.drawCards(1, playerId, 'top', fromId, this.Name);
        }
        const playerIds = room.getFlag(fromId, this.Name) || [];
        if (!playerIds.includes(user)) {
            playerIds.push(user);
            room.setFlag(fromId, this.Name, playerIds);
        }
        return true;
    }
};
JuZhan = tslib_1.__decorate([
    skill_wrappers_1.SwitchSkill(),
    skill_1.CommonSkill({ name: 'juzhan', description: 'juzhan_description' })
], JuZhan);
exports.JuZhan = JuZhan;
let JuZhanYin = class JuZhanYin extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterAim" /* AfterAim */;
    }
    canUse(room, owner, content) {
        const allTargets = aim_group_1.AimGroupUtil.getAllTargets(content.allTargets);
        const canUse = content.fromId === owner.Id &&
            !!content.isFirstTarget &&
            content.byCardId !== undefined &&
            engine_1.Sanguosha.getCardById(content.byCardId).GeneralName === 'slash' &&
            owner.getSwitchSkillState(this.GeneralName, true) === 1 /* Yin */ &&
            allTargets.find(playerId => room.getPlayerById(playerId).getPlayerCards().length > 0) !== undefined;
        if (canUse) {
            room.setFlag(owner.Id, this.Name, allTargets);
        }
        return canUse;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, targetId) {
        return (room.getFlag(owner, this.Name).includes(targetId) &&
            room.getPlayerById(targetId).getPlayerCards().length > 0);
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target to prey a card from him, then you cannot use card to him this round?', this.GeneralName).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        const to = room.getPlayerById(toIds[0]);
        const options = {
            [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
            [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
        };
        if (fromId === toIds[0]) {
            options[0 /* HandArea */] = undefined;
        }
        const chooseCardEvent = event_packer_1.EventPacker.createUncancellableEvent({
            fromId,
            toId: toIds[0],
            options,
        });
        const response = await room.doAskForCommonly(170 /* AskForChoosingCardFromPlayerEvent */, chooseCardEvent, fromId);
        if (response.selectedCardIndex !== undefined) {
            const cardIds = to.getCardIds(0 /* HandArea */);
            response.selectedCard = cardIds[Math.floor(Math.random() * cardIds.length)];
        }
        else if (response.selectedCard === undefined) {
            const cardIds = to.getPlayerCards();
            response.selectedCard = cardIds[Math.floor(Math.random() * cardIds.length)];
        }
        await room.moveCards({
            movingCards: [{ card: response.selectedCard, fromArea: response.fromArea }],
            fromId: toIds[0],
            toId: fromId,
            toArea: 0 /* HandArea */,
            moveReason: 1 /* ActivePrey */,
            triggeredBySkills: [this.GeneralName],
        });
        const playerIds = room.getFlag(fromId, this.GeneralName) || [];
        if (!playerIds.includes(toIds[0])) {
            playerIds.push(toIds[0]);
            room.setFlag(fromId, this.GeneralName, playerIds);
        }
        return true;
    }
};
JuZhanYin = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_wrappers_1.SwitchSkill(),
    skill_1.CommonSkill({ name: JuZhan.Name, description: JuZhan.Description })
], JuZhanYin);
exports.JuZhanYin = JuZhanYin;
let JuZhanShadow = class JuZhanShadow extends skill_1.GlobalFilterSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUseCardTo(_, __, ___, from, to) {
        const fromTargets = from.getFlag(this.GeneralName);
        const toTargets = to.getFlag(this.GeneralName);
        return !(fromTargets && fromTargets.includes(to.Id)) && !(toTargets && toTargets.includes(from.Id));
    }
};
JuZhanShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: JuZhanYin.Name, description: JuZhanYin.Description })
], JuZhanShadow);
exports.JuZhanShadow = JuZhanShadow;
let JuZhanRemove = class JuZhanRemove extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        return event.from === 7 /* PhaseFinish */ && owner.getFlag(this.GeneralName) !== undefined;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, this.GeneralName);
        return true;
    }
};
JuZhanRemove = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: JuZhanShadow.Name, description: JuZhanShadow.Description })
], JuZhanRemove);
exports.JuZhanRemove = JuZhanRemove;
