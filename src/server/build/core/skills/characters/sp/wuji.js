"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WuJi = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const qinglongdao_1 = require("core/cards/standard/qinglongdao");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const huxiao_1 = require("./huxiao");
let WuJi = class WuJi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 19 /* FinishStageStart */ &&
            room.enableToAwaken(this.Name, owner));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.changeMaxHp(event.fromId, 1);
        await room.recover({
            toId: event.fromId,
            recoveredHp: 1,
            recoverBy: event.fromId,
        });
        await room.loseSkill(event.fromId, huxiao_1.HuXiao.Name, true);
        if (room
            .getPlayerById(event.fromId)
            .getCardIds(0 /* HandArea */)
            .find(cardId => engine_1.Sanguosha.getCardById(cardId).Name === qinglongdao_1.QingLongYanYueDao.name)) {
            return true;
        }
        let qinglongdao = [];
        let fromArea;
        let fromId;
        for (const player of room.AlivePlayers) {
            let currentQinglong;
            currentQinglong = player
                .getCardIds(1 /* EquipArea */)
                .find(cardId => engine_1.Sanguosha.getCardById(cardId).Name === qinglongdao_1.QingLongYanYueDao.name);
            if (currentQinglong) {
                fromArea = 1 /* EquipArea */;
            }
            else {
                if (player.getCardIds(2 /* JudgeArea */).length === 0) {
                    continue;
                }
                const actualCards = player
                    .getCardIds(2 /* JudgeArea */)
                    .reduce((cardIds, cardId) => cardIds.concat(...card_1.VirtualCard.getActualCards([cardId])), []);
                currentQinglong = actualCards.find(cardId => engine_1.Sanguosha.getCardById(cardId).Name === qinglongdao_1.QingLongYanYueDao.name);
                if (currentQinglong) {
                    fromArea = 2 /* JudgeArea */;
                }
            }
            if (currentQinglong) {
                qinglongdao = [currentQinglong];
                fromId = player.Id;
                break;
            }
        }
        if (qinglongdao.length === 0) {
            qinglongdao = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ name: [qinglongdao_1.QingLongYanYueDao.name] }));
            if (qinglongdao.length === 0) {
                qinglongdao = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ name: [qinglongdao_1.QingLongYanYueDao.name] }), false);
                qinglongdao.length > 0 && (fromArea = 4 /* DropStack */);
            }
            else {
                fromArea = 5 /* DrawStack */;
            }
        }
        qinglongdao.length > 0 &&
            fromArea !== undefined &&
            (await room.moveCards({
                movingCards: [{ card: qinglongdao[0], fromArea }],
                fromId,
                toId: event.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: event.fromId,
                triggeredBySkills: [this.Name],
            }));
        return true;
    }
};
WuJi = tslib_1.__decorate([
    skill_wrappers_1.AwakeningSkill({ name: 'wuji', description: 'wuji_description' })
], WuJi);
exports.WuJi = WuJi;
