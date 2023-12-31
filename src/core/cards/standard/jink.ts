import { GameCardExtensions } from "../../game/game_props";
import { SkillLoader } from "../../game/package_loader/loader.skills";
import { JinkSkill } from "../../skills/cards/standard/jink";
import { BasicCard } from "../basic_card";
import { CardSuit } from "../libs/card_props";

export class Jink extends BasicCard {
  constructor(id: number, cardNumber: number, suit: CardSuit) {
    super(
      id,
      cardNumber,
      suit,
      0,
      "jink",
      "jink_description",
      GameCardExtensions.Standard,
      SkillLoader.getInstance().getSkillByName("jink")
    );
  }

  public get Skill() {
    return this.skill as JinkSkill;
  }
}
