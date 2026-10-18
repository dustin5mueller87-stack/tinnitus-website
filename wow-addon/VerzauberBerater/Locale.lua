-- Verzauber-Berater: alle Texte der Oberfläche (deutsch / englisch)
local ADDON, ns = ...

local isDE = (GetLocale() == "deDE")
ns.isDE = isDE

-- Liefert je nach Client-Sprache den deutschen oder den englischen Text.
local function T(de, en)
	if isDE then return de end
	return en
end
ns.T = T

-- Unbekannte Schlüssel geben sich selbst zurück, damit nie ein nil im UI landet.
local L = setmetatable({}, { __index = function(_, key) return key end })
ns.L = L

L.TITLE          = T("Verzauber-Berater", "Enchant Advisor")
L.SUBTITLE       = T("Verzauberungen für WoW Forever", "Enchants for WoW Forever")

-- Bedienleiste
L.CLASS          = T("Klasse", "Class")
L.SPEC           = T("Spec", "Spec")
L.WEAPONS        = T("Waffen", "Weapons")
L.LEVEL          = T("Level", "Level")
L.MY_CHAR        = T("Mein Charakter", "My character")
L.MY_CHAR_TIP    = T("Klasse, Spec und Level deines eingeloggten Charakters übernehmen.", "Use the class, spec and level of the character you are logged in with.")

-- Register
L.TAB_RECO       = T("Empfehlung", "Recommendation")
L.TAB_PLAN       = T("Fahrplan 10-60", "Roadmap 10-60")
L.TAB_GEAR       = T("Meine Ausrüstung", "My gear")
L.TAB_SHOP       = T("Einkaufsliste", "Shopping list")
L.TAB_ALL        = T("Alle Verzauberungen", "All enchants")
L.TAB_INFO       = T("Info", "Info")

-- Waffen-Setups
L.SETUP_AUTO     = T("Automatisch", "Automatic")
L.SETUP_2H       = T("Zweihandwaffe", "Two-hander")
L.SETUP_DW       = T("Zwei Einhandwaffen", "Dual wield")
L.SETUP_1HS      = T("Einhand + Schild", "One-hand + shield")
L.SETUP_1HOH     = T("Einhand + Nebenhand", "One-hand + off-hand")
L.SETUP_AUTO_IS  = T("Automatisch (%s)", "Automatic (%s)")

-- Slots
L.SLOT_HEAD      = T("Kopf", "Head")
L.SLOT_NECK      = T("Hals", "Neck")
L.SLOT_SHOULDER  = T("Schultern", "Shoulders")
L.SLOT_BACK      = T("Umhang", "Cloak")
L.SLOT_CHEST     = T("Brust", "Chest")
L.SLOT_WRIST     = T("Armschienen", "Bracers")
L.SLOT_HANDS     = T("Handschuhe", "Gloves")
L.SLOT_LEGS      = T("Beine", "Legs")
L.SLOT_FEET      = T("Stiefel", "Boots")
L.SLOT_FINGER1   = T("Ring 1", "Ring 1")
L.SLOT_FINGER2   = T("Ring 2", "Ring 2")
L.SLOT_2H        = T("Zweihandwaffe", "Two-hand weapon")
L.SLOT_MH        = T("Waffenhand", "Main hand")
L.SLOT_OH_WEAPON = T("Schildhand (Waffe)", "Off hand (weapon)")
L.SLOT_SHIELD    = T("Schild", "Shield")
L.SLOT_OH_HELD   = T("Nebenhand", "Off-hand item")
L.SLOT_RANGED    = T("Fernkampfwaffe", "Ranged weapon")

