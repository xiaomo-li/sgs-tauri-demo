"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FengShi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let FengShi = class FengShi extends skill_1.TriggerSkill {
    isAutoTrigger(room, owner, event) {
        return !!event && event_packer_1.EventPacker.getIdentifier(event) === 131 /* AimEvent */ && event.toId === owner.Id;
    }
    isTriggerable(event, stage) {
        return stage === "AfterAim" /* AfterAim */ || stage === "AfterAimmed" /* AfterAimmed */;
    }
    canUse(room, owner, content, stage) {
        return ((stage === "AfterAim" /* AfterAim */
            ? content.fromId === owner.Id && content.toId !== owner.Id
            : content.fromId !== owner.Id && content.toId === owner.Id) &&
            aim_group_1.AimGroupUtil.getAllTargets(content.allTargets).length === 1 &&
            [0 /* Basic */, 7 /* Trick */].includes(engine_1.Sanguosha.getCardById(content.byCardId).BaseType) &&
            (content.fromId === owner.Id
                ? !room.getPlayerById(content.toId).Dead
                : !room.getPlayerById(content.fromId).Dead) &&
            room.getPlayerById(content.fromId).getCardIds(0 /* HandArea */).length >
                room.getPlayerById(content.toId).getCardIds(0 /* HandArea */).length);
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to use ‘Feng Shi’ to {1}: {2} ?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.toId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(event.byCardId)).extract();
    }
    async beforeUse(room, event) {
        const aimEvent = event.triggeredOnEvent;
        if (aimEvent.toId === event.fromId) {
            const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                options: ['yes', 'no'],
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose fengshi options: {1} {2}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(aimEvent.byCardId)).extract(),
                toId: aimEvent.fromId,
                triggeredBySkills: [this.Name],
            }, aimEvent.fromId);
            if (response.selectedOption !== 'yes') {
                return false;
            }
        }
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const aimEvent = event.triggeredOnEvent;
        const players = [event.fromId, aimEvent.fromId === event.fromId ? aimEvent.toId : aimEvent.fromId];
        room.sortPlayersByPosition(players);
        for (const playerId of players) {
            const player = room.getPlayerById(playerId);
            if (player.getPlayerCards().length === 0) {
                continue;
            }
            const options = {
                [1 /* EquipArea */]: player.getCardIds(1 /* EquipArea */),
                [0 /* HandArea */]: player.getCardIds(0 /* HandArea */).length,
            };
            const chooseCardEvent = {
                fromId: event.fromId,
                toId: playerId,
                options,
                triggeredBySkills: [this.Name],
            };
            const response = await room.askForChoosingPlayerCard(chooseCardEvent, event.fromId, true, true);
            if (response && response.selectedCard) {
                await room.dropCards(playerId === event.fromId ? 4 /* SelfDrop */ : 5 /* PassiveDrop */, [response.selectedCard], playerId, event.fromId, this.Name);
            }
        }
        aimEvent.additionalDamage = (aimEvent.additionalDamage || 0) + 1;
        return true;
    }
};
FengShi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'fengshi', description: 'fengshi_description' })
], FengShi);
exports.FengShi = FengShi;
