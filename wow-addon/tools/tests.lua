-- Testszenarien für den Verzauber-Berater (läuft im Mock-Client aus wow_mock.lua)
local ADDON = "VerzauberBerater"
local ns = {}
local passed = 0

local function ok(condition, message)
	if not condition then error("TEST FEHLGESCHLAGEN: " .. message, 2) end
	passed = passed + 1
end

local function find(list, pattern)
	for _, text in ipairs(list) do
		if tostring(text):find(pattern) then return text end
	end
end

local isDE = MOCK_LOCALE == "deDE"

----------------------------------------------------------------------
-- Testdaten: Überlebens-Jäger Level 30
----------------------------------------------------------------------
local function link(id, enchant, name)
	return ("|cff1eff00|Hitem:%d:%s:::::::30:::::|h[%s]|h|r"):format(id, enchant or "", name)
end
Mock.items = {
	[1001] = { equipLoc = "INVTYPE_WEAPON", classID = 2, subclassID = 7, icon = 1 },
	[1002] = { equipLoc = "INVTYPE_WEAPON", classID = 2, subclassID = 15, icon = 2 },
	[1003] = { equipLoc = "INVTYPE_RANGED", classID = 2, subclassID = 2, icon = 3 },
	[1004] = { equipLoc = "INVTYPE_WRIST", classID = 4, subclassID = 2, icon = 4 },
	[1005] = { equipLoc = "INVTYPE_CHEST", classID = 4, subclassID = 3, icon = 5 },
	[1006] = { equipLoc = "INVTYPE_FEET", classID = 4, subclassID = 3, icon = 6 },
	[1007] = { equipLoc = "INVTYPE_CLOAK", classID = 4, subclassID = 1, icon = 7 },
	[1008] = { equipLoc = "INVTYPE_2HWEAPON", classID = 2, subclassID = 6, icon = 8 },
	[1009] = { equipLoc = "INVTYPE_HAND", classID = 4, subclassID = 3, icon = 9 },
	[1010] = { equipLoc = "INVTYPE_RANGEDRIGHT", classID = 2, subclassID = 19, icon = 10 },
	[1011] = { equipLoc = "INVTYPE_FINGER", classID = 4, subclassID = 0, icon = 11 },
}
Mock.inventory = {
	[16] = { link = link(1001, nil, "Klinge"), name = "Klinge", icon = 1 },
	[17] = { link = link(1002, 13503, "Dolch"), name = "Dolch", icon = 2,
		enchantText = isDE and "Waffenschaden +2" or "Weapon Damage +2" },
	[18] = { link = link(1003, nil, "Bogen"), name = "Bogen", icon = 3 },
	[9] = { link = link(1004, 13501, "Armschienen"), name = "Armschienen", icon = 4,
		enchantText = isDE and "Ausdauer +4" or "Stamina +4" },
	[5] = { link = link(1005, 13700, "Brustschutz"), name = "Brustschutz", icon = 5,
		enchantText = isDE and "+2 alle Werte" or "+2 All Stats" },
	[8] = { link = link(1006, nil, "Stiefel"), name = "Stiefel", icon = 6 },
	[15] = { link = link(1007, 999, "Umhang"), name = "Umhang", icon = 7, enchantText = "Glitzer" },
	[10] = { link = link(1009, nil, "Handschuhe"), name = "Handschuhe", icon = 9 },
	[11] = { link = link(1011, nil, "Ring"), name = "Ring", icon = 11 },
}

-- Spell-Daten, wie der Client sie liefern würde
Mock.spells = {
	[13695] = { name = isDE and "Zweihandwaffe - Einschlag" or "Enchant 2H Weapon - Impact",
		desc = isDE and "Verzaubert eine Zweihandnahkampfwaffe dauerhaft, sodass sie 6 zusätzlichen Schaden verursacht."
			or "Permanently enchant a Two-Handed Melee Weapon to cause 6 additional points of damage." },
	[13501] = { name = isDE and "Armschiene - Geringe Ausdauer" or "Enchant Bracer - Lesser Stamina",
		desc = isDE and "Verzaubert Armschienen dauerhaft, sodass sie die Ausdauer um 4 erhöhen."
			or "Permanently enchant bracers to increase Stamina by 4." },
	[7457] = { name = isDE and "Armschiene - Schwache Ausdauer" or "Enchant Bracer - Minor Stamina",
		desc = isDE and "Verzaubert Armschienen dauerhaft, sodass sie die Ausdauer um 5 erhöhen."
			or "Permanently enchant bracers to increase Stamina by 5." },
	[13640] = { name = isDE and "Brust - Große Ausdauer" or "Enchant Chest - Greater Stamina",
		desc = isDE and "Verzaubert einen Brustschutz dauerhaft, sodass er die Ausdauer um 4 erhöht."
			or "Permanently enchant a piece of chest armor to increase Stamina by 4." },
	[20025] = { name = isDE and "Brust - Große Werte" or "Enchant Chest - Greater Stats",
		desc = isDE and "Verzaubert einen Brustschutz dauerhaft, sodass er alle Werte um 4 erhöht."
			or "Permanently enchant chest armor to grant +4 to all stats." },
	[13419] = { name = "Feuerball", desc = "Schleudert einen Feuerball, der 25 Schaden verursacht." },
	[1248607] = { cached = false, name = isDE and "Zweihandwaffe - Mächtige Zauberkraft" or "Enchant 2H Weapon - Mighty Spell Power",
		desc = isDE and "Erhöht Zauberschaden und Heilung um bis zu 55." or "Increases spell damage and healing by up to 55." },
	[20034] = { name = isDE and "Waffe - Kreuzfahrer" or "Enchant Weapon - Crusader",
		desc = "Chance auf 100 Stärke für 15 Sek. und Heilung um 75 bis 125." },
}
Mock.itemNames = { [11137] = isDE and "Visionenstaub" or "Vision Dust", [11139] = isDE and "Großer leuchtender Splitter" or "Large Glowing Shard" }

