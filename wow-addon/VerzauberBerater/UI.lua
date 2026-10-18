-- Verzauber-Berater: Hauptfenster mit allen Registern
local ADDON, ns = ...
local L, T, W = ns.L, ns.T, ns.W
local C = W.C

local UI = {}
ns.UI = UI

local format, floor, min, max = string.format, math.floor, math.min, math.max
local tinsert, tconcat, tsort = table.insert, table.concat, table.sort

local FRAME_W, FRAME_H = 880, 620
local ICON = "Interface\\Icons\\Trade_Engraving"
local TAB_RECO, TAB_PLAN, TAB_GEAR, TAB_SHOP, TAB_ALL, TAB_INFO = 1, 2, 3, 4, 5, 6

local GREEN, GREY, GOLD, PURPLE, ORANGE, RED, YELLOW =
	"|cff1eff00", "|cff9d9d9d", "|cffffd100", "|cffa335ee", "|cffff8c26", "|cffff4d4d", "|cffffd940"

local ENCHANTING_SOURCES = { T = true, D = true, V = true, R = true, RAID = true }

----------------------------------------------------------------------
-- Gemeinsame Helfer
----------------------------------------------------------------------
local function RoleAtlas(role)
	if role == "TANK" then return W.ATLAS.tank end
	if role == "HEALER" then return W.ATLAS.healer end
	return W.ATLAS.dps
end

