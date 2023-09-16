"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FengLveShadow = exports.FengLve = void 0;
const tslib_1 = require("tslib");
const algorithm_1 = require("core/shares/libs/algorithm");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let FengLve = class FengLve extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.getFlag(this.Name) && owner.getCardIds(0 /* HandArea */).length > 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return room.canPindian(owner, target);
    }
    isAvailableCard() {
        return false;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const { toIds, fromId } = event;
        if (!toIds) {
            return false;
        }
        const { pindianCardId, pindianRecord } = await room.pindian(fromId, toIds, this.Name);
        if (!pindianRecord.length) {
            return false;
        }
        if (pindianRecord[0].winner === fromId) {
            const to = room.getPlayerById(toIds[0]);
            const toGive = [];
            if (to.getCardIds().length > 2) {
                const response = await room.doAskForCommonly(166 /* AskForChoosingCardWithConditionsEvent */, {
                    toId: toIds[0],
                    customCardFields: {
                        [0 /* HandArea */]: to.getCardIds(0 /* HandArea */),
                        [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
                        [2 /* JudgeArea */]: to.getCardIds(2 /* JudgeArea */),
                    },
                    customTitle: this.Name,
                    amount: 2,
                    triggeredBySkills: [this.Name],
                }, toIds[0], true);
                if (response.selectedCards && response.selectedCards.length === 2) {
                    toGive.push(...response.selectedCards);
                }
                else {
                    toGive.push(...algorithm_1.Algorithm.randomPick(2, to.getCardIds()));
                }
            }
            else if (to.getCardIds().length > 0) {
                toGive.push(...to.getCardIds());
            }
            toGive.length > 0 &&
                (await room.moveCards({
                    movingCards: toGive.map(card => ({ card, fromArea: to.cardFrom(card) })),
                    fromId: toIds[0],
                    toId: fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 2 /* ActiveMove */,
                    triggeredBySkills: [this.Name],
                }));
        }
        else if (pindianRecord[0].winner === toIds[0] && pindianCardId && room.isCardInDropStack(pindianCardId)) {
            await room.moveCards({
                movingCards: [{ card: pindianCardId, fromArea: 4 /* DropStack */ }],
                toId: toIds[0],
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                triggeredBySkills: [this.Name],
            });
        }
        if (pindianRecord[0].winner) {
            room.setFlag(fromId, this.Name, true);
        }
        return true;
    }
};
FengLve = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'fenglve', description: 'fenglve_description' })
], FengLve);
exports.FengLve = FengLve;
let FengLveShadow = class FengLveShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        return content.from === 4 /* PlayCardStage */ && owner.getFlag(this.GeneralName);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, this.GeneralName);
        return true;
    }
};
FengLveShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: FengLve.Name, description: FengLve.Description })
], FengLveShadow);
exports.FengLveShadow = FengLveShadow;
