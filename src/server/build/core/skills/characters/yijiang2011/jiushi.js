"use strict";
var JiuShiShadow_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiuShiShadow = exports.JiuShi = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let JiuShi = class JiuShi extends skill_1.ViewAsSkill {
    canViewAs() {
        return ['alcohol'];
    }
    canUse(room, owner) {
        return owner.isFaceUp() && owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: ['alcohol'] }));
    }
    cardFilter() {
        return true;
    }
    isAvailableCard() {
        return false;
    }
    viewAs() {
        return card_1.VirtualCard.create({
            cardName: 'alcohol',
            bySkill: this.Name,
        }, []);
    }
    async onEffect(room, skillEffectEvent) {
        await room.turnOver(skillEffectEvent.fromId);
        return true;
    }
};
JiuShi.levelUp = 'JiuShi_LevelUp';
JiuShi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'jiushi', description: 'jiushi_description' })
], JiuShi);
exports.JiuShi = JiuShi;
let JiuShiShadow = JiuShiShadow_1 = class JiuShiShadow extends skill_1.TriggerSkill {
    isAutoTrigger(room) {
        return (room.CurrentProcessingStage === "DamagedEffect" /* DamagedEffect */ ||
            room.CurrentProcessingStage === "TurningOver" /* TurningOver */);
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "DamagedEffect" /* DamagedEffect */;
    }
    isTriggerable(event, stage) {
        return (stage === "DamagedEffect" /* DamagedEffect */ ||
            stage === "AfterDamagedEffect" /* AfterDamagedEffect */ ||
            stage === "TurningOver" /* TurningOver */);
    }
    canUse(room, owner, event, stage) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 137 /* DamageEvent */) {
            const damageEvent = event;
            if (damageEvent.toId === owner.Id && !owner.isFaceUp()) {
                if (stage === "DamagedEffect" /* DamagedEffect */) {
                    event_packer_1.EventPacker.addMiddleware({ tag: JiuShiShadow_1.faceDownTag, data: true }, damageEvent);
                }
                else {
                    return !!event_packer_1.EventPacker.getMiddleware(JiuShiShadow_1.faceDownTag, damageEvent);
                }
            }
            return false;
        }
        else {
            const turnOverEvent = event;
            return turnOverEvent.toId === owner.Id && owner.getFlag(JiuShi.levelUp);
        }
    }
    async onTrigger() {
        return true;
    }
    async obtainTrickRandomly(room, fromId) {
        const pendingCardIds = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ type: [7 /* Trick */] }));
        if (pendingCardIds.length === 0) {
            return;
        }
        const randomIndex = Math.floor(Math.random() * pendingCardIds.length);
        await room.moveCards({
            movingCards: [{ card: pendingCardIds[randomIndex], fromArea: 5 /* DrawStack */ }],
            toId: fromId,
            toArea: 0 /* HandArea */,
            moveReason: 1 /* ActivePrey */,
            movedByReason: this.GeneralName,
        });
    }
    async onEffect(room, skillEffectEvent) {
        const player = room.getPlayerById(skillEffectEvent.fromId);
        const unknownEvent = skillEffectEvent.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 137 /* DamageEvent */) {
            await room.turnOver(skillEffectEvent.fromId);
            if (!player.getFlag(JiuShi.levelUp)) {
                await this.obtainTrickRandomly(room, skillEffectEvent.fromId);
            }
        }
        else {
            await this.obtainTrickRandomly(room, skillEffectEvent.fromId);
        }
        return true;
    }
};
JiuShiShadow.faceDownTag = 'jiushi_face_down';
JiuShiShadow = JiuShiShadow_1 = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: JiuShi.Name, description: JiuShi.Description })
], JiuShiShadow);
exports.JiuShiShadow = JiuShiShadow;
