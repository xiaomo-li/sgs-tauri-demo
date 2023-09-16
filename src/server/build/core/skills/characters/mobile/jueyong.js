"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JueYong = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let JueYong = class JueYong extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "OnAimmed" /* OnAimmed */ || stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        var _a;
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 131 /* AimEvent */) {
            const aimEvent = content;
            const card = engine_1.Sanguosha.getCardById(aimEvent.byCardId);
            return (aimEvent.toId === owner.Id &&
                aim_group_1.AimGroupUtil.getAllTargets(aimEvent.allTargets).length === 1 &&
                !card.isVirtualCard() &&
                !((_a = content.triggeredBySkills) === null || _a === void 0 ? void 0 : _a.includes(this.Name)) &&
                !['peach', 'alcohol'].includes(card.GeneralName) &&
                owner.getCardIds(3 /* OutsideArea */, this.Name).length < owner.Hp);
        }
        else if (identifier === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = content;
            return (phaseStageChangeEvent.playerId === owner.Id &&
                phaseStageChangeEvent.toStage === 19 /* FinishStageStart */ &&
                owner.getCardIds(3 /* OutsideArea */, this.Name).length > 0);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const unknownEvent = event.triggeredOnEvent;
        if (event_packer_1.EventPacker.getIdentifier(unknownEvent) === 131 /* AimEvent */) {
            const aimEvent = unknownEvent;
            aim_group_1.AimGroupUtil.cancelTarget(aimEvent, fromId);
            if (room.isCardOnProcessing(aimEvent.byCardId)) {
                await room.moveCards({
                    movingCards: [{ card: aimEvent.byCardId, fromArea: 6 /* ProcessingArea */ }],
                    toId: fromId,
                    toArea: 3 /* OutsideArea */,
                    moveReason: 2 /* ActiveMove */,
                    proposer: fromId,
                    toOutsideArea: this.Name,
                    isOutsideAreaInPublic: true,
                    triggeredBySkills: [this.Name],
                });
                const jueyongMapper = room.getFlag(fromId, this.Name) || {};
                jueyongMapper[aimEvent.byCardId] = aimEvent.fromId;
                room.getPlayerById(fromId).setFlag(this.Name, jueyongMapper);
            }
        }
        else {
            const jueyongMapper = room.getFlag(fromId, this.Name);
            const jue = room.getPlayerById(fromId).getCardIds(3 /* OutsideArea */, this.Name).slice();
            if (!jueyongMapper) {
                jue.length > 0 &&
                    (await room.moveCards({
                        movingCards: jue.map(card => ({ card, fromArea: 3 /* OutsideArea */ })),
                        fromId,
                        toArea: 4 /* DropStack */,
                        moveReason: 6 /* PlaceToDropStack */,
                        proposer: fromId,
                        triggeredBySkills: [this.Name],
                    }));
                return false;
            }
            for (const cardId of jue) {
                const user = jueyongMapper[cardId];
                if (user &&
                    !room.getPlayerById(user).Dead &&
                    room.canUseCardTo(cardId, room.getPlayerById(user), room.getPlayerById(fromId), true)) {
                    await room.useCard({
                        fromId: user,
                        targetGroup: [[fromId]],
                        cardId,
                        customFromArea: 3 /* OutsideArea */,
                        customFromId: fromId,
                        triggeredBySkills: [this.Name],
                    }, true);
                }
                else {
                    await room.moveCards({
                        movingCards: [{ card: cardId, fromArea: 3 /* OutsideArea */ }],
                        fromId,
                        toArea: 4 /* DropStack */,
                        moveReason: 6 /* PlaceToDropStack */,
                        proposer: fromId,
                        triggeredBySkills: [this.Name],
                    });
                }
            }
            room.removeFlag(fromId, this.Name);
        }
        return true;
    }
};
JueYong = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'jueyong', description: 'jueyong_description' })
], JueYong);
exports.JueYong = JueYong;
