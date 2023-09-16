"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KuangBiShadow = exports.KuangBi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let KuangBi = class KuangBi extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target && room.getPlayerById(target).getPlayerCards().length > 0;
    }
    isAvailableCard(owner, room, cardId) {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const response = await room.doAskForCommonly(163 /* AskForCardEvent */, {
            cardAmountRange: [1, 3],
            toId: event.toIds[0],
            reason: this.Name,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please put at least 1 and less than 3 cards onto {1} ’s general card as ‘bi’', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract(),
            fromArea: [0 /* HandArea */, 1 /* EquipArea */],
            triggeredBySkills: [this.Name],
        }, event.toIds[0], true);
        const destHandCards = room.getPlayerById(event.toIds[0]).getPlayerCards();
        response.selectedCards = response.selectedCards || [
            destHandCards[Math.floor(Math.random() * destHandCards.length)],
        ];
        await room.moveCards({
            movingCards: response.selectedCards.map(card => ({
                card,
                fromArea: room.getPlayerById(event.toIds[0]).cardFrom(card),
            })),
            fromId: event.toIds[0],
            toId: event.fromId,
            toArea: 3 /* OutsideArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: event.toIds[0],
            toOutsideArea: this.Name,
            isOutsideAreaInPublic: false,
            triggeredBySkills: [this.Name],
        });
        const originalMapper = room.getFlag(event.fromId, this.Name) || {};
        originalMapper[event.toIds[0]] = originalMapper[event.toIds[0]] || 0;
        originalMapper[event.toIds[0]] += response.selectedCards.length;
        room.getPlayerById(event.fromId).setFlag(this.Name, originalMapper);
        return true;
    }
};
KuangBi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'kuangbi', description: 'kuangbi_description' })
], KuangBi);
exports.KuangBi = KuangBi;
let KuangBiShadow = class KuangBiShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return content.toStage === 3 /* PrepareStageStart */ && stage === "StageChanged" /* StageChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 3 /* PrepareStageStart */ &&
            (owner.getCardIds(3 /* OutsideArea */, this.GeneralName).length > 0 ||
                owner.getFlag(this.GeneralName) !== undefined));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const bi = room.getPlayerById(event.fromId).getCardIds(3 /* OutsideArea */, this.GeneralName);
        bi.length > 0 &&
            (await room.moveCards({
                movingCards: bi.map(card => ({ card, fromArea: 3 /* OutsideArea */ })),
                fromId: event.fromId,
                toId: event.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: event.fromId,
                triggeredBySkills: [this.GeneralName],
            }));
        const kuangbiMapper = room.getFlag(event.fromId, this.GeneralName);
        if (kuangbiMapper) {
            for (const [playerId, drawNum] of Object.entries(kuangbiMapper)) {
                room.getPlayerById(playerId).Dead ||
                    (await room.drawCards(drawNum, playerId, 'top', event.fromId, this.GeneralName));
            }
            room.getPlayerById(event.fromId).removeFlag(this.GeneralName);
        }
        return true;
    }
};
KuangBiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: KuangBi.Name, description: KuangBi.Description })
], KuangBiShadow);
exports.KuangBiShadow = KuangBiShadow;
