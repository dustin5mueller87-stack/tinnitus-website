#!/usr/bin/env python3
"""Testet den Verzauber-Berater gegen eine strenge Nachbildung des WoW-Forever-Clients.

Der Mock (wow_mock.lua) erlaubt nur, was laut API-Dump des Forever-Clients existiert:
Widget-Methoden, Script-Handler, Templates/Schriften, Atlanten und Events. Danach laufen
die Szenarien aus tests.lua einmal mit deutschem und einmal mit englischem Client.

Voraussetzungen:
    pip install lupa
    git clone --depth 1 --branch forever https://github.com/Ketho/BlizzardInterfaceResources dump
Aufruf:
    python3 test_addon.py dump/Resources [--report]
"""
import os
import sys

from lupa.lua51 import LuaRuntime, lua_type

HERE = os.path.dirname(os.path.abspath(__file__))
ADDON_DIR = os.path.join(os.path.dirname(HERE), "VerzauberBerater")


def read(path):
    with open(path, encoding="utf-8") as handle:
        return handle.read()


def toc_files():
    files = []
    for line in read(os.path.join(ADDON_DIR, "VerzauberBerater.toc")).splitlines():
        line = line.strip()
        if line and not line.startswith("#"):
            files.append(line.replace("\\", "/"))
    return files


def collect_strings(value, out):
    if isinstance(value, str):
        out.add(value)
    elif lua_type(value) == "table":
        for key, item in value.items():
            collect_strings(item, out)


def as_list(table):
    return [table[i] for i in range(1, len(table) + 1)] if table is not None else []


def load_dump(dump):
    """Liest die Namenslisten des Clients (für den Abgleich der globalen Namen)."""
    lua = LuaRuntime(unpack_returned_tuples=True)
    global_api = lua.execute(read(os.path.join(dump, "GlobalAPI.lua")))
    framexml = lua.execute(read(os.path.join(dump, "FrameXML.lua")))
    frames = lua.execute(read(os.path.join(dump, "Frames.lua")))
    mixins = lua.execute(read(os.path.join(dump, "Mixins.lua")))
    names = set()
    for table in (global_api[1], global_api[2], framexml[1], frames[1], mixins):
        names.update(as_list(table))
    for table in (framexml[2], frames[2]):
        if table is not None:
            collect_strings(table, names)
    return names


def run(dump, locale, report=False):
    lua = LuaRuntime(unpack_returned_tuples=True)
    g = lua.globals()
    g.DUMP_WIDGETS = lua.execute(read(os.path.join(dump, "WidgetAPI.lua")))
    g.DUMP_TEMPLATES = lua.execute(read(os.path.join(dump, "Templates.lua")))
    atlas_names = lua.table()
    for _, group in lua.execute(read(os.path.join(dump, "AtlasInfo.lua"))).items():
        for name in group.keys():
            atlas_names[name] = True
    g.DUMP_ATLAS = atlas_names
    events = set()
    collect_strings(lua.execute(read(os.path.join(dump, "Events.lua"))), events)
    g.DUMP_EVENTS = lua.table_from({name: True for name in events})
    lua.execute(read(os.path.join(dump, "LuaEnum.lua")))
    # Die GlobalStrings-Dateien enthalten einzelne kaputte Zeilen: zeilenweise laden
    load_line = lua.eval("function(line) local f = loadstring(line) if f then pcall(f) end end")
    for line in read(os.path.join(dump, "GlobalStrings", locale + ".lua")).splitlines():
        if line[:1].isupper() and " = " in line:
            load_line(line)
    g.MOCK_LOCALE = locale
    g.ADDON_DIR = ADDON_DIR
    g.TOC_FILES = lua.table_from(toc_files())
    g.BackdropTemplateMixin = lua.table()
    lua.execute(read(os.path.join(HERE, "wow_mock.lua")))
    lua.execute(read(os.path.join(HERE, "tests.lua")))
    passed = g.TEST_RESULT["passed"]
    missing = sorted(str(k) for k in g.Mock.missingGlobals.keys())
    mocked = []
    for namespace in ("C_ClassColor", "C_AddOns", "C_Item", "C_Spell", "C_TooltipInfo", "C_Texture", "C_Timer",
                      "C_ClassTalents", "C_Traits", "C_TradeSkillUI", "TooltipUtil", "ChatFrameUtil"):
        for func in g[namespace].keys():
            mocked.append(f"{namespace}.{func}")
    if report:
        print_report(lua, g.TEST_NS)
    return passed, missing, mocked


def print_report(lua, ns):
    """Druckt den Fahrplan einiger Specs (zum Gegenlesen)."""
    show = lua.eval("""function(ns, specKey, setup)
        local spec = ns.specByKey[specKey]
        local lines = {}
        for _, level in ipairs({ 10, 20, 30, 40, 50, 60 }) do
            local parts = {}
            for _, row in ipairs(ns:BuildRecommendations(spec, setup, level, false)) do
                local best = row.reco.best
                if best then parts[#parts + 1] = row.key .. "=" .. ns:ShortText(best.e) end
            end
            lines[#lines + 1] = ("  L%d: %s"):format(level, table.concat(parts, " | "))
        end
        return table.concat(lines, "\\n")
    end""")
    for spec, setup in (("HUNTER_SV", "DW"), ("HUNTER_BM", "2H"), ("SHAMAN_ENH", "2H"), ("SHAMAN_ELE", "1HS"),
                        ("WARRIOR_ARMS", "2H"), ("PRIEST_HOLY", "2H"), ("WARRIOR_PROT", "1HS"), ("DRUID_CAT", "2H")):
        print(f"\n{spec} ({setup})")
        print(show(ns, spec, setup))


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    dump = sys.argv[1]
    report = "--report" in sys.argv
    client_names = load_dump(dump)
    toplevel = {name.split(".")[0] for name in client_names}
    failed = False
    for locale in ("deDE", "enUS"):
        passed, missing, mocked = run(dump, locale, report and locale == "deDE")
        print(f"[{locale}] {passed} Prüfungen bestanden")
        unknown = [m for m in mocked if m not in client_names]
        for name in unknown:
            print(f"  WARNUNG: Mock bietet {name}, das es im Forever-Client nicht gibt")
        for name in missing:
            where = "im Client vorhanden, im Test nicht nachgebaut" if name in toplevel else "NICHT im Forever-Client (muss abgesichert sein)"
            print(f"  gelesene, fehlende globale Variable: {name}  ->  {where}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
