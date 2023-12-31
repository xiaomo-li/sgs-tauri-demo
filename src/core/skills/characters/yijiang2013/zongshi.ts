import { CardId } from "../../../cards/libs/card_props";
import {
  CardMoveArea,
  CardMoveReason,
  GameEventIdentifiers,
  ServerEventFinder,
} from "../../../event/event";
import { AllStage, PinDianStage } from "../../../game/stage_processor";
import { Player } from "../../../player/player";
import { PlayerCardsArea } from "../../../player/player_props";
import { Room } from "../../../room/room";
import { TriggerSkill } from "../../skill";
import { CommonSkill } from "../../skill_wrappers";

@CommonSkill({ name: "j3_zongshi", description: "j3_zongshi_description" })
export class J3ZongShi extends TriggerSkill {
  public isTriggerable(
    event: ServerEventFinder<GameEventIdentifiers>,
    stage: AllStage
  ): boolean {
    return stage === PinDianStage.PinDianResultConfirmed;
  }

  public canUse(
    room: Room,
    owner: Player,
    pindianEvent: ServerEventFinder<GameEventIdentifiers.PinDianEvent>
  ): boolean {
    const currentProcedureIndex = pindianEvent.procedures.length - 1;
    return (
      pindianEvent.fromId === owner.Id ||
      pindianEvent.procedures[currentProcedureIndex].toId === owner.Id
    );
  }

  public async onTrigger(): Promise<boolean> {
    return true;
  }

  public async onEffect(
    room: Room,
    skillEffectEvent: ServerEventFinder<GameEventIdentifiers.SkillEffectEvent>
  ): Promise<boolean> {
    const pindianEvent =
      skillEffectEvent.triggeredOnEvent as ServerEventFinder<GameEventIdentifiers.PinDianEvent>;
    const currentProcedureIndex = pindianEvent.procedures.length - 1;
    const currentProcedure = pindianEvent.procedures[currentProcedureIndex];
    let moveCardId: CardId;
    if (currentProcedure.winner === skillEffectEvent.fromId) {
      moveCardId = currentProcedure.cardId;
    } else {
      moveCardId = pindianEvent.cardId!;
    }

    await room.moveCards({
      movingCards: [
        { card: moveCardId, fromArea: CardMoveArea.ProcessingArea },
      ],
      moveReason: CardMoveReason.ActivePrey,
      toId: skillEffectEvent.fromId,
      toArea: PlayerCardsArea.HandArea,
      proposer: skillEffectEvent.fromId,
      movedByReason: this.Name,
    });

    return true;
  }
}
