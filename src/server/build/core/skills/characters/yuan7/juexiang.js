"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JueXiangRemover = exports.JueXiangProhibited = exports.JueXiang = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const qingxiancanpu_1 = require("./qingxiancanpu");
let JueXiang = class JueXiang extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return [qingxiancanpu_1.JiXian.Name, qingxiancanpu_1.LieXian.Name, qingxiancanpu_1.RouXian.Name, qingxiancanpu_1.HeXian.Name];
    }
    isTriggerable(event, stage) {
        return stage === "PlayerDied" /* PlayerDied */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        await room.obtainSkill(event.toIds[0], this.RelatedSkills[Math.floor(Math.random() * this.RelatedSkills.length)]);
        for (const skillName of [JueXiangProhibited.Name, JueXiangRemover.Name]) {
            room.getPlayerById(event.toIds[0]).hasShadowSkill(skillName) ||
                (await room.obtainSkill(event.toIds[0], skillName));
        }
        return true;
    }
};
JueXiang = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'juexiang', description: 'juexiang_description' })
], JueXiang);
exports.JueXiang = JueXiang;
let JueXiangProhibited = class JueXiangProhibited extends skill_1.FilterSkill {
    canBeUsedCard(cardId, room, owner, attacker) {
        if (attacker === owner) {
            return true;
        }
        if (cardId instanceof card_matcher_1.CardMatcher) {
            return !new card_matcher_1.CardMatcher({ suit: [3 /* Club */] }).match(cardId);
        }
        else {
            return engine_1.Sanguosha.getCardById(cardId).Suit !== 3 /* Club */;
        }
    }
};
JueXiangProhibited = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_juexiang_prohibited', description: 's_juexiang_description' })
], JueXiangProhibited);
exports.JueXiangProhibited = JueXiangProhibited;
let JueXiangRemover = class JueXiangRemover extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return (room.CurrentPlayer === room.getPlayerById(owner) &&
            room.CurrentPlayerPhase === 0 /* PhaseBegin */ &&
            stage === "AfterPhaseChanged" /* AfterPhaseChanged */);
    }
    async whenDead(room, player) {
        await room.loseSkill(player.Id, JueXiangProhibited.Name);
        await room.loseSkill(player.Id, this.Name);
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
        return owner.Id === event.toPlayer && event.to === 0 /* PhaseBegin */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.loseSkill(event.fromId, JueXiangProhibited.Name);
        await room.loseSkill(event.fromId, this.Name);
        return true;
    }
};
JueXiangRemover = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_juexiang_remover', description: 's_juexiang_remover_description' })
], JueXiangRemover);
exports.JueXiangRemover = JueXiangRemover;
