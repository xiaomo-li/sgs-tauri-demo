"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PveClassicAiEx = exports.PveClassicAi = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
// 渐：摸牌阶段可以多摸一张牌
// 制：手牌上限等于体力值
// 袭：出牌阶段可以多出一张杀
// 疾：初始手牌数量加3
// 御：受到伤害后可以摸一张牌
// 盈：体力及体力上限加1
let PveClassicAi = class PveClassicAi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return (stage === "CardDrawing" /* CardDrawing */ ||
            stage === "AfterDamagedEffect" /* AfterDamagedEffect */ ||
            stage === "LevelBegining" /* LevelBegining */);
    }
    canUse(room, owner, content) {
        switch (event_packer_1.EventPacker.getIdentifier(content)) {
            case 127 /* DrawCardEvent */:
                const markPlayer = room.AlivePlayers.find(player => player.getMark("pve_jian" /* PveJian */));
                const drawCardEvent = content;
                const drawCardPlayer = room.getPlayerById(drawCardEvent.fromId);
                return (owner.Id === drawCardPlayer.Id &&
                    room.CurrentPlayerPhase === 3 /* DrawCardStage */ &&
                    drawCardEvent.bySpecialReason === 0 /* GameStage */ &&
                    markPlayer !== undefined &&
                    markPlayer.Role === drawCardPlayer.Role);
            case 137 /* DamageEvent */:
                const damageEvent = content;
                const damagedPlayer = room.getPlayerById(damageEvent.toId);
                const hasMarkPlayer = room.AlivePlayers.find(player => player.getMark("pve_yu" /* PveYu */));
                return (owner.Id === damageEvent.toId && hasMarkPlayer !== undefined && hasMarkPlayer.Role === damagedPlayer.Role);
            case 145 /* LevelBeginEvent */:
                return owner.getMark("pve_ying" /* PveYing */) > 0 || owner.getMark("pve_ji" /* PveJi */) > 0;
            default:
                return false;
        }
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (event.triggeredOnEvent === undefined) {
            return false;
        }
        const identifier = event_packer_1.EventPacker.getIdentifier(event.triggeredOnEvent);
        switch (identifier) {
            case 127 /* DrawCardEvent */:
                const drawCardEvent = event.triggeredOnEvent;
                drawCardEvent.drawAmount += 1;
                break;
            case 137 /* DamageEvent */:
                const damageEvent = event.triggeredOnEvent;
                await room.drawCards(1, damageEvent.toId, 'top', damageEvent.toId, this.Name);
                break;
            case 145 /* LevelBeginEvent */:
                const owner = room.getPlayerById(event.fromId);
                if (owner.getMark("pve_ji" /* PveJi */) > 0) {
                    const partners = room.AlivePlayers.filter(player => player.Role === owner.Role);
                    for (const player of partners) {
                        await room.drawCards(3, player.Id, 'top', player.Id, this.Name);
                    }
                }
                if (owner.getMark("pve_ying" /* PveYing */) > 0) {
                    const partners = room.AlivePlayers.filter(player => player.Role === owner.Role);
                    const changedProperties = [];
                    for (const player of partners) {
                        changedProperties.push({
                            toId: player.Id,
                            hp: player.Hp + 1,
                            maxHp: player.MaxHp + 1,
                        });
                    }
                    room.changePlayerProperties({ changedProperties });
                }
                break;
            default:
                return false;
        }
        return true;
    }
};
PveClassicAi = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'pve_classic_ai', description: 'pve_classic_ai_desc' })
], PveClassicAi);
exports.PveClassicAi = PveClassicAi;
let PveClassicAiEx = class PveClassicAiEx extends skill_1.RulesBreakerSkill {
    breakBaseCardHoldNumber(room, owner) {
        const ais = room.Players.filter(player => player.Role === owner.Role);
        if (ais.find(player => player.getMark("pve_zhi" /* PveZhi */)) !== undefined) {
            return owner.MaxHp;
        }
        else {
            return owner.Hp;
        }
    }
    breakCardUsableTimes(cardId, room, owner) {
        const ais = room.Players.filter(player => player.Role === owner.Role);
        if (ais.find(player => player.getMark("pve_xi" /* PveXi */)) !== undefined) {
            if (cardId instanceof card_matcher_1.CardMatcher) {
                return cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] })) ? 1 : 0;
            }
            else {
                return engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash' ? 1 : 0;
            }
        }
        else {
            return 0;
        }
    }
};
PveClassicAiEx = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: PveClassicAi.Name, description: PveClassicAi.Description })
], PveClassicAiEx);
exports.PveClassicAiEx = PveClassicAiEx;
