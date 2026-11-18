# Domande frequenti

**Nel widget del plugin, alla voce “Forms” compare un avviso rosso: perché?**
È intenzionale. Il widget del plugin Staffbase incorpora i moduli come iframe con
altezza fissa. Finché questo widget è installato, visualizza lì l’avviso e rimanda
a «FormDisplay»: il modulo deve essere inserito direttamente nella pagina, nel MAN CI.

**Il widget segnala «The form could not be loaded»: perché?**
Nella maggior parte dei casi il modulo non è (più) pubblicato oppure l’ID rimanda a un’
installazione cancellata. Apri il modulo nell’app Moduli e confronta l’ID con la
configurazione del widget.

**I lettori vedono «You have already submitted this form».**
Si tratta della regola di risposta singola del modulo, non del widget. Se
sono consentite risposte multiple, ciò viene definito nelle impostazioni dell’app dei moduli
.

**Perché il mio modulo non compare nell’elenco?**
L’elenco nella finestra «Seleziona modulo» mostra solo i moduli con
diritti di amministrazione e, tra questi, gli ultimi 100 modificati. In entrambi i casi
è utile la sezione «Inserisci ID manualmente»: inserisci lì l’indirizzo del modulo o
l’ID.

**Per «Densità» o «Colore di risalto» non è selezionata alcuna opzione: c’è qualcosa che non funziona?**
No. Il blocco proviene da una versione precedente e la finestra non è riuscita a
leggere la vecchia impostazione nel Content Designer. Finché non selezioni un’opzione,
l’impostazione precedente del blocco rimane invariata.

**Posso inviare qualcosa nell’anteprima della finestra?**
No. L’anteprima mostra il modulo reale, ma non accetta inserimenti;
non viene inviato nulla.

**Sono supportati tutti i tipi di domanda?**
Inserimento di testo, testo a paragrafo, data, elenco di selezione, selezione singola e multipla
vengono visualizzati in modo nativo in MAN CI. Un tipo di domanda sconosciuto al widget
appare come campo di testo, in modo che sia comunque possibile rispondere alla domanda; al momento il widget
non supporta il caricamento di file.

**In quale lingua viene visualizzato il modulo?**
L’app del modulo fornisce già le domande nella lingua della persona che le legge.
Gli elementi di controllo del widget (Invia, messaggi di errore) sono
in inglese, come nel widget Eventi.

**La risposta viene conteggiata nella valutazione normale?**
Sì. Il widget invia i dati alla stessa app per i moduli; le e-mail ai destinatari, i webhook e
l’elenco delle risposte si comportano come quando si compila il modulo nell’area dedicata.