----------------------------------------------------------------------
-- Add-on laden wie der Client (Reihenfolge aus der .toc)
----------------------------------------------------------------------
for _, file in ipairs(TOC_FILES) do
	Mock.LoadAddonFile(ADDON_DIR .. "/" .. file, ADDON, ns)
end
ok(SlashCmdList.VERZAUBERBERATER ~= nil, "Slash-Befehl registriert")

Mock.FireEvent("ADDON_LOADED", "SomeOtherAddon")
ok(ns.db == nil, "fremdes ADDON_LOADED wird ignoriert")
Mock.FireEvent("ADDON_LOADED", ADDON)
ok(type(VerzauberBeraterDB) == "table" and ns.db == VerzauberBeraterDB, "SavedVariables angelegt")
Mock.FireEvent("PLAYER_LOGIN")
Mock.RunTimers()

ok(ns.ownSpec and ns.ownSpec.key == "HUNTER_SV", "Spec über C_Traits erkannt (Überleben): " .. tostring(ns.ownSpec and ns.ownSpec.key))
ok(ns.sel.level == 30 and ns.sel.classFile == "HUNTER", "Auswahl startet beim eigenen Charakter")
ok(ns:IsEnchanter(), "Verzauberer erkannt")
ok(find(Mock.chat, "geladen") or find(Mock.chat, "loaded"), "Lade-Meldung im Chat")
ok(ns.version == "1.0.0-test", "Version aus der TOC gelesen")

----------------------------------------------------------------------
-- Live-Abgleich mit Client-Daten
----------------------------------------------------------------------
local byID, byEn = {}, {}
for _, e in ipairs(ns.ENCHANTS) do
	if e.id then byID[e.id] = e end
	byEn[e.en] = e
end
ok(byID[13695].liveOK and byID[13695].s.WDMG == 6, "Einschlag +6 im Spiel bestätigt")
ok(byID[13695].name == Mock.spells[13695].name, "Client-Name übernommen")
ok(byID[7457].s.STA == 5 and byID[7457].liveFrom == 3, "Schwache Ausdauer aus dem Spiel korrigiert (3 -> 5)")
ok(byID[13640].s.STA == 4 and byID[13640].liveOK, "Brust - Große Ausdauer im Spiel bestätigt")
local renamed = { s = { HP = 35 } }
ns.ApplyLiveValue(renamed, isDE and "Erhöht die Ausdauer um 4." or "Increases Stamina by 4.")
ok(renamed.s.STA == 4 and renamed.s.HP == nil and renamed.liveOK, "Leben -> Ausdauer umgestellt, wenn Forever umbenannt hat")
local twoNumbers = { s = { STA = 3 } }
ns.ApplyLiveValue(twoNumbers, "Erhöht die Ausdauer um 5 für 10 Sek.")
ok(twoNumbers.s.STA == 3 and not twoNumbers.liveOK, "bei zwei Zahlen wird nichts geraten")
ok(byID[20025].liveOK and byID[20025].s.AGI == 4, "Alle Werte +4 bestätigt")
ok(byID[13419].liveMismatch and not byID[13419].live, "falsche Spell-ID wird ignoriert")
ok(not byID[20034].liveOK and byID[20034].s.STR == 23, "Proc-Verzauberung wird nicht verfälscht")
ok(not byID[1248607].live and find(Mock.log, "spell%-request 1248607"), "fehlende Spell-Daten angefordert")
Mock.spells[1248607].cached = true
Mock.FireEvent("SPELL_DATA_LOAD_RESULT", 1248607, true)
Mock.RunTimers()
ok(byID[1248607].live and byID[1248607].liveOK, "nachgeladene Spell-Daten übernommen")

