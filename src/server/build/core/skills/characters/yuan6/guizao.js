"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuiZao = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let GuiZao = class GuiZao extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, event) {
        if (event.playerId === owner.Id && event.toStage === 18 /* DropCardStageEnd */) {
            const records = room.Analytics.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 128 /* MoveCardEvent */ &&
                !!event.infos.find(info => info.fromId === owner.Id && info.movedByReason === "GameRuleDrop" /* GameRuleDrop */), owner.Id, 'phase');
            const suitsRecorded = [];
            for (const record of records) {
                for (const info of record.infos) {
                    for (const cardInfo of info.movingCards) {
                        if (engine_1.Sanguosha.getCardById(cardInfo.card).isVirtualCard()) {
                            continue;
                        }
                        const suitDiscarded = engine_1.Sanguosha.getCardById(cardInfo.card).Suit;
                        if (suitsRecorded.includes(suitDiscarded)) {
                            return false;
                        }
                        suitsRecorded.push(suitDiscarded);
                    }
                }
            }
            return suitsRecorded.length > 1;
        }
        return false;
    }
    async beforeUse(room, event) {
        const options = ['guizao:draw', 'cancel'];
        if (room.getPlayerById(event.fromId).LostHp > 0) {
            options.push('guizao:recover');
            const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                options,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose guizao options', this.Name).extract(),
                toId: event.fromId,
                triggeredBySkills: [this.Name],
            }, event.fromId);
            if (response.selectedOption && response.selectedOption !== 'cancel') {
                event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: response.selectedOption }, event);
                return true;
            }
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (event_packer_1.EventPacker.getMiddleware(this.Name, event) === 'guizao:recover') {
            await room.recover({
                toId: event.fromId,
                recoveredHp: 1,
                recoverBy: event.fromId,
            });
        }
        else {
            await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
        }
        return true;
    }
};
GuiZao = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'guizao', description: 'guizao_description' })
], GuiZao);
exports.GuiZao = GuiZao;
