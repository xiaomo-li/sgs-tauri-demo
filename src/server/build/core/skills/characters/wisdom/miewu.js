"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MieWuShadow = exports.MieWu = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const engine_1 = require("core/game/engine");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const wuku_1 = require("./wuku");
let MieWu = class MieWu extends skill_1.ViewAsSkill {
    canViewAs() {
        return engine_1.Sanguosha.getCardNameByType(types => types.includes(0 /* Basic */) || types.includes(7 /* Trick */));
    }
    isRefreshAt(room, owner, phase) {
        return phase === 0 /* PhaseBegin */;
    }
    canUse(room, owner) {
        const wuku = owner.getFlag(wuku_1.WuKu.Name) || 0;
        return !owner.hasUsedSkill(this.Name) && wuku > 0 && owner.getPlayerCards().length > 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(room, owner, pendingCardId) {
        return true;
    }
    availableCardAreas() {
        return [0 /* HandArea */, 1 /* EquipArea */];
    }
    viewAs(selectedCards, owner, viewAs) {
        precondition_1.Precondition.assert(!!viewAs, 'Unknown miewu card');
        return card_1.VirtualCard.create({
            cardName: viewAs,
            bySkill: this.Name,
        }, selectedCards);
    }
};
MieWu = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'miewu', description: 'miewu_description' })
], MieWu);
exports.MieWu = MieWu;
let MieWuShadow = class MieWuShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 0 /* PhaseBegin */ && stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return (stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */ ||
            stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */ ||
            stage === "PreCardResponse" /* PreCardResponse */ ||
            stage === "AfterCardResponseEffect" /* AfterCardResponseEffect */);
    }
    canUse(room, owner, content, stage) {
        const card = engine_1.Sanguosha.getCardById(content.cardId);
        const canUse = content.fromId === owner.Id &&
            card.isVirtualCard() &&
            card.findByGeneratedSkill(this.GeneralName);
        if (canUse && stage) {
            owner.setFlag(this.GeneralName, stage);
        }
        return canUse;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const stage = room.getPlayerById(fromId).getFlag(this.GeneralName);
        if (stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */ || stage === "AfterCardResponseEffect" /* AfterCardResponseEffect */) {
            await room.drawCards(1, fromId, 'top', fromId, this.GeneralName);
        }
        else {
            let wuku = room.getFlag(fromId, wuku_1.WuKu.Name);
            if (wuku && wuku > 0) {
                wuku--;
                if (wuku > 0) {
                    room.setFlag(fromId, wuku_1.WuKu.Name, wuku, translation_json_tool_1.TranslationPack.translationJsonPatcher('wuku: {0}', wuku).toString());
                }
                else {
                    room.removeFlag(fromId, wuku_1.WuKu.Name);
                }
            }
        }
        return true;
    }
};
MieWuShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: MieWu.Name, description: MieWu.Description })
], MieWuShadow);
exports.MieWuShadow = MieWuShadow;
