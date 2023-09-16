"use strict";
var WeiLu_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeiLuShadow = exports.WeiLu = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let WeiLu = WeiLu_1 = class WeiLu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        return (content.toId === owner.Id &&
            content.fromId !== undefined &&
            content.fromId !== owner.Id &&
            !room.getPlayerById(content.fromId).Dead);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const source = event.triggeredOnEvent.fromId;
        const originalUsers = room.getFlag(source, this.Name) || [];
        if (room.CurrentPlayer.Id === fromId) {
            const currentUsers = room.getFlag(source, WeiLu_1.WeiLuCurrent) || [];
            if (!currentUsers.includes(fromId)) {
                currentUsers.push(fromId);
                room.setFlag(source, WeiLu_1.WeiLuCurrent, currentUsers, originalUsers.length > 0 ? undefined : this.Name);
            }
        }
        else {
            if (!originalUsers.includes(fromId)) {
                originalUsers.push(fromId);
                room.setFlag(source, this.Name, originalUsers, this.Name);
            }
        }
        return true;
    }
};
WeiLu.WeiLuCurrent = 'weilu_current';
WeiLu = WeiLu_1 = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'weilu', description: 'weilu_description' })
], WeiLu);
exports.WeiLu = WeiLu;
let WeiLuShadow = class WeiLuShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return (room.CurrentPlayerPhase === 7 /* PhaseFinish */ &&
            stage === "PhaseChanged" /* PhaseChanged */ &&
            room
                .getOtherPlayers(owner)
                .find(other => {
                var _a, _b;
                return ((_a = other.getFlag(this.GeneralName)) === null || _a === void 0 ? void 0 : _a.includes(owner)) ||
                    ((_b = other.getFlag(WeiLu.WeiLuCurrent)) === null || _b === void 0 ? void 0 : _b.includes(owner));
            }) === undefined);
    }
    async whenDead(room, player) {
        for (const other of room.getOtherPlayers(player.Id)) {
            const users = other.getFlag(this.Name);
            if (users) {
                const index = users.findIndex(user => user === player.Id);
                if (index !== -1) {
                    if (users.length === 1) {
                        room.removeFlag(other.Id, this.Name);
                    }
                    else {
                        users.splice(index, 1);
                        room.setFlag(other.Id, this.Name, users, this.Name);
                    }
                }
            }
            const currentUser = other.getFlag(WeiLu.WeiLuCurrent);
            if (currentUser) {
                const index = currentUser.findIndex(user => user === player.Id);
                if (index !== -1) {
                    if (currentUser.length === 1) {
                        room.removeFlag(other.Id, this.Name);
                    }
                    else {
                        currentUser.splice(index, 1);
                        room.setFlag(other.Id, this.Name, currentUser, other.getFlag(this.Name) ? undefined : this.Name);
                    }
                }
            }
        }
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        if (room
            .getOtherPlayers(owner.Id)
            .find(other => {
            var _a, _b;
            return ((_a = other.getFlag(this.GeneralName)) === null || _a === void 0 ? void 0 : _a.includes(owner.Id)) ||
                ((_b = other.getFlag(WeiLu.WeiLuCurrent)) === null || _b === void 0 ? void 0 : _b.includes(owner.Id));
        }) === undefined) {
            return false;
        }
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = event;
            return (phaseStageChangeEvent.playerId === owner.Id &&
                (phaseStageChangeEvent.toStage === 13 /* PlayCardStageStart */ ||
                    phaseStageChangeEvent.toStage === 15 /* PlayCardStageEnd */));
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return phaseChangeEvent.fromPlayer === owner.Id && phaseChangeEvent.from === 7 /* PhaseFinish */;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 105 /* PhaseStageChangeEvent */) {
            const toStage = unknownEvent.toStage;
            if (toStage === 13 /* PlayCardStageStart */) {
                for (const other of room.getOtherPlayers(fromId)) {
                    const originalUsers = other.getFlag(this.GeneralName);
                    if (originalUsers && originalUsers.includes(fromId) && other.Hp > 1) {
                        const num = other.Hp - 1;
                        await room.loseHp(other.Id, num);
                        other.setFlag(this.Name, num);
                    }
                }
            }
            else {
                for (const other of room.getOtherPlayers(fromId)) {
                    const num = other.getFlag(this.Name);
                    if (num) {
                        await room.recover({
                            toId: other.Id,
                            recoveredHp: num,
                            recoverBy: fromId,
                        });
                        other.removeFlag(this.Name);
                    }
                }
            }
        }
        else {
            for (const other of room.getOtherPlayers(fromId)) {
                const users = other.getFlag(this.GeneralName);
                if (users) {
                    const index = users.findIndex(user => user === fromId);
                    if (index !== -1) {
                        if (users.length === 1) {
                            room.removeFlag(other.Id, this.GeneralName);
                        }
                        else {
                            users.splice(index, 1);
                            room.setFlag(other.Id, this.GeneralName, users, this.GeneralName);
                        }
                    }
                }
                let currentUsers = other.getFlag(WeiLu.WeiLuCurrent);
                if (currentUsers) {
                    room.removeFlag(other.Id, WeiLu.WeiLuCurrent);
                    const newUsers = other.getFlag(this.GeneralName) || [];
                    currentUsers = currentUsers.filter(user => !newUsers.includes(user));
                    if (newUsers.length > 0 || currentUsers.length > 0) {
                        room.setFlag(other.Id, this.GeneralName, newUsers.concat(currentUsers), this.GeneralName);
                    }
                }
            }
        }
        return true;
    }
};
WeiLuShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_wrappers_1.CompulsorySkill({ name: WeiLu.Name, description: WeiLu.Description })
], WeiLuShadow);
exports.WeiLuShadow = WeiLuShadow;
