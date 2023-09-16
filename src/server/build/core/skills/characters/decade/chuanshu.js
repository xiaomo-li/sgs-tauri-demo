"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChuanShu = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const chaofeng_1 = require("./chaofeng");
const chuanyun_1 = require("./chuanyun");
const std_longdan_1 = require("../sp/std_longdan");
const congjian_1 = require("../thunder/congjian");
let ChuanShu = class ChuanShu extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return ['std_longdan', 'congjian', 'chuanyun'];
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ || stage === "PlayerDied" /* PlayerDied */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = content;
            return (phaseStageChangeEvent.playerId === owner.Id &&
                phaseStageChangeEvent.toStage === 3 /* PrepareStageStart */ &&
                owner.LostHp > 0);
        }
        else if (identifier === 153 /* PlayerDiedEvent */) {
            return content.playerId === owner.Id;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const response = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
            players: room.getOtherPlayers(fromId).map(player => player.Id),
            toId: fromId,
            requiredAmount: 1,
            conversation: 'chuanshu: do you want to let another player gain skill ChaoFeng?',
            triggeredBySkills: [this.Name],
        }, fromId);
        if (response.selectedPlayers && response.selectedPlayers.length > 0) {
            await room.obtainSkill(response.selectedPlayers[0], chaofeng_1.ChaoFeng.Name, true);
        }
        if (event_packer_1.EventPacker.getIdentifier(event.triggeredOnEvent) ===
            105 /* PhaseStageChangeEvent */) {
            await room.obtainSkill(fromId, std_longdan_1.StdLongDan.Name, true);
            await room.obtainSkill(fromId, congjian_1.CongJian.Name, true);
            await room.obtainSkill(fromId, chuanyun_1.ChuanYun.Name, true);
        }
        return true;
    }
};
ChuanShu = tslib_1.__decorate([
    skill_wrappers_1.LimitSkill({ name: 'chuanshu', description: 'chuanshu_description' })
], ChuanShu);
exports.ChuanShu = ChuanShu;
