"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiRangBuff = exports.QiRang = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let QiRang = class QiRang extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        return content.infos.find(info => info.toId === owner.Id && info.toArea === 1 /* EquipArea */) !== undefined;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to gain a random equip card from draw stack?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const tricks = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ type: [7 /* Trick */] }));
        if (tricks.length > 0) {
            const randomTrick = tricks[Math.floor(Math.random() * tricks.length)];
            await room.moveCards({
                movingCards: [{ card: randomTrick, fromArea: 5 /* DrawStack */ }],
                toId: event.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: event.fromId,
                triggeredBySkills: [this.Name],
            });
            if (engine_1.Sanguosha.getCardById(randomTrick).isCommonTrick()) {
                const qirangTricks = room.getFlag(event.fromId, this.Name) || [];
                qirangTricks.includes(randomTrick) || qirangTricks.push(randomTrick);
                room.getPlayerById(event.fromId).setFlag(this.Name, qirangTricks);
            }
        }
        return true;
    }
};
QiRang = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'qirang', description: 'qirang_description' })
], QiRang);
exports.QiRang = QiRang;
let QiRangBuff = class QiRangBuff extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    afterDead(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    isTriggerable(event, stage) {
        return stage === "OnAim" /* OnAim */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        var _a;
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 131 /* AimEvent */) {
            const aimEvent = event;
            return (aimEvent.fromId === owner.Id &&
                aim_group_1.AimGroupUtil.getAllTargets(aimEvent.allTargets).length === 1 &&
                engine_1.Sanguosha.getCardById(aimEvent.byCardId).isCommonTrick() &&
                ((_a = owner.getFlag(this.GeneralName)) === null || _a === void 0 ? void 0 : _a.includes(aimEvent.byCardId)));
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const PhaseChangeEvent = event;
            return (owner.Id === PhaseChangeEvent.fromPlayer &&
                PhaseChangeEvent.from === 7 /* PhaseFinish */ &&
                owner.getFlag(this.GeneralName) !== undefined);
        }
        return false;
    }
    async beforeUse(room, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event.triggeredOnEvent);
        if (identifier === 131 /* AimEvent */) {
            const aimEvent = event.triggeredOnEvent;
            const players = room
                .getAlivePlayersFrom()
                .map(player => player.Id)
                .filter(playerId => !aim_group_1.AimGroupUtil.getAllTargets(aimEvent.allTargets).includes(playerId) &&
                room.isAvailableTarget(aimEvent.byCardId, event.fromId, playerId) &&
                engine_1.Sanguosha.getCardById(aimEvent.byCardId).Skill.isCardAvailableTarget(event.fromId, room, playerId, [], [], aimEvent.byCardId));
            if (players.length > 0) {
                const targets = aim_group_1.AimGroupUtil.getAllTargets(aimEvent.allTargets);
                const { selectedPlayers } = await room.doAskForCommonly(174 /* AskForChoosingCardAvailableTargetEvent */, {
                    user: event.fromId,
                    cardId: aimEvent.byCardId,
                    exclude: targets,
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to select a player to append to {1} targets?', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(aimEvent.byCardId)).extract(),
                    triggeredBySkills: [this.Name],
                }, event.fromId);
                if (selectedPlayers && selectedPlayers.length > 0) {
                    event.toIds = selectedPlayers;
                    return true;
                }
            }
        }
        return identifier === 104 /* PhaseChangeEvent */;
    }
    resortTargets() {
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        if (event_packer_1.EventPacker.getIdentifier(unknownEvent) === 131 /* AimEvent */) {
            if (!event.toIds) {
                return false;
            }
            const aimEvent = unknownEvent;
            room.broadcast(103 /* CustomGameDialog */, {
                translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher("{1} is appended to target list of {2} by {0}'s skill {3}", translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId)), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.toIds[0])), translation_json_tool_1.TranslationPack.patchCardInTranslation(aimEvent.byCardId), this.Name).extract(),
            });
            aim_group_1.AimGroupUtil.addTargets(room, aimEvent, event.toIds);
        }
        else {
            room.getPlayerById(event.fromId).removeFlag(this.GeneralName);
        }
        return true;
    }
};
QiRangBuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: QiRang.Name, description: QiRang.Description })
], QiRangBuff);
exports.QiRangBuff = QiRangBuff;
