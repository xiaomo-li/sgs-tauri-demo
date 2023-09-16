"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiLeiRemove = exports.JiLeiBlocker = exports.JiLei = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JiLei = class JiLei extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        return content.toId === owner.Id && content.fromId !== undefined && !room.getPlayerById(content.fromId).Dead;
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to make {1} jilei until the start of his next turn?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const source = event.triggeredOnEvent.fromId;
        const options = ['basic card', 'trick card', 'equip card'];
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose jilei options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(source))).extract(),
            toId: fromId,
            triggeredBySkills: [this.Name],
        }, fromId, true);
        response.selectedOption = response.selectedOption || options[0];
        const originalTypes = room.getFlag(source, this.Name) || [];
        const typeNameMapper = {
            [options[0]]: 0 /* Basic */,
            [options[1]]: 7 /* Trick */,
            [options[2]]: 1 /* Equip */,
        };
        const type = typeNameMapper[response.selectedOption];
        if (!originalTypes.includes(type)) {
            originalTypes.push(type);
            room.setFlag(source, this.Name, originalTypes, this.Name);
            room.getPlayerById(source).hasShadowSkill(JiLeiBlocker.Name) ||
                (await room.obtainSkill(source, JiLeiBlocker.Name));
            room.getPlayerById(source).hasShadowSkill(JiLeiRemove.Name) || (await room.obtainSkill(source, JiLeiRemove.Name));
        }
        return true;
    }
};
JiLei = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'jilei', description: 'jilei_description' })
], JiLei);
exports.JiLei = JiLei;
let JiLeiBlocker = class JiLeiBlocker extends skill_1.FilterSkill {
    canUseCard(cardId, room, owner) {
        const types = room.getFlag(owner, JiLei.Name);
        if (!types) {
            return true;
        }
        return cardId instanceof card_matcher_1.CardMatcher
            ? true
            : room.getPlayerById(owner).cardFrom(cardId) !== 0 /* HandArea */ ||
                !types.includes(engine_1.Sanguosha.getCardById(cardId).BaseType);
    }
    canDropCard(cardId, room, owner) {
        const types = room.getFlag(owner, JiLei.Name);
        if (!types) {
            return true;
        }
        return cardId instanceof card_matcher_1.CardMatcher
            ? true
            : room.getPlayerById(owner).cardFrom(cardId) !== 0 /* HandArea */ ||
                !types.includes(engine_1.Sanguosha.getCardById(cardId).BaseType);
    }
};
JiLeiBlocker = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_jilei_blocker', description: 's_jilei_blocker_description' })
], JiLeiBlocker);
exports.JiLeiBlocker = JiLeiBlocker;
let JiLeiRemove = class JiLeiRemove extends skill_1.TriggerSkill {
    async whenDead(room, player) {
        room.removeFlag(player.Id, JiLei.Name);
        await room.loseSkill(player.Id, this.Name);
        player.hasShadowSkill(JiLeiBlocker.Name) && (await room.loseSkill(player.Id, JiLeiBlocker.Name));
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    canUse(room, owner, event) {
        return (owner.Id === event.toPlayer &&
            event.to === 0 /* PhaseBegin */ &&
            owner.getFlag(JiLei.Name) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, JiLei.Name);
        await room.loseSkill(event.fromId, this.Name);
        room.getPlayerById(event.fromId).hasShadowSkill(JiLeiBlocker.Name) &&
            (await room.loseSkill(event.fromId, JiLeiBlocker.Name));
        return true;
    }
};
JiLeiRemove = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_jilei_remove', description: 's_jilei_remove_description' })
], JiLeiRemove);
exports.JiLeiRemove = JiLeiRemove;