-- Gruppen (für den Filter in "Alle Verzauberungen")
L.GROUP_ALL      = T("Alle Slots", "All slots")
L.GROUP_WEAPON   = T("Waffe (jede)", "Weapon (any)")
L.GROUP_2H       = T("Nur Zweihand", "Two-hand only")
L.GROUP_SHIELD   = T("Schild", "Shield")
L.GROUP_OFFHAND  = T("Nebenhand", "Off-hand item")
L.GROUP_BACK     = T("Umhang", "Cloak")
L.GROUP_CHEST    = T("Brust", "Chest")
L.GROUP_WRIST    = T("Armschienen", "Bracers")
L.GROUP_HANDS    = T("Handschuhe", "Gloves")
L.GROUP_FEET     = T("Stiefel", "Boots")
L.GROUP_NECK     = T("Hals", "Neck")
L.GROUP_FINGER   = T("Ring", "Ring")
L.GROUP_HEAD     = T("Kopf", "Head")
L.GROUP_LEGS     = T("Beine", "Legs")
L.GROUP_SHOULDER = T("Schultern", "Shoulders")
L.GROUP_SCOPE    = T("Zielfernrohr", "Scope")

-- Rollen
L.ROLE_MELEE     = T("Nahkampf", "Melee")
L.ROLE_RANGED    = T("Fernkampf", "Ranged")
L.ROLE_CASTER    = T("Zauberer", "Caster")
L.ROLE_HEALER    = T("Heiler", "Healer")
L.ROLE_TANK      = T("Tank", "Tank")

-- Herkunft der Rezepte
L.SRC_T          = T("Lehrer", "Trainer")
L.SRC_D          = T("Drop", "Drop")
L.SRC_V          = T("Händler", "Vendor")
L.SRC_R          = T("Ruf", "Reputation")
L.SRC_Q          = T("Quest", "Quest")
L.SRC_RAID       = T("Schlachtzug", "Raid")
L.SRC_ENG        = T("Ingenieurskunst", "Engineering")
L.SRC_LW         = T("Lederverarbeitung", "Leatherworking")
L.SRC_PERK       = T("Berufsvorteil (nur Verzauberer)", "Profession perk (enchanters only)")
L.SRC_U          = T("Unbekannt", "Unknown")

-- Werte-Namen für die automatisch gebauten Effekt-Texte (z. B. "+6 Waffenschaden")
ns.STAT_NAMES = {
	STR = T("Stärke", "Strength"),
	AGI = T("Beweglichkeit", "Agility"),
	STA = T("Ausdauer", "Stamina"),
	INT = T("Intelligenz", "Intellect"),
	SPI = T("Willenskraft", "Spirit"),
	HP = T("Gesundheit", "Health"),
	MANA = T("Mana", "Mana"),
	ARMOR = T("Rüstung", "Armor"),
	DEF = T("Verteidigung", "Defense"),
	DODGE = T("Ausweichen", "dodge"),
	PARRY = T("Parieren", "parry"),
	BLOCK = T("Blockchance", "block chance"),
	HIT = T("Trefferchance", "hit chance"),
	RHIT = T("Distanz-Trefferchance", "ranged hit chance"),
	CRIT = T("kritische Treffer", "critical strike chance"),
	HASTE = T("Angriffstempo", "attack speed"),
	AP = T("Angriffskraft", "Attack Power"),
	RAP = T("Distanzangriffskraft", "Ranged Attack Power"),
	WDMG = T("Waffenschaden", "Weapon Damage"),
	RDMG = T("Fernkampfschaden", "Ranged Damage"),
	SP = T("Zauberkraft", "Spell Power"),
	HEAL = T("Heilung", "Healing"),
	SPD = T("Zauberschaden", "Spell Damage"),
	FIRESP = T("Feuerschaden", "Fire Damage"),
	FROSTSP = T("Frostschaden", "Frost Damage"),
	SHADOWSP = T("Schattenschaden", "Shadow Damage"),
	NATURESP = T("Naturschaden", "Nature Damage"),
	ARCANESP = T("Arkanschaden", "Arcane Damage"),
	HOLYSP = T("Heiligschaden", "Holy Damage"),
	MP5 = T("Mana alle 5 Sek.", "mana per 5 sec"),
	HP5 = T("Gesundheit alle 5 Sek.", "health per 5 sec"),
	RES = T("alle Widerstände", "all resistances"),
	FIRERES = T("Feuerwiderstand", "Fire Resistance"),
	FROSTRES = T("Frostwiderstand", "Frost Resistance"),
	NATURERES = T("Naturwiderstand", "Nature Resistance"),
	SHADOWRES = T("Schattenwiderstand", "Shadow Resistance"),
	ARCANERES = T("Arkanwiderstand", "Arcane Resistance"),
	THREAT = T("Bedrohung", "threat"),
	THREATRED = T("Bedrohung", "threat"),
	BEAST = T("Schaden gegen Wildtiere", "damage vs beasts"),
	ELEM = T("Schaden gegen Elementare", "damage vs elementals"),
	DEMON = T("Schaden gegen Dämonen", "damage vs demons"),
	ABSORB = T("Absorption", "absorption"),
}
L.FX_ALLSTATS    = T("+%s alle Werte", "+%s all stats")

