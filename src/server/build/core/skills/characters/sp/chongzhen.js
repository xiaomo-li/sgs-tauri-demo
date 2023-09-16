"use strict";
var ChongZhen_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChongZhen = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const target_group_1 = require("core/shares/libs/utils/target_group");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ChongZhen = ChongZhen_1 = class ChongZhen extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */ || stage === "CardResponsing" /* CardResponsing */;
    }
    findChongZhenTarget(room, owner, content) {
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
        if (ChongZhen_1.LongDanName.find(name => virtualCard.findByGeneratedSkill(name)) === undefined) {
            return false;
        }
        const target = this.findChongZhenTarget(room, owner, content);
        return target !== undefined && room.getPlayerById(target).getCardIds(0 /* HandArea */).length > 0;
    }
    getSkillLog(room, owner, event) {
        const target = this.findChongZhenTarget(room, owner, event);
        return target
            ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to prey {1} a hand card?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(target))).extract()
            : translation_json_tool_1.TranslationPack.translationJsonPatcher('do you want to trigger skill {0} ?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const from = room.getPlayerById(fromId);
        const unknownEvent = triggeredOnEvent;
        const targetId = this.findChongZhenTarget(room, from, unknownEvent);
        if (targetId && targetId !== fromId) {
            const target = room.getPlayerById(targetId);
            const response = await room.doAskForCommonly(170 /* AskForChoosingCardFromPlayerEvent */, {
                fromId,
                toId: targetId,
                options: {
                    [0 /* HandArea */]: target.getCardIds(0 /* HandArea */).length,
                },
                triggeredBySkills: [this.Name],
            }, fromId);
            if (response.selectedCardIndex !== undefined) {
                const cardIds = target.getCardIds(0 /* HandArea */);
                response.selectedCard = cardIds[Math.floor(Math.random() * cardIds.length)];
            }
            if (response.selectedCard !== undefined) {
                await room.moveCards({
                    movingCards: [{ card: response.selectedCard, fromArea: response.fromArea }],
                    fromId: targetId,
                    toId: fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 1 /* ActivePrey */,
                    proposer: fromId,
                    movedByReason: this.Name,
                });
            }
        }
        return true;
    }
};
ChongZhen.LongDanName = ['std_longdan', 'longdan'];
ChongZhen = ChongZhen_1 = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'chongzhen', description: 'chongzhen_description' })
], ChongZhen);
exports.ChongZhen = ChongZhen;
