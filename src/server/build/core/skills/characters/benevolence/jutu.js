"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JuTu = void 0;
const tslib_1 = require("tslib");
const algorithm_1 = require("core/shares/libs/algorithm");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const yaohu_1 = require("./yaohu");
let JuTu = class JuTu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, event) {
        return event.playerId === owner.Id && event.toStage === 3 /* PrepareStageStart */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const shengs = room.getPlayerById(event.fromId).getCardIds(3 /* OutsideArea */, this.Name);
        shengs.length > 0 &&
            (await room.moveCards({
                movingCards: shengs.map(card => ({ card, fromArea: 3 /* OutsideArea */ })),
                fromId: event.fromId,
                toId: event.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: event.fromId,
                triggeredBySkills: [this.Name],
            }));
        if (room.getFlag(event.fromId, yaohu_1.YaoHu.Name)) {
            const num = room.AlivePlayers.filter(player => player.Nationality === room.getFlag(event.fromId, yaohu_1.YaoHu.Name)).length;
            if (num > 0) {
                await room.drawCards(num + 1, event.fromId, 'top', event.fromId, this.Name);
                let toPut = [];
                if (room.getPlayerById(event.fromId).getPlayerCards().length <= num) {
                    toPut = room.getPlayerById(event.fromId).getPlayerCards();
                }
                else {
                    const response = await room.doAskForCommonly(163 /* AskForCardEvent */, {
                        cardAmount: num,
                        toId: event.fromId,
                        reason: this.Name,
                        conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose {1} card(s) to put on your general card as ‘Sheng’', this.Name, num).extract(),
                        fromArea: [0 /* HandArea */, 1 /* EquipArea */],
                        triggeredBySkills: [this.Name],
                    }, event.fromId, true);
                    toPut =
                        response.selectedCards.length === num
                            ? response.selectedCards
                            : algorithm_1.Algorithm.randomPick(num, room.getPlayerById(event.fromId).getPlayerCards());
                }
                toPut.length > 0 &&
                    (await room.moveCards({
                        movingCards: toPut.map(card => ({ card, fromArea: room.getPlayerById(event.fromId).cardFrom(card) })),
                        fromId: event.fromId,
                        toId: event.fromId,
                        toArea: 3 /* OutsideArea */,
                        moveReason: 2 /* ActiveMove */,
                        proposer: event.fromId,
                        isOutsideAreaInPublic: true,
                        toOutsideArea: this.Name,
                        triggeredBySkills: [this.Name],
                    }));
            }
        }
        return true;
    }
};
JuTu = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'jutu', description: 'jutu_description' })
], JuTu);
exports.JuTu = JuTu;
