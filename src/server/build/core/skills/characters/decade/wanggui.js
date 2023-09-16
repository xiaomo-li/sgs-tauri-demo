"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WangGuiShadow = exports.WangGui = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let WangGui = class WangGui extends skill_1.TriggerSkill {
    constructor() {
        super(...arguments);
        this.WangGuiStage = 'wanggui_stage';
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamageEffect" /* AfterDamageEffect */ || stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content, stage) {
        const canUse = stage === "AfterDamageEffect" /* AfterDamageEffect */
            ? content.fromId === owner.Id && !owner.getFlag(this.Name)
            : content.toId === owner.Id;
        if (canUse) {
            owner.setFlag(this.WangGuiStage, stage);
        }
        return canUse;
    }
    async beforeUse(room, event) {
        let targets = [];
        let conversation = 'wangggui: do you want to choose a player with the different nationality from you to deal 1 damage?';
        if (room.getFlag(event.fromId, this.WangGuiStage) === "AfterDamageEffect" /* AfterDamageEffect */) {
            targets = room
                .getOtherPlayers(event.fromId)
                .filter(player => player.Nationality !== room.getPlayerById(event.fromId).Nationality)
                .map(player => player.Id);
        }
        else {
            targets = room.AlivePlayers.filter(player => player.Nationality === room.getPlayerById(event.fromId).Nationality).map(player => player.Id);
            conversation =
                'wanggui: do you want to choose a player with the same nationality with you to let he/she draw a card?';
        }
        const response = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
            players: targets,
            toId: event.fromId,
            requiredAmount: 1,
            conversation,
            triggeredBySkills: [this.Name],
        }, event.fromId);
        if (response.selectedPlayers && response.selectedPlayers.length > 0) {
            event.toIds = response.selectedPlayers;
            return true;
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
        if (room.getFlag(event.fromId, this.WangGuiStage) === "AfterDamageEffect" /* AfterDamageEffect */) {
            room.getPlayerById(event.fromId).setFlag(this.Name, true);
            await room.damage({
                fromId: event.fromId,
                toId: event.toIds[0],
                damage: 1,
                damageType: "normal_property" /* Normal */,
                triggeredBySkills: [this.Name],
            });
        }
        else {
            await room.drawCards(1, event.toIds[0], 'top', event.fromId, this.Name);
            event.toIds[0] !== event.fromId && (await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name));
        }
        return true;
    }
};
WangGui = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'wanggui', description: 'wanggui_description' })
], WangGui);
exports.WangGui = WangGui;
let WangGuiShadow = class WangGuiShadow extends skill_1.TriggerSkill {
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
        return event.from === 7 /* PhaseFinish */ && owner.getFlag(this.GeneralName) !== undefined;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, this.GeneralName);
        return true;
    }
};
WangGuiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: WangGui.Name, description: WangGui.Description })
], WangGuiShadow);
exports.WangGuiShadow = WangGuiShadow;