-- Empfehlung
L.RECO_HEADER    = T("Empfehlungen für %s - Level %d", "Recommendations for %s - level %d")
L.NOTHING_YET    = T("Noch nichts Sinnvolles", "Nothing worthwhile yet")
L.NO_OPTIONS     = T("Keine passende Aufwertung bekannt", "No suitable upgrade known")
L.FIRST_AT       = T("Erste Option ab Level %d: %s", "First option at level %d: %s")
L.NEXT_UPGRADE   = T("Upgrade ab Level %d: %s", "Upgrade at level %d: %s")
L.ALTERNATIVE    = T("Alternative: %s", "Alternative: %s")
L.UTILITY        = T("Komfort: %s", "Utility: %s")
L.FROM_LEVEL     = T("ab Lvl %d", "lvl %d+")
L.TOP_PRIO       = T("Top-Priorität: bringt dir gerade am meisten.", "Top priority: gives you the most right now.")
L.ENCHANTER_CB   = T("Ich bin Verzauberer (Ringe)", "I am an enchanter (rings)")
L.ENCHANTER_TIP  = T("Ring-Verzauberungen kann nur ein Verzauberer auf seine eigenen Ringe wirken.", "Ring enchants can only be applied by an enchanter to their own rings.")
L.SCORE          = T("Wert für deinen Spec", "Value for your spec")

-- Tooltip-Details
L.TT_SKILL       = T("Verzauberkunst: %d", "Enchanting skill: %d")
L.TT_SOURCE      = T("Rezept: %s", "Recipe: %s")
L.TT_MATS        = T("Materialien:", "Materials:")
L.TT_MATS_UNKNOWN= T("Materialien: noch nicht bekannt", "Materials: not known yet")
L.TT_LEVEL       = T("Sinnvoll ab Level %d", "Worthwhile from level %d")
L.TT_NEW         = T("NEU in WoW Forever", "NEW in WoW Forever")
L.TT_CHANGED     = T("In Forever geändert (Classic: %s)", "Changed in Forever (Classic: %s)")
L.TT_UNVERIFIED  = T("Wert aus Classic - in Forever noch nicht bestätigt", "Classic value - not yet confirmed for Forever")
L.TT_VERIFIED    = T("Für WoW Forever bestätigt", "Confirmed for WoW Forever")
L.TT_RANKING     = T("Rangliste für diesen Slot:", "Ranking for this slot:")
L.TT_NOT_YET     = T("(erst ab Level %d)", "(from level %d)")
L.TT_LIVE_OK     = T("Im Spiel geprüft", "Checked in game")
L.TT_LIVE_FIXED  = T("Wert aus dem Spiel übernommen (Datenbank hatte %s)", "Value taken from the game (database had %s)")
L.TT_INGAME      = T("Text im Spiel:", "In-game text:")
L.PRIO           = T("%s  -  Prioritäten: %s", "%s  -  priorities: %s")

-- Fahrplan
L.PLAN_HEADER    = T("Fahrplan für %s: was du wann draufpackst", "Roadmap for %s: what to use when")
L.PLAN_HINT      = T("Hell = hier lohnt sich ein Wechsel. Die markierte Spalte ist dein gewähltes Level.", "Bright = worth switching here. The marked column is your selected level.")

