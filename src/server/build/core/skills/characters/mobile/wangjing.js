"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WangJing = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const target_group_1 = require("core/shares/libs/utils/target_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const jibing_1 = require("./jibing");
let WangJing = class WangJing extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */ || stage === "CardResponsing" /* CardResponsing */;
    }
    findOpponent(room, owner, content) {
        const card = engine_1.Sanguosha.getCardById(content.cardId);
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = content;
            if (card.GeneralName === 'slash') {
                const targets = target_group_1.TargetGroupUtil.getRealTargets(cardUseEvent.targetGroup);
                targets.filter(player => player !== owner.Id);
                if (targets.length > 0) {
                    room.sortPlayersByPosition(targets);
                    return targets[0];
                }
            }
            else {
                if (!cardUseEvent.responseToEvent ||
                    event_packer_1.EventPacker.getIdentifier(cardUseEvent.responseToEvent) !== 125 /* CardEffectEvent */) {
                    return undefined;
                }
                const cardEffectEvent = cardUseEvent.responseToEvent;
                return cardEffectEvent.fromId;
            }
        }
        else if (identifier === 123 /* CardResponseEvent */) {
            const cardResponseEvent = content;
            if (!cardResponseEvent.responseToEvent ||
                event_packer_1.EventPacker.getIdentifier(cardResponseEvent.responseToEvent) !== 125 /* CardEffectEvent */) {
                return undefined;
            }
            const cardEffectEvent = cardResponseEvent.responseToEvent;
            if (!cardEffectEvent.fromId) {
                return undefined;
            }
            if (engine_1.Sanguosha.getCardById(cardEffectEvent.cardId).GeneralName === 'duel') {
                if (cardEffectEvent.fromId === owner.Id) {
                    const opponents = cardEffectEvent.toIds;
                    if (opponents && opponents.length > 0) {
                        return opponents[0];
                    }
                }
                else {
                    return cardEffectEvent.fromId;
                }
            }
            else {
                return cardEffectEvent.fromId;
            }
        }
    }
    canUse(room, owner, content) {
        const card = engine_1.Sanguosha.getCardById(content.cardId);
        if (content.fromId !== owner.Id ||
            !card.isVirtualCard() ||
            (card.GeneralName !== 'slash' && card.GeneralName !== 'jink')) {
            return false;
        }
        const virtualCard = card;
        if (!virtualCard.findByGeneratedSkill(jibing_1.JiBing.Name)) {
            return false;
        }
        const target = this.findOpponent(room, owner, content);
        return (target !== undefined && !room.getOtherPlayers(target).find(player => player.Hp > room.getPlayerById(target).Hp));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
WangJing = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'wangjing', description: 'wangjing_description' })
], WangJing);
exports.WangJing = WangJing;
