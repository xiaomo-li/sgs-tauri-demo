"use strict";
var ShunShi_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShunShiBuff = exports.ShunShiShadow = exports.ShunShi = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ShunShi = ShunShi_1 = class ShunShi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ || stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        if (owner.getPlayerCards().length === 0) {
            return false;
        }
        owner.getFlag(this.Name) && room.removeFlag(owner.Id, this.Name);
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = content;
            return (phaseStageChangeEvent.playerId === owner.Id &&
                phaseStageChangeEvent.toStage === 3 /* PrepareStageStart */);
        }
        else if (identifier === 137 /* DamageEvent */) {
            const damageEvent = content;
            const canUse = room.CurrentPlayer !== owner &&
                damageEvent.toId === owner.Id &&
                room.getOtherPlayers(owner.Id).find(player => player.Id !== damageEvent.fromId) !== undefined;
            if (canUse) {
                damageEvent.fromId !== undefined &&
                    damageEvent.fromId !== owner.Id &&
                    room.setFlag(owner.Id, this.Name, damageEvent.fromId);
            }
        }
        return false;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner && target !== room.getFlag(owner, this.Name);
    }
    isAvailableCard() {
        return true;
    }
    getSkillLog(room, owner, event) {
        return owner.getFlag(this.Name)
            ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to give another player except {1} a card?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract()
            : translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to give another player a card?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        if (!event.toIds || !event.cardIds) {
            return false;
        }
        await room.moveCards({
            movingCards: [{ card: event.cardIds[0], fromArea: room.getPlayerById(fromId).cardFrom(event.cardIds[0]) }],
            fromId,
            toId: event.toIds[0],
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: fromId,
            triggeredBySkills: [this.Name],
        });
        let originalBuff = room.getFlag(fromId, ShunShi_1.ShunShiBuff) || 0;
        originalBuff++;
        room.setFlag(fromId, ShunShi_1.ShunShiBuff, originalBuff, translation_json_tool_1.TranslationPack.translationJsonPatcher('shunshi points: {0}', originalBuff).toString());
        return true;
    }
};
ShunShi.ShunShiBuff = 'shunshi_buff';
ShunShi = ShunShi_1 = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'shunshi', description: 'shunshi_description' })
], ShunShi);
exports.ShunShi = ShunShi;
let ShunShiShadow = class ShunShiShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    isTriggerable(event, stage) {
        return stage === "CardDrawing" /* CardDrawing */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        const flag = owner.getFlag(ShunShi.ShunShiBuff);
        if (flag === undefined) {
            return false;
        }
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 127 /* DrawCardEvent */) {
            const drawCardEvent = content;
            return (drawCardEvent.fromId === owner.Id &&
                room.CurrentPlayerPhase === 3 /* DrawCardStage */ &&
                drawCardEvent.bySpecialReason === 0 /* GameStage */ &&
                flag > 0);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = content;
            return phaseChangeEvent.fromPlayer === owner.Id && phaseChangeEvent.from === 7 /* PhaseFinish */;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unkownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unkownEvent);
        if (identifier === 127 /* DrawCardEvent */) {
            const drawCardEvent = unkownEvent;
            drawCardEvent.drawAmount += room.getFlag(event.fromId, ShunShi.ShunShiBuff);
        }
        else {
            room.removeFlag(event.fromId, ShunShi.ShunShiBuff);
        }
        return true;
    }
};
ShunShiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: ShunShi.Name, description: ShunShi.Description })
], ShunShiShadow);
exports.ShunShiShadow = ShunShiShadow;
let ShunShiBuff = class ShunShiBuff extends skill_1.RulesBreakerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    breakCardUsableTimes(cardId, room, owner) {
        const flag = room.getFlag(owner.Id, ShunShi.ShunShiBuff);
        if (!flag || room.CurrentPlayerPhase !== 4 /* PlayCardStage */) {
            return 0;
        }
        let match = false;
        if (cardId instanceof card_matcher_1.CardMatcher) {
            match = cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] }));
        }
        else {
            match = engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash';
        }
        if (match) {
            return flag;
        }
        else {
            return 0;
        }
    }
    breakAdditionalCardHoldNumber(room, owner) {
        const flag = room.getFlag(owner.Id, ShunShi.ShunShiBuff);
        if (!flag || room.CurrentPlayerPhase !== 5 /* DropCardStage */) {
            return 0;
        }
        return flag;
    }
};
ShunShiBuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: ShunShiShadow.Name, description: ShunShiShadow.Description })
], ShunShiBuff);
exports.ShunShiBuff = ShunShiBuff;
