# Domande frequenti

**Nel widget del plugin compare un avviso rosso alla voce “Forms” — perché?**
È intenzionale. Il widget del plugin Staffbase incorpora i moduli come iframe con
altezza fissa. Finché questo widget è installato, visualizza l’avviso e rimanda
a “FormDisplay”: il modulo deve essere inserito direttamente nella pagina, nel MAN CI.

**Il widget segnala «The form could not be loaded» — perché?**
Nella maggior parte dei casi il modulo non è (più) pubblicato oppure l’ID rimanda a un’
installazione cancellata. Aprire il modulo nell’app dei moduli e confrontare l’ID con la
configurazione del widget.

**I lettori vedono «You have already submitted this form».**
Si tratta della regola di risposta singola del modulo, non del widget. Se
sono consentite risposte multiple, ciò viene specificato nelle impostazioni dell’app Moduli
.

**Perché il mio modulo non compare nell’elenco di selezione?**
L’elenco mostra solo i moduli con diritti di amministrazione e gli ultimi
100 modificati. In entrambi i casi, è utile inserire l’indirizzo del modulo nel
campo.

**Sono supportati tutti i tipi di domanda?**
Inserimento testo, testo a paragrafo, data, elenco di selezione, selezione singola e multipla
sono visualizzati in modo nativo in MAN CI. Un tipo di domanda sconosciuto al widget
appare come campo di testo, in modo che sia comunque possibile rispondere alla domanda; il widget attualmente
non supporta il caricamento di file.

**In quale lingua viene visualizzato il modulo?**
L’app del modulo fornisce già le domande nella lingua della persona che le legge.
Gli elementi di controllo del widget (Invia, messaggi di errore) sono
in inglese, come nel widget Eventi.

**La risposta viene conteggiata nella valutazione normale?**
Sì. Il widget invia i dati alla stessa app per i moduli; le e-mail ai destinatari, i webhook e
l’elenco delle risposte funzionano come quando si compila il modulo nell’area dedicata.
