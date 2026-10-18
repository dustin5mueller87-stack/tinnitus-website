-- Verzauber-Berater: eigene, schlanke UI-Bausteine
-- Bewusst ohne alte Blizzard-Vorlagen (UIDropDownMenu, OptionsSlider ...), damit
-- alles auf dem Mainline-basierten Forever-Client stabil läuft.
local ADDON, ns = ...
local L = ns.L

local W = {}
ns.W = W

local floor, max, min = math.floor, math.max, math.min
local TEMPLATE = BackdropTemplateMixin and "BackdropTemplate" or nil
local WHITE = "Interface\\Buttons\\WHITE8X8"

W.TEMPLATE = TEMPLATE
W.C = {
	purple = { 0.64, 0.21, 0.93 },
	gold   = { 1, 0.82, 0 },
	white  = { 0.95, 0.95, 0.95 },
	dim    = { 0.6, 0.6, 0.62 },
	green  = { 0.12, 1, 0 },
	red    = { 1, 0.3, 0.3 },
	yellow = { 1, 0.85, 0.25 },
	orange = { 1, 0.55, 0.15 },
	bg     = { 0.045, 0.035, 0.07, 0.97 },
	panel  = { 0.08, 0.07, 0.12, 0.92 },
	field  = { 0.11, 0.095, 0.16, 1 },
	edge   = { 0.3, 0.26, 0.4, 1 },
}
local C = W.C

-- Atlas-Icons (alle im Forever-Client vorhanden), mit Text-Ersatz als Fallback
W.ATLAS = {
	star = "auctionhouse-icon-favorite",
	check = "common-icon-checkmark",
	cross = "common-icon-redx",
	warn = "services-icon-warning",
	arrow = "minimal-scrollbar-arrow-bottom",
	tank = "roleicon-tiny-tank",
	healer = "roleicon-tiny-healer",
	dps = "roleicon-tiny-dps",
}

local function AtlasExists(atlas)
	if not (C_Texture and C_Texture.GetAtlasInfo) then return false end
	local ok, info = pcall(C_Texture.GetAtlasInfo, atlas)
	return ok and info ~= nil
end

-- Setzt ein Atlas-Bild; gibt false zurück, wenn es das Atlas nicht gibt.
function W.SetAtlas(texture, atlas)
	if atlas and texture.SetAtlas and AtlasExists(atlas) then
		texture:SetAtlas(atlas)
		return true
	end
	return false
end

-- Atlas als Text-Symbol (für FontStrings); Fallback ist ein kurzer Text.
function W.AtlasMarkup(atlas, size, fallback)
	if AtlasExists(atlas) then
		return "|A:" .. atlas .. ":" .. (size or 14) .. ":" .. (size or 14) .. "|a"
	end
	return fallback or ""
end

function W.Backdrop(frame, bg, edge)
	if not frame.SetBackdrop then return end
	frame:SetBackdrop({ bgFile = WHITE, edgeFile = WHITE, edgeSize = 1, insets = { left = 1, right = 1, top = 1, bottom = 1 } })
	frame:SetBackdropColor(unpack(bg or C.panel))
	frame:SetBackdropBorderColor(unpack(edge or C.edge))
end

function W.Text(parent, font, justify)
	local text = parent:CreateFontString(nil, "OVERLAY", font or "GameFontHighlight")
	text:SetJustifyH(justify or "LEFT")
	return text
end

----------------------------------------------------------------------
-- Tooltip
----------------------------------------------------------------------
-- lines: Text oder Liste aus Texten bzw. { text, r, g, b } / { left, right, r, g, b }
function W.ShowTip(owner, title, lines, anchor)
	GameTooltip:SetOwner(owner, anchor or "ANCHOR_RIGHT")
	if title then GameTooltip:AddLine(title, C.gold[1], C.gold[2], C.gold[3]) end
	if type(lines) == "string" then
		GameTooltip:AddLine(lines, 1, 1, 1, true)
	elseif type(lines) == "table" then
		for _, line in ipairs(lines) do
			if type(line) == "table" then
				if line.right then
					GameTooltip:AddDoubleLine(line[1], line.right, line[2] or 1, line[3] or 1, line[4] or 1, 1, 1, 1)
				else
					GameTooltip:AddLine(line[1], line[2] or 1, line[3] or 1, line[4] or 1, true)
				end
			else
				GameTooltip:AddLine(line, 1, 1, 1, true)
			end
		end
	end
	GameTooltip:Show()
