import { GameCharacterExtensions } from "../../game/game_props";
import { SkillLoader } from "../../game/package_loader/loader.skills";
import { Character, CharacterGender, CharacterNationality } from "../character";

const skillLorderInstance = SkillLoader.getInstance();

export class MiFangFuShiRen extends Character {
  constructor(id: number) {
    super(
      id,
      "mifangfushiren",
      CharacterGender.Male,
      CharacterNationality.Shu,
      4,
      4,
      GameCharacterExtensions.Decade,
      [skillLorderInstance.getSkillByName("fengshi")]
    );
  }
}
