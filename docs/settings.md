# Einstellungen

Alles wird im Fenster **„Formular wählen“** gepflegt, das sich mit dem
Konfigurationsdialog des Blocks öffnet. Links steht die Liste der Formulare,
in der Mitte das gewählte Formular und die Gestaltung. Oben im Kopf:
Übernehmen, Abbrechen, Rückgängig, Hilfe und der Umschalter
Editor · Desktop · Tablet · Mobil.

| Einstellung | Beschreibung |
| --- | --- |
| Formular | Das anzuzeigende Formular. Pflichtfeld – ohne Formular lässt sich nicht übernehmen. Wird links in der Liste gewählt; die Suche darüber findet Formulare nach Titel oder ID. |
| Akzentfarbe | Farbe für Absenden-Button, Pflichtmarke und Auswahl-Häkchen. Voreingestellt MAN Rot; alternativ Anthrazit oder Schwarz. |
| Dichte | Standard (40 px Feldhöhe) oder Kompakt (36 px) — für Seiten mit wenig Platz. |
| Pflichtmarke | Sternchen (`*`) oder ausgeschriebenes `(required)` hinter jedem Pflichtfeld. |

## Zur Liste der Formulare

Die Liste zeigt nur Formulare, die Sie selbst angelegt haben oder bearbeiten
dürfen (**Verwaltungsrechte**), und davon die zuletzt geänderten 100. Ein
fremdes Formular, das Sie einbetten dürfen, taucht dort also nicht auf. Dafür
gibt es unten im Fenster den Abschnitt **„ID von Hand eintragen“**: dort die
vollständige Formular-Adresse einfügen oder die 24-stellige Zeichenfolge an
deren Ende. Lädt die Liste nicht, klappt der Abschnitt von selbst auf.

## Vorschau

In Desktop, Tablet und Mobil zeigt das Fenster das echte Formular in der
jeweiligen Breite, mit dem Stand, den Sie gerade einstellen. Die Gestaltung
steht dann rechts daneben. Absenden, Zurücksetzen und „Your previous
submissions“ sind in der Vorschau gesperrt; es wird nichts gesendet.

## Blöcke aus älteren Fassungen

Bis 0.1.0-rc.3 standen Formular, Akzentfarbe, Dichte und Pflichtmarke als
einzelne Felder im Dialog. Seither speichert das Fenster alles in einem Feld
(`form-display-config`); die alten Felder sind ausgeblendet, ihre Werte
gelten aber weiter.

- Ein alter Block sieht unverändert aus, bis Sie im Fenster etwas ändern und
  übernehmen. Öffnen und Übernehmen ohne Änderung schreibt nichts.
- Das Fenster übernimmt beim Öffnen, was es aus den alten Feldern lesen kann.
  Auswahlfelder lassen sich im Content Designer nicht immer lesen; dann ist
  dort keine Option gewählt, und darunter steht **„Noch nicht gewählt – bis
  dahin gilt die bisherige Einstellung des Blocks.“** Der Block behält diese
  Einstellung, bis Sie eine Option wählen.
