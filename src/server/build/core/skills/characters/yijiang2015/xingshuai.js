"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XingShuaiShadow = exports.XingShuai = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let XingShuai = class XingShuai extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PlayerDying" /* PlayerDying */;
    }
    canUse(room, owner, content) {
        return (content.dying === owner.Id &&
            owner.Hp <= 0 &&
            room.getOtherPlayers(owner.Id).find(player => player.Nationality === 0 /* Wei */) !== undefined);
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to let other Wei generals to choose whether let you recover 1 hp?', this.Name).extract();
    }
    async onTrigger(room, event) {
        event.animation = [
            {
                from: event.fromId,
                tos: room
                    .getOtherPlayers(event.fromId)
                    .filter(player => player.Nationality === 0 /* Wei */)
                    .map(player => player.Id),
            },
        ];
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        for (const other of room
            .getOtherPlayers(fromId)
            .filter(player => player.Nationality === 0 /* Wei */)) {
            const { selectedOption } = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                toId: other.Id,
                options: ['yes', 'no'],
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to let {1} recover 1 hp, then you will take 1 damage?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId))).extract(),
            }, other.Id, true);
            if (selectedOption === 'yes') {
                const originalPlayers = room.getFlag(fromId, this.Name) || [];
                originalPlayers.push(other.Id);
                room.getPlayerById(fromId).setFlag(this.Name, originalPlayers);
                event_packer_1.EventPacker.addMiddleware({ tag: this.GeneralName, data: true }, event.triggeredOnEvent);
                await room.recover({
                    toId: fromId,
                    recoveredHp: 1,
                    recoverBy: other.Id,
                });
            }
        }
        return true;
    }
};
XingShuai = tslib_1.__decorate([
    skill_wrappers_1.LordSkill,
    skill_wrappers_1.LimitSkill({ name: 'xingshuai', description: 'xingshuai_description' })
], XingShuai);
exports.XingShuai = XingShuai;
let XingShuaiShadow = class XingShuaiShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return (stage === "AfterPlayerDying" /* AfterPlayerDying */ &&
            event_packer_1.EventPacker.getMiddleware(this.GeneralName, content) === true);
    }
    afterDead(room, owner, content, stage) {
        return (stage === "AfterPlayerDying" /* AfterPlayerDying */ &&
            event_packer_1.EventPacker.getMiddleware(this.GeneralName, content) === true);
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterPlayerDying" /* AfterPlayerDying */;
    }
    canUse(room, owner, content) {
        return content.dying === owner.Id && event_packer_1.EventPacker.getMiddleware(this.GeneralName, content) === true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const players = room.getFlag(event.fromId, this.GeneralName);
        room.sortPlayersByPosition(players);
        for (const player of players) {
            await room.damage({
                toId: player,
                damage: 1,
                damageType: "normal_property" /* Normal */,
                triggeredBySkills: [this.Name],
            });
        }
        return true;
    }
};
XingShuaiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: XingShuai.Name, description: XingShuai.Description })
], XingShuaiShadow);
exports.XingShuaiShadow = XingShuaiShadow;
