"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuanWu = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const game_props_1 = require("core/game/game_props");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let LuanWu = class LuanWu extends skill_1.ActiveSkill {
    canUse() {
        return true;
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
    async onEffect(room, skillUseEvent) {
        const { fromId } = skillUseEvent;
        for (const target of room.getOtherPlayers(fromId)) {
            let minDistance = game_props_1.INFINITE_DISTANCE;
            room.getOtherPlayers(target.Id).forEach(player => {
                const distance = room.distanceBetween(target, player);
                if (distance < minDistance) {
                    minDistance = distance;
                }
            });
            const targets = room.getOtherPlayers(target.Id).reduce((targets, player) => {
                if (room.distanceBetween(target, player) === minDistance) {
                    targets.push(player);
                }
                return targets;
            }, []);
            const toIds = targets.reduce((toIds, player) => {
                toIds.push(player.Id);
                return toIds;
            }, []);
            if (targets.length > 0) {
                const response = await room.askForCardUse({
                    toId: target.Id,
                    cardUserId: target.Id,
                    scopedTargets: toIds,
                    cardMatcher: new card_matcher_1.CardMatcher({ generalName: ['slash'] }).toSocketPassenger(),
                    extraUse: true,
                    commonUse: true,
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('please use a {0} to player {1} to response {2}', 'slash', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(...targets), this.Name).extract(),
                    triggeredBySkills: [this.Name],
                }, target.Id);
                if (response.cardId !== undefined) {
                    const cardUseEvent = {
                        fromId: response.fromId,
                        cardId: response.cardId,
                        targetGroup: [response.toIds],
                        triggeredBySkills: [this.Name],
                    };
                    await room.useCard(cardUseEvent, true);
                }
                else {
                    await room.loseHp(target.Id, 1);
                }
            }
            else {
                await room.loseHp(target.Id, 1);
            }
        }
        return true;
    }
};
LuanWu = tslib_1.__decorate([
    skill_wrappers_1.LimitSkill({ name: 'luanwu', description: 'luanwu_description' })
], LuanWu);
exports.LuanWu = LuanWu;
