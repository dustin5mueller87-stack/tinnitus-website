-- Verzauber-Berater: Auktionshaus-Anbindung
-- Zeigt am Auktionshaus ein Panel mit den Materialien der Einkaufsliste und sucht sie
-- im Blizzard-AH oder - wenn installiert - in Auctionator (dessen offizielle API v1).
local ADDON, ns = ...
local L, W = ns.L, ns.W
local C = W.C

local AH = {}
ns.AH = AH

local format, floor = string.format, math.floor
local CALLER = ADDON
local WIDTH, ROW_H, MAX_ROWS = 286, 20, 8
local DEFAULT_X, DEFAULT_Y = 8, -200
local GREEN, GREY, GOLD = "|cff1eff00", "|cff9d9d9d", "|cffffd100"

----------------------------------------------------------------------
-- Auktionshaus und Auctionator
----------------------------------------------------------------------
local function AuctionatorAPI()
	local api = Auctionator and Auctionator.API and Auctionator.API.v1
	if type(api) == "table" then return api end
end

function AH:HasAuctionator()
	return AuctionatorAPI() ~= nil
end

function AH:IsOpen()
	return AuctionHouseFrame ~= nil and AuctionHouseFrame:IsShown()
end

-- Suchbegriff eines Materials: Name in Client-Sprache, ohne Zeichen, die Auctionator ablehnt
local function SearchTerm(mat)
	return (mat.name:gsub("[\";]", ""))
end

-- Nur Materialien mit Item-ID lassen sich sicher suchen (Namen kommen dann aus dem Client)
local function Searchable(mat)
	return type(mat.key) == "number" or not ns.isDE
end

-- Blizzard-AH: in die Kaufen-Ansicht wechseln, Suchbegriff eintragen, Suche starten
function AH:BlizzardSearch(text)
	local frame = AuctionHouseFrame
	if not (frame and frame:IsShown() and frame.SearchBar) then return false end
	if frame.SetDisplayMode and AuctionHouseFrameDisplayMode and AuctionHouseFrameDisplayMode.Buy then
		pcall(frame.SetDisplayMode, frame, AuctionHouseFrameDisplayMode.Buy)
	end
	local bar = frame.SearchBar
	if bar.SetSearchText then
		pcall(bar.SetSearchText, bar, text)
	elseif bar.SearchBox then
		bar.SearchBox:SetText(text)
	end
	if bar.StartSearch then return (pcall(bar.StartSearch, bar)) end
	if bar.SearchButton then
		bar.SearchButton:Click()
		return true
	end
	return false
end

-- Auctionator: alle Begriffe auf einmal im Einkaufs-Reiter suchen (nur exakte Namen)
function AH:AuctionatorSearch(terms)
	local api = AuctionatorAPI()
	if not (api and api.MultiSearchExact) or #terms == 0 then return false end
	return (pcall(api.MultiSearchExact, CALLER, terms))
end

function AH:PriceOf(key)
	local api = AuctionatorAPI()
	if type(key) ~= "number" or not (api and api.GetAuctionPriceByItemID) then return nil end
	local ok, price = pcall(api.GetAuctionPriceByItemID, CALLER, key)
	if ok and type(price) == "number" and price > 0 then return price end
end

local function MoneyText(copper)
	if GetMoneyString then
		local ok, text = pcall(GetMoneyString, copper, true)
		if ok and type(text) == "string" then return text end
	end
	local gold, silver = floor(copper / 10000), floor(copper / 100) % 100
	return format("%dg %ds %dc", gold, silver, copper % 100)
end

