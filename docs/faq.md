# FAQ

**Im Plugin-Widget erscheint bei „Forms" eine rote Warnung — warum?**
Absicht. Das Staffbase-Plugin-Widget bettet Formulare als Iframe mit fester
Höhe ein. Solange dieses Widget installiert ist, warnt es dort und verweist
auf „FormDisplay" — das Formular gehört direkt auf die Seite, im MAN CI.

**Das Widget meldet „The form could not be loaded" — warum?**
Meist ist das Formular nicht (mehr) veröffentlicht oder die ID zeigt auf eine
gelöschte Installation. Formular in der Formular-App öffnen und die ID mit der
Widget-Konfiguration vergleichen.

**Leser:innen sehen „You have already submitted this form".**
Das ist die Einmal-Antworten-Regel des Formulars, nicht des Widgets. Ob
Mehrfach-Antworten erlaubt sind, wird in den Einstellungen der Formular-App
festgelegt.

**Warum erscheint mein Formular nicht in der Liste?**
Die Liste im Fenster „Formular wählen“ zeigt nur Formulare mit
Verwaltungsrechten und davon die zuletzt geänderten 100. In beiden Fällen
hilft der Abschnitt „ID von Hand eintragen“: dort die Formular-Adresse oder
die ID einfügen.

**Bei Dichte oder Akzentfarbe ist keine Option gewählt – ist etwas kaputt?**
Nein. Der Block stammt aus einer älteren Fassung, und das Fenster konnte die
alte Einstellung im Content Designer nicht lesen. Bis Sie eine Option wählen,
gilt die bisherige Einstellung des Blocks unverändert weiter.

**Kann ich in der Vorschau des Fensters etwas absenden?**
Nein. Die Vorschau zeigt das echte Formular, nimmt aber keine Eingaben an;
es wird nichts gesendet.

**Werden alle Fragetypen unterstützt?**
Texteingabe, Absatztext, Datum, Auswahlliste, Einfach- und Mehrfachauswahl
werden nativ im MAN CI dargestellt. Ein dem Widget unbekannter Fragetyp
erscheint als Textfeld, damit die Frage beantwortbar bleibt; Datei-Uploads
unterstützt das Widget derzeit nicht.

**In welcher Sprache erscheint das Formular?**
Die Fragen liefert die Formular-App bereits in der Sprache der lesenden
Person. Die Bedienelemente des Widgets (Submit, Fehlermeldungen) sind
englisch, wie im Events-Widget.

**Zählt die Antwort in die normale Auswertung?**
Ja. Das Widget sendet an dieselbe Formular-App; Empfänger-Mails, Webhooks und
die Antwortliste verhalten sich wie beim Ausfüllen im Formular-Bereich.
