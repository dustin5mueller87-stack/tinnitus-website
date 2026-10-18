-- Verzauber-Berater: Logik (Bewertung, Empfehlungen, Ausrüstungs-Scan, Live-Daten)
local ADDON, ns = ...
local L, T = ns.L, ns.T

local EMPTY = {}
local floor, format = math.floor, string.format
local tinsert, tsort, tconcat = table.insert, table.sort, table.concat

ns.MIN_SCORE = 0.5          -- darunter lohnt sich eine Verzauberung nicht
ns.LEVEL_MIN, ns.LEVEL_MAX = 10, 60
ns.PLAN_LEVELS = { 10, 20, 30, 40, 50, 60 }

----------------------------------------------------------------------
-- Hilfsfunktionen
----------------------------------------------------------------------
local function Pack(ok, ...)
	if ok then return ... end
end

-- Ruft eine Client-Funktion geschützt auf (fehlt sie oder wirft sie, kommt nil zurück).
local function SafeCall(fn, ...)
	if type(fn) ~= "function" then return nil end
	return Pack(pcall(fn, ...))
end
ns.SafeCall = SafeCall

-- WoW Forever läuft auf dem Mainline-Client: manche Werte können "geheim" sein.
local function IsSecret(value)
	return issecretvalue ~= nil and issecretvalue(value) and true or false
end
ns.IsSecret = IsSecret

local function Clamp(value, lo, hi)
	if value < lo then return lo end
	if value > hi then return hi end
	return value
end
ns.Clamp = Clamp

function ns:ClampLevel(level)
	return Clamp(floor((tonumber(level) or self.LEVEL_MIN) + 0.5), self.LEVEL_MIN, self.LEVEL_MAX)
end

local function GetItemInfoInstantCompat(item)
	if C_Item and C_Item.GetItemInfoInstant then return C_Item.GetItemInfoInstant(item) end
	if GetItemInfoInstant then return GetItemInfoInstant(item) end
end
ns.GetItemInfoInstant = GetItemInfoInstantCompat

function ns:Print(msg)
	local frame = DEFAULT_CHAT_FRAME or ChatFrame1
	if frame then
		frame:AddMessage(L.CHAT_PREFIX .. msg)
	else
		print(L.CHAT_PREFIX .. msg)
	end
end

----------------------------------------------------------------------
-- Ereignisse innerhalb des Add-ons (UI hört darauf)
----------------------------------------------------------------------
ns.callbacks = {}

function ns:On(event, fn)
	self.callbacks[event] = self.callbacks[event] or {}
	tinsert(self.callbacks[event], fn)
end

function ns:Fire(event, ...)
	for _, fn in ipairs(self.callbacks[event] or EMPTY) do
		local ok, err = pcall(fn, ...)
		if not ok then geterrorhandler()(err) end
	end
end

----------------------------------------------------------------------
-- Gespeicherte Einstellungen
----------------------------------------------------------------------
local DB_DEFAULTS = {
	minimap = { angle = 215, hide = false },
	tooltip = true,
	showUtility = true,
	levelUp = true,
	window = {},
	shopOnlyMissing = true,
	ah = { show = true, expanded = true, x = 8, y = -200 },
}
local CHAR_DEFAULTS = {
	specKey = nil,      -- vom Spieler gewählter Spec
	lastDetected = nil, -- zuletzt automatisch erkannter Spec (um Umskillen zu bemerken)
	enchanter = nil,    -- nil = automatisch erkennen
	tab = 1,
}

local function ApplyDefaults(target, defaults)
	for key, value in pairs(defaults) do
		if type(value) == "table" then
			if type(target[key]) ~= "table" then target[key] = {} end
			ApplyDefaults(target[key], value)
		elseif target[key] == nil then
			target[key] = value
		end
	end
end

function ns:InitDB()
	self.version = SafeCall(C_AddOns and C_AddOns.GetAddOnMetadata, ADDON, "Version") or "?"
	if type(VerzauberBeraterDB) ~= "table" then VerzauberBeraterDB = {} end
	if type(VerzauberBeraterCharDB) ~= "table" then VerzauberBeraterCharDB = {} end
	ApplyDefaults(VerzauberBeraterDB, DB_DEFAULTS)
	ApplyDefaults(VerzauberBeraterCharDB, CHAR_DEFAULTS)
	self.db, self.cdb = VerzauberBeraterDB, VerzauberBeraterCharDB
end

----------------------------------------------------------------------
-- Daten aufbereiten
----------------------------------------------------------------------
function ns:IndexData()
	self.classByFile, self.specByKey = {}, {}
	for _, class in ipairs(self.CLASSES) do
		self.classByFile[class.file] = class
		for _, spec in ipairs(class.specs) do
			spec.class = class
			local weights = {}
			for stat, value in pairs(self.PROFILES[spec.profile]) do weights[stat] = value end
			for stat, value in pairs(spec.mod or EMPTY) do weights[stat] = value end
			spec.weights = weights
			self.specByKey[spec.key] = spec
		end
	end

	self.byGroup = {}
	for index, e in ipairs(self.ENCHANTS) do
		e.index = index
		e.name = self.isDE and e.de or e.en
		if e.fde then e.fx = self.isDE and e.fde or e.fen end
		e.groups = type(e.g) == "table" and e.g or { e.g }
		for _, group in ipairs(e.groups) do
			self.byGroup[group] = self.byGroup[group] or {}
			tinsert(self.byGroup[group], e)
		end
	end
end

----------------------------------------------------------------------
-- Anzeige-Helfer
----------------------------------------------------------------------
function ns:ColorText(text, r, g, b)
	return format("|cff%02x%02x%02x%s|r", floor(r * 255 + 0.5), floor(g * 255 + 0.5), floor(b * 255 + 0.5), text)
end

function ns:ClassColor(file)
	if C_ClassColor and C_ClassColor.GetClassColor then
		local color = SafeCall(C_ClassColor.GetClassColor, file)
		if color and color.GetRGB then return color:GetRGB() end
	end
	local color = RAID_CLASS_COLORS and RAID_CLASS_COLORS[file]
	if color then return color.r, color.g, color.b end
	return 1, 1, 1
end

function ns:ClassName(class)
	local name = SafeCall(GetClassInfo, class.id)
	if type(name) == "string" and name ~= "" and not IsSecret(name) then return name end
	return self.isDE and class.de or class.en
end

function ns:ClassLabel(class)
	return self:ColorText(self:ClassName(class), self:ClassColor(class.file))
end

