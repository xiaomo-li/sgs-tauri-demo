import { GameEventIdentifiers, ServerEventFinder } from "../../../event/event";
import {
  AllStage,
  PhaseStageChangeStage,
  PlayerPhaseStages,
} from "../../../game/stage_processor";
import { Player } from "../../../player/player";
import { Room } from "../../../room/room";
import { LimitSkill, TriggerSkill } from "../../skill";

@LimitSkill({ name: "tishen", description: "tishen_description" })
export class TiShen extends TriggerSkill {
  isTriggerable(
    event: ServerEventFinder<GameEventIdentifiers.PhaseStageChangeEvent>,
    stage?: AllStage
  ) {
    return stage === PhaseStageChangeStage.StageChanged;
  }

  canUse(
    room: Room,
    owner: Player,
    content: ServerEventFinder<GameEventIdentifiers.PhaseStageChangeEvent>
  ) {
    return (
      owner.Id === content.playerId &&
      PlayerPhaseStages.PrepareStageStart === content.toStage &&
      owner.Hp < owner.MaxHp
    );
  }

  async onTrigger(
    room: Room,
    skillUseEvent: ServerEventFinder<GameEventIdentifiers.SkillEffectEvent>
  ) {
    return true;
  }

  async onEffect(
    room: Room,
    skillUseEvent: ServerEventFinder<GameEventIdentifiers.SkillEffectEvent>
  ) {
    const { fromId } = skillUseEvent;
    const from = room.getPlayerById(fromId);
    const recover = from.MaxHp - from.Hp;

    await room.recover({
      recoveredHp: recover,
      recoverBy: fromId,
      toId: fromId,
    });

    await room.drawCards(recover, fromId, "top", fromId, this.Name);

    return true;
  }
}