----------------------------------------------------------------------
-- Empfehlungen: Stichproben
----------------------------------------------------------------------
local function best(specKey, setup, level, slot)
	local spec = ns.specByKey[specKey]
	for _, row in ipairs(ns:BuildRecommendations(spec, setup, level, false)) do
		if row.key == slot then return row.reco.best and row.reco.best.e, row.reco end
	end
end
local function en(e) return e and e.en or "nil" end

ok(en(best("WARRIOR_ARMS", "2H", 30, "MAINHAND")) == "2H Weapon - Impact", "Waffen-Krieger 30: Einschlag")
ok(en(best("WARRIOR_ARMS", "2H", 36, "MAINHAND")) == "2H Weapon - Lesser Strength", "Waffen-Krieger 36: Geringe Stärke")
ok(en(best("WARRIOR_ARMS", "2H", 60, "MAINHAND")) == "2H Weapon - Strength", "Waffen-Krieger 60: Stärke +25")
ok(en(best("SHAMAN_ENH", "2H", 30, "MAINHAND")) == "2H Weapon - Impact", "Verstärker 30: Einschlag")
ok(en(best("DRUID_CAT", "2H", 30, "MAINHAND")) == "2H Weapon - Impact", "Katze 30: Einschlag (Forever: Waffe zählt)")
ok(en(best("HUNTER_BM", "2H", 40, "MAINHAND")) == "2H Weapon - Lesser Agility", "Tierherrschaft 40: Beweglichkeit auf den Werte-Stab")
ok(en(best("HUNTER_BM", "2H", 30, "RANGED")) == "Accurate Scope", "Fernkampf-Jäger 30: Genaues Zielfernrohr")
ok(en(best("HUNTER_SV", "DW", 30, "MAINHAND")) == "Weapon - Striking", "Überleben 30: Schlag")
ok(en(best("HUNTER_SV", "DW", 30, "OFFHAND")) == "Weapon - Striking", "Überleben 30 Schildhand: Schlag")
ok(en(best("SHAMAN_ELE", "1HS", 30, "MAINHAND")) == "Weapon - Revelation", "Elementar 30: Offenbarung")
ok(en(best("PRIEST_HOLY", "2H", 60, "MAINHAND")) == "2H Weapon - Mighty Healing Power", "Heilig-Priester 60: Mächtige Heilkraft")
ok(en(best("MAGE_FROST", "2H", 30, "MAINHAND")) == "Weapon - Revelation", "Frost-Magier 30: Offenbarung")
ok(en(best("WARRIOR_PROT", "1HS", 60, "WRIST")) == "Bracer - Superior Stamina", "Schutz-Krieger 60: Überragende Ausdauer")
ok(en(best("ROGUE_COMBAT", "DW", 60, "WRIST")) == "Bracer - Superior Agility", "Schurke 60: Überragende Beweglichkeit")
ok(en(best("PALADIN_PROT", "1HS", 60, "MAINHAND")) == "Weapon - Spell Power", "Schutz-Paladin 60: Zauberkraft")
ok(best("WARRIOR_ARMS", "2H", 30, "HANDS") == nil, "Handschuhe bei 30: noch nichts")
local _, gloves = best("WARRIOR_ARMS", "2H", 30, "HANDS")
ok(gloves.nextUp and gloves.nextUp.e.lvl == 35 and gloves.nextUp.e.en == "Gloves - Agility", "Handschuhe: erste Option ab 35 (Beweglichkeit)")
local _, gloves35 = best("WARRIOR_ARMS", "2H", 35, "HANDS")
ok(gloves35.best.e.en == "Gloves - Agility" and gloves35.nextUp.e.en == "Gloves - Strength", "ab 35 Beweglichkeit, Upgrade Stärke ab 36")

