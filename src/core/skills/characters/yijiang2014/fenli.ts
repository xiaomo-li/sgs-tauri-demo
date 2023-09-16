import { GameEventIdentifiers, ServerEventFinder } from "../../../event/event";
import {
  AllStage,
  PhaseChangeStage,
  PlayerPhase,
} from "../../../game/stage_processor";
import { Player } from "../../../player/player";
import { PlayerCardsArea } from "../../../player/player_props";
import { Room } from "../../../room/room";
import { Functional } from "../../../shares/libs/functional";
import { TriggerSkill } from "../../skill";
import { CommonSkill } from "../../skill_wrappers";
import {
  PatchedTranslationObject,
  TranslationPack,
} from "../../../translations/translation_json_tool";

@CommonSkill({ name: "fenli", description: "fenli_description" })
export class FenLi extends TriggerSkill {
  public isTriggerable(
    event: ServerEventFinder<GameEventIdentifiers.PhaseChangeEvent>,
    stage?: AllStage
  ): boolean {
    return stage === PhaseChangeStage.AfterPhaseChanged;
  }

  public canUse(
    room: Room,
    owner: Player,
    content: ServerEventFinder<GameEventIdentifiers.PhaseChangeEvent>
  ): boolean {
    return (
      content.toPlayer === owner.Id &&
      ((content.to === PlayerPhase.DrawCardStage &&
        room
          .getOtherPlayers(owner.Id)
          .find(
            (player) =>
              player.getCardIds(PlayerCardsArea.HandArea).length >
              owner.getCardIds(PlayerCardsArea.HandArea).length
          ) === undefined) ||
        (content.to === PlayerPhase.PlayCardStage &&
          room
            .getOtherPlayers(owner.Id)
            .find((player) => player.Hp > owner.Hp) === undefined) ||
        (content.to === PlayerPhase.DropCardStage &&
          owner.getCardIds(PlayerCardsArea.EquipArea).length > 0 &&
          room
            .getOtherPlayers(owner.Id)
            .find(
              (player) =>
                player.getCardIds(PlayerCardsArea.EquipArea).length >
                owner.getCardIds(PlayerCardsArea.EquipArea).length
            ) === undefined))
    );
  }

  public getSkillLog(
    room: Room,
    owner: Player,
    event: ServerEventFinder<GameEventIdentifiers.PhaseChangeEvent>
  ): PatchedTranslationObject | string {
    return TranslationPack.translationJsonPatcher(
      "{0}: do you want to skip {1} ?",
      this.Name,
      Functional.getPlayerPhaseRawText(event.to)
    ).extract();
  }

  public async onTrigger(): Promise<boolean> {
    return true;
  }

  public async onEffect(
    room: Room,
    event: ServerEventFinder<GameEventIdentifiers.SkillEffectEvent>
  ): Promise<boolean> {
    await room.skip(
      event.fromId,
      (
        event.triggeredOnEvent as ServerEventFinder<GameEventIdentifiers.PhaseChangeEvent>
      ).to
    );

    return true;
  }
}
