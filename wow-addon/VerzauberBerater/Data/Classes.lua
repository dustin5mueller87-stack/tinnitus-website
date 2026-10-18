-- Verzauber-Berater: Klassen, Specs und Werte-Gewichte
--
-- Jeder Spec zeigt auf ein Profil mit Gewichten: "wie viel ist ein Punkt dieses
-- Werts für die Rolle ungefähr wert". Physische Rollen rechnen in
-- Angriffskraft-Äquivalent, Zauberer und Heiler in Zauberkraft-Äquivalent,
-- Tanks in Überlebens-Punkten. Verglichen wird immer nur innerhalb eines Specs,
-- die Einheiten müssen also nicht zueinander passen.
--
-- WoW-Forever-Besonderheiten, die hier eingeflossen sind:
--   * Treffer und kritische Treffer sind für Nahkampf, Fernkampf und Zauber vereinheitlicht.
--   * "Zauberkraft" = Schaden + Heilung, "Heilkraft" = Heilung + 1/3 davon als Schaden.
--   * Willenskraft regeneriert Mana auch im Kampf.
--   * Druiden schlagen in Katzen- und Bärengestalt mit ihrer Waffe zu:
--     Waffenschaden und Waffen-Procs zählen also auch für Wilder Kampf.
--   * Schutz-Paladine erzeugen Bedrohung über Zauberkraft.
--
-- Werte-Schlüssel (siehe auch Data/Enchants.lua):
--   STR AGI STA INT SPI   Primärwerte
--   HP MANA               Leben / Mana
--   ARMOR DEF DODGE PARRY BLOCK   Verteidigung (DODGE/PARRY/BLOCK in %)
--   HIT CRIT HASTE        in % (HASTE = Angriffstempo, hilft Zauberern nicht)
--   RHIT                  Distanz-Trefferchance in % (Zielfernrohr)
--   AP RAP                Nahkampf- / Distanz-Angriffskraft
--   WDMG RDMG             Waffenschaden Nahkampf / Fernkampf (Zielfernrohr)
--   SP                    Zauberkraft: Zauberschaden UND Heilung
--   HEAL                  nur Heilung
--   SPD                   nur Zauberschaden (alle Schulen)
--   FIRESP FROSTSP SHADOWSP NATURESP ARCANESP HOLYSP   Schaden einer Schule
--   MP5 HP5               Regeneration pro 5 Sek.
--   RES FIRERES FROSTRES NATURERES SHADOWRES ARCANERES   Widerstände
--   THREAT THREATRED      Bedrohung + / - in %
--   BEAST ELEM DEMON      Bonusschaden gegen Wildtiere / Elementare / Dämonen
--   ABSORB                Schadensabsorption (grobe Punkte)
local ADDON, ns = ...
local T = ns.T

local RES_EACH = 0.04 -- Einzel-Widerstände sind situativ (nur für bestimmte Bosse wichtig)

local PROFILES = {}

-- Stärke-Nahkämpfer: Waffen-/Furor-Krieger, Vergelter, Verstärker
PROFILES.STR_MELEE = {
	STR = 2.0, AGI = 1.3, STA = 0.35, INT = 0.03, SPI = 0.05, HP = 0.035,
	ARMOR = 0.02, DEF = 0.2, DODGE = 5, PARRY = 4,
	HIT = 30, CRIT = 28, HASTE = 22, AP = 1.0, WDMG = 4.2,
	HP5 = 0.4, RES = 0.4, FIRERES = RES_EACH, FROSTRES = RES_EACH, NATURERES = RES_EACH,
	SHADOWRES = RES_EACH, ARCANERES = RES_EACH, THREATRED = 2,
	BEAST = 1.3, ELEM = 0.4, DEMON = 0.3, ABSORB = 0.02,
}

