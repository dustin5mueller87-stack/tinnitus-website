-- Verzauber-Berater: Datenbank aller Verzauberungen und Aufwertungen
--
-- Stand: WoW Forever Beta 1.60.1 (Oktober 2026). Quellen: Wowhead-Forever-Datenbank,
-- BlizzardWatch, Warcraft Tavern, Zockify, Icy Veins u. a. (über Suchergebnisse
-- zusammengetragen). Einträge mit Spell-ID holen sich im Spiel Namen und
-- Beschreibung direkt aus dem Client und korrigieren einfache Zahlenwerte selbst,
-- falls Blizzard in der Beta etwas ändert (siehe Core.lua, LiveCheck).
--
-- Felder:
--   g     Gruppe (oder Liste von Gruppen), siehe Slots in Core.lua
--   id    Spell-ID der Verzauberung (optional) -> Name/Beschreibung aus dem Client
--   item  Item-ID (optional, für Zielfernrohre/Rüstungssets) -> Name aus dem Client
--   lvl   ab welchem Charakter-Level die Verzauberung sinnvoll zu haben ist
--         (richtet sich nach der Material-Stufe bzw. der Rezeptquelle)
--   sk    benötigte Verzauberkunst
--   src   Rezeptquelle: T Lehrer, D Drop, V Händler, R Ruf, Q Quest, RAID,
--         ENG Ingenieurskunst, LW Lederverarbeitung, PERK Berufsvorteil
--   wde/wen  Details zur Quelle
--   c     Datenlage: F = für Forever bestätigt, N = neu in Forever (bestätigt),
--         C = Classic-Wert (für Forever unbestätigt), X = Forever-Angabe unsicher
--   was   alter Classic-Wert, falls Forever ihn geändert hat
--   de/en Name (Fallback, falls der Client keinen liefert)
--   s     Werte (Schlüssel siehe Data/Classes.lua)
--   fde/fen  eigener Effekt-Text (Procs, Komfort); sonst wird er aus s gebaut
--   util  Komfort-Verzauberung (Lauftempo, Berufe): wird nicht bewertet
--   prof  nur zeigen, wenn der Charakter diesen Beruf hat (Skill-Line-ID)
--   roles nur für diese Rollen sinnvoll
--   fixed feste Bewertung statt Gewichte (für Werte ohne bekannte Zahl)
--   match Suchwörter, um die Verzauberung im Gegenstands-Tooltip wiederzuerkennen
--   noLive keine automatische Zahlen-Korrektur (Beschreibung enthält mehrere Werte)
--   m     Materialien { {Item-ID oder Schlüssel aus ns.MATS, Anzahl}, ... }
local ADDON, ns = ...
local T = ns.T

-- Materialien: Item-ID -> Fallback-Namen. Im Spiel kommt der echte Name aus dem Client.
ns.MATS = {
	[247786] = { "Mote of Magic", "Mote of Magic" },
	[10940]  = { "Seltsamer Staub", "Strange Dust" },
	[11083]  = { "Seelenstaub", "Soul Dust" },
	[11137]  = { "Visionenstaub", "Vision Dust" },
	[11176]  = { "Traumstaub", "Dream Dust" },
	[16204]  = { "Illusionsstaub", "Illusion Dust" },
	[10938]  = { "Geringe Magieessenz", "Lesser Magic Essence" },
	[10939]  = { "Große Magieessenz", "Greater Magic Essence" },
	[11134]  = { "Geringe mystische Essenz", "Lesser Mystic Essence" },
	[11174]  = { "Geringe Netheressenz", "Lesser Nether Essence" },
	[11175]  = { "Große Netheressenz", "Greater Nether Essence" },
	[16203]  = { "Große ewige Essenz", "Greater Eternal Essence" },
	[10978]  = { "Kleiner gleißender Splitter", "Small Glimmering Shard" },
	[11084]  = { "Großer gleißender Splitter", "Large Glimmering Shard" },
	[11139]  = { "Großer leuchtender Splitter", "Large Glowing Shard" },
	[11178]  = { "Großer strahlender Splitter", "Large Radiant Shard" },
	[14344]  = { "Großer glänzender Splitter", "Large Brilliant Shard" },
	[12811]  = { "Rechtschaffene Kugel", "Righteous Orb" },
	[12363]  = { "Arkankristall", "Arcane Crystal" },
	[7082]   = { "Essenz der Luft", "Essence of Air" },
	[7080]   = { "Essenz des Wassers", "Essence of Water" },
	SULFURIC_ACID = { "Sulfuric Acid", "Sulfuric Acid" },
	BAUXITE       = { "Bauxite", "Bauxite" },
	CERULEAN_DYE  = { "Cerulean Dye", "Cerulean Dye" },
	MAGENTA_DYE   = { "Magenta Dye", "Magenta Dye" },
}

local FAVOR45  = { T("ACA-Händler (Alynsia / Beneris), 45 Merchant's Favor", "ACA vendor (Alynsia / Beneris), 45 Merchant's Favor") }
local FAVOR120 = { T("ACA-Händler (Alynsia / Beneris), 120 Merchant's Favor", "ACA vendor (Alynsia / Beneris), 120 Merchant's Favor") }
local FAVOR240 = { T("ACA-Händler (Alynsia / Beneris), 240 Merchant's Favor, Ruf nötig", "ACA vendor (Alynsia / Beneris), 240 Merchant's Favor, reputation needed") }
local BOP_UNKNOWN = { T("Formel (seelengebunden), Fundort noch unbekannt", "Formula (bind on pickup), source not known yet") }
local AQ = { T("Ahn'Qiraj - falls es in Forever so kommt", "Ahn'Qiraj - if it works like that in Forever") }

-- Alle fünf Primärwerte gleich hoch (Brust - Werte)
local function ALL(n) return { STR = n, AGI = n, STA = n, INT = n, SPI = n } end

