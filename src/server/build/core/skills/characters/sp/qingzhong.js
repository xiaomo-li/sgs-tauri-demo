"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QingZhongShadow = exports.QingZhong = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let QingZhong = class QingZhong extends skill_1.TriggerSkill {
    isRefreshAt(room, owner, stage) {
        return stage === 4 /* PlayCardStage */;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ && event.toStage === 13 /* PlayCardStageStart */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.playerId;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('qingzhong {0}: do you want to draw 2 cards?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(2, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
QingZhong = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'qingzhong', description: 'qingzhong_description' })
], QingZhong);
exports.QingZhong = QingZhong;
let QingZhongShadow = class QingZhongShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return (room.CurrentPlayerStage === 15 /* PlayCardStageEnd */ && stage === "StageChanged" /* StageChanged */);
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ && event.toStage === 15 /* PlayCardStageEnd */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.playerId && owner.hasUsedSkill(this.GeneralName);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const handCards = room.getPlayerById(event.fromId).getCardIds(0 /* HandArea */);
        const min = room.getOtherPlayers(event.fromId).reduce((minimum, player) => {
            player.getCardIds(0 /* HandArea */).length < minimum &&
                (minimum = player.getCardIds(0 /* HandArea */).length);
            return minimum;
        }, handCards.length);
        if (min <= handCards.length) {
            const targets = room
                .getOtherPlayers(event.fromId)
                .filter(player => player.getCardIds(0 /* HandArea */).length === min);
            if (targets.length > 0) {
                let toId = targets[0].Id;
                if (targets.length > 1 || handCards.length === min) {
                    const players = targets.map(player => player.Id);
                    const resp = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                        players,
                        toId: event.fromId,
                        requiredAmount: 1,
                        conversation: handCards.length !== min
                            ? 'qingzhong: please choose a target to exchange hand cards'
                            : 'qingzhong: do you want to exchange hand cards?',
                        triggeredBySkills: [this.Name],
                    }, event.fromId, handCards.length !== min);
                    handCards.length !== min &&
                        (resp.selectedPlayers = resp.selectedPlayers || [players[Math.floor(Math.random() * players.length)]]);
                    toId = resp.selectedPlayers && resp.selectedPlayers.length > 0 ? resp.selectedPlayers[0] : event.fromId;
                }
                if (toId !== event.fromId) {
                    const firstCards = room.getPlayerById(event.fromId).getCardIds(0 /* HandArea */).slice();
                    const secondCards = room.getPlayerById(toId).getCardIds(0 /* HandArea */).slice();
                    await room.moveCards({
                        moveReason: 3 /* PassiveMove */,
                        movingCards: firstCards.map(cardId => ({ card: cardId, fromArea: 0 /* HandArea */ })),
                        fromId: event.fromId,
                        toArea: 6 /* ProcessingArea */,
                        proposer: event.fromId,
                        movedByReason: this.Name,
                        engagedPlayerIds: [event.fromId],
                    }, {
                        moveReason: 3 /* PassiveMove */,
                        movingCards: secondCards.map(cardId => ({ card: cardId, fromArea: 0 /* HandArea */ })),
                        fromId: toId,
                        toArea: 6 /* ProcessingArea */,
                        proposer: toId,
                        movedByReason: this.Name,
                        engagedPlayerIds: [toId],
                    });
                    await room.moveCards({
                        moveReason: 3 /* PassiveMove */,
                        movingCards: secondCards.map(cardId => ({ card: cardId, fromArea: 6 /* ProcessingArea */ })),
                        toId: event.fromId,
                        toArea: 0 /* HandArea */,
                        proposer: toId,
                        movedByReason: this.Name,
                        engagedPlayerIds: [event.fromId, toId],
                    }, {
                        moveReason: 3 /* PassiveMove */,
                        movingCards: firstCards.map(cardId => ({ card: cardId, fromArea: 6 /* ProcessingArea */ })),
                        toId,
                        toArea: 0 /* HandArea */,
                        proposer: event.fromId,
                        movedByReason: this.Name,
                        engagedPlayerIds: [event.fromId, toId],
                    });
                }
            }
        }
        return true;
    }
};
QingZhongShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: QingZhong.Name, description: QingZhong.Description })
], QingZhongShadow);
exports.QingZhongShadow = QingZhongShadow;
