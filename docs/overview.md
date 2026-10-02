# Formular-Anzeige

Die Formular-Anzeige bringt ein bestehendes Staffbase-Formular auf eine
beliebige Seite. Leser:innen können es direkt dort ausfüllen und absenden,
ohne in den Formular-Bereich zu wechseln — etwa auf der Startseite, einer
Team-Seite oder einer Aktionsseite. Dargestellt wird es im MAN CI: eckige
Felder, Fokus in Blau, Rot nur für Absenden-Button, Pflichtfeld-Marker
und Fehlermeldungen.

## Was das Widget tut — und was nicht

Es **zeigt** ein Formular an, das bereits in der Staffbase-Formular-App
angelegt ist. Es **erstellt kein** Formular und **bearbeitet keine** Fragen.
Fragen, Empfänger und Auswertung bleiben vollständig in der Formular-App; das
Widget ist nur ein zweiter Ausgabeort.

Daraus folgt: Erst das Formular in der Formular-App anlegen und
veröffentlichen, dann das Widget einsetzen.

## Was Leser:innen sehen

- Die Fragen des Formulars in der Reihenfolge, in der sie angelegt wurden,
  mit Pflichtfeld-Markierung und Hinweistexten.
- Geprüft wird erst beim Absenden; danach springt der Fokus auf das erste
  fehlende Pflichtfeld. Die Fußzeile zählt offene Pflichtfelder mit.
- Nach dem Absenden ersetzt die Dankesnachricht der Formular-App das gesamte
  Formular.
- Wer bereits geantwortet hat und nicht erneut antworten darf, sieht statt des
  Formulars einen entsprechenden Hinweis.
- Ist in der Formular-App „Allow users to view their previous submissions"
  aktiviert, gibt es einen Button „Your previous submissions"; wer nicht mehr
  antworten darf, sieht seine früheren Antworten direkt.

## Wichtig zu wissen

- Ob jemand (erneut) absenden darf, entscheidet die Formular-App — das Widget
  fragt sie und richtet sich danach.
- Antworten laufen wie gewohnt in die Auswertung der Formular-App. Es entsteht
  keine getrennte Auswertung pro Seite.
- Die Fragen erscheinen in der Sprache, die die Formular-App für die lesende
  Person auflöst; die Bedienoberfläche des Widgets ist englisch.
