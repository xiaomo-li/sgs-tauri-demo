"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CiXiao = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const panshi_1 = require("./panshi");
let CiXiao = class CiXiao extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return ['panshi'];
    }
    async handleCiXiaoFlag(room, player, lose) {
        if (lose) {
            room.removeFlag(player, this.Name);
            await room.loseSkill(player, panshi_1.PanShi.Name, true);
        }
        else {
            room.setFlag(player, this.Name, true, 'cixiao:yizi');
            await room.obtainSkill(player, panshi_1.PanShi.Name, true);
        }
    }
    async whenDead(room, owner) {
        for (const player of room.getOtherPlayers(owner.Id)) {
            if (player.getFlag(this.Name)) {
                this.handleCiXiaoFlag(room, player.Id, true);
            }
        }
    }
    async whenLosingSkill(room, owner) {
        for (const player of room.getOtherPlayers(owner.Id)) {
            if (player.getFlag(this.Name)) {
                this.handleCiXiaoFlag(room, player.Id, true);
            }
        }
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 3 /* PrepareStageStart */ &&
            room.getOtherPlayers(owner.Id).find(player => !player.getFlag(this.Name)) !== undefined &&
            !(room.AlivePlayers.find(player => player.getFlag(this.Name)) && owner.getPlayerCards().length === 0));
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target && !room.getFlag(target, this.Name);
    }
    cardFilter(room, owner, cards) {
        return cards.length === (room.AlivePlayers.find(player => player.getFlag(this.Name)) ? 1 : 0);
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    getSkillLog(room, owner) {
        return room.AlivePlayers.find(player => player.getFlag(this.Name))
            ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to discard a card and choose another player to be your new son?', this.Name).extract()
            : translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose another player to be your son?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        if (event.cardIds && event.cardIds.length > 0) {
            await room.dropCards(4 /* SelfDrop */, event.cardIds, event.fromId, event.fromId, this.Name);
        }
        for (const player of room.getOtherPlayers(event.fromId)) {
            if (player.getFlag(this.Name)) {
                this.handleCiXiaoFlag(room, player.Id, true);
            }
        }
        this.handleCiXiaoFlag(room, event.toIds[0]);
        return true;
    }
};
CiXiao = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'cixiao', description: 'cixiao_description' })
], CiXiao);
exports.CiXiao = CiXiao;
