"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QingYu = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const xuancun_1 = require("./xuancun");
let QingYu = class QingYu extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return [xuancun_1.XuanCun.Name];
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return (stage === "DamagedEffect" /* DamagedEffect */ ||
            stage === "StageChanged" /* StageChanged */ ||
            stage === "PlayerDying" /* PlayerDying */);
    }
    canUse(room, owner, event) {
        if (owner.getFlag(this.Name) !== undefined) {
            return false;
        }
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 137 /* DamageEvent */) {
            return (event.toId === owner.Id &&
                owner.getPlayerCards().filter(cardId => room.canDropCard(owner.Id, cardId)).length > 1);
        }
        else if (identifier === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = event;
            return (phaseStageChangeEvent.playerId === owner.Id &&
                phaseStageChangeEvent.toStage === 3 /* PrepareStageStart */ &&
                owner.LostHp === 0 &&
                owner.getCardIds(0 /* HandArea */).length === 0);
        }
        else if (identifier === 152 /* PlayerDyingEvent */) {
            return event.dying === owner.Id && owner.Hp < 1;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        if (event_packer_1.EventPacker.getIdentifier(unknownEvent) === 137 /* DamageEvent */) {
            const response = await room.askForCardDrop(event.fromId, 2, [0 /* HandArea */, 1 /* EquipArea */], true, undefined, this.Name);
            response.droppedCards.length > 0 &&
                (await room.dropCards(4 /* SelfDrop */, response.droppedCards, event.fromId, event.fromId, this.Name));
            const damageEvent = unknownEvent;
            damageEvent.damage = 0;
            event_packer_1.EventPacker.terminate(damageEvent);
        }
        else if (event_packer_1.EventPacker.getIdentifier(unknownEvent) === 105 /* PhaseStageChangeEvent */) {
            room.setFlag(event.fromId, this.Name, true, 'qingyu:succeeded');
            await room.obtainSkill(event.fromId, this.RelatedSkills[0]);
        }
        else {
            room.setFlag(event.fromId, this.Name, false, 'qingyu:failed');
            await room.changeMaxHp(event.fromId, -1);
        }
        return true;
    }
};
QingYu = tslib_1.__decorate([
    skill_wrappers_1.QuestSkill({ name: 'qingyu', description: 'qingyu_description' })
], QingYu);
exports.QingYu = QingYu;