-- Ausrüstung
L.GEAR_HEADER    = T("Bewertet für: %s - Level %d (dein Charakter)", "Rated for: %s - level %d (your character)")
L.GEAR_RESCAN    = T("Neu scannen", "Rescan")
L.GEAR_EMPTY     = T("nichts angelegt", "nothing equipped")
L.GEAR_NONE      = T("Keine Verzauberung!", "Not enchanted!")
L.GEAR_ENCHANTED = T("Verzaubert", "Enchanted")
L.GEAR_GOOD      = T("Passt!", "Good!")
L.GEAR_BETTER    = T("Besser: %s", "Better: %s")
L.GEAR_SUGGEST   = T("Tipp: %s", "Tip: %s")
L.GEAR_NOTHING   = T("Hier lohnt sich noch nichts", "Nothing worthwhile here yet")
L.GEAR_SUMMARY   = T("%d von %d Slots verzaubert - %d fehlen, %d könnten besser sein", "%d of %d slots enchanted - %d missing, %d could be better")
L.GEAR_SPEC_HINT = T("Falscher Spec? Wähle oben deinen Spec aus - er wird für diesen Charakter gemerkt.", "Wrong spec? Pick yours above - it is remembered for this character.")

-- Einkaufsliste
L.SHOP_ONLY_MISSING = T("Nur was mir noch fehlt (laut Ausrüstungs-Scan)", "Only what I am missing (from gear scan)")
L.SHOP_ENCHANTS  = T("Diese Verzauberungen brauchst du:", "You need these enchants:")
L.SHOP_MATS      = T("Materialien gesamt (ungefähr):", "Materials total (approx.):")
L.SHOP_UNKNOWN   = T("Für %d Verzauberung(en) sind die Materialien noch unbekannt.", "Materials still unknown for %d enchant(s).")
L.SHOP_NOTHING   = T("Nichts zu kaufen - alles erledigt oder noch nichts Sinnvolles verfügbar.", "Nothing to buy - all done or nothing worthwhile available yet.")
L.SHOP_CHAT      = T("Verzauberer im Chat suchen", "Ask for an enchanter in chat")
L.SHOP_CHAT_TIP  = T("Öffnet die Chat-Eingabe mit einer fertigen Anfrage. Du musst nur noch Enter drücken (z. B. im Handelskanal).", "Opens the chat input with a ready-made request. Just press Enter (e.g. in the trade channel).")
L.SHOP_CHAT_MSG  = T("Suche Verzauberer für: %s - Trinkgeld inklusive, bitte /w!", "LF enchanter for: %s - tip included, please /w!")
L.SHOP_FOR       = T("Für: %s - Level %d", "For: %s - level %d")
L.SHOP_NO_MATS   = T("(keine Verzauberkunst-Materialien nötig)", "(no enchanting materials needed)")

-- Alle Verzauberungen
L.ALL_FILTER     = T("Slot", "Slot")
L.ALL_ONLY_USEFUL= T("Nur was meinem Spec etwas bringt", "Only what helps my spec")
L.ALL_COUNT      = T("%d Einträge", "%d entries")
L.COL_LEVEL      = T("Lvl", "Lvl")
L.COL_NAME       = T("Name", "Name")
L.COL_EFFECT     = T("Effekt", "Effect")
L.COL_VALUE      = T("Wert", "Value")
L.COL_SOURCE     = T("Quelle", "Source")
L.INFO_VERSION   = T("Version %s  -  Datenstand: WoW Forever Beta 1.60.1 (Oktober 2026)  -  %d Einträge, %d davon im Spiel geprüft",
	"Version %s  -  data: WoW Forever beta 1.60.1 (October 2026)  -  %d entries, %d of them checked in game")
L.NEW_BADGE      = T("NEU", "NEW")

