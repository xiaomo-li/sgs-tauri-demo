"use strict";
var YuYun_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.YuYunShadow = exports.YuYunBuff = exports.YuYun = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YuYun = YuYun_1 = class YuYun extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 13 /* PlayCardStageStart */ &&
            (owner.Hp > 1 || owner.MaxHp > 1));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const options = ['yuyun:loseMaxHp'];
        room.getPlayerById(fromId).Hp > 1 && options.unshift('yuyun:loseHp');
        let selectedOption = options[0];
        if (options.length === 2) {
            const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                options,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose yuyun options', this.Name).extract(),
                toId: fromId,
                triggeredBySkills: [this.Name],
            }, fromId);
            selectedOption = response.selectedOption || selectedOption;
        }
        if (selectedOption === 'yuyun:loseMaxHp') {
            await room.changeMaxHp(fromId, -1);
        }
        else {
            await room.loseHp(fromId, 1);
        }
        const chosenOptions = [];
        for (let i = 0; i < room.getPlayerById(fromId).LostHp + 1; i++) {
            let secOptions = ['yuyun:draw2', 'yuyun:damage', 'yuyun:unlimited'];
            room.getOtherPlayers(fromId).find(player => player.getCardIds().length > 0) && secOptions.push('yuyun:prey');
            room
                .getOtherPlayers(fromId)
                .find(player => player.getCardIds(0 /* HandArea */).length < Math.min(player.MaxHp, 5)) &&
                secOptions.push('yuyun:letDraw');
            secOptions = secOptions.filter(option => !chosenOptions.includes(option));
            if (secOptions.length === 0) {
                break;
            }
            const resp = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                options: secOptions,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose yuyun_sec options: {1}', this.Name, room.getPlayerById(fromId).LostHp + 1 - i).extract(),
                toId: fromId,
                triggeredBySkills: [this.Name],
            }, fromId, i === 0);
            i === 0 && (resp.selectedOption = resp.selectedOption || secOptions[0]);
            if (!resp.selectedOption) {
                break;
            }
            chosenOptions.push(resp.selectedOption);
            if (resp.selectedOption === 'yuyun:draw2') {
                await room.drawCards(2, fromId, 'top', fromId, this.Name);
            }
            else if (resp.selectedOption === 'yuyun:unlimited') {
                room.setFlag(fromId, this.Name, true);
            }
            else {
                let targets = room.getOtherPlayers(fromId);
                if (resp.selectedOption === 'yuyun:discard') {
                    targets = targets.filter(player => player.getCardIds().length > 0);
                }
                else if (resp.selectedOption === 'yuyun:letDraw') {
                    targets = room.AlivePlayers.filter(player => player.getCardIds(0 /* HandArea */).length < player.MaxHp);
                }
                const resp2 = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                    players: targets.map(player => player.Id),
                    toId: fromId,
                    requiredAmount: 1,
                    conversation: 'yuyun: please choose a target',
                    triggeredBySkills: [this.Name],
                }, fromId, true);
                resp2.selectedPlayers = resp2.selectedPlayers || [targets[0].Id];
                if (resp.selectedOption === 'yuyun:damage') {
                    await room.damage({
                        fromId,
                        toId: resp2.selectedPlayers[0],
                        damage: 1,
                        damageType: "normal_property" /* Normal */,
                        triggeredBySkills: [this.Name],
                    });
                    const originalTargets = room.getFlag(fromId, YuYun_1.YuYunTargets) || [];
                    originalTargets.push(resp2.selectedPlayers[0]);
                    room.setFlag(fromId, YuYun_1.YuYunTargets, originalTargets);
                }
                else if (resp.selectedOption === 'yuyun:prey') {
                    const to = room.getPlayerById(resp2.selectedPlayers[0]);
                    const options = {
                        [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
                        [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
                        [2 /* JudgeArea */]: to.getCardIds(2 /* JudgeArea */),
                    };
                    const chooseCardEvent = {
                        fromId,
                        toId: resp2.selectedPlayers[0],
                        options,
                        triggeredBySkills: [this.Name],
                    };
                    const response = await room.askForChoosingPlayerCard(chooseCardEvent, fromId, false, true);
                    if (!response) {
                        return false;
                    }
                    await room.moveCards({
                        movingCards: [{ card: response.selectedCard, fromArea: response.fromArea }],
                        fromId: resp2.selectedPlayers[0],
                        toId: fromId,
                        toArea: 0 /* HandArea */,
                        moveReason: 1 /* ActivePrey */,
                        proposer: fromId,
                        triggeredBySkills: [this.Name],
                    });
                }
                else {
                    const to = room.getPlayerById(resp2.selectedPlayers[0]);
                    await room.drawCards(Math.min(to.MaxHp, 5) - to.getCardIds(0 /* HandArea */).length, resp2.selectedPlayers[0], 'top', resp2.selectedPlayers[0], this.Name);
                }
            }
        }
        return true;
    }
};
YuYun.YuYunTargets = 'yuyun_targets';
YuYun = YuYun_1 = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'yuyun', description: 'yuyun_description' })
], YuYun);
exports.YuYun = YuYun;
let YuYunBuff = class YuYunBuff extends skill_1.RulesBreakerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    breakBaseCardHoldNumber(room, owner) {
        return owner.getFlag(this.GeneralName) ? 1000 : -1;
    }
    breakCardUsableDistanceTo(cardId, room, owner, target) {
        var _a;
        if (!((_a = owner.getFlag(YuYun.YuYunTargets)) === null || _a === void 0 ? void 0 : _a.includes(target.Id))) {
            return 0;
        }
        let match = false;
        if (cardId instanceof card_matcher_1.CardMatcher) {
            match = cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] }));
        }
        else {
            match = cardId !== undefined && engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash';
        }
        if (match) {
            return game_props_1.INFINITE_DISTANCE;
        }
        else {
            return 0;
        }
    }
    breakCardUsableTimesTo(cardId, room, owner, target) {
        var _a;
        if (!((_a = owner.getFlag(YuYun.YuYunTargets)) === null || _a === void 0 ? void 0 : _a.includes(target.Id))) {
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
            return game_props_1.INFINITE_TRIGGERING_TIMES;
        }
        else {
            return 0;
        }
    }
};
YuYunBuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: YuYun.Name, description: YuYun.Description })
], YuYunBuff);
exports.YuYunBuff = YuYunBuff;
let YuYunShadow = class YuYunShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        return (owner.Id === event.fromPlayer &&
            event.from === 7 /* PhaseFinish */ &&
            (owner.getFlag(this.GeneralName) !== undefined ||
                owner.getFlag(YuYun.YuYunTargets) !== undefined));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, this.GeneralName);
        room.removeFlag(event.fromId, YuYun.YuYunTargets);
        return true;
    }
};
YuYunShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: YuYunBuff.Name, description: YuYunBuff.Description })
], YuYunShadow);
exports.YuYunShadow = YuYunShadow;
