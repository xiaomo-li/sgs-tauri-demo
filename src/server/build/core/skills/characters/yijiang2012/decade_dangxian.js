"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecadeDangXian = void 0;
const tslib_1 = require("tslib");
const skills_1 = require("core/skills");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let DecadeDangXian = class DecadeDangXian extends skills_1.DangXian {
    get RelatedCharacters() {
        return ['guansuo'];
    }
    audioIndex(characterName) {
        return characterName && this.RelatedCharacters.includes(characterName) ? 1 : 2;
    }
    async onEffect(room, event) {
        if (room.getPlayerById(event.fromId).Hp > 0) {
            const { selectedOption } = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                toId: event.fromId,
                options: ['yes', 'no'],
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to lose 1 hp to gain a slash from drop stack?', this.Name).extract(),
            }, event.fromId, true);
            if (selectedOption === 'yes') {
                await room.loseHp(event.fromId, 1);
                const card = room.getCardsByNameFromStack('slash', 'drop', 1)[0];
                if (card) {
                    await room.moveCards({
                        moveReason: 1 /* ActivePrey */,
                        movedByReason: this.Name,
                        toArea: 0 /* HandArea */,
                        toId: event.fromId,
                        movingCards: [{ card, fromArea: 4 /* DropStack */ }],
                    });
                }
            }
        }
        room.insertPlayerPhase(event.fromId, 4 /* PlayCardStage */);
        return true;
    }
};
DecadeDangXian = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'decade_dangxian', description: 'decade_dangxian_description' })
], DecadeDangXian);
exports.DecadeDangXian = DecadeDangXian;
