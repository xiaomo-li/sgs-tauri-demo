"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhiBaPindianCard = exports.ZhiBa = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const hunzi_1 = require("./hunzi");
let ZhiBa = class ZhiBa extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    async whenLosingSkill(room) {
        room.uninstallSideEffectSkill(0 /* ZhiBa */);
    }
    async whenObtainingSkill(room, owner) {
        room.installSideEffectSkill(0 /* ZhiBa */, ZhiBaPindianCard.Name, owner.Id);
    }
    isTriggerable(event, stage) {
        return stage === "BeforeGameStart" /* BeforeGameStart */;
    }
    canUse(room, owner, content) {
        return true;
    }
    async onTrigger(room, event) {
        event.translationsMessage = undefined;
        return true;
    }
    async onEffect(room, event) {
        room.installSideEffectSkill(0 /* ZhiBa */, ZhiBaPindianCard.Name, event.fromId);
        return true;
    }
};
ZhiBa = tslib_1.__decorate([
    skill_1.LordSkill,
    skill_1.CommonSkill({ name: 'zhiba', description: 'zhiba_description' })
], ZhiBa);
exports.ZhiBa = ZhiBa;
let ZhiBaPindianCard = class ZhiBaPindianCard extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return (owner.hasUsedSkillTimes(this.Name) <
            room.getAlivePlayersFrom().filter(player => player.hasSkill(ZhiBa.GeneralName)).length &&
            owner.getCardIds(0 /* HandArea */).length > 0);
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableCard(owner, room, cardId) {
        return false;
    }
    isAvailableTarget(owner, room, target) {
        return (room.getPlayerById(target).hasSkill(ZhiBa.GeneralName) &&
            room.canPindian(owner, target) &&
            room.Analytics.getRecordEvents(event => {
                var _a;
                return event.skillName === this.Name &&
                    event.fromId === owner &&
                    event.toIds !== undefined &&
                    ((_a = event.toIds) === null || _a === void 0 ? void 0 : _a.includes(target));
            }, owner, 'phase', undefined, 1).length === 0);
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        const toId = toIds[0];
        let selectedOption = 'yes';
        if (room.getPlayerById(toId).hasUsedSkill(hunzi_1.HunZi.Name)) {
            const options = ['yes', 'no'];
            const askForChooseEvent = event_packer_1.EventPacker.createUncancellableEvent({
                options,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you agree to pindian with {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId))).extract(),
                toId,
                triggeredBySkills: [this.Name],
            });
            room.notify(168 /* AskForChoosingOptionsEvent */, askForChooseEvent, toId);
            const response = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, toId);
            selectedOption = response.selectedOption || 'no';
        }
        if (selectedOption === 'yes') {
            const { pindianCardId, pindianRecord } = await room.pindian(fromId, toIds, this.Name);
            if (!pindianRecord.length) {
                return false;
            }
            if (pindianRecord[0].winner !== fromId) {
                const options = ['confirm', 'cancel'];
                const pindianCardIds = [pindianCardId, pindianRecord[0].cardId];
                const askForChooseEvent = event_packer_1.EventPacker.createUncancellableEvent({
                    options,
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to obtain pindian cards: {1}', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(...pindianCardIds)).extract(),
                    toId,
                    triggeredBySkills: [this.Name],
                });
                room.notify(168 /* AskForChoosingOptionsEvent */, askForChooseEvent, toId);
                const response = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, toId);
                response.selectedOption = response.selectedOption || 'confirm';
                if (response.selectedOption === 'confirm') {
                    await room.moveCards({
                        movingCards: pindianCardIds.map(card => ({ card, fromArea: 4 /* DropStack */ })),
                        toId,
                        toArea: 0 /* HandArea */,
                        moveReason: 1 /* ActivePrey */,
                        proposer: toId,
                        movedByReason: this.Name,
                    });
                }
            }
        }
        return true;
    }
};
ZhiBaPindianCard = tslib_1.__decorate([
    skill_1.SideEffectSkill,
    skill_1.CommonSkill({ name: ZhiBa.GeneralName, description: ZhiBa.Description })
], ZhiBaPindianCard);
exports.ZhiBaPindianCard = ZhiBaPindianCard;
