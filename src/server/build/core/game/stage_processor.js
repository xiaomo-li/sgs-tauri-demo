"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageProcessor = void 0;
const precondition_1 = require("core/shares/libs/precondition/precondition");
const playerStagesList = {
    [0 /* PhaseBegin */]: [
        0 /* PhaseBeginStart */,
        1 /* PhaseBegin */,
        2 /* PhaseBeginEnd */,
    ],
    [1 /* PrepareStage */]: [
        3 /* PrepareStageStart */,
        4 /* PrepareStage */,
        5 /* PrepareStageEnd */,
        6 /* EndPrepareStageEnd */,
    ],
    [2 /* JudgeStage */]: [
        7 /* JudgeStageStart */,
        8 /* JudgeStage */,
        9 /* JudgeStageEnd */,
    ],
    [3 /* DrawCardStage */]: [
        10 /* DrawCardStageStart */,
        11 /* DrawCardStage */,
        12 /* DrawCardStageEnd */,
    ],
    [4 /* PlayCardStage */]: [
        13 /* PlayCardStageStart */,
        14 /* PlayCardStage */,
        15 /* PlayCardStageEnd */,
    ],
    [5 /* DropCardStage */]: [
        16 /* DropCardStageStart */,
        17 /* DropCardStage */,
        18 /* DropCardStageEnd */,
    ],
    [6 /* FinishStage */]: [
        19 /* FinishStageStart */,
        20 /* FinishStage */,
        21 /* FinishStageEnd */,
    ],
    [7 /* PhaseFinish */]: [
        22 /* PhaseFinishStart */,
        23 /* PhaseFinish */,
        24 /* PhaseFinishEnd */,
    ],
};
const gameEventStageList = {
    [145 /* LevelBeginEvent */]: ["LevelBegining" /* LevelBegining */],
    [142 /* GameStartEvent */]: [
        "BeforeGameStart" /* BeforeGameStart */,
        "GameStarting" /* GameStarting */,
        "AfterGameStarted" /* AfterGameStarted */,
    ],
    [143 /* GameBeginEvent */]: [
        "BeforeGameBegin" /* BeforeGameBegin */,
        "GameBeginning" /* GameBeginning */,
        "AfterGameBegan" /* AfterGameBegan */,
    ],
    [144 /* CircleStartEvent */]: [
        "BeforeCircleStart" /* BeforeCircleStart */,
        "CircleStarting" /* CircleStarting */,
        "AfterCircleStarted" /* AfterCircleStarted */,
    ],
    [124 /* CardUseEvent */]: [
        "BeforeCardUseEffect" /* BeforeCardUseEffect */,
        "AfterCardUseDeclared" /* AfterCardUseDeclared */,
        "AfterCardTargetDeclared" /* AfterCardTargetDeclared */,
        "CardUsing" /* CardUsing */,
        "AfterCardUseEffect" /* AfterCardUseEffect */,
    ],
    [125 /* CardEffectEvent */]: [
        "PreCardEffect" /* PreCardEffect */,
        "BeforeCardEffect" /* BeforeCardEffect */,
        "CardEffecting" /* CardEffecting */,
        "AfterCardEffect" /* AfterCardEffect */,
    ],
    [123 /* CardResponseEvent */]: [
        "BeforeCardResponseEffect" /* BeforeCardResponseEffect */,
        "CardResponsing" /* CardResponsing */,
        "AfterCardResponseEffect" /* AfterCardResponseEffect */,
    ],
    [127 /* DrawCardEvent */]: [
        "BeforeDrawCardEffect" /* BeforeDrawCardEffect */,
        "CardDrawing" /* CardDrawing */,
        "AfterDrawCardEffect" /* AfterDrawCardEffect */,
    ],
    [137 /* DamageEvent */]: [
        "OnDamageConfirmed" /* OnDamageConfirmed */,
        "DamageStart" /* DamageStart */,
        "DamageEffect" /* DamageEffect */,
        "DamagedEffect" /* DamagedEffect */,
        "DamageDone" /* DamageDone */,
        "AfterDamageEffect" /* AfterDamageEffect */,
        "AfterDamagedEffect" /* AfterDamagedEffect */,
        "DamageFinishedEffect" /* DamageFinishedEffect */,
    ],
    [140 /* JudgeEvent */]: [
        "OnJudge" /* OnJudge */,
        "BeforeJudgeEffect" /* BeforeJudgeEffect */,
        "JudgeEffect" /* JudgeEffect */,
        "AfterJudgeEffect" /* AfterJudgeEffect */,
    ],
    [152 /* PlayerDyingEvent */]: ["PlayerDying" /* PlayerDying */, "AfterPlayerDying" /* AfterPlayerDying */],
    [153 /* PlayerDiedEvent */]: [
        "PrePlayerDie" /* PrePlayerDied */,
        "PlayerDied" /* PlayerDied */,
        "AfterPlayerDied" /* AfterPlayerDied */,
    ],
    [132 /* SkillUseEvent */]: [
        "BeforeSkillUse" /* BeforeSkillUse */,
        "SkillUsing" /* SkillUsing */,
        "AfterSkillUsed" /* AfterSkillUsed */,
    ],
    [133 /* SkillEffectEvent */]: [
        "BeforeSkillEffect" /* BeforeSkillEffect */,
        "SkillEffecting" /* SkillEffecting */,
        "AfterSkillEffected" /* AfterSkillEffected */,
    ],
    [138 /* RecoverEvent */]: [
        "BeforeRecoverEffect" /* BeforeRecoverEffect */,
        "RecoverEffecting" /* RecoverEffecting */,
        "AfterRecoverEffect" /* AfterRecoverEffect */,
    ],
    [127 /* DrawCardEvent */]: [
        "BeforeDrawCardEffect" /* BeforeDrawCardEffect */,
        "CardDrawing" /* CardDrawing */,
        "AfterDrawCardEffect" /* AfterDrawCardEffect */,
    ],
    [134 /* PinDianEvent */]: [
        "BeforePinDianEffect" /* BeforePinDianEffect */,
        "PinDianEffect" /* PinDianEffect */,
        "AfterPinDianEffect" /* AfterPinDianEffect */,
    ],
    [131 /* AimEvent */]: ["OnAim" /* OnAim */, "OnAimmed" /* OnAimmed */, "AfterAim" /* AfterAim */, "AfterAimmed" /* AfterAimmed */],
    [104 /* PhaseChangeEvent */]: [
        "BeforePhaseChange" /* BeforePhaseChange */,
        "PhaseChanged" /* PhaseChanged */,
        "AfterPhaseChanged" /* AfterPhaseChanged */,
    ],
    [105 /* PhaseStageChangeEvent */]: [
        "BeforeStageChange" /* BeforeStageChange */,
        "StageChanged" /* StageChanged */,
        "AfterStageChanged" /* AfterStageChanged */,
    ],
    [128 /* MoveCardEvent */]: [
        "BeforeCardMoving" /* BeforeCardMoving */,
        "CardMoving" /* CardMoving */,
        "AfterCardMoved" /* AfterCardMoved */,
    ],
    [139 /* HpChangeEvent */]: [
        "BeforeHpChange" /* BeforeHpChange */,
        "HpChanging" /* HpChanging */,
        "AfterHpChange" /* AfterHpChange */,
    ],
    [188 /* ArmorChangeEvent */]: [
        "BeforeArmorChange" /* BeforeArmorChange */,
        "ArmorChanging" /* ArmorChanging */,
        "AfterArmorChange" /* AfterArmorChange */,
    ],
    [119 /* ChainLockedEvent */]: [
        "BeforeChainingOn" /* BeforeChainingOn */,
        "Chaining" /* Chaining */,
        "AfterChainedOn" /* AfterChainedOn */,
    ],
    [135 /* LoseHpEvent */]: ["BeforeLoseHp" /* BeforeLoseHp */, "LosingHp" /* LosingHp */, "AfterLostHp" /* AfterLostHp */],
    [156 /* PlayerTurnOverEvent */]: ["TurningOver" /* TurningOver */, "TurnedOver" /* TurnedOver */],
};
class StageProcessor {
    constructor(logger) {
        this.logger = logger;
        this.gameEventStageList = [];
    }
    involve(identifier) {
        const stageList = precondition_1.Precondition.exists(gameEventStageList[identifier], `Unable to get game event of ${identifier}`);
        this.gameEventStageList.unshift(stageList.slice());
        const currentGameEventStage = this.gameEventStageList[0][0];
        this.gameEventStageList[0].shift();
        return currentGameEventStage;
    }
    getNextStage() {
        precondition_1.Precondition.assert(this.gameEventStageList.length > 0, 'stage_processor.ts >> getNextStage() >> error: getting in empty gameEventStageList');
        if (this.gameEventStageList[0].length === 0) {
            return;
        }
        return this.gameEventStageList[0][0];
    }
    popStage() {
        if (this.gameEventStageList.length === 0) {
            return;
        }
        if (this.gameEventStageList[0].length === 0) {
            this.gameEventStageList.shift();
            return;
        }
        const stage = this.gameEventStageList[0][0];
        this.gameEventStageList[0].shift();
        return stage;
    }
    clearProcess() {
        this.gameEventStageList = [];
    }
    skipEventProcess() {
        this.gameEventStageList.shift();
    }
    isInsideEvent(identifier, stage) {
        if (stage === undefined) {
            return false;
        }
        const stageList = precondition_1.Precondition.exists(gameEventStageList[identifier], `Can't find stage events of ${identifier}`);
        return stageList.includes(stage);
    }
    createPlayerStage(stage) {
        if (stage !== undefined) {
            return playerStagesList[stage].slice();
        }
        else {
            const stages = [
                0 /* PhaseBegin */,
                1 /* PrepareStage */,
                2 /* JudgeStage */,
                3 /* DrawCardStage */,
                4 /* PlayCardStage */,
                5 /* DropCardStage */,
                6 /* FinishStage */,
                7 /* PhaseFinish */,
            ];
            let createdStages = [];
            for (const stage of stages) {
                createdStages = [...createdStages, ...playerStagesList[stage].slice()];
            }
            return createdStages;
        }
    }
    isInsidePlayerPhase(phase, stage) {
        return playerStagesList[phase].includes(stage);
    }
    getInsidePlayerPhase(specificStage) {
        if (specificStage === undefined) {
            return 0 /* PhaseBegin */;
        }
        for (const [stage, stageList] of Object.entries(playerStagesList)) {
            if (stageList.includes(specificStage)) {
                return parseInt(stage, 10);
            }
        }
        throw new Error(`Unknown player stage: ${specificStage}`);
    }
}
exports.StageProcessor = StageProcessor;
