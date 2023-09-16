"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZunWei = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZunWei = class ZunWei extends skill_1.ActiveSkill {
    constructor() {
        super(...arguments);
        this.zunWeiOptions = ['zunwei:hand', 'zunwei:equip', 'zunwei:recover'];
    }
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && (owner.getFlag(this.Name) || []).length < 3;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        const bannedOptions = room.getFlag(owner, this.Name) || [];
        return (target !== owner &&
            ((room.getPlayerById(owner).LostHp > 0 &&
                room.getPlayerById(target).Hp > room.getPlayerById(owner).Hp &&
                !bannedOptions.includes(this.zunWeiOptions[2])) ||
                [0 /* HandArea */, 1 /* EquipArea */].find(area => (area === 0 /* HandArea */
                    ? !bannedOptions.includes(this.zunWeiOptions[0])
                    : !bannedOptions.includes(this.zunWeiOptions[1])) &&
                    room.getPlayerById(target).getCardIds(area).length > room.getPlayerById(owner).getCardIds(area).length) !== undefined));
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableCard() {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        const from = room.getPlayerById(fromId);
        const to = room.getPlayerById(toIds[0]);
        const bannedOptions = room.getFlag(fromId, this.Name) || [];
        const options = [];
        from.getCardIds(0 /* HandArea */).length < to.getCardIds(0 /* HandArea */).length &&
            !bannedOptions.includes(this.zunWeiOptions[0]) &&
            options.push(this.zunWeiOptions[0]);
        from.getCardIds(1 /* EquipArea */).length < to.getCardIds(1 /* EquipArea */).length &&
            !bannedOptions.includes(this.zunWeiOptions[1]) &&
            options.push(this.zunWeiOptions[1]);
        from.LostHp > 0 &&
            from.Hp < to.Hp &&
            !bannedOptions.includes(this.zunWeiOptions[2]) &&
            options.push(this.zunWeiOptions[2]);
        let chosen = options[0];
        if (options.length > 1) {
            const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                options,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose zunwei options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to)).extract(),
                toId: fromId,
                triggeredBySkills: [this.Name],
            }, fromId, true);
            response.selectedOption && (chosen = response.selectedOption);
        }
        bannedOptions.push(chosen);
        room.setFlag(fromId, this.Name, bannedOptions);
        if (chosen === this.zunWeiOptions[0]) {
            await room.drawCards(Math.min(to.getCardIds(0 /* HandArea */).length - from.getCardIds(0 /* HandArea */).length, 5), fromId, 'top', fromId, this.Name);
        }
        else if (chosen === this.zunWeiOptions[1]) {
            const topNum = to.getCardIds(1 /* EquipArea */).length;
            let bannedTypes = [];
            while (from.getCardIds(1 /* EquipArea */).length < topNum) {
                const copyArray = bannedTypes.slice();
                const availbaleTypes = from.getEmptyEquipSections().filter(type => !copyArray.includes(type));
                if (availbaleTypes.length === 0) {
                    break;
                }
                const randomType = availbaleTypes[Math.floor(Math.random() * availbaleTypes.length)];
                const equips = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ type: [randomType] }));
                if (equips.length === 0) {
                    bannedTypes.push(randomType);
                    continue;
                }
                const randomEquip = equips[Math.floor(Math.random() * equips.length)];
                if (from.canUseCardTo(room, randomEquip, fromId)) {
                    await room.useCard({
                        fromId,
                        targetGroup: [[fromId]],
                        cardId: randomEquip,
                        customFromArea: 5 /* DrawStack */,
                    }, true);
                    bannedTypes = [];
                }
            }
        }
        else if (chosen === this.zunWeiOptions[2]) {
            const recoveredHp = to.Hp - from.Hp;
            recoveredHp > 0 && (await room.recover({ toId: fromId, recoveredHp, recoverBy: fromId }));
        }
        return true;
    }
};
ZunWei = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'zunwei', description: 'zunwei_description' })
], ZunWei);
exports.ZunWei = ZunWei;
