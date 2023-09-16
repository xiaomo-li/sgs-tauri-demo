"use strict";
var QiaoShuo_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiaoShuoLose = exports.QiaoShuoWin = exports.QiaoShuo = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const target_group_1 = require("core/shares/libs/utils/target_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let QiaoShuo = QiaoShuo_1 = class QiaoShuo extends skill_1.ActiveSkill {
    canUse() {
        return true;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return room.canPindian(owner, target);
    }
    cardFilter() {
        return true;
    }
    isAvailableCard() {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, skillEffectSkill) {
        const { fromId, toIds } = skillEffectSkill;
        const { pindianRecord } = await room.pindian(fromId, toIds, this.Name);
        if (!pindianRecord.length) {
            return false;
        }
        if (pindianRecord[0].winner === fromId) {
            room.setFlag(fromId, QiaoShuo_1.WIN, true, QiaoShuo_1.WIN);
        }
        else {
            await room.skip(fromId, 4 /* PlayCardStage */);
            room.setFlag(fromId, QiaoShuo_1.LOSE, true, QiaoShuo_1.LOSE);
        }
        return true;
    }
};
QiaoShuo.WIN = 'qiaoshuo_win';
QiaoShuo.LOSE = 'qiaoshuo_lose';
QiaoShuo = QiaoShuo_1 = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'qiaoshuo', description: 'qiaoshuo_description' })
], QiaoShuo);
exports.QiaoShuo = QiaoShuo;
let QiaoShuoWin = class QiaoShuoWin extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterCardTargetDeclared" /* AfterCardTargetDeclared */;
    }
    canUse(room, owner, event) {
        return event.fromId === owner.Id && owner.getFlag(QiaoShuo.WIN);
    }
    isRefreshAt(room, owner, stage) {
        return stage === 6 /* FinishStage */ && room.CurrentPhasePlayer === owner;
    }
    whenRefresh(room, owner) {
        owner.getFlag(QiaoShuo.WIN) && room.removeFlag(owner.Id, QiaoShuo.WIN);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillEffectSkill) {
        const { fromId, triggeredOnEvent } = skillEffectSkill;
        const from = room.getPlayerById(fromId);
        const cardUseEvent = triggeredOnEvent;
        const card = engine_1.Sanguosha.getCardById(cardUseEvent.cardId);
        if (card.is(0 /* Basic */) || (card.is(7 /* Trick */) && !card.is(8 /* DelayedTrick */))) {
            room.removeFlag(fromId, QiaoShuo.WIN);
            const options = [];
            if (!cardUseEvent.targetGroup) {
                // only responsive card has not 'toIds'
                return false;
            }
            const targetGroup = cardUseEvent.targetGroup;
            const realTargets = target_group_1.TargetGroupUtil.getRealTargets(cardUseEvent.targetGroup);
            if (targetGroup.length > 1) {
                options.push('qiaoshuo: reduce');
            }
            const cardSkill = card.Skill;
            const pendingTargets = room
                .getAlivePlayersFrom()
                .map(player => player.Id)
                .filter(playerId => !realTargets.includes(playerId) &&
                room.isAvailableTarget(card.Id, fromId, playerId) &&
                cardSkill.isCardAvailableTarget(fromId, room, playerId, [], [], card.Id));
            if (pendingTargets.length) {
                options.push('qiaoshuo: add');
            }
            if (!options.length) {
                return false;
            }
            const { selectedOption } = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                options,
                toId: fromId,
                conversation: 'qiaoshuo: please select',
                triggeredBySkills: [this.Name],
            }, fromId);
            if (!selectedOption) {
                return false;
            }
            if (selectedOption === 'qiaoshuo: reduce') {
                const { selectedPlayers } = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                    players: realTargets,
                    toId: fromId,
                    requiredAmount: 1,
                    conversation: 'qiaoshuo: please select a player to reduce from card targets',
                    triggeredBySkills: [this.Name],
                }, fromId, true);
                room.broadcast(103 /* CustomGameDialog */, {
                    translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher("{1} is removed from target list of {2} by {0}'s skill {3}", translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(selectedPlayers[0])), translation_json_tool_1.TranslationPack.patchCardInTranslation(card.Id), this.GeneralName).extract(),
                });
                target_group_1.TargetGroupUtil.removeTarget(targetGroup, selectedPlayers[0]);
            }
            else {
                const { selectedPlayers } = await room.doAskForCommonly(174 /* AskForChoosingCardAvailableTargetEvent */, {
                    user: fromId,
                    cardId: cardUseEvent.cardId,
                    exclude: realTargets,
                    conversation: 'qiaoshuo: please select a player to append to card targets',
                    triggeredBySkills: [this.Name],
                }, fromId);
                if (selectedPlayers) {
                    room.broadcast(103 /* CustomGameDialog */, {
                        translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher("{1} is appended to target list of {2} by {0}'s skill {3}", translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(selectedPlayers[0])), translation_json_tool_1.TranslationPack.patchCardInTranslation(card.Id), this.GeneralName).extract(),
                    });
                    target_group_1.TargetGroupUtil.pushTargets(targetGroup, selectedPlayers);
                }
            }
        }
        return true;
    }
};
QiaoShuoWin = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: QiaoShuo.GeneralName, description: QiaoShuo.Description })
], QiaoShuoWin);
exports.QiaoShuoWin = QiaoShuoWin;
let QiaoShuoLose = class QiaoShuoLose extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event) {
        return event_packer_1.EventPacker.getIdentifier(event) === 162 /* AskForCardDropEvent */;
    }
    canUse(room, owner) {
        return (room.CurrentPlayerPhase === 5 /* DropCardStage */ &&
            room.CurrentPhasePlayer.Id === owner.Id &&
            owner.getFlag(QiaoShuo.LOSE));
    }
    isRefreshAt(room, owner, stage) {
        return stage === 6 /* FinishStage */ && room.CurrentPhasePlayer === owner;
    }
    whenRefresh(room, owner) {
        owner.getFlag(QiaoShuo.LOSE) && room.removeFlag(owner.Id, QiaoShuo.LOSE);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillEffectEvent) {
        const askForCardDropEvent = skillEffectEvent.triggeredOnEvent;
        const player = room.getPlayerById(askForCardDropEvent.toId);
        const tricks = player
            .getCardIds(0 /* HandArea */)
            .filter(cardId => engine_1.Sanguosha.getCardById(cardId).is(7 /* Trick */));
        askForCardDropEvent.cardAmount -= tricks.length;
        askForCardDropEvent.except = askForCardDropEvent.except ? [...askForCardDropEvent.except, ...tricks] : tricks;
        room.removeFlag(player.Id, QiaoShuo.LOSE);
        return true;
    }
};
QiaoShuoLose = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: QiaoShuoWin.Name, description: QiaoShuoWin.GeneralName })
], QiaoShuoLose);
exports.QiaoShuoLose = QiaoShuoLose;
