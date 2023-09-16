"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HongJu = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const zhengrong_1 = require("./zhengrong");
let HongJu = class HongJu extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return ['qingce'];
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ && event.toStage === 3 /* PrepareStageStart */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && room.enableToAwaken(this.Name, owner);
    }
    async onTrigger(room, skillUseEvent) {
        skillUseEvent.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} activated awakening skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId)), this.Name).extract();
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const from = room.getPlayerById(fromId);
        const rongs = from.getCardIds(3 /* OutsideArea */, zhengrong_1.ZhengRong.Name);
        if (from.getCardIds(0 /* HandArea */).length > 0 && rongs.length > 0) {
            const { selectedCards } = await room.doAskForCommonly(165 /* AskForChoosingCardEvent */, {
                amount: rongs.length,
                customCardFields: {
                    [zhengrong_1.ZhengRong.Name]: rongs,
                    [0 /* HandArea */]: from.getCardIds(0 /* HandArea */),
                },
                toId: fromId,
                customTitle: translation_json_tool_1.TranslationPack.translationJsonPatcher('hongju: please choose {1} cards to be new Rong', rongs.length).toString(),
            }, fromId);
            if (selectedCards) {
                const toGain = rongs.filter(card => !selectedCards.includes(card));
                if (toGain.length > 0) {
                    const toRong = selectedCards.filter(card => !rongs.includes(card));
                    await room.moveCards({
                        movingCards: toRong.map(card => ({ card, fromArea: 0 /* HandArea */ })),
                        fromId,
                        toId: fromId,
                        toArea: 3 /* OutsideArea */,
                        moveReason: 2 /* ActiveMove */,
                        toOutsideArea: zhengrong_1.ZhengRong.Name,
                        isOutsideAreaInPublic: false,
                        proposer: fromId,
                        movedByReason: this.Name,
                    });
                    await room.moveCards({
                        movingCards: toGain.map(card => ({ card, fromArea: 3 /* OutsideArea */ })),
                        fromId,
                        toId: fromId,
                        toArea: 0 /* HandArea */,
                        moveReason: 2 /* ActiveMove */,
                        proposer: fromId,
                        movedByReason: this.Name,
                    });
                }
            }
        }
        await room.changeMaxHp(fromId, -1);
        await room.obtainSkill(fromId, 'qingce', true);
        return true;
    }
};
HongJu = tslib_1.__decorate([
    skill_1.AwakeningSkill({ name: 'hongju', description: 'hongju_description' })
], HongJu);
exports.HongJu = HongJu;
