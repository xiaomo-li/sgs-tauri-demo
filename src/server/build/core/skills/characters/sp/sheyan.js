"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SheYan = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let SheYan = class SheYan extends skill_1.TriggerSkill {
    constructor() {
        super(...arguments);
        this.SheYanAdd = 'sheyan_add';
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "OnAimmed" /* OnAimmed */;
    }
    canUse(room, owner, content) {
        const card = engine_1.Sanguosha.getCardById(content.byCardId);
        return (content.toId === owner.Id &&
            card.is(7 /* Trick */) &&
            !card.is(8 /* DelayedTrick */) &&
            (room
                .getAlivePlayersFrom()
                .map(player => player.Id)
                .find(playerId => !aim_group_1.AimGroupUtil.getAllTargets(content.allTargets).includes(playerId) &&
                room.isAvailableTarget(content.byCardId, content.fromId, playerId) &&
                engine_1.Sanguosha.getCardById(content.byCardId).Skill.isCardAvailableTarget(content.fromId, room, playerId, [], [], content.byCardId)) !== undefined ||
                aim_group_1.AimGroupUtil.getAllTargets(content.allTargets).length > 1));
    }
    async beforeUse(room, event) {
        const { fromId } = event;
        const aimEvent = event.triggeredOnEvent;
        const allTargets = aim_group_1.AimGroupUtil.getAllTargets(aimEvent.allTargets);
        const options = [];
        room
            .getAlivePlayersFrom()
            .map(player => player.Id)
            .find(playerId => !aim_group_1.AimGroupUtil.getAllTargets(aimEvent.allTargets).includes(playerId) &&
            room.isAvailableTarget(aimEvent.byCardId, aimEvent.fromId, playerId) &&
            engine_1.Sanguosha.getCardById(aimEvent.byCardId).Skill.isCardAvailableTarget(aimEvent.fromId, room, playerId, [], [], aimEvent.byCardId)) !== undefined && options.push('sheyan:add');
        aim_group_1.AimGroupUtil.getAllTargets(aimEvent.allTargets).length > 1 && options.push('sheyan:reduce');
        if (options.length === 0) {
            return false;
        }
        room.notify(168 /* AskForChoosingOptionsEvent */, {
            options,
            toId: fromId,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose sheyan options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(aimEvent.byCardId)).extract(),
            triggeredBySkills: [this.Name],
        }, fromId);
        const { selectedOption } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, fromId);
        if (selectedOption === 'sheyan:add') {
            const { selectedPlayers } = await room.doAskForCommonly(174 /* AskForChoosingCardAvailableTargetEvent */, {
                user: aimEvent.fromId,
                cardId: aimEvent.byCardId,
                exclude: allTargets,
                conversation: 'sheyan: please select a player to append to card targets',
                triggeredBySkills: [this.Name],
            }, fromId);
            if (selectedPlayers) {
                event_packer_1.EventPacker.addMiddleware({ tag: this.SheYanAdd, data: true }, event);
                event.toIds = selectedPlayers;
            }
        }
        else if (selectedOption === 'sheyan:reduce') {
            const { selectedPlayers } = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                players: aim_group_1.AimGroupUtil.getAllTargets(aimEvent.allTargets),
                toId: fromId,
                requiredAmount: 1,
                conversation: 'sheyan: please select a target to remove',
                triggeredBySkills: [this.Name],
            }, fromId);
            if (selectedPlayers && selectedPlayers.length > 0) {
                event_packer_1.EventPacker.addMiddleware({ tag: this.SheYanAdd, data: false }, event);
                event.toIds = selectedPlayers;
            }
        }
        return event.toIds !== undefined && event.toIds.length > 0;
    }
    resortTargets() {
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        const aimEvent = event.triggeredOnEvent;
        const chosen = event_packer_1.EventPacker.getMiddleware(this.SheYanAdd, event);
        if (chosen === true) {
            room.broadcast(103 /* CustomGameDialog */, {
                translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher("{1} is appended to target list of {2} by {0}'s skill {3}", translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId)), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(toIds[0])), translation_json_tool_1.TranslationPack.patchCardInTranslation(aimEvent.byCardId), this.Name).extract(),
            });
            aim_group_1.AimGroupUtil.addTargets(room, aimEvent, toIds);
        }
        else if (chosen === false) {
            room.broadcast(103 /* CustomGameDialog */, {
                translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher("{1} is removed from target list of {2} by {0}'s skill {3}", translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId)), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(toIds[0])), translation_json_tool_1.TranslationPack.patchCardInTranslation(aimEvent.byCardId), this.Name).extract(),
            });
            aim_group_1.AimGroupUtil.cancelTarget(aimEvent, toIds[0]);
        }
        return true;
    }
};
SheYan = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'sheyan', description: 'sheyan_description' })
], SheYan);
exports.SheYan = SheYan;
