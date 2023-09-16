"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhuLingJiXianShadow = exports.ZhuLingJiXian = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ZhuLingJiXian = class ZhuLingJiXian extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && content.toStage === 12 /* DrawCardStageEnd */;
    }
    async beforeUse(room, event) {
        const targets = room.getOtherPlayers(event.fromId).filter(player => (player.getEquipment(3 /* Shield */) ||
            player.getPlayerSkills(undefined, true).filter(skill => !skill.isShadowSkill()).length >
                room
                    .getPlayerById(event.fromId)
                    .getPlayerSkills(undefined, true)
                    .filter(skill => !skill.isShadowSkill()).length ||
            player.LostHp === 0) &&
            room.canUseCardTo(new card_matcher_1.CardMatcher({ generalName: ['slash'] }), room.getPlayerById(event.fromId), player, true));
        if (targets.length > 0) {
            const response = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                players: targets.map(player => player.Id),
                toId: event.fromId,
                requiredAmount: 1,
                conversation: 'jixian: do you want to use a slash?',
                triggeredBySkills: [this.Name],
            }, event.fromId);
            if (response.selectedPlayers && response.selectedPlayers.length > 0) {
                event.toIds = response.selectedPlayers;
                return true;
            }
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        let drawNum = 0;
        const to = room.getPlayerById(event.toIds[0]);
        to.getEquipment(3 /* Shield */) && drawNum++;
        to.getPlayerSkills(undefined, true).filter(skill => !skill.isShadowSkill()).length >
            room
                .getPlayerById(event.fromId)
                .getPlayerSkills(undefined, true)
                .filter(skill => !skill.isShadowSkill()).length && drawNum++;
        to.LostHp === 0 && drawNum++;
        await room.useCard({
            fromId: event.fromId,
            targetGroup: [event.toIds],
            cardId: card_1.VirtualCard.create({ cardName: 'slash', bySkill: this.Name }).Id,
            extraUse: true,
            triggeredBySkills: [this.Name],
        });
        await room.drawCards(drawNum, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
ZhuLingJiXian = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'zhuling_jixian', description: 'zhuling_jixian_description' })
], ZhuLingJiXian);
exports.ZhuLingJiXian = ZhuLingJiXian;
let ZhuLingJiXianShadow = class ZhuLingJiXianShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 0 /* PhaseBegin */ && stage === "BeforePhaseChange" /* BeforePhaseChange */;
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */;
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            engine_1.Sanguosha.getCardById(content.cardId).isVirtualCard() &&
            engine_1.Sanguosha.getCardById(content.cardId).findByGeneratedSkill(this.GeneralName) &&
            !event_packer_1.EventPacker.getDamageSignatureInCardUse(content));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.loseHp(event.fromId, 1);
        return true;
    }
};
ZhuLingJiXianShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: ZhuLingJiXian.Name, description: ZhuLingJiXian.Description })
], ZhuLingJiXianShadow);
exports.ZhuLingJiXianShadow = ZhuLingJiXianShadow;
