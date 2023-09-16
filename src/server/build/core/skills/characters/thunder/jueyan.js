"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JueYanRemove = exports.JueYanBuff = exports.JueYan = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JueYan = class JueYan extends skill_1.ActiveSkill {
    get RelatedSkills() {
        return ['jizhi'];
    }
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.AvailableEquipSections.length > 0;
    }
    numberOfTargets() {
        return 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableTarget(owner, room, target) {
        return false;
    }
    isAvailableCard(owner, room, cardId) {
        return false;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const from = room.getPlayerById(fromId);
        const options = from.AvailableEquipSections.filter(section => !(section === "defense ride section" /* DefenseRide */ || section === "offense ride section" /* OffenseRide */)).map(section => String(section));
        if (options.length < from.AvailableEquipSections.length) {
            const index = options.findIndex(section => section === "precious" /* Precious */);
            if (index !== -1) {
                options.splice(options.length - 1, 0, 'ride section');
            }
            else {
                options.push('ride section');
            }
        }
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent({
            options,
            toId: fromId,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose and abort an equip section', this.Name).extract(),
        }), fromId);
        response.selectedOption = response.selectedOption || options[0];
        let setFlag = true;
        if (response.selectedOption === 'ride section') {
            await room.abortPlayerEquipSections(fromId, "defense ride section" /* DefenseRide */, "offense ride section" /* OffenseRide */);
        }
        else {
            await room.abortPlayerEquipSections(fromId, response.selectedOption);
            if (response.selectedOption === "shield section" /* Shield */) {
                await room.drawCards(3, fromId, 'top', fromId, this.Name);
            }
            else if (response.selectedOption === "precious" /* Precious */) {
                if (!from.hasSkill('jizhi')) {
                    await room.obtainSkill(fromId, 'jizhi', true);
                }
                else {
                    setFlag = false;
                }
            }
        }
        if (setFlag) {
            const originalBuff = from.getFlag(this.Name) || [];
            originalBuff.push(response.selectedOption);
            room.setFlag(fromId, this.Name, originalBuff);
        }
        return true;
    }
};
JueYan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'jueyan', description: 'jueyan_description' })
], JueYan);
exports.JueYan = JueYan;
let JueYanBuff = class JueYanBuff extends skill_1.RulesBreakerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    breakCardUsableDistance(cardId, room, owner) {
        var _a;
        return ((_a = owner.getFlag(this.GeneralName)) === null || _a === void 0 ? void 0 : _a.includes('ride section')) ? game_props_1.INFINITE_DISTANCE : 0;
    }
    breakCardUsableTimes(cardId, room, owner) {
        var _a;
        if (!((_a = owner.getFlag(this.GeneralName)) === null || _a === void 0 ? void 0 : _a.includes("weapon section" /* Weapon */))) {
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
            return 3;
        }
        else {
            return 0;
        }
    }
    breakAdditionalCardHoldNumber(room, owner) {
        var _a;
        return ((_a = owner.getFlag(this.GeneralName)) === null || _a === void 0 ? void 0 : _a.includes("shield section" /* Shield */)) ? 3 : 0;
    }
};
JueYanBuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: JueYan.Name, description: JueYan.Description })
], JueYanBuff);
exports.JueYanBuff = JueYanBuff;
let JueYanRemove = class JueYanRemove extends skill_1.TriggerSkill {
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
        const sections = owner.getFlag(this.GeneralName);
        if (!sections || sections.length === 0) {
            return false;
        }
        return ((owner.Id === event.fromPlayer &&
            event.from === 4 /* PlayCardStage */ &&
            sections.find(section => section !== "shield section" /* Shield */) !== undefined) ||
            (event.from === 7 /* PhaseFinish */ && sections.includes("shield section" /* Shield */)));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const phaseFrom = triggeredOnEvent.from;
        const sections = room.getFlag(fromId, this.GeneralName);
        let newSections;
        if (phaseFrom === 4 /* PlayCardStage */) {
            newSections = sections.filter(section => section === "shield section" /* Shield */);
            if (newSections.length === 0) {
                room.removeFlag(fromId, this.GeneralName);
            }
            else {
                room.setFlag(fromId, this.GeneralName, newSections);
            }
            if (sections.includes("precious" /* Precious */) && room.getPlayerById(fromId).hasSkill('jizhi')) {
                await room.loseSkill(fromId, 'jizhi', true);
            }
        }
        else {
            room.removeFlag(fromId, this.GeneralName);
        }
        return true;
    }
};
JueYanRemove = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: JueYanBuff.Name, description: JueYanBuff.Description })
], JueYanRemove);
exports.JueYanRemove = JueYanRemove;