function ns:SpecName(spec)
	return self.isDE and spec.de or spec.en
end

function ns:SpecLabel(spec)
	return self:ClassLabel(spec.class) .. " - " .. self:SpecName(spec)
end

function ns:RoleText(spec)
	return L["ROLE_" .. spec.role]
end

local PERCENT = { DODGE = true, PARRY = true, BLOCK = true, HIT = true, RHIT = true, CRIT = true, HASTE = true, THREAT = true, THREATRED = true }
local STAT_ORDER = {
	"STR", "AGI", "STA", "INT", "SPI", "AP", "RAP", "WDMG", "RDMG", "SP", "HEAL", "SPD",
	"FIRESP", "FROSTSP", "SHADOWSP", "NATURESP", "ARCANESP", "HOLYSP",
	"HP", "MANA", "MP5", "HP5", "ARMOR", "DEF", "DODGE", "PARRY", "BLOCK", "HIT", "RHIT", "CRIT", "HASTE",
	"RES", "FIRERES", "FROSTRES", "NATURERES", "SHADOWRES", "ARCANERES",
	"THREAT", "THREATRED", "BEAST", "ELEM", "DEMON", "ABSORB",
}

local function Num(value)
	if value == floor(value) then return tostring(value) end
	return format("%.1f", value)
end

local function IsAllStats(s)
	return s.STR and s.STR == s.AGI and s.STR == s.STA and s.STR == s.INT and s.STR == s.SPI
end

-- Effekt-Text einer Verzauberung, z. B. "+6 Waffenschaden" oder "+4 alle Werte".
function ns:EffectText(e)
	if e.fx then return e.fx end
	local s = e.s
	if not s then return "" end
	if IsAllStats(s) then return format(L.FX_ALLSTATS, Num(s.STR)) end
	local parts = {}
	for _, key in ipairs(STAT_ORDER) do
		local value = s[key]
		if value and value ~= 0 then
			local name = self.STAT_NAMES[key] or key
			if key == "THREATRED" then
				parts[#parts + 1] = "-" .. Num(value) .. "% " .. name
			elseif PERCENT[key] then
				parts[#parts + 1] = "+" .. Num(value) .. "% " .. name
			else
				parts[#parts + 1] = "+" .. Num(value) .. " " .. name
			end
		end
	end
	return tconcat(parts, ", ")
end

-- Kurzer Name: der Teil hinter " - " (für Procs im Fahrplan)
function ns:ShortName(e)
	return e.name:match(" %- (.+)$") or e.name
end

-- Kurztext für enge Stellen (Fahrplan): Procs mit Namen, sonst der Effekt
function ns:ShortText(e)
	if e.fx then return self:ShortName(e) end
	return self:EffectText(e)
end

-- "Name (Effekt)" für Chat und Listen
function ns:EnchantLabel(e)
	if e.fx then return e.name end
	return e.name .. " (" .. self:EffectText(e) .. ")"
end

function ns:SourceText(e)
	local text = L["SRC_" .. (e.src or "U")]
	if e.where then text = text .. ": " .. e.where end
	return text
end

-- Unsicher? (Classic-Wert oder unsichere Forever-Angabe, nicht im Spiel bestätigt)
function ns:IsUnverified(e)
	if e.liveOK then return false end
	return e.c == "C" or e.c == "X"
end

function ns:MatName(key)
	local mat = self.MATS[key]
	if type(key) == "number" and C_Item and C_Item.GetItemNameByID then
		local name = SafeCall(C_Item.GetItemNameByID, key)
		if type(name) == "string" and name ~= "" and not IsSecret(name) then return name end
	end
	if mat then return self.isDE and mat[1] or mat[2] end
	return tostring(key)
end

function ns:MatIcon(key)
	if type(key) == "number" and C_Item and C_Item.GetItemIconByID then
		return SafeCall(C_Item.GetItemIconByID, key)
	end
end

----------------------------------------------------------------------
-- Live-Abgleich mit dem Client
-- Namen kommen in Client-Sprache aus den Spell-/Item-Daten. Bei einfachen
-- Verzauberungen (eine Zahl, ein Wert) wird die Zahl aus der Beschreibung
-- übernommen - so bleibt der Berater aktuell, wenn Blizzard in der Beta dreht.
----------------------------------------------------------------------
local GROUP_WORDS = {
	["2H"]  = { "2h", "zweihand", "two-hand", "two hand" },
	WEAPON  = { "weapon", "waffe" },
	WRIST   = { "bracer", "armschiene" },
	CHEST   = { "chest", "brust" },
	BACK    = { "cloak", "umhang" },
	HANDS   = { "glove", "handschuh" },
	FEET    = { "boot", "stiefel" },
	SHIELD  = { "shield", "schild" },
	NECK    = { "neck", "hals" },
	OFFHAND = { "off-hand", "offhand", "nebenhand", "schildhand" },
	SCOPE   = { "scope", "fernrohr" },
	KIT     = { "kit", "set" },
}

local STAT_WORDS = {
	STR = { "stärke", "strength" }, AGI = { "beweglichkeit", "agility" }, STA = { "ausdauer", "stamina" },
	INT = { "intelligenz", "intellect" }, SPI = { "willenskraft", "spirit" },
	HP = { "gesundheit", "leben", "health" }, MANA = { "mana" },
	ARMOR = { "rüstung", "armor" }, DEF = { "verteidigung", "defense" },
	DODGE = { "ausweich", "dodge" }, PARRY = { "parier", "parry" }, BLOCK = { "block" },
	HIT = { "treff", "hit" }, RHIT = { "treff", "hit" }, CRIT = { "kritisch", "crit" }, HASTE = { "tempo", "geschwindigkeit", "speed", "haste" },
	AP = { "angriffskraft", "attack power" }, RAP = { "angriffskraft", "attack power" },
	WDMG = { "schaden", "damage" }, RDMG = { "schaden", "damage" },
	SP = { "zauber", "spell" }, HEAL = { "heil", "heal" }, SPD = { "zauber", "spell" },
	FIRESP = { "feuer", "fire" }, FROSTSP = { "frost" }, SHADOWSP = { "schatten", "shadow" },
	NATURESP = { "natur", "nature" }, ARCANESP = { "arkan", "arcane" }, HOLYSP = { "heilig", "holy" },
	MP5 = { "mana" }, HP5 = { "gesundheit", "leben", "health" },
	RES = { "widerst", "resist" }, FIRERES = { "feuer", "fire" }, FROSTRES = { "frost" },
	NATURERES = { "natur", "nature" }, SHADOWRES = { "schatten", "shadow" }, ARCANERES = { "arkan", "arcane" },
	THREAT = { "bedrohung", "threat" }, THREATRED = { "bedrohung", "threat" },
	BEAST = { "wildtier", "beast" }, ELEM = { "elementar", "elemental" }, DEMON = { "dämon", "demon" },
	ALL = { "werte", "attribut", "stats", "attributes" },
}

local function Mentions(lowerText, statKey)
	for _, word in ipairs(STAT_WORDS[statKey] or EMPTY) do
		if lowerText:find(word, 1, true) then return true end
	end
	return false
end
ns.Mentions = Mentions

local function GroupKey(e)
	if e.src == "LW" then return "KIT" end
	return type(e.g) == "string" and e.g or nil
end

-- Passt der Client-Name zum Slot? Schützt vor falschen IDs in der Datenbank.
local function NameFits(e, name)
	local locale = GetLocale()
	if locale ~= "deDE" and locale ~= "enUS" and locale ~= "enGB" then return true end
	local words = GROUP_WORDS[GroupKey(e) or ""]
	if not words then return true end
	local lower = name:lower()
	for _, word in ipairs(words) do
		if lower:find(word, 1, true) then return true end
	end
	return false
end

-- Übernimmt die Zahl aus der Beschreibung, wenn sie eindeutig ist.
local function ApplyLiveValue(e, desc)
	if e.noLive or e.fx or not e.s then return end
	local numbers = {}
	for n in desc:gmatch("%d+") do numbers[#numbers + 1] = tonumber(n) end
	if #numbers ~= 1 then return end
	local n = numbers[1]

	local keys, first, uniform = {}, nil, true
	for key, value in pairs(e.s) do
		keys[#keys + 1] = key
		if first == nil then first = value elseif value ~= first then uniform = false end
	end
	if not uniform or n <= 0 then return end

	local lower = desc:lower()
	if #keys == 1 then
		local key = keys[1]
		if not Mentions(lower, key) then
			-- Forever hat einige "Leben"-Verzauberungen in "Ausdauer" umbenannt
			if key == "HP" and Mentions(lower, "STA") then
				e.was = e.was or ("+" .. first .. " " .. ns.STAT_NAMES.HP)
				e.s = { STA = n }
				e.liveOK = true
			end
			return
		end
	elseif #keys == 5 and IsAllStats(e.s) then
		if not Mentions(lower, "ALL") then return end
	else
		return
	end

	if n ~= first then
		e.liveFrom = first
		for _, key in ipairs(keys) do e.s[key] = n end
	end
	e.liveOK = true
end
ns.ApplyLiveValue = ApplyLiveValue

local spellWaiters, itemWaiters = {}, {}

function ns:ApplyLiveSpell(e)
	if not (C_Spell and C_Spell.GetSpellName) then return end
	local name = SafeCall(C_Spell.GetSpellName, e.id)
	if type(name) ~= "string" or name == "" or IsSecret(name) then return end
	if not NameFits(e, name) then
		e.liveMismatch = name
		return
	end
	e.name = name
	local desc = SafeCall(C_Spell.GetSpellDescription, e.id)
	if type(desc) == "string" and desc ~= "" and not IsSecret(desc) then
		e.desc = desc
		ApplyLiveValue(e, desc)
	end
	e.live = true
end

function ns:ApplyLiveItem(e)
	if not (C_Item and C_Item.GetItemNameByID) then return end
	local name = SafeCall(C_Item.GetItemNameByID, e.item)
	if type(name) ~= "string" or name == "" or IsSecret(name) then return end
	if not NameFits(e, name) then
		e.liveMismatch = name
		return
	end
	e.name = name
	e.live = true
end

local function NeedsSpellLoad(spellID)
	if not (C_Spell and C_Spell.IsSpellDataCached and C_Spell.RequestLoadSpellData) then return false end
	return SafeCall(C_Spell.IsSpellDataCached, spellID) == false
end

local function NeedsItemLoad(itemID)
	if not (C_Item and C_Item.IsItemDataCachedByID and C_Item.RequestLoadItemDataByID) then return false end
	return SafeCall(C_Item.IsItemDataCachedByID, itemID) == false
end

function ns:StartLiveCheck()
	for _, e in ipairs(self.ENCHANTS) do
		if e.id then
			if NeedsSpellLoad(e.id) then
				spellWaiters[e.id] = spellWaiters[e.id] or {}
				tinsert(spellWaiters[e.id], e)
				SafeCall(C_Spell.RequestLoadSpellData, e.id)
			else
				self:ApplyLiveSpell(e)
			end
		elseif e.item then
			if NeedsItemLoad(e.item) then
				itemWaiters[e.item] = itemWaiters[e.item] or {}
				tinsert(itemWaiters[e.item], e)
				SafeCall(C_Item.RequestLoadItemDataByID, e.item)
			else
				self:ApplyLiveItem(e)
			end
		end
		for _, mat in ipairs(e.m or EMPTY) do
			if type(mat[1]) == "number" and NeedsItemLoad(mat[1]) then
				itemWaiters[mat[1]] = itemWaiters[mat[1]] or {}
				SafeCall(C_Item.RequestLoadItemDataByID, mat[1])
			end
		end
	end
	self:InvalidateCache()
end

function ns:OnSpellLoaded(spellID)
	local waiting = spellWaiters[spellID]
	if not waiting then return end
	spellWaiters[spellID] = nil
	for _, e in ipairs(waiting) do self:ApplyLiveSpell(e) end
	self:ScheduleRefresh()
end

function ns:OnItemLoaded(itemID)
	local waiting = itemWaiters[itemID]
	if not waiting then return end
	itemWaiters[itemID] = nil
	for _, e in ipairs(waiting) do self:ApplyLiveItem(e) end
	self:ScheduleRefresh()
end

local refreshPending = false
function ns:ScheduleRefresh()
	if refreshPending then return end
	refreshPending = true
	local function run()
		refreshPending = false
		ns:InvalidateCache()
		ns:Fire("DATA_CHANGED")
	end
	if C_Timer and C_Timer.After then C_Timer.After(0.5, run) else run() end
end

----------------------------------------------------------------------
-- Bewertung und Empfehlung
----------------------------------------------------------------------
local WEAPON_SCALED = { WDMG = true, BEAST = true, ELEM = true, DEMON = true }
local UNSURE_FACTOR = 0.9 -- unsichere Forever-Angaben (c = "X") gewinnen nur, wenn sie klar besser sind

function ns:Score(e, spec, ctx)
	if e.util then return 0 end
	if e.roles and not e.roles[spec.role] then return 0 end
	local total = e.fixed
	if not total then
		local weights = spec.weights
		total = 0
		for stat, value in pairs(e.s or EMPTY) do
			local weight = weights[stat] or 0
			if WEAPON_SCALED[stat] and ctx and ctx.wdmg then weight = weight * ctx.wdmg end
			total = total + weight * value
		end
	end
	if e.c == "X" and not e.liveOK then total = total * UNSURE_FACTOR end
	return total
end

local rankCache = {}
function ns:InvalidateCache()
	wipe(rankCache)
	-- Rezepte ohne Client-Materialien beim nächsten Mal erneut abfragen
	for _, e in ipairs(self.ENCHANTS or EMPTY) do
		if e.liveMats == false then e.liveMats = nil end
	end
end

-- Alle sinnvollen Kandidaten für einen Slot, beste zuerst (unabhängig vom Level).
function ns:Rank(spec, row)
	local key = spec.key .. "|" .. row.key .. "|" .. tconcat(row.groups, ",") .. "|" .. tostring(row.ctx.wdmg or 1)
	local list = rankCache[key]
	if list then return list end
	list = {}
	local seen = {}
	for _, group in ipairs(row.groups) do
		for _, e in ipairs(self.byGroup[group] or EMPTY) do
			if not seen[e] then
				seen[e] = true
				local score = self:Score(e, spec, row.ctx)
				if score >= self.MIN_SCORE then tinsert(list, { e = e, score = score }) end
			end
		end
	end
	tsort(list, function(a, b)
		if a.score ~= b.score then return a.score > b.score end
		if a.e.lvl ~= b.e.lvl then return a.e.lvl < b.e.lvl end
		return a.e.index < b.e.index
	end)
	rankCache[key] = list
	return list
end

function ns:HasProfession(skillLine)
	return self.professions ~= nil and self.professions[skillLine] ~= nil
end

-- Komfort-Tipp (Lauftempo, Sammelberufe) für einen Slot
function ns:UtilityFor(row, level)
	if not self.db.showUtility then return nil end
	local best
	for _, group in ipairs(row.groups) do
		for _, e in ipairs(self.byGroup[group] or EMPTY) do
			if e.util and e.lvl <= level and (not e.prof or self:HasProfession(e.prof)) then
				if not best or e.lvl > best.lvl then best = e end
			end
		end
	end
	return best
end

-- Empfehlung für einen Slot auf einem Level:
-- best = beste verfügbare, alt = zweitbeste, nextUp = nächstes echtes Upgrade
function ns:Recommend(spec, row, level)
	local ranked = self:Rank(spec, row)
	local best, alt, nextUp
	for _, c in ipairs(ranked) do
		if c.e.lvl <= level then
			if not best then best = c elseif not alt then alt = c end
		end
	end
	local bar = best and best.score * 1.05 or 0
	for _, c in ipairs(ranked) do
		if c.e.lvl > level and c.score > bar then
			if not nextUp or c.e.lvl < nextUp.e.lvl or (c.e.lvl == nextUp.e.lvl and c.score > nextUp.score) then
				nextUp = c
			end
		end
	end
	return { best = best, alt = alt, nextUp = nextUp, util = self:UtilityFor(row, level), ranked = ranked }
end

----------------------------------------------------------------------
-- Slots
----------------------------------------------------------------------
local INV = { HEAD = 1, NECK = 2, SHOULDER = 3, CHEST = 5, LEGS = 7, FEET = 8, WRIST = 9, HANDS = 10,
	FINGER1 = 11, FINGER2 = 12, BACK = 15, MAINHAND = 16, OFFHAND = 17, RANGED = 18 }
ns.INV = INV

local SLOT_ICON = {
	HEAD = "Interface\\PaperDoll\\UI-PaperDoll-Slot-Head",
	NECK = "Interface\\PaperDoll\\UI-PaperDoll-Slot-Neck",
	SHOULDER = "Interface\\PaperDoll\\UI-PaperDoll-Slot-Shoulder",
	BACK = "Interface\\PaperDoll\\UI-PaperDoll-Slot-Chest",
	CHEST = "Interface\\PaperDoll\\UI-PaperDoll-Slot-Chest",
	WRIST = "Interface\\PaperDoll\\UI-PaperDoll-Slot-Wrists",
	HANDS = "Interface\\PaperDoll\\UI-PaperDoll-Slot-Hands",
	LEGS = "Interface\\PaperDoll\\UI-PaperDoll-Slot-Legs",
	FEET = "Interface\\PaperDoll\\UI-PaperDoll-Slot-Feet",
	FINGER1 = "Interface\\PaperDoll\\UI-PaperDoll-Slot-Finger",
	FINGER2 = "Interface\\PaperDoll\\UI-PaperDoll-Slot-Finger",
	MAINHAND = "Interface\\PaperDoll\\UI-PaperDoll-Slot-MainHand",
	OFFHAND = "Interface\\PaperDoll\\UI-PaperDoll-Slot-SecondaryHand",
	RANGED = "Interface\\PaperDoll\\UI-PaperDoll-Slot-Ranged",
}

-- Welche Slots mit welchen Verzauberungs-Gruppen gelten für Spec + Waffen-Setup?
-- ctx.wdmg gewichtet Waffenschaden: Zweihand 1.0, Waffenhand 1.25, Schildhand 0.6
function ns:GetSlotPlan(spec, setup, enchanter)
	local rows = {}
	local function add(key, groups, label, ctx)
		for _, group in ipairs(groups) do
			if self.byGroup[group] and #self.byGroup[group] > 0 then
				tinsert(rows, { key = key, inv = INV[key], groups = groups, label = label or L["SLOT_" .. key],
					ctx = ctx or EMPTY, icon = SLOT_ICON[key] })
				return
			end
		end
	end
	if setup == "2H" then
		add("MAINHAND", { "WEAPON", "2H" }, L.SLOT_2H, { wdmg = 1.0 })
	else
		add("MAINHAND", { "WEAPON" }, L.SLOT_MH, { wdmg = 1.25 })
		if setup == "DW" then
			add("OFFHAND", { "WEAPON" }, L.SLOT_OH_WEAPON, { wdmg = 0.6, offhand = true })
		elseif setup == "1HS" then
			add("OFFHAND", { "SHIELD" }, L.SLOT_SHIELD)
		elseif setup == "1HOH" then
			add("OFFHAND", { "OFFHAND" }, L.SLOT_OH_HELD)
		end
	end
	if spec.ranged then add("RANGED", { "SCOPE" }, L.SLOT_RANGED) end
	add("HEAD", { "HEAD" })
	add("NECK", { "NECK" })
	add("SHOULDER", { "SHOULDER" })
	add("BACK", { "BACK" })
	add("CHEST", { "CHEST" })
	add("WRIST", { "WRIST" })
	add("HANDS", { "HANDS" })
	add("LEGS", { "LEGS" })
	add("FEET", { "FEET" })
	if enchanter then
		add("FINGER1", { "FINGER" })
		add("FINGER2", { "FINGER" })
	end
	return rows
end

-- Komplette Empfehlung für Spec, Setup und Level inkl. Top-Prioritäten
function ns:BuildRecommendations(spec, setup, level, enchanter)
	local rows = self:GetSlotPlan(spec, setup, enchanter)
	local scored = {}
	for _, row in ipairs(rows) do
		row.reco = self:Recommend(spec, row, level)
		row.top = nil
		if row.reco.best then tinsert(scored, row) end
	end
	tsort(scored, function(a, b) return a.reco.best.score > b.reco.best.score end)
	for i = 1, math.min(3, #scored) do scored[i].top = true end
	return rows
end

----------------------------------------------------------------------
-- Spieler: Klasse, Level, Spec, Berufe, Waffen
----------------------------------------------------------------------
function ns:PlayerClassFile()
	local _, file = UnitClass("player")
	return file
end

function ns:PlayerLevel()
	local level = UnitLevel("player")
	if type(level) ~= "number" or IsSecret(level) then return self.LEVEL_MIN end
	return level
end

-- Name des Talentbaums mit den meisten Punkten (Forever: Talente laufen über C_Traits).
local function DetectTreeName()
	if not (C_ClassTalents and C_ClassTalents.GetActiveConfigID and C_Traits and C_Traits.GetConfigInfo) then return nil end
	local configID = C_ClassTalents.GetActiveConfigID()
	if not configID then return nil end
	local config = C_Traits.GetConfigInfo(configID)
	if not config or not config.treeIDs then return nil end
	local points = {}
	for _, treeID in ipairs(config.treeIDs) do
		for _, nodeID in ipairs(C_Traits.GetTreeNodes(treeID) or EMPTY) do
			local node = C_Traits.GetNodeInfo(configID, nodeID)
			local spent = node and (node.ranksPurchased or node.activeRank or node.currentRank) or 0
			if node and node.subTreeID and spent > 0 then
				points[node.subTreeID] = (points[node.subTreeID] or 0) + spent
			end
		end
	end
	local bestID, bestPoints = nil, 0
	for subTreeID, spent in pairs(points) do
		if spent > bestPoints then bestID, bestPoints = subTreeID, spent end
	end
	if not bestID or not C_Traits.GetSubTreeInfo then return nil end
	local sub = C_Traits.GetSubTreeInfo(configID, bestID)
	return sub and sub.name
end

function ns:DetectSpecKey()
	local class = self.classByFile[self:PlayerClassFile() or ""]
	if not class then return nil end
	local treeName = SafeCall(DetectTreeName)
	if type(treeName) ~= "string" or treeName == "" or IsSecret(treeName) then return nil end
	local lower = treeName:lower()
	for _, spec in ipairs(class.specs) do
		if spec.de:lower() == lower or spec.en:lower() == lower then return spec.key end
		for _, alias in ipairs(spec.alias or EMPTY) do
			if alias:lower() == lower then return spec.key end
		end
	end
	return nil
end

-- Spec des eingeloggten Charakters: gewählter > erkannter > erster Spec der Klasse
function ns:UpdateOwnSpec()
	local class = self.classByFile[self:PlayerClassFile() or ""]
	if not class then self.ownSpec = nil return end
	local detected = self:DetectSpecKey()
	if detected and detected ~= self.cdb.lastDetected then
		-- Talente wurden umverteilt: alte Wahl verwerfen
		if self.cdb.lastDetected then self.cdb.specKey = nil end
		self.cdb.lastDetected = detected
	end
	local spec = self.specByKey[self.cdb.specKey or detected or ""]
	if not spec or spec.class ~= class then spec = class.specs[1] end
	self.ownSpec = spec
end

function ns:OwnSpec()
	if not self.ownSpec then self:UpdateOwnSpec() end
	return self.ownSpec
end

-- Berufe (für Ring-Verzauberungen und Sammel-Komfort-Tipps)
function ns:UpdateProfessions()
	self.professions = {}
	local p1, p2, arch, fishing, cooking = SafeCall(GetProfessions)
	for _, index in ipairs({ p1 or 0, p2 or 0, fishing or 0 }) do
		if index > 0 then
			local _, _, rank, _, _, _, skillLine = SafeCall(GetProfessionInfo, index)
			if skillLine then self.professions[skillLine] = rank or 0 end
		end
	end
end

local SKILL_ENCHANTING = 333
function ns:IsEnchanter()
	if self.cdb.enchanter ~= nil then return self.cdb.enchanter end
	return self:HasProfession(SKILL_ENCHANTING)
end

-- Waffen-Setup aus der angelegten Ausrüstung ablesen
function ns:DetectEquippedSetup()
	local mh = GetInventoryItemLink("player", INV.MAINHAND)
	if not mh or IsSecret(mh) then return nil end
	local mhLoc = select(4, GetItemInfoInstantCompat(mh))
	if mhLoc == "INVTYPE_2HWEAPON" then return "2H" end
	local oh = GetInventoryItemLink("player", INV.OFFHAND)
	if not oh or IsSecret(oh) then return "1HOH" end
	local ohLoc = select(4, GetItemInfoInstantCompat(oh))
	if ohLoc == "INVTYPE_SHIELD" then return "1HS" end
	if ohLoc == "INVTYPE_HOLDABLE" then return "1HOH" end
	return "DW"
end

----------------------------------------------------------------------
-- Auswahl im Fenster (Klasse, Spec, Level, Waffen-Setup)
----------------------------------------------------------------------
ns.sel = { classFile = nil, specKey = nil, level = 30, setup = "AUTO" }

function ns:SelectedSpec()
	return self.specByKey[self.sel.specKey or ""]
end

function ns:IsOwnSelection()
	return self.sel.classFile == self:PlayerClassFile() and self:SelectedSpec() == self:OwnSpec()
end

function ns:SelectedSetup()
	local spec = self:SelectedSpec()
	if self.sel.setup ~= "AUTO" then return self.sel.setup end
	if self:IsOwnSelection() then
		local equipped = self:DetectEquippedSetup()
		if equipped then return equipped end
	end
	return spec and spec.setup or "2H"
end

function ns:ResetSelection()
	local spec = self:OwnSpec()
	local class = self.classByFile[self:PlayerClassFile() or ""] or self.CLASSES[1]
	spec = spec or class.specs[1]
	self.sel.classFile = class.file
	self.sel.specKey = spec.key
	self.sel.level = self:ClampLevel(self:PlayerLevel())
	self.sel.setup = "AUTO"
	self:Fire("SELECTION_CHANGED")
end

function ns:SetClass(file)
	local class = self.classByFile[file]
	if not class then return end
	self.sel.classFile = file
	local own = self:OwnSpec()
	if own and own.class == class then
		self.sel.specKey = own.key
	else
		self.sel.specKey = class.specs[1].key
	end
	self.sel.setup = "AUTO"
	self:Fire("SELECTION_CHANGED")
end

function ns:SetSpec(key)
	local spec = self.specByKey[key]
	if not spec then return end
	self.sel.specKey = key
	self.sel.setup = "AUTO"
	-- Wer für die eigene Klasse einen Spec wählt, meint meistens sich selbst: merken.
	if spec.class.file == self:PlayerClassFile() then
		self.cdb.specKey = key
		self.ownSpec = spec
	end
	self:Fire("SELECTION_CHANGED")
end

function ns:SetLevel(level)
	level = self:ClampLevel(level)
	if level == self.sel.level then return end
	self.sel.level = level
	self:Fire("SELECTION_CHANGED")
end

function ns:SetSetup(setup)
	self.sel.setup = setup
	self:Fire("SELECTION_CHANGED")
end

----------------------------------------------------------------------
-- Ausrüstungs-Scan
----------------------------------------------------------------------
local function ParseItemLink(link)
	local itemID, enchantID = link:match("item:(%-?%d+):(%-?%d*)")
	return tonumber(itemID), tonumber(enchantID) or 0
end
ns.ParseItemLink = ParseItemLink

local enchantPattern
local function EnchantPattern()
	if enchantPattern == nil then
		if type(ENCHANTED_TOOLTIP_LINE) == "string" then
			local pattern = ENCHANTED_TOOLTIP_LINE:gsub("[%%%(%)%.%+%-%*%?%[%]%^%$]", "%%%0")
			pattern = pattern:gsub("%%%%s", "(.+)")
			enchantPattern = "^" .. pattern .. "$"
		else
			enchantPattern = false
		end
	end
	return enchantPattern
end
ns.EnchantPattern = EnchantPattern

local TRIGGER_GLOBALS = { "ITEM_SPELL_TRIGGER_ONEQUIP", "ITEM_SPELL_TRIGGER_ONUSE", "ITEM_SPELL_TRIGGER_ONPROC" }
local function IsTriggerLine(text)
	for _, global in ipairs(TRIGGER_GLOBALS) do
		local prefix = _G[global]
		if type(prefix) == "string" and text:sub(1, #prefix) == prefix then return true end
	end
	return false
end

local scanTip
local function ScanTooltipEnchant(invSlot)
	if not scanTip then
		scanTip = CreateFrame("GameTooltip", "VerzauberBeraterScanTip", nil, "GameTooltipTemplate")
	end
	scanTip:SetOwner(WorldFrame, "ANCHOR_NONE")
	scanTip:ClearLines()
	scanTip:SetInventoryItem("player", invSlot)
	local pattern = EnchantPattern()
	local greenLine
	for i = 2, scanTip:NumLines() do
		local fontString = _G["VerzauberBeraterScanTipTextLeft" .. i]
		local text = fontString and fontString:GetText()
		if type(text) == "string" and not IsSecret(text) then
			local match = pattern and text:match(pattern)
			if match then return match end
			local r, g, b = fontString:GetTextColor()
			if not greenLine and g > 0.9 and r < 0.2 and b < 0.2 and not IsTriggerLine(text) then greenLine = text end
		end
	end
	return greenLine
end

-- Text der dauerhaften Verzauberung auf einem angelegten Gegenstand
function ns:GetEnchantText(invSlot)
	if C_TooltipInfo and C_TooltipInfo.GetInventoryItem then
		local data = SafeCall(C_TooltipInfo.GetInventoryItem, "player", invSlot)
		if data and data.lines then
			local permanent = Enum and Enum.TooltipDataLineType and Enum.TooltipDataLineType.ItemEnchantmentPermanent
			local pattern = EnchantPattern()
			for _, line in ipairs(data.lines) do
				local text = line.leftText
				if type(text) == "string" and not IsSecret(text) then
					local match = pattern and text:match(pattern)
					if match then return match end
					if permanent and line.type == permanent then return text end
				end
			end
			return nil
		end
	end
	return SafeCall(ScanTooltipEnchant, invSlot)
end

-- Erkennt, welche Verzauberung aus der Datenbank zu einem Tooltip-Text passt.
function ns:MatchEnchant(text, groups)
	if type(text) ~= "string" then return nil end
	local lower = text:lower()
	local best, bestHits = nil, 0
	for _, group in ipairs(groups) do
		for _, e in ipairs(self.byGroup[group] or EMPTY) do
			local hits = 0
			local name = e.name and e.name:lower()
			if name and lower:find(name, 1, true) then hits = hits + 10 end
			local short = self:ShortName(e):lower()
			if short ~= name and #short > 3 and lower:find(short, 1, true) then hits = hits + 3 end
			for _, word in ipairs(e.match or EMPTY) do
				if lower:find(word:lower(), 1, true) then hits = hits + 5 end
			end
			if e.s and not e.fx then
				local allFound, numbers = true, 0
				if IsAllStats(e.s) then
					allFound = Mentions(lower, "ALL") and lower:find("%f[%d]" .. e.s.STR .. "%f[%D]") ~= nil
					numbers = 1
				else
					for stat, value in pairs(e.s) do
						if value == floor(value) and lower:find("%f[%d]" .. value .. "%f[%D]") and Mentions(lower, stat) then
							numbers = numbers + 1
						else
							allFound = false
						end
					end
				end
				if allFound and numbers > 0 then hits = hits + 4 end
			end
			if hits > bestHits then best, bestHits = e, hits end
		end
	end
	return best
end

local SCOPE_SUBCLASS = { [2] = true, [3] = true, [18] = true } -- Bögen, Gewehre, Armbrüste

-- Verzauberungs-Gruppen für einen konkreten Gegenstand in einem Slot
function ns:GroupsForItem(link, rowKey)
	local _, _, _, equipLoc, _, classID, subclassID = GetItemInfoInstantCompat(link)
	if not equipLoc then return nil end
	if equipLoc == "INVTYPE_2HWEAPON" then return { "WEAPON", "2H" }, { wdmg = 1.0 } end
	if equipLoc == "INVTYPE_WEAPON" or equipLoc == "INVTYPE_WEAPONMAINHAND" or equipLoc == "INVTYPE_WEAPONOFFHAND" then
		if rowKey == "OFFHAND" then return { "WEAPON" }, { wdmg = 0.6, offhand = true } end
		return { "WEAPON" }, { wdmg = 1.25 }
	end
	if equipLoc == "INVTYPE_SHIELD" then return { "SHIELD" } end
	if equipLoc == "INVTYPE_HOLDABLE" then return { "OFFHAND" } end
	if equipLoc == "INVTYPE_RANGED" or equipLoc == "INVTYPE_RANGEDRIGHT" then
		if classID == 2 and SCOPE_SUBCLASS[subclassID] then return { "SCOPE" } end
		return nil
	end
	local simple = {
		INVTYPE_HEAD = "HEAD", INVTYPE_NECK = "NECK", INVTYPE_SHOULDER = "SHOULDER", INVTYPE_CLOAK = "BACK",
		INVTYPE_CHEST = "CHEST", INVTYPE_ROBE = "CHEST", INVTYPE_WRIST = "WRIST", INVTYPE_HAND = "HANDS",
		INVTYPE_LEGS = "LEGS", INVTYPE_FEET = "FEET", INVTYPE_FINGER = "FINGER",
	}
	local group = simple[equipLoc]
	if group then return { group } end
	return nil
end

-- Scannt die angelegte Ausrüstung und vergleicht sie mit der Empfehlung.
function ns:ScanGear()
	local spec = self:OwnSpec()
	if not spec then return nil end
	local level = self:ClampLevel(self:PlayerLevel())
	local setup = self:DetectEquippedSetup() or spec.setup
	local rows = self:GetSlotPlan(spec, setup, self:IsEnchanter())
	local result = { spec = spec, level = level, setup = setup, rows = {}, enchanted = 0, total = 0, missing = 0, better = 0 }
	for _, row in ipairs(rows) do
		local entry = { row = row }
		local link = GetInventoryItemLink("player", row.inv)
		if link and IsSecret(link) then link = nil end
		local skip = false
		if link then
			local groups, ctx = self:GroupsForItem(link, row.key)
			if groups then
				entry.row = { key = row.key, inv = row.inv, label = row.label, icon = row.icon, groups = groups, ctx = ctx or EMPTY }
			elseif row.key == "RANGED" then
				skip = true -- Zauberstab oder Relikt: kein Zielfernrohr möglich
			end
			entry.link = link
			entry.icon = GetInventoryItemTexture("player", row.inv)
			local _, enchantID = ParseItemLink(link)
			entry.enchantID = enchantID
			if enchantID > 0 then
				entry.enchantText = self:GetEnchantText(row.inv)
				entry.match = self:MatchEnchant(entry.enchantText, entry.row.groups)
			end
		end
		if not skip then
			local reco = self:Recommend(spec, entry.row, level)
			entry.reco = reco
			local best = reco.best
			if not link then
				entry.status = "EMPTY"
			elseif entry.enchantID > 0 then
				result.enchanted = result.enchanted + 1
				result.total = result.total + 1
				if entry.match and best then
					local current = self:Score(entry.match, spec, entry.row.ctx)
					if current >= best.score * 0.95 or entry.match == best.e then
						entry.status = "GOOD"
					else
						entry.status = "BETTER"
						result.better = result.better + 1
					end
				elseif entry.match then
					entry.status = "GOOD"
				else
					entry.status = "UNKNOWN"
				end
			elseif best then
				entry.status = "MISSING"
				result.total = result.total + 1
				result.missing = result.missing + 1
			else
				entry.status = "NOTHING"
			end
			tinsert(result.rows, entry)
		end
	end
	return result
end

----------------------------------------------------------------------
-- Materialien und Einkaufsliste
----------------------------------------------------------------------
local ENCHANTING_SOURCES = { T = true, D = true, V = true, R = true, RAID = true }
ns.ENCHANTING_SOURCES = ENCHANTING_SOURCES

-- Rezept-Materialien direkt aus dem Client. Nur Grund-Materialien zählen,
-- optionale oder verändernde Reagenzien bleiben draußen.
local function LiveMats(e)
	if e.liveMats ~= nil then return e.liveMats or nil end
	e.liveMats = false
	if not (e.id and C_TradeSkillUI and C_TradeSkillUI.GetRecipeSchematic) then return nil end
	local schematic = SafeCall(C_TradeSkillUI.GetRecipeSchematic, e.id, false)
	if type(schematic) ~= "table" or type(schematic.reagentSlotSchematics) ~= "table" then return nil end
	local basic = Enum and Enum.CraftingReagentType and Enum.CraftingReagentType.Basic or 1
	local mats = {}
	for _, slot in ipairs(schematic.reagentSlotSchematics) do
		local reagent = slot.reagents and slot.reagents[1]
		if reagent and reagent.itemID and slot.required ~= false and (slot.reagentType == nil or slot.reagentType == basic) then
			mats[#mats + 1] = { reagent.itemID, slot.quantityRequired or 1 }
			if NeedsItemLoad(reagent.itemID) then
				itemWaiters[reagent.itemID] = itemWaiters[reagent.itemID] or {}
				SafeCall(C_Item.RequestLoadItemDataByID, reagent.itemID)
			end
		end
	end
	if #mats == 0 then return nil end
	e.liveMats = mats
	return mats
end

-- Materialien einer Verzauberung: aus dem Spiel, sonst aus der Datenbank.
-- Zweiter Rückgabewert: true, wenn sie aus dem Spiel stammen.
function ns:MatsFor(e)
	local live = LiveMats(e)
	if live then return live, true end
	return e.m, false
end

function ns:ItemCount(key)
	if type(key) ~= "number" or not (C_Item and C_Item.GetItemCount) then return 0 end
	return SafeCall(C_Item.GetItemCount, key, true) or 0 -- Taschen und Bank
end

-- Vom Spieler abgewählte Einträge der Einkaufsliste (gilt für diese Sitzung)
ns.shopExcluded = {}

-- Einkaufsliste: welche Verzauberungen, wie viel Material, was fehlt noch.
-- Grundlage ist entweder der Ausrüstungs-Scan (nur Fehlendes) oder die Auswahl oben im Fenster.
function ns:BuildShopping()
	local result = { needed = {}, mats = {}, unknown = 0, missingMats = 0, onlyMissing = self.db.shopOnlyMissing }
	if result.onlyMissing then
		local scan = self:ScanGear()
		if scan then
			result.spec, result.level = scan.spec, scan.level
			for _, entry in ipairs(scan.rows) do
				if (entry.status == "MISSING" or entry.status == "BETTER") and entry.reco.best then
					tinsert(result.needed, { label = entry.row.label, e = entry.reco.best.e })
				end
			end
		end
	else
		local spec = self:SelectedSpec()
		if spec then
			result.spec, result.level = spec, self.sel.level
			local own = spec.class.file == self:PlayerClassFile()
			for _, row in ipairs(self:BuildRecommendations(spec, self:SelectedSetup(), self.sel.level, own and self:IsEnchanter())) do
				if row.reco.best then tinsert(result.needed, { label = row.label, e = row.reco.best.e }) end
			end
		end
	end

	local totals = {}
	for _, item in ipairs(result.needed) do
		item.key = item.label .. "|" .. item.e.index
		item.included = not self.shopExcluded[item.key]
		if item.included then
			local mats = self:MatsFor(item.e)
			if mats then
				for _, mat in ipairs(mats) do totals[mat[1]] = (totals[mat[1]] or 0) + mat[2] end
			elseif ENCHANTING_SOURCES[item.e.src] then
				result.unknown = result.unknown + 1
			end
		end
	end
	for key, count in pairs(totals) do
		local have = self:ItemCount(key)
		local mat = { key = key, count = count, have = have, missing = math.max(0, count - have),
			name = self:MatName(key), icon = self:MatIcon(key) }
		if mat.missing > 0 then result.missingMats = result.missingMats + 1 end
		tinsert(result.mats, mat)
	end
	tsort(result.mats, function(a, b) return a.name < b.name end)
	return result
end

function ns:ToggleShopItem(key)
	self.shopExcluded[key] = not self.shopExcluded[key] or nil
	self:Fire("SHOPPING_CHANGED")
end

----------------------------------------------------------------------
-- Level-Up: neue Verzauberungen ansagen
----------------------------------------------------------------------
function ns:OnLevelUp(newLevel)
	local spec = self:OwnSpec()
	if spec and self.db.levelUp and newLevel > self.LEVEL_MIN then
		local setup = self:DetectEquippedSetup() or spec.setup
		local news = {}
		for _, row in ipairs(self:GetSlotPlan(spec, setup, self:IsEnchanter())) do
			local before = self:Recommend(spec, row, newLevel - 1).best
			local after = self:Recommend(spec, row, newLevel).best
			if after and (not before or before.e ~= after.e) then
				tinsert(news, "|cffffd100" .. row.label .. ":|r " .. self:EnchantLabel(after.e))
			end
		end
		if #news > 0 then
			self:Print(format(L.LEVELUP_NEW, newLevel, self:SpecName(spec), ""))
			for _, line in ipairs(news) do self:Print("  " .. line) end
			self:Print(L.LEVELUP_CHECK)
		end
	end
	if self.sel.classFile == self:PlayerClassFile() and self.sel.level == self:ClampLevel(newLevel - 1) then
		self:SetLevel(newLevel)
	end
end

----------------------------------------------------------------------
-- Client-Ereignisse
----------------------------------------------------------------------
local eventFrame = CreateFrame("Frame")
local function Register(event)
	pcall(eventFrame.RegisterEvent, eventFrame, event)
end

Register("ADDON_LOADED")
Register("PLAYER_LOGIN")

eventFrame:SetScript("OnEvent", function(_, event, arg1)
	if event == "ADDON_LOADED" then
		if arg1 == ADDON then
			ns:InitDB()
			ns:IndexData()
		end
	elseif event == "PLAYER_LOGIN" then
		ns:UpdateProfessions()
		ns:UpdateOwnSpec()
		ns:ResetSelection()
		ns:StartLiveCheck()
		for _, e in ipairs({ "PLAYER_LEVEL_UP", "PLAYER_EQUIPMENT_CHANGED", "SPELL_DATA_LOAD_RESULT",
			"ITEM_DATA_LOAD_RESULT", "TRAIT_CONFIG_UPDATED", "PLAYER_TALENT_UPDATE", "CHARACTER_POINTS_CHANGED",
			"SKILL_LINES_CHANGED" }) do
			Register(e)
		end
		ns:Fire("LOGIN")
	elseif event == "PLAYER_LEVEL_UP" then
		ns:OnLevelUp(tonumber(arg1) or ns:PlayerLevel())
	elseif event == "PLAYER_EQUIPMENT_CHANGED" then
		ns:Fire("GEAR_CHANGED")
	elseif event == "SPELL_DATA_LOAD_RESULT" then
		ns:OnSpellLoaded(arg1)
	elseif event == "ITEM_DATA_LOAD_RESULT" then
		ns:OnItemLoaded(arg1)
	elseif event == "SKILL_LINES_CHANGED" then
		ns:UpdateProfessions()
		ns:Fire("GEAR_CHANGED")
	else
		local before = ns.ownSpec
		ns:UpdateOwnSpec()
		if before ~= ns.ownSpec then ns:Fire("SPEC_CHANGED") end
	end
end)

----------------------------------------------------------------------
-- Slash-Befehle
----------------------------------------------------------------------
SLASH_VERZAUBERBERATER1 = "/vb"
SLASH_VERZAUBERBERATER2 = "/verzauber"
SLASH_VERZAUBERBERATER3 = "/vzb"
SlashCmdList.VERZAUBERBERATER = function(msg)
	local cmd = (msg or ""):lower():match("^%s*(.-)%s*$")
	if cmd == "" then
		ns.UI:Toggle()
	elseif cmd == "scan" or cmd == "gear" then
		ns.UI:Open(3)
	elseif cmd == "plan" then
		ns.UI:Open(2)
	elseif cmd == "minimap" then
		ns:ToggleMinimapButton()
	elseif cmd == "reset" then
		ns.UI:ResetPosition()
		ns:Print(L.RESET_DONE)
	elseif cmd == "ah" then
		ns.AH:ResetPosition()
	else
		ns:Print(L.HELP)
	end
end