----------------------------------------------------------------------
-- Aktionen
----------------------------------------------------------------------
function AH:Targets(shopping)
	local targets = {}
	for _, mat in ipairs(shopping.mats) do
		if mat.missing > 0 and Searchable(mat) then targets[#targets + 1] = mat end
	end
	return targets
end

function AH:SearchAll()
	if not self:IsOpen() then
		ns:Print(L.AH_NOT_OPEN)
		return
	end
	local targets = self:Targets(ns:BuildShopping())
	if #targets == 0 then
		ns:Print(L.AH_ALL_THERE)
		return
	end
	if self:HasAuctionator() then
		local terms = {}
		for i, mat in ipairs(targets) do terms[i] = SearchTerm(mat) end
		if self:AuctionatorSearch(terms) then
			ns:Print(format(L.AH_SEARCH_MANY, #terms))
			return
		end
	end
	-- Ohne Auctionator: bei jedem Klick das nächste Material
	self.step = (self.step or 0) % #targets + 1
	local mat = targets[self.step]
	if self:BlizzardSearch(SearchTerm(mat)) then
		ns:Print(format(L.AH_SEARCH_ONE, mat.name, self.step, #targets))
	else
		ns:Print(L.AH_FAILED)
	end
end

function AH:SearchMat(mat)
	if not self:IsOpen() then
		ns:Print(L.AH_NOT_OPEN)
		return
	end
	local term = SearchTerm(mat)
	local ok = (self:HasAuctionator() and self:AuctionatorSearch({ term })) or self:BlizzardSearch(term)
	ns:Print(ok and format(L.AH_SEARCH_SINGLE, mat.name) or L.AH_FAILED)
end

function AH:CreateList()
	local api = AuctionatorAPI()
	if not (api and api.CreateShoppingList) then return end
	local entries = {}
	for _, mat in ipairs(self:Targets(ns:BuildShopping())) do
		local entry = SearchTerm(mat)
		if api.ConvertToSearchString then
			local ok, converted = pcall(api.ConvertToSearchString, CALLER,
				{ searchString = entry, isExact = true, quantity = mat.missing })
			if ok and type(converted) == "string" then entry = converted end
		end
		entries[#entries + 1] = entry
	end
	if #entries == 0 then
		ns:Print(L.AH_ALL_THERE)
		return
	end
	if pcall(api.CreateShoppingList, CALLER, L.AH_LIST_NAME, entries) then
		ns:Print(format(L.AH_LIST_DONE, L.AH_LIST_NAME, #entries))
	else
		ns:Print(L.AH_LIST_FAIL)
	end
end

----------------------------------------------------------------------
-- Panel am Auktionshaus
----------------------------------------------------------------------
local function Anchor(frame)
	local pos = ns.db.ah
	frame:ClearAllPoints()
	if AuctionHouseFrame then
		frame:SetPoint("TOPLEFT", AuctionHouseFrame, "TOPRIGHT", pos.x or DEFAULT_X, pos.y or DEFAULT_Y)
	else
		frame:SetPoint("CENTER", UIParent, "CENTER", 0, 0)
	end
end

local function SavePosition(frame)
	local ah = AuctionHouseFrame
	if not ah then return end
	local left, top, ahRight, ahTop = frame:GetLeft(), frame:GetTop(), ah:GetRight(), ah:GetTop()
	if left and top and ahRight and ahTop then
		ns.db.ah.x, ns.db.ah.y = floor(left - ahRight + 0.5), floor(top - ahTop + 0.5)
	end
	Anchor(frame)
end

function AH:ResetPosition()
	ns.db.ah.x, ns.db.ah.y = DEFAULT_X, DEFAULT_Y
	if self.frame then Anchor(self.frame) end
	ns:Print(L.AH_RESET)
end

local function CreateRow(parent, index)
	local row = CreateFrame("Button", nil, parent)
	row:SetHeight(ROW_H)
	row:SetPoint("TOPLEFT", parent, "TOPLEFT", 6, -58 - (index - 1) * ROW_H)
	row:SetPoint("TOPRIGHT", parent, "TOPRIGHT", -6, -58 - (index - 1) * ROW_H)
	W.RowBackground(row)
	row.icon = row:CreateTexture(nil, "ARTWORK")
	row.icon:SetSize(16, 16)
	row.icon:SetPoint("LEFT", 2, 0)
	row.text = W.Text(row, "GameFontHighlightSmall")
	row.text:SetPoint("LEFT", 22, 0)
	row.text:SetPoint("RIGHT", -64, 0)
	row.text:SetWordWrap(false)
	row.state = W.Text(row, "GameFontHighlightSmall", "RIGHT")
	row.state:SetPoint("RIGHT", -4, 0)
	row.state:SetWidth(60)
	row:SetScript("OnClick", function(self)
		if self.mat then AH:SearchMat(self.mat) end
	end)
	row:SetScript("OnEnter", function(self)
		local mat = self.mat
		if not mat then return end
		GameTooltip:SetOwner(self, "ANCHOR_RIGHT")
		if type(mat.key) == "number" and GameTooltip.SetItemByID then
			GameTooltip:SetItemByID(mat.key)
		else
			GameTooltip:AddLine(mat.name, 1, 1, 1)
		end
		local price = AH:PriceOf(mat.key)
		if price then GameTooltip:AddLine("Auctionator: " .. MoneyText(price), 1, 0.82, 0) end
		GameTooltip:AddLine(L.SHOP_MAT_TIP, C.purple[1] + 0.2, C.purple[2] + 0.3, C.purple[3], true)
		GameTooltip:Show()
	end)
	row:SetScript("OnLeave", W.HideTip)
	return row
end

function AH:Create()
	if self.frame then return self.frame end
	local f = CreateFrame("Frame", "VerzauberBeraterAHPanel", UIParent, W.TEMPLATE)
	self.frame = f
	f:SetSize(WIDTH, 38)
	f:SetFrameStrata("HIGH")
	f:SetClampedToScreen(true)
	f:SetMovable(true)
	f:EnableMouse(true)
	f:RegisterForDrag("LeftButton")
	f:SetScript("OnDragStart", f.StartMoving)
	f:SetScript("OnDragStop", function(frame)
		frame:StopMovingOrSizing()
		SavePosition(frame)
	end)
	W.Backdrop(f, C.bg, C.purple)

	f.main = W.Button(f, "", WIDTH - 44, 26, function(_, mouseButton)
		if mouseButton == "RightButton" then AH:ToggleExpanded() else AH:SearchAll() end
	end)
	f.main:SetPoint("TOPLEFT", 6, -6)
	f.main:RegisterForClicks("LeftButtonUp", "RightButtonUp")
	f.main.tip = L.AH_MAIN_TIP
	f.main.tipTitle = L.TITLE
	f.main.label:SetFontObject("GameFontNormal")
	f.main.icon = f.main:CreateTexture(nil, "OVERLAY")
	f.main.icon:SetSize(18, 18)
	f.main.icon:SetPoint("LEFT", 5, 0)
	f.main.icon:SetTexture("Interface\\Icons\\Trade_Engraving")

	-- Auf-/Zuklappen; dient auch als Griff zum Verschieben
	f.toggle = CreateFrame("Button", nil, f, W.TEMPLATE)
	f.toggle:SetSize(26, 26)
	f.toggle:SetPoint("TOPRIGHT", -6, -6)
	W.Backdrop(f.toggle, { 0.15, 0.11, 0.22, 1 }, C.edge)
	f.toggle.icon = f.toggle:CreateTexture(nil, "OVERLAY")
	f.toggle.icon:SetSize(12, 12)
	f.toggle.icon:SetPoint("CENTER")
	f.toggle:RegisterForDrag("LeftButton")
	f.toggle:SetScript("OnDragStart", function() f:StartMoving() end)
	f.toggle:SetScript("OnDragStop", function()
		f:StopMovingOrSizing()
		SavePosition(f)
	end)
	f.toggle:SetScript("OnClick", function() AH:ToggleExpanded() end)

	f.info = W.Text(f, "GameFontDisableSmall")
	f.info:SetPoint("TOPLEFT", 8, -38)
	f.info:SetPoint("TOPRIGHT", -8, -38)
	f.info:SetWordWrap(false)

	f.rows = {}
	for i = 1, MAX_ROWS do f.rows[i] = CreateRow(f, i) end

	f.more = W.Text(f, "GameFontDisableSmall")
	f.price = W.Text(f, "GameFontHighlightSmall")
	f.unknown = W.Text(f, "GameFontDisableSmall")
	f.unknown:SetWordWrap(false)

	f.list = W.Button(f, L.AH_LIST, 130, 22, function() AH:CreateList() end)
	f.list.tip = format(L.AH_LIST_TIP, L.AH_LIST_NAME)
	f.details = W.Button(f, L.AH_WINDOW, 90, 22, function() ns.UI:Open(4) end)
	f.details.tip = L.AH_WINDOW_TIP

	f:Hide()
	return f
end

function AH:ToggleExpanded()
	ns.db.ah.expanded = not ns.db.ah.expanded
	self:Refresh()
end

function AH:Refresh()
	local f = self.frame
	if not (f and f:IsShown()) then return end
	local shopping = ns:BuildShopping()
	local targets = self:Targets(shopping)

	if #targets > 0 then
		f.main.label:SetText(format(L.AH_BUTTON, #targets))
	elseif #shopping.mats > 0 then
		f.main.label:SetText(GREEN .. L.AH_BUTTON_DONE .. "|r")
	else
		f.main.label:SetText(GREY .. L.AH_BUTTON_NONE .. "|r")
	end

	local expanded = ns.db.ah.expanded
	if not W.SetAtlas(f.toggle.icon, expanded and "minimal-scrollbar-arrow-top" or W.ATLAS.arrow) then
		f.toggle.icon:SetColorTexture(C.gold[1], C.gold[2], C.gold[3], 1)
	end
	f.info:SetShown(expanded)
	f.more:SetShown(false)
	f.price:SetShown(false)
	f.unknown:SetShown(false)
	f.list:SetShown(false)
	f.details:SetShown(false)
	for _, row in ipairs(f.rows) do row:Hide() end
	if not expanded then
		f:SetHeight(38)
		return
	end

	local label = shopping.onlyMissing and L.AH_ONLY_MISSING or L.AH_SELECTION
	if shopping.spec then
		f.info:SetText(format(L.AH_FOR, ns:SpecName(shopping.spec), shopping.level) .. "  (" .. label .. ")")
	else
		f.info:SetText(label)
	end

	local shown, total = 0, 0
	for i, mat in ipairs(shopping.mats) do
		local row = f.rows[i]
		if row then
			row.mat = mat
			W.Zebra(row, i)
			row.icon:SetTexture(mat.icon or "Interface\\Icons\\INV_Misc_QuestionMark")
			row.text:SetText(mat.count .. "x " .. mat.name)
			if mat.missing > 0 then
				row.state:SetText(GOLD .. format(L.SHOP_STILL, mat.missing) .. "|r")
			else
				row.state:SetText(W.AtlasMarkup(W.ATLAS.check, 12, "") .. GREEN .. format(L.SHOP_HAVE, mat.have) .. "|r")
			end
			row:Show()
			shown = i
		end
		local price = mat.missing > 0 and self:PriceOf(mat.key)
		if price then total = total + price * mat.missing end
	end

	local y = -58 - shown * ROW_H - 4
	if #shopping.mats > shown then
		f.more:ClearAllPoints()
		f.more:SetPoint("TOPLEFT", 10, y)
		f.more:SetText(format(L.AH_MORE, #shopping.mats - shown))
		f.more:Show()
		y = y - 14
	end
	if total > 0 then
		f.price:ClearAllPoints()
		f.price:SetPoint("TOPLEFT", 10, y)
		f.price:SetText(format(L.AH_PRICE, MoneyText(total)))
		f.price:Show()
		y = y - 16
	end
	if shopping.unknown > 0 then
		f.unknown:ClearAllPoints()
		f.unknown:SetPoint("TOPLEFT", 10, y)
		f.unknown:SetPoint("TOPRIGHT", -10, y)
		f.unknown:SetText(format(L.AH_UNKNOWN, shopping.unknown))
		f.unknown:Show()
		y = y - 14
	end
	y = y - 4
	f.details:ClearAllPoints()
	f.details:SetPoint("TOPRIGHT", -6, y)
	f.details:Show()
	if self:HasAuctionator() and #targets > 0 then
		f.list:ClearAllPoints()
		f.list:SetPoint("TOPLEFT", 6, y)
		f.list:Show()
	end
	f:SetHeight(-y + 28)
end

function AH:Show()
	if not (ns.db and ns.db.ah.show) or not self:IsOpen() then return end
	self:Create()
	if not self.hooked and AuctionHouseFrame.HookScript then
		AuctionHouseFrame:HookScript("OnHide", function() AH:Hide() end)
		self.hooked = true
	end
	Anchor(self.frame)
	self.step = 0
	self.frame:Show()
	self:Refresh()
	ns:Fire("AH_STATE")
end

function AH:Hide()
	if self.frame and self.frame:IsShown() then
		self.frame:Hide()
		ns:Fire("AH_STATE")
	end
end

function AH:SetEnabled(show)
	ns.db.ah.show = show and true or false
	if show then self:Show() else self:Hide() end
end

----------------------------------------------------------------------
-- Ereignisse
----------------------------------------------------------------------
local events = CreateFrame("Frame")
for _, event in ipairs({ "AUCTION_HOUSE_SHOW", "AUCTION_HOUSE_CLOSED", "BAG_UPDATE_DELAYED" }) do
	pcall(events.RegisterEvent, events, event)
end
events:SetScript("OnEvent", function(_, event)
	if event == "AUCTION_HOUSE_SHOW" then
		-- Blizzard baut das Auktionshaus-Fenster im selben Ereignis auf: kurz warten
		if C_Timer and C_Timer.After then
			C_Timer.After(0, function() AH:Show() end)
		else
			AH:Show()
		end
	elseif event == "AUCTION_HOUSE_CLOSED" then
		AH:Hide()
	else
		AH:Refresh()
	end
end)

for _, callback in ipairs({ "GEAR_CHANGED", "SELECTION_CHANGED", "DATA_CHANGED", "SHOPPING_CHANGED", "SPEC_CHANGED" }) do
	ns:On(callback, function() AH:Refresh() end)
end
