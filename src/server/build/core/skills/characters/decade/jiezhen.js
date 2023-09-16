"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JieZhenResume = exports.JieZhen = void 0;
const tslib_1 = require("tslib");
const baguazhen_1 = require("core/cards/standard/baguazhen");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const bazhen_1 = require("../fire/bazhen");
let JieZhen = class JieZhen extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    isAvailableCard() {
        return false;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const toId = event.toIds[0];
        const skillsToLose = [];
        for (const skill of room.getPlayerById(toId).getPlayerSkills(undefined, true)) {
            if (!([1 /* Compulsory */, 3 /* Limit */, 2 /* Awaken */, 4 /* Quest */].includes(skill.SkillType) ||
                skill.isLordSkill() ||
                skill.isShadowSkill() ||
                skill.isStubbornSkill())) {
                skillsToLose.push(skill.Name);
            }
        }
        for (const skillName of skillsToLose) {
            await room.loseSkill(toId, skillName);
        }
        await room.obtainSkill(toId, bazhen_1.BaZhen.Name);
        const originalMappers = room.getFlag(toId, this.Name) || {};
        originalMappers[event.fromId] = originalMappers[event.fromId] || [];
        originalMappers[event.fromId].push(...skillsToLose);
        room.setFlag(toId, this.Name, originalMappers, this.Name);
        room.getPlayerById(toId).hasShadowSkill(JieZhenResume.Name) || (await room.obtainSkill(toId, JieZhenResume.Name));
        return true;
    }
};
JieZhen = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'jiezhen', description: 'jiezhen_description' })
], JieZhen);
exports.JieZhen = JieZhen;
let JieZhenResume = class JieZhenResume extends skill_1.TriggerSkill {
    async whenLosingSkill(room, player) {
        room.removeFlag(player.Id, JieZhen.Name);
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterPhaseChanged" /* AfterPhaseChanged */ || stage === "AfterJudgeEffect" /* AfterJudgeEffect */;
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            const jiezhenMapper = owner.getFlag(JieZhen.Name);
            return (phaseChangeEvent.to === 0 /* PhaseBegin */ && jiezhenMapper && !!jiezhenMapper[phaseChangeEvent.toPlayer]);
        }
        else if (identifier === 140 /* JudgeEvent */) {
            const judgeEvent = event;
            return judgeEvent.toId === owner.Id && judgeEvent.bySkill === baguazhen_1.BaGuaZhen.name;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.loseSkill(event.fromId, bazhen_1.BaZhen.Name);
        const unknownEvent = event.triggeredOnEvent;
        if (event_packer_1.EventPacker.getIdentifier(unknownEvent) === 104 /* PhaseChangeEvent */) {
            const toPlayer = unknownEvent.toPlayer;
            const jiezhenMappers = room.getFlag(event.fromId, JieZhen.Name);
            for (const skill of jiezhenMappers[toPlayer]) {
                await room.obtainSkill(event.fromId, skill);
            }
            const from = room.getPlayerById(event.fromId);
            if (from.getCardIds().length > 0) {
                const options = {
                    [2 /* JudgeArea */]: from.getCardIds(2 /* JudgeArea */),
                    [1 /* EquipArea */]: from.getCardIds(1 /* EquipArea */),
                    [0 /* HandArea */]: from.getCardIds(0 /* HandArea */).length,
                };
                const chooseCardEvent = {
                    fromId: toPlayer,
                    toId: event.fromId,
                    options,
                    triggeredBySkills: [JieZhen.Name],
                };
                const response = await room.askForChoosingPlayerCard(chooseCardEvent, chooseCardEvent.fromId, false, true);
                if (!response) {
                    return false;
                }
                await room.moveCards({
                    movingCards: [{ card: response.selectedCard, fromArea: response.fromArea }],
                    fromId: chooseCardEvent.toId,
                    toId: chooseCardEvent.fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 1 /* ActivePrey */,
                    proposer: chooseCardEvent.fromId,
                    triggeredBySkills: [JieZhen.Name],
                });
            }
            delete jiezhenMappers[toPlayer];
            Object.keys(jiezhenMappers).length === 0 && (await room.loseSkill(event.fromId, this.Name));
        }
        else {
            const jiezhenMappers = room.getFlag(event.fromId, JieZhen.Name);
            if (jiezhenMappers) {
                const allUsers = Object.keys(jiezhenMappers);
                room.deadPlayerFilters(allUsers);
                room.sortPlayersByPosition(allUsers);
                for (const user of allUsers) {
                    for (const skill of jiezhenMappers[user]) {
                        await room.obtainSkill(event.fromId, skill);
                    }
                    if (room.getPlayerById(user).Dead) {
                        continue;
                    }
                    const from = room.getPlayerById(event.fromId);
                    if (from.getCardIds().length > 0) {
                        const options = {
                            [2 /* JudgeArea */]: from.getCardIds(2 /* JudgeArea */),
                            [1 /* EquipArea */]: from.getCardIds(1 /* EquipArea */),
                            [0 /* HandArea */]: from.getCardIds(0 /* HandArea */).length,
                        };
                        const chooseCardEvent = {
                            fromId: user,
                            toId: event.fromId,
                            options,
                            triggeredBySkills: [JieZhen.Name],
                        };
                        const response = await room.askForChoosingPlayerCard(chooseCardEvent, chooseCardEvent.fromId, false, true);
                        if (!response) {
                            return false;
                        }
                        await room.moveCards({
                            movingCards: [{ card: response.selectedCard, fromArea: response.fromArea }],
                            fromId: chooseCardEvent.toId,
                            toId: chooseCardEvent.fromId,
                            toArea: 0 /* HandArea */,
                            moveReason: 1 /* ActivePrey */,
                            proposer: chooseCardEvent.fromId,
                            triggeredBySkills: [JieZhen.Name],
                        });
                    }
                }
            }
            await room.loseSkill(event.fromId, this.Name);
        }
        return true;
    }
};
JieZhenResume = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_jiezhen_resume', description: 's_jiezhen_resume_description' })
], JieZhenResume);
exports.JieZhenResume = JieZhenResume;
