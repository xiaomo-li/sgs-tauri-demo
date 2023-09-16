"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XuShenShadow = exports.XuShen = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let XuShen = class XuShen extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return ['zhennan'];
    }
    isTriggerable(event, stage) {
        return stage === "PlayerDying" /* PlayerDying */;
    }
    canUse(room, owner, event) {
        return event.dying === owner.Id && owner.Hp <= 0;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.recover({
            toId: event.fromId,
            recoveredHp: 1,
            recoverBy: event.fromId,
        });
        await room.obtainSkill(event.fromId, this.RelatedSkills[0]);
        event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: true }, event.triggeredOnEvent);
        return true;
    }
};
XuShen = tslib_1.__decorate([
    skill_wrappers_1.LimitSkill({ name: 'xushen', description: 'xushen_description' })
], XuShen);
exports.XuShen = XuShen;
let XuShenShadow = class XuShenShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return (event_packer_1.EventPacker.getMiddleware(this.GeneralName, content) === true &&
            stage === "AfterPlayerDying" /* AfterPlayerDying */);
    }
    isTriggerable(event, stage) {
        return stage === "AfterPlayerDying" /* AfterPlayerDying */;
    }
    canUse(room, owner, event) {
        return (event.dying === owner.Id &&
            event_packer_1.EventPacker.getMiddleware(this.GeneralName, event) === true &&
            !owner.Dead &&
            !room.getAllPlayersFrom().find(player => player.Character.Name === 'guansuo'));
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose another player to let him change general to Guan Suo and draw 3 cards?', this.GeneralName).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { toIds } = event;
        if (!toIds) {
            return false;
        }
        const { selectedOption } = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            toId: toIds[0],
            options: ['yes', 'no'],
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to change your general to Guan Suo and draw 3 cards?', this.Name).extract(),
        }, toIds[0], true);
        if (selectedOption === 'yes') {
            const guansuo = engine_1.Sanguosha.getCharacterByCharaterName('guansuo');
            const maxHp = room.getPlayerById(toIds[0]).Role === 1 /* Lord */ &&
                room.getRoomInfo().gameMode === "standard-game" /* Standard */ &&
                room.Players.length > 4
                ? guansuo.MaxHp + 1
                : guansuo.MaxHp;
            const playerPropertiesChangeEvent = {
                changedProperties: [
                    {
                        toId: toIds[0],
                        characterId: guansuo.Id,
                        maxHp,
                        hp: maxHp,
                    },
                ],
            };
            await room.changeGeneral(playerPropertiesChangeEvent);
            await room.drawCards(3, toIds[0], 'top', event.fromId, this.Name);
        }
        return true;
    }
};
XuShenShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: XuShen.Name, description: XuShen.Description })
], XuShenShadow);
exports.XuShenShadow = XuShenShadow;
