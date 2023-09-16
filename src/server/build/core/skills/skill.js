"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillProhibitedSkill = exports.GlobalFilterSkill = exports.FilterSkill = exports.GlobalRulesBreakerSkill = exports.RulesBreakerSkill = exports.ViewAsSkill = exports.TransformSkill = exports.ActiveSkill = exports.TriggerSkill = exports.ResponsiveSkill = exports.Skill = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const target_group_1 = require("core/shares/libs/utils/target_group");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
tslib_1.__exportStar(require("./skill_wrappers"), exports);
tslib_1.__exportStar(require("./skill_hooks"), exports);
class Skill {
    constructor() {
        this.skillType = 0 /* Common */;
        this.shadowSkill = false;
        this.lordSkill = false;
        this.uniqueSkill = false;
        this.selfTargetSkill = false;
        this.sideEffectSkill = false;
        this.persistentSkill = false;
        this.stubbornSkill = false;
        this.circleSkill = false;
        this.switchSkill = false;
        this.switchable = false;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    whenRefresh(room, owner) { }
    async beforeUse(room, event) {
        return true;
    }
    async onEffectRejected(room, event) { }
    async beforeEffect(room, event) {
        return true;
    }
    async afterEffect(room, event) {
        return true;
    }
    getAnimationSteps(event) {
        if (event_packer_1.EventPacker.getIdentifier(event) === 132 /* SkillUseEvent */) {
            const skillUseEvent = event;
            return skillUseEvent.toIds ? [{ from: event.fromId, tos: skillUseEvent.toIds }] : [];
        }
        else {
            const cardUseEvent = event;
            return cardUseEvent.targetGroup
                ? [{ from: event.fromId, tos: target_group_1.TargetGroupUtil.getRealTargets(cardUseEvent.targetGroup) }]
                : [];
        }
    }
    targetGroupDispatcher(targetIds) {
        return targetIds.map(id => [id]);
    }
    resortTargets() {
        return true;
    }
    get Description() {
        return this.description;
    }
    get Name() {
        return this.skillName;
    }
    get GeneralName() {
        return this.skillName.replace(/(#|~)+/, '');
    }
    get Muted() {
        return false;
    }
    get RelatedCharacters() {
        return [];
    }
    get RelatedSkills() {
        return [];
    }
    static get Description() {
        return '';
    }
    static get GeneralName() {
        return '';
    }
    static get Name() {
        return '';
    }
    isLordSkill() {
        return this.lordSkill;
    }
    isShadowSkill() {
        return this.shadowSkill;
    }
    isUniqueSkill() {
        return this.uniqueSkill;
    }
    isSelfTargetSkill() {
        return this.selfTargetSkill;
    }
    isSideEffectSkill() {
        return this.sideEffectSkill;
    }
    isPersistentSkill() {
        return this.persistentSkill;
    }
    isStubbornSkill() {
        return this.stubbornSkill;
    }
    isFlaggedSkill(room, event, stage) {
        return false;
    }
    isCircleSkill() {
        return this.circleSkill;
    }
    isSwitchSkill() {
        return this.switchSkill;
    }
    isSwitchable() {
        return this.switchable;
    }
    get SkillType() {
        return this.skillType;
    }
    tryToCallAiTrigger() {
        return this.ai;
    }
    audioIndex(characterName) {
        return 2;
    }
    dynamicDescription(owner) {
        return this.description;
    }
}
exports.Skill = Skill;
class ResponsiveSkill extends Skill {
    canUse() {
        return false;
    }
    isRefreshAt() {
        return false;
    }
}
exports.ResponsiveSkill = ResponsiveSkill;
class TriggerSkill extends Skill {
    isAutoTrigger(room, owner, event) {
        return false;
    }
    isUncancellable(room, event) {
        return false;
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('do you want to trigger skill {0} ?', this.Name).extract();
    }
    getPriority(room, owner, event) {
        return 1 /* Medium */;
    }
    async onUse(room, event) {
        return await this.onTrigger(room, event);
    }
    triggerableTimes(event, owner) {
        return 1;
    }
    isRefreshAt(room, owner, stage) {
        return false;
    }
    numberOfTargets() {
        return 0;
    }
    additionalNumberOfTargets(room, owner, cardId) {
        if (cardId === undefined) {
            return 0;
        }
        else {
            return owner.getCardAdditionalUsableNumberOfTargets(room, cardId);
        }
    }
    targetFilter(room, owner, targets, selectedCards, cardId) {
        const availableNumOfTargets = this.numberOfTargets();
        const additionalNumberOfTargets = this.additionalNumberOfTargets(room, owner);
        if (availableNumOfTargets instanceof Array) {
            return (targets.length <= availableNumOfTargets[1] + additionalNumberOfTargets &&
                targets.length >= availableNumOfTargets[0]);
        }
        else {
            if (additionalNumberOfTargets > 0) {
                return (targets.length >= availableNumOfTargets && targets.length <= availableNumOfTargets + additionalNumberOfTargets);
            }
            else {
                return targets.length === availableNumOfTargets;
            }
        }
    }
    numberOfCards() {
        return [];
    }
    cardFilter(room, owner, cards, selectedTargets, cardId) {
        return cards.length === 0;
    }
    isAvailableCard(owner, room, cardId, selectedCards, selectedTargets, containerCard) {
        return false;
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard) {
        return false;
    }
    availableCardAreas() {
        return [1 /* EquipArea */, 0 /* HandArea */];
    }
}
exports.TriggerSkill = TriggerSkill;
class ActiveSkill extends Skill {
    additionalNumberOfTargets(room, owner, cardId) {
        if (cardId === undefined) {
            return 0;
        }
        else {
            return owner.getCardAdditionalUsableNumberOfTargets(room, cardId);
        }
    }
    numberOfCards() {
        return [];
    }
    targetFilter(room, owner, targets, selectedCards, cardId) {
        const availableNumOfTargets = this.numberOfTargets();
        const additionalNumberOfTargets = this.additionalNumberOfTargets(room, owner, cardId);
        if (availableNumOfTargets instanceof Array) {
            return (targets.length <= availableNumOfTargets[1] + additionalNumberOfTargets &&
                targets.length >= availableNumOfTargets[0]);
        }
        else {
            if (additionalNumberOfTargets > 0) {
                return (targets.length >= availableNumOfTargets && targets.length <= availableNumOfTargets + additionalNumberOfTargets);
            }
            else {
                return targets.length === availableNumOfTargets;
            }
        }
    }
    availableCardAreas() {
        return [0 /* HandArea */, 1 /* EquipArea */];
    }
    isRefreshAt(room, owner, phase) {
        return room.CurrentPhasePlayer === owner && phase === 4 /* PlayCardStage */;
    }
}
exports.ActiveSkill = ActiveSkill;
class TransformSkill extends Skill {
    canUse() {
        return true;
    }
    isRefreshAt() {
        return false;
    }
    async onEffect() {
        return true;
    }
    async onUse() {
        return true;
    }
    includesJudgeCard() {
        return false;
    }
}
exports.TransformSkill = TransformSkill;
class ViewAsSkill extends Skill {
    isRefreshAt(room, owner, phase) {
        return false;
    }
    availableCardAreas() {
        return [0 /* HandArea */, 1 /* EquipArea */];
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        return true;
    }
}
exports.ViewAsSkill = ViewAsSkill;
class RulesBreakerSkill extends Skill {
    canUse() {
        return true;
    }
    isRefreshAt() {
        return false;
    }
    async onEffect() {
        return true;
    }
    async onUse() {
        return true;
    }
    breakDistanceTo(room, owner, target) {
        return 0;
    }
    breakCardUsableTimesTo(cardId, room, owner, target) {
        return 0;
    }
    breakDrawCardNumber(room, owner) {
        return 0;
    }
    breakCardUsableTimes(cardId, room, owner) {
        return 0;
    }
    breakCardUsableDistance(cardId, room, owner) {
        return 0;
    }
    breakCardUsableDistanceTo(cardId, room, owner, target) {
        return 0;
    }
    breakCardUsableTargets(cardId, room, owner) {
        return 0;
    }
    breakAttackDistance(cardId, room, owner) {
        return 0;
    }
    breakOffenseDistance(room, owner) {
        return 0;
    }
    breakDefenseDistance(room, owner) {
        return 0;
    }
    breakBaseCardHoldNumber(room, owner) {
        return -1;
    }
    breakAdditionalCardHoldNumber(room, owner) {
        return 0;
    }
    breakAdditionalAttackRange(room, owner) {
        return 0;
    }
    breakFinalAttackRange(room, owner) {
        return -1;
    }
}
exports.RulesBreakerSkill = RulesBreakerSkill;
class GlobalRulesBreakerSkill extends RulesBreakerSkill {
    breakDistance(room, owner, from, to) {
        return 0;
    }
    breakAdditionalCardHold(room, owner, target) {
        return 0;
    }
    breakWithinAttackDistance(room, owner, from, to) {
        return false;
    }
    breakGlobalCardUsableDistance(cardId, room, owner, target) {
        return 0;
    }
}
exports.GlobalRulesBreakerSkill = GlobalRulesBreakerSkill;
class FilterSkill extends Skill {
    canUse() {
        return true;
    }
    isRefreshAt() {
        return false;
    }
    async onEffect() {
        return true;
    }
    async onUse() {
        return true;
    }
    canUseCard(cardId, room, owner, onResponse, isCardResponse) {
        return true;
    }
    canBeUsedCard(cardId, room, owner, attacker) {
        return true;
    }
    canDropCard(cardId, room, owner) {
        return true;
    }
    excludeCardUseHistory(cardId, room, owner) {
        return false;
    }
    canBePindianTarget(room, owner, fromId) {
        return true;
    }
}
exports.FilterSkill = FilterSkill;
class GlobalFilterSkill extends FilterSkill {
    canUseCardTo(cardId, room, owner, attacker, target) {
        return true;
    }
}
exports.GlobalFilterSkill = GlobalFilterSkill;
class SkillProhibitedSkill extends Skill {
    canUse() {
        return true;
    }
    isRefreshAt() {
        return false;
    }
    async onEffect() {
        return true;
    }
    async onUse() {
        return true;
    }
    toDeactivateSkills(room, owner, content, stage) {
        return false;
    }
    toActivateSkills(room, owner, content, stage) {
        return false;
    }
}
exports.SkillProhibitedSkill = SkillProhibitedSkill;
