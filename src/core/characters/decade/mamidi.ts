import { GameCharacterExtensions } from "../../game/game_props";
import { SkillLoader } from "../../game/package_loader/loader.skills";
import { Character, CharacterGender, CharacterNationality } from "../character";

const skillLorderInstance = SkillLoader.getInstance();

export class MaMiDi extends Character {
  constructor(id: number) {
    super(
      id,
      "mamidi",
      CharacterGender.Male,
      CharacterNationality.Qun,
      6,
      4,
      GameCharacterExtensions.Decade,
      [
        ...skillLorderInstance.getSkillsByName("bingjie"),
        skillLorderInstance.getSkillByName("zhengding"),
      ]
    );
  }
}
