"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZiShuShadow = exports.ZiShu = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
let ZiShu = class ZiShu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        return (content.infos.find(info => { var _a; return !((_a = info.movedByReason) === null || _a === void 0 ? void 0 : _a.includes(this.Name)) && info.toId === owner.Id && info.toArea === 0 /* HandArea */; }) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const from = room.getPlayerById(fromId);
        const moveCardEvent = triggeredOnEvent;
        if (room.CurrentPlayer.Id === fromId) {
            await room.drawCards(1, fromId, 'top', fromId, this.Name);
        }
        else {
            const zishuCards = from.getFlag(this.Name) || [];
            if (moveCardEvent.infos.length === 1) {
                zishuCards.push(...moveCardEvent.infos[0].movingCards.map(card => card.card));
            }
            else {
                const infos = moveCardEvent.infos.filter(info => info.toId === fromId && info.toArea === 0 /* HandArea */);
                for (const info of infos) {
                    zishuCards.push(...info.movingCards.map(card => card.card));
                }
            }
            from.setFlag(this.Name, zishuCards);
        }
        return true;
    }
};
ZiShu = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'zishu', description: 'zishu_description' })
], ZiShu);
exports.ZiShu = ZiShu;
let ZiShuShadow = class ZiShuShadow extends skill_1.TriggerSkill {
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
    canUse(room, owner, content) {
        return owner.getFlag(this.GeneralName) && content.from === 7 /* PhaseFinish */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const from = room.getPlayerById(fromId);
        if (from.getCardIds(0 /* HandArea */).length > 0) {
            const zishuCards = from.getFlag(this.GeneralName);
            const restCards = zishuCards.filter(cardId => from.getCardIds(0 /* HandArea */).includes(cardId));
            if (restCards.length > 0) {
                await room.moveCards({
                    movingCards: restCards.map(card => ({ card, fromArea: 0 /* HandArea */ })),
                    fromId,
                    toArea: 4 /* DropStack */,
                    moveReason: 6 /* PlaceToDropStack */,
                    proposer: fromId,
                    triggeredBySkills: [this.GeneralName],
                });
            }
        }
        room.removeFlag(fromId, this.GeneralName);
        return true;
    }
};
ZiShuShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CompulsorySkill({ name: ZiShu.Name, description: ZiShu.Description })
], ZiShuShadow);
exports.ZiShuShadow = ZiShuShadow;
