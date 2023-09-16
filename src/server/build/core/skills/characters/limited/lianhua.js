"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LianHuaShadow = exports.LianHua = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let LianHua = class LianHua extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return ['yingzi', 'guanxing', 'zhiyan', 'gongxin'];
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */ || stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        const identfier = event_packer_1.EventPacker.getIdentifier(content);
        if (identfier === 137 /* DamageEvent */) {
            return (content.toId !== owner.Id &&
                room.CurrentPlayer !== owner);
        }
        else if (identfier === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = content;
            return (phaseStageChangeEvent.playerId === owner.Id &&
                phaseStageChangeEvent.toStage === 3 /* PrepareStageStart */);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const unknownEvent = event.triggeredOnEvent;
        const identfier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identfier === 137 /* DamageEvent */) {
            const victim = unknownEvent.toId;
            room
                .getPlayerById(fromId)
                .addInvisibleMark(this.Name, room.hasDifferentCampWith(room.getPlayerById(fromId), room.getPlayerById(victim)) ? -1 : 1);
            room.addMark(fromId, "danxue" /* DanXue */, 1);
        }
        else {
            const toGainCards = [];
            let toGainSkill = this.RelatedSkills[0];
            let cardMatchers;
            const invisibleDanXue = room.getPlayerById(fromId).getInvisibleMark(this.Name);
            if (room.getMark(fromId, "danxue" /* DanXue */) <= 3) {
                cardMatchers = [new card_matcher_1.CardMatcher({ name: ['peach'] })];
            }
            else if (invisibleDanXue > 0) {
                cardMatchers = [new card_matcher_1.CardMatcher({ name: ['wuzhongshengyou'] })];
                toGainSkill = this.RelatedSkills[1];
            }
            else if (invisibleDanXue < 0) {
                cardMatchers = [new card_matcher_1.CardMatcher({ name: ['shunshouqianyang'] })];
                toGainSkill = this.RelatedSkills[2];
            }
            else {
                cardMatchers = [new card_matcher_1.CardMatcher({ generalName: ['slash'] }), new card_matcher_1.CardMatcher({ name: ['duel'] })];
                toGainSkill = this.RelatedSkills[3];
            }
            for (const cardMatcher of cardMatchers) {
                const randomCards = room.findCardsByMatcherFrom(cardMatcher);
                const length = randomCards.length;
                randomCards.push(...room.findCardsByMatcherFrom(cardMatcher, false));
                if (randomCards.length > 0) {
                    const randomIndex = Math.floor(Math.random() * randomCards.length);
                    toGainCards.push({
                        card: randomCards[randomIndex],
                        fromArea: randomIndex < length ? 5 /* DrawStack */ : 4 /* DropStack */,
                    });
                }
            }
            toGainCards.length > 0 &&
                (await room.moveCards({
                    movingCards: toGainCards,
                    toId: fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 1 /* ActivePrey */,
                    proposer: fromId,
                    triggeredBySkills: [this.Name],
                }));
            if (!room.getPlayerById(fromId).hasSkill(toGainSkill)) {
                const skills = room.getFlag(fromId, this.Name) || [];
                skills.push(toGainSkill);
                room.getPlayerById(fromId).setFlag(this.Name, skills);
                await room.obtainSkill(fromId, toGainSkill);
            }
        }
        return true;
    }
};
LianHua = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'lianhua', description: 'lianhua_description' })
], LianHua);
exports.LianHua = LianHua;
let LianHuaShadow = class LianHuaShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.getMark(owner, "danxue" /* DanXue */) === 0 && room.getFlag(owner, this.GeneralName) === undefined;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */ || stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    canUse(room, owner, content, stage) {
        return ((stage === "AfterPhaseChanged" /* AfterPhaseChanged */ &&
            content.to === 4 /* PlayCardStage */ &&
            content.toPlayer === owner.Id &&
            owner.getMark("danxue" /* DanXue */) > 0) ||
            (stage === "PhaseChanged" /* PhaseChanged */ &&
                content.from === 7 /* PhaseFinish */ &&
                content.fromPlayer === owner.Id &&
                owner.getFlag(this.GeneralName) !== undefined));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const phaseChangeEvent = event.triggeredOnEvent;
        if (phaseChangeEvent.from === 7 /* PhaseFinish */) {
            const skills = room.getFlag(event.fromId, this.GeneralName);
            for (const skill of skills) {
                await room.loseSkill(event.fromId, skill);
            }
            room.getPlayerById(event.fromId).removeFlag(this.GeneralName);
        }
        else {
            room.getPlayerById(event.fromId).removeInvisibleMark(this.GeneralName);
            room.removeMark(event.fromId, "danxue" /* DanXue */);
        }
        return true;
    }
};
LianHuaShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CompulsorySkill({ name: LianHua.Name, description: LianHua.Description })
], LianHuaShadow);
exports.LianHuaShadow = LianHuaShadow;
