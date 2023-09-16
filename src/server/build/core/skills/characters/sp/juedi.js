"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JueDi = void 0;
const tslib_1 = require("tslib");
const skills_1 = require("core/skills");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let JueDi = class JueDi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 3 /* PrepareStageStart */ &&
            owner.getCardIds(3 /* OutsideArea */, skills_1.YinBing.Name).length > 0);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const from = room.getPlayerById(event.fromId);
        const targets = room
            .getOtherPlayers(event.fromId)
            .filter(player => player.Hp <= from.Hp)
            .map(player => player.Id);
        if (targets.length > 0) {
            const resp = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                players: targets,
                toId: event.fromId,
                requiredAmount: 1,
                conversation: 'juedi: please choose a target to give all your ‘Yin Bing’ to him, or you remove all your ‘Yin Bing’',
                triggeredBySkills: [this.Name],
            }, event.fromId);
            if (resp.selectedPlayers && resp.selectedPlayers.length > 0) {
                const num = from.getCardIds(3 /* OutsideArea */, skills_1.YinBing.Name).length;
                await room.moveCards({
                    movingCards: from
                        .getCardIds(3 /* OutsideArea */, skills_1.YinBing.Name)
                        .map(card => ({ card, fromArea: 3 /* OutsideArea */ })),
                    fromId: event.fromId,
                    toId: resp.selectedPlayers[0],
                    toArea: 0 /* HandArea */,
                    moveReason: 2 /* ActiveMove */,
                    proposer: event.fromId,
                    triggeredBySkills: [this.Name],
                });
                await room.recover({
                    toId: resp.selectedPlayers[0],
                    recoveredHp: 1,
                    recoverBy: event.fromId,
                });
                await room.drawCards(num, resp.selectedPlayers[0], 'top', event.fromId, this.Name);
                return true;
            }
        }
        await room.moveCards({
            movingCards: from
                .getCardIds(3 /* OutsideArea */, skills_1.YinBing.Name)
                .map(card => ({ card, fromArea: 3 /* OutsideArea */ })),
            fromId: event.fromId,
            toArea: 4 /* DropStack */,
            moveReason: 6 /* PlaceToDropStack */,
            proposer: event.fromId,
            triggeredBySkills: [this.Name],
        });
        const diff = from.MaxHp - from.getCardIds(0 /* HandArea */).length;
        diff > 0 && (await room.drawCards(diff, event.fromId, 'top', event.fromId, this.Name));
        return true;
    }
};
JueDi = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'juedi', description: 'juedi_description' })
], JueDi);
exports.JueDi = JueDi;
