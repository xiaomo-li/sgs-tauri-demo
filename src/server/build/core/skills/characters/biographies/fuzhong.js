"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuZhongShadow = exports.FuZhong = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let FuZhong = class FuZhong extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return (stage === "AfterCardMoved" /* AfterCardMoved */ ||
            stage === "CardDrawing" /* CardDrawing */ ||
            stage === "AfterPhaseChanged" /* AfterPhaseChanged */);
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 128 /* MoveCardEvent */) {
            return (room.CurrentPlayer !== owner &&
                content.infos.find(info => info.toId === owner.Id && info.toArea === 0 /* HandArea */) !== undefined);
        }
        else if (identifier === 127 /* DrawCardEvent */) {
            const drawCardEvent = content;
            return (owner.Id === drawCardEvent.fromId &&
                owner.getMark("zhong" /* Zhong */) >= 3 &&
                room.CurrentPlayerPhase === 3 /* DrawCardStage */ &&
                drawCardEvent.bySpecialReason === 0 /* GameStage */);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = content;
            return (phaseChangeEvent.to === 0 /* PhaseBegin */ &&
                phaseChangeEvent.toPlayer === owner.Id &&
                owner.getMark("zhong" /* Zhong */) >= 4);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 128 /* MoveCardEvent */) {
            room.addMark(event.fromId, "zhong" /* Zhong */, 1);
        }
        else if (identifier === 127 /* DrawCardEvent */) {
            unknownEvent.drawAmount++;
        }
        else {
            const players = room.getOtherPlayers(event.fromId).map(player => player.Id);
            const response = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                players,
                toId: event.fromId,
                requiredAmount: 1,
                conversation: 'fuzhong: please choose another player to deal 1 damage',
                triggeredBySkills: [this.Name],
            }, event.fromId, true);
            response.selectedPlayers = response.selectedPlayers || [players[Math.floor(Math.random() * players.length)]];
            await room.damage({
                fromId: event.fromId,
                toId: response.selectedPlayers[0],
                damage: 1,
                damageType: "normal_property" /* Normal */,
                triggeredBySkills: [this.Name],
            });
            room.removeMark(event.fromId, "zhong" /* Zhong */);
        }
        return true;
    }
};
FuZhong = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'fuzhong', description: 'fuzhong_description' })
], FuZhong);
exports.FuZhong = FuZhong;
let FuZhongShadow = class FuZhongShadow extends skill_1.RulesBreakerSkill {
    breakOffenseDistance(room, owner) {
        return owner.getMark("zhong" /* Zhong */) >= 2 ? 1 : 0;
    }
    breakAdditionalCardHoldNumber(room, owner) {
        return owner.getMark("zhong" /* Zhong */) >= 1 ? 1 : 0;
    }
};
FuZhongShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: FuZhong.Name, description: FuZhong.Description })
], FuZhongShadow);
exports.FuZhongShadow = FuZhongShadow;
