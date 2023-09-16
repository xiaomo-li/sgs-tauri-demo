"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QianChongRemover = exports.QianChongBuff = exports.QianChongShadow = exports.QianChong = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const functional_1 = require("core/shares/libs/functional");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const weimu_1 = require("../forest/weimu");
const mingzhe_1 = require("../sp/mingzhe");
let QianChong = class QianChong extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return [mingzhe_1.MingZhe.Name, weimu_1.WeiMu.Name];
    }
    audioIndex() {
        return 1;
    }
    getPriority() {
        return 0 /* High */;
    }
    async whenLosingSkill(room, player) {
        if (!player.getFlag(this.Name)) {
            return;
        }
        for (const skillName of this.RelatedSkills) {
            player.getFlag(this.Name) === skillName && (await room.loseSkill(player.Id, skillName));
        }
        player.removeFlag(this.Name);
    }
    async whenNullifying(room, player) {
        if (!player.getFlag(this.Name)) {
            return;
        }
        for (const skillName of this.RelatedSkills) {
            player.getFlag(this.Name) === skillName && (await room.loseSkill(player.Id, skillName));
        }
        player.removeFlag(this.Name);
    }
    async handleQianChongSkills(room, player) {
        let equipColor = 2 /* None */;
        for (const cardId of player.getCardIds(1 /* EquipArea */)) {
            const currentColor = engine_1.Sanguosha.getCardById(cardId).Color;
            if (equipColor === 2 /* None */) {
                equipColor = currentColor;
            }
            else if (equipColor !== currentColor) {
                equipColor = 2 /* None */;
                break;
            }
        }
        let originalSkillName = player.getFlag(this.Name);
        originalSkillName && (await room.loseSkill(player.Id, originalSkillName));
        originalSkillName = equipColor === 2 /* None */ ? undefined : this.RelatedSkills[equipColor];
        if (originalSkillName && !player.hasSkill(originalSkillName)) {
            await room.obtainSkill(player.Id, originalSkillName);
            player.setFlag(this.Name, originalSkillName);
        }
        else {
            player.removeFlag(this.Name);
        }
    }
    async whenObtainingSkill(room, player) {
        await this.handleQianChongSkills(room, player);
    }
    async whenEffecting(room, player) {
        await this.handleQianChongSkills(room, player);
    }
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        if (!content.infos.find(info => (info.fromId === owner.Id &&
            info.movingCards.find(cardInfo => cardInfo.fromArea === 1 /* EquipArea */)) ||
            (info.toId === owner.Id && info.toArea === 1 /* EquipArea */))) {
            return false;
        }
        let equipColor = 2 /* None */;
        for (const cardId of owner.getCardIds(1 /* EquipArea */)) {
            const currentColor = engine_1.Sanguosha.getCardById(cardId).Color;
            if (equipColor === 2 /* None */) {
                equipColor = currentColor;
            }
            else if (equipColor !== currentColor) {
                equipColor = 2 /* None */;
                break;
            }
        }
        return (owner.getFlag(this.Name) !== (equipColor === 2 /* None */ ? undefined : this.RelatedSkills[equipColor]));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await this.handleQianChongSkills(room, room.getPlayerById(event.fromId));
        return true;
    }
};
QianChong = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'qianchong', description: 'qianchong_description' })
], QianChong);
exports.QianChong = QianChong;
let QianChongShadow = class QianChongShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        const equips = owner.getCardIds(1 /* EquipArea */);
        return (content.playerId === owner.Id &&
            content.toStage === 13 /* PlayCardStageStart */ &&
            (equips.length === 0 ||
                !!equips.find(cardId => engine_1.Sanguosha.getCardById(cardId).Color !== engine_1.Sanguosha.getCardById(equips[0]).Color)));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const mapper = {};
        const options = [];
        for (const type of [0 /* Basic */, 7 /* Trick */, 1 /* Equip */]) {
            mapper[functional_1.Functional.getCardTypeRawText(type)] = type;
            options.push(functional_1.Functional.getCardTypeRawText(type));
        }
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose qianchong options: {1}', this.GeneralName).extract(),
            toId: event.fromId,
            triggeredBySkills: [this.GeneralName],
        }, event.fromId, true);
        response.selectedOption = response.selectedOption || options[0];
        const originalTypes = room.getFlag(event.fromId, this.Name) || [];
        if (!originalTypes.includes(mapper[response.selectedOption])) {
            originalTypes.push(mapper[response.selectedOption]);
            let originalText = '{0}：';
            for (let i = 1; i <= originalTypes.length; i++) {
                originalText = originalText + '[{' + i + '}]';
            }
            room.setFlag(event.fromId, this.Name, originalTypes, translation_json_tool_1.TranslationPack.translationJsonPatcher(originalText, this.GeneralName, ...originalTypes.map(type => functional_1.Functional.getCardBaseTypeAbbrRawText(type))).toString());
        }
        return true;
    }
};
QianChongShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: QianChong.Name, description: QianChong.Description })
], QianChongShadow);
exports.QianChongShadow = QianChongShadow;
let QianChongBuff = class QianChongBuff extends skill_1.RulesBreakerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    breakCardUsableDistance(cardId, room, owner) {
        if (!owner.getFlag(QianChongShadow.Name)) {
            return 0;
        }
        if (cardId instanceof card_matcher_1.CardMatcher) {
            return cardId.match(new card_matcher_1.CardMatcher({ type: owner.getFlag(QianChongShadow.Name) }))
                ? game_props_1.INFINITE_DISTANCE
                : 0;
        }
        else {
            return owner.getFlag(QianChongShadow.Name).includes(engine_1.Sanguosha.getCardById(cardId).BaseType)
                ? game_props_1.INFINITE_DISTANCE
                : 0;
        }
    }
    breakCardUsableTimes(cardId, room, owner) {
        if (!owner.getFlag(QianChongShadow.Name)) {
            return 0;
        }
        if (cardId instanceof card_matcher_1.CardMatcher) {
            return cardId.match(new card_matcher_1.CardMatcher({ type: owner.getFlag(QianChongShadow.Name) }))
                ? game_props_1.INFINITE_TRIGGERING_TIMES
                : 0;
        }
        else {
            return owner.getFlag(QianChongShadow.Name).includes(engine_1.Sanguosha.getCardById(cardId).BaseType)
                ? game_props_1.INFINITE_TRIGGERING_TIMES
                : 0;
        }
    }
};
QianChongBuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: QianChongShadow.Name, description: QianChongShadow.Description })
], QianChongBuff);
exports.QianChongBuff = QianChongBuff;
let QianChongRemover = class QianChongRemover extends skill_1.TriggerSkill {
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
            owner.getFlag(QianChongShadow.Name) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, QianChongShadow.Name);
        return true;
    }
};
QianChongRemover = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: QianChongBuff.Name, description: QianChongBuff.Description })
], QianChongRemover);
exports.QianChongRemover = QianChongRemover;
