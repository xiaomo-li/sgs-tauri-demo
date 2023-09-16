import { GameCharacterExtensions } from "../../game/game_props";
import { SkillLoader } from "../../game/package_loader/loader.skills";
import { Character, CharacterGender, CharacterNationality } from "../character";

const skillLorderInstance = SkillLoader.getInstance();

export class FengXi extends Character {
  constructor(id: number) {
    super(
      id,
      "fengxi",
      CharacterGender.Male,
      CharacterNationality.Wu,
      3,
      3,
      GameCharacterExtensions.Decade,
      [
        skillLorderInstance.getSkillByName("yusui"),
        skillLorderInstance.getSkillByName("boyan"),
      ]
    );
  }
}
