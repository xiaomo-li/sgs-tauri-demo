"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiJiShadow = exports.LiJi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let LiJi = class LiJi extends skill_1.ActiveSkill {
    isRefreshAt(room, owner, stage) {
        return stage === 0 /* PhaseBegin */;
    }
    canUse(room, owner) {
        return (owner.hasUsedSkillTimes(this.Name) <
            Math.floor((owner.getFlag(this.Name) || 0) / (owner.getFlag(LiJiShadow.Name) || 8)));
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        if (!event.toIds || !event.cardIds) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, event.cardIds, fromId, fromId, this.Name);
        await room.damage({
            fromId,
            toId: event.toIds[0],
            damage: 1,
            damageType: "normal_property" /* Normal */,
            triggeredBySkills: [this.Name],
        });
        return true;
    }
};
LiJi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'liji', description: 'liji_description' })
], LiJi);
exports.LiJi = LiJi;
let LiJiShadow = class LiJiShadow extends skill_1.TriggerSkill {
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
        return (stage === "PhaseChanged" /* PhaseChanged */ ||
            stage === "AfterPhaseChanged" /* AfterPhaseChanged */ ||
            stage === "AfterCardMoved" /* AfterCardMoved */);
    }
    canUse(room, owner, event, stage) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return ((stage === "PhaseChanged" /* PhaseChanged */ &&
                phaseChangeEvent.fromPlayer === owner.Id &&
                phaseChangeEvent.from === 7 /* PhaseFinish */) ||
                (stage === "AfterPhaseChanged" /* AfterPhaseChanged */ &&
                    phaseChangeEvent.toPlayer === owner.Id &&
                    phaseChangeEvent.to === 0 /* PhaseBegin */));
        }
        else if (identifier === 128 /* MoveCardEvent */) {
            const moveCardEvent = event;
            return (room.CurrentPlayer === owner &&
                moveCardEvent.infos.find(info => info.toArea === 4 /* DropStack */) !== undefined);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 104 /* PhaseChangeEvent */) {
            if (room.CurrentPlayerPhase === 0 /* PhaseBegin */) {
                const count = room.AlivePlayers.length > 4 ? 8 : 4;
                room.setFlag(fromId, this.Name, count);
                const droppedNum = room.getFlag(fromId, LiJi.Name) || 0;
                room.setFlag(fromId, LiJi.Name, droppedNum, translation_json_tool_1.TranslationPack.translationJsonPatcher('liji times: {0} {1}', count - (droppedNum % count), Math.floor(droppedNum / count)).toString());
            }
            else {
                room.removeFlag(fromId, this.Name);
                room.removeFlag(fromId, LiJi.Name);
            }
        }
        else {
            let droppedNum = room.getFlag(fromId, LiJi.Name) || 0;
            droppedNum += unknownEvent.infos.reduce((sum, info) => info.toArea === 4 /* DropStack */
                ? sum + info.movingCards.filter(card => !engine_1.Sanguosha.isVirtualCardId(card.card)).length
                : sum, 0);
            const count = room.getFlag(fromId, this.Name) || 8;
            room.setFlag(fromId, LiJi.Name, droppedNum, translation_json_tool_1.TranslationPack.translationJsonPatcher('liji times: {0} {1}', count - (droppedNum % count), Math.floor(droppedNum / count) - room.getPlayerById(fromId).hasUsedSkillTimes(this.GeneralName)).toString());
        }
        return true;
    }
};
LiJiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: LiJi.Name, description: LiJi.Description })
], LiJiShadow);
exports.LiJiShadow = LiJiShadow;
