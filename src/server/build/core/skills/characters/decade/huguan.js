"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuGuanBuff = exports.HuGuanShadow = exports.HuGuan = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const functional_1 = require("core/shares/libs/functional");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let HuGuan = class HuGuan extends skill_1.TriggerSkill {
    get RelatedCharacters() {
        return ['wangyue'];
    }
    async whenObtainingSkill(room, owner) {
        if (room.CurrentPlayerPhase !== 4 /* PlayCardStage */) {
            return;
        }
        const records = room.Analytics.getCardUseRecord(owner.Id, 'phase', undefined, 1);
        if (records.length > 0) {
            owner.getFlag(HuGuanShadow.Name) || owner.setFlag(HuGuanShadow.Name, true);
            event_packer_1.EventPacker.getMiddleware(this.Name, records[0]) ||
                event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: true }, records[0]);
        }
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */;
    }
    canUse(room, owner, content) {
        return (room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
            room.CurrentPhasePlayer.Id === content.fromId &&
            event_packer_1.EventPacker.getMiddleware(this.Name, content) === true &&
            !!content.cardId &&
            engine_1.Sanguosha.getCardById(content.cardId).isRed());
    }
    async beforeUse(room, event) {
        const options = ['spade', 'club', 'diamond', 'heart'];
        const user = event.triggeredOnEvent.fromId;
        const askForChooseEvent = event_packer_1.EventPacker.createUncancellableEvent({
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose a card suit: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(user))).extract(),
            toId: event.fromId,
            triggeredBySkills: [this.Name],
        });
        const resp = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, askForChooseEvent, event.fromId);
        if (resp.selectedOption) {
            event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: resp.selectedOption }, event);
            return true;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const suit = functional_1.Functional.convertSuitStringToSuit(event_packer_1.EventPacker.getMiddleware(this.Name, event));
        const user = event.triggeredOnEvent.fromId;
        const originalSuits = room.getFlag(user, this.Name) || [];
        originalSuits.push(suit);
        room.setFlag(user, this.Name, originalSuits, translation_json_tool_1.TranslationPack.translationJsonPatcher('huguan suits: {0}', originalSuits.reduce((suitString, suit) => suitString + functional_1.Functional.getCardSuitCharText(suit), '')).toString());
        room.getPlayerById(user).hasShadowSkill(HuGuanBuff.Name) || (await room.obtainSkill(user, HuGuanBuff.Name));
        return true;
    }
};
HuGuan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'huguan', description: 'huguan_description' })
], HuGuan);
exports.HuGuan = HuGuan;
let HuGuanShadow = class HuGuanShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return content.from === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = event;
            return (!owner.getFlag(this.Name) &&
                room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
                room.CurrentPhasePlayer.Id === cardUseEvent.fromId);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return phaseChangeEvent.from === 4 /* PlayCardStage */ && owner.getFlag(this.Name);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = unknownEvent;
            room.getPlayerById(event.fromId).setFlag(this.Name, true);
            event_packer_1.EventPacker.addMiddleware({ tag: this.GeneralName, data: true }, cardUseEvent);
        }
        else {
            room.removeFlag(event.fromId, this.Name);
        }
        return true;
    }
};
HuGuanShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: HuGuan.Name, description: HuGuan.Description })
], HuGuanShadow);
exports.HuGuanShadow = HuGuanShadow;
let HuGuanBuff = class HuGuanBuff extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return (event_packer_1.EventPacker.getIdentifier(event) === 162 /* AskForCardDropEvent */ ||
            stage === "PhaseChanged" /* PhaseChanged */);
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        let canTrigger = false;
        const suits = owner.getFlag(HuGuan.Name);
        if (event_packer_1.EventPacker.getIdentifier(content) === 162 /* AskForCardDropEvent */) {
            canTrigger =
                room.CurrentPlayerPhase === 5 /* DropCardStage */ &&
                    room.CurrentPhasePlayer.Id === owner.Id &&
                    suits.length > 0;
        }
        else if (event_packer_1.EventPacker.getIdentifier(content) === 104 /* PhaseChangeEvent */) {
            canTrigger =
                content.from === 7 /* PhaseFinish */;
        }
        return canTrigger && !!suits;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 162 /* AskForCardDropEvent */) {
            const askForCardDropEvent = unknownEvent;
            const player = room.getPlayerById(event.fromId);
            const tricks = player
                .getCardIds(0 /* HandArea */)
                .filter(cardId => player.getFlag(HuGuan.Name).includes(engine_1.Sanguosha.getCardById(cardId).Suit));
            if (tricks.length > 0) {
                const otherHandCards = player.getCardIds(0 /* HandArea */).filter(card => !tricks.includes(card));
                const discardAmount = otherHandCards.length - player.getMaxCardHold(room);
                askForCardDropEvent.cardAmount = discardAmount;
                askForCardDropEvent.except = askForCardDropEvent.except ? [...askForCardDropEvent.except, ...tricks] : tricks;
            }
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            room.removeFlag(event.fromId, HuGuan.Name);
            await room.loseSkill(event.fromId, this.Name);
        }
        return true;
    }
};
HuGuanBuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_huguan_buff', description: 's_huguan_buff_description' })
], HuGuanBuff);
exports.HuGuanBuff = HuGuanBuff;
