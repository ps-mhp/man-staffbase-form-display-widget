# Instellingen

Alles wordt beheerd in het venster **„Formulier selecteren“**, dat wordt geopend via het
configuratievenster van het blok. Links staat de lijst met formulieren,
in het midden het geselecteerde formulier en de opmaak. Bovenaan in de koptekst:
Toepassen, Annuleren, Ongedaan maken, Help en de schakelaar
Editor · Desktop · Tablet · Mobiel.

| Instelling | Beschrijving |
| --- | --- |
| Formulier | Het weer te geven formulier. Verplicht veld – zonder formulier kan er niet worden opgeslagen. Wordt links in de lijst geselecteerd; de zoekfunctie erboven zoekt formulieren op titel of ID. |
| Accentkleur | Kleur voor de verzendknop, het vinkje bij verplichte velden en het selectievinkje. Standaard MAN Rood; alternatief antraciet of zwart. |
| Dichtheid | Standaard (40 px veldhoogte) of Compact (36 px) — voor pagina’s met weinig ruimte. |
| Verplicht-markering | Sterretje (`*`) of de volledige tekst `(required)` achter elk verplicht veld. |

## Naar de lijst met formulieren

De lijst toont alleen formulieren die u zelf hebt aangemaakt of die u mag bewerken
(**beheerdersrechten**), en daarvan de 100 meest recent gewijzigde. Een
formulier van iemand anders dat u mag insluiten, verschijnt daar dus niet. Daarvoor
is er onderaan het venster het gedeelte **„ID handmatig invoeren“**: voer daar het
volledige formulieradres in of de 24-cijferige tekenreeks aan
het einde daarvan. Als de lijst niet laadt, klapt het gedeelte vanzelf open.

## Voorbeeld

Op desktop, tablet en mobiel toont het venster het echte formulier in de
bijbehorende breedte, met de instellingen die u op dat moment aanpast. De opmaak
staat dan rechts ernaast. Verzenden, Resetten en „Your previous
submissions“ zijn in het voorbeeld uitgeschakeld; er wordt niets verzonden.

## Blokken uit oudere versies

Tot en met 0.1.0-rc.3 stonden Formulier, Accentkleur, Dichtheid en Verplicht-markering als
afzonderlijke velden in het dialoogvenster. Sindsdien slaat het venster alles op in één veld
(`form-display-config`); de oude velden zijn verborgen, maar hun waarden
blijven van kracht.

- Een oud blok ziet er ongewijzigd uit, totdat u iets in het venster wijzigt en
  de wijzigingen toepast. Openen en toepassen zonder wijzigingen leidt niet tot een wijziging.
- Het venster neemt bij het openen de gegevens over die het uit de oude velden kan lezen.
  Keuzevelden kunnen in de Content Designer niet altijd worden gelezen; in dat geval is
  daar geen optie geselecteerd en staat eronder **„Nog niet geselecteerd – tot
  dat moment geldt de huidige instelling van het blok.“** Het blok behoudt deze
  instelling totdat u een optie selecteert.