-- Beweglichkeits-Nahkämpfer: Schurken
PROFILES.AGI_MELEE = {
	AGI = 2.0, STR = 1.1, STA = 0.35, HP = 0.035,
	ARMOR = 0.02, DEF = 0.2, DODGE = 5, PARRY = 4,
	HIT = 30, CRIT = 28, HASTE = 22, AP = 1.0, WDMG = 5.0,
	HP5 = 0.4, RES = 0.4, FIRERES = RES_EACH, FROSTRES = RES_EACH, NATURERES = RES_EACH,
	SHADOWRES = RES_EACH, ARCANERES = RES_EACH, THREATRED = 3,
	BEAST = 1.5, ELEM = 0.5, DEMON = 0.3, ABSORB = 0.02,
}

-- Überlebens-Jäger in Forever: Nahkampf (zwei Waffen oder Zweihand), schießt nur nebenbei
PROFILES.HUNTER_MELEE = {
	AGI = 2.0, STR = 1.0, STA = 0.35, INT = 0.2, SPI = 0.08, HP = 0.035, MANA = 0.013,
	ARMOR = 0.02, DODGE = 4, PARRY = 4,
	HIT = 30, CRIT = 28, HASTE = 22, AP = 1.0, WDMG = 5.0, RAP = 0.3, RDMG = 1.2, RHIT = 4,
	MP5 = 0.5, HP5 = 0.4, RES = 0.4, FIRERES = RES_EACH, FROSTRES = RES_EACH, NATURERES = RES_EACH,
	SHADOWRES = RES_EACH, ARCANERES = RES_EACH, THREATRED = 2,
	BEAST = 1.5, ELEM = 0.5, DEMON = 0.3, ABSORB = 0.02,
}

-- Fernkampf-Jäger: Nahkampfwaffe ist nur ein Werte-Träger, Waffenschaden darauf zählt nicht
PROFILES.HUNTER_RANGED = {
	AGI = 2.0, RAP = 1.0, RDMG = 4.7, STA = 0.35, INT = 0.25, SPI = 0.08, HP = 0.035, MANA = 0.017,
	STR = 0.05, AP = 0.05, ARMOR = 0.02, DODGE = 3,
	HIT = 30, CRIT = 28, HASTE = 10, RHIT = 30,
	MP5 = 0.6, HP5 = 0.3, RES = 0.4, FIRERES = RES_EACH, FROSTRES = RES_EACH, NATURERES = RES_EACH,
	SHADOWRES = RES_EACH, ARCANERES = RES_EACH, THREATRED = 2, ABSORB = 0.02,
}

-- Katzen-Druide (Gewichte nach Forever-Simulationen: Treffer > Krit > Bew > Stärke > AK)
PROFILES.FERAL_CAT = {
	AGI = 2.0, STR = 1.7, STA = 0.3, INT = 0.1, SPI = 0.05, HP = 0.03, MANA = 0.005,
	ARMOR = 0.01, DODGE = 3,
	HIT = 28, CRIT = 24, AP = 1.0, WDMG = 4.2, MP5 = 0.2, HP5 = 0.3,
	RES = 0.3, FIRERES = RES_EACH, FROSTRES = RES_EACH, NATURERES = RES_EACH,
	SHADOWRES = RES_EACH, ARCANERES = RES_EACH, THREATRED = 2,
	BEAST = 1.3, ELEM = 0.4, DEMON = 0.3,
}

-- Bären-Druide
PROFILES.FERAL_BEAR = {
	STA = 1.5, HP = 0.15, AGI = 1.4, ARMOR = 0.12, DEF = 1.6, STR = 0.8,
	DODGE = 22, HIT = 12, CRIT = 6, AP = 0.4, WDMG = 1.5, THREAT = 25,
	HP5 = 0.5, RES = 0.8, FIRERES = 0.08, FROSTRES = 0.08, NATURERES = 0.08,
	SHADOWRES = 0.08, ARCANERES = 0.08, ABSORB = 0.15, INT = 0.05, SPI = 0.02, BEAST = 0.4,
}

