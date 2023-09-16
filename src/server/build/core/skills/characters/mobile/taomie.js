"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaoMieRemover = exports.TaoMieDebuff = exports.TaoMie = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let TaoMie = class TaoMie extends skill_1.TriggerSkill {
    audioIndex() {
        return 3;
    }
    isAutoTrigger(room, owner, event) {
        return event !== undefined && room.getMark(event.toId, "taomie" /* TaoMie */) > 0;
    }
    isTriggerable(event, stage) {
        return (stage === "AfterDamageEffect" /* AfterDamageEffect */ ||
            stage === "AfterDamagedEffect" /* AfterDamagedEffect */ ||
            stage === "DamageEffect" /* DamageEffect */);
    }
    canUse(room, owner, content, stage) {
        return ((stage === "AfterDamageEffect" /* AfterDamageEffect */ &&
            content.fromId === owner.Id &&
            content.toId !== owner.Id &&
            room.getMark(content.toId, "taomie" /* TaoMie */) === 0) ||
            (stage === "AfterDamagedEffect" /* AfterDamagedEffect */ &&
                content.toId === owner.Id &&
                content.fromId !== undefined &&
                content.fromId !== owner.Id &&
                !room.getPlayerById(content.fromId).Dead &&
                room.getMark(content.fromId, "taomie" /* TaoMie */) === 0) ||
            (stage === "DamageEffect" /* DamageEffect */ &&
                content.fromId === owner.Id &&
                room.getMark(content.toId, "taomie" /* TaoMie */) > 0));
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to use this skill to {1} ?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId === owner.Id ? event.toId : event.fromId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const damageEvent = event.triggeredOnEvent;
        const toId = damageEvent.fromId === fromId ? damageEvent.toId : damageEvent.fromId;
        if (room.getMark(toId, "taomie" /* TaoMie */) === 0) {
            for (const other of room.getOtherPlayers(toId)) {
                other.getMark("taomie" /* TaoMie */) > 0 && room.removeMark(other.Id, "taomie" /* TaoMie */);
            }
            room.addMark(toId, "taomie" /* TaoMie */, 1);
        }
        else {
            const options = ['taomie:damage'];
            const to = room.getPlayerById(toId);
            (toId === fromId
                ? [...to.getCardIds(1 /* EquipArea */), ...to.getCardIds(2 /* JudgeArea */)].length > 0
                : to.getCardIds().length > 0) && options.push(...['taomie:prey', 'taomie:both']);
            const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                options,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose taomie options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(toId))).extract(),
                toId: fromId,
                triggeredBySkills: [this.Name],
            }, fromId, true);
            response.selectedOption = response.selectedOption || options[0];
            if (response.selectedOption === options[0] || response.selectedOption === 'taomie:both') {
                damageEvent.damage++;
            }
            if (response.selectedOption === 'taomie:prey' || response.selectedOption === 'taomie:both') {
                const options = {
                    [2 /* JudgeArea */]: to.getCardIds(2 /* JudgeArea */),
                    [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
                };
                if (toId !== fromId) {
                    options[0 /* HandArea */] = to.getCardIds(0 /* HandArea */).length;
                }
                const chooseCardEvent = {
                    fromId,
                    toId,
                    options,
                    triggeredBySkills: [this.Name],
                };
                const resp = await room.askForChoosingPlayerCard(chooseCardEvent, fromId, false, true);
                if (!resp) {
                    return false;
                }
                await room.moveCards({
                    movingCards: [{ card: resp.selectedCard, fromArea: room.getPlayerById(toId).cardFrom(resp.selectedCard) }],
                    fromId: toId,
                    toId: fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 1 /* ActivePrey */,
                    proposer: fromId,
                    triggeredBySkills: [this.Name],
                });
            }
            response.selectedOption === 'taomie:both' &&
                event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: true }, damageEvent);
        }
        return true;
    }
};
TaoMie = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'taomie', description: 'taomie_description' })
], TaoMie);
exports.TaoMie = TaoMie;
let TaoMieDebuff = class TaoMieDebuff extends skill_1.GlobalRulesBreakerSkill {
    breakWithinAttackDistance(room, owner, from, to) {
        return from.getMark("taomie" /* TaoMie */) > 0 && from !== to && owner === to;
    }
};
TaoMieDebuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: TaoMie.Name, description: TaoMie.Description })
], TaoMieDebuff);
exports.TaoMieDebuff = TaoMieDebuff;
let TaoMieRemover = class TaoMieRemover extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return (stage === "DamageFinishedEffect" /* DamageFinishedEffect */ &&
            event_packer_1.EventPacker.getMiddleware(this.GeneralName, content) === true);
    }
    afterDead(room, owner, content, stage) {
        return (stage === "DamageFinishedEffect" /* DamageFinishedEffect */ &&
            event_packer_1.EventPacker.getMiddleware(this.GeneralName, content) === true);
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "DamageFinishedEffect" /* DamageFinishedEffect */;
    }
    canUse(room, owner, event) {
        return (event_packer_1.EventPacker.getMiddleware(this.GeneralName, event) === true &&
            room.getMark(event.toId, "taomie" /* TaoMie */) > 0);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeMark(event.triggeredOnEvent.toId, "taomie" /* TaoMie */);
        return true;
    }
};
TaoMieRemover = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: TaoMieDebuff.Name, description: TaoMieDebuff.Description })
], TaoMieRemover);
exports.TaoMieRemover = TaoMieRemover;
