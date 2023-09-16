"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XiongYi = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const yinghun_1 = require("../forest/yinghun");
const hunzi_1 = require("../mountain/hunzi");
const yingzi_1 = require("../standard/yingzi");
let XiongYi = class XiongYi extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return [hunzi_1.HunZi.Name, yinghun_1.YingHun.Name, yingzi_1.YingZi.Name];
    }
    isTriggerable(event, stage) {
        return stage === "RequestRescue" /* RequestRescue */;
    }
    canUse(room, owner, content) {
        return content.dying === owner.Id;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!room.Players.find(player => player.Character.Name === 'xushi')) {
            await room.recover({
                toId: event.fromId,
                recoveredHp: 3 - room.getPlayerById(event.fromId).Hp,
                recoverBy: event.fromId,
            });
            await room.changeGeneral({
                changedProperties: [
                    {
                        toId: event.fromId,
                        characterId: engine_1.Sanguosha.getCharacterByCharaterName('xushi').Id,
                        maxHp: room.getPlayerById(event.fromId).MaxHp,
                        hp: room.getPlayerById(event.fromId).Hp,
                    },
                ],
            });
        }
        else {
            await room.recover({
                toId: event.fromId,
                recoveredHp: 1 - room.getPlayerById(event.fromId).Hp,
                recoverBy: event.fromId,
            });
            await room.obtainSkill(event.fromId, hunzi_1.HunZi.Name);
        }
        return true;
    }
};
XiongYi = tslib_1.__decorate([
    skill_wrappers_1.LimitSkill({ name: 'xiongyi', description: 'xiongyi_description' })
], XiongYi);
exports.XiongYi = XiongYi;
