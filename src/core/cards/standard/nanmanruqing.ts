import { GameCardExtensions } from "../../game/game_props";
import { SkillLoader } from "../../game/package_loader/loader.skills";
import { NanManRuQingSkill } from "../../skills/cards/standard/nanmanruqing";
import { Others } from "../card";
import type { CardSuit, RealCardId } from "../libs/card_props";
import { TrickCard } from "../trick_card";

@Others
export class NanManRuQing extends TrickCard {
  constructor(id: RealCardId, cardNumber: number, suit: CardSuit) {
    super(
      id,
      cardNumber,
      suit,
      0,
      "nanmanruqing",
      "nanmanruqing_description",
      GameCardExtensions.Standard,
      SkillLoader.getInstance().getSkillByName("nanmanruqing")
    );
  }

  public get Skill() {
    return this.skill as NanManRuQingSkill;
  }
}