end

function W.HideTip()
	GameTooltip:Hide()
end

----------------------------------------------------------------------
-- Knopf
----------------------------------------------------------------------
function W.Button(parent, text, width, height, onClick)
	local button = CreateFrame("Button", nil, parent, TEMPLATE)
	button:SetSize(width, height or 22)
	W.Backdrop(button, { 0.15, 0.11, 0.22, 1 }, C.edge)
	button.label = W.Text(button, "GameFontNormalSmall", "CENTER")
	button.label:SetPoint("CENTER")
	button.label:SetText(text)
	button:SetScript("OnEnter", function(self)
		self:SetBackdropBorderColor(unpack(C.purple))
		if self.tip then W.ShowTip(self, self.tipTitle or text, self.tip) end
	end)
	button:SetScript("OnLeave", function(self)
		self:SetBackdropBorderColor(unpack(C.edge))
		W.HideTip()
	end)
	button:SetScript("OnMouseDown", function(self) self.label:SetPoint("CENTER", 1, -1) end)
	button:SetScript("OnMouseUp", function(self) self.label:SetPoint("CENTER", 0, 0) end)
	button:SetScript("OnClick", onClick)
	return button
end

----------------------------------------------------------------------
-- Auswahlliste (Dropdown)
----------------------------------------------------------------------
local menu, catcher
local MENU_ROW = 20

local function CreateMenuButton()
	local button = CreateFrame("Button", nil, menu)
	button:SetHeight(MENU_ROW)
	local highlight = button:CreateTexture(nil, "HIGHLIGHT")
	highlight:SetAllPoints()
	highlight:SetColorTexture(C.purple[1], C.purple[2], C.purple[3], 0.3)
	button.check = button:CreateTexture(nil, "ARTWORK")
	button.check:SetSize(6, 6)
	button.check:SetPoint("LEFT", 6, 0)
	button.check:SetColorTexture(C.gold[1], C.gold[2], C.gold[3], 1)
	button.icon = button:CreateTexture(nil, "ARTWORK")
	button.icon:SetSize(16, 16)
	button.icon:SetPoint("LEFT", 16, 0)
	button.text = W.Text(button, "GameFontHighlightSmall")
	button.text:SetPoint("RIGHT", -6, 0)
	return button
end

function W.CloseMenu()
	if menu then menu:Hide() end
end

