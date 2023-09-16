"use strict";
var ShenZhuo_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShenZhuoRemove = exports.ShenZhuoBlock = exports.ShenZhuoExtra = exports.ShenZhuo = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ShenZhuo = ShenZhuo_1 = class ShenZhuo extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */;
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            engine_1.Sanguosha.getCardById(content.cardId).GeneralName === 'slash' &&
            !engine_1.Sanguosha.isVirtualCardId(content.cardId));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const options = ['shenzhuo:drawOne', 'shenzhuo:drawThree'];
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose shenzhuo options', this.Name).extract(),
            toId: event.fromId,
            triggeredBySkills: [this.Name],
        }, event.fromId, true);
        response.selectedOption = response.selectedOption || options[0];
        if (response.selectedOption === options[0]) {
            await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
            room.setFlag(event.fromId, this.Name, (room.getFlag(event.fromId, this.Name) || 0) + 1);
        }
        else {
            await room.drawCards(3, event.fromId, 'top', event.fromId, this.Name);
            room.setFlag(event.fromId, ShenZhuo_1.Block, true);
        }
        return true;
    }
};
ShenZhuo.Block = 'shenzhuo_block';
ShenZhuo = ShenZhuo_1 = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'shenzhuo', description: 'shenzhuo_description' })
], ShenZhuo);
exports.ShenZhuo = ShenZhuo;
let ShenZhuoExtra = class ShenZhuoExtra extends skill_1.RulesBreakerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    breakCardUsableTimes(cardId, room, owner) {
        if (!room.getFlag(owner.Id, this.GeneralName)) {
            return 0;
        }
        let match = false;
        if (cardId instanceof card_matcher_1.CardMatcher) {
            match = cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] }));
        }
        else {
            match = engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash';
        }
        if (match) {
            return room.getFlag(owner.Id, this.GeneralName);
        }
        else {
            return 0;
        }
    }
};
ShenZhuoExtra = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CompulsorySkill({ name: ShenZhuo.Name, description: ShenZhuo.Description })
], ShenZhuoExtra);
exports.ShenZhuoExtra = ShenZhuoExtra;
let ShenZhuoBlock = class ShenZhuoBlock extends skill_1.FilterSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUseCard(cardId, room, owner, onResponse, isCardResponse) {
        if (!room.getFlag(owner, ShenZhuo.Block) || isCardResponse) {
            return true;
        }
        return cardId instanceof card_matcher_1.CardMatcher
            ? !cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] }))
            : engine_1.Sanguosha.getCardById(cardId).GeneralName !== 'slash';
    }
};
ShenZhuoBlock = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CompulsorySkill({ name: ShenZhuoExtra.Name, description: ShenZhuoExtra.Description })
], ShenZhuoBlock);
exports.ShenZhuoBlock = ShenZhuoBlock;
let ShenZhuoRemove = class ShenZhuoRemove extends skill_1.TriggerSkill {
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
        return (event.from === 7 /* PhaseFinish */ &&
            (owner.getFlag(this.GeneralName) !== undefined || owner.getFlag(ShenZhuo.Block) !== undefined));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.getFlag(event.fromId, this.GeneralName) !== undefined &&
            room.removeFlag(event.fromId, this.GeneralName);
        room.getFlag(event.fromId, ShenZhuo.Block) !== undefined && room.removeFlag(event.fromId, ShenZhuo.Block);
        return true;
    }
};
ShenZhuoRemove = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CompulsorySkill({ name: ShenZhuoBlock.Name, description: ShenZhuoBlock.Description })
], ShenZhuoRemove);
exports.ShenZhuoRemove = ShenZhuoRemove;
