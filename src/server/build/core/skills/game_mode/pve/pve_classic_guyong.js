"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PveClassicGuYongPoJun = exports.PveClassicGuYongWuQu = exports.PveClassicGuYongWenQu = exports.PveClassicGuYongTanLang = exports.PveClassicGuYongMark = exports.PveClassicGuYong = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const target_group_1 = require("core/shares/libs/utils/target_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const pve_classic_lianzhen_1 = require("./pve_classic_lianzhen");
const pve_classic_qisha_1 = require("./pve_classic_qisha");
const pve_classic_tianji_1 = require("./pve_classic_tianji");
const pve_classic_tianliang_1 = require("./pve_classic_tianliang");
const pve_classic_tiantong_1 = require("./pve_classic_tiantong");
const pve_classic_tianxiang_1 = require("./pve_classic_tianxiang");
let PveClassicGuYong = class PveClassicGuYong extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return [
            pve_classic_qisha_1.PveClassicQiSha.GeneralName,
            pve_classic_tianji_1.PveClassicTianJi.GeneralName,
            pve_classic_tianliang_1.PveClassicTianLiang.GeneralName,
            pve_classic_tiantong_1.PveClassicTianTong.GeneralName,
            pve_classic_tianxiang_1.PveClassicTianXiang.GeneralName,
            pve_classic_lianzhen_1.PveClassicLianZhen.GeneralName,
        ];
    }
    get RelatedCharacters() {
        return ['pve_qisha', 'pve_tianji', 'pve_tianliang', 'pve_tiantong', 'pve_tianxiang', 'pve_lianzhen'];
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to awaken?', this.Name).extract();
    }
    isTriggerable(event, stage) {
        return stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    canUse(room, owner, content) {
        return (content.toPlayer === owner.Id && content.to === 0 /* PhaseBegin */ && room.enableToAwaken(this.Name, owner));
    }
    async onTrigger(room, skillUseEvent) {
        skillUseEvent.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} activated awakening skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId)), this.Name).extract();
        return true;
    }
    async onEffect(room, event) {
        const rewardCharactersId = this.RelatedCharacters.map(name => engine_1.Sanguosha.getCharacterByCharaterName(name).Id);
        room.notify(169 /* AskForChoosingCharacterEvent */, {
            amount: 1,
            characterIds: rewardCharactersId,
            toId: event.fromId,
            byHuaShen: true,
            conversation: 'Please choose a character to get a skill',
            ignoreNotifiedStatus: true,
        }, event.fromId);
        const resp = await room.onReceivingAsyncResponseFrom(169 /* AskForChoosingCharacterEvent */, event.fromId);
        const skillName = engine_1.Sanguosha.getCharacterById(resp.chosenCharacterIds[0]).Skills[0].Name;
        await room.obtainSkill(event.fromId, skillName, true);
        return true;
    }
};
PveClassicGuYong = tslib_1.__decorate([
    skill_wrappers_1.AwakeningSkill({ name: 'pve_classic_guyong', description: 'pve_classic_guyong_description' })
], PveClassicGuYong);
exports.PveClassicGuYong = PveClassicGuYong;
let PveClassicGuYongMark = class PveClassicGuYongMark extends skill_1.TriggerSkill {
    getPriority() {
        return 0 /* High */;
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterJudgeEffect" /* AfterJudgeEffect */ || stage === "PlayerDied" /* PlayerDied */;
    }
    canUse(room, owner, content) {
        const suitFlag = owner.getFlag(this.Name);
        if (suitFlag !== undefined && suitFlag.length > 3) {
            return false;
        }
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        switch (identifier) {
            case 140 /* JudgeEvent */:
                const cardSuit = engine_1.Sanguosha.getCardById(content.judgeCardId).Suit;
                return cardSuit !== 0 /* NoSuit */ && (suitFlag === undefined || !suitFlag.includes(cardSuit));
            case 153 /* PlayerDiedEvent */:
                return true;
            default:
                return false;
        }
    }
    async onTrigger(room, skillUseEvent) {
        skillUseEvent.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: get the next stage mark', this.Name).extract();
        return true;
    }
    async onEffect(room, content) {
        const owner = room.getPlayerById(content.fromId);
        const identifier = event_packer_1.EventPacker.getIdentifier(content.triggeredOnEvent);
        let suitFlag = owner.getFlag(this.Name);
        if (suitFlag === undefined) {
            suitFlag = [];
        }
        switch (identifier) {
            case 140 /* JudgeEvent */:
                const judgeEvent = content.triggeredOnEvent;
                const cardSuit = engine_1.Sanguosha.getCardById(judgeEvent.judgeCardId).Suit;
                suitFlag.push(cardSuit);
                break;
            case 153 /* PlayerDiedEvent */:
                suitFlag.push(0 /* NoSuit */);
                break;
            default:
                break;
        }
        switch (suitFlag.length) {
            case 1:
                owner.getMark("pve_tanlang" /* PveTanLang */) || room.addMark(owner.Id, "pve_tanlang" /* PveTanLang */, 1);
                break;
            case 2:
                owner.getMark("pve_wenqu" /* PveWenQu */) || room.addMark(owner.Id, "pve_wenqu" /* PveWenQu */, 1);
                break;
            case 3:
                owner.getMark("pve_wuqu" /* PveWuQu */) || room.addMark(owner.Id, "pve_wuqu" /* PveWuQu */, 1);
                break;
            case 4:
                owner.getMark("pve_pojun" /* PvePoJun */) || room.addMark(owner.Id, "pve_pojun" /* PvePoJun */, 1);
                break;
            default:
                break;
        }
        owner.setFlag(this.Name, suitFlag);
        return true;
    }
};
PveClassicGuYongMark = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: PveClassicGuYong.Name, description: PveClassicGuYong.Description })
], PveClassicGuYongMark);
exports.PveClassicGuYongMark = PveClassicGuYongMark;
let PveClassicGuYongTanLang = class PveClassicGuYongTanLang extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.toStage === 3 /* PrepareStageStart */ &&
            room.getMark(owner.Id, "pve_tanlang" /* PveTanLang */) > 0 &&
            room.CurrentPlayer !== owner &&
            owner.getCardIds(0 /* HandArea */).length <= owner.MaxHp);
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw a card?', this.Name).extract();
    }
    async onTrigger(room, skillUseEvent) {
        skillUseEvent.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}, draw a card', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId)), this.Name).extract();
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(1, event.fromId);
        return true;
    }
};
PveClassicGuYongTanLang = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: PveClassicGuYongMark.Name, description: PveClassicGuYongMark.Description })
], PveClassicGuYongTanLang);
exports.PveClassicGuYongTanLang = PveClassicGuYongTanLang;
let PveClassicGuYongWenQu = class PveClassicGuYongWenQu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardTargetDeclared" /* AfterCardTargetDeclared */;
    }
    canUse(room, owner, content) {
        const card = engine_1.Sanguosha.getCardById(content.cardId);
        return (content.fromId === owner.Id &&
            room.getMark(owner.Id, "pve_wenqu" /* PveWenQu */) > 0 &&
            ['guohechaiqiao', 'shunshouqianyang', 'duel', 'fire_attack'].includes(card.GeneralName) &&
            room.AlivePlayers.filter(player => !target_group_1.TargetGroupUtil.getRealTargets(content.targetGroup).includes(player.Id) &&
                room.isAvailableTarget(card.Id, content.fromId, player.Id) &&
                engine_1.Sanguosha.getCardById(content.cardId).Skill.isCardAvailableTarget(content.fromId, room, player.Id, [], [], content.cardId)).length > 0);
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: you can append a player to the targets of {1}', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(event.cardId)).extract();
    }
    async onTrigger(room, skillUseEvent) {
        skillUseEvent.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}, add a target for {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId)), this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(engine_1.Sanguosha.getCardById(skillUseEvent.triggeredOnEvent.cardId).Id)).extract();
        return true;
    }
    resortTargets() {
        return false;
    }
    async onEffect(room, event) {
        const cardUseEvent = event.triggeredOnEvent;
        const card = engine_1.Sanguosha.getCardById(cardUseEvent.cardId);
        const resp = await room.doAskForCommonly(174 /* AskForChoosingCardAvailableTargetEvent */, {
            user: cardUseEvent.fromId,
            cardId: card.Id,
            exclude: target_group_1.TargetGroupUtil.getRealTargets(cardUseEvent.targetGroup),
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please select a player append to target for {1}', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(card.Id)).extract(),
            triggeredBySkills: [this.Name],
        }, cardUseEvent.fromId);
        if (resp.selectedPlayers === undefined) {
            return false;
        }
        const selectedPlayer = resp.selectedPlayers[0];
        room.broadcast(103 /* CustomGameDialog */, {
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher("{1} is appended to target list of {2} by {0}'s skill {3}", translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId)), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(selectedPlayer)), translation_json_tool_1.TranslationPack.patchCardInTranslation(cardUseEvent.cardId), this.Name).extract(),
        });
        target_group_1.TargetGroupUtil.pushTargets(cardUseEvent.targetGroup, selectedPlayer);
        return true;
    }
};
PveClassicGuYongWenQu = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: PveClassicGuYongTanLang.Name, description: PveClassicGuYongTanLang.Description })
], PveClassicGuYongWenQu);
exports.PveClassicGuYongWenQu = PveClassicGuYongWenQu;
let PveClassicGuYongWuQu = class PveClassicGuYongWuQu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.toStage === 5 /* PrepareStageEnd */ &&
            room.getMark(owner.Id, "pve_wuqu" /* PveWuQu */) > 0 &&
            room.CurrentPlayer === owner);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return room.canPindian(owner, target);
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: you can pindian to a player', this.Name).extract();
    }
    async onTrigger(room, skillUseEvent) {
        skillUseEvent.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId)), this.Name).extract();
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        const { pindianRecord } = await room.pindian(fromId, toIds, this.GeneralName);
        if (!pindianRecord) {
            return false;
        }
        if (pindianRecord[0].winner === fromId) {
            const slash = card_1.VirtualCard.create({ cardName: 'slash', bySkill: this.Name }).Id;
            const slashUseEvent = { fromId, cardId: slash, targetGroup: [toIds] };
            await room.useCard(slashUseEvent);
        }
        else {
            const duel = card_1.VirtualCard.create({ cardName: 'duel', bySkill: this.Name }).Id;
            const duelUseEvent = { fromId: toIds[0], cardId: duel, targetGroup: [[fromId]] };
            await room.useCard(duelUseEvent);
        }
        return true;
    }
};
PveClassicGuYongWuQu = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: PveClassicGuYongWenQu.Name, description: PveClassicGuYongWenQu.Description })
], PveClassicGuYongWuQu);
exports.PveClassicGuYongWuQu = PveClassicGuYongWuQu;
let PveClassicGuYongPoJun = class PveClassicGuYongPoJun extends skill_1.TriggerSkill {
    isRefreshAt(room, owner, stage) {
        return stage === 0 /* PhaseBegin */;
    }
    isTriggerable(event, stage) {
        return stage === "AfterAimmed" /* AfterAimmed */ && engine_1.Sanguosha.getCardById(event.byCardId).is(7 /* Trick */);
    }
    canUse(room, owner, event) {
        return (owner.getMark("pve_pojun" /* PvePoJun */) > 0 &&
            event.toId === owner.Id &&
            room.CurrentPhasePlayer !== owner &&
            !owner.hasUsedSkill(this.Name));
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: you can drop a card', this.Name).extract();
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (event.cardIds !== undefined && event.cardIds.length === 1) {
            await room.dropCards(4 /* SelfDrop */, event.cardIds, event.fromId);
            const { fromId, toId } = event.triggeredOnEvent;
            const card = engine_1.Sanguosha.getCardById(event.cardIds[0]);
            if (card.is(1 /* Equip */)) {
                await room.damage({
                    fromId: toId,
                    toId: fromId,
                    damage: 1,
                    damageType: "normal_property" /* Normal */,
                    triggeredBySkills: [this.GeneralName],
                });
            }
            else if (card.is(7 /* Trick */)) {
                const allCards = room.getPlayerById(fromId).getPlayerCards();
                const randomCard = allCards[Math.floor(Math.random() * allCards.length)];
                await room.moveCards({
                    movingCards: [{ card: randomCard }],
                    fromId,
                    toId,
                    moveReason: 1 /* ActivePrey */,
                    toArea: 0 /* HandArea */,
                    movedByReason: this.Name,
                });
            }
            else {
                await room.drawCards(1, toId, 'top', toId, this.Name);
            }
        }
        return true;
    }
};
PveClassicGuYongPoJun = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: PveClassicGuYongWuQu.Name, description: PveClassicGuYongWuQu.Description })
], PveClassicGuYongPoJun);
exports.PveClassicGuYongPoJun = PveClassicGuYongPoJun;
