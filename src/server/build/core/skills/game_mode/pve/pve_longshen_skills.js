"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PveLongShenBiBao = exports.PveLongShenLiGe = exports.PveLongShenChaiYue = exports.PveLongShenLongGu = exports.PveLongShenLongXiao = exports.PveLongShenLongEn = exports.PveLongShenLongWei = exports.PveLongShenLongHou = exports.PveLongShenQinLv = exports.PveLongShenLonglie = exports.PveLongShenLongLi = exports.PveLongShenLongShi = exports.PveLongShenRuiYan = exports.PveLongShenLongNing = exports.PveLongShenLongLing = exports.PveLongShenLongLin = exports.PveLongShenSuWei = exports.PveLongShenChouXin = exports.PveLongShenZiYu = exports.PveLongShenQiFuReward = exports.PveLongShenQiFu = exports.pveLongShenSkills = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const algorithm_1 = require("core/shares/libs/algorithm");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
exports.pveLongShenSkills = [
    { name: 'pve_longshen_ziyu', weights: 2 },
    { name: 'pve_longshen_chouxin', weights: 2 },
    { name: 'pve_longshen_suwei', weights: 2 },
    { name: 'pve_longshen_longlin', weights: 2 },
    { name: 'pve_longshen_longling', weights: 1 },
    { name: 'pve_longshen_longning', weights: 2 },
    { name: 'pve_longshen_ruiyan', weights: 1 },
    { name: 'pve_longshen_longshi', weights: 3 },
    { name: 'pve_longshen_longli', weights: 1 },
    { name: 'pve_longshen_longlie', weights: 1 },
    { name: 'pve_longshen_qinlv', weights: 2 },
    { name: 'pve_longshen_longhou', weights: 3 },
    { name: 'pve_longshen_longwei', weights: 3 },
    { name: 'pve_longshen_longen', weights: 3 },
    { name: 'pve_longshen_longxiao', weights: 1 },
    { name: 'pve_longshen_longgu', weights: 1 },
    { name: 'pve_longshen_chaiyue', weights: 1 },
    { name: 'pve_longshen_lige', weights: 1 },
    { name: 'pve_longshen_bibao', weights: 1 },
];
let PveLongShenQiFu = class PveLongShenQiFu extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    async whenLosingSkill(room) {
        room.uninstallSideEffectSkill(7 /* PveLongShenQiFu */);
    }
    async whenObtainingSkill(room, owner) {
        room.installSideEffectSkill(7 /* PveLongShenQiFu */, PveLongShenQiFuReward.Name, owner.Id);
    }
    isTriggerable(_, stage) {
        return stage === "LevelBegining" /* LevelBegining */;
    }
    canUse() {
        return true;
    }
    async onTrigger(_, event) {
        event.translationsMessage = undefined;
        return true;
    }
    async onEffect(room, event) {
        room.installSideEffectSkill(7 /* PveLongShenQiFu */, PveLongShenQiFuReward.Name, event.fromId);
        room.getOtherPlayers(event.fromId).forEach(player => {
            room.refreshPlayerOnceSkill(player.Id, PveLongShenQiFuReward.Name);
        });
        return true;
    }
};
PveLongShenQiFu = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'pve_longshen_qifu', description: 'pve_longshen_qifu_description' })
], PveLongShenQiFu);
exports.PveLongShenQiFu = PveLongShenQiFu;
let PveLongShenQiFuReward = class PveLongShenQiFuReward extends skill_1.ActiveSkill {
    canUse() {
        return true;
    }
    numberOfTargets() {
        return 0;
    }
    cardFilter(_, __, cards) {
        return cards.length === 0;
    }
    isAvailableTarget() {
        return false;
    }
    isAvailableCard() {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const skills = room
            .getPlayerById(event.fromId)
            .getPlayerSkills()
            .filter(skill => !skill.isShadowSkill());
        if (skills.length >= 5) {
            const askForChoosingOptionsEvent = {
                options: skills.map(skill => skill.Name),
                toId: event.fromId,
                conversation: 'Please drop a skill',
                triggeredBySkills: [this.Name],
            };
            room.notify(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForChoosingOptionsEvent), event.fromId);
            const chooseResp = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, event.fromId);
            room.loseSkill(event.fromId, chooseResp.selectedOption);
        }
        const characters = room.getRandomCharactersFromLoadedPackage(5);
        room.notify(169 /* AskForChoosingCharacterEvent */, {
            amount: 1,
            characterIds: characters,
            toId: event.fromId,
            byHuaShen: true,
            triggeredBySkills: [this.Name],
            conversation: 'Please choose a character to get a skill',
        }, event.fromId);
        const { chosenCharacterIds } = await room.onReceivingAsyncResponseFrom(169 /* AskForChoosingCharacterEvent */, event.fromId);
        const options = engine_1.Sanguosha.getCharacterById(chosenCharacterIds[0])
            .Skills.filter(skill => !(skill.isShadowSkill() || skill.isLordSkill()))
            .map(skill => skill.GeneralName);
        const askForChoosingOptionsEvent = {
            options,
            toId: event.fromId,
            conversation: 'Please announce a skill',
            triggeredBySkills: [this.Name],
        };
        room.notify(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForChoosingOptionsEvent), event.fromId);
        const chooseResp = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, event.fromId);
        room.obtainSkill(event.fromId, chooseResp.selectedOption);
        return true;
    }
};
PveLongShenQiFuReward = tslib_1.__decorate([
    skill_wrappers_1.SideEffectSkill,
    skill_wrappers_1.LimitSkill({ name: 'pve_longshen_qifu', description: 'pve_longshen_qifu_description' })
], PveLongShenQiFuReward);
exports.PveLongShenQiFuReward = PveLongShenQiFuReward;
let PveLongShenZiYu = class PveLongShenZiYu extends skill_1.TriggerSkill {
    isTriggerable(_, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(_, owner, content) {
        return (owner.Id === content.playerId && 3 /* PrepareStageStart */ === content.toStage && owner.isInjured());
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, content) {
        const owner = room.getPlayerById(content.fromId);
        await room.recover({
            recoveredHp: Math.ceil((owner.MaxHp - owner.Hp) / 2),
            recoverBy: owner.Id,
            toId: owner.Id,
        });
        return true;
    }
};
PveLongShenZiYu = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'pve_longshen_ziyu', description: 'pve_longshen_ziyu_description' })
], PveLongShenZiYu);
exports.PveLongShenZiYu = PveLongShenZiYu;
let PveLongShenChouXin = class PveLongShenChouXin extends skill_1.TriggerSkill {
    isTriggerable(_, stage) {
        return stage === "AfterDrawCardEffect" /* AfterDrawCardEffect */;
    }
    canUse(room, owner, content) {
        return (content.fromId === room.CurrentPhasePlayer.Id &&
            room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
            content.fromId !== owner.Id);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, content) {
        const target = room.CurrentPhasePlayer;
        const card = target.getPlayerCards()[Math.floor(target.getPlayerCards().length * Math.random())];
        await room.moveCards({
            movingCards: [{ card }],
            fromId: target.Id,
            toId: content.fromId,
            moveReason: 1 /* ActivePrey */,
            toArea: 0 /* HandArea */,
            movedByReason: this.Name,
        });
        return true;
    }
};
PveLongShenChouXin = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'pve_longshen_chouxin', description: 'pve_longshen_chouxin_description' })
], PveLongShenChouXin);
exports.PveLongShenChouXin = PveLongShenChouXin;
let PveLongShenSuWei = class PveLongShenSuWei extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterAimmed" /* AfterAimmed */ && event.byCardId !== undefined;
    }
    canUse(_, owner, event) {
        return event.toId === owner.Id && event.fromId !== owner.Id;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, toId } = skillUseEvent.triggeredOnEvent;
        const attacker = room.getPlayerById(fromId);
        await room.drawCards(1, toId, 'top', toId, this.Name);
        if (room.getPlayerById(fromId).getPlayerCards().length > 0) {
            const askForChooseCardEvent = {
                options: {
                    [1 /* EquipArea */]: attacker.getCardIds(1 /* EquipArea */),
                    [0 /* HandArea */]: attacker.getCardIds(0 /* HandArea */).length,
                },
                fromId: toId,
                toId: fromId,
                triggeredBySkills: [this.Name],
            };
            room.notify(170 /* AskForChoosingCardFromPlayerEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForChooseCardEvent), toId);
            const response = await room.onReceivingAsyncResponseFrom(170 /* AskForChoosingCardFromPlayerEvent */, toId);
            if (response.selectedCardIndex !== undefined) {
                const cardIds = attacker.getCardIds(0 /* HandArea */);
                response.selectedCard = cardIds[Math.floor(Math.random() * cardIds.length)];
            }
            else if (response.selectedCard === undefined) {
                const cardIds = attacker.getPlayerCards();
                response.selectedCard = cardIds[Math.floor(Math.random() * cardIds.length)];
            }
            if (response.selectedCard !== undefined) {
                await room.dropCards(5 /* PassiveDrop */, [response.selectedCard], fromId, toId, this.Name);
            }
        }
        return true;
    }
};
PveLongShenSuWei = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'pve_longshen_suwei', description: 'pve_longshen_suwei_description' })
], PveLongShenSuWei);
exports.PveLongShenSuWei = PveLongShenSuWei;
let PveLongShenLongLin = class PveLongShenLongLin extends skill_1.TriggerSkill {
    isTriggerable(_, stage) {
        return stage === "CardUsing" /* CardUsing */;
    }
    canUse(_, owner, event) {
        if (event.fromId !== owner.Id) {
            return false;
        }
        const card = engine_1.Sanguosha.getCardById(event.cardId);
        return card.BaseType === 1 /* Equip */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (room.getPlayerById(event.fromId).isInjured()) {
            await room.recover({ recoverBy: event.fromId, recoveredHp: 1, toId: event.fromId });
            await room.drawCards(2, event.fromId, 'top', event.fromId, this.Name);
        }
        else {
            await room.changeMaxHp(event.fromId, 1);
            await room.drawCards(3, event.fromId, 'top', event.fromId, this.Name);
        }
        return true;
    }
};
PveLongShenLongLin = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'pve_longshen_longlin', description: 'pve_longshen_longlin_description' })
], PveLongShenLongLin);
exports.PveLongShenLongLin = PveLongShenLongLin;
let PveLongShenLongLing = class PveLongShenLongLing extends skill_1.TriggerSkill {
    isTriggerable(_, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(_, owner, event) {
        return owner.Id === event.playerId && event.toStage === 3 /* PrepareStageStart */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const owner = room.getPlayerById(event.fromId);
        let extraDrawCardsNum = 0;
        for (const cardType of [2 /* Weapon */, 3 /* Shield */, 6 /* Precious */]) {
            if (owner.getEquipment(cardType) === undefined) {
                extraDrawCardsNum++;
            }
        }
        await room.drawCards(extraDrawCardsNum, owner.Id);
        return true;
    }
};
PveLongShenLongLing = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'pve_longshen_longling', description: 'pve_longshen_longling_description' })
], PveLongShenLongLing);
exports.PveLongShenLongLing = PveLongShenLongLing;
let PveLongShenLongNing = class PveLongShenLongNing extends skill_1.TriggerSkill {
    isTriggerable(_, stage) {
        return stage === "CardDrawing" /* CardDrawing */;
    }
    canUse(_, owner, event) {
        return owner.Id === event.fromId;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const extraDrawNum = room
            .getPlayerById(event.fromId)
            .getCardIds(1 /* EquipArea */)
            .reduce((allSuits, cardId) => {
            const card = engine_1.Sanguosha.getCardById(cardId);
            if (!allSuits.includes(card.Suit) && card.Suit !== 0 /* NoSuit */) {
                allSuits.push(card.Suit);
            }
            return allSuits;
        }, []).length;
        if (extraDrawNum !== 0) {
            const drawCardEvent = event.triggeredOnEvent;
            drawCardEvent.drawAmount += extraDrawNum;
        }
        return true;
    }
};
PveLongShenLongNing = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'pve_longshen_longning', description: 'pve_longshen_longning_description' })
], PveLongShenLongNing);
exports.PveLongShenLongNing = PveLongShenLongNing;
let PveLongShenRuiYan = class PveLongShenRuiYan extends skill_1.TriggerSkill {
    isTriggerable(_, stage) {
        return stage === "BeforeStageChange" /* BeforeStageChange */;
    }
    canUse(_, owner, content) {
        return (owner.Id === content.playerId &&
            (content.toStage === 19 /* FinishStageStart */ ||
                content.toStage === 3 /* PrepareStageStart */));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        await room.drawCards(room.getAlivePlayersFrom().length - 1, skillUseEvent.fromId, 'top', skillUseEvent.fromId, this.Name);
        return true;
    }
};
PveLongShenRuiYan = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'pve_longshen_ruiyan', description: 'pve_longshen_ruiyan_description' })
], PveLongShenRuiYan);
exports.PveLongShenRuiYan = PveLongShenRuiYan;
let PveLongShenLongShi = class PveLongShenLongShi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ && event.toStage === 4 /* PrepareStage */;
    }
    canUse(_, owner, event) {
        return owner.Id === event.playerId;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const fromId = skillUseEvent.fromId;
        const targetPlayers = room.AlivePlayers.filter(player => player.Id !== fromId);
        for (const target of targetPlayers) {
            const allCards = target.getPlayerCards();
            algorithm_1.Algorithm.shuffle(allCards);
            const dropCards = allCards.slice(0, 3);
            await room.dropCards(5 /* PassiveDrop */, dropCards, target.Id, fromId, this.Name);
            if (dropCards.length < 3) {
                const slash = card_1.VirtualCard.create({ cardName: 'fire_slash', bySkill: this.Name }).Id;
                const slashUseEvent = { fromId, cardId: slash, targetGroup: [[target.Id]] };
                await room.useCard(slashUseEvent);
            }
        }
        return true;
    }
};
PveLongShenLongShi = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'pve_longshen_longshi', description: 'pve_longshen_longshi_description' })
], PveLongShenLongShi);
exports.PveLongShenLongShi = PveLongShenLongShi;
let PveLongShenLongLi = class PveLongShenLongLi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterAim" /* AfterAim */ && event.byCardId !== undefined;
    }
    canUse(_, owner, event) {
        return owner.Id === event.fromId;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(_, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const aimEvent = triggeredOnEvent;
        event_packer_1.EventPacker.setDisresponsiveEvent(aimEvent);
        return true;
    }
};
PveLongShenLongLi = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'pve_longshen_longli', description: 'pve_longshen_longli_description' })
], PveLongShenLongLi);
exports.PveLongShenLongLi = PveLongShenLongLi;
let PveLongShenLonglie = class PveLongShenLonglie extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "DamageEffect" /* DamageEffect */ && !event.isFromChainedDamage;
    }
    canUse(_, owner, event) {
        return event.fromId === owner.Id;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const damageEvent = event.triggeredOnEvent;
        damageEvent.damage++;
        damageEvent.messages = damageEvent.messages || [];
        damageEvent.messages.push(translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}, damage increases to {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(damageEvent.fromId)), this.Name, damageEvent.damage).toString());
        return true;
    }
};
PveLongShenLonglie = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'pve_longshen_longlie', description: 'pve_longshen_longlie_description' })
], PveLongShenLonglie);
exports.PveLongShenLonglie = PveLongShenLonglie;
let PveLongShenQinLv = class PveLongShenQinLv extends skill_1.TriggerSkill {
    isTriggerable(_, stage) {
        return stage === "BeforeStageChange" /* BeforeStageChange */;
    }
    canUse(_, _a, content) {
        return content.toStage === 19 /* FinishStageStart */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const owner = room.getPlayerById(event.fromId);
        await room.recover({ recoveredHp: 1, recoverBy: owner.Id, toId: owner.Id });
        if (owner.isInjured()) {
            await room.drawCards(owner.MaxHp - owner.Hp, owner.Id, 'top', owner.Id, this.Name);
        }
        return true;
    }
};
PveLongShenQinLv = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'pve_longshen_qinlv', description: 'pve_longshen_qinlv_description' })
], PveLongShenQinLv);
exports.PveLongShenQinLv = PveLongShenQinLv;
let PveLongShenLongHou = class PveLongShenLongHou extends skill_1.TriggerSkill {
    isRefreshAt(_, __, stage) {
        return stage === 0 /* PhaseBegin */;
    }
    isTriggerable(_, stage) {
        return stage === "AfterAim" /* AfterAim */;
    }
    canUse(_, owner, event) {
        return (owner.Id === event.fromId &&
            owner.hasUsedSkillTimes(this.Name) < 3 &&
            event.byCardId !== undefined &&
            event.toId !== owner.Id);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const aimEvent = triggeredOnEvent;
        const target = room.getPlayerById(aimEvent.toId);
        if (target.isInjured()) {
            await room.damage({
                fromId,
                toId: target.Id,
                damage: target.LostHp,
                damageType: "normal_property" /* Normal */,
                triggeredBySkills: [this.Name],
            });
        }
        await room.changeMaxHp(target.Id, 1);
        return true;
    }
};
PveLongShenLongHou = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'pve_longshen_longhou', description: 'pve_longshen_longhou_description' })
], PveLongShenLongHou);
exports.PveLongShenLongHou = PveLongShenLongHou;
let PveLongShenLongWei = class PveLongShenLongWei extends skill_1.TriggerSkill {
    isRefreshAt(_, __, stage) {
        return stage === 0 /* PhaseBegin */;
    }
    isTriggerable(_, stage) {
        return stage === "PreCardEffect" /* PreCardEffect */;
    }
    canUse(room, owner, _) {
        return room.CurrentPlayer !== owner && owner.hasUsedSkillTimes(this.Name) < 3;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(_, skillUseEvent) {
        var _b;
        const { triggeredOnEvent } = skillUseEvent;
        const event = triggeredOnEvent;
        (_b = event.nullifiedTargets) === null || _b === void 0 ? void 0 : _b.push(skillUseEvent.fromId);
        return true;
    }
};
PveLongShenLongWei = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'pve_longshen_longwei', description: 'pve_longshen_longwei_description' })
], PveLongShenLongWei);
exports.PveLongShenLongWei = PveLongShenLongWei;
let PveLongShenLongEn = class PveLongShenLongEn extends skill_1.TriggerSkill {
    isTriggerable(_, stage) {
        return stage === "CardDrawing" /* CardDrawing */;
    }
    canUse(_, owner, event) {
        return owner.Id !== event.fromId;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const drawCardEvent = event.triggeredOnEvent;
        const owner = room.AlivePlayers.find(player => player.hasSkill(this.GeneralName));
        if (owner === undefined) {
            return false;
        }
        if (owner.hasUsedSkillTimes(this.Name) < 3) {
            drawCardEvent.drawAmount += 1;
        }
        else {
            event_packer_1.EventPacker.terminate(event);
        }
        return true;
    }
};
PveLongShenLongEn = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'pve_longshen_longen', description: 'pve_longshen_longen_description' })
], PveLongShenLongEn);
exports.PveLongShenLongEn = PveLongShenLongEn;
let PveLongShenLongXiao = class PveLongShenLongXiao extends skill_1.RulesBreakerSkill {
    breakCardUsableTimesTo(_, room, owner, target) {
        if (room.withinAttackDistance(owner, target)) {
            return game_props_1.INFINITE_TRIGGERING_TIMES;
        }
        else {
            return 0;
        }
    }
};
PveLongShenLongXiao = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'pve_longshen_longxiao', description: 'pve_longshen_longxiao_description' })
], PveLongShenLongXiao);
exports.PveLongShenLongXiao = PveLongShenLongXiao;
let PveLongShenLongGu = class PveLongShenLongGu extends skill_1.TriggerSkill {
    isTriggerable(_, stage) {
        return stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    canUse(_, owner, content) {
        return content.toPlayer === owner.Id && content.to === 0 /* PhaseBegin */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const tricks = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ type: [1 /* Equip */] }));
        if (tricks.length > 0) {
            const randomEquip = tricks[Math.floor(Math.random() * tricks.length)];
            await room.moveCards({
                movingCards: [{ card: randomEquip, fromArea: 5 /* DrawStack */ }],
                toId: event.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: event.fromId,
                triggeredBySkills: [this.Name],
            });
            const equipUseEvent = {
                fromId: event.fromId,
                cardId: randomEquip,
            };
            await room.useCard(equipUseEvent);
        }
        return true;
    }
};
PveLongShenLongGu = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'pve_longshen_longgu', description: 'pve_longshen_longgu_description' })
], PveLongShenLongGu);
exports.PveLongShenLongGu = PveLongShenLongGu;
let PveLongShenChaiYue = class PveLongShenChaiYue extends skill_1.TriggerSkill {
    isTriggerable(_, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(_, owner, event) {
        return event.toId === owner.Id;
    }
    async onTrigger() {
        return true;
    }
    triggerableTimes(event) {
        return event.damage;
    }
    async onEffect(room, event) {
        const owner = room.getPlayerById(event.fromId);
        await room.drawCards(2, owner.Id, 'top', owner.Id, this.Name);
        return true;
    }
};
PveLongShenChaiYue = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'pve_longshen_chaiyue', description: 'pve_longshen_chaiyue_description' })
], PveLongShenChaiYue);
exports.PveLongShenChaiYue = PveLongShenChaiYue;
let PveLongShenLiGe = class PveLongShenLiGe extends skill_1.TriggerSkill {
    isTriggerable(_, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(_, owner, event) {
        return owner.Id !== event.playerId && event.toStage === 19 /* FinishStageStart */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const duelUseEvent = {
            fromId: event.fromId,
            cardId: card_1.VirtualCard.create({
                cardName: 'guohechaiqiao',
                bySkill: this.Name,
            }).Id,
            targetGroup: [[room.CurrentPhasePlayer.Id]],
        };
        await room.useCard(duelUseEvent);
        return true;
    }
};
PveLongShenLiGe = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'pve_longshen_lige', description: 'pve_longshen_lige_description' })
], PveLongShenLiGe);
exports.PveLongShenLiGe = PveLongShenLiGe;
let PveLongShenBiBao = class PveLongShenBiBao extends skill_1.TriggerSkill {
    isTriggerable(_, stage) {
        return stage === "DamageEffect" /* DamageEffect */ || stage === "DamagedEffect" /* DamagedEffect */;
    }
    canUse(_, owner, content, stage) {
        return stage === "DamageEffect" /* DamageEffect */ && content.fromId === owner.Id;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.recover({ recoveredHp: 1, recoverBy: event.fromId, toId: event.fromId });
        return true;
    }
};
PveLongShenBiBao = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'pve_longshen_bibao', description: 'pve_longshen_bibao_description' })
], PveLongShenBiBao);
exports.PveLongShenBiBao = PveLongShenBiBao;
