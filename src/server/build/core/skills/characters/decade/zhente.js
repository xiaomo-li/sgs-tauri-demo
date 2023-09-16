"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhenTeRemover = exports.ZhenTeBlocker = exports.ZhenTe = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const functional_1 = require("core/shares/libs/functional");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhenTe = class ZhenTe extends skill_1.TriggerSkill {
    isRefreshAt(room, owner, stage) {
        return stage === 0 /* PhaseBegin */;
    }
    isTriggerable(event, stage) {
        return stage === "AfterAimmed" /* AfterAimmed */;
    }
    canUse(room, owner, content) {
        return (content.toId === owner.Id &&
            content.fromId !== owner.Id &&
            !owner.hasUsedSkill(this.Name) &&
            !room.getPlayerById(content.fromId).Dead &&
            engine_1.Sanguosha.getCardById(content.byCardId).Color !== 2 /* None */ &&
            (engine_1.Sanguosha.getCardById(content.byCardId).is(0 /* Basic */) ||
                engine_1.Sanguosha.getCardById(content.byCardId).isCommonTrick()));
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to use this skill to {1} ?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const options = ['zhente:ban', 'zhente:nullify'];
        const aimEvent = event.triggeredOnEvent;
        const user = aimEvent.fromId;
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose zhente options: {1} {2} {3}', this.Name, functional_1.Functional.getCardColorRawText(engine_1.Sanguosha.getCardById(aimEvent.byCardId).Color), translation_json_tool_1.TranslationPack.patchCardInTranslation(aimEvent.byCardId), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract(),
            toId: user,
            triggeredBySkills: [this.Name],
        }, user, true);
        response.selectedOption = response.selectedOption || options[1];
        if (response.selectedOption === options[0]) {
            const bannedColors = room.getFlag(user, this.Name) || [];
            const newColor = engine_1.Sanguosha.getCardById(aimEvent.byCardId).Color;
            if (!bannedColors.includes(newColor)) {
                bannedColors.push(newColor);
                room.getPlayerById(user).setFlag(this.Name, bannedColors);
            }
            for (const skillName of [ZhenTeBlocker.Name, ZhenTeRemover.Name]) {
                room.getPlayerById(user).hasShadowSkill(skillName) || (await room.obtainSkill(user, skillName));
            }
        }
        else {
            aimEvent.nullifiedTargets = aimEvent.nullifiedTargets || [];
            aimEvent.nullifiedTargets.push(event.fromId);
        }
        return true;
    }
};
ZhenTe = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'zhente', description: 'zhente_description' })
], ZhenTe);
exports.ZhenTe = ZhenTe;
let ZhenTeBlocker = class ZhenTeBlocker extends skill_1.FilterSkill {
    canUseCard(cardId, room, owner, onResponse, isCardResponse) {
        const colors = room.getFlag(owner, ZhenTe.Name);
        if (colors === undefined || isCardResponse) {
            return true;
        }
        if (cardId instanceof card_matcher_1.CardMatcher) {
            const suits = colors.includes(1 /* Black */) ? [1 /* Spade */, 3 /* Club */] : [];
            colors.includes(0 /* Red */) && suits.push(4 /* Diamond */, 2 /* Heart */);
            return !cardId.match(new card_matcher_1.CardMatcher({ suit: suits }));
        }
        else {
            return !colors.includes(engine_1.Sanguosha.getCardById(cardId).Color);
        }
    }
};
ZhenTeBlocker = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_zhente_blocker', description: 's_zhente_blocker_description' })
], ZhenTeBlocker);
exports.ZhenTeBlocker = ZhenTeBlocker;
let ZhenTeRemover = class ZhenTeRemover extends skill_1.TriggerSkill {
    async whenDead(room, player) {
        room.removeFlag(player.Id, ZhenTe.Name);
        await room.loseSkill(player.Id, this.Name);
        player.hasShadowSkill(ZhenTeBlocker.Name) && (await room.loseSkill(player.Id, ZhenTeBlocker.Name));
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
        return event.from === 7 /* PhaseFinish */ && owner.getFlag(ZhenTe.Name) !== undefined;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, ZhenTe.Name);
        await room.loseSkill(event.fromId, this.Name);
        room.getPlayerById(event.fromId).hasShadowSkill(ZhenTeBlocker.Name) &&
            (await room.loseSkill(event.fromId, ZhenTeBlocker.Name));
        return true;
    }
};
ZhenTeRemover = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_zhente_remover', description: 's_zhente_remover_description' })
], ZhenTeRemover);
exports.ZhenTeRemover = ZhenTeRemover;
