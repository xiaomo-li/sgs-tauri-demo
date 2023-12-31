import { GameCharacterExtensions } from "../../game/game_props";
import { SkillLoader } from "../../game/package_loader/loader.skills";
import { QiuYuan, ZhuiKong } from "../../skills";
import { Character, CharacterGender, CharacterNationality } from "../character";

const skillLoader = SkillLoader.getInstance();

export class FuHuangHou extends Character {
  constructor(id: number) {
    super(
      id,
      "fuhuanghou",
      CharacterGender.Female,
      CharacterNationality.Qun,
      3,
      3,
      GameCharacterExtensions.YiJiang2013,
      [
        ...skillLoader.getSkillsByName(ZhuiKong.Name),
        skillLoader.getSkillByName(QiuYuan.Name),
      ]
    );
  }
}
