"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhiShanXiShadow = exports.ZhiShanXi = void 0;
const tslib_1 = require("tslib");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhiShanXi = class ZhiShanXi extends skill_1.TriggerSkill {
    async whenDead(room, owner) {
        for (const player of room.getOtherPlayers(owner.Id)) {
            if (player.getFlag(this.Name)) {
                room.removeFlag(player.Id, this.Name);
            }
        }
    }
    async whenLosingSkill(room, owner) {
        for (const player of room.getOtherPlayers(owner.Id)) {
            if (player.getFlag(this.Name)) {
                room.removeFlag(player.Id, this.Name);
            }
        }
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 13 /* PlayCardStageStart */ &&
            room.getOtherPlayers(owner.Id).find(player => !player.getFlag(this.Name)) !== undefined);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target && !room.getFlag(target, this.Name);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const toId = precondition_1.Precondition.exists(event.toIds, 'Unable to get zhi_shanxi target')[0];
        for (const player of room.getOtherPlayers(event.fromId)) {
            if (player.getFlag(this.Name)) {
                room.removeFlag(player.Id, this.Name);
            }
        }
        room.setFlag(toId, this.Name, true, 'zhi_shanxi:xi');
        return true;
    }
};
ZhiShanXi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'zhi_shanxi', description: 'zhi_shanxi_description' })
], ZhiShanXi);
exports.ZhiShanXi = ZhiShanXi;
let ZhiShanXiShadow = class ZhiShanXiShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterRecoverEffect" /* AfterRecoverEffect */;
    }
    canUse(room, owner, content) {
        const to = room.getPlayerById(content.toId);
        return to.getFlag(this.GeneralName) && !to.Dying;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const recoverEvent = triggeredOnEvent;
        const toId = recoverEvent.toId;
        const to = room.getPlayerById(toId);
        if (to.getPlayerCards().length >= 2) {
            const { selectedCards } = await room.doAskForCommonly(163 /* AskForCardEvent */, {
                cardAmount: 2,
                toId,
                reason: this.GeneralName,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: you need to give 2 cards to {1}, or you will lose 1 hp', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId))).extract(),
                fromArea: [0 /* HandArea */, 1 /* EquipArea */],
                triggeredBySkills: [this.Name],
            }, toId);
            if (selectedCards.length > 0) {
                await room.moveCards({
                    movingCards: selectedCards.map(card => ({ card, fromArea: to.cardFrom(card) })),
                    fromId: toId,
                    toId: fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 2 /* ActiveMove */,
                    proposer: toId,
                    movedByReason: this.Name,
                });
            }
            else {
                await room.loseHp(toId, 1);
            }
        }
        else {
            await room.loseHp(toId, 1);
        }
        return true;
    }
};
ZhiShanXiShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: ZhiShanXi.Name, description: ZhiShanXi.Description })
], ZhiShanXiShadow);
exports.ZhiShanXiShadow = ZhiShanXiShadow;
