"use strict";
var TianSuan_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TianSuanRemove = exports.TianSuanDebuff = exports.TianSuanPower = exports.TianSuan = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let TianSuan = TianSuan_1 = class TianSuan extends skill_1.ActiveSkill {
    async whenDead(room, player) {
        const mappers = player.getFlag(TianSuan_1.TianSuanTargets);
        if (!mappers) {
            return;
        }
        const targets = Object.keys(mappers);
        for (const target of targets) {
            const power = room.getFlag(target, this.GeneralName);
            if (room.getPlayerById(target).Dead || !power) {
                continue;
            }
            for (const gift of mappers[target]) {
                const index = power.findIndex(p => p === gift);
                index !== -1 && power.splice(index, 1);
            }
            if (power.length === 0) {
                room.removeFlag(target, this.GeneralName);
                if (room.getPlayerById(target).hasSkill(TianSuanPower.Name)) {
                    await room.loseSkill(target, TianSuanPower.Name);
                }
                if (room.getPlayerById(target).hasSkill(TianSuanDebuff.Name)) {
                    await room.loseSkill(target, TianSuanDebuff.Name);
                }
                continue;
            }
            if (!power.includes(TianSuan_1.TianSuanStricks[4]) && room.getPlayerById(target).hasSkill(TianSuanDebuff.Name)) {
                await room.loseSkill(target, TianSuanDebuff.Name);
            }
            const texts = power.reduce((stringList, power) => {
                if (!stringList.includes(power)) {
                    stringList.push(power);
                }
                return stringList;
            }, []);
            let originalText = '{0}[';
            for (let i = 1; i <= texts.length; i++) {
                originalText = originalText + '{' + i + '}';
            }
            room.setFlag(target, this.GeneralName, power, translation_json_tool_1.TranslationPack.translationJsonPatcher(originalText + ']', ...texts).toString());
        }
        player.removeFlag(TianSuan_1.TianSuanTargets);
    }
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    numberOfTargets() {
        return 0;
    }
    isAvailableTarget(owner, room, target) {
        return false;
    }
    isAvailableCard() {
        return false;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const options = TianSuan_1.TianSuanStricks;
        const { selectedOption } = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to add a stick?', this.Name).extract(),
            toId: fromId,
            triggeredBySkills: [this.Name],
        }, fromId);
        selectedOption && options.push(selectedOption);
        const result = options[Math.floor(Math.random() * options.length)];
        const players = room.getAlivePlayersFrom().map(player => player.Id);
        const response = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
            players,
            toId: fromId,
            requiredAmount: 1,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: the result is {1}, please choose a target', this.Name, result).extract(),
            triggeredBySkills: [this.Name],
        }, fromId, true);
        response.selectedPlayers = response.selectedPlayers || [players[0]];
        const originalPower = room.getFlag(response.selectedPlayers[0], this.Name) || [];
        const originalTargets = room.getFlag(fromId, TianSuan_1.TianSuanTargets) || {};
        if (!originalTargets[response.selectedPlayers[0]] ||
            (originalTargets[response.selectedPlayers[0]] && !originalTargets[response.selectedPlayers[0]].includes(result))) {
            originalPower.push(result);
            const texts = originalPower.reduce((stringList, power) => {
                if (!stringList.includes(power)) {
                    stringList.push(power);
                }
                return stringList;
            }, []);
            let originalText = '{0}[';
            for (let i = 1; i <= texts.length; i++) {
                originalText = originalText + '{' + i + '}';
            }
            room.setFlag(response.selectedPlayers[0], this.Name, originalPower, translation_json_tool_1.TranslationPack.translationJsonPatcher(originalText + ']', this.Name, ...texts).toString());
            if (!room.getPlayerById(response.selectedPlayers[0]).hasSkill(TianSuanPower.Name)) {
                await room.obtainSkill(response.selectedPlayers[0], TianSuanPower.Name);
            }
            if (result === TianSuan_1.TianSuanStricks[4] &&
                !room.getPlayerById(response.selectedPlayers[0]).hasSkill(TianSuanDebuff.Name)) {
                await room.obtainSkill(response.selectedPlayers[0], TianSuanDebuff.Name);
            }
            const target = room.getPlayerById(response.selectedPlayers[0]);
            if ((result === TianSuan_1.TianSuanStricks[0] || result === TianSuan_1.TianSuanStricks[1]) &&
                target.getCardIds().length > 0 &&
                !(fromId === response.selectedPlayers[0] &&
                    target.getCardIds(1 /* EquipArea */).length === 0 &&
                    target.getCardIds(2 /* JudgeArea */).length === 0)) {
                const options = {
                    [2 /* JudgeArea */]: target.getCardIds(2 /* JudgeArea */),
                    [1 /* EquipArea */]: target.getCardIds(1 /* EquipArea */),
                };
                if (fromId !== response.selectedPlayers[0]) {
                    options[0 /* HandArea */] =
                        result === TianSuan_1.TianSuanStricks[0]
                            ? target.getCardIds(0 /* HandArea */)
                            : target.getCardIds(0 /* HandArea */).length;
                }
                const chooseCardEvent = event_packer_1.EventPacker.createUncancellableEvent({
                    fromId,
                    toId: response.selectedPlayers[0],
                    options,
                    triggeredBySkills: [this.Name],
                });
                const resp = await room.doAskForCommonly(170 /* AskForChoosingCardFromPlayerEvent */, chooseCardEvent, fromId);
                if (resp.selectedCardIndex !== undefined) {
                    const cardIds = target.getCardIds(0 /* HandArea */);
                    resp.selectedCard = cardIds[Math.floor(Math.random() * cardIds.length)];
                }
                else if (resp.selectedCard === undefined) {
                    const cardIds = target.getCardIds();
                    resp.selectedCard = cardIds[Math.floor(Math.random() * cardIds.length)];
                }
                await room.moveCards({
                    movingCards: [{ card: resp.selectedCard, fromArea: target.cardFrom(resp.selectedCard) }],
                    fromId: response.selectedPlayers[0],
                    toId: fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 1 /* ActivePrey */,
                    proposer: fromId,
                    triggeredBySkills: [this.Name],
                });
            }
        }
        if (originalTargets[response.selectedPlayers[0]] &&
            !originalTargets[response.selectedPlayers[0]].includes(result)) {
            originalTargets[response.selectedPlayers[0]].push(result);
        }
        else if (!originalTargets[response.selectedPlayers[0]]) {
            originalTargets[response.selectedPlayers[0]] = [result];
        }
        room.getPlayerById(fromId).setFlag(TianSuan_1.TianSuanTargets, originalTargets);
        return true;
    }
};
TianSuan.TianSuanStricks = [
    'tiansuan:upup',
    'tiansuan:up',
    'tiansuan:mid',
    'tiansuan:down',
    'tiansuan:downdown',
];
TianSuan.TianSuanTargets = 'tiansuan_targets';
TianSuan = TianSuan_1 = tslib_1.__decorate([
    skill_1.CircleSkill,
    skill_1.CommonSkill({ name: 'tiansuan', description: 'tiansuan_description' })
], TianSuan);
exports.TianSuan = TianSuan;
let TianSuanPower = class TianSuanPower extends skill_1.TriggerSkill {
    async whenDead(room, player) {
        if (!player.getFlag(TianSuan.Name)) {
            return;
        }
        room.removeFlag(player.Id, TianSuan.Name);
        for (const p of room.getAlivePlayersFrom()) {
            const targets = p.getFlag(TianSuan.TianSuanTargets);
            if (targets && targets[player.Id]) {
                if (Object.keys(targets).length === 1) {
                    p.removeFlag(TianSuan.TianSuanTargets);
                }
                else {
                    delete targets[player.Id];
                    p.setFlag(TianSuan.TianSuanTargets, targets);
                }
            }
        }
        await room.loseSkill(player.Id, this.Name);
        player.hasSkill(TianSuanDebuff.Name) && (await room.loseSkill(player.Id, TianSuanDebuff.Name));
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "DamagedEffect" /* DamagedEffect */ || stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content, stage) {
        const power = owner.getFlag(TianSuan.Name);
        if (!power || !stage) {
            return false;
        }
        const canUse = content.toId === owner.Id &&
            !(stage === "DamagedEffect" /* DamagedEffect */ && power.includes(TianSuan.TianSuanStricks[1]) && content.damage < 2);
        if (canUse) {
            owner.setFlag(this.Name, stage);
        }
        return canUse;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const damageEvent = triggeredOnEvent;
        const power = room.getFlag(fromId, TianSuan.Name);
        const stage = room.getFlag(fromId, this.Name);
        if (stage === "DamagedEffect" /* DamagedEffect */) {
            if (power.includes(TianSuan.TianSuanStricks[0])) {
                damageEvent.damage = 0;
                event_packer_1.EventPacker.terminate(damageEvent);
                return true;
            }
            if (power.includes(TianSuan.TianSuanStricks[2])) {
                damageEvent.damageType = "fire_property" /* Fire */;
                damageEvent.damage = 1;
            }
            power.includes(TianSuan.TianSuanStricks[3]) && damageEvent.damage++;
            if (power.includes(TianSuan.TianSuanStricks[1])) {
                damageEvent.damage = 1;
            }
            power.includes(TianSuan.TianSuanStricks[4]) && damageEvent.damage++;
        }
        else if (power.includes(TianSuan.TianSuanStricks[1])) {
            await room.drawCards(damageEvent.damage, fromId, 'top', fromId, this.Name);
        }
        return true;
    }
};
TianSuanPower = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: 'shadow_tiansuan', description: 'shadow_tiansuan_description' })
], TianSuanPower);
exports.TianSuanPower = TianSuanPower;
let TianSuanDebuff = class TianSuanDebuff extends skill_1.FilterSkill {
    canUseCard(cardId, room, owner, onResponse, isCardResponse) {
        if (!(room.getFlag(owner, TianSuan.Name) || []).includes(TianSuan.TianSuanStricks[4]) || isCardResponse) {
            return true;
        }
        return cardId instanceof card_matcher_1.CardMatcher
            ? !cardId.match(new card_matcher_1.CardMatcher({ generalName: ['peach', 'alcohol'] }))
            : engine_1.Sanguosha.getCardById(cardId).GeneralName !== 'peach' &&
                engine_1.Sanguosha.getCardById(cardId).GeneralName !== 'alcohol';
    }
};
TianSuanDebuff = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: TianSuanPower.Name, description: TianSuanPower.Description })
], TianSuanDebuff);
exports.TianSuanDebuff = TianSuanDebuff;
let TianSuanRemove = class TianSuanRemove extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return (room.CurrentPlayer === room.getPlayerById(owner) &&
            room.CurrentPlayerPhase === 0 /* PhaseBegin */ &&
            stage === "AfterPhaseChanged" /* AfterPhaseChanged */);
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
        return (owner.Id === event.toPlayer &&
            event.to === 0 /* PhaseBegin */ &&
            owner.getFlag(TianSuan.TianSuanTargets) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const mappers = room.getFlag(fromId, TianSuan.TianSuanTargets);
        const targets = Object.keys(mappers);
        for (const target of targets) {
            const power = room.getFlag(target, this.GeneralName);
            if (room.getPlayerById(target).Dead || !power) {
                continue;
            }
            for (const gift of mappers[target]) {
                const index = power.findIndex(p => p === gift);
                index !== -1 && power.splice(index, 1);
            }
            if (power.length === 0) {
                room.removeFlag(target, this.GeneralName);
                if (room.getPlayerById(target).hasSkill(TianSuanPower.Name)) {
                    await room.loseSkill(target, TianSuanPower.Name);
                }
                if (room.getPlayerById(target).hasSkill(TianSuanDebuff.Name)) {
                    await room.loseSkill(target, TianSuanDebuff.Name);
                }
                continue;
            }
            if (!power.includes(TianSuan.TianSuanStricks[4]) && room.getPlayerById(target).hasSkill(TianSuanDebuff.Name)) {
                await room.loseSkill(target, TianSuanDebuff.Name);
            }
            const texts = power.reduce((stringList, power) => {
                if (!stringList.includes(power)) {
                    stringList.push(power);
                }
                return stringList;
            }, []);
            let originalText = '{0}[';
            for (let i = 1; i <= texts.length; i++) {
                originalText = originalText + '{' + i + '}';
            }
            room.setFlag(target, this.GeneralName, power, translation_json_tool_1.TranslationPack.translationJsonPatcher(originalText + ']', this.GeneralName, ...texts).toString());
        }
        room.getPlayerById(fromId).removeFlag(TianSuan.TianSuanTargets);
        return true;
    }
};
TianSuanRemove = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: TianSuan.Name, description: TianSuan.Description })
], TianSuanRemove);
exports.TianSuanRemove = TianSuanRemove;
