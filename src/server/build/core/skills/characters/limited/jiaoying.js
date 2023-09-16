"use strict";
var JiaoYing_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiaoYingRemover = exports.JiaoYingBlocker = exports.JiaoYingShaodow = exports.JiaoYing = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JiaoYing = JiaoYing_1 = class JiaoYing extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        return (content.infos.find(info => info.fromId === owner.Id &&
            info.movingCards.find(card => card.fromArea === 0 /* HandArea */) !== undefined &&
            info.toId !== owner.Id &&
            info.toArea === 0 /* HandArea */) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        for (const info of event.triggeredOnEvent.infos) {
            if (!(info.fromId === event.fromId &&
                info.movingCards.find(card => card.fromArea === 0 /* HandArea */) !== undefined &&
                info.toId !== event.fromId &&
                info.toArea === 0 /* HandArea */)) {
                continue;
            }
            const toId = info.toId;
            const originalColors = room.getFlag(toId, this.Name) || [];
            if (originalColors.length < 2) {
                let hasPushed = false;
                for (const cardInfo of info.movingCards) {
                    if (cardInfo.asideMove || cardInfo.fromArea !== 0 /* HandArea */) {
                        continue;
                    }
                    if (originalColors.length > 1) {
                        break;
                    }
                    const cardColor = engine_1.Sanguosha.getCardById(cardInfo.card).Color;
                    if (!originalColors.includes(cardColor)) {
                        originalColors.push(cardColor);
                        hasPushed = true;
                    }
                }
                hasPushed && room.setFlag(toId, this.Name, originalColors);
            }
            const originalMappers = room.getFlag(toId, JiaoYing_1.UsedTimesMappers) || {};
            originalMappers[event.fromId] = originalMappers[event.fromId] || 0;
            originalMappers[event.fromId]++;
            room.getPlayerById(toId).setFlag(JiaoYing_1.UsedTimesMappers, originalMappers);
            for (const skillName of [JiaoYingBlocker.Name, JiaoYingRemover.Name]) {
                room.getPlayerById(toId).hasShadowSkill(skillName) || (await room.obtainSkill(toId, skillName));
            }
        }
        return true;
    }
};
JiaoYing.UsedTimesMappers = 'jiaoying_used_times_mappers';
JiaoYing = JiaoYing_1 = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'jiaoying', description: 'jiaoying_description' })
], JiaoYing);
exports.JiaoYing = JiaoYing;
let JiaoYingShaodow = class JiaoYingShaodow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "BeforePhaseChange" /* BeforePhaseChange */;
    }
    isTriggerable(event, stage) {
        return stage === "BeforePhaseChange" /* BeforePhaseChange */;
    }
    canUse(room, owner, content) {
        return (content.from === 7 /* PhaseFinish */ &&
            !!room.getOtherPlayers(owner.Id).find(player => {
                const jiaoYingMappers = room.getFlag(player.Id, JiaoYing.UsedTimesMappers);
                return jiaoYingMappers && jiaoYingMappers[owner.Id];
            }));
    }
    async beforeUse(room, event) {
        const availableNum = room.getOtherPlayers(event.fromId).reduce((sum, player) => {
            const originalMappers = player.getFlag(JiaoYing.UsedTimesMappers);
            if (originalMappers && originalMappers[event.fromId] && originalMappers[event.fromId] > 0) {
                sum += originalMappers[event.fromId];
            }
            return sum;
        }, 0);
        const targets = room.AlivePlayers.filter(player => player.getCardIds(0 /* HandArea */).length < 5).map(player => player.Id);
        if (targets.length < 1) {
            return false;
        }
        const resp = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
            players: targets,
            toId: event.fromId,
            requiredAmount: [1, availableNum],
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose at most {1} targets to draw cards?', this.GeneralName, availableNum).toString(),
            triggeredBySkills: [this.GeneralName],
        }, event.fromId);
        if (resp.selectedPlayers && resp.selectedPlayers.length > 0) {
            event.toIds = resp.selectedPlayers;
            return true;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        for (const toId of event.toIds) {
            const drawNum = 5 - room.getPlayerById(toId).getCardIds(0 /* HandArea */).length;
            drawNum > 0 && (await room.drawCards(drawNum, toId, 'top', event.fromId, this.GeneralName));
        }
        return true;
    }
};
JiaoYingShaodow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CompulsorySkill({ name: JiaoYing.Name, description: JiaoYing.Description })
], JiaoYingShaodow);
exports.JiaoYingShaodow = JiaoYingShaodow;
let JiaoYingBlocker = class JiaoYingBlocker extends skill_1.FilterSkill {
    canUseCard(cardId, room, owner) {
        const colors = room.getFlag(owner, JiaoYing.Name);
        if (colors === undefined) {
            return true;
        }
        if (cardId instanceof card_matcher_1.CardMatcher) {
            const suits = [];
            for (const color of colors) {
                if (suits.length === 4) {
                    break;
                }
                if (color === 1 /* Black */) {
                    suits.push(...[3 /* Club */, 1 /* Spade */]);
                }
                else if (color === 0 /* Red */) {
                    suits.push(...[4 /* Diamond */, 2 /* Heart */]);
                }
            }
            return !cardId.match(new card_matcher_1.CardMatcher({ suit: suits }));
        }
        else {
            return !colors.includes(engine_1.Sanguosha.getCardById(cardId).Color);
        }
    }
};
JiaoYingBlocker = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_jiaoying_blocker', description: 's_jiaoying_blocker_description' })
], JiaoYingBlocker);
exports.JiaoYingBlocker = JiaoYingBlocker;
let JiaoYingRemover = class JiaoYingRemover extends skill_1.TriggerSkill {
    async whenLosingSkill(room, player) {
        player.getFlag(JiaoYing.Name) && room.removeFlag(player.Id, JiaoYing.Name);
        player.removeFlag(JiaoYing.UsedTimesMappers);
        player.hasShadowSkill(JiaoYingBlocker.Name) && (await room.loseSkill(player.Id, JiaoYingBlocker.Name));
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */ || stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 104 /* PhaseChangeEvent */) {
            return content.from === 7 /* PhaseFinish */;
        }
        else if (identifier === 124 /* CardUseEvent */) {
            return (content.fromId === owner.Id &&
                !!owner.getFlag(JiaoYing.UsedTimesMappers));
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (event_packer_1.EventPacker.getIdentifier(event.triggeredOnEvent) ===
            104 /* PhaseChangeEvent */) {
            await room.loseSkill(event.fromId, this.Name);
        }
        else {
            room.getPlayerById(event.fromId).removeFlag(JiaoYing.UsedTimesMappers);
        }
        return true;
    }
};
JiaoYingRemover = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_jiaoying_remover', description: 's_jiaoying_remover_description' })
], JiaoYingRemover);
exports.JiaoYingRemover = JiaoYingRemover;