-- Kleine Markierungen hinter einer Verzauberung: NEU / unbestätigt
local function Badges(e)
	local parts = {}
	if e.c == "N" then parts[#parts + 1] = PURPLE .. L.NEW_BADGE .. "|r" end
	if ns:IsUnverified(e) then parts[#parts + 1] = W.AtlasMarkup(W.ATLAS.warn, 12, ORANGE .. "?|r") end
	return tconcat(parts, " ")
end

-- Tooltip-Zeilen mit allen Details zu einer Verzauberung
local function EnchantLines(e, spec, row, level)
	local lines = {}
	tinsert(lines, { ns:EffectText(e), C.green[1], C.green[2], C.green[3] })
	if e.desc and e.desc ~= "" then
		tinsert(lines, { L.TT_INGAME .. " " .. e.desc, 0.85, 0.85, 0.85 })
	end
	tinsert(lines, " ")
	tinsert(lines, { format(L.TT_LEVEL, e.lvl), C.gold[1], C.gold[2], C.gold[3] })
	if e.sk then tinsert(lines, { format(L.TT_SKILL, e.sk), 1, 1, 1 }) end
	tinsert(lines, { format(L.TT_SOURCE, ns:SourceText(e)), 1, 1, 1 })
	if e.m then
		tinsert(lines, { L.TT_MATS, C.gold[1], C.gold[2], C.gold[3] })
		for _, mat in ipairs(e.m) do
			tinsert(lines, { "   " .. mat[2] .. "x " .. ns:MatName(mat[1]), 0.9, 0.9, 0.9 })
		end
	elseif ENCHANTING_SOURCES[e.src] then
		tinsert(lines, { L.TT_MATS_UNKNOWN, C.dim[1], C.dim[2], C.dim[3] })
	end
	tinsert(lines, " ")
	if e.c == "N" then tinsert(lines, { L.TT_NEW, C.purple[1], C.purple[2], C.purple[3] }) end
	if e.was then tinsert(lines, { format(L.TT_CHANGED, e.was), 0.8, 0.6, 1 }) end
	if e.liveFrom then tinsert(lines, { format(L.TT_LIVE_FIXED, tostring(e.liveFrom)), C.green[1], C.green[2], C.green[3] }) end
	if ns:IsUnverified(e) then
		tinsert(lines, { L.TT_UNVERIFIED, C.orange[1], C.orange[2], C.orange[3] })
	elseif e.liveOK then
		tinsert(lines, { L.TT_LIVE_OK, C.green[1], C.green[2], C.green[3] })
	elseif e.c == "F" or e.c == "N" then
		tinsert(lines, { L.TT_VERIFIED, C.green[1], C.green[2], C.green[3] })
	end
	if spec and row then
		local ranked = ns:Rank(spec, row)
		if #ranked > 1 then
			tinsert(lines, " ")
			tinsert(lines, { L.TT_RANKING, C.gold[1], C.gold[2], C.gold[3] })
			for i = 1, min(8, #ranked) do
				local candidate = ranked[i].e
				local text = i .. ". " .. ns:EnchantLabel(candidate)
				local r, g, b = 0.9, 0.9, 0.9
				if candidate == e then r, g, b = C.gold[1], C.gold[2], C.gold[3] end
				if level and candidate.lvl > level then
					text = text .. " " .. format(L.TT_NOT_YET, candidate.lvl)
					r, g, b = C.dim[1], C.dim[2], C.dim[3]
				end
				tinsert(lines, { text, r, g, b })
			end
		end
	end
	return lines
end

function UI:ShowEnchantTip(owner, e, spec, row, level)
	W.ShowTip(owner, e.name, EnchantLines(e, spec, row, level))
end

local function Page(parent)
	local page = CreateFrame("Frame", nil, parent)
	page:SetPoint("TOPLEFT", 6, -6)
	page:SetPoint("BOTTOMRIGHT", -6, 6)
	page:Hide()
	return page
end

----------------------------------------------------------------------
-- Register 1: Empfehlung
----------------------------------------------------------------------
local Reco = {}

local function CreateRecoRow(list)
	local row = CreateFrame("Button", nil, list)
	W.RowBackground(row)
	row.icon = row:CreateTexture(nil, "ARTWORK")
	row.icon:SetSize(30, 30)
	row.icon:SetPoint("LEFT", 6, 0)
	row.star = row:CreateTexture(nil, "OVERLAY")
	row.star:SetSize(16, 16)
	row.star:SetPoint("TOPLEFT", row.icon, "TOPLEFT", -6, 6)
	row.slot = W.Text(row, "GameFontNormalSmall")
	row.slot:SetPoint("TOPLEFT", 44, -6)
	row.slot:SetWidth(140)
	row.lvl = W.Text(row, "GameFontDisableSmall")
	row.lvl:SetPoint("TOPLEFT", 44, -23)
	row.lvl:SetWidth(140)
	row.name = W.Text(row, "GameFontHighlight")
	row.name:SetPoint("TOPLEFT", 190, -5)
	row.name:SetPoint("TOPRIGHT", -112, -5)
	row.name:SetWordWrap(false)
	row.info = W.Text(row, "GameFontDisableSmall")
	row.info:SetPoint("TOPLEFT", 190, -23)
	row.info:SetPoint("TOPRIGHT", -112, -23)
	row.info:SetWordWrap(false)
	row.src = W.Text(row, "GameFontDisableSmall", "RIGHT")
	row.src:SetPoint("TOPRIGHT", -8, -6)
	row.src:SetWidth(100)
	row.badge = W.Text(row, "GameFontNormalSmall", "RIGHT")
	row.badge:SetPoint("TOPRIGHT", -8, -22)
	row.badge:SetWidth(100)
	row:SetScript("OnEnter", function(self)
		if self.e then UI:ShowEnchantTip(self, self.e, self.spec, self.slotRow, self.level) end
	end)
	row:SetScript("OnLeave", W.HideTip)
	return row
end

local function UpdateRecoRow(row, slotRow, index)
	W.Zebra(row, index)
	local spec, level = ns:SelectedSpec(), ns.sel.level
	row.spec, row.slotRow, row.level = spec, slotRow, level
	row.icon:SetTexture(slotRow.icon)
	row.star:SetShown(slotRow.top and W.SetAtlas(row.star, W.ATLAS.star) or false)
	row.slot:SetText(slotRow.label)

	local reco = slotRow.reco
	local best = reco.best
	local parts = {}
	if best then
		local e = best.e
		row.e = e
		row.name:SetText(e.name .. "   " .. GREEN .. ns:EffectText(e) .. "|r")
		row.lvl:SetText(format(L.FROM_LEVEL, e.lvl))
		row.src:SetText(L["SRC_" .. e.src])
		row.badge:SetText(Badges(e))
		if reco.alt then tinsert(parts, format(L.ALTERNATIVE, reco.alt.e.name)) end
		if reco.nextUp then tinsert(parts, format(L.NEXT_UPGRADE, reco.nextUp.e.lvl, ns:EnchantLabel(reco.nextUp.e))) end
	else
		row.e = reco.nextUp and reco.nextUp.e
		row.name:SetText(GREY .. L.NOTHING_YET .. "|r")
		row.lvl:SetText("")
		row.src:SetText("")
		row.badge:SetText("")
		if reco.nextUp then
			tinsert(parts, format(L.FIRST_AT, reco.nextUp.e.lvl, ns:EnchantLabel(reco.nextUp.e)))
		else
			tinsert(parts, L.NO_OPTIONS)
		end
	end
	if reco.util then tinsert(parts, format(L.UTILITY, ns:EnchantLabel(reco.util))) end
	row.info:SetText(tconcat(parts, "   |   "))
end

function Reco:Build(parent)
	local page = Page(parent)
	self.frame = page
	self.header = W.Text(page, "GameFontNormal")
	self.header:SetPoint("TOPLEFT", 4, -4)
	self.enchanter = W.Checkbox(page, L.ENCHANTER_CB, function(checked)
		ns.cdb.enchanter = checked
		UI:Refresh()
	end)
	self.enchanter:SetPoint("TOPRIGHT", -(self.enchanter.label:GetStringWidth() + 14), -3)
	self.enchanter.tip = L.ENCHANTER_TIP
	self.list = W.ScrollList(page, 42, CreateRecoRow, UpdateRecoRow)
	self.list:SetPoint("TOPLEFT", 0, -26)
	self.list:SetPoint("BOTTOMRIGHT", 0, 0)
end

function Reco:Refresh()
	local spec = ns:SelectedSpec()
	if not spec then return end
	local level = ns.sel.level
	local own = spec.class.file == ns:PlayerClassFile()
	local enchanter = own and ns:IsEnchanter()
	self.enchanter:SetShown(own)
	self.enchanter:SetChecked(enchanter)
	self.header:SetText(format(L.RECO_HEADER, ns:SpecLabel(spec), level))
	self.list:SetData(ns:BuildRecommendations(spec, ns:SelectedSetup(), level, enchanter))
end

----------------------------------------------------------------------
-- Register 2: Fahrplan 10-60
----------------------------------------------------------------------
local Plan = {}
local PLAN_LABEL_W, PLAN_CELL_W = 160, 108

local function CreatePlanRow(list)
	local row = CreateFrame("Frame", nil, list)
	W.RowBackground(row)
	row.icon = row:CreateTexture(nil, "ARTWORK")
	row.icon:SetSize(22, 22)
	row.icon:SetPoint("LEFT", 4, 0)
	row.slot = W.Text(row, "GameFontNormalSmall")
	row.slot:SetPoint("LEFT", 32, 0)
	row.slot:SetWidth(PLAN_LABEL_W - 34)
	row.slot:SetWordWrap(false)
	row.cells = {}
	for i = 1, #ns.PLAN_LEVELS do
		local cell = CreateFrame("Button", nil, row)
		cell:SetSize(PLAN_CELL_W - 4, 26)
		cell:SetPoint("LEFT", row, "LEFT", PLAN_LABEL_W + (i - 1) * PLAN_CELL_W, 0)
		cell.text = W.Text(cell, "GameFontHighlightSmall")
		cell.text:SetPoint("LEFT", 2, 0)
		cell.text:SetPoint("RIGHT", -2, 0)
		cell.text:SetWordWrap(false)
		cell:SetScript("OnEnter", function(self)
			if self.e then UI:ShowEnchantTip(self, self.e, self.spec, self.slotRow, self.level) end
		end)
		cell:SetScript("OnLeave", W.HideTip)
		row.cells[i] = cell
	end
	return row
end

local function UpdatePlanRow(row, slotRow, index)
	W.Zebra(row, index)
	local spec = ns:SelectedSpec()
	row.icon:SetTexture(slotRow.icon)
	row.slot:SetText(slotRow.label)
	local previous
	for i, level in ipairs(ns.PLAN_LEVELS) do
		local cell = row.cells[i]
		local best = ns:Recommend(spec, slotRow, level).best
		cell.spec, cell.slotRow, cell.level = spec, slotRow, level
		if best then
			cell.e = best.e
			local text = ns:ShortText(best.e)
			if best.e == previous then
				cell.text:SetText(GREY .. text .. "|r")
			else
				cell.text:SetText(GREEN .. text .. "|r")
			end
			previous = best.e
		else
			cell.e = nil
			cell.text:SetText(GREY .. "-|r")
		end
	end
end

function Plan:Build(parent)
	local page = Page(parent)
	self.frame = page
	self.header = W.Text(page, "GameFontNormal")
	self.header:SetPoint("TOPLEFT", 4, -4)
	self.hint = W.Text(page, "GameFontDisableSmall")
	self.hint:SetPoint("TOPLEFT", 4, -22)
	self.hint:SetText(L.PLAN_HINT)
	self.marker = page:CreateTexture(nil, "BACKGROUND")
	self.marker:SetColorTexture(C.purple[1], C.purple[2], C.purple[3], 0.22)
	self.columns = {}
	for i, level in ipairs(ns.PLAN_LEVELS) do
		local label = W.Text(page, "GameFontNormal")
		label:SetPoint("TOPLEFT", page, "TOPLEFT", PLAN_LABEL_W + (i - 1) * PLAN_CELL_W + 2, -44)
		label:SetText(L.LEVEL .. " " .. level)
		self.columns[i] = label
	end
	self.list = W.ScrollList(page, 30, CreatePlanRow, UpdatePlanRow)
	self.list:SetPoint("TOPLEFT", 0, -64)
	self.list:SetPoint("BOTTOMRIGHT", 0, 0)
end

function Plan:Refresh()
	local spec = ns:SelectedSpec()
	if not spec then return end
	self.header:SetText(format(L.PLAN_HEADER, ns:SpecLabel(spec)))
	local column = 1
	for i, level in ipairs(ns.PLAN_LEVELS) do
		if ns.sel.level >= level then column = i end
	end
	local x = PLAN_LABEL_W + (column - 1) * PLAN_CELL_W - 2
	self.marker:ClearAllPoints()
	self.marker:SetPoint("TOPLEFT", self.frame, "TOPLEFT", x, -40)
	self.marker:SetPoint("BOTTOMLEFT", self.frame, "BOTTOMLEFT", x, 0)
	self.marker:SetWidth(PLAN_CELL_W)
	for i, label in ipairs(self.columns) do
		if i == column then label:SetTextColor(1, 1, 1) else label:SetTextColor(C.gold[1], C.gold[2], C.gold[3]) end
	end
	local own = spec.class.file == ns:PlayerClassFile()
	self.list:SetData(ns:GetSlotPlan(spec, ns:SelectedSetup(), own and ns:IsEnchanter()))
end

----------------------------------------------------------------------
-- Register 3: Meine Ausrüstung
----------------------------------------------------------------------
local Gear = {}

local STATUS_ATLAS = { GOOD = W.ATLAS.check, MISSING = W.ATLAS.cross, BETTER = W.ATLAS.warn, UNKNOWN = W.ATLAS.warn }

local function CreateGearRow(list)
	local row = CreateFrame("Button", nil, list)
	W.RowBackground(row)
	row.icon = row:CreateTexture(nil, "ARTWORK")
	row.icon:SetSize(30, 30)
	row.icon:SetPoint("LEFT", 6, 0)
	row.status = row:CreateTexture(nil, "OVERLAY")
	row.status:SetSize(16, 16)
	row.status:SetPoint("BOTTOMRIGHT", row.icon, "BOTTOMRIGHT", 6, -6)
	row.slot = W.Text(row, "GameFontNormalSmall")
	row.slot:SetPoint("TOPLEFT", 44, -6)
	row.slot:SetWidth(170)
	row.item = W.Text(row, "GameFontHighlightSmall")
	row.item:SetPoint("TOPLEFT", 44, -23)
	row.item:SetWidth(200)
	row.item:SetWordWrap(false)
	row.current = W.Text(row, "GameFontHighlight")
	row.current:SetPoint("TOPLEFT", 260, -5)
	row.current:SetPoint("TOPRIGHT", -8, -5)
	row.current:SetWordWrap(false)
	row.advice = W.Text(row, "GameFontHighlightSmall")
	row.advice:SetPoint("TOPLEFT", 260, -23)
	row.advice:SetPoint("TOPRIGHT", -8, -23)
	row.advice:SetWordWrap(false)
	row:SetScript("OnEnter", function(self)
		local entry = self.entry
		if not entry then return end
		GameTooltip:SetOwner(self, "ANCHOR_RIGHT")
		if entry.link then
			GameTooltip:SetInventoryItem("player", entry.row.inv)
		else
			GameTooltip:AddLine(entry.row.label, C.gold[1], C.gold[2], C.gold[3])
		end
		-- Unverzauberte Teile bekommen den Tipp schon über den Tooltip-Hook (Tooltip.lua)
		local best = entry.reco and entry.reco.best
		if best and (not entry.link or entry.status == "BETTER") then
			GameTooltip:AddLine(" ")
			GameTooltip:AddLine(L.TITLE .. ": " .. ns:EnchantLabel(best.e), C.purple[1] + 0.2, C.purple[2] + 0.3, C.purple[3], true)
		end
		GameTooltip:Show()
	end)
	row:SetScript("OnLeave", W.HideTip)
	return row
end

local function UpdateGearRow(row, entry, index)
	W.Zebra(row, index)
	row.entry = entry
	row.icon:SetTexture(entry.icon or entry.row.icon)
	row.icon:SetDesaturated(not entry.link)
	row.slot:SetText(entry.row.label)
	row.item:SetText(entry.link or (GREY .. L.GEAR_EMPTY .. "|r"))
	local atlas = STATUS_ATLAS[entry.status]
	row.status:SetShown(atlas and W.SetAtlas(row.status, atlas) or false)

	local best = entry.reco and entry.reco.best
	local status = entry.status
	if status == "EMPTY" then
		row.current:SetText(GREY .. L.GEAR_EMPTY .. "|r")
		row.advice:SetText(best and (GREY .. format(L.GEAR_SUGGEST, ns:EnchantLabel(best.e)) .. "|r") or "")
	elseif status == "MISSING" then
		row.current:SetText(RED .. L.GEAR_NONE .. "|r")
		row.advice:SetText(GOLD .. format(L.GEAR_SUGGEST, ns:EnchantLabel(best.e)) .. "|r")
	elseif status == "NOTHING" then
		row.current:SetText(GREY .. L.GEAR_NOTHING .. "|r")
		local nextUp = entry.reco and entry.reco.nextUp
		row.advice:SetText(nextUp and (GREY .. format(L.FIRST_AT, nextUp.e.lvl, ns:EnchantLabel(nextUp.e)) .. "|r") or "")
	else
		row.current:SetText(GREEN .. (entry.enchantText or L.GEAR_ENCHANTED) .. "|r")
		if status == "GOOD" then
			row.advice:SetText(GREEN .. L.GEAR_GOOD .. "|r")
		elseif status == "BETTER" then
			row.advice:SetText(YELLOW .. format(L.GEAR_BETTER, ns:EnchantLabel(best.e)) .. "|r")
		else
			row.advice:SetText(best and (GREY .. format(L.GEAR_SUGGEST, ns:EnchantLabel(best.e)) .. "|r") or "")
		end
	end
end

function Gear:Build(parent)
	local page = Page(parent)
	self.frame = page
	self.header = W.Text(page, "GameFontNormal")
	self.header:SetPoint("TOPLEFT", 4, -4)
	self.hint = W.Text(page, "GameFontDisableSmall")
	self.hint:SetPoint("TOPLEFT", 4, -22)
	self.hint:SetText(L.GEAR_SPEC_HINT)
	self.rescan = W.Button(page, L.GEAR_RESCAN, 110, 22, function() Gear:Refresh() end)
	self.rescan:SetPoint("TOPRIGHT", -2, -2)
	self.summary = W.Text(page, "GameFontHighlight")
	self.summary:SetPoint("BOTTOMLEFT", 4, 4)
	self.list = W.ScrollList(page, 42, CreateGearRow, UpdateGearRow)
	self.list:SetPoint("TOPLEFT", 0, -42)
	self.list:SetPoint("BOTTOMRIGHT", 0, 24)
end

function Gear:Refresh()
	local scan = ns:ScanGear()
	if not scan then
		self.list:SetData({})
		return
	end
	self.header:SetText(format(L.GEAR_HEADER, ns:SpecLabel(scan.spec), scan.level))
	self.summary:SetText(format(L.GEAR_SUMMARY, scan.enchanted, scan.total, scan.missing, scan.better))
	self.list:SetData(scan.rows)
end

----------------------------------------------------------------------
-- Register 4: Einkaufsliste
----------------------------------------------------------------------
local Shop = {}

local function CreateShopRow(list)
	local row = CreateFrame("Button", nil, list)
	W.RowBackground(row)
	row.icon = row:CreateTexture(nil, "ARTWORK")
	row.icon:SetSize(18, 18)
	row.icon:SetPoint("LEFT", 4, 0)
	row.text = W.Text(row, "GameFontHighlightSmall")
	row.text:SetPoint("LEFT", 28, 0)
	row.text:SetPoint("RIGHT", -4, 0)
	row.text:SetWordWrap(false)
	row:SetScript("OnEnter", function(self)
		if self.e then UI:ShowEnchantTip(self, self.e) end
	end)
	row:SetScript("OnLeave", W.HideTip)
	return row
end

local function UpdateShopRow(row, item, index)
	W.Zebra(row, index)
	row.e = item.e
	row.icon:SetTexture(item.icon)
	row.icon:SetShown(item.icon ~= nil)
	row.text:SetText(item.text)
end

function Shop:Build(parent)
	local page = Page(parent)
	self.frame = page
	self.onlyMissing = W.Checkbox(page, L.SHOP_ONLY_MISSING, function() Shop:Refresh() end)
	self.onlyMissing:SetPoint("TOPLEFT", 4, -4)
	self.onlyMissing:SetChecked(true)
	self.forText = W.Text(page, "GameFontDisableSmall", "RIGHT")
	self.forText:SetPoint("TOPRIGHT", -4, -6)

	self.leftHeader = W.Text(page, "GameFontNormal")
	self.leftHeader:SetPoint("TOPLEFT", 4, -30)
	self.leftHeader:SetText(L.SHOP_ENCHANTS)
	self.enchants = W.ScrollList(page, 24, CreateShopRow, UpdateShopRow)
	self.enchants:SetPoint("TOPLEFT", 0, -50)
	self.enchants:SetPoint("BOTTOMRIGHT", page, "BOTTOM", -6, 34)

	self.rightHeader = W.Text(page, "GameFontNormal")
	self.rightHeader:SetPoint("TOPLEFT", page, "TOP", 8, -30)
	self.rightHeader:SetText(L.SHOP_MATS)
	self.mats = W.ScrollList(page, 24, CreateShopRow, UpdateShopRow)
	self.mats:SetPoint("TOPLEFT", page, "TOP", 6, -50)
	self.mats:SetPoint("BOTTOMRIGHT", 0, 34)

	self.note = W.Text(page, "GameFontDisableSmall")
	self.note:SetPoint("BOTTOMLEFT", 4, 10)
	self.chat = W.Button(page, L.SHOP_CHAT, 220, 24, function() Shop:PostToChat() end)
	self.chat:SetPoint("BOTTOMRIGHT", -2, 4)
	self.chat.tip = L.SHOP_CHAT_TIP
end

function Shop:Collect()
	local needed = {}
	local spec, level
	if self.onlyMissing:GetChecked() then
		local scan = ns:ScanGear()
		if scan then
			spec, level = scan.spec, scan.level
			for _, entry in ipairs(scan.rows) do
				if (entry.status == "MISSING" or entry.status == "BETTER") and entry.reco.best then
					tinsert(needed, { label = entry.row.label, e = entry.reco.best.e })
				end
			end
		end
	else
		spec, level = ns:SelectedSpec(), ns.sel.level
		local own = spec.class.file == ns:PlayerClassFile()
		for _, row in ipairs(ns:BuildRecommendations(spec, ns:SelectedSetup(), level, own and ns:IsEnchanter())) do
			if row.reco.best then tinsert(needed, { label = row.label, e = row.reco.best.e }) end
		end
	end
	return needed, spec, level
end

function Shop:Refresh()
	local needed, spec, level = self:Collect()
	self.needed = needed
	self.forText:SetText(spec and format(L.SHOP_FOR, ns:SpecLabel(spec), level) or "")

	local enchantRows, totals, unknown = {}, {}, 0
	for _, item in ipairs(needed) do
		local e = item.e
		tinsert(enchantRows, { e = e, text = GOLD .. item.label .. ":|r " .. ns:EnchantLabel(e) .. " " .. Badges(e),
			icon = "Interface\\Icons\\Trade_Engraving" })
		if e.m then
			for _, mat in ipairs(e.m) do totals[mat[1]] = (totals[mat[1]] or 0) + mat[2] end
		elseif ENCHANTING_SOURCES[e.src] then
			unknown = unknown + 1
		end
	end
	local matRows = {}
	for key, count in pairs(totals) do
		tinsert(matRows, { text = count .. "x " .. ns:MatName(key), icon = ns:MatIcon(key), name = ns:MatName(key) })
	end
	tsort(matRows, function(a, b) return a.name < b.name end)
	if #enchantRows == 0 then
		tinsert(enchantRows, { text = GREY .. L.SHOP_NOTHING .. "|r" })
	end
	if #matRows == 0 and #needed > 0 then
		tinsert(matRows, { text = GREY .. L.SHOP_NO_MATS .. "|r" })
	end
	self.enchants:SetData(enchantRows)
	self.mats:SetData(matRows)
	self.note:SetText(unknown > 0 and format(L.SHOP_UNKNOWN, unknown) or "")
	self.chat:SetShown(#needed > 0)
end

function Shop:PostToChat()
	local names = {}
	for _, item in ipairs(self.needed or {}) do
		if ENCHANTING_SOURCES[item.e.src] then tinsert(names, item.e.name) end
	end
	if #names == 0 then return end
	local message = format(L.SHOP_CHAT_MSG, tconcat(names, ", "))
	if #message > 250 then message = message:sub(1, 247) .. "..." end
	if ChatFrameUtil and ChatFrameUtil.OpenChat then
		ChatFrameUtil.OpenChat(message)
	elseif ChatFrame_OpenChat then
		ChatFrame_OpenChat(message)
	else
		ns:Print(message)
	end
end

----------------------------------------------------------------------
-- Register 5: Alle Verzauberungen
----------------------------------------------------------------------
local All = { filter = "ALL", onlyUseful = true }
local GROUP_ORDER = { "WEAPON", "2H", "SHIELD", "OFFHAND", "SCOPE", "HEAD", "NECK", "SHOULDER", "BACK",
	"CHEST", "WRIST", "HANDS", "LEGS", "FEET", "FINGER" }
local GROUP_RANK = {}
for i, group in ipairs(GROUP_ORDER) do GROUP_RANK[group] = i end

local function CreateAllRow(list)
	local row = CreateFrame("Button", nil, list)
	W.RowBackground(row)
	row.lvl = W.Text(row, "GameFontNormalSmall", "RIGHT")
	row.lvl:SetPoint("LEFT", 2, 0)
	row.lvl:SetWidth(30)
	row.name = W.Text(row, "GameFontHighlightSmall")
	row.name:SetPoint("LEFT", 40, 0)
	row.name:SetWidth(300)
	row.name:SetWordWrap(false)
	row.effect = W.Text(row, "GameFontHighlightSmall")
	row.effect:SetPoint("LEFT", 346, 0)
	row.effect:SetWidth(220)
	row.effect:SetWordWrap(false)
	row.barBg = row:CreateTexture(nil, "ARTWORK")
	row.barBg:SetColorTexture(1, 1, 1, 0.08)
	row.barBg:SetSize(70, 8)
	row.barBg:SetPoint("LEFT", 574, 0)
	row.bar = row:CreateTexture(nil, "OVERLAY")
	row.bar:SetColorTexture(C.purple[1], C.purple[2], C.purple[3], 0.9)
	row.bar:SetHeight(8)
	row.bar:SetPoint("LEFT", row.barBg, "LEFT", 0, 0)
	row.src = W.Text(row, "GameFontDisableSmall")
	row.src:SetPoint("LEFT", 652, 0)
	row.src:SetPoint("RIGHT", -40, 0)
	row.src:SetWordWrap(false)
	row.badge = W.Text(row, "GameFontNormalSmall", "RIGHT")
	row.badge:SetPoint("RIGHT", -4, 0)
	row.badge:SetWidth(36)
	row:SetScript("OnEnter", function(self)
		if self.e then UI:ShowEnchantTip(self, self.e) end
	end)
	row:SetScript("OnLeave", W.HideTip)
	return row
end

local function UpdateAllRow(row, item, index)
	W.Zebra(row, index)
	local e = item.e
	row.e = e
	row.lvl:SetText(tostring(e.lvl))
	row.name:SetText(e.name)
	row.effect:SetText(GREEN .. ns:EffectText(e) .. "|r")
	local fraction = item.max > 0 and item.score / item.max or 0
	row.bar:SetWidth(max(1, 70 * fraction))
	row.bar:SetShown(fraction > 0)
	row.src:SetText(L["SRC_" .. e.src])
	row.badge:SetText(Badges(e))
end

function All:Build(parent)
	local page = Page(parent)
	self.frame = page
	local label = W.Text(page, "GameFontNormalSmall")
	label:SetPoint("TOPLEFT", 4, -8)
	label:SetText(L.ALL_FILTER .. ":")
	self.dropdown = W.Dropdown(page, 170, function(value)
		All.filter = value
		All:Refresh()
	end)
	self.dropdown:SetPoint("LEFT", label, "RIGHT", 8, 0)
	local items = { { value = "ALL", text = L.GROUP_ALL } }
	for _, group in ipairs(GROUP_ORDER) do tinsert(items, { value = group, text = L["GROUP_" .. group] }) end
	self.dropdown:SetItems(items)
	self.dropdown:SetValue(self.filter)
	self.useful = W.Checkbox(page, L.ALL_ONLY_USEFUL, function(checked)
		All.onlyUseful = checked
		All:Refresh()
	end)
	self.useful:SetPoint("LEFT", self.dropdown, "RIGHT", 16, 0)
	self.useful:SetChecked(self.onlyUseful)
	self.count = W.Text(page, "GameFontDisableSmall", "RIGHT")
	self.count:SetPoint("TOPRIGHT", -4, -10)

	local heads = { { L.COL_LEVEL, 2 }, { L.COL_NAME, 40 }, { L.COL_EFFECT, 346 }, { L.COL_VALUE, 574 }, { L.COL_SOURCE, 652 } }
	for _, head in ipairs(heads) do
		local text = W.Text(page, "GameFontNormalSmall")
		text:SetPoint("TOPLEFT", head[2], -36)
		text:SetText(head[1])
	end
	self.list = W.ScrollList(page, 22, CreateAllRow, UpdateAllRow)
	self.list:SetPoint("TOPLEFT", 0, -52)
	self.list:SetPoint("BOTTOMRIGHT", 0, 0)
end

function All:Refresh()
	local spec = ns:SelectedSpec()
	local data, seen, best = {}, {}, 0
	for _, group in ipairs(GROUP_ORDER) do
		if self.filter == "ALL" or self.filter == group then
			for _, e in ipairs(ns.byGroup[group] or {}) do
				if not seen[e] then
					seen[e] = true
					local score = spec and ns:Score(e, spec, { wdmg = 1 }) or 0
					if not self.onlyUseful or score >= ns.MIN_SCORE or (e.util and self.filter ~= "ALL") then
						tinsert(data, { e = e, score = score, group = GROUP_RANK[e.groups[1]] or 99 })
						if score > best then best = score end
					end
				end
			end
		end
	end
	for _, item in ipairs(data) do item.max = best end
	tsort(data, function(a, b)
		if a.group ~= b.group then return a.group < b.group end
		if a.e.lvl ~= b.e.lvl then return a.e.lvl < b.e.lvl end
		return a.e.index < b.e.index
	end)
	self.count:SetText(format(L.ALL_COUNT, #data))
	self.list:SetData(data)
end

----------------------------------------------------------------------
-- Register 6: Info und Optionen
----------------------------------------------------------------------
local Info = {}

function Info:Build(parent)
	local page = Page(parent)
	self.frame = page
	self.text = W.Text(page, "GameFontHighlight")
	self.text:SetPoint("TOPLEFT", 8, -8)
	self.text:SetPoint("TOPRIGHT", -8, -8)
	self.text:SetJustifyV("TOP")
	self.text:SetSpacing(2)
	self.text:SetText(format(L.INFO_TEXT,
		W.AtlasMarkup(W.ATLAS.star, 14, GOLD .. "*|r"),
		W.AtlasMarkup(W.ATLAS.warn, 14, ORANGE .. "?|r")))

	local options = {
		{ L.OPT_MINIMAP, function() return not ns.db.minimap.hide end, function(v) ns:SetMinimapButtonShown(v) end },
		{ L.OPT_TOOLTIP, function() return ns.db.tooltip end, function(v) ns.db.tooltip = v end },
		{ L.OPT_UTILITY, function() return ns.db.showUtility end, function(v) ns.db.showUtility = v; ns:InvalidateCache() end },
		{ L.OPT_LEVELUP, function() return ns.db.levelUp end, function(v) ns.db.levelUp = v end },
	}
	self.boxes = {}
	for i, option in ipairs(options) do
		local box = W.Checkbox(page, option[1], option[3])
		box:SetPoint("BOTTOMLEFT", 10, 34 + (#options - i) * 24)
		box.getter = option[2]
		self.boxes[i] = box
	end
	self.version = W.Text(page, "GameFontDisableSmall")
	self.version:SetPoint("BOTTOMLEFT", 8, 8)
end

function Info:Refresh()
	for _, box in ipairs(self.boxes) do box:SetChecked(box.getter()) end
	local checked = 0
	for _, e in ipairs(ns.ENCHANTS) do
		if e.live then checked = checked + 1 end
	end
	self.version:SetText(format(L.INFO_VERSION, ns.version or "?", #ns.ENCHANTS, checked))
end

----------------------------------------------------------------------
-- Hauptfenster
----------------------------------------------------------------------
local PAGES = { Reco, Plan, Gear, Shop, All, Info }
UI.pages = PAGES

local function Label(parent, text)
	local label = W.Text(parent, "GameFontNormalSmall")
	label:SetText(text .. ":")
	return label
end

function UI:Create()
	if self.frame then return self.frame end
	local f = CreateFrame("Frame", "VerzauberBeraterFrame", UIParent, W.TEMPLATE)
	self.frame = f
	f:SetSize(FRAME_W, FRAME_H)
	f:SetFrameStrata("HIGH")
	f:SetToplevel(true)
	f:SetClampedToScreen(true)
	f:SetMovable(true)
	f:EnableMouse(true)
	f:RegisterForDrag("LeftButton")
	f:SetScript("OnDragStart", f.StartMoving)
	f:SetScript("OnDragStop", function(frame)
		frame:StopMovingOrSizing()
		local point, _, relativePoint, x, y = frame:GetPoint()
		ns.db.window = { point = point, relativePoint = relativePoint, x = x, y = y }
	end)
	W.Backdrop(f, C.bg, C.purple)
	self:RestorePosition()
	if UISpecialFrames then tinsert(UISpecialFrames, "VerzauberBeraterFrame") end

	-- Titelleiste
	local header = f:CreateTexture(nil, "ARTWORK")
	header:SetColorTexture(C.purple[1], C.purple[2], C.purple[3], 0.28)
	header:SetPoint("TOPLEFT", 1, -1)
	header:SetPoint("TOPRIGHT", -1, -1)
	header:SetHeight(32)
	local icon = f:CreateTexture(nil, "OVERLAY")
	icon:SetSize(24, 24)
	icon:SetPoint("TOPLEFT", 8, -5)
	icon:SetTexture(ICON)
	local title = W.Text(f, "GameFontNormalLarge")
	title:SetPoint("LEFT", icon, "RIGHT", 8, 0)
	title:SetText(L.TITLE)
	local subtitle = W.Text(f, "GameFontHighlightSmall")
	subtitle:SetPoint("LEFT", title, "RIGHT", 12, -1)
	subtitle:SetText(L.SUBTITLE)
	subtitle:SetTextColor(C.dim[1], C.dim[2], C.dim[3])
	local close = CreateFrame("Button", nil, f, "UIPanelCloseButton")
	close:SetPoint("TOPRIGHT", -2, -2)
	close:SetScript("OnClick", function() f:Hide() end)

	-- Zeile 1: Klasse, Spec, Waffen, Mein Charakter
	local classLabel = Label(f, L.CLASS)
	classLabel:SetPoint("TOPLEFT", 14, -48)
	self.classDD = W.Dropdown(f, 160, function(value) ns:SetClass(value) end)
	self.classDD:SetPoint("LEFT", classLabel, "RIGHT", 8, 0)
	local specLabel = Label(f, L.SPEC)
	specLabel:SetPoint("LEFT", self.classDD, "RIGHT", 18, 0)
	self.specDD = W.Dropdown(f, 200, function(value) ns:SetSpec(value) end)
	self.specDD:SetPoint("LEFT", specLabel, "RIGHT", 8, 0)
	local setupLabel = Label(f, L.WEAPONS)
	setupLabel:SetPoint("LEFT", self.specDD, "RIGHT", 18, 0)
	self.setupDD = W.Dropdown(f, 172, function(value) ns:SetSetup(value) end)
	self.setupDD:SetPoint("LEFT", setupLabel, "RIGHT", 8, 0)
	self.myChar = W.Button(f, L.MY_CHAR, 118, 22, function() ns:ResetSelection() end)
	self.myChar:SetPoint("TOPRIGHT", -14, -44)
	self.myChar.tip = L.MY_CHAR_TIP

	-- Zeile 2: Level-Regler mit +/- und Schnellwahl
	local levelLabel = Label(f, L.LEVEL)
	levelLabel:SetPoint("TOPLEFT", 14, -82)
	self.minus = W.Button(f, "-", 22, 20, function() ns:SetLevel(ns.sel.level - 1) end)
	self.minus:SetPoint("LEFT", levelLabel, "RIGHT", 8, 0)
	self.slider = W.Slider(f, 360, ns.LEVEL_MIN, ns.LEVEL_MAX, function(value) ns:SetLevel(value) end)
	self.slider:SetPoint("LEFT", self.minus, "RIGHT", 10, 0)
	self.plus = W.Button(f, "+", 22, 20, function() ns:SetLevel(ns.sel.level + 1) end)
	self.plus:SetPoint("LEFT", self.slider, "RIGHT", 10, 0)
	self.levelText = W.Text(f, "GameFontNormalLarge", "CENTER")
	self.levelText:SetPoint("LEFT", self.plus, "RIGHT", 8, 0)
	self.levelText:SetWidth(36)
	local previous = self.levelText
	self.presets = {}
	for _, level in ipairs(ns.PLAN_LEVELS) do
		local button = W.Button(f, tostring(level), 34, 20, function() ns:SetLevel(level) end)
		button:SetPoint("LEFT", previous, "RIGHT", 6, 0)
		previous = button
		tinsert(self.presets, button)
	end

	-- Zeile 3: Rolle und Prioritäten
	self.specInfo = W.Text(f, "GameFontHighlightSmall")
	self.specInfo:SetPoint("TOPLEFT", 14, -106)
	self.specInfo:SetPoint("TOPRIGHT", -14, -106)
	self.specInfo:SetTextColor(C.dim[1], C.dim[2], C.dim[3])

	-- Register
	self.tabs = W.TabBar(f, { L.TAB_RECO, L.TAB_PLAN, L.TAB_GEAR, L.TAB_SHOP, L.TAB_ALL, L.TAB_INFO },
		function(index) UI:SelectTab(index) end)
	self.tabs:SetPoint("TOPLEFT", 14, -122)

	local content = CreateFrame("Frame", nil, f, W.TEMPLATE)
	content:SetPoint("TOPLEFT", 12, -146)
	content:SetPoint("BOTTOMRIGHT", -12, 12)
	W.Backdrop(content, C.panel, C.edge)
	self.content = content
	for _, page in ipairs(PAGES) do page:Build(content) end

	f:SetScript("OnShow", function() UI:Refresh() end)
	f:Hide()
	self:SelectTab(ns.cdb.tab or TAB_RECO)
	return f
end

function UI:RestorePosition()
	local frame, pos = self.frame, ns.db.window
	frame:ClearAllPoints()
	if pos and pos.point then
		frame:SetPoint(pos.point, UIParent, pos.relativePoint or pos.point, pos.x or 0, pos.y or 0)
	else
		frame:SetPoint("CENTER", UIParent, "CENTER", 0, 40)
	end
end

function UI:ResetPosition()
	ns.db.window = {}
	if self.frame then self:RestorePosition() end
end

function UI:SelectTab(index)
	if not PAGES[index] then index = TAB_RECO end
	self.activeTab = index
	ns.cdb.tab = index
	for i, page in ipairs(PAGES) do page.frame:SetShown(i == index) end
	self.tabs:Select(index)
	if self.frame:IsShown() then PAGES[index]:Refresh() end
end

function UI:RefreshControls()
	local sel = ns.sel
	local spec = ns:SelectedSpec()
	if not spec then return end

	local classItems = {}
	for _, class in ipairs(ns.CLASSES) do
		tinsert(classItems, { value = class.file, text = ns:ClassLabel(class), atlas = "classicon-" .. class.file:lower() })
	end
	self.classDD:SetItems(classItems)
	self.classDD:SetValue(sel.classFile)

	local specItems = {}
	for _, s in ipairs(spec.class.specs) do
		tinsert(specItems, { value = s.key, label = ns:SpecName(s), atlas = RoleAtlas(s.role),
			text = ns:SpecName(s) .. GREY .. "  (" .. ns:RoleText(s) .. ")|r" })
	end
	self.specDD:SetItems(specItems)
	self.specDD:SetValue(sel.specKey)

	-- Was "Automatisch" gerade bedeuten würde (eigene Ausrüstung oder Spec-Standard)
	local chosen = sel.setup
	sel.setup = "AUTO"
	local resolved = ns:SelectedSetup()
	sel.setup = chosen
	local setupItems = { { value = "AUTO", text = format(L.SETUP_AUTO_IS, L["SETUP_" .. resolved]) } }
	for _, key in ipairs({ "2H", "DW", "1HS", "1HOH" }) do
		tinsert(setupItems, { value = key, text = L["SETUP_" .. key] })
	end
	self.setupDD:SetItems(setupItems)
	self.setupDD:SetValue(sel.setup)

	self.slider:SetValueSilently(sel.level)
	self.levelText:SetText(tostring(sel.level))
	for _, button in ipairs(self.presets) do
		local isCurrent = tonumber(button.label:GetText()) == sel.level
		button:SetBackdropColor(isCurrent and 0.35 or 0.15, isCurrent and 0.15 or 0.11, isCurrent and 0.5 or 0.22, 1)
	end
	self.specInfo:SetText(format(L.PRIO, ns:RoleText(spec), ns.PROFILE_PRIO[spec.profile] or ""))
end

function UI:Refresh()
	if not (self.frame and self.frame:IsShown()) then return end
	self:RefreshControls()
	local page = PAGES[self.activeTab or TAB_RECO]
	if page then page:Refresh() end
end

function UI:Toggle()
	self:Create()
	self.frame:SetShown(not self.frame:IsShown())
end

function UI:Open(tab)
	self:Create()
	self.frame:Show()
	if tab then self:SelectTab(tab) end
end

ns:On("SELECTION_CHANGED", function() UI:Refresh() end)
ns:On("DATA_CHANGED", function() UI:Refresh() end)
ns:On("SPEC_CHANGED", function() UI:Refresh() end)
ns:On("GEAR_CHANGED", function()
	if UI.activeTab == TAB_GEAR or UI.activeTab == TAB_SHOP or UI.activeTab == TAB_RECO then UI:Refresh() end
end)
