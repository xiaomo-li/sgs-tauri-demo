"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoTu = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let BoTu = class BoTu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterStageChanged" /* AfterStageChanged */;
    }
    canUse(room, owner, content) {
        if (owner.Id === content.playerId &&
            content.toStage === 19 /* FinishStageStart */ &&
            owner.hasUsedSkillTimes(this.Name) < Math.min(room.AlivePlayers.length, 3)) {
            const records = room.Analytics.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 128 /* MoveCardEvent */ &&
                !!event.infos.find(info => info.toArea === 4 /* DropStack */), undefined, 'round');
            for (const record of records) {
                const cardSuits = [];
                for (const info of record.infos) {
                    if (info.toArea !== 4 /* DropStack */) {
                        continue;
                    }
                    for (const cardInfo of info.movingCards) {
                        const suit = engine_1.Sanguosha.getCardById(cardInfo.card).Suit;
                        cardSuits.includes(suit) && cardSuits.push(suit);
                        if (cardSuits.length > 3) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        room.insertPlayerRound(skillUseEvent.fromId);
        return true;
    }
};
BoTu = tslib_1.__decorate([
    skill_1.CircleSkill,
    skill_1.CommonSkill({ name: 'botu', description: 'botu_description' })
], BoTu);
exports.BoTu = BoTu;
