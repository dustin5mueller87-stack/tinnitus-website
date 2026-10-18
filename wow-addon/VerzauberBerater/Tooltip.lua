-- Verzauber-Berater: Tipp-Zeile in Gegenstands-Tooltips
-- Zeigt bei unverzauberten Ausrüstungsteilen, was für deinen Spec auf deinem Level draufgehört.
local ADDON, ns = ...
local L = ns.L

local function AddAdvice(tooltip, link)
	if not (ns.db and ns.db.tooltip) or type(link) ~= "string" or ns.IsSecret(link) then return end
	local _, enchantID = ns.ParseItemLink(link)
	if not enchantID or enchantID > 0 then return end
	local groups, ctx = ns:GroupsForItem(link, "MAINHAND")
	if not groups then return end
	if groups[1] == "FINGER" and not ns:IsEnchanter() then return end
	local spec = ns:OwnSpec()
	if not spec then return end
	local row = { key = "TOOLTIP", groups = groups, ctx = ctx or {} }
	local reco = ns:Recommend(spec, row, ns:ClampLevel(ns:PlayerLevel()))
	if not reco.best then return end
	tooltip:AddLine(" ")
	tooltip:AddLine("|cffa335ee" .. L.TITLE .. ":|r " .. string.format(L.TOOLTIP_TIP, ns:EnchantLabel(reco.best.e)), 1, 0.82, 0, true)
	tooltip:Show()
end

local function OnTooltipSetItem(tooltip)
	if tooltip ~= GameTooltip and tooltip ~= ItemRefTooltip then return end
	local link
	if TooltipUtil and TooltipUtil.GetDisplayedItem then
		local _, itemLink = TooltipUtil.GetDisplayedItem(tooltip)
		link = itemLink
	elseif tooltip.GetItem then
		local _, itemLink = tooltip:GetItem()
		link = itemLink
	end
	local ok, err = pcall(AddAdvice, tooltip, link)
	if not ok and ns.debug then ns:Print(tostring(err)) end
end

if TooltipDataProcessor and TooltipDataProcessor.AddTooltipPostCall and Enum and Enum.TooltipDataType then
	TooltipDataProcessor.AddTooltipPostCall(Enum.TooltipDataType.Item, OnTooltipSetItem)
elseif GameTooltip and GameTooltip:HasScript("OnTooltipSetItem") then
	GameTooltip:HookScript("OnTooltipSetItem", OnTooltipSetItem)
	if ItemRefTooltip then ItemRefTooltip:HookScript("OnTooltipSetItem", OnTooltipSetItem) end
end