-- Platten-Tank: Schutz-Krieger, Schutz-Paladin
PROFILES.TANK_PLATE = {
	STA = 1.5, HP = 0.15, DEF = 1.6, ARMOR = 0.1, AGI = 1.0, STR = 1.0,
	DODGE = 22, PARRY = 20, BLOCK = 5, HIT = 12, CRIT = 6, AP = 0.4, WDMG = 1.5, THREAT = 25,
	HP5 = 0.5, RES = 0.8, FIRERES = 0.08, FROSTRES = 0.08, NATURERES = 0.08,
	SHADOWRES = 0.08, ARCANERES = 0.08, ABSORB = 0.15, BEAST = 0.4, SPI = 0.02,
}

-- Schadens-Zauberer: Magier, Hexenmeister, Schattenpriester, Elementar, Gleichgewicht
PROFILES.CASTER = {
	SP = 1.0, SPD = 1.0, INT = 0.45, SPI = 0.2, STA = 0.15, HP = 0.015, MANA = 0.025,
	MP5 = 0.7, HIT = 10, CRIT = 12, ARMOR = 0.005, DEF = 0.05,
	FIRESP = 0.1, FROSTSP = 0.1, SHADOWSP = 0.1, NATURESP = 0.1, ARCANESP = 0.1, HOLYSP = 0.05,
	HP5 = 0.1, RES = 0.25, FIRERES = 0.02, FROSTRES = 0.02, NATURERES = 0.02,
	SHADOWRES = 0.02, ARCANERES = 0.02, THREATRED = 1,
}

-- Heiler: Heilig/Disziplin, Heilig-Paladin, Wiederherstellung (Schamane/Druide)
PROFILES.HEALER = {
	HEAL = 1.0, SP = 1.0, SPD = 0.1, INT = 0.6, SPI = 0.45, STA = 0.15, HP = 0.015, MANA = 0.03,
	MP5 = 1.4, CRIT = 10, ARMOR = 0.005, DEF = 0.05,
	HP5 = 0.1, RES = 0.25, FIRERES = 0.02, FROSTRES = 0.02, NATURERES = 0.02,
	SHADOWRES = 0.02, ARCANERES = 0.02, THREATRED = 1,
}
ns.PROFILES = PROFILES

-- Kurzbeschreibung der Prioritäten pro Profil (für die Kopfzeile)
ns.PROFILE_PRIO = {
	STR_MELEE     = T("Stärke > Waffenschaden > Beweglichkeit > Ausdauer", "Strength > weapon damage > agility > stamina"),
	AGI_MELEE     = T("Beweglichkeit > Waffenschaden > Stärke > Ausdauer", "Agility > weapon damage > strength > stamina"),
	HUNTER_MELEE  = T("Beweglichkeit > Waffenschaden > Stärke > Intelligenz", "Agility > weapon damage > strength > intellect"),
	HUNTER_RANGED = T("Beweglichkeit > Fernkampfschaden > Intelligenz > Ausdauer", "Agility > ranged damage > intellect > stamina"),
	FERAL_CAT     = T("Beweglichkeit > Stärke > Waffenschaden > Ausdauer", "Agility > strength > weapon damage > stamina"),
	FERAL_BEAR    = T("Ausdauer > Beweglichkeit > Rüstung > Verteidigung", "Stamina > agility > armor > defense"),
	TANK_PLATE    = T("Ausdauer > Verteidigung > Stärke/Beweglichkeit > Rüstung", "Stamina > defense > strength/agility > armor"),
	CASTER        = T("Zauberkraft > Intelligenz > Mana-Reg > Willenskraft", "Spell power > intellect > mana regen > spirit"),
	HEALER        = T("Heilkraft > Intelligenz > Mana-Reg > Willenskraft", "Healing power > intellect > mana regen > spirit"),
}

