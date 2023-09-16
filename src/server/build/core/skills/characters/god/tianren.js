"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TianRen = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let TianRen = class TianRen extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        return (content.infos.find(info => {
            if (info.moveReason === 8 /* CardUse */ || info.toArea !== 4 /* DropStack */) {
                return false;
            }
            return info.movingCards.find(move => {
                const card = engine_1.Sanguosha.getCardById(move.card);
                return card.is(0 /* Basic */) || (card.is(7 /* Trick */) && !card.is(8 /* DelayedTrick */));
            });
        }) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const content = event.triggeredOnEvent;
        const player = room.getPlayerById(event.fromId);
        let coundMatchedCards = 0;
        for (const info of content.infos) {
            coundMatchedCards += info.movingCards.filter(move => {
                const card = engine_1.Sanguosha.getCardById(move.card);
                return card.is(0 /* Basic */) || (card.is(7 /* Trick */) && !card.is(8 /* DelayedTrick */));
            }).length;
        }
        room.addMark(player.Id, "tianren" /* TianRen */, coundMatchedCards);
        let tianrenMarks = room.getMark(player.Id, "tianren" /* TianRen */);
        while (tianrenMarks >= player.MaxHp) {
            tianrenMarks -= player.MaxHp;
            room.addMark(player.Id, "tianren" /* TianRen */, -1 * player.MaxHp);
            await room.changeMaxHp(player.Id, 1);
            await room.drawCards(2, player.Id, undefined, undefined, this.Name);
        }
        return true;
    }
};
TianRen = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'tianren', description: 'tianren_description' })
], TianRen);
exports.TianRen = TianRen;
