"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZuiCi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZuiCi = class ZuiCi extends skill_1.TriggerSkill {
    constructor() {
        super(...arguments);
        this.equipSectionToCardTypeMapper = {
            ["weapon section" /* Weapon */]: 2 /* Weapon */,
            ["shield section" /* Shield */]: 3 /* Shield */,
            ["defense ride section" /* DefenseRide */]: 5 /* DefenseRide */,
            ["offense ride section" /* OffenseRide */]: 4 /* OffenseRide */,
            ["precious" /* Precious */]: 6 /* Precious */,
        };
    }
    isTriggerable(event, stage) {
        if (stage === "StageChanged" /* StageChanged */) {
            return (event.toStage ===
                4 /* PrepareStage */);
        }
        return stage === "PlayerDying" /* PlayerDying */;
    }
    canUse(room, owner, content, stage) {
        if (owner.getCardIds(1 /* EquipArea */).length === 0) {
            return false;
        }
        if (stage === "StageChanged" /* StageChanged */) {
            return room.CurrentPlayer.Id === owner.Id;
        }
        return content.dying === owner.Id;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const from = room.getPlayerById(fromId);
        const identifier = 168 /* AskForChoosingOptionsEvent */;
        const options = from.AvailableEquipSections.filter(section => from.getEquipment(this.equipSectionToCardTypeMapper[section]) !== undefined);
        const askforAbortions = {
            options,
            toId: fromId,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose and abort an equip section', this.Name).extract(),
            triggeredBySkills: [this.Name],
        };
        room.notify(identifier, askforAbortions, fromId);
        const { selectedOption } = await room.onReceivingAsyncResponseFrom(identifier, fromId);
        if (!selectedOption) {
            return false;
        }
        await room.abortPlayerEquipSections(fromId, selectedOption);
        await room.recover({
            toId: fromId,
            recoveredHp: 2,
            recoverBy: fromId,
            triggeredBySkills: [this.Name],
        });
        const markedPlayer = room.getOtherPlayers(fromId).find(player => player.getMark("fu" /* Fu */) > 0);
        const players = room
            .getOtherPlayers(fromId)
            .filter(player => player !== markedPlayer)
            .map(player => player.Id);
        if (players.length === 0) {
            return true;
        }
        const askForTransferMark = {
            toId: fromId,
            players,
            requiredAmount: 1,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose another player to transfer the "fu" mark', this.Name).extract(),
            triggeredBySkills: [this.Name],
        };
        room.notify(167 /* AskForChoosingPlayerEvent */, askForTransferMark, fromId);
        const { selectedPlayers } = await room.onReceivingAsyncResponseFrom(167 /* AskForChoosingPlayerEvent */, fromId);
        if (selectedPlayers === null || selectedPlayers === void 0 ? void 0 : selectedPlayers[0]) {
            if (markedPlayer) {
                await room.removeMark(markedPlayer.Id, "fu" /* Fu */);
            }
            await room.addMark(selectedPlayers[0], "fu" /* Fu */, 1);
        }
        return true;
    }
};
ZuiCi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'zuici', description: 'zuici_description' })
], ZuiCi);
exports.ZuiCi = ZuiCi;
