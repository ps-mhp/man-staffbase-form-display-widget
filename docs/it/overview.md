# Visualizzazione delle forme

Il visualizzatore del modulo porta un modulo Staffbase esistente su un
qualsiasi pagina. I lettori possono compilarla e inviarla direttamente lì, 
senza passare all'area del modulo — ad esempio, nella home page, un
pagina della squadra o pagina azione. È visualizzata nel MAN CI: angular
Campi, focus in blu, solo rosso per il pulsante invia, marcatore di campo obbligatorio
e messaggi di errore. 

## Cosa fa — e cosa non fa il widget

**Visualizza** un modulo già disponibile nell'app Staffbase form
viene creato. Non **crea** un modulo e **non** modifica le domande. 
Domande, destinatari e valutazioni rimangono completamente nell'app del modulo; il
Il widget è solo una seconda posizione di output. 

Questo significa: prima crea il modulo nell'app form e
, poi inserisci il widget. 

## Cosa vedono i lettori

- Le domande della forma nell'ordine in cui sono state create, 
  con la marcatura obbligatoria dei campi e i testi informativi. 
- Il controllo viene effettuato solo durante l'invio; poi il focus passa al primo
  Manca il campo obbligatorio. Il piede di pagina conta i campi obbligatori aperti. 
- Una volta inviato, il messaggio di ringraziamento dell'app Forms sostituisce l'intero messaggio
  forma. 
- Se hai già risposto e non ti è permesso rispondere di nuovo, vedrai il
  forma. 
- È "Consentire agli utenti di visualizzare le proprie inviazioni precedenti" nell'app form 
  attivato, c'è un pulsante "I tuoi precedenti sottoscrivi"; se non sei più
  vede direttamente le sue risposte precedenti. 

## Importante da sapere

- Se qualcuno può inviare (di nuovo) è deciso dall'app form — il widget
  Chiede e la segue. 
- Le risposte vengono eseguite come di consueto nella valutazione dell'app di modulo. Viene creata
  Nessuna valutazione separata per pagina. 
- Le domande appaiono nella lingua che l'app del modulo utilizza per il lettore
  persona; l'interfaccia utente del widget è in inglese.