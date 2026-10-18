-- Strenge Nachbildung der WoW-Forever-API (Client 1.60.1) zum Testen außerhalb des Spiels.
-- Erlaubt sind nur Widget-Methoden, Script-Handler, Templates, Schriften, Atlanten und Events,
-- die laut API-Dump (Ketho/BlizzardInterfaceResources, Branch "forever") im Client existieren.
--
-- Erwartet vom Test-Treiber: DUMP_WIDGETS, DUMP_TEMPLATES, DUMP_ATLAS (Menge), DUMP_EVENTS (Menge),
-- MOCK_LOCALE ("deDE"/"enUS"). Enum und GlobalStrings wurden schon geladen.

Mock = { log = {}, timers = {}, eventFrames = {}, chat = {}, opened = {}, postCalls = {} }

local function noop() end

----------------------------------------------------------------------
-- Widget-Methoden aus dem Dump (mit Vererbung)
----------------------------------------------------------------------
local methodCache = {}
local function MethodsFor(typeName)
	local cached = methodCache[typeName]
	if cached then return cached end
	local set, seen = {}, {}
	local function collect(t)
		if seen[t] then return end
		seen[t] = true
		local def = DUMP_WIDGETS[t]
		assert(def, "Unbekannter Widget-Typ: " .. tostring(t))
		for _, m in ipairs(def.methods or {}) do set[m] = true end
		for _, h in ipairs(def.handlers or {}) do set["@" .. h] = true end
		for _, parent in ipairs(def.inherits or {}) do
			if parent == t then parent = "ScriptRegion" end -- Dump-Fehler: Region erbt von sich selbst
			collect(parent)
		end
	end
	collect(typeName)
	methodCache[typeName] = set
	return set
end
Mock.MethodsFor = MethodsFor

-- Methoden, die über Lua-Mixins der Templates dazukommen
local MIXINS = {}

MIXINS.BackdropTemplate = {
	SetBackdrop = function(self, backdrop)
		assert(backdrop == nil or type(backdrop) == "table", "SetBackdrop erwartet eine Tabelle")
		self.__backdrop = backdrop
	end,
	SetBackdropColor = function(self, r, g, b, a)
		assert(type(r) == "number" and type(g) == "number" and type(b) == "number", "SetBackdropColor braucht Zahlen")
	end,
	SetBackdropBorderColor = function(self, r, g, b, a)
		assert(type(r) == "number" and type(g) == "number" and type(b) == "number", "SetBackdropBorderColor braucht Zahlen")
	end,
	GetBackdrop = function(self) return self.__backdrop end,
}

MIXINS.GameTooltipTemplate = {
	SetInventoryItem = function(self, unit, slot)
		local item = Mock.inventory[slot]
		self.__lines = {}
		if not item then return false end
		self:AddLine(item.name)
		if item.enchantText then
			local line = string.format(ENCHANTED_TOOLTIP_LINE, item.enchantText)
			self:AddLine(line, 0.12, 1, 0)
		end
		self.__itemLink = item.link
		return true
	end,
	SetHyperlink = function(self, link) self.__itemLink = link end,
	SetItemByID = function(self, itemID)
		assert(type(itemID) == "number", "SetItemByID braucht eine Item-ID")
		self.__lines = { Mock.itemNames[itemID] or ("Item " .. itemID) }
	end,
	GetItem = function(self) return "Item", self.__itemLink, nil end,
}

----------------------------------------------------------------------
-- Verhalten der wichtigsten Methoden
----------------------------------------------------------------------
local impl = {}

local function Fire(obj, handler, ...)
	local script = obj.__scripts[handler]
	if script then return script(obj, ...) end
end
Mock.Fire = Fire

function impl:GetName() return self.__name end
function impl:GetObjectType() return self.__type end
function impl:IsObjectType(t) return self.__type == t end
function impl:GetParent() return self.__parent end
function impl:SetParent(parent) self.__parent = parent end

function impl:SetPoint(point, ...)
	assert(type(point) == "string", "SetPoint: Ankerpunkt fehlt")
	local valid = { TOPLEFT = 1, TOP = 1, TOPRIGHT = 1, LEFT = 1, CENTER = 1, RIGHT = 1, BOTTOMLEFT = 1, BOTTOM = 1, BOTTOMRIGHT = 1 }
	assert(valid[point], "SetPoint: ungültiger Punkt " .. point)
	local a, b, c, d = ...
	local rel, relPoint, x, y
	if type(a) == "number" or a == nil then
		rel, relPoint, x, y = self.__parent, point, a or 0, b or 0
	elseif type(b) == "string" then
		assert(valid[b], "SetPoint: ungültiger relativer Punkt " .. b)
		rel, relPoint, x, y = a, b, c or 0, d or 0
	else
		rel, relPoint, x, y = a, point, b or 0, c or 0
	end
	assert(type(x) == "number" and type(y) == "number", "SetPoint: Offsets müssen Zahlen sein")
	self.__points[point] = { point, rel, relPoint, x, y }
	self.__numPoints = 0
	for _ in pairs(self.__points) do self.__numPoints = self.__numPoints + 1 end
end
function impl:ClearAllPoints() self.__points = {} end
function impl:GetPoint(index)
	for _, p in pairs(self.__points) do return p[1], p[2], p[3], p[4], p[5] end
end
function impl:GetNumPoints() return self.__numPoints or 0 end
function impl:SetAllPoints(rel) self.__points = { ALL = { "TOPLEFT", rel or self.__parent, "TOPLEFT", 0, 0 } } end

local function DefaultSize(self, key)
	local parent = self.__parent
	if parent and parent ~= self then return parent[key](parent) end
	return key == "GetWidth" and 860 or 600
end
function impl:SetSize(w, h)
	assert(type(w) == "number" and type(h) == "number", "SetSize braucht Zahlen")
	self.__w, self.__h = w, h
	Fire(self, "OnSizeChanged", w, h)
end
function impl:SetWidth(w) assert(type(w) == "number", "SetWidth braucht eine Zahl") self.__w = w end
function impl:SetHeight(h) assert(type(h) == "number", "SetHeight braucht eine Zahl") self.__h = h end
function impl:GetWidth() return self.__w or DefaultSize(self, "GetWidth") end
function impl:GetHeight() return self.__h or (DefaultSize(self, "GetHeight") - 60) end
function impl:GetSize() return self:GetWidth(), self:GetHeight() end
function impl:GetCenter() return 400, 300 end
function impl:GetLeft() return self.__left or 300 end
function impl:GetRight() return (self.__left or 300) + self:GetWidth() end
function impl:GetTop() return self.__top or 700 end
function impl:GetBottom() return (self.__top or 700) - self:GetHeight() end
function impl:StartMoving() self.__moving = true end
function impl:StopMovingOrSizing()
	-- Wie im Spiel: nach dem Ziehen hängt der Frame an einer neuen Bildschirmposition
	self.__moving = false
	self.__left, self.__top = 1250, 520
end
function impl:SetAlpha(alpha) assert(type(alpha) == "number", "SetAlpha braucht eine Zahl") self.__alpha = alpha end
function impl:GetAlpha() return self.__alpha or 1 end
function impl:GetEffectiveScale() return 1 end
function impl:GetScale() return 1 end

function impl:Show()
	if not self.__shown then
		self.__shown = true
		Fire(self, "OnShow")
	end
end
function impl:Hide()
	if self.__shown then
		self.__shown = false
		Fire(self, "OnHide")
	end
end
function impl:SetShown(shown) if shown then self:Show() else self:Hide() end end
function impl:IsShown() return self.__shown end
function impl:IsVisible()
	if not self.__shown then return false end
	if self.__parent and self.__parent.IsVisible then return self.__parent:IsVisible() end
	return true
end

local function CheckHandler(self, handler)
	if not MethodsFor(self.__type)["@" .. handler] then
		error(("Script-Handler %s gibt es für %s nicht"):format(tostring(handler), self.__type), 3)
	end
end
function impl:SetScript(handler, fn)
	CheckHandler(self, handler)
	assert(fn == nil or type(fn) == "function", "SetScript braucht eine Funktion")
	self.__scripts[handler] = fn
end
function impl:GetScript(handler) CheckHandler(self, handler) return self.__scripts[handler] end
function impl:HookScript(handler, fn)
	CheckHandler(self, handler)
	local previous = self.__scripts[handler]
	if previous then
		self.__scripts[handler] = function(...) previous(...) fn(...) end
	else
		self.__scripts[handler] = fn
	end
end
function impl:HasScript(handler) return MethodsFor(self.__type)["@" .. handler] or false end

function impl:RegisterEvent(event)
	if not DUMP_EVENTS[event] then error("Event gibt es nicht: " .. tostring(event)) end
	self.__events[event] = true
	Mock.eventFrames[self] = true
end
function impl:UnregisterEvent(event) self.__events[event] = nil end

function impl:CreateTexture(name, layer, template)
	return Mock.NewWidget("Texture", name, self)
end
function impl:CreateFontString(name, layer, inherits)
	if inherits then
		assert(DUMP_TEMPLATES[inherits], "Schriftart gibt es nicht: " .. tostring(inherits))
	end
	return Mock.NewWidget("FontString", name, self)
end

function impl:SetText(text)
	assert(text == nil or type(text) == "string" or type(text) == "number", "SetText braucht Text")
	self.__text = text and tostring(text)
	if self.__type == "GameTooltip" then self.__lines = { self.__text } end
end
function impl:GetText() return self.__text end
function impl:GetStringWidth() return #(self.__text or "") * 6 end
function impl:SetTextColor(r, g, b, a)
	assert(type(r) == "number" and type(g) == "number" and type(b) == "number", "SetTextColor braucht Zahlen")
	self.__color = { r, g, b, a or 1 }
end
function impl:GetTextColor()
	local c = self.__color or { 1, 1, 1, 1 }
	return c[1], c[2], c[3], c[4]
end
function impl:SetFontObject(font) assert(DUMP_TEMPLATES[font] or type(font) == "table", "Schriftart gibt es nicht") end
function impl:SetJustifyH(j) assert(j == "LEFT" or j == "CENTER" or j == "RIGHT", "SetJustifyH: " .. tostring(j)) end
function impl:SetJustifyV(j) assert(j == "TOP" or j == "MIDDLE" or j == "BOTTOM", "SetJustifyV: " .. tostring(j)) end

function impl:SetTexture(texture) self.__texture = texture end
function impl:GetTexture() return self.__texture end
function impl:SetAtlas(atlas)
	if not DUMP_ATLAS[atlas] then error("Atlas gibt es nicht: " .. tostring(atlas)) end
	self.__atlas = atlas
end
function impl:SetColorTexture(r, g, b, a)
	assert(type(r) == "number" and type(g) == "number" and type(b) == "number", "SetColorTexture braucht Zahlen")
end
function impl:SetTexCoord(...) assert(select("#", ...) == 4 or select("#", ...) == 8, "SetTexCoord: 4 oder 8 Werte") end

function impl:SetMinMaxValues(lo, hi)
	assert(type(lo) == "number" and type(hi) == "number" and lo <= hi, "SetMinMaxValues ungültig")
	self.__min, self.__max = lo, hi
	if self.__value then self:SetValue(self.__value) end
end
function impl:GetMinMaxValues() return self.__min or 0, self.__max or 0 end
function impl:SetValue(value)
	assert(type(value) == "number", "SetValue braucht eine Zahl")
	local lo, hi = self:GetMinMaxValues()
	if value < lo then value = lo end
	if value > hi then value = hi end
	if value ~= self.__value then
		self.__value = value
		Fire(self, "OnValueChanged", value, false)
	end
end
function impl:GetValue() return self.__value or 0 end
function impl:SetThumbTexture(texture)
	assert(type(texture) == "string" or (type(texture) == "table" and texture.__type == "Texture"), "SetThumbTexture: Textur erwartet")
end

function impl:GetFrameLevel() return self.__level or 1 end
function impl:SetFrameLevel(level) self.__level = level end
function impl:SetFrameStrata(strata)
	local valid = { BACKGROUND = 1, LOW = 1, MEDIUM = 1, HIGH = 1, DIALOG = 1, FULLSCREEN = 1, FULLSCREEN_DIALOG = 1, TOOLTIP = 1 }
	assert(valid[strata], "Ungültige Strata " .. tostring(strata))
end
function impl:Click(button) Fire(self, "OnClick", button or "LeftButton", false) end

-- GameTooltip (C-Methoden)
function impl:SetOwner(owner, anchor)
	assert(owner, "SetOwner braucht einen Besitzer")
	self.__lines, self.__owner = {}, owner
end
function impl:AddLine(text, r, g, b, wrap)
	assert(text == nil or type(text) == "string" or type(text) == "number", "AddLine braucht Text")
	self.__lines = self.__lines or {}
	table.insert(self.__lines, tostring(text))
	local index = #self.__lines
	local name = self.__name
	if name then
		local fs = _G[name .. "TextLeft" .. index]
		if not fs then
			fs = Mock.NewWidget("FontString", name .. "TextLeft" .. index, self)
		end
		fs.__text = tostring(text)
		fs.__color = { r or 1, g or 1, b or 1, 1 }
	end
end
function impl:AddDoubleLine(left, right) self:AddLine(tostring(left) .. " | " .. tostring(right)) end
function impl:ClearLines() self.__lines = {} end
function impl:NumLines() return #(self.__lines or {}) end

-- MessageFrame-artiger Chat
function impl:AddMessage(text) table.insert(Mock.chat, text) end

local WidgetMeta = {
	__index = function(obj, key)
		local mixins = rawget(obj, "__mixins")
		if mixins and mixins[key] then return mixins[key] end
		if MethodsFor(rawget(obj, "__type"))[key] then
			return impl[key] or noop
		end
		return nil
	end,
}

function Mock.NewWidget(widgetType, name, parent)
	local obj = setmetatable({
		__type = widgetType, __name = name, __parent = parent, __points = {}, __scripts = {}, __events = {},
		__shown = true, __mixins = nil,
	}, WidgetMeta)
	if name then _G[name] = obj end
	return obj
end

local function ApplyTemplate(obj, template)
	local def = DUMP_TEMPLATES[template]
	assert(def, "Template gibt es nicht: " .. tostring(template))
	if MIXINS[template] then
		obj.__mixins = obj.__mixins or {}
		for k, v in pairs(MIXINS[template]) do obj.__mixins[k] = v end
	end
	if def.inherits then
		for parentTemplate in tostring(def.inherits):gmatch("[^,%s]+") do
			if DUMP_TEMPLATES[parentTemplate] then ApplyTemplate(obj, parentTemplate) end
		end
	end
end

function CreateFrame(frameType, name, parent, template)
	assert(DUMP_WIDGETS[frameType], "Unbekannter Frame-Typ: " .. tostring(frameType))
	local obj = Mock.NewWidget(frameType, name, parent)
	if template then
		for t in template:gmatch("[^,%s]+") do ApplyTemplate(obj, t) end
	end
	return obj
end

----------------------------------------------------------------------
-- Globale Frames und Tabellen
----------------------------------------------------------------------
UIParent = Mock.NewWidget("Frame", "UIParent")
WorldFrame = Mock.NewWidget("Frame", "WorldFrame")
Minimap = Mock.NewWidget("Minimap", "Minimap", UIParent)
Minimap.__w, Minimap.__h = 140, 140
GameTooltip = CreateFrame("GameTooltip", "GameTooltip", UIParent, "GameTooltipTemplate")
ItemRefTooltip = CreateFrame("GameTooltip", "ItemRefTooltip", UIParent, "GameTooltipTemplate")
DEFAULT_CHAT_FRAME = { AddMessage = function(_, text) table.insert(Mock.chat, text) end }
UISpecialFrames = {}
SlashCmdList = {}

local function errorHandler(err) error(err, 0) end
function geterrorhandler() return errorHandler end

function issecretvalue(value) return false end
function wipe(t) for k in pairs(t) do t[k] = nil end return t end
tinsert = table.insert
tremove = table.remove

----------------------------------------------------------------------
-- Spieler, Ausrüstung, Spieldaten
----------------------------------------------------------------------
Mock.player = { class = "HUNTER", classLocal = "Jäger", level = 30 }
Mock.inventory = {}
Mock.items = {}       -- itemID -> { equipLoc, classID, subclassID, icon, name }
Mock.spells = {}      -- spellID -> { name, desc, cached }
Mock.itemNames = {}   -- itemID -> Name
Mock.professions = { { "Verzauberkunst", 333, 150 }, { "Kräuterkunde", 182, 120 } }
Mock.talentPoints = { [1] = 2, [2] = 0, [3] = 19 }
Mock.subTreeNames = { [1] = "Tierherrschaft", [2] = "Treffsicherheit", [3] = "Überleben" }

function GetLocale() return MOCK_LOCALE end
function UnitClass(unit) return Mock.player.classLocal, Mock.player.class, 3 end
function UnitLevel(unit) return Mock.player.level end
function GetInventoryItemLink(unit, slot)
	local item = Mock.inventory[slot]
	return item and item.link
end
function GetInventoryItemTexture(unit, slot)
	local item = Mock.inventory[slot]
	return item and item.icon
end
function GetCursorPosition() return 450, 350 end

local CLASS_NAMES = { [1] = { "Krieger", "WARRIOR" }, [2] = { "Paladin", "PALADIN" }, [3] = { "Jäger", "HUNTER" },
	[4] = { "Schurke", "ROGUE" }, [5] = { "Priester", "PRIEST" }, [7] = { "Schamane", "SHAMAN" }, [8] = { "Magier", "MAGE" },
	[9] = { "Hexenmeister", "WARLOCK" }, [11] = { "Druide", "DRUID" } }
function GetClassInfo(classID)
	local info = CLASS_NAMES[classID]
	if info then return info[1], info[2], classID end
end

C_ClassColor = {
	GetClassColor = function(file)
		return { GetRGB = function() return 0.67, 0.83, 0.45 end }
	end,
}

C_AddOns = { GetAddOnMetadata = function(addon, field) if field == "Version" then return "1.0.0-test" end end }

C_Item = {
	GetItemInfoInstant = function(item)
		local id = type(item) == "number" and item or tonumber(tostring(item):match("item:(%d+)"))
		local info = id and Mock.items[id]
		if not info then return nil end
		return id, "Weapon", "Sub", info.equipLoc, info.icon, info.classID, info.subclassID
	end,
	GetItemNameByID = function(id) return Mock.itemNames[id] end,
	GetItemIconByID = function(id) return 134400 end,
	IsItemDataCachedByID = function(id) return Mock.itemNames[id] ~= nil end,
	RequestLoadItemDataByID = function(id) table.insert(Mock.log, "item-request " .. id) end,
}

Mock.bags = {}        -- itemID -> Anzahl in Taschen und Bank
Mock.schematics = {}  -- Rezept-Spell-ID -> Schema, wie es C_TradeSkillUI liefert
C_Item.GetItemCount = function(item, includeBank)
	assert(type(item) == "number", "GetItemCount im Test nur mit Item-ID")
	return Mock.bags[item] or 0
end
C_TradeSkillUI = {
	GetRecipeSchematic = function(recipeID, isRecraft)
		assert(isRecraft == false, "GetRecipeSchematic: isRecraft angeben")
		return Mock.schematics[recipeID]
	end,
}
function GetMoneyString(copper, separateThousands)
	return ("%dg %ds %dc"):format(math.floor(copper / 10000), math.floor(copper / 100) % 100, copper % 100)
end

-- Modernes Auktionshaus (wie im Forever-Client): AuctionHouseFrame mit SearchBar
Mock.ahSearches = {}
function Mock.CreateAuctionHouse()
	local ah = CreateFrame("Frame", "AuctionHouseFrame", UIParent)
	ah.__w, ah.__h, ah.__left, ah.__top = 800, 540, 60, 720
	local bar = CreateFrame("Frame", nil, ah)
	ah.SearchBar = bar
	bar.SearchBox = CreateFrame("EditBox", nil, bar)
	bar.SearchButton = CreateFrame("Button", nil, bar)
	bar.SetSearchText = function(self, text) self.SearchBox:SetText(text) end
	bar.StartSearch = function(self) table.insert(Mock.ahSearches, self.SearchBox:GetText()) end
	ah.SetDisplayMode = function(self, mode) self.__mode = mode end
	AuctionHouseFrameDisplayMode = { Buy = { "Buy" } }
	ah:Hide()
	return ah
end

-- Auctionator mit seiner öffentlichen API v1
Mock.auctionator = { searches = {}, lists = {}, prices = {} }
function Mock.InstallAuctionator()
	Auctionator = { API = { v1 = {
		MultiSearchExact = function(callerID, terms)
			assert(type(callerID) == "string" and type(terms) == "table", "MultiSearchExact: falsche Parameter")
			assert(AuctionHouseFrame and AuctionHouseFrame:IsShown(), "MultiSearchExact: AH muss offen sein")
			for _, term in ipairs(terms) do assert(not term:find("[\";]"), "verbotene Zeichen im Suchbegriff") end
			table.insert(Mock.auctionator.searches, terms)
		end,
		CreateShoppingList = function(callerID, listName, entries)
			assert(type(callerID) == "string" and type(listName) == "string" and type(entries) == "table", "CreateShoppingList: falsche Parameter")
			Mock.auctionator.lists[listName] = entries
		end,
		ConvertToSearchString = function(callerID, term)
			assert(type(term) == "table" and type(term.searchString) == "string", "ConvertToSearchString: falsche Parameter")
			return ('"%s";;;;;;;;;;;;;%s'):format(term.searchString, tostring(term.quantity or ""))
		end,
		GetAuctionPriceByItemID = function(callerID, itemID) return Mock.auctionator.prices[itemID] end,
	} } }
end

C_Spell = {
	GetSpellName = function(id) local s = Mock.spells[id]; return s and s.cached ~= false and s.name or nil end,
	GetSpellDescription = function(id) local s = Mock.spells[id]; return s and s.cached ~= false and s.desc or "" end,
	IsSpellDataCached = function(id) local s = Mock.spells[id]; return s ~= nil and s.cached ~= false end,
	RequestLoadSpellData = function(id) table.insert(Mock.log, "spell-request " .. id) end,
}

C_TooltipInfo = {
	GetInventoryItem = function(unit, slot)
		local item = Mock.inventory[slot]
		if not item then return nil end
		local lines = { { leftText = item.name, type = Enum.TooltipDataLineType.None } }
		if item.enchantText then
			table.insert(lines, { leftText = string.format(ENCHANTED_TOOLTIP_LINE, item.enchantText),
				type = Enum.TooltipDataLineType.ItemEnchantmentPermanent })
		end
		return { lines = lines }
	end,
}

C_Texture = { GetAtlasInfo = function(atlas) if DUMP_ATLAS[atlas] then return { width = 16, height = 16 } end end }

C_Timer = { After = function(seconds, fn) table.insert(Mock.timers, fn) end }
function Mock.RunTimers()
	local timers = Mock.timers
	Mock.timers = {}
	for _, fn in ipairs(timers) do fn() end
end

function GetProfessions()
	return Mock.professions[1] and 1 or nil, Mock.professions[2] and 2 or nil, nil, nil, nil
end
function GetProfessionInfo(index)
	local p = Mock.professions[index]
	if p then return p[1], 136244, p[3], 300, 5, 0, p[2] end
end

C_ClassTalents = { GetActiveConfigID = function() return 7 end }
C_Traits = {
	GetConfigInfo = function(configID) return { treeIDs = { 70 } } end,
	GetTreeNodes = function(treeID) return { 1001, 1002, 1003 } end,
	GetNodeInfo = function(configID, nodeID)
		local sub = nodeID - 1000
		return { ranksPurchased = Mock.talentPoints[sub] or 0, subTreeID = sub }
	end,
	GetSubTreeInfo = function(configID, subTreeID) return { name = Mock.subTreeNames[subTreeID] } end,
}

TooltipDataProcessor = {
	AddTooltipPostCall = function(dataType, fn)
		assert(dataType == Enum.TooltipDataType.Item, "falscher Tooltip-Typ")
		table.insert(Mock.postCalls, fn)
	end,
}
TooltipUtil = {
	GetDisplayedItem = function(tooltip) return "Item", tooltip.__itemLink, nil end,
}
ChatFrameUtil = { OpenChat = function(text) table.insert(Mock.opened, text) end }

----------------------------------------------------------------------
-- Events und Laden
----------------------------------------------------------------------
function Mock.FireEvent(event, ...)
	assert(DUMP_EVENTS[event], "Event gibt es nicht: " .. event)
	for frame in pairs(Mock.eventFrames) do
		if frame.__events[event] then Fire(frame, "OnEvent", event, ...) end
	end
end

function Mock.LoadAddonFile(path, addonName, ns)
	local file = assert(io.open(path, "rb"))
	local source = file:read("*a")
	file:close()
	local chunk, err = loadstring(source, "@" .. path:match("[^/]+/[^/]+$"))
	assert(chunk, err)
	chunk(addonName, ns)
end

-- Welche globalen Namen hat das Add-on gelesen, die es nicht gibt?
Mock.missingGlobals = {}
setmetatable(_G, {
	__index = function(_, key)
		Mock.missingGlobals[key] = true
		return nil
	end,
})
