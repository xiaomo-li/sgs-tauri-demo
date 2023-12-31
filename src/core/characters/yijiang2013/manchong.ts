import { GameCharacterExtensions } from "../../game/game_props";
import { SkillLoader } from "../../game/package_loader/loader.skills";
import { JunXing } from "../../skills/characters/yijiang2013/junxing";
import { YuCe } from "../../skills/characters/yijiang2013/yuce";
import { Character, CharacterGender, CharacterNationality } from "../character";

const skillLoaderInstance = SkillLoader.getInstance();

export class ManChong extends Character {
  constructor(id: number) {
    super(
      id,
      "manchong",
      CharacterGender.Male,
      CharacterNationality.Wei,
      3,
      3,
      GameCharacterExtensions.YiJiang2013,
      [
        skillLoaderInstance.getSkillByName(JunXing.Name),
        skillLoaderInstance.getSkillByName(YuCe.Name),
      ]
    );
  }
}
