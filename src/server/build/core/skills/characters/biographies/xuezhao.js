"use strict";
var XueZhao_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.XueZhaoShadow = exports.XueZhaoBuff = exports.XueZhao = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let XueZhao = XueZhao_1 = class XueZhao extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.getCardIds(0 /* HandArea */).length > 0 && owner.Hp > 0;
    }
    numberOfTargets() {
        return [];
    }
    targetFilter(room, owner, targets) {
        return targets.length > 0 && targets.length <= owner.MaxHp;
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
    availableCardAreas() {
        return [0 /* HandArea */];
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
        for (const toId of event.toIds) {
            if (room.getPlayerById(toId).getPlayerCards().length === 0) {
                continue;
            }
            const { selectedCards } = await room.doAskForCommonly(163 /* AskForCardEvent */, {
                cardAmount: 1,
                toId,
                reason: this.Name,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: you need to give a handcard to {1}, otherwise you cannot response the card {1} use', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId))).extract(),
                fromArea: [0 /* HandArea */, 1 /* EquipArea */],
                triggeredBySkills: [this.Name],
            }, toId);
            if (selectedCards.length > 0) {
                await room.moveCards({
                    movingCards: [{ card: selectedCards[0], fromArea: room.getPlayerById(toId).cardFrom(selectedCards[0]) }],
                    fromId: toId,
                    toId: fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 2 /* ActiveMove */,
                    proposer: toId,
                    triggeredBySkills: [this.Name],
                });
                await room.drawCards(1, toId, 'top', toId, this.Name);
                const slashTimes = room.getFlag(fromId, this.Name) || 0;
                room.setFlag(fromId, this.Name, slashTimes + 1);
            }
            else {
                const targets = room.getFlag(fromId, XueZhao_1.XueZhaoTargets) || [];
                targets.includes(toId) || targets.push(toId);
                room.getPlayerById(fromId).setFlag(XueZhao_1.XueZhaoTargets, targets);
                room.setFlag(toId, XueZhaoShadow.Name, true, this.Name);
            }
        }
        return true;
    }
};
XueZhao.XueZhaoTargets = 'xuezhao_targets';
XueZhao = XueZhao_1 = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'xuezhao', description: 'xuezhao_description' })
], XueZhao);
exports.XueZhao = XueZhao;
let XueZhaoBuff = class XueZhaoBuff extends skill_1.RulesBreakerSkill {
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
XueZhaoBuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: XueZhao.Name, description: XueZhao.Description })
], XueZhaoBuff);
exports.XueZhaoBuff = XueZhaoBuff;
let XueZhaoShadow = class XueZhaoShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    afterDead(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 124 /* CardUseEvent */) {
            return (owner.getFlag(XueZhao.XueZhaoTargets) !== undefined &&
                event.fromId === owner.Id);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return ((owner.getFlag(this.GeneralName) !== undefined ||
                owner.getFlag(XueZhao.XueZhaoTargets) !== undefined) &&
                phaseChangeEvent.fromPlayer === owner.Id &&
                phaseChangeEvent.from === 7 /* PhaseFinish */);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        if (event_packer_1.EventPacker.getIdentifier(unknownEvent) === 124 /* CardUseEvent */) {
            const cardUseEvent = unknownEvent;
            cardUseEvent.disresponsiveList = room.getFlag(event.fromId, XueZhao.XueZhaoTargets);
        }
        else {
            room.removeFlag(event.fromId, this.GeneralName);
            room.removeFlag(event.fromId, XueZhao.XueZhaoTargets);
            for (const player of room.getOtherPlayers(event.fromId)) {
                player.getFlag(this.Name) && room.removeFlag(player.Id, this.Name);
            }
        }
        return true;
    }
};
XueZhaoShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: XueZhaoBuff.Name, description: XueZhaoBuff.Description })
], XueZhaoShadow);
exports.XueZhaoShadow = XueZhaoShadow;