-- Jede Klasse, jeder Spec, jedes Setup, jedes Level: keine Fehler, sinnvolle Struktur
local combos = 0
for _, class in ipairs(ns.CLASSES) do
	for _, spec in ipairs(class.specs) do
		for _, setup in ipairs({ "2H", "DW", "1HS", "1HOH" }) do
			for level = ns.LEVEL_MIN, ns.LEVEL_MAX do
				local rows = ns:BuildRecommendations(spec, setup, level, true)
				ok(#rows >= 10, "genug Slots für " .. spec.key)
				for _, row in ipairs(rows) do
					local reco = row.reco
					if reco.best then
						ok(reco.best.e.lvl <= level, "Empfehlung nicht über dem Level")
						if reco.nextUp then ok(reco.nextUp.e.lvl > level and reco.nextUp.score > reco.best.score, "Upgrade ist besser und später") end
					end
					for _, c in ipairs(reco.ranked) do
						if c.e.roles then ok(c.e.roles[spec.role], "Rollen-Filter greift") end
						ok(not c.e.util, "Komfort-Verzauberungen werden nicht bewertet")
					end
				end
				combos = combos + 1
			end
		end
	end
end
ok(combos == 28 * 4 * 51, "alle Kombinationen durchgerechnet: " .. combos)

-- Effekt-Texte
for _, e in ipairs(ns.ENCHANTS) do
	local text = ns:EffectText(e)
	ok(type(text) == "string" and text ~= "", "Effekt-Text für " .. e.en)
	ok(not text:find("nil"), "kein nil im Effekt-Text: " .. e.en)
end

----------------------------------------------------------------------
-- Fenster und alle Register
----------------------------------------------------------------------
SlashCmdList.VERZAUBERBERATER("")
local frame = VerzauberBeraterFrame
ok(frame and frame:IsShown(), "Fenster öffnet mit /vb")
for tab = 1, 6 do
	ns.UI:SelectTab(tab)
	ok(ns.UI.activeTab == tab, "Register " .. tab .. " aktiv")
end
for _, class in ipairs(ns.CLASSES) do
	ns:SetClass(class.file)
	for _, spec in ipairs(class.specs) do
		ns:SetSpec(spec.key)
		for _, setup in ipairs({ "AUTO", "2H", "DW", "1HS", "1HOH" }) do
			ns:SetSetup(setup)
			for _, level in ipairs({ 10, 23, 30, 47, 60 }) do
				ns:SetLevel(level)
				for tab = 1, 6 do ns.UI:SelectTab(tab) end
			end
		end
	end
end
ok(true, "alle Klassen/Specs/Setups/Level durch alle Register geklickt")

-- Eigene Spec-Wahl wird gemerkt
ns:SetClass("HUNTER")
ns:SetSpec("HUNTER_BM")
ok(ns.cdb.specKey == "HUNTER_BM" and ns:OwnSpec().key == "HUNTER_BM", "eigener Spec wird gemerkt")
ns:SetSpec("HUNTER_SV")
ns:ResetSelection()
ok(ns.sel.specKey == "HUNTER_SV" and ns.sel.level == 30, "Mein Charakter setzt alles zurück")

-- Regler und Knöpfe bedienen
ns.UI:SelectTab(1)
ns.UI.slider:SetValue(44)
ok(ns.sel.level == 44, "Level-Regler setzt das Level")
ns.UI.plus:Click()
ok(ns.sel.level == 45, "Plus-Knopf")
ns.UI.minus:Click()
ns.UI.minus:Click()
ok(ns.sel.level == 43, "Minus-Knopf")
ns.UI.presets[6]:Click()
ok(ns.sel.level == 60, "Schnellwahl 60")
ns.UI.slider:SetValue(99)
ok(ns.sel.level == 60, "Regler bleibt bei 60")
ns.UI.myChar:Click()
ok(ns.sel.level == 30, "Mein-Charakter-Knopf")
ns.UI.classDD:Click()
ok(VerzauberBeraterMenu and VerzauberBeraterMenu:IsShown(), "Klassen-Auswahl öffnet")
VerzauberBeraterMenu.buttons[1]:Click()
ok(ns.sel.classFile == "WARRIOR" and not VerzauberBeraterMenu:IsShown(), "Klasse per Menü gewählt")
ns.UI.specDD:Click()
VerzauberBeraterMenu.buttons[3]:Click()
ok(ns.sel.specKey == "WARRIOR_PROT", "Spec per Menü gewählt")
ns.UI.setupDD:Click()
VerzauberBeraterMenu.buttons[2]:Click()
ok(ns.sel.setup == "2H", "Waffen-Setup per Menü gewählt")
ns:ResetSelection()

-- Über alle sichtbaren Zeilen fahren (Tooltips bauen)
local function hoverRows(list)
	local n = 0
	for _, row in ipairs(list.rows) do
		if row:IsShown() then
			Mock.Fire(row, "OnEnter")
			Mock.Fire(row, "OnLeave")
			for _, cell in ipairs(row.cells or {}) do
				Mock.Fire(cell, "OnEnter")
				Mock.Fire(cell, "OnLeave")
			end
			n = n + 1
		end
	end
	return n
end
for tab = 1, 6 do
	ns.UI:SelectTab(tab)
	local page = ns.UI.pages[tab]
	for _, key in ipairs({ "list", "enchants", "mats" }) do
		if page[key] then ok(hoverRows(page[key]) >= 1, "Zeilen in Register " .. tab .. " (" .. key .. ")") end
	end
end
ok(#GameTooltip.__lines > 0, "Tooltip-Inhalt gebaut")

----------------------------------------------------------------------
-- Ausrüstungs-Scan
----------------------------------------------------------------------
local scan = ns:ScanGear()
local status = {}
for _, entry in ipairs(scan.rows) do status[entry.row.key] = entry end
ok(scan.setup == "DW", "Setup aus Ausrüstung: zwei Einhandwaffen")
ok(status.MAINHAND.status == "MISSING", "Waffenhand ohne Verzauberung erkannt")
ok(status.OFFHAND.status == "BETTER" and status.OFFHAND.match and status.OFFHAND.match.en == "Weapon - Lesser Striking",
	"Schildhand: Geringer Schlag erkannt, Schlag wäre besser")
ok(status.WRIST.match and status.WRIST.match.en == "Bracer - Lesser Stamina" and status.WRIST.status == "BETTER",
	"Armschienen: Geringe Ausdauer erkannt, Beweglichkeit wäre besser")
ok(status.CHEST.match and status.CHEST.match.en == "Chest - Lesser Stats" and status.CHEST.status == "GOOD", "Brust: Geringe Werte passt")
ok(status.FEET.status == "MISSING", "Stiefel fehlen")
ok(status.BACK.status == "UNKNOWN", "unbekannte Umhang-Verzauberung")
ok(status.HANDS.status == "NOTHING", "Handschuhe: auf 30 noch nichts")
ok(status.RANGED and status.RANGED.status == "MISSING", "Bogen ohne Zielfernrohr")
ok(status.FINGER1 and status.FINGER1.status == "MISSING", "Ring für Verzauberer")
ok(scan.missing == 4 and scan.better == 2, ("Zusammenfassung: %d fehlen, %d besser"):format(scan.missing, scan.better))

-- Zauberstab im Distanz-Slot: kein Zielfernrohr
Mock.inventory[18] = { link = link(1010, nil, "Zauberstab"), name = "Zauberstab", icon = 10 }
local scanWand = ns:ScanGear()
local hasRanged = false
for _, entry in ipairs(scanWand.rows) do if entry.row.key == "RANGED" then hasRanged = true end end
ok(not hasRanged, "Zauberstab bekommt kein Zielfernrohr")
Mock.inventory[18] = { link = link(1003, nil, "Bogen"), name = "Bogen", icon = 3 }

ns.UI:SelectTab(3)
ok(hoverRows(ns.UI.pages[3].list) >= 10, "Ausrüstungs-Zeilen mit Tooltip")
Mock.FireEvent("PLAYER_EQUIPMENT_CHANGED", 16, false)
ns.UI.pages[3].rescan:Click()

----------------------------------------------------------------------
-- Einkaufsliste und Chat-Anfrage
----------------------------------------------------------------------
ns.UI:SelectTab(4)
local shopPage = ns.UI.pages[4]
ok(#shopPage.shopping.needed == 6, "Einkaufsliste: 6 Slots brauchen etwas (" .. #shopPage.shopping.needed .. ")")
ok(#Mock.opened == 0, "noch keine Chat-Anfrage")
shopPage.chat:Click()
ok(#Mock.opened == 1 and #Mock.opened[1] <= 255, "Chat-Anfrage vorbereitet: " .. tostring(Mock.opened[1]))
ok(not Mock.opened[1]:find("Zielfernrohr") and not Mock.opened[1]:find("Scope"), "nur echte Verzauberungen in der Anfrage")
shopPage.onlyMissing:Click()
ok(not shopPage.onlyMissing:GetChecked() and #shopPage.shopping.needed == 9, "Einkaufsliste für die ganze Auswahl (" .. #shopPage.shopping.needed .. ")")
shopPage.onlyMissing:Click()
ok(ns.db.shopOnlyMissing == true and #shopPage.shopping.needed == 6, "zurück auf 'nur was fehlt'")

----------------------------------------------------------------------
-- Materialien aus dem Spiel
----------------------------------------------------------------------
Mock.schematics[13693] = { recipeType = 3, reagentSlotSchematics = {
	{ reagentType = 1, required = true, quantityRequired = 2, reagents = { { itemID = 11134 } } },
	{ reagentType = 1, required = true, quantityRequired = 1, reagents = { { itemID = 11139 } } },
	{ reagentType = 0, required = false, quantityRequired = 1, reagents = { { itemID = 99999 } } },
} }
Mock.schematics[13637] = { reagentSlotSchematics = {
	{ reagentType = 1, required = true, quantityRequired = 1, reagents = { { itemID = 11083 } } },
} }
Mock.itemNames[11134] = isDE and "Geringe mystische Essenz" or "Lesser Mystic Essence"
Mock.itemNames[11083] = isDE and "Seelenstaub" or "Soul Dust"
ns:InvalidateCache()
local mats, live = ns:MatsFor(byEn["Weapon - Striking"])
ok(live and #mats == 2 and mats[1][1] == 11134 and mats[1][2] == 2 and mats[2][1] == 11139,
	"Materialien aus dem Spiel, optionale Reagenzien bleiben draußen")
local staticMats, staticLive = ns:MatsFor(byEn["2H Weapon - Impact"])
ok(not staticLive and staticMats[1][1] == 11137, "ohne Client-Daten gelten die Materialien aus der Datenbank")

Mock.bags = { [11139] = 5, [11134] = 1 }
local shopping = ns:BuildShopping()
local matByKey = {}
for _, mat in ipairs(shopping.mats) do matByKey[mat.key] = mat end
ok(matByKey[11134] and matByKey[11134].count == 4 and matByKey[11134].missing == 3, "Mystische Essenz: 4 gebraucht, 1 da, 3 fehlen")
ok(matByKey[11139] and matByKey[11139].missing == 0 and matByKey[11139].have == 5, "Splitter liegen schon in der Tasche")
ok(matByKey[11083] and matByKey[11083].missing == 1, "Seelenstaub fehlt")
ok(matByKey[11137] and matByKey[11137].missing == 1, "Visionenstaub für Armschiene - Beweglichkeit (aus der Datenbank)")
ok(shopping.unknown == 0 and shopping.missingMats == 3, ("unbekannt %d, fehlend %d"):format(shopping.unknown, shopping.missingMats))
local offhandItem
for _, item in ipairs(shopping.needed) do if item.label == ns.L.SLOT_OH_WEAPON then offhandItem = item end end
ns:ToggleShopItem(offhandItem.key)
local reduced = ns:BuildShopping()
for _, mat in ipairs(reduced.mats) do if mat.key == 11134 then ok(mat.count == 2 and mat.missing == 1, "abgewählte Verzauberung zählt nicht mit") end end
ns:ToggleShopItem(offhandItem.key)
ok(#ns:BuildShopping().mats == 4, "wieder angewählt")

----------------------------------------------------------------------
-- Auktionshaus ohne Auctionator
----------------------------------------------------------------------
Mock.CreateAuctionHouse()
SlashCmdList.VERZAUBERBERATER("ah")
ns.AH:SearchAll()
ok(find(Mock.chat, "Auktionshaus") or find(Mock.chat, "auction house"), "Hinweis, wenn das AH zu ist")
AuctionHouseFrame:Show()
Mock.FireEvent("AUCTION_HOUSE_SHOW")
Mock.RunTimers()
local panel = VerzauberBeraterAHPanel
ok(panel and panel:IsShown(), "Panel erscheint am Auktionshaus")
local p1, anchor, p2, px, py = panel:GetPoint()
ok(anchor == AuctionHouseFrame and p1 == "TOPLEFT" and p2 == "TOPRIGHT" and px == 8 and py == -200, "Panel hängt rechts am AH")
ok(panel.main.label:GetText():find("3"), "Knopf zeigt 3 fehlende Materialien: " .. tostring(panel.main.label:GetText()))
local shownRows = 0
for _, row in ipairs(panel.rows) do
	if row:IsShown() then
		shownRows = shownRows + 1
		Mock.Fire(row, "OnEnter")
		Mock.Fire(row, "OnLeave")
	end
end
ok(shownRows == 4, "4 Material-Zeilen im Panel")
panel.main:Click("LeftButton")
ok(#Mock.ahSearches == 1 and AuctionHouseFrame.__mode == AuctionHouseFrameDisplayMode.Buy, "erste Suche im Blizzard-AH (Kaufen-Ansicht)")
panel.main:Click("LeftButton")
ok(#Mock.ahSearches == 2 and Mock.ahSearches[1] ~= Mock.ahSearches[2], "zweiter Klick sucht das nächste Material")
panel.main:Click("LeftButton")
ok(Mock.ahSearches[3] ~= Mock.ahSearches[1] and Mock.ahSearches[3] ~= Mock.ahSearches[2], "dritter Klick: drittes Material")
panel.main:Click("LeftButton")
ok(Mock.ahSearches[4] == Mock.ahSearches[1], "danach geht es wieder von vorn los")
local missingRow
for _, row in ipairs(panel.rows) do
	if row:IsShown() and row.mat.missing > 0 and Mock.itemNames[row.mat.key] then missingRow = row end
end
missingRow:Click()
ok(#Mock.ahSearches == 5, "Klick auf eine Zeile sucht genau dieses Material")
ok(Mock.ahSearches[5] == missingRow.mat.name and Mock.itemNames[missingRow.mat.key] == Mock.ahSearches[5],
	"Suchbegriff ist der Item-Name in Client-Sprache: " .. Mock.ahSearches[5])
panel.main:Click("RightButton")
ok(ns.db.ah.expanded == false and panel:GetHeight() == 38, "Rechtsklick klappt das Panel zu")
panel.toggle:Click()
ok(ns.db.ah.expanded == true and panel:GetHeight() > 100, "wieder aufgeklappt")
Mock.Fire(panel.toggle, "OnDragStart")
Mock.Fire(panel.toggle, "OnDragStop")
ok(ns.db.ah.x == 390 and ns.db.ah.y == -200, ("Position gespeichert: %s / %s"):format(tostring(ns.db.ah.x), tostring(ns.db.ah.y)))
SlashCmdList.VERZAUBERBERATER("ah")
ok(ns.db.ah.x == 8 and ns.db.ah.y == -200, "/vb ah setzt die Position zurück")
Mock.bags[11134] = 4
Mock.FireEvent("BAG_UPDATE_DELAYED")
ok(panel.main.label:GetText():find("2"), "nach dem Kauf zählt der Knopf runter")
ns.UI:Open(4)
local shopAH = ns.UI.pages[4]
ok(shopAH.ah:IsShown() and shopAH.ah:GetAlpha() == 1 and not shopAH.listButton:IsShown(), "Fenster: AH-Knopf aktiv, ohne Auctionator keine Liste")
ok(hoverRows(shopAH.enchants) >= 6 and hoverRows(shopAH.mats) == 4, "Einkaufslisten-Zeilen mit Tooltips")
shopAH.mats.rows[1]:Click()
ok(#Mock.ahSearches == 6, "Material-Zeile im Fenster sucht im AH")
shopAH.enchants.rows[1]:Click()
ok(not shopAH.shopping.needed[1].included, "Klick wählt eine Verzauberung ab")
shopAH.enchants.rows[1]:Click()
ok(shopAH.shopping.needed[1].included, "und wieder an")

----------------------------------------------------------------------
-- Auktionshaus mit Auctionator
----------------------------------------------------------------------
Mock.InstallAuctionator()
Mock.auctionator.prices[11083] = 2500
Mock.bags[11134] = 1
Mock.FireEvent("BAG_UPDATE_DELAYED")
ok(panel.price:IsShown() and panel.list:IsShown(), "Preis-Schätzung und Auctionator-Knopf sichtbar")
panel.main:Click("LeftButton")
local terms = Mock.auctionator.searches[1]
ok(terms and #terms == 3, "alle fehlenden Mats auf einmal in Auctionator gesucht")
panel.list:Click()
local list = Mock.auctionator.lists[ns.L.AH_LIST_NAME]
local withAmount = false
for _, entry in ipairs(list or {}) do if entry:find(";3$") then withAmount = true end end
ok(list and #list == 3 and withAmount, "Auctionator-Liste mit Mengen angelegt")
panel.rows[2]:Click()
ok(#Mock.auctionator.searches == 2 and #Mock.auctionator.searches[2] == 1, "Einzelsuche über Auctionator")
ns.UI:Open(4)
ok(shopAH.listButton:IsShown(), "Fenster: Auctionator-Knopf sichtbar")
shopAH.ah:Click()
ok(#Mock.auctionator.searches == 3, "Fenster-Knopf sucht über Auctionator")
Auctionator = nil

-- Auktionshaus schließen und Option abschalten
ns.UI:Open(4)
AuctionHouseFrame:Hide()
ok(not panel:IsShown(), "Panel verschwindet mit dem AH")
ok(shopAH.ah:GetAlpha() < 1, "Fenster-Knopf wird ausgegraut, wenn das AH zugeht")
AuctionHouseFrame:Show()
Mock.FireEvent("AUCTION_HOUSE_SHOW")
Mock.RunTimers()
ok(panel:IsShown(), "Panel kommt beim nächsten Besuch wieder")
Mock.FireEvent("AUCTION_HOUSE_CLOSED")
ok(not panel:IsShown(), "AUCTION_HOUSE_CLOSED blendet aus")
ns.AH:SetEnabled(false)
AuctionHouseFrame:Show()
Mock.FireEvent("AUCTION_HOUSE_SHOW")
Mock.RunTimers()
ok(not panel:IsShown(), "abgeschaltet: kein Panel")
ns.AH:SetEnabled(true)
ok(panel:IsShown(), "wieder eingeschaltet")
AuctionHouseFrame:Hide()
Mock.FireEvent("AUCTION_HOUSE_CLOSED")
Mock.bags = {}

-- Alle Verzauberungen: Filter und Häkchen
ns.UI:SelectTab(5)
local allPage = ns.UI.pages[5]
local fullCount = #allPage.list.data
allPage.useful:Click()
ok(#allPage.list.data > fullCount, "ohne Filter mehr Einträge")
allPage.dropdown:Click()
for i, button in ipairs(VerzauberBeraterMenu.buttons) do
	if button:IsShown() and i > 1 then
		button:Click()
		ok(#allPage.list.data >= 1, "Filter " .. allPage.filter .. " hat Einträge")
		allPage.dropdown:Click()
	end
end
ns.W.CloseMenu()
allPage.useful:Click()

-- Info: Optionen umschalten
ns.UI:SelectTab(6)
for _, box in ipairs(ns.UI.pages[6].boxes) do
	box:Click()
	box:Click()
end
ok(ns.db.tooltip == true and ns.db.levelUp == true and ns.db.showUtility == true, "Optionen umschaltbar")

----------------------------------------------------------------------
-- Tooltip-Hook
----------------------------------------------------------------------
ok(#Mock.postCalls == 1, "Tooltip-Hook registriert")
GameTooltip:SetOwner(UIParent, "ANCHOR_NONE")
GameTooltip.__itemLink = link(1006, nil, "Stiefel")
Mock.postCalls[1](GameTooltip, {})
ok(find(GameTooltip.__lines, "Verzauber") or find(GameTooltip.__lines, "Enchant Advisor"), "Tipp im Tooltip der Stiefel")
GameTooltip:SetOwner(UIParent, "ANCHOR_NONE")
GameTooltip.__itemLink = link(1004, 13501, "Armschienen")
Mock.postCalls[1](GameTooltip, {})
ok(not find(GameTooltip.__lines, "Verzauber%-Berater:") and not find(GameTooltip.__lines, "Enchant Advisor:"), "kein Tipp bei verzauberten Teilen")
ns.db.tooltip = false
GameTooltip:SetOwner(UIParent, "ANCHOR_NONE")
GameTooltip.__itemLink = link(1006, nil, "Stiefel")
Mock.postCalls[1](GameTooltip, {})
ok(#GameTooltip.__lines == 0, "Tooltip-Tipps abschaltbar")
ns.db.tooltip = true

----------------------------------------------------------------------
-- Level-Up
----------------------------------------------------------------------
Mock.chat = {}
Mock.player.level = 35
Mock.FireEvent("PLAYER_LEVEL_UP", 35)
ok(#Mock.chat == 0 or find(Mock.chat, "35"), "Level-Up ohne Fehler")
Mock.chat = {}
Mock.player.level = 36
Mock.FireEvent("PLAYER_LEVEL_UP", 36)
ok(find(Mock.chat, "36"), "Level 36: neue Verzauberungen angesagt")
Mock.player.level = 30

----------------------------------------------------------------------
-- Slash-Befehle und Minimap
----------------------------------------------------------------------
SlashCmdList.VERZAUBERBERATER("scan")
ok(ns.UI.activeTab == 3 and frame:IsShown(), "/vb scan öffnet die Ausrüstung")
SlashCmdList.VERZAUBERBERATER("plan")
ok(ns.UI.activeTab == 2, "/vb plan öffnet den Fahrplan")
SlashCmdList.VERZAUBERBERATER("reset")
SlashCmdList.VERZAUBERBERATER("hilfe")
SlashCmdList.VERZAUBERBERATER("minimap")
ok(ns.db.minimap.hide == true, "Minimap-Button aus")
SlashCmdList.VERZAUBERBERATER("minimap")
ok(ns.db.minimap.hide == false and VerzauberBeraterMinimapButton:IsShown(), "Minimap-Button an")
local mm = VerzauberBeraterMinimapButton
Mock.Fire(mm, "OnEnter")
Mock.Fire(mm, "OnDragStart")
Mock.Fire(mm, "OnUpdate", 0.1)
Mock.Fire(mm, "OnDragStop")
mm:Click("LeftButton")
ok(not frame:IsShown(), "Minimap-Klick schließt das Fenster")
mm:Click("RightButton")
ok(frame:IsShown() and ns.UI.activeTab == 6, "Rechtsklick öffnet Info")
VerzauberBerater_OnCompartmentClick("VerzauberBerater", "LeftButton")
ok(not frame:IsShown(), "Add-on-Menü schaltet das Fenster um")
VerzauberBerater_OnCompartmentEnter("VerzauberBerater", mm)
VerzauberBerater_OnCompartmentLeave("VerzauberBerater", mm)
SlashCmdList.VERZAUBERBERATER("")
ok(frame:IsShown(), "/vb öffnet wieder")
SlashCmdList.VERZAUBERBERATER("")
ok(not frame:IsShown(), "/vb schließt wieder")

TEST_RESULT = { passed = passed }
TEST_NS = ns
