-- Verzauber-Berater: Minimap-Button, Add-on-Menü (Kompartiment) und Eintrag in den Optionen
local ADDON, ns = ...
local L = ns.L

local ICON = "Interface\\Icons\\Trade_Engraving"
local button

local function UpdatePosition()
	local angle = math.rad(ns.db.minimap.angle or 215)
	local radius = Minimap:GetWidth() / 2 + 6
	button:ClearAllPoints()
	button:SetPoint("CENTER", Minimap, "CENTER", math.cos(angle) * radius, math.sin(angle) * radius)
end

local function ShowTooltip(owner)
	GameTooltip:SetOwner(owner, "ANCHOR_LEFT")
	GameTooltip:AddLine(L.TITLE, 1, 0.82, 0)
	GameTooltip:AddLine(L.MINIMAP_TIP, 1, 1, 1)
	GameTooltip:Show()
end

local function CreateButton()
	if button or not Minimap then return end
	button = CreateFrame("Button", "VerzauberBeraterMinimapButton", Minimap)
	button:SetSize(32, 32)
	button:SetFrameStrata("MEDIUM")
	button:SetFrameLevel(8)
	button:RegisterForClicks("LeftButtonUp", "RightButtonUp")
	button:RegisterForDrag("LeftButton")
	button:SetHighlightTexture("Interface\\Minimap\\UI-Minimap-ZoomButton-Highlight")

	local background = button:CreateTexture(nil, "BACKGROUND")
	background:SetSize(22, 22)
	background:SetPoint("CENTER")
	background:SetColorTexture(0, 0, 0, 0.6)
	local icon = button:CreateTexture(nil, "ARTWORK")
	icon:SetSize(20, 20)
	icon:SetPoint("CENTER")
	icon:SetTexture(ICON)
	icon:SetTexCoord(0.08, 0.92, 0.08, 0.92)
	local border = button:CreateTexture(nil, "OVERLAY")
	border:SetSize(54, 54)
	border:SetPoint("TOPLEFT")
	border:SetTexture("Interface\\Minimap\\MiniMap-TrackingBorder")

	button:SetScript("OnClick", function(_, mouseButton)
		if mouseButton == "RightButton" then ns.UI:Open(6) else ns.UI:Toggle() end
	end)
	button:SetScript("OnDragStart", function(self)
		self:SetScript("OnUpdate", function()
			local mx, my = Minimap:GetCenter()
			local px, py = GetCursorPosition()
			local scale = Minimap:GetEffectiveScale()
			ns.db.minimap.angle = math.deg(math.atan2(py / scale - my, px / scale - mx))
			UpdatePosition()
		end)
	end)
	button:SetScript("OnDragStop", function(self) self:SetScript("OnUpdate", nil) end)
	button:SetScript("OnEnter", ShowTooltip)
	button:SetScript("OnLeave", function() GameTooltip:Hide() end)
	UpdatePosition()
end

function ns:SetMinimapButtonShown(show)
	self.db.minimap.hide = not show
	if show then
		CreateButton()
		if button then button:Show() end
	elseif button then
		button:Hide()
	end
end

function ns:ToggleMinimapButton()
	local show = self.db.minimap.hide
	self:SetMinimapButtonShown(show)
	self:Print(show and L.MINIMAP_ON or L.MINIMAP_OFF)
end

-- Add-on-Kompartiment (das Add-on-Menü an der Minimap), siehe ## AddonCompartmentFunc in der .toc
function VerzauberBerater_OnCompartmentClick()
	ns.UI:Toggle()
end

function VerzauberBerater_OnCompartmentEnter(_, menuButtonFrame)
	ShowTooltip(menuButtonFrame)
end

function VerzauberBerater_OnCompartmentLeave()
	GameTooltip:Hide()
end

-- Kleiner Eintrag in Optionen > Add-ons mit einem Knopf zum Öffnen
local function RegisterOptionsPanel()
	if not (Settings and Settings.RegisterCanvasLayoutCategory and Settings.RegisterAddOnCategory) then return end
	local panel = CreateFrame("Frame")
	local title = panel:CreateFontString(nil, "OVERLAY", "GameFontNormalLarge")
	title:SetPoint("TOPLEFT", 16, -16)
	title:SetText(L.TITLE)
	local text = panel:CreateFontString(nil, "OVERLAY", "GameFontHighlight")
	text:SetPoint("TOPLEFT", title, "BOTTOMLEFT", 0, -8)
	text:SetText(L.SUBTITLE)
	local open = ns.W.Button(panel, L.TITLE, 180, 26, function() ns.UI:Open() end)
	open:SetPoint("TOPLEFT", text, "BOTTOMLEFT", 0, -16)
	local category = Settings.RegisterCanvasLayoutCategory(panel, L.TITLE)
	Settings.RegisterAddOnCategory(category)
end

ns:On("LOGIN", function()
	if not ns.db.minimap.hide then CreateButton() end
	pcall(RegisterOptionsPanel)
	ns:Print(L.LOADED)
end)