local E = {}
ns.ENCHANTS = E
local function add(t)
	if t.w then t.where = t.w[1]; t.w = nil end
	E[#E + 1] = t
end

----------------------------------------------------------------------
-- Zweihandwaffe (nur Zweihänder; "Waffe"-Verzauberungen gehen zusätzlich)
----------------------------------------------------------------------
add{ g = "2H", id = 7745, lvl = 12, sk = 100, src = "T", c = "F", was = "+2",
	de = "Zweihandwaffe - Schwacher Einschlag", en = "2H Weapon - Minor Impact", s = { WDMG = 4 },
	m = { { 10940, 1 }, { 10978, 1 } } }
add{ g = "2H", id = 7793, lvl = 12, sk = 100, src = "T", c = "C",
	de = "Zweihandwaffe - Geringe Intelligenz", en = "2H Weapon - Lesser Intellect", s = { INT = 3 } }
add{ g = "2H", id = 13380, lvl = 14, sk = 110, src = "T", c = "C",
	de = "Zweihandwaffe - Geringe Willenskraft", en = "2H Weapon - Lesser Spirit", s = { SPI = 3 } }
add{ g = "2H", id = 13529, lvl = 22, sk = 145, src = "T", c = "F", was = "+3",
	de = "Zweihandwaffe - Geringer Einschlag", en = "2H Weapon - Lesser Impact", s = { WDMG = 5 },
	m = { { 11083, 1 }, { 11084, 1 } } }
add{ g = "2H", id = 13695, lvl = 30, sk = 200, src = "T", c = "F", was = "+5",
	de = "Zweihandwaffe - Einschlag", en = "2H Weapon - Impact", s = { WDMG = 6 },
	m = { { 11137, 2 }, { 11139, 1 } } }
add{ g = "2H", id = 1248510, lvl = 36, sk = 210, src = "D", c = "N", w = BOP_UNKNOWN,
	de = "Zweihandwaffe - Geringe Beweglichkeit", en = "2H Weapon - Lesser Agility", s = { AGI = 15 },
	m = { { 11137, 2 }, { 11139, 1 }, { 11174, 2 } } }
add{ g = "2H", id = 1248511, lvl = 36, sk = 220, src = "D", c = "N", w = BOP_UNKNOWN,
	de = "Zweihandwaffe - Geringe Stärke", en = "2H Weapon - Lesser Strength", s = { STR = 15 },
	m = { { 11137, 1 }, { 11139, 1 }, { 11174, 2 } } }
add{ g = "2H", id = 13937, lvl = 40, sk = 240, src = "T", c = "F",
	de = "Zweihandwaffe - Großer Einschlag", en = "2H Weapon - Greater Impact", s = { WDMG = 7 },
	m = { { 11178, 1 }, { 11176, 1 } } }
add{ g = "2H", id = 20030, lvl = 52, sk = 295, src = "D", c = "F",
	de = "Zweihandwaffe - Überragender Einschlag", en = "2H Weapon - Superior Impact", s = { WDMG = 9 },
	m = { { 14344, 4 }, { 16204, 10 } } }
add{ g = "2H", id = 27837, lvl = 55, sk = 290, src = "D", c = "F",
	de = "Zweihandwaffe - Beweglichkeit", en = "2H Weapon - Agility", s = { AGI = 25 } }
add{ g = "2H", id = 1248668, lvl = 55, sk = 290, src = "D", c = "N", w = BOP_UNKNOWN,
	de = "Zweihandwaffe - Stärke", en = "2H Weapon - Strength", s = { STR = 25 },
	m = { { 14344, 8 }, { 16203, 10 }, { 16204, 8 }, { 12363, 4 } } }
add{ g = "2H", id = 20036, lvl = 55, sk = 300, src = "D", c = "F",
	de = "Zweihandwaffe - Erhebliche Intelligenz", en = "2H Weapon - Major Intellect", s = { INT = 9 } }
add{ g = "2H", id = 20035, lvl = 55, sk = 300, src = "D", c = "C",
	de = "Zweihandwaffe - Erhebliche Willenskraft", en = "2H Weapon - Major Spirit", s = { SPI = 9 } }
add{ g = "2H", id = 1248607, lvl = 58, sk = 300, src = "V", c = "N", w = FAVOR240,
	de = "Zweihandwaffe - Mächtige Zauberkraft", en = "2H Weapon - Mighty Spell Power", s = { SP = 55 } }
add{ g = "2H", id = 1248636, lvl = 58, sk = 300, src = "V", c = "N", w = FAVOR240, noLive = true,
	de = "Zweihandwaffe - Mächtige Heilkraft", en = "2H Weapon - Mighty Healing Power", s = { HEAL = 100, SPD = 34 } }
add{ g = "2H", id = 1219580, lvl = 60, sk = 300, src = "V", c = "X", w = FAVOR240,
	de = "Zweihandwaffe - Zauberschlag", en = "2H Weapon - Spellblasting", s = { SPD = 65 } }

----------------------------------------------------------------------
-- Waffe (Einhand- und Zweihandwaffen)
----------------------------------------------------------------------
add{ g = "WEAPON", id = 7786, lvl = 10, sk = 90, src = "T", c = "C",
	de = "Waffe - Schwacher Wildtiertöter", en = "Weapon - Minor Beastslayer", s = { BEAST = 2 } }
add{ g = "WEAPON", id = 7788, lvl = 12, sk = 110, src = "T", c = "F",
	de = "Waffe - Schwacher Schlag", en = "Weapon - Minor Striking", s = { WDMG = 1 },
	m = { { 10940, 1 }, { 10938, 1 }, { 10978, 1 } } }
add{ g = "WEAPON", id = 13503, lvl = 22, sk = 140, src = "T", c = "F",
	de = "Waffe - Geringer Schlag", en = "Weapon - Lesser Striking", s = { WDMG = 2 },
	m = { { 11083, 1 }, { 11084, 1 } } }
add{ g = "WEAPON", id = 13653, lvl = 25, sk = 175, src = "D", c = "C",
	de = "Waffe - Geringer Wildtiertöter", en = "Weapon - Lesser Beastslayer", s = { BEAST = 6 } }
add{ g = "WEAPON", id = 13655, lvl = 25, sk = 175, src = "D", c = "C",
	de = "Waffe - Geringer Elementartöter", en = "Weapon - Lesser Elemental Slayer", s = { ELEM = 6 } }
add{ g = "WEAPON", id = 1248805, lvl = 25, sk = 140, src = "V", c = "N", w = FAVOR45,
	roles = { CASTER = true, HEALER = true }, s = { CRIT = 1.5 }, match = { "Offenbarung", "Revelation" },
	de = "Waffe - Offenbarung", en = "Weapon - Revelation",
	fde = "Zauber ohne Krit: Chance, dass dein nächster Zauber sicher kritisch trifft",
	fen = "Non-crit spell: chance that your next spell is a guaranteed crit" }
add{ g = "WEAPON", id = 1248760, lvl = 25, sk = 140, src = "V", c = "N", w = FAVOR45,
	roles = { MELEE = true, TANK = true }, s = { HP5 = 8 }, match = { "Erholung", "Recovery" },
	de = "Waffe - Erholung", en = "Weapon - Recovery",
	fde = "Wird ausgewichen/pariert: Chance auf Heilung um 5% deines Lebens",
	fen = "When dodged/parried: chance to heal 5% of your health" }
add{ g = "WEAPON", lvl = 25, sk = 140, src = "V", c = "X", w = FAVOR45,
	roles = { CASTER = true, HEALER = true }, s = { SPI = 20 }, match = { "Einsicht", "Insight" },
	de = "Waffe - Einsicht", en = "Weapon - Insight",
	fde = "Chance beim Zaubern: +100% Willenskraft für 10 Sek.",
	fen = "Chance on spell cast: +100% Spirit for 10 sec" }
add{ g = "WEAPON", id = 21931, lvl = 30, sk = 190, src = "D", c = "C",
	de = "Waffe - Wintermacht", en = "Weapon - Winter's Might", s = { FROSTSP = 7 } }
add{ g = "WEAPON", id = 13693, lvl = 30, sk = 195, src = "T", c = "F",
	de = "Waffe - Schlag", en = "Weapon - Striking", s = { WDMG = 3 } }
add{ g = "WEAPON", id = 13915, lvl = 38, sk = 230, src = "D", c = "C", noLive = true,
	s = { DEMON = 6 }, match = { "Dämonen", "Demon" },
	de = "Waffe - Dämonentöten", en = "Weapon - Demonslaying",
	fde = "Chance bei Treffer gegen Dämonen: Betäubung und Schaden",
	fen = "Chance on hit vs demons: stun and damage" }
add{ g = "WEAPON", id = 13943, lvl = 40, sk = 245, src = "T", c = "F",
	de = "Waffe - Großer Schlag", en = "Weapon - Greater Striking", s = { WDMG = 4 } }
add{ g = "WEAPON", id = 13898, lvl = 46, sk = 265, src = "D", c = "C", noLive = true,
	s = { AP = 28 }, match = { "Feurig", "Fiery" },
	de = "Waffe - Feurige Waffe", en = "Weapon - Fiery Weapon",
	fde = "Chance bei Treffer: zusätzlicher Feuerschaden", fen = "Chance on hit: extra fire damage" }
add{ g = "WEAPON", id = 20029, lvl = 50, sk = 285, src = "D", c = "C", noLive = true,
	s = { DODGE = 1 }, match = { "Eisig", "Icy" },
	de = "Waffe - Eisiger Hauch", en = "Weapon - Icy Chill",
	fde = "Chance bei Treffer: verlangsamt die Angriffe des Ziels", fen = "Chance on hit: slows the target's attacks" }
add{ g = "WEAPON", id = 20033, lvl = 55, sk = 295, src = "D", c = "C", noLive = true,
	s = { AP = 20, DODGE = 0.5 }, match = { "Unheilig", "Unholy" },
	de = "Waffe - Unheilige Waffe", en = "Weapon - Unholy Weapon",
	fde = "Chance bei Treffer: Schattenschaden und ein Fluch, der den Schaden des Ziels senkt",
	fen = "Chance on hit: shadow damage and a curse that lowers the target's damage" }
add{ g = "WEAPON", id = 20031, lvl = 55, sk = 300, src = "D", c = "F",
	de = "Waffe - Überragender Schlag", en = "Weapon - Superior Striking", s = { WDMG = 5 } }
add{ g = "WEAPON", id = 23800, lvl = 55, sk = 290, src = "D", c = "C",
	de = "Waffe - Beweglichkeit", en = "Weapon - Agility", s = { AGI = 15 } }
add{ g = "WEAPON", id = 23799, lvl = 55, sk = 290, src = "D", c = "C",
	de = "Waffe - Stärke", en = "Weapon - Strength", s = { STR = 15 } }
add{ g = "WEAPON", id = 20032, lvl = 58, sk = 300, src = "D", c = "C", noLive = true,
	s = { AP = 12, HP5 = 6 }, match = { "Lebensdieb", "Lifesteal" },
	de = "Waffe - Lebensdiebstahl", en = "Weapon - Lifestealing",
	fde = "Chance bei Treffer: entzieht dem Ziel Leben", fen = "Chance on hit: drains life from the target" }
add{ g = "WEAPON", id = 20034, lvl = 58, sk = 300, src = "D", c = "F", noLive = true,
	s = { STR = 23, HP5 = 5 }, match = { "Kreuzfahrer", "Crusader" },
	de = "Waffe - Kreuzfahrer", en = "Weapon - Crusader",
	fde = "Chance bei Treffer: +100 Stärke für 15 Sek. und eine Heilung",
	fen = "Chance on hit: +100 Strength for 15 sec and a heal",
	where = T("Formel-Drop (Classic: Scharlachroter Kreuzzug, Westliche Pestländer)", "Formula drop (Classic: Scarlet Crusade, Western Plaguelands)"),
	m = { { 14344, 4 }, { 12811, 2 } } }
add{ g = "WEAPON", id = 23804, lvl = 58, sk = 300, src = "D", c = "C",
	de = "Waffe - Mächtige Intelligenz", en = "Weapon - Mighty Intellect", s = { INT = 22 } }
add{ g = "WEAPON", id = 23803, lvl = 58, sk = 300, src = "D", c = "C",
	de = "Waffe - Mächtige Willenskraft", en = "Weapon - Mighty Spirit", s = { SPI = 20 } }
add{ g = "WEAPON", id = 22749, lvl = 60, sk = 300, src = "RAID", c = "F",
	where = T("Geschmolzener Kern", "Molten Core"),
	de = "Waffe - Zauberkraft", en = "Weapon - Spell Power", s = { SP = 30 } }
add{ g = "WEAPON", id = 22750, lvl = 60, sk = 300, src = "RAID", c = "F", noLive = true,
	where = T("Geschmolzener Kern", "Molten Core"),
	de = "Waffe - Heilkraft", en = "Weapon - Healing Power", s = { HEAL = 55, SPD = 19 } }

----------------------------------------------------------------------
-- Armschienen
----------------------------------------------------------------------
add{ g = "WRIST", id = 7418, lvl = 10, sk = 1, src = "T", c = "F", was = T("+5 Leben", "+5 health"),
	de = "Armschiene - Minderwertige Ausdauer", en = "Bracer - Inferior Stamina", s = { STA = 2 },
	m = { { 247786, 1 } } }
add{ g = "WRIST", id = 1248458, lvl = 10, sk = 70, src = "T", c = "N",
	de = "Armschiene - Schwache Intelligenz", en = "Bracer - Minor Intellect", s = { INT = 3 } }
add{ g = "WRIST", id = 7428, lvl = 10, sk = 60, src = "T", c = "C",
	de = "Armschiene - Schwache Ablenkung", en = "Bracer - Minor Deflection", s = { DEF = 1 } }
add{ g = "WRIST", id = 7766, lvl = 10, sk = 60, src = "T", c = "C",
	de = "Armschiene - Schwache Willenskraft", en = "Bracer - Minor Spirit", s = { SPI = 1 } }
add{ g = "WRIST", id = 7457, lvl = 10, sk = 80, src = "T", c = "F", was = "+1",
	de = "Armschiene - Schwache Ausdauer", en = "Bracer - Minor Stamina", s = { STA = 3 } }
add{ g = "WRIST", id = 7779, lvl = 12, sk = 80, src = "T", c = "F", was = "+1",
	de = "Armschiene - Schwache Beweglichkeit", en = "Bracer - Minor Agility", s = { AGI = 3 } }
add{ g = "WRIST", id = 7782, lvl = 12, sk = 80, src = "D", c = "F", was = "+1",
	de = "Armschiene - Schwache Stärke", en = "Bracer - Minor Strength", s = { STR = 3 } }
add{ g = "WRIST", id = 1248459, lvl = 12, sk = 90, src = "T", c = "N", noLive = true,
	de = "Armschiene - Schwache Heilkraft", en = "Bracer - Minor Healing Power", s = { HEAL = 8, SPD = 3 } }
add{ g = "WRIST", id = 7859, lvl = 18, sk = 120, src = "T", c = "C",
	de = "Armschiene - Geringe Willenskraft", en = "Bracer - Lesser Spirit", s = { SPI = 3 } }
add{ g = "WRIST", id = 13501, lvl = 20, sk = 130, src = "T", c = "F", was = "+3",
	de = "Armschiene - Geringe Ausdauer", en = "Bracer - Lesser Stamina", s = { STA = 4 } }
add{ g = "WRIST", id = 13536, lvl = 22, sk = 140, src = "T", c = "F", was = "+3",
	de = "Armschiene - Geringe Stärke", en = "Bracer - Lesser Strength", s = { STR = 4 } }
add{ g = "WRIST", id = 13622, lvl = 24, sk = 150, src = "T", c = "C",
	de = "Armschiene - Geringe Intelligenz", en = "Bracer - Lesser Intellect", s = { INT = 3 } }
add{ g = "WRIST", id = 13648, lvl = 24, sk = 170, src = "T", c = "F",
	de = "Armschiene - Ausdauer", en = "Bracer - Stamina", s = { STA = 5 }, m = { { 11083, 3 } } }
add{ g = "WRIST", id = 1248460, lvl = 26, sk = 140, src = "D", c = "N", w = BOP_UNKNOWN,
	de = "Armschiene - Geringe Beweglichkeit", en = "Bracer - Lesser Agility", s = { AGI = 4 } }
add{ g = "WRIST", id = 13642, lvl = 28, sk = 165, src = "T", c = "F",
	de = "Armschiene - Willenskraft", en = "Bracer - Spirit", s = { SPI = 5 } }
add{ g = "WRIST", id = 13661, lvl = 28, sk = 180, src = "T", c = "C",
	de = "Armschiene - Stärke", en = "Bracer - Strength", s = { STR = 5 } }
add{ g = "WRIST", id = 1248498, lvl = 28, sk = 195, src = "T", c = "N", noLive = true,
	de = "Armschiene - Geringe Heilkraft", en = "Bracer - Lesser Healing Power", s = { HEAL = 16, SPD = 6 },
	m = { { 11134, 2 } } }
add{ g = "WRIST", id = 1248497, lvl = 30, src = "T", c = "N",
	de = "Armschiene - Beweglichkeit", en = "Bracer - Agility", s = { AGI = 5 } }
add{ g = "WRIST", id = 13822, lvl = 36, sk = 210, src = "T", c = "F",
	de = "Armschiene - Intelligenz", en = "Bracer - Intellect", s = { INT = 5 } }
add{ g = "WRIST", id = 13846, lvl = 36, sk = 220, src = "T", c = "F",
	de = "Armschiene - Große Willenskraft", en = "Bracer - Greater Spirit", s = { SPI = 7 } }
add{ g = "WRIST", id = 13931, lvl = 41, sk = 235, src = "D", c = "F", was = "+3",
	de = "Armschiene - Ablenkung", en = "Bracer - Deflection", s = { DEF = 7 } }
add{ g = "WRIST", id = 13945, lvl = 41, sk = 225, src = "T", c = "F",
	de = "Armschiene - Große Ausdauer", en = "Bracer - Greater Stamina", s = { STA = 7 }, m = { { 11176, 3 } } }
add{ g = "WRIST", id = 13939, lvl = 41, sk = 240, src = "T", c = "F",
	de = "Armschiene - Große Stärke", en = "Bracer - Greater Strength", s = { STR = 7 } }
add{ g = "WRIST", id = 1248500, lvl = 42, src = "T", c = "N",
	de = "Armschiene - Große Beweglichkeit", en = "Bracer - Greater Agility", s = { AGI = 7 } }
add{ g = "WRIST", id = 20008, lvl = 44, sk = 255, src = "T", c = "C",
	de = "Armschiene - Große Intelligenz", en = "Bracer - Greater Intellect", s = { INT = 7 } }
add{ g = "WRIST", id = 20009, lvl = 50, sk = 270, src = "T", c = "C",
	de = "Armschiene - Überragende Willenskraft", en = "Bracer - Superior Spirit", s = { SPI = 9 } }
add{ g = "WRIST", id = 20010, lvl = 52, sk = 295, src = "D", c = "C",
	de = "Armschiene - Überragende Stärke", en = "Bracer - Superior Strength", s = { STR = 9 } }
add{ g = "WRIST", id = 20011, lvl = 54, sk = 300, src = "D", c = "C",
	de = "Armschiene - Überragende Ausdauer", en = "Bracer - Superior Stamina", s = { STA = 9 } }
add{ g = "WRIST", id = 1248599, lvl = 54, src = "D", c = "N",
	de = "Armschiene - Überragende Beweglichkeit", en = "Bracer - Superior Agility", s = { AGI = 9 } }
add{ g = "WRIST", id = 1248661, lvl = 56, sk = 300, src = "V", c = "N", w = FAVOR240,
	de = "Armschiene - Überragende Intelligenz", en = "Bracer - Superior Intellect", s = { INT = 9 } }
add{ g = "WRIST", lvl = 56, sk = 300, src = "V", c = "X", w = FAVOR240,
	de = "Armschiene - Überragende Ablenkung", en = "Bracer - Superior Deflection", s = { DEF = 9 } }
add{ g = "WRIST", id = 23801, lvl = 58, sk = 290, src = "R", c = "C",
	where = T("Argentumdämmerung", "Argent Dawn"),
	de = "Armschiene - Manaregeneration", en = "Bracer - Mana Regeneration", s = { MP5 = 4 } }
add{ g = "WRIST", id = 23802, lvl = 58, sk = 300, src = "D", c = "C", noLive = true,
	de = "Armschiene - Heilung", en = "Bracer - Healing", s = { HEAL = 24, SPD = 8 } }
add{ g = "WRIST", id = 1220624, lvl = 58, sk = 300, src = "V", c = "N", w = FAVOR240,
	de = "Armschiene - Große Zauberkraft", en = "Bracer - Greater Spellpower", s = { SP = 16 } }

----------------------------------------------------------------------
-- Brust
----------------------------------------------------------------------
add{ g = "CHEST", id = 7420, lvl = 10, sk = 15, src = "T", c = "X", was = T("+5 Leben", "+5 health"),
	de = "Brust - Minderwertige Ausdauer", en = "Chest - Inferior Stamina", s = { STA = 2 } }
add{ g = "CHEST", id = 7443, lvl = 10, sk = 20, src = "T", c = "C",
	de = "Brust - Schwaches Mana", en = "Chest - Minor Mana", s = { MANA = 5 } }
add{ g = "CHEST", id = 7426, lvl = 10, sk = 40, src = "T", c = "C", s = { ABSORB = 10 }, noLive = true,
	de = "Brust - Schwache Absorption", en = "Chest - Minor Absorption",
	fde = "Absorbiert ab und zu ein wenig Schaden", fen = "Occasionally absorbs a little damage" }
add{ g = "CHEST", id = 7748, lvl = 12, sk = 60, src = "T", c = "X", was = T("+15 Leben", "+15 health"),
	de = "Brust - Geringe Ausdauer", en = "Chest - Lesser Stamina", s = { STA = 3 } }
add{ g = "CHEST", id = 7776, lvl = 15, sk = 80, src = "T", c = "C",
	de = "Brust - Geringes Mana", en = "Chest - Lesser Mana", s = { MANA = 20 } }
add{ g = "CHEST", id = 7857, lvl = 18, sk = 120, src = "T", c = "X", was = T("+25 Leben", "+25 health"),
	de = "Brust - Ausdauer", en = "Chest - Stamina", s = { STA = 4 } }
add{ g = "CHEST", id = 13538, lvl = 22, sk = 140, src = "T", c = "C", s = { ABSORB = 20 }, noLive = true,
	de = "Brust - Geringe Absorption", en = "Chest - Lesser Absorption",
	fde = "Absorbiert ab und zu etwas Schaden", fen = "Occasionally absorbs some damage" }
add{ g = "CHEST", id = 13607, lvl = 22, sk = 145, src = "T", c = "C",
	de = "Brust - Mana", en = "Chest - Mana", s = { MANA = 30 } }
add{ g = "CHEST", id = 13626, lvl = 24, sk = 150, src = "T", c = "C",
	de = "Brust - Schwache Werte", en = "Chest - Minor Stats", s = ALL(1) }
add{ g = "CHEST", id = 13640, lvl = 26, sk = 160, src = "T", c = "C",
	de = "Brust - Große Gesundheit", en = "Chest - Greater Health", s = { HP = 35 } }
add{ g = "CHEST", id = 13663, lvl = 28, sk = 185, src = "T", c = "C",
	de = "Brust - Großes Mana", en = "Chest - Greater Mana", s = { MANA = 50 } }
add{ g = "CHEST", id = 13700, lvl = 30, sk = 200, src = "T", c = "C",
	de = "Brust - Geringe Werte", en = "Chest - Lesser Stats", s = ALL(2) }
add{ g = "CHEST", id = 13858, lvl = 38, sk = 220, src = "T", c = "C",
	de = "Brust - Überragende Gesundheit", en = "Chest - Superior Health", s = { HP = 50 } }
add{ g = "CHEST", id = 13917, lvl = 40, sk = 230, src = "T", c = "C",
	de = "Brust - Überragendes Mana", en = "Chest - Superior Mana", s = { MANA = 65 } }
add{ g = "CHEST", id = 1249071, lvl = 42, sk = 220, src = "V", c = "N", w = FAVOR120, noLive = true,
	s = { ABSORB = 60 }, match = { "Absorption" },
	de = "Brust - Absorption", en = "Chest - Absorption",
	fde = "25% Chance bei Treffer: absorbiert 50 Schaden (höchstens alle 5 Sek.)",
	fen = "25% chance when hit: absorbs 50 damage (at most every 5 sec)",
	m = { { 11176, 10 }, { 11175, 4 }, { 11178, 2 } } }
add{ g = "CHEST", id = 13941, lvl = 44, sk = 245, src = "T", c = "C",
	de = "Brust - Werte", en = "Chest - Stats", s = ALL(3) }
add{ g = "CHEST", id = 20026, lvl = 50, sk = 275, src = "D", c = "C",
	de = "Brust - Erhebliche Gesundheit", en = "Chest - Major Health", s = { HP = 100 } }
add{ g = "CHEST", id = 20028, lvl = 52, sk = 290, src = "D", c = "C",
	de = "Brust - Erhebliches Mana", en = "Chest - Major Mana", s = { MANA = 100 } }
add{ g = "CHEST", id = 20025, lvl = 55, sk = 300, src = "D", c = "F",
	de = "Brust - Große Werte", en = "Chest - Greater Stats", s = ALL(4),
	m = { { 14344, 4 }, { 16204, 15 }, { 16203, 10 } } }

----------------------------------------------------------------------
-- Umhang
----------------------------------------------------------------------
add{ g = "BACK", id = 7454, lvl = 10, sk = 45, src = "T", c = "C",
	de = "Umhang - Schwacher Widerstand", en = "Cloak - Minor Resistance", s = { RES = 1 } }
add{ g = "BACK", id = 7771, lvl = 10, sk = 70, src = "T", c = "C",
	de = "Umhang - Schwacher Schutz", en = "Cloak - Minor Protection", s = { ARMOR = 10 } }
add{ g = "BACK", id = 13419, lvl = 16, sk = 110, src = "V", c = "C",
	where = T("Händler in Eschental und im Steinkrallengebirge", "Vendors in Ashenvale and Stonetalon"),
	de = "Umhang - Schwache Beweglichkeit", en = "Cloak - Minor Agility", s = { AGI = 1 } }
add{ g = "BACK", id = 13421, lvl = 16, sk = 115, src = "T", c = "C",
	de = "Umhang - Geringer Schutz", en = "Cloak - Lesser Protection", s = { ARMOR = 20 } }
add{ g = "BACK", id = 7861, lvl = 18, sk = 125, src = "T", c = "C",
	de = "Umhang - Geringer Feuerwiderstand", en = "Cloak - Lesser Fire Resistance", s = { FIRERES = 5 } }
add{ g = "BACK", id = 13522, lvl = 20, sk = 135, src = "T", c = "C",
	de = "Umhang - Geringer Schattenwiderstand", en = "Cloak - Lesser Shadow Resistance", s = { SHADOWRES = 10 } }
add{ g = "BACK", id = 13635, lvl = 24, sk = 155, src = "T", c = "F", was = "+30",
	de = "Umhang - Verteidigung", en = "Cloak - Defense", s = { ARMOR = 60 } }
add{ g = "BACK", id = 13794, lvl = 26, sk = 175, src = "T", c = "C",
	de = "Umhang - Widerstand", en = "Cloak - Resistance", s = { RES = 3 } }
add{ g = "BACK", id = 13657, lvl = 28, sk = 195, src = "T", c = "C",
	de = "Umhang - Feuerwiderstand", en = "Cloak - Fire Resistance", s = { FIRERES = 7 } }
add{ g = "BACK", id = 13746, lvl = 32, sk = 205, src = "T", c = "C",
	de = "Umhang - Große Verteidigung", en = "Cloak - Greater Defense", s = { ARMOR = 50 } }
add{ g = "BACK", id = 13882, lvl = 36, sk = 225, src = "D", c = "F",
	de = "Umhang - Geringe Beweglichkeit", en = "Cloak - Lesser Agility", s = { AGI = 3 } }
add{ g = "BACK", id = 20014, lvl = 46, sk = 265, src = "T", c = "C",
	de = "Umhang - Großer Widerstand", en = "Cloak - Greater Resistance", s = { RES = 5 } }
add{ g = "BACK", id = 20015, lvl = 52, sk = 285, src = "D", c = "C",
	de = "Umhang - Überragende Verteidigung", en = "Cloak - Superior Defense", s = { ARMOR = 70 } }
add{ g = "BACK", id = 1219587, lvl = 56, sk = 300, src = "V", c = "N", w = FAVOR240,
	de = "Umhang - Beweglichkeit", en = "Cloak - Agility", s = { AGI = 5 } }
add{ g = "BACK", id = 25084, lvl = 60, sk = 300, src = "RAID", c = "C", w = AQ,
	de = "Umhang - Subtilität", en = "Cloak - Subtlety", s = { THREATRED = 2 } }
add{ g = "BACK", id = 25086, lvl = 60, sk = 300, src = "RAID", c = "C", w = AQ,
	de = "Umhang - Ausweichen", en = "Cloak - Dodge", s = { DODGE = 1 } }
add{ g = "BACK", id = 25081, lvl = 60, sk = 300, src = "RAID", c = "C", w = AQ,
	de = "Umhang - Großer Feuerwiderstand", en = "Cloak - Greater Fire Resistance", s = { FIRERES = 15 } }
add{ g = "BACK", id = 25082, lvl = 60, sk = 300, src = "RAID", c = "C", w = AQ,
	de = "Umhang - Großer Naturwiderstand", en = "Cloak - Greater Nature Resistance", s = { NATURERES = 15 } }

----------------------------------------------------------------------
-- Handschuhe
----------------------------------------------------------------------
add{ g = "HANDS", id = 13612, lvl = 20, sk = 145, src = "T", c = "C", util = true, prof = 186,
	de = "Handschuhe - Bergbau", en = "Gloves - Mining", fde = "+2 Bergbau", fen = "+2 Mining" }
add{ g = "HANDS", id = 13617, lvl = 20, sk = 145, src = "T", c = "C", util = true, prof = 182,
	de = "Handschuhe - Kräuterkunde", en = "Gloves - Herbalism", fde = "+2 Kräuterkunde", fen = "+2 Herbalism" }
add{ g = "HANDS", id = 13620, lvl = 20, sk = 145, src = "T", c = "C", util = true, prof = 356,
	de = "Handschuhe - Angeln", en = "Gloves - Fishing", fde = "+2 Angeln", fen = "+2 Fishing" }
add{ g = "HANDS", id = 13698, lvl = 30, sk = 200, src = "T", c = "C", util = true, prof = 393,
	de = "Handschuhe - Kürschnerei", en = "Gloves - Skinning", fde = "+5 Kürschnerei", fen = "+5 Skinning" }
add{ g = "HANDS", id = 13815, lvl = 35, sk = 210, src = "T", c = "C",
	de = "Handschuhe - Beweglichkeit", en = "Gloves - Agility", s = { AGI = 5 } }
add{ g = "HANDS", id = 13887, lvl = 36, sk = 220, src = "T", c = "C",
	de = "Handschuhe - Stärke", en = "Gloves - Strength", s = { STR = 5 } }
add{ g = "HANDS", id = 13841, lvl = 36, sk = 215, src = "T", c = "C", util = true, prof = 186,
	de = "Handschuhe - Fortgeschrittener Bergbau", en = "Gloves - Advanced Mining", fde = "+5 Bergbau", fen = "+5 Mining" }
add{ g = "HANDS", id = 13868, lvl = 38, sk = 225, src = "T", c = "C", util = true, prof = 182,
	de = "Handschuhe - Fortgeschrittene Kräuterkunde", en = "Gloves - Advanced Herbalism", fde = "+5 Kräuterkunde", fen = "+5 Herbalism" }
add{ g = "HANDS", id = 13947, lvl = 40, sk = 250, src = "D", c = "C", util = true,
	de = "Handschuhe - Reiten", en = "Gloves - Riding Skill", fde = "Etwas schnelleres Reiten", fen = "Slightly faster riding" }
add{ g = "HANDS", id = 13948, lvl = 45, sk = 250, src = "D", c = "C",
	de = "Handschuhe - Schwache Hast", en = "Gloves - Minor Haste", s = { HASTE = 1 } }
add{ g = "HANDS", id = 20012, lvl = 48, sk = 270, src = "D", c = "C",
	de = "Handschuhe - Große Beweglichkeit", en = "Gloves - Greater Agility", s = { AGI = 7 } }
add{ g = "HANDS", id = 20013, lvl = 52, sk = 295, src = "D", c = "C",
	de = "Handschuhe - Große Stärke", en = "Gloves - Greater Strength", s = { STR = 7 } }
add{ g = "HANDS", lvl = 60, sk = 300, src = "V", c = "X",
	de = "Handschuhe - Überragende Stärke", en = "Gloves - Superior Strength", s = { STR = 15 } }
add{ g = "HANDS", lvl = 60, sk = 300, src = "V", c = "X",
	de = "Handschuhe - Arkanmacht", en = "Gloves - Arcane Power", s = { ARCANESP = 20 } }
add{ g = "HANDS", lvl = 60, sk = 300, src = "V", c = "X",
	de = "Handschuhe - Heiligmacht", en = "Gloves - Holy Power", s = { HOLYSP = 20 } }
add{ g = "HANDS", lvl = 60, sk = 300, src = "V", c = "X",
	de = "Handschuhe - Naturmacht", en = "Gloves - Nature Power", s = { NATURESP = 20 } }
add{ g = "HANDS", id = 25072, lvl = 60, sk = 300, src = "RAID", c = "C", w = AQ,
	de = "Handschuhe - Bedrohung", en = "Gloves - Threat", s = { THREAT = 2 } }
add{ g = "HANDS", id = 25073, lvl = 60, sk = 300, src = "RAID", c = "C", w = AQ,
	de = "Handschuhe - Schattenmacht", en = "Gloves - Shadow Power", s = { SHADOWSP = 20 } }
add{ g = "HANDS", id = 25074, lvl = 60, sk = 300, src = "RAID", c = "C", w = AQ,
	de = "Handschuhe - Frostmacht", en = "Gloves - Frost Power", s = { FROSTSP = 20 } }
add{ g = "HANDS", id = 25078, lvl = 60, sk = 300, src = "RAID", c = "C", w = AQ,
	de = "Handschuhe - Feuermacht", en = "Gloves - Fire Power", s = { FIRESP = 20 } }
add{ g = "HANDS", id = 25079, lvl = 60, sk = 300, src = "RAID", c = "C", w = AQ, noLive = true,
	de = "Handschuhe - Heilkraft", en = "Gloves - Healing Power", s = { HEAL = 30, SPD = 10 } }
add{ g = "HANDS", id = 25080, lvl = 60, sk = 300, src = "RAID", c = "C", w = AQ,
	de = "Handschuhe - Überragende Beweglichkeit", en = "Gloves - Superior Agility", s = { AGI = 15 } }

----------------------------------------------------------------------
-- Stiefel
----------------------------------------------------------------------
add{ g = "FEET", id = 7863, lvl = 18, sk = 125, src = "T", c = "C",
	de = "Stiefel - Schwache Ausdauer", en = "Boots - Minor Stamina", s = { STA = 1 } }
add{ g = "FEET", id = 7867, lvl = 18, sk = 125, src = "T", c = "C",
	de = "Stiefel - Schwache Beweglichkeit", en = "Boots - Minor Agility", s = { AGI = 1 } }
add{ g = "FEET", id = 13637, lvl = 24, sk = 160, src = "T", c = "C",
	de = "Stiefel - Geringe Beweglichkeit", en = "Boots - Lesser Agility", s = { AGI = 3 } }
add{ g = "FEET", id = 13644, lvl = 24, sk = 170, src = "T", c = "C",
	de = "Stiefel - Geringe Ausdauer", en = "Boots - Lesser Stamina", s = { STA = 3 } }
add{ g = "FEET", id = 13687, lvl = 28, sk = 190, src = "D", c = "C",
	de = "Stiefel - Geringe Willenskraft", en = "Boots - Lesser Spirit", s = { SPI = 3 } }
add{ g = "FEET", id = 13836, lvl = 34, sk = 215, src = "T", c = "C",
	de = "Stiefel - Ausdauer", en = "Boots - Stamina", s = { STA = 5 } }
add{ g = "FEET", id = 13890, lvl = 36, sk = 225, src = "D", c = "C", util = true,
	de = "Stiefel - Schwaches Tempo", en = "Boots - Minor Speed",
	fde = "Etwas mehr Lauftempo - super zum Leveln", fen = "Slightly faster run speed - great for leveling" }
add{ g = "FEET", id = 13935, lvl = 38, sk = 235, src = "T", c = "C",
	de = "Stiefel - Beweglichkeit", en = "Boots - Agility", s = { AGI = 5 } }
add{ g = "FEET", id = 20020, lvl = 46, sk = 260, src = "D", c = "C",
	de = "Stiefel - Große Ausdauer", en = "Boots - Greater Stamina", s = { STA = 7 } }
add{ g = "FEET", id = 20024, lvl = 50, sk = 275, src = "D", c = "C",
	de = "Stiefel - Willenskraft", en = "Boots - Spirit", s = { SPI = 5 } }
add{ g = "FEET", id = 20023, lvl = 52, sk = 295, src = "D", c = "C",
	de = "Stiefel - Große Beweglichkeit", en = "Boots - Greater Agility", s = { AGI = 7 } }

----------------------------------------------------------------------
-- Schild
----------------------------------------------------------------------
add{ g = "SHIELD", id = 13378, lvl = 14, sk = 105, src = "T", c = "C",
	de = "Schild - Schwache Ausdauer", en = "Shield - Minor Stamina", s = { STA = 1 } }
add{ g = "SHIELD", id = 13464, lvl = 16, sk = 115, src = "T", c = "C",
	de = "Schild - Geringer Schutz", en = "Shield - Lesser Protection", s = { ARMOR = 30 } }
add{ g = "SHIELD", id = 13485, lvl = 20, sk = 130, src = "T", c = "C",
	de = "Schild - Geringe Willenskraft", en = "Shield - Lesser Spirit", s = { SPI = 3 } }
add{ g = "SHIELD", id = 13631, lvl = 24, sk = 155, src = "T", c = "C",
	de = "Schild - Geringe Ausdauer", en = "Shield - Lesser Stamina", s = { STA = 3 } }
add{ g = "SHIELD", id = 13659, lvl = 28, sk = 180, src = "T", c = "C",
	de = "Schild - Willenskraft", en = "Shield - Spirit", s = { SPI = 5 } }
add{ g = "SHIELD", id = 13689, lvl = 30, sk = 195, src = "D", c = "C",
	de = "Schild - Geringes Blocken", en = "Shield - Lesser Block", s = { BLOCK = 2 } }
add{ g = "SHIELD", id = 13817, lvl = 34, sk = 210, src = "T", c = "C",
	de = "Schild - Ausdauer", en = "Shield - Stamina", s = { STA = 5 } }
add{ g = "SHIELD", id = 13933, lvl = 38, sk = 235, src = "D", c = "C",
	de = "Schild - Frostwiderstand", en = "Shield - Frost Resistance", s = { FROSTRES = 8 } }
add{ g = "SHIELD", id = 13905, lvl = 40, sk = 230, src = "T", c = "C",
	de = "Schild - Große Willenskraft", en = "Shield - Greater Spirit", s = { SPI = 7 } }
add{ g = "SHIELD", id = 20017, lvl = 46, sk = 265, src = "T", c = "C",
	de = "Schild - Große Ausdauer", en = "Shield - Greater Stamina", s = { STA = 7 } }
add{ g = "SHIELD", id = 20016, lvl = 50, sk = 280, src = "D", c = "C",
	de = "Schild - Überragende Willenskraft", en = "Shield - Superior Spirit", s = { SPI = 9 } }

----------------------------------------------------------------------
-- Hals (neu in Forever)
----------------------------------------------------------------------
add{ g = "NECK", id = 1249019, lvl = 42, sk = 210, src = "V", c = "N", w = FAVOR120,
	de = "Halskette - Stärke", en = "Necklace - Strength", s = { STR = 5 },
	m = { { 11175, 4 }, { 11178, 4 }, { 11176, 10 }, { "SULFURIC_ACID", 4 }, { "BAUXITE", 4 } } }
add{ g = "NECK", id = 1249059, lvl = 42, sk = 210, src = "V", c = "N", w = FAVOR120,
	de = "Halskette - Beweglichkeit", en = "Necklace - Agility", s = { AGI = 5 } }
add{ g = "NECK", id = 1249057, lvl = 42, sk = 210, src = "V", c = "N", w = FAVOR120,
	de = "Halskette - Zauberkraft", en = "Necklace - Spell Power", s = { SP = 6 },
	m = { { 11175, 5 }, { 11178, 3 }, { 11176, 8 }, { "CERULEAN_DYE", 4 }, { "MAGENTA_DYE", 4 } } }
add{ g = "NECK", id = 1249058, lvl = 42, sk = 210, src = "V", c = "N", w = FAVOR120, noLive = true,
	de = "Halskette - Heilkraft", en = "Necklace - Healing Power", s = { HEAL = 11, SPD = 4 } }
add{ g = "NECK", id = 1249060, lvl = 42, sk = 210, src = "V", c = "N", w = FAVOR120,
	de = "Halskette - Ablenkung", en = "Necklace - Deflection", s = { DEF = 5 },
	m = { { 11175, 8 }, { 11178, 2 }, { 11176, 2 }, { "CERULEAN_DYE", 4 }, { "MAGENTA_DYE", 4 } } }

----------------------------------------------------------------------
-- Nebenhand (in der Schildhand geführte Gegenstände, neu in Forever)
----------------------------------------------------------------------
add{ g = "OFFHAND", id = 1219579, lvl = 56, sk = 300, src = "V", c = "N", w = FAVOR240, noLive = true,
	de = "Nebenhand - Weisheit", en = "Off-Hand - Wisdom", s = { INT = 6, SPI = 5 },
	m = { { 14344, 6 }, { 16204, 18 }, { 7082, 1 }, { 7080, 1 } } }
add{ g = "OFFHAND", lvl = 56, sk = 300, src = "V", c = "X",
	de = "Nebenhand - Überragende Intelligenz", en = "Off-Hand - Superior Intellect", s = { INT = 9 } }
add{ g = "OFFHAND", lvl = 56, sk = 300, src = "V", c = "X",
	de = "Nebenhand - Exzellente Willenskraft", en = "Off-Hand - Excellent Spirit", s = { SPI = 12 } }

----------------------------------------------------------------------
-- Ringe: nur Verzauberer, nur die eigenen Ringe (Berufsvorteil "Ringe verzaubern")
----------------------------------------------------------------------
add{ g = "FINGER", lvl = 10, src = "PERK", c = "X", fixed = 1, roles = { MELEE = true, RANGED = true },
	de = "Ring - Angriffskraft", en = "Ring - Attack Power", match = { "Angriffskraft", "Attack Power" },
	fde = "Angriffskraft - wird mit deinem Verzauberkunst-Skill stärker",
	fen = "Attack power - grows with your enchanting skill" }
add{ g = "FINGER", lvl = 10, src = "PERK", c = "X", fixed = 1, roles = { CASTER = true, HEALER = true },
	de = "Ring - Zauberkraft", en = "Ring - Spell Power", match = { "Zauberkraft", "Spell Power" },
	fde = "Zauberkraft - wird mit deinem Verzauberkunst-Skill stärker",
	fen = "Spell power - grows with your enchanting skill" }
add{ g = "FINGER", lvl = 10, src = "PERK", c = "X", fixed = 1, roles = { TANK = true },
	de = "Ring - Ausdauer", en = "Ring - Stamina", match = { "Ausdauer", "Stamina" },
	fde = "Ausdauer - wird mit deinem Verzauberkunst-Skill stärker",
	fen = "Stamina - grows with your enchanting skill" }

----------------------------------------------------------------------
-- Zielfernrohre (Ingenieurskunst) für Bögen, Gewehre und Armbrüste
----------------------------------------------------------------------
add{ g = "SCOPE", item = 4405, lvl = 10, src = "ENG", c = "C",
	de = "Grobes Zielfernrohr", en = "Crude Scope", s = { RDMG = 1 } }
add{ g = "SCOPE", item = 4406, lvl = 20, src = "ENG", c = "C",
	de = "Standardzielfernrohr", en = "Standard Scope", s = { RDMG = 2 } }
add{ g = "SCOPE", item = 4407, lvl = 30, src = "ENG", c = "C",
	de = "Genaues Zielfernrohr", en = "Accurate Scope", s = { RDMG = 3 } }
add{ g = "SCOPE", item = 10546, lvl = 40, src = "ENG", c = "C",
	de = "Tödliches Zielfernrohr", en = "Deadly Scope", s = { RDMG = 5 } }
add{ g = "SCOPE", item = 10548, lvl = 50, src = "ENG", c = "C",
	de = "Scharfschützenzielfernrohr", en = "Sniper Scope", s = { RDMG = 7 } }
add{ g = "SCOPE", item = 18283, lvl = 60, src = "RAID", c = "C",
	where = T("Bauplan aus dem Geschmolzenen Kern", "Schematic from Molten Core"),
	de = "Biznicks 247x128-Genauzielfernrohr", en = "Biznicks 247x128 Accurascope", s = { RHIT = 3 } }

----------------------------------------------------------------------
-- Rüstungssets (Lederverarbeitung): Brust, Beine, Hände, Füße
----------------------------------------------------------------------
local KIT = { "CHEST", "LEGS", "HANDS", "FEET" }
add{ g = KIT, item = 2304, lvl = 10, src = "LW", c = "C",
	de = "Leichtes Rüstungsset", en = "Light Armor Kit", s = { ARMOR = 8 } }
add{ g = KIT, item = 2313, lvl = 15, src = "LW", c = "C",
	de = "Mittleres Rüstungsset", en = "Medium Armor Kit", s = { ARMOR = 16 } }
add{ g = KIT, item = 4265, lvl = 25, src = "LW", c = "C",
	de = "Schweres Rüstungsset", en = "Heavy Armor Kit", s = { ARMOR = 24 } }
add{ g = KIT, item = 8173, lvl = 35, src = "LW", c = "C",
	de = "Dickes Rüstungsset", en = "Thick Armor Kit", s = { ARMOR = 32 } }
add{ g = KIT, item = 15564, lvl = 45, src = "LW", c = "C",
	de = "Robustes Rüstungsset", en = "Rugged Armor Kit", s = { ARMOR = 40 } }

----------------------------------------------------------------------
-- Kopf und Beine: Arkanum-Aufwertungen (Quests)
----------------------------------------------------------------------
local HEADLEGS = { "HEAD", "LEGS" }
local BURNING = { T("Quest in der Brennenden Steppe (Libram)", "Quest in Burning Steppes (libram)") }
local DIREMAUL = { T("Düsterbruch: Libram + Materialien, ab Level 50", "Dire Maul: libram + materials, level 50+") }
add{ g = HEADLEGS, lvl = 50, src = "Q", c = "C", w = BURNING,
	de = "Geringes Arkanum (Gefräßigkeit): Stärke", en = "Lesser Arcanum of Voracity (Strength)", s = { STR = 8 } }
add{ g = HEADLEGS, lvl = 50, src = "Q", c = "C", w = BURNING,
	de = "Geringes Arkanum (Gefräßigkeit): Beweglichkeit", en = "Lesser Arcanum of Voracity (Agility)", s = { AGI = 8 } }
add{ g = HEADLEGS, lvl = 50, src = "Q", c = "C", w = BURNING,
	de = "Geringes Arkanum (Gefräßigkeit): Ausdauer", en = "Lesser Arcanum of Voracity (Stamina)", s = { STA = 8 } }
add{ g = HEADLEGS, lvl = 50, src = "Q", c = "C", w = BURNING,
	de = "Geringes Arkanum (Gefräßigkeit): Intelligenz", en = "Lesser Arcanum of Voracity (Intellect)", s = { INT = 8 } }
add{ g = HEADLEGS, lvl = 50, src = "Q", c = "C", w = BURNING,
	de = "Geringes Arkanum (Gefräßigkeit): Willenskraft", en = "Lesser Arcanum of Voracity (Spirit)", s = { SPI = 8 } }
add{ g = HEADLEGS, lvl = 50, src = "Q", c = "C", w = BURNING,
	de = "Geringes Arkanum der Konstitution", en = "Lesser Arcanum of Constitution", s = { HP = 100 } }
add{ g = HEADLEGS, lvl = 50, src = "Q", c = "C", w = BURNING,
	de = "Geringes Arkanum der Grübelei", en = "Lesser Arcanum of Rumination", s = { MANA = 150 } }
add{ g = HEADLEGS, lvl = 50, src = "Q", c = "C", w = BURNING,
	de = "Geringes Arkanum der Zähigkeit", en = "Lesser Arcanum of Tenacity", s = { ARMOR = 125 } }
add{ g = HEADLEGS, lvl = 50, src = "Q", c = "C", w = BURNING,
	de = "Geringes Arkanum der Widerstandskraft", en = "Lesser Arcanum of Resilience", s = { FIRERES = 20 } }
add{ g = HEADLEGS, lvl = 58, src = "Q", c = "C", w = DIREMAUL,
	de = "Arkanum des Fokus", en = "Arcanum of Focus", s = { SP = 8 } }
add{ g = HEADLEGS, lvl = 58, src = "Q", c = "C", w = DIREMAUL,
	de = "Arkanum der Schnelligkeit", en = "Arcanum of Rapidity", s = { HASTE = 1 } }
add{ g = HEADLEGS, lvl = 58, src = "Q", c = "C", w = DIREMAUL,
	de = "Arkanum des Schutzes", en = "Arcanum of Protection", s = { DODGE = 1 } }

----------------------------------------------------------------------
-- Schultern (Ruf)
----------------------------------------------------------------------
local ZG = { T("Zandalarstamm, ehrfürchtig (Zul'Gurub)", "Zandalar Tribe, exalted (Zul'Gurub)") }
add{ g = "SHOULDER", lvl = 60, src = "R", c = "C", w = ZG,
	de = "Zandalarisches Siegel der Macht", en = "Zandalar Signet of Might", s = { AP = 30 } }
add{ g = "SHOULDER", lvl = 60, src = "R", c = "C", w = ZG,
	de = "Zandalarisches Siegel des Mojo", en = "Zandalar Signet of Mojo", s = { SP = 18 } }
add{ g = "SHOULDER", lvl = 60, src = "R", c = "C", w = ZG, noLive = true,
	de = "Zandalarisches Siegel der Gelassenheit", en = "Zandalar Signet of Serenity", s = { HEAL = 33, SPD = 11 } }
add{ g = "SHOULDER", lvl = 60, src = "R", c = "C",
	where = T("Argentumdämmerung, ehrfürchtig", "Argent Dawn, exalted"),
	de = "Chromatischer Mantel der Dämmerung", en = "Chromatic Mantle of the Dawn", s = { RES = 5 } }
