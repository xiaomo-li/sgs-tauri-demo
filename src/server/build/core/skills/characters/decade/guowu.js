"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuoWuUnlimited = exports.GuoWuShadow = exports.GuoWu = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const target_group_1 = require("core/shares/libs/utils/target_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let GuoWu = class GuoWu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 13 /* PlayCardStageStart */ &&
            owner.getCardIds(0 /* HandArea */).length > 0);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const handCards = room.getPlayerById(fromId).getCardIds(0 /* HandArea */);
        const displayEvent = {
            fromId,
            displayCards: handCards,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} displayed cards {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(...handCards)).extract(),
        };
        room.broadcast(126 /* CardDisplayEvent */, displayEvent);
        const typeNum = handCards.reduce((suits, cardId) => {
            const suit = engine_1.Sanguosha.getCardById(cardId).Suit;
            return suits.includes(suit) ? suits : suits.concat(suit);
        }, []).length;
        if (typeNum > 0) {
            const slashs = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ generalName: ['slash'] }), false);
            slashs.length > 0 &&
                (await room.moveCards({
                    movingCards: [{ card: slashs[Math.floor(Math.random() * slashs.length)], fromArea: 4 /* DropStack */ }],
                    toId: fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 1 /* ActivePrey */,
                    proposer: fromId,
                    triggeredBySkills: [this.Name],
                }));
            if (typeNum > 1) {
                room.getPlayerById(fromId).hasShadowSkill(GuoWuUnlimited.Name) ||
                    (await room.obtainSkill(fromId, GuoWuUnlimited.Name));
                typeNum > 2 && room.getPlayerById(fromId).setFlag(this.Name, true);
            }
        }
        return true;
    }
};
GuoWu = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'guowu', description: 'guowu_description' })
], GuoWu);
exports.GuoWu = GuoWu;
let GuoWuShadow = class GuoWuShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    async whenDead(room, player) {
        await room.loseSkill(player.Id, GuoWuUnlimited.Name);
        player.removeFlag(this.GeneralName);
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterCardTargetDeclared" /* AfterCardTargetDeclared */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = content;
            return (owner.getFlag(this.GeneralName) &&
                cardUseEvent.fromId === owner.Id &&
                (engine_1.Sanguosha.getCardById(cardUseEvent.cardId).GeneralName === 'slash' ||
                    engine_1.Sanguosha.getCardById(cardUseEvent.cardId).isCommonTrick()) &&
                !!engine_1.Sanguosha.getCardById(cardUseEvent.cardId).Skill.isCardAvailableTarget);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = content;
            return (phaseChangeEvent.fromPlayer === owner.Id &&
                phaseChangeEvent.from === 4 /* PlayCardStage */ &&
                (owner.hasShadowSkill(GuoWuUnlimited.Name) || owner.getFlag(this.GeneralName)));
        }
        return false;
    }
    async beforeUse(room, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event.triggeredOnEvent);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = event.triggeredOnEvent;
            const players = room
                .getAlivePlayersFrom()
                .map(player => player.Id)
                .filter(playerId => !target_group_1.TargetGroupUtil.getRealTargets(cardUseEvent.targetGroup).includes(playerId) &&
                room.isAvailableTarget(cardUseEvent.cardId, event.fromId, playerId) &&
                engine_1.Sanguosha.getCardById(cardUseEvent.cardId).Skill.isCardAvailableTarget(event.fromId, room, playerId, [], [], cardUseEvent.cardId));
            const allTargets = target_group_1.TargetGroupUtil.getAllTargets(cardUseEvent.targetGroup);
            if (players.length > 0 && allTargets !== undefined) {
                if (allTargets[0].length === 1) {
                    const resp = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                        players,
                        toId: event.fromId,
                        requiredAmount: [1, 2],
                        conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose at most 2 targets to append to {1} targets?', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(cardUseEvent.cardId)).extract(),
                        triggeredBySkills: [this.Name],
                    }, event.fromId);
                    if (resp.selectedPlayers && resp.selectedPlayers.length > 0) {
                        event.toIds = resp.selectedPlayers;
                        return true;
                    }
                }
                else if (allTargets[0].length > 1) {
                    const targets = target_group_1.TargetGroupUtil.getRealTargets(cardUseEvent.targetGroup);
                    const chosen = [];
                    let count = 0;
                    while (players.length > 0 || count < 2) {
                        const { selectedPlayers } = await room.doAskForCommonly(174 /* AskForChoosingCardAvailableTargetEvent */, {
                            user: event.fromId,
                            cardId: cardUseEvent.cardId,
                            exclude: targets,
                            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target to append to {1} targets?', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(cardUseEvent.cardId)).extract(),
                            triggeredBySkills: [this.Name],
                        }, event.fromId);
                        if (!selectedPlayers || selectedPlayers.length < 2) {
                            break;
                        }
                        else {
                            chosen.push(selectedPlayers);
                            targets.push(selectedPlayers[0]);
                            const index = players.findIndex(player => player === selectedPlayers[0]);
                            index !== -1 && players.splice(index, 1);
                            count++;
                        }
                    }
                    if (chosen.length > 0) {
                        for (const selected of chosen) {
                            target_group_1.TargetGroupUtil.pushTargets(cardUseEvent.targetGroup, selected);
                        }
                        event.toIds = [];
                        return true;
                    }
                }
            }
        }
        return identifier === 104 /* PhaseChangeEvent */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 124 /* CardUseEvent */) {
            if (!event.toIds) {
                return false;
            }
            if (event.toIds.length > 0) {
                for (const toId of event.toIds) {
                    target_group_1.TargetGroupUtil.pushTargets(unknownEvent.targetGroup, toId);
                }
            }
        }
        else {
            await room.loseSkill(event.fromId, GuoWuUnlimited.Name);
            room.getPlayerById(event.fromId).removeFlag(this.GeneralName);
        }
        return true;
    }
};
GuoWuShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: GuoWu.Name, description: GuoWu.Description })
], GuoWuShadow);
exports.GuoWuShadow = GuoWuShadow;
let GuoWuUnlimited = class GuoWuUnlimited extends skill_1.RulesBreakerSkill {
    breakCardUsableDistance() {
        return game_props_1.INFINITE_DISTANCE;
    }
};
GuoWuUnlimited = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_guowu_unlimited', description: 's_guowu_unlimited_description' })
], GuoWuUnlimited);
exports.GuoWuUnlimited = GuoWuUnlimited;
