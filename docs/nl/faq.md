# Veelgestelde vragen

**In de plug-in-widget verschijnt bij „Formulieren” een rode waarschuwing — waarom?**
Dat is de bedoeling. De Staffbase-plug-in-widget sluit formulieren in als iframe met een vaste
hoogte. Zolang deze widget is geïnstalleerd, geeft hij daar een waarschuwing weer en verwijst hij
naar „FormDisplay“ — het formulier hoort rechtstreeks op de pagina te staan, in MAN CI.

**De widget meldt „The form could not be loaded“ — waarom?**
Meestal is het formulier niet (meer) gepubliceerd of verwijst de ID naar een
verwijderde installatie. Open het formulier in de formulier-app en vergelijk de ID met de
widgetconfiguratie.

**Lezers zien „You have already submitted this form”.**
Dat is de regel voor éénmalige beantwoording van het formulier, niet van de widget. Of
meerdere antwoorden zijn toegestaan, wordt bepaald in de instellingen van de formulier-app
.

**Waarom verschijnt mijn formulier niet in de lijst?**
De lijst in het venster „Formulier selecteren“ toont alleen formulieren met
beheerdersrechten en daarvan de 100 meest recent gewijzigde. In beide gevallen
helpt het gedeelte „ID handmatig invoeren“: voer daar het formulieradres of
de ID in.

**Bij „Dichtheid“ of „Accentkleur“ is geen optie geselecteerd – is er iets kapot?**
Nee. Het blok is afkomstig uit een oudere versie en het venster kon de
oude instelling in de Content Designer niet lezen. Totdat u een optie selecteert,
blijft de huidige instelling van het blok ongewijzigd van kracht.

**Kan ik iets verzenden in het voorbeeldvenster?**
Nee. Het voorbeeld toont het echte formulier, maar accepteert geen invoer;
er wordt niets verzonden.

**Worden alle vraagtypes ondersteund?**
Tekstinvoer, alinea, datum, keuzelijst, enkele en meervoudige selectie
worden native weergegeven in MAN CI. Een vraagtype dat onbekend is voor de widget
verschijnt als tekstveld, zodat de vraag beantwoordbaar blijft; het uploaden van bestanden
wordt momenteel niet ondersteund door de widget.

**In welke taal wordt het formulier weergegeven?**
De vragen worden door de formulier-app al aangeboden in de taal van de
lezer. De bedieningselementen van de widget (Verzenden, foutmeldingen) zijn
in het Engels, net als in de Events-widget.

**Telt het antwoord mee voor de normale evaluatie?**
Ja. De widget verstuurt de gegevens naar dezelfde formulier-app; e-mails aan ontvangers, webhooks en
de antwoordlijst gedragen zich net als bij het invullen in het formuliergedeelte.