local function OpenMenu(owner, items, selected, onPick)
	if not menu then
		catcher = CreateFrame("Button", nil, UIParent)
		catcher:SetAllPoints(UIParent)
		catcher:SetFrameStrata("FULLSCREEN_DIALOG")
		catcher:EnableMouse(true)
		catcher:RegisterForClicks("AnyUp")
		catcher:SetScript("OnClick", W.CloseMenu)
		catcher:Hide()
		menu = CreateFrame("Frame", "VerzauberBeraterMenu", UIParent, TEMPLATE)
		menu:SetFrameStrata("FULLSCREEN_DIALOG")
		menu:SetFrameLevel(catcher:GetFrameLevel() + 10)
		menu:SetClampedToScreen(true)
		W.Backdrop(menu, { 0.06, 0.05, 0.09, 0.98 }, C.purple)
		menu:SetScript("OnHide", function() catcher:Hide() end)
		menu.buttons = {}
		menu:Hide()
		if UISpecialFrames then tinsert(UISpecialFrames, "VerzauberBeraterMenu") end
	end
	if menu:IsShown() and menu.owner == owner then
		menu:Hide()
		return
	end
	menu.owner = owner
	local width = owner:GetWidth()
	for i, item in ipairs(items) do
		local button = menu.buttons[i]
		if not button then
			button = CreateMenuButton()
			menu.buttons[i] = button
		end
		button:ClearAllPoints()
		button:SetPoint("TOPLEFT", menu, "TOPLEFT", 2, -2 - (i - 1) * MENU_ROW)
		button:SetPoint("TOPRIGHT", menu, "TOPRIGHT", -2, -2 - (i - 1) * MENU_ROW)
		button.text:ClearAllPoints()
		button.text:SetPoint("RIGHT", -6, 0)
		if item.atlas and W.SetAtlas(button.icon, item.atlas) then
			button.icon:Show()
			button.text:SetPoint("LEFT", 38, 0)
		else
			button.icon:Hide()
			button.text:SetPoint("LEFT", 18, 0)
		end
		button.text:SetText(item.text)
		width = max(width, button.text:GetStringWidth() + 56)
		button.check:SetShown(item.value == selected)
		button:SetScript("OnClick", function()
			menu:Hide()
			onPick(item.value)
		end)
		button:Show()
	end
	for i = #items + 1, #menu.buttons do menu.buttons[i]:Hide() end
	menu:SetSize(width, #items * MENU_ROW + 4)
	menu:ClearAllPoints()
	menu:SetPoint("TOPLEFT", owner, "BOTTOMLEFT", 0, -2)
	catcher:Show()
	menu:Show()
end

-- items: { { value = ..., text = "...", atlas = "..." }, ... }
function W.Dropdown(parent, width, onPick)
	local dropdown = CreateFrame("Button", nil, parent, TEMPLATE)
	dropdown:SetSize(width, 22)
	W.Backdrop(dropdown, C.field, C.edge)
	dropdown.icon = dropdown:CreateTexture(nil, "ARTWORK")
	dropdown.icon:SetSize(16, 16)
	dropdown.icon:SetPoint("LEFT", 5, 0)
	dropdown.text = W.Text(dropdown, "GameFontHighlightSmall")
	dropdown.text:SetPoint("RIGHT", -20, 0)
	dropdown.text:SetWordWrap(false)
	dropdown.arrow = dropdown:CreateTexture(nil, "ARTWORK")
	dropdown.arrow:SetSize(12, 12)
	dropdown.arrow:SetPoint("RIGHT", -5, 0)
	if not W.SetAtlas(dropdown.arrow, W.ATLAS.arrow) then
		dropdown.arrow:SetColorTexture(C.gold[1], C.gold[2], C.gold[3], 0.8)
		dropdown.arrow:SetSize(6, 6)
	end
	dropdown.items = {}

	function dropdown:SetItems(items)
		self.items = items
		self:SetValue(self.value)
	end

	function dropdown:SetValue(value)
		self.value = value
		self.text:ClearAllPoints()
		self.text:SetPoint("RIGHT", -20, 0)
		for _, item in ipairs(self.items) do
			if item.value == value then
				self.text:SetText(item.label or item.text)
				if item.atlas and W.SetAtlas(self.icon, item.atlas) then
					self.icon:Show()
					self.text:SetPoint("LEFT", 25, 0)
				else
					self.icon:Hide()
					self.text:SetPoint("LEFT", 8, 0)
				end
				return
			end
		end
		self.icon:Hide()
		self.text:SetPoint("LEFT", 8, 0)
		self.text:SetText("")
	end

	dropdown:SetScript("OnClick", function(self)
		OpenMenu(self, self.items, self.value, onPick)
	end)
	dropdown:SetScript("OnEnter", function(self) self:SetBackdropBorderColor(unpack(C.purple)) end)
	dropdown:SetScript("OnLeave", function(self) self:SetBackdropBorderColor(unpack(C.edge)) end)
	return dropdown
end

----------------------------------------------------------------------
-- Schieberegler
----------------------------------------------------------------------
function W.Slider(parent, width, minValue, maxValue, onChange)
	local slider = CreateFrame("Slider", nil, parent, TEMPLATE)
	slider:SetOrientation("HORIZONTAL")
	slider:SetSize(width, 14)
	slider:SetMinMaxValues(minValue, maxValue)
	slider:SetValueStep(1)
	if slider.SetObeyStepOnDrag then slider:SetObeyStepOnDrag(true) end
	slider:SetHitRectInsets(0, 0, -6, -6)
	W.Backdrop(slider, C.field, C.edge)

	slider.fill = slider:CreateTexture(nil, "ARTWORK")
	slider.fill:SetColorTexture(C.purple[1], C.purple[2], C.purple[3], 0.6)
	slider.fill:SetPoint("TOPLEFT", 1, -1)
	slider.fill:SetPoint("BOTTOMLEFT", 1, 1)
	slider.fill:SetWidth(1)

	local thumb = slider:CreateTexture(nil, "OVERLAY")
	thumb:SetColorTexture(C.gold[1], C.gold[2], C.gold[3], 1)
	thumb:SetSize(10, 22)
	slider:SetThumbTexture(thumb)

	local function UpdateFill(self, value)
		local lo, hi = self:GetMinMaxValues()
		local inner = self:GetWidth() - 2
		if hi > lo and inner > 0 then
			self.fill:SetWidth(max(1, inner * (value - lo) / (hi - lo)))
		end
	end

	slider:EnableMouseWheel(true)
	slider:SetScript("OnMouseWheel", function(self, delta)
		self:SetValue(self:GetValue() + delta)
	end)
	slider:SetScript("OnValueChanged", function(self, value)
		value = floor(value + 0.5)
		UpdateFill(self, value)
		if value ~= self.current then
			self.current = value
			if not self.silent then onChange(value) end
		end
	end)
	slider:SetScript("OnSizeChanged", function(self) UpdateFill(self, self:GetValue()) end)

	function slider:SetValueSilently(value)
		self.silent = true
		self:SetValue(value)
		self.silent = false
	end
	return slider
end

----------------------------------------------------------------------
-- Kontrollkästchen
----------------------------------------------------------------------
function W.Checkbox(parent, label, onToggle)
	local checkbox = CreateFrame("Button", nil, parent)
	checkbox:SetSize(16, 16)
	checkbox.box = CreateFrame("Frame", nil, checkbox, TEMPLATE)
	checkbox.box:SetAllPoints()
	W.Backdrop(checkbox.box, C.field, C.edge)
	checkbox.mark = checkbox.box:CreateTexture(nil, "OVERLAY")
	checkbox.mark:SetPoint("TOPLEFT", 4, -4)
	checkbox.mark:SetPoint("BOTTOMRIGHT", -4, 4)
	checkbox.mark:SetColorTexture(C.gold[1], C.gold[2], C.gold[3], 1)
	checkbox.label = W.Text(checkbox, "GameFontHighlightSmall")
	checkbox.label:SetPoint("LEFT", checkbox, "RIGHT", 6, 0)
	checkbox.label:SetText(label)
	checkbox:SetHitRectInsets(0, -(checkbox.label:GetStringWidth() + 10), 0, 0)

	function checkbox:SetChecked(value)
		self.checked = value and true or false
		self.mark:SetShown(self.checked)
	end
	function checkbox:GetChecked()
		return self.checked
	end

	checkbox:SetScript("OnClick", function(self)
		self:SetChecked(not self.checked)
		onToggle(self.checked)
	end)
	checkbox:SetScript("OnEnter", function(self)
		self.box:SetBackdropBorderColor(unpack(C.purple))
		if self.tip then W.ShowTip(self, label, self.tip) end
	end)
	checkbox:SetScript("OnLeave", function(self)
		self.box:SetBackdropBorderColor(unpack(C.edge))
		W.HideTip()
	end)
	checkbox:SetChecked(false)
	return checkbox
end

----------------------------------------------------------------------
-- Register-Leiste
----------------------------------------------------------------------
function W.TabBar(parent, labels, onSelect)
	local bar = CreateFrame("Frame", nil, parent)
	bar:SetHeight(24)
	bar.tabs = {}
	local x = 0
	for i, label in ipairs(labels) do
		local tab = CreateFrame("Button", nil, bar, TEMPLATE)
		tab.text = W.Text(tab, "GameFontNormalSmall", "CENTER")
		tab.text:SetPoint("CENTER")
		tab.text:SetText(label)
		local width = max(70, floor(tab.text:GetStringWidth() + 26))
		tab:SetSize(width, 24)
		tab:SetPoint("BOTTOMLEFT", bar, "BOTTOMLEFT", x, 0)
		x = x + width + 3
		W.Backdrop(tab, C.field, C.edge)
		tab:SetScript("OnClick", function()
			bar:Select(i)
			onSelect(i)
		end)
		tab:SetScript("OnEnter", function(self)
			if bar.selected ~= i then self:SetBackdropBorderColor(unpack(C.purple)) end
		end)
		tab:SetScript("OnLeave", function(self)
			if bar.selected ~= i then self:SetBackdropBorderColor(unpack(C.edge)) end
		end)
		bar.tabs[i] = tab
	end
	bar:SetWidth(x)

	function bar:Select(index)
		self.selected = index
		for i, tab in ipairs(self.tabs) do
			if i == index then
				tab:SetBackdropColor(0.25, 0.12, 0.36, 1)
				tab:SetBackdropBorderColor(unpack(C.purple))
				tab.text:SetTextColor(1, 1, 1)
			else
				tab:SetBackdropColor(unpack(C.field))
				tab:SetBackdropBorderColor(unpack(C.edge))
				tab.text:SetTextColor(C.gold[1], C.gold[2], C.gold[3])
			end
		end
	end
	return bar
end

----------------------------------------------------------------------
-- Scrollbare Liste mit wiederverwendeten Zeilen
----------------------------------------------------------------------
-- createRow(list, index) baut eine Zeile, updateRow(row, item, dataIndex) füllt sie.
function W.ScrollList(parent, rowHeight, createRow, updateRow)
	local list = CreateFrame("Frame", nil, parent)
	list.rows, list.data, list.offset, list.visible = {}, {}, 0, 0

	local bar = CreateFrame("Slider", nil, list, TEMPLATE)
	bar:SetOrientation("VERTICAL")
	bar:SetWidth(8)
	bar:SetPoint("TOPRIGHT", list, "TOPRIGHT", 0, 0)
	bar:SetPoint("BOTTOMRIGHT", list, "BOTTOMRIGHT", 0, 0)
	bar:SetValueStep(1)
	if bar.SetObeyStepOnDrag then bar:SetObeyStepOnDrag(true) end
	W.Backdrop(bar, { 0.07, 0.06, 0.1, 1 }, C.edge)
	local thumb = bar:CreateTexture(nil, "OVERLAY")
	thumb:SetColorTexture(C.purple[1], C.purple[2], C.purple[3], 0.9)
	thumb:SetSize(8, 36)
	bar:SetThumbTexture(thumb)
	bar:SetMinMaxValues(0, 0)
	bar:SetScript("OnValueChanged", function(_, value)
		value = floor(value + 0.5)
		if value ~= list.offset then
			list.offset = value
			list:Refresh()
		end
	end)
	list.bar = bar

	list:EnableMouseWheel(true)
	list:SetScript("OnMouseWheel", function(self, delta)
		self:SetOffset(self.offset - delta * 2)
	end)

	function list:Layout()
		local count = max(0, floor((self:GetHeight() or 0) / rowHeight))
		for i = #self.rows + 1, count do
			local row = createRow(self, i)
			row:SetHeight(rowHeight)
			row:SetPoint("TOPLEFT", self, "TOPLEFT", 0, -(i - 1) * rowHeight)
			row:SetPoint("RIGHT", self.bar, "LEFT", -4, 0)
			self.rows[i] = row
		end
		self.visible = count
	end

	function list:SetData(data)
		self.data = data or {}
		self:Refresh()
	end

	function list:SetOffset(offset)
		local maxOffset = max(0, #self.data - self.visible)
		offset = min(max(0, floor(offset)), maxOffset)
		if offset ~= self.offset then
			self.offset = offset
			self:Refresh()
		end
	end

	function list:Refresh()
		self:Layout()
		local maxOffset = max(0, #self.data - self.visible)
		if self.offset > maxOffset then self.offset = maxOffset end
		self.bar:SetMinMaxValues(0, maxOffset)
		self.bar:SetValue(self.offset)
		self.bar:SetShown(maxOffset > 0)
		for i, row in ipairs(self.rows) do
			local index = i + self.offset
			local item = i <= self.visible and self.data[index]
			if item then
				updateRow(row, item, index)
				row:Show()
			else
				row:Hide()
			end
		end
	end

	list:SetScript("OnSizeChanged", function(self) self:Refresh() end)
	return list
end

-- Zeilen-Hintergrund im Zebra-Look mit Hover
function W.RowBackground(row)
	row.bg = row:CreateTexture(nil, "BACKGROUND")
	row.bg:SetAllPoints()
	row.bg:SetColorTexture(1, 1, 1, 0.03)
	row.hover = row:CreateTexture(nil, "HIGHLIGHT")
	row.hover:SetAllPoints()
	row.hover:SetColorTexture(C.purple[1], C.purple[2], C.purple[3], 0.15)
end

function W.Zebra(row, index)
	row.bg:SetColorTexture(1, 1, 1, index % 2 == 0 and 0.055 or 0.025)
end
