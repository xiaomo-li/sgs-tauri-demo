"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewFenYinShadow = exports.NewFenYin = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let NewFenYin = class NewFenYin extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        const bannedSuits = owner.getFlag(this.Name) || [];
        return (room.CurrentPlayer === owner &&
            content.infos.find(info => info.toArea === 4 /* DropStack */ &&
                info.movingCards.find(card => !bannedSuits.includes(engine_1.Sanguosha.getCardById(card.card).Suit))) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const infos = event.triggeredOnEvent.infos.filter(info => info.toArea === 4 /* DropStack */);
        const bannedSuits = room.getFlag(fromId, this.Name) || [];
        let drawNum = 0;
        for (const info of infos) {
            for (const cardInfo of info.movingCards) {
                const suit = engine_1.Sanguosha.getCardById(cardInfo.card).Suit;
                if (!bannedSuits.includes(suit)) {
                    drawNum++;
                    bannedSuits.push(suit);
                }
            }
        }
        room.getPlayerById(fromId).setFlag(this.Name, bannedSuits);
        await room.drawCards(drawNum, fromId, 'top', fromId, this.Name);
        return true;
    }
};
NewFenYin = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'new_fenyin', description: 'new_fenyin_description' })
], NewFenYin);
exports.NewFenYin = NewFenYin;
let NewFenYinShadow = class NewFenYinShadow extends skill_1.TriggerSkill {
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
        return (owner.Id === event.fromPlayer &&
            event.from === 7 /* PhaseFinish */ &&
            owner.getFlag(this.GeneralName) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, this.GeneralName);
        return true;
    }
};
NewFenYinShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CompulsorySkill({ name: NewFenYin.Name, description: NewFenYin.Description })
], NewFenYinShadow);
exports.NewFenYinShadow = NewFenYinShadow;
