"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YiSeDebuff = exports.YiSe = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YiSe = class YiSe extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        return (content.infos.find(info => info.fromId === owner.Id &&
            info.movingCards.find(cardInfo => cardInfo.fromArea === 0 /* HandArea */ || cardInfo.fromArea === 1 /* EquipArea */) &&
            info.toId !== undefined &&
            info.toId !== owner.Id &&
            !room.getPlayerById(info.toId).Dead &&
            info.toArea === 0 /* HandArea */) !== undefined);
    }
    async beforeUse(room, event) {
        const { fromId } = event;
        const moveCardEvent = event.triggeredOnEvent;
        const info = moveCardEvent.infos.find(info => info.fromId === fromId &&
            info.movingCards.find(cardInfo => engine_1.Sanguosha.getCardById(cardInfo.card).isRed() &&
                (cardInfo.fromArea === 0 /* HandArea */ || cardInfo.fromArea === 1 /* EquipArea */)) &&
            info.toId !== undefined &&
            info.toId !== fromId &&
            room.getPlayerById(info.toId).LostHp > 0 &&
            !room.getPlayerById(info.toId).Dead &&
            info.toArea === 0 /* HandArea */);
        let invoked = false;
        if (info) {
            const response = await room.doAskForCommonly(171 /* AskForSkillUseEvent */, {
                invokeSkillNames: [this.Name],
                toId: fromId,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to let {1} recover 1 hp?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(info.toId))).extract(),
            }, fromId);
            invoked = !!response.invoke;
            response.invoke && event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: info.toId }, event);
        }
        return (invoked ||
            moveCardEvent.infos.find(info => info.fromId === fromId &&
                info.movingCards.find(cardInfo => engine_1.Sanguosha.getCardById(cardInfo.card).isBlack() &&
                    (cardInfo.fromArea === 0 /* HandArea */ || cardInfo.fromArea === 1 /* EquipArea */)) &&
                info.toId !== undefined &&
                info.toId !== fromId &&
                !room.getPlayerById(info.toId).Dead &&
                info.toArea === 0 /* HandArea */) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const moveCardEvent = event.triggeredOnEvent;
        const redInfo = moveCardEvent.infos.find(info => info.fromId === fromId &&
            info.movingCards.find(cardInfo => engine_1.Sanguosha.getCardById(cardInfo.card).isRed() &&
                (cardInfo.fromArea === 0 /* HandArea */ || cardInfo.fromArea === 1 /* EquipArea */)) &&
            info.toId !== undefined &&
            info.toId !== fromId &&
            room.getPlayerById(info.toId).LostHp > 0 &&
            !room.getPlayerById(info.toId).Dead &&
            info.toArea === 0 /* HandArea */);
        if (redInfo) {
            await room.recover({
                toId: redInfo.toId,
                recoveredHp: 1,
                recoverBy: fromId,
            });
        }
        const blackInfo = moveCardEvent.infos.find(info => info.fromId === fromId &&
            info.movingCards.find(cardInfo => engine_1.Sanguosha.getCardById(cardInfo.card).isBlack() &&
                (cardInfo.fromArea === 0 /* HandArea */ || cardInfo.fromArea === 1 /* EquipArea */)) &&
            info.toId !== undefined &&
            info.toId !== fromId &&
            !room.getPlayerById(info.toId).Dead &&
            info.toArea === 0 /* HandArea */);
        if (blackInfo) {
            let originalDMG = room.getFlag(blackInfo.toId, this.Name) || 0;
            originalDMG++;
            room.setFlag(blackInfo.toId, this.Name, originalDMG, translation_json_tool_1.TranslationPack.translationJsonPatcher('yise points: {0}', originalDMG).toString());
            room.getPlayerById(blackInfo.toId).hasShadowSkill(YiSeDebuff.Name) ||
                (await room.obtainSkill(blackInfo.toId, YiSeDebuff.Name));
        }
        return true;
    }
};
YiSe = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'yise', description: 'yise_description' })
], YiSe);
exports.YiSe = YiSe;
let YiSeDebuff = class YiSeDebuff extends skill_1.TriggerSkill {
    async whenDead(room, player) {
        await room.loseSkill(player.Id, this.Name);
        room.removeFlag(player.Id, YiSe.Name);
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "DamagedEffect" /* DamagedEffect */;
    }
    canUse(room, owner, event) {
        return (event.toId === owner.Id &&
            event.cardIds !== undefined &&
            engine_1.Sanguosha.getCardById(event.cardIds[0]).GeneralName === 'slash');
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const additionalDamage = room.getFlag(event.fromId, YiSe.Name);
        if (additionalDamage) {
            room.removeFlag(event.fromId, YiSe.Name);
            const damageEvent = event.triggeredOnEvent;
            damageEvent.damage += additionalDamage;
        }
        await room.loseSkill(event.fromId, this.Name);
        return true;
    }
};
YiSeDebuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_yise_debuff', description: 's_yise_debuff_description' })
], YiSeDebuff);
exports.YiSeDebuff = YiSeDebuff;
