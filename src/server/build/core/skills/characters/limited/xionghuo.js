"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XiongHuoRemover = exports.XiongHuoFilter = exports.XiongHuoShadow = exports.XiongHuo = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let XiongHuo = class XiongHuo extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return owner.getMark("baoli" /* BaoLi */) > 0;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner && room.getMark(target, "baoli" /* BaoLi */) === 0;
    }
    isAvailableCard() {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        room.addMark(event.fromId, "baoli" /* BaoLi */, -1);
        room.addMark(event.toIds[0], "baoli" /* BaoLi */, 1);
        return true;
    }
};
XiongHuo = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'xionghuo', description: 'xionghuo_description' })
], XiongHuo);
exports.XiongHuo = XiongHuo;
let XiongHuoShadow = class XiongHuoShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return (stage === "AfterGameBegan" /* AfterGameBegan */ ||
            stage === "StageChanged" /* StageChanged */ ||
            stage === "DamageEffect" /* DamageEffect */);
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = content;
            return (phaseStageChangeEvent.playerId !== owner.Id &&
                phaseStageChangeEvent.toStage === 13 /* PlayCardStageStart */ &&
                room.getPlayerById(phaseStageChangeEvent.playerId).getMark("baoli" /* BaoLi */) > 0);
        }
        else if (identifier === 137 /* DamageEvent */) {
            const damageEvent = content;
            return (damageEvent.fromId === owner.Id &&
                damageEvent.toId !== owner.Id &&
                room.getPlayerById(damageEvent.toId).getMark("baoli" /* BaoLi */) > 0);
        }
        return identifier === 143 /* GameBeginEvent */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 105 /* PhaseStageChangeEvent */) {
            const playerId = unknownEvent.playerId;
            room.removeMark(playerId, "baoli" /* BaoLi */);
            const options = ['fire', 'lose', 'prey'];
            const randomOption = options[Math.floor(Math.random() * options.length)];
            if (randomOption === options[0]) {
                await room.damage({
                    fromId,
                    toId: playerId,
                    damage: 1,
                    damageType: "fire_property" /* Fire */,
                    triggeredBySkills: [this.GeneralName],
                });
                room.setFlag(fromId, this.GeneralName, playerId);
            }
            else if (randomOption === options[1]) {
                await room.loseHp(playerId, 1);
                room.syncGameCommonRules(playerId, user => {
                    room.CommonRules.addAdditionalHoldCardNumber(user, -1);
                    user.addInvisibleMark(this.GeneralName, 1);
                });
            }
            else {
                for (const area of [1 /* EquipArea */, 0 /* HandArea */]) {
                    const cards = room.getPlayerById(playerId).getCardIds(area);
                    cards.length > 0 &&
                        (await room.moveCards({
                            movingCards: [{ card: cards[Math.floor(Math.random() * cards.length)], fromArea: area }],
                            fromId: playerId,
                            toId: fromId,
                            toArea: 0 /* HandArea */,
                            moveReason: 1 /* ActivePrey */,
                            proposer: fromId,
                            triggeredBySkills: [this.Name],
                        }));
                }
            }
        }
        else if (identifier === 137 /* DamageEvent */) {
            const damageEvent = unknownEvent;
            damageEvent.damage++;
        }
        else {
            room.addMark(fromId, "baoli" /* BaoLi */, 3);
        }
        return true;
    }
};
XiongHuoShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: XiongHuo.Name, description: XiongHuo.Description })
], XiongHuoShadow);
exports.XiongHuoShadow = XiongHuoShadow;
let XiongHuoFilter = class XiongHuoFilter extends skill_1.FilterSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    canBeUsedCard(cardId, room, owner, attacker) {
        if (room.getFlag(owner, this.GeneralName) === undefined ||
            room.getFlag(owner, this.GeneralName) !== attacker) {
            return true;
        }
        if (cardId instanceof card_matcher_1.CardMatcher) {
            return !new card_matcher_1.CardMatcher({ generalName: ['slash'] }).match(cardId);
        }
        else {
            return engine_1.Sanguosha.getCardById(cardId).GeneralName !== 'slash';
        }
    }
};
XiongHuoFilter = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: XiongHuoShadow.Name, description: XiongHuoShadow.Description })
], XiongHuoFilter);
exports.XiongHuoFilter = XiongHuoFilter;
let XiongHuoRemover = class XiongHuoRemover extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    afterDead(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    get Muted() {
        return true;
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
            (room.getFlag(owner.Id, this.GeneralName) !== undefined ||
                (event.fromPlayer !== undefined && room.getPlayerById(event.fromPlayer).getInvisibleMark(this.GeneralName) > 0)));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, this.GeneralName);
        const toId = event.triggeredOnEvent.fromPlayer;
        toId &&
            room.syncGameCommonRules(toId, user => {
                room.CommonRules.addAdditionalHoldCardNumber(user, user.getInvisibleMark(this.GeneralName));
                user.removeInvisibleMark(this.GeneralName);
            });
        return true;
    }
};
XiongHuoRemover = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: XiongHuoFilter.Name, description: XiongHuoFilter.Description })
], XiongHuoRemover);
exports.XiongHuoRemover = XiongHuoRemover;
