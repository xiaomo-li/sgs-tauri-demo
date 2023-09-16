"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterLoader = void 0;
const benevolence_1 = require("core/characters/benevolence");
const biographies_1 = require("core/characters/biographies");
const decade_1 = require("core/characters/decade");
const fire_1 = require("core/characters/fire");
const forest_1 = require("core/characters/forest");
const god_1 = require("core/characters/god");
const limited_1 = require("core/characters/limited");
const mobile_1 = require("core/characters/mobile");
const mountain_1 = require("core/characters/mountain");
const pve_1 = require("core/characters/pve");
const shadow_1 = require("core/characters/shadow");
const sincerity_1 = require("core/characters/sincerity");
const sp_1 = require("core/characters/sp");
const spark_1 = require("core/characters/spark");
const standard_1 = require("core/characters/standard");
const strategem_1 = require("core/characters/strategem");
const thunder_1 = require("core/characters/thunder");
const wind_1 = require("core/characters/wind");
const wisdom_1 = require("core/characters/wisdom");
const yijiang2011_1 = require("core/characters/yijiang2011");
const yijiang2012_1 = require("core/characters/yijiang2012");
const yijiang2013_1 = require("core/characters/yijiang2013");
const yijiang2014_1 = require("core/characters/yijiang2014");
const yijiang2015_1 = require("core/characters/yijiang2015");
const yuan6_1 = require("core/characters/yuan6");
const yuan7_1 = require("core/characters/yuan7");
class CharacterLoader {
    constructor() {
        this.characters = {};
        this.loadCharacters();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new CharacterLoader();
        }
        return this.instance;
    }
    loadCharacters() {
        let index = 0;
        for (const [packageName, loader] of Object.entries(CharacterLoader.CharacterLoaders)) {
            const characters = loader(index);
            this.characters[packageName] = characters;
            index += characters.length;
        }
    }
    getAllCharacters() {
        return Object.values(this.characters).reduce((addedCards, characters) => addedCards.concat(characters), []);
    }
    getPackages(...extensions) {
        return extensions.reduce((addedCards, extension) => addedCards.concat(this.characters[extension]), []);
    }
}
exports.CharacterLoader = CharacterLoader;
CharacterLoader.CharacterLoaders = {
    ["standard" /* Standard */]: standard_1.StandardCharacterPackage,
    ["wind" /* Wind */]: wind_1.WindCharacterPackage,
    ["fire" /* Fire */]: fire_1.FireCharacterPackage,
    ["forest" /* Forest */]: forest_1.ForestCharacterPackage,
    ["mountain" /* Mountain */]: mountain_1.MountainCharacterPackage,
    ["shadow" /* Shadow */]: shadow_1.ShadowCharacterPackage,
    ["thunder" /* Thunder */]: thunder_1.ThunderCharacterPackage,
    ["god" /* God */]: god_1.GodCharacterPackage,
    ["yijiang2011" /* YiJiang2011 */]: yijiang2011_1.YiJiang2011Package,
    ["yijiang2012" /* YiJiang2012 */]: yijiang2012_1.YiJiang2012Package,
    ["yijiang2013" /* YiJiang2013 */]: yijiang2013_1.YiJiang2013Package,
    ["yijiang2014" /* YiJiang2014 */]: yijiang2014_1.YiJiang2014Package,
    ["yijiang2015" /* YiJiang2015 */]: yijiang2015_1.YiJiang2015Package,
    ["yuan6" /* Yuan6 */]: yuan6_1.Yuan6Package,
    ["yuan7" /* Yuan7 */]: yuan7_1.Yuan7Package,
    ["sp" /* SP */]: sp_1.SpPackage,
    ["spark" /* Spark */]: spark_1.SparkPackage,
    ["decade" /* Decade */]: decade_1.DecadePackage,
    ["limited" /* Limited */]: limited_1.LimitedPackage,
    ["biographies" /* Biographies */]: biographies_1.BiographiesPackage,
    ["mobile" /* Mobile */]: mobile_1.MobilePackage,
    ["wisdom" /* Wisdom */]: wisdom_1.WisdomPackage,
    ["sincerity" /* Sincerity */]: sincerity_1.SincerityCharacterPackage,
    ["benevolence" /* Benevolence */]: benevolence_1.BenevolencePackage,
    ["strategem" /* Strategem */]: strategem_1.StrategemPackage,
    ["pve" /* Pve */]: pve_1.PvePackage,
};