-- Info / Optionen
L.OPT_MINIMAP    = T("Minimap-Button anzeigen", "Show minimap button")
L.OPT_TOOLTIP    = T("Verzauberungs-Tipps in Gegenstands-Tooltips", "Enchant tips in item tooltips")
L.OPT_UTILITY    = T("Komfort-Tipps anzeigen (Lauftempo, Berufe)", "Show utility tips (run speed, professions)")
L.OPT_LEVELUP    = T("Beim Level-Up neue Verzauberungen ansagen", "Announce new enchants on level-up")
L.INFO_TEXT = T(
	"|cffffd100So funktioniert's|r\n" ..
	"Wähle oben Klasse, Spec, Waffen-Setup und Level. Der Berater bewertet jede bekannte Verzauberung mit den Werte-Gewichten deines Specs " ..
	"(z. B. Beweglichkeit für Schurken, Zauberschaden für Magier, Ausdauer und Verteidigung für Tanks) und zeigt pro Slot die beste, " ..
	"die auf deinem Level schon sinnvoll zu haben ist.\n\n" ..
	"|cffffd100Zeichen|r\n" ..
	"%s  Top-Priorität: diese Slots bringen dir gerade am meisten.\n" ..
	"%s  Wert stammt aus Classic und ist für Forever noch nicht bestätigt.\n" ..
	"|cff1eff00Grün|r = Effekt   |cff9d9d9dGrau|r = Alternativen und nächstes Upgrade\n\n" ..
	"|cffffd100Wichtig|r\n" ..
	"WoW Forever ist noch in der Beta, Blizzard dreht ständig an den Zahlen. Wenn ein Wert ingame anders ist, " ..
	"gilt das Spiel - die Daten stehen in Data\\Enchants.lua und lassen sich leicht anpassen.\n\n" ..
	"|cffffd100Befehle|r\n" ..
	"/vb - Fenster an/aus     /vb scan - Ausrüstung prüfen\n" ..
	"/vb minimap - Minimap-Button an/aus     /vb reset - Fensterposition zurücksetzen",
	"|cffffd100How it works|r\n" ..
	"Pick class, spec, weapon setup and level at the top. The advisor scores every known enchant with your spec's stat weights " ..
	"(e.g. agility for rogues, spell damage for mages, stamina and defense for tanks) and shows the best one per slot " ..
	"that is sensible to get at your level.\n\n" ..
	"|cffffd100Legend|r\n" ..
	"%s  Top priority: these slots give you the most right now.\n" ..
	"%s  Value comes from Classic and is not yet confirmed for Forever.\n" ..
	"|cff1eff00Green|r = effect   |cff9d9d9dGrey|r = alternatives and next upgrade\n\n" ..
	"|cffffd100Important|r\n" ..
	"WoW Forever is still in beta and Blizzard keeps tuning numbers. If a value differs in game, the game wins - " ..
	"the data lives in Data\\Enchants.lua and is easy to adjust.\n\n" ..
	"|cffffd100Commands|r\n" ..
	"/vb - toggle window     /vb scan - check gear\n" ..
	"/vb minimap - toggle minimap button     /vb reset - reset window position")

-- Chat / Level-Up
L.CHAT_PREFIX    = "|cffa335eeVerzauber|r|cffffd100-Berater|r: "
L.LOADED         = T("geladen. |cffffd100/vb|r öffnet das Fenster.", "loaded. |cffffd100/vb|r opens the window.")
L.LEVELUP_NEW    = T("Level %d! Neu für %s: %s", "Level %d! New for %s: %s")
L.LEVELUP_CHECK  = T("Schau mal ins Fenster: |cffffd100/vb|r", "Have a look: |cffffd100/vb|r")
L.MINIMAP_TIP    = T("Linksklick: Fenster öffnen/schließen\nZiehen: Button verschieben", "Left-click: open/close window\nDrag: move button")
L.MINIMAP_ON     = T("Minimap-Button an.", "Minimap button shown.")
L.MINIMAP_OFF    = T("Minimap-Button aus. Mit /vb minimap holst du ihn zurück.", "Minimap button hidden. Use /vb minimap to bring it back.")
L.RESET_DONE     = T("Fensterposition zurückgesetzt.", "Window position reset.")
L.HELP           = T("Befehle: /vb, /vb scan, /vb minimap, /vb reset", "Commands: /vb, /vb scan, /vb minimap, /vb reset")
L.TOOLTIP_TIP    = T("Tipp: %s", "Tip: %s")
L.TOOLTIP_OK     = T("Verzaubert", "Enchanted")
