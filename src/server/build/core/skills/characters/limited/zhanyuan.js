"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhanYuanShadow = exports.ZhanYuan = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const mansi_1 = require("./mansi");
const xili_1 = require("./xili");
let ZhanYuan = class ZhanYuan extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return [xili_1.XiLi.Name];
    }
    async whenObtainingSkill(room, player) {
        if (player.hasUsedSkill(this.Name)) {
            return;
        }
        const drawnNum = room.Analytics.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 128 /* MoveCardEvent */ &&
            !!event.infos.find(info => {
                var _a;
                return info.toId === player.Id &&
                    info.toArea === 0 /* HandArea */ &&
                    ((_a = info.triggeredBySkills) === null || _a === void 0 ? void 0 : _a.includes(mansi_1.ManSi.Name));
            })).reduce((sum, record) => {
            for (const info of record.infos) {
                sum += info.movingCards.filter(cardInfo => !cardInfo.asideMove).length;
            }
            return sum;
        }, 0);
        drawnNum > 0 &&
            room.setFlag(player.Id, this.Name, drawnNum, translation_json_tool_1.TranslationPack.translationJsonPatcher('mansi: {0}', drawnNum).toString());
    }
    async whenLosingSkill(room, player) {
        room.removeFlag(player.Id, this.Name);
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 3 /* PrepareStageStart */ &&
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
        const targets = room
            .getOtherPlayers(event.fromId)
            .filter(player => player.Gender === 0 /* Male */)
            .map(player => player.Id);
        const response = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
            players: targets,
            toId: event.fromId,
            requiredAmount: 1,
            conversation: 'zhanyuan: do you want to choose another male character to gain ‘Xi Li’ with him?',
            triggeredBySkills: [this.Name],
        }, event.fromId);
        if (response.selectedPlayers && response.selectedPlayers.length > 0) {
            for (const toId of [event.fromId, response.selectedPlayers[0]]) {
                await room.obtainSkill(toId, this.RelatedSkills[0], true);
            }
            await room.loseSkill(event.fromId, mansi_1.ManSi.Name);
        }
        return true;
    }
};
ZhanYuan = tslib_1.__decorate([
    skill_wrappers_1.AwakeningSkill({ name: 'zhanyuan', description: 'zhanyuan_description' })
], ZhanYuan);
exports.ZhanYuan = ZhanYuan;
let ZhanYuanShadow = class ZhanYuanShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        return !!content.infos.find(info => {
            var _a;
            return info.toId === owner.Id &&
                info.toArea === 0 /* HandArea */ &&
                ((_a = info.triggeredBySkills) === null || _a === void 0 ? void 0 : _a.includes(mansi_1.ManSi.Name));
        });
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        var _a;
        let originalNum = room.getFlag(event.fromId, this.GeneralName) || 0;
        for (const info of event.triggeredOnEvent.infos) {
            if (info.toId === event.fromId &&
                info.toArea === 0 /* HandArea */ &&
                ((_a = info.triggeredBySkills) === null || _a === void 0 ? void 0 : _a.includes(mansi_1.ManSi.Name))) {
                originalNum += info.movingCards.filter(cardInfo => !cardInfo.asideMove).length;
            }
        }
        room.setFlag(event.fromId, this.GeneralName, originalNum, translation_json_tool_1.TranslationPack.translationJsonPatcher('mansi: {0}', originalNum).toString());
        return true;
    }
};
ZhanYuanShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: ZhanYuan.Name, description: ZhanYuan.Description })
], ZhanYuanShadow);
exports.ZhanYuanShadow = ZhanYuanShadow;