-- Klassen und Specs. Reihenfolge der Specs = Reihenfolge der Talentbäume im Spiel
-- (tab), damit die automatische Erkennung den richtigen Spec findet.
-- id: Klassen-ID für GetClassInfo (liefert den Namen in Client-Sprache)
-- alias: weitere Baum-Namen, unter denen der Client den Spec führen könnte
-- setup: Standard-Waffen-Setup (2H, DW, 1HS, 1HOH)
-- ranged: Spec nutzt eine Fernkampfwaffe mit Zielfernrohr
-- mod: Abweichungen vom Profil
ns.CLASSES = {
	{ file = "WARRIOR", id = 1, de = "Krieger", en = "Warrior", specs = {
		{ key = "WARRIOR_ARMS", tab = 1, de = "Waffen", en = "Arms", role = "MELEE", setup = "2H", profile = "STR_MELEE" },
		{ key = "WARRIOR_FURY", tab = 2, de = "Furor", en = "Fury", role = "MELEE", setup = "DW", profile = "STR_MELEE" },
		{ key = "WARRIOR_PROT", tab = 3, de = "Schutz", en = "Protection", role = "TANK", setup = "1HS", profile = "TANK_PLATE" },
	}},
	{ file = "PALADIN", id = 2, de = "Paladin", en = "Paladin", specs = {
		{ key = "PALADIN_HOLY", tab = 1, de = "Heilig", en = "Holy", role = "HEALER", setup = "1HS", profile = "HEALER",
			mod = { SPI = 0.15, MP5 = 1.8, INT = 0.75, CRIT = 14 } },
		{ key = "PALADIN_PROT", tab = 2, de = "Schutz", en = "Protection", role = "TANK", setup = "1HS", profile = "TANK_PLATE",
			mod = { INT = 0.3, MANA = 0.01, MP5 = 0.8, SP = 1.0, HOLYSP = 1.0, WDMG = 2.5, HIT = 14, BLOCK = 6 } },
		{ key = "PALADIN_RET", tab = 3, de = "Vergeltung", en = "Retribution", role = "MELEE", setup = "2H", profile = "STR_MELEE",
			mod = { INT = 0.25, MANA = 0.017, MP5 = 1.0, SP = 0.35, HOLYSP = 0.35 } },
	}},
	{ file = "HUNTER", id = 3, de = "Jäger", en = "Hunter", specs = {
		{ key = "HUNTER_BM", tab = 1, de = "Tierherrschaft", en = "Beast Mastery", role = "RANGED", setup = "2H", profile = "HUNTER_RANGED", ranged = true },
		{ key = "HUNTER_MM", tab = 2, de = "Treffsicherheit", en = "Marksmanship", role = "RANGED", setup = "2H", profile = "HUNTER_RANGED", ranged = true },
		{ key = "HUNTER_SV", tab = 3, de = "Überleben", en = "Survival", role = "MELEE", setup = "DW", profile = "HUNTER_MELEE", ranged = true },
	}},
	{ file = "ROGUE", id = 4, de = "Schurke", en = "Rogue", specs = {
		{ key = "ROGUE_ASSA", tab = 1, de = "Meucheln", en = "Assassination", role = "MELEE", setup = "DW", profile = "AGI_MELEE" },
		{ key = "ROGUE_COMBAT", tab = 2, de = "Kampf", en = "Combat", role = "MELEE", setup = "DW", profile = "AGI_MELEE",
			alias = { "Gesetzlosigkeit", "Outlaw" } },
		{ key = "ROGUE_SUB", tab = 3, de = "Täuschung", en = "Subtlety", role = "MELEE", setup = "DW", profile = "AGI_MELEE" },
	}},
	{ file = "PRIEST", id = 5, de = "Priester", en = "Priest", specs = {
		{ key = "PRIEST_DISC", tab = 1, de = "Disziplin", en = "Discipline", role = "HEALER", setup = "2H", profile = "HEALER",
			mod = { SPI = 0.55 } },
		{ key = "PRIEST_HOLY", tab = 2, de = "Heilig", en = "Holy", role = "HEALER", setup = "2H", profile = "HEALER",
			mod = { SPI = 0.6 } },
		{ key = "PRIEST_SHADOW", tab = 3, de = "Schatten", en = "Shadow", role = "CASTER", setup = "2H", profile = "CASTER",
			mod = { SHADOWSP = 1.0, SPI = 0.3, HOLYSP = 0.1 } },
	}},
	{ file = "SHAMAN", id = 7, de = "Schamane", en = "Shaman", specs = {
		{ key = "SHAMAN_ELE", tab = 1, de = "Elementar", en = "Elemental", role = "CASTER", setup = "1HS", profile = "CASTER",
			alias = { "Elementarkampf" }, mod = { NATURESP = 1.0, FIRESP = 0.3, FROSTSP = 0.2, MP5 = 0.9 } },
		{ key = "SHAMAN_ENH", tab = 2, de = "Verstärkung", en = "Enhancement", role = "MELEE", setup = "2H", profile = "STR_MELEE",
			mod = { AGI = 1.5, INT = 0.3, MANA = 0.02, MP5 = 0.8, SP = 0.25, SPD = 0.25, NATURESP = 0.25, FROSTSP = 0.15, FIRESP = 0.1 } },
		{ key = "SHAMAN_RESTO", tab = 3, de = "Wiederherstellung", en = "Restoration", role = "HEALER", setup = "1HS", profile = "HEALER",
			mod = { SPI = 0.3, MP5 = 1.8 } },
	}},
	{ file = "MAGE", id = 8, de = "Magier", en = "Mage", specs = {
		{ key = "MAGE_ARCANE", tab = 1, de = "Arkan", en = "Arcane", role = "CASTER", setup = "2H", profile = "CASTER",
			mod = { ARCANESP = 1.0, FROSTSP = 0.5, FIRESP = 0.3, SPI = 0.25, INT = 0.5 } },
		{ key = "MAGE_FIRE", tab = 2, de = "Feuer", en = "Fire", role = "CASTER", setup = "2H", profile = "CASTER",
			mod = { FIRESP = 1.0, ARCANESP = 0.15 } },
		{ key = "MAGE_FROST", tab = 3, de = "Frost", en = "Frost", role = "CASTER", setup = "2H", profile = "CASTER",
			mod = { FROSTSP = 1.0, ARCANESP = 0.15 } },
	}},
	{ file = "WARLOCK", id = 9, de = "Hexenmeister", en = "Warlock", specs = {
		{ key = "WARLOCK_AFFLI", tab = 1, de = "Gebrechen", en = "Affliction", role = "CASTER", setup = "2H", profile = "CASTER",
			mod = { SHADOWSP = 1.0, FIRESP = 0.15, SPI = 0.1, STA = 0.25, HP = 0.025 } },
		{ key = "WARLOCK_DEMO", tab = 2, de = "Dämonologie", en = "Demonology", role = "CASTER", setup = "2H", profile = "CASTER",
			mod = { SHADOWSP = 0.9, FIRESP = 0.3, SPI = 0.1, STA = 0.3, HP = 0.03 } },
		{ key = "WARLOCK_DESTRO", tab = 3, de = "Zerstörung", en = "Destruction", role = "CASTER", setup = "2H", profile = "CASTER",
			mod = { SHADOWSP = 0.9, FIRESP = 0.5, SPI = 0.1, STA = 0.25, HP = 0.025 } },
	}},
	{ file = "DRUID", id = 11, de = "Druide", en = "Druid", specs = {
		{ key = "DRUID_BALANCE", tab = 1, de = "Gleichgewicht", en = "Balance", role = "CASTER", setup = "2H", profile = "CASTER",
			mod = { NATURESP = 0.8, ARCANESP = 0.7, SPI = 0.3 } },
		{ key = "DRUID_CAT", tab = 2, de = "Wilder Kampf (Katze)", en = "Feral (Cat)", role = "MELEE", setup = "2H", profile = "FERAL_CAT",
			alias = { "Wilder Kampf", "Wildheit", "Feral Combat", "Feral" } },
		{ key = "DRUID_BEAR", tab = 2, de = "Wilder Kampf (Bär)", en = "Feral (Bear)", role = "TANK", setup = "2H", profile = "FERAL_BEAR" },
		{ key = "DRUID_RESTO", tab = 3, de = "Wiederherstellung", en = "Restoration", role = "HEALER", setup = "2H", profile = "HEALER",
			mod = { SPI = 0.55 } },
	}},
}
