"use strict";
var XianFu_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.XianFuChained = exports.XianFu = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let XianFu = XianFu_1 = class XianFu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterGameBegan" /* AfterGameBegan */;
    }
    canUse(room, owner, content) {
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const others = room.getOtherPlayers(event.fromId).map(player => player.Id);
        const response = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
            players: others,
            toId: event.fromId,
            requiredAmount: 1,
            conversation: 'xianfu: please choose another player to be your ‘Xian Fu’ player',
            triggeredBySkills: [this.Name],
        }, event.fromId, true);
        response.selectedPlayers = response.selectedPlayers || [others[Math.floor(Math.random() * others.length)]];
        room.getPlayerById(event.fromId).setFlag(this.Name, response.selectedPlayers[0]);
        room.setFlag(response.selectedPlayers[0], XianFu_1.XianFuPlayer, false, this.Name, [event.fromId]);
        return true;
    }
};
XianFu.XianFuPlayer = 'xianfu_player';
XianFu = XianFu_1 = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'xianfu', description: 'xianfu_description' })
], XianFu);
exports.XianFu = XianFu;
let XianFuChained = class XianFuChained extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */ || stage === "AfterRecoverEffect" /* AfterRecoverEffect */;
    }
    canUse(room, owner, content) {
        return (!(event_packer_1.EventPacker.getIdentifier(content) === 137 /* DamageEvent */ && room.getPlayerById(content.toId).Dead) &&
            owner.getFlag(this.GeneralName) === content.toId &&
            !(event_packer_1.EventPacker.getIdentifier(content) === 138 /* RecoverEvent */ && owner.LostHp < 1));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (!room.getFlag(unknownEvent.toId, XianFu.XianFuPlayer)) {
            room.setFlag(unknownEvent.toId, XianFu.XianFuPlayer, true, this.GeneralName);
        }
        if (identifier === 137 /* DamageEvent */) {
            await room.damage({
                toId: event.fromId,
                damage: unknownEvent.damage,
                damageType: "normal_property" /* Normal */,
                triggeredBySkills: [this.Name],
            });
        }
        else {
            await room.recover({
                toId: event.fromId,
                recoveredHp: unknownEvent.recoveredHp,
                recoverBy: event.fromId,
            });
        }
        return true;
    }
};
XianFuChained = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill({ stubbornSkill: true }),
    skill_wrappers_1.CommonSkill({ name: XianFu.Name, description: XianFu.Description })
], XianFuChained);
exports.XianFuChained = XianFuChained;
