"use strict";
var XianZhen_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.XianZhenRemove = exports.XianZhenNullify = exports.XianZhenAddTarget = exports.XianZhenKeep = exports.XianZhenBlock = exports.XianZhenExtra = exports.XianZhen = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const qinggang_1 = require("core/skills/cards/standard/qinggang");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let XianZhen = XianZhen_1 = class XianZhen extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.getCardIds(0 /* HandArea */).length > 0;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return room.canPindian(owner, target);
    }
    async onUse() {
        return true;
    }
    cardFilter() {
        return true;
    }
    isAvailableCard() {
        return false;
    }
    static setXianZhenTarget(room, gaoshunId, targetId) {
        room.setFlag(gaoshunId, XianZhen_1.Win, targetId);
        room.setFlag(gaoshunId, XianZhen_1.Target, true, translation_json_tool_1.TranslationPack.translationJsonPatcher(XianZhen_1.Target, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(targetId))).toString());
    }
    static removeXianZhenTarget(room, gaoshunId) {
        room.removeFlag(gaoshunId, XianZhen_1.Win);
        room.removeFlag(gaoshunId, XianZhen_1.Target);
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, toIds } = skillUseEvent;
        const { pindianRecord } = await room.pindian(fromId, toIds, this.Name);
        if (!pindianRecord.length) {
            return false;
        }
        if (pindianRecord[0].winner === fromId) {
            XianZhen_1.setXianZhenTarget(room, fromId, toIds[0]);
        }
        else {
            room.setFlag(fromId, XianZhen_1.Lose, true, XianZhen_1.Lose);
        }
        return true;
    }
};
XianZhen.Win = 'xianzhen_win';
XianZhen.Lose = 'xianzhen_lose';
XianZhen.Target = 'xianzhen target: {0}';
XianZhen = XianZhen_1 = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'xianzhen', description: 'xianzhen_description' })
], XianZhen);
exports.XianZhen = XianZhen;
let XianZhenExtra = class XianZhenExtra extends skill_1.RulesBreakerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    breakCardUsableDistanceTo(cardId, room, owner, target) {
        const xianzhenee = owner.getFlag(XianZhen.Win);
        if (target.Id === xianzhenee) {
            return game_props_1.INFINITE_DISTANCE;
        }
        else {
            return 0;
        }
    }
    breakCardUsableTimesTo(cardId, room, owner, target) {
        const xianzhenee = owner.getFlag(XianZhen.Win);
        if (target.Id === xianzhenee) {
            return game_props_1.INFINITE_TRIGGERING_TIMES;
        }
        else {
            return 0;
        }
    }
};
XianZhenExtra = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: XianZhen.Name, description: XianZhen.Description })
], XianZhenExtra);
exports.XianZhenExtra = XianZhenExtra;
let XianZhenBlock = class XianZhenBlock extends skill_1.FilterSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUseCard(cardId, room, owner, onResponse, isCardResponse) {
        if (!room.getFlag(owner, XianZhen.Lose) || isCardResponse) {
            return true;
        }
        if (cardId instanceof card_matcher_1.CardMatcher) {
            return !cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] }));
        }
        else {
            return engine_1.Sanguosha.getCardById(cardId).GeneralName !== 'slash';
        }
    }
};
XianZhenBlock = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: XianZhenExtra.Name, description: XianZhen.Description })
], XianZhenBlock);
exports.XianZhenBlock = XianZhenBlock;
let XianZhenKeep = class XianZhenKeep extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isTriggerable(event) {
        return event_packer_1.EventPacker.getIdentifier(event) === 162 /* AskForCardDropEvent */;
    }
    isAutoTrigger() {
        return true;
    }
    canUse(room, owner, content) {
        return (room.CurrentPlayerPhase === 5 /* DropCardStage */ &&
            room.CurrentPhasePlayer.Id === owner.Id &&
            owner.getFlag(XianZhen.Lose) === true);
    }
    isFlaggedSkill() {
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const askForCardDropEvent = triggeredOnEvent;
        const gaoshun = room.getPlayerById(askForCardDropEvent.toId);
        const slashes = gaoshun
            .getCardIds(0 /* HandArea */)
            .filter(cardId => engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash');
        askForCardDropEvent.cardAmount -= slashes.length;
        askForCardDropEvent.except = askForCardDropEvent.except ? [...askForCardDropEvent.except, ...slashes] : slashes;
        return true;
    }
};
XianZhenKeep = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: XianZhenBlock.Name, description: XianZhen.Description })
], XianZhenKeep);
exports.XianZhenKeep = XianZhenKeep;
let XianZhenAddTarget = class XianZhenAddTarget extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "OnAim" /* OnAim */;
    }
    canUse(room, owner, content) {
        const { fromId, byCardId, isFirstTarget } = content;
        if (byCardId === undefined || !isFirstTarget) {
            return false;
        }
        const card = engine_1.Sanguosha.getCardById(byCardId);
        const allTargets = aim_group_1.AimGroupUtil.getAllTargets(content.allTargets);
        return (fromId === owner.Id &&
            allTargets.length === 1 &&
            owner.getFlag(XianZhen.Win) !== undefined &&
            !allTargets.includes(owner.getFlag(XianZhen.Win)) &&
            (card.GeneralName === 'slash' || (card.is(7 /* Trick */) && !card.is(8 /* DelayedTrick */))));
    }
    getSkillLog(room, owner, event) {
        const xianzhenee = owner.getFlag(XianZhen.Win);
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('xianzhen: do you want to add {0} as targets of {1}?', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(xianzhenee)), translation_json_tool_1.TranslationPack.patchCardInTranslation(event.byCardId)).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, triggeredOnEvent } = skillUseEvent;
        const aimEvent = triggeredOnEvent;
        const xianzhenee = room.getFlag(fromId, XianZhen.Win);
        aim_group_1.AimGroupUtil.addTargets(room, aimEvent, xianzhenee);
        return true;
    }
};
XianZhenAddTarget = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: XianZhenKeep.Name, description: XianZhen.Description })
], XianZhenAddTarget);
exports.XianZhenAddTarget = XianZhenAddTarget;
let XianZhenNullify = class XianZhenNullify extends qinggang_1.QingGangSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isTriggerable(event, stage) {
        return stage === "AfterAim" /* AfterAim */ && event.byCardId !== undefined;
    }
    canUse(room, owner, content) {
        return !!content && owner.Id === content.fromId && owner.getFlag(XianZhen.Win) === content.toId;
    }
    isAutoTrigger() {
        return true;
    }
};
XianZhenNullify = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.UniqueSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: XianZhenAddTarget.Name, description: XianZhen.Description })
], XianZhenNullify);
exports.XianZhenNullify = XianZhenNullify;
let XianZhenRemove = class XianZhenRemove extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    isFlaggedSkill(room, event, stage) {
        return true;
    }
    canUse(room, owner, content) {
        return (content.fromPlayer === owner.Id &&
            content.from === 7 /* PhaseFinish */ &&
            (owner.getFlag(XianZhen.Win) || owner.getFlag(XianZhen.Lose)));
    }
    async onTrigger(room, content) {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        if (room.getFlag(fromId, XianZhen.Win) !== undefined) {
            XianZhen.removeXianZhenTarget(room, fromId);
        }
        if (room.getFlag(fromId, XianZhen.Lose) !== undefined) {
            room.removeFlag(fromId, XianZhen.Lose);
        }
        return true;
    }
};
XianZhenRemove = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: XianZhenNullify.Name, description: XianZhenNullify.Description })
], XianZhenRemove);
exports.XianZhenRemove = XianZhenRemove;
