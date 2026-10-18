# Verzauber-Berater für WoW Forever

Ein Add-on, das dir für **jede Klasse, jeden Spec und jedes Level von 10 bis 60** sagt, welche Verzauberung auf welches Ausrüstungsteil gehört.

> Dieser Ordner gehört nicht zur Tinnitus-Website. Er liegt nur auf dem Branch, damit nichts verloren geht. **Bitte nicht in `main` mergen.**

## Installation

1. `VerzauberBerater.zip` entpacken.
2. Den Ordner `VerzauberBerater` in den AddOns-Ordner deines Forever-Clients kopieren:
   - Beta: `World of Warcraft\_classic_beta_\Interface\AddOns\`. Manche Anleitungen nennen `_forever_beta_`; nimm den Ordner, den du in deinem WoW-Verzeichnis findest.
   - Am Ende muss es so aussehen: `...\Interface\AddOns\VerzauberBerater\VerzauberBerater.toc`
3. Spiel starten. Im Charakterbildschirm unter **AddOns** prüfen, ob der Verzauber-Berater angehakt ist.

Steht dort "veraltet", hat Blizzard die Interface-Nummer geändert (in der Beta ist sie `16001`). Du kannst dann entweder "Veraltete AddOns laden" anhaken oder im Spiel `/run print((select(4, GetBuildInfo())))` eingeben und die angezeigte Zahl in `VerzauberBerater.toc` hinter `## Interface:` eintragen.

## Bedienung

- `/vb` öffnet oder schließt das Fenster. Alternativ geht's über den Minimap-Button oder das Add-on-Menü an der Minimap.
- `/vb scan` öffnet direkt den Ausrüstungs-Check, `/vb plan` den Fahrplan.
- `/vb minimap` blendet den Minimap-Button ein oder aus, `/vb reset` setzt die Fensterposition zurück.

Oben wählst du **Klasse**, **Spec**, **Waffen-Setup** (Zweihand, zwei Einhandwaffen, Einhand + Schild, Einhand + Nebenhand) und schiebst den **Level-Regler** zwischen 10 und 60.

| Register | Was es macht |
|---|---|
| **Empfehlung** | Beste Verzauberung pro Slot für das gewählte Level, dazu eine Alternative und ab welchem Level das nächste Upgrade kommt. Die drei wichtigsten Slots sind mit einem Stern markiert. |
| **Fahrplan 10-60** | Alle Slots auf einen Blick für Level 10, 20, 30, 40, 50 und 60. Hell heißt: Hier lohnt sich ein Wechsel. |
| **Meine Ausrüstung** | Scannt, was du gerade trägst: was fehlt, was passt und was besser ginge. |
| **Einkaufsliste** | Die Verzauberungen, die dir fehlen, mit Materialien. Ein Klick bereitet eine fertige "Suche Verzauberer"-Nachricht im Chat vor. |
| **Alle Verzauberungen** | Die komplette Datenbank, filterbar nach Slot, mit Wert-Balken für deinen Spec. |
| **Info** | Hilfe und Optionen (Minimap-Button, Tooltip-Tipps, Komfort-Tipps, Level-Up-Ansagen). |

Außerdem zeigt das Add-on bei unverzauberten Gegenständen im Tooltip direkt einen Tipp an und meldet beim Level-Up, wenn eine neue Verzauberung sinnvoll wird.

## Auktionshaus

Sobald du das Auktionshaus öffnest, erscheint rechts daneben das Verzauber-Panel:

- **"Verzauber-Mats suchen (N)"** sucht alle Materialien, die dir noch fehlen. Mit [Auctionator](https://www.curseforge.com/wow/addons/auctionator) geht das in einem Rutsch im Einkaufs-Reiter. Ohne Auctionator sucht jeder Klick das nächste Material im normalen Auktionshaus.
- Die **Liste** zeigt jedes Material mit Menge. Was du schon in Taschen oder Bank hast, wird abgezogen. Ein Klick auf eine Zeile sucht genau dieses Material.
- Mit Auctionator gibt es eine **Preis-Schätzung** und einen Knopf, der die Einkaufsliste "Verzauber-Berater" samt Mengen in Auctionator anlegt.
- Welche Verzauberungen mitzählen, stellst du im Register **Einkaufsliste** ein: entweder nur, was dir laut Ausrüstungs-Scan fehlt, oder alles für die Auswahl oben. Einzelne Verzauberungen wählst du per Klick ab und wieder an.
- Das Panel lässt sich am kleinen Pfeil-Knopf verschieben. Rechtsklick auf den großen Knopf klappt es zu, `/vb ah` setzt die Position zurück.

Die Materialien liest das Add-on, wo möglich, direkt aus den Rezeptdaten deines Clients. Sonst nimmt es die Angaben aus der Datenbank.

## Woher die Daten kommen

- Werte und Rezepte stammen vom WoW-Forever-Beta-Stand 1.60.1 (Oktober 2026). Zusammengetragen sind sie aus Wowhead Forever, BlizzardWatch, Warcraft Tavern, Zockify, Icy Veins und weiteren Seiten.
- **Live-Abgleich:** Für die meisten Verzauberungen liest das Add-on Namen und Beschreibung direkt aus deinem Client. Ändert Blizzard einen Wert, übernimmt es die neue Zahl automatisch. Im Tooltip steht dann "Im Spiel geprüft".
- Einträge mit **?** sind Classic-Werte oder unsichere Forever-Angaben, die noch nicht bestätigt sind. **NEU** steht bei Verzauberungen, die es erst in Forever gibt.
- Die Gewichte pro Spec (wie viel z. B. 1 Stärke für einen Krieger wert ist) stehen in `Data/Classes.lua`, alle Verzauberungen in `Data/Enchants.lua`. Beides lässt sich leicht anpassen.

## Für Entwickler: Tests

`tools/test_addon.py` lädt das Add-on in eine strenge Nachbildung des Forever-Clients. Erlaubt ist dort nur, was laut API-Dump ([Ketho/BlizzardInterfaceResources](https://github.com/Ketho/BlizzardInterfaceResources), Branch `forever`) im Client existiert. Dann spielt es alle Klassen, Specs, Waffen-Setups und Levels durch, auf Deutsch und auf Englisch.

```
pip install lupa
git clone --depth 1 --branch forever https://github.com/Ketho/BlizzardInterfaceResources dump
python3 wow-addon/tools/test_addon.py dump/Resources --report
```
