"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SunYiJiQiaoShadow = exports.SunYiJiQiao = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const functional_1 = require("core/shares/libs/functional");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let SunYiJiQiao = class SunYiJiQiao extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && content.toStage === 13 /* PlayCardStageStart */ && owner.MaxHp > 0;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.moveCards({
            movingCards: room
                .getCards(room.getPlayerById(event.fromId).MaxHp, 'top')
                .map(card => ({ card, fromArea: 5 /* DrawStack */ })),
            toId: event.fromId,
            toArea: 3 /* OutsideArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: event.fromId,
            toOutsideArea: this.Name,
            isOutsideAreaInPublic: true,
            triggeredBySkills: [this.Name],
        });
        return true;
    }
};
SunYiJiQiao = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'sunyi_jiqiao', description: 'sunyi_jiqiao_description' })
], SunYiJiQiao);
exports.SunYiJiQiao = SunYiJiQiao;
let SunYiJiQiaoShadow = class SunYiJiQiaoShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    isTriggerable(event, stage) {
        return stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 124 /* CardUseEvent */) {
            return (content.fromId === owner.Id &&
                owner.getCardIds(3 /* OutsideArea */, this.GeneralName).length > 0);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            return (content.from === 4 /* PlayCardStage */ &&
                owner.getCardIds(3 /* OutsideArea */, this.GeneralName).length > 0);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        if (event_packer_1.EventPacker.getIdentifier(unknownEvent) === 124 /* CardUseEvent */) {
            const jiqiao = room.getPlayerById(event.fromId).getCardIds(3 /* OutsideArea */, this.GeneralName);
            const response = await room.doAskForCommonly(166 /* AskForChoosingCardWithConditionsEvent */, {
                toId: event.fromId,
                customCardFields: {
                    [functional_1.Functional.getCardColorRawText(1 /* Black */)]: jiqiao.filter(cardId => engine_1.Sanguosha.getCardById(cardId).isBlack()),
                    [functional_1.Functional.getCardColorRawText(0 /* Red */)]: jiqiao.filter(cardId => engine_1.Sanguosha.getCardById(cardId).isRed()),
                },
                customTitle: this.GeneralName,
                amount: 1,
                triggeredBySkills: [this.GeneralName],
            }, event.fromId, true);
            response.selectedCards = response.selectedCards || [jiqiao[Math.floor(Math.random() * jiqiao.length)]];
            await room.moveCards({
                movingCards: [{ card: response.selectedCards[0], fromArea: 3 /* OutsideArea */ }],
                fromId: event.fromId,
                toId: event.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: event.fromId,
                triggeredBySkills: [this.GeneralName],
            });
            if (jiqiao.filter(cardId => engine_1.Sanguosha.getCardById(cardId).isBlack()).length ===
                jiqiao.filter(cardId => engine_1.Sanguosha.getCardById(cardId).isRed()).length) {
                await room.recover({
                    toId: event.fromId,
                    recoveredHp: 1,
                    recoverBy: event.fromId,
                });
            }
            else {
                await room.loseHp(event.fromId, 1);
            }
        }
        else {
            await room.moveCards({
                movingCards: room
                    .getPlayerById(event.fromId)
                    .getCardIds(3 /* OutsideArea */, this.GeneralName)
                    .map(card => ({ card, fromArea: 3 /* OutsideArea */ })),
                fromId: event.fromId,
                toArea: 4 /* DropStack */,
                moveReason: 6 /* PlaceToDropStack */,
                proposer: event.fromId,
                triggeredBySkills: [this.GeneralName],
            });
        }
        return true;
    }
};
SunYiJiQiaoShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: SunYiJiQiao.Name, description: SunYiJiQiao.Description })
], SunYiJiQiaoShadow);
exports.SunYiJiQiaoShadow = SunYiJiQiaoShadow;
