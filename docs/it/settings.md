# Impostazioni

Tutto viene gestito nella finestra **“Seleziona modulo”**, che si apre con la
finestra di dialogo di configurazione del blocco. A sinistra si trova l’elenco dei moduli,
al centro il modulo selezionato e il layout. Nella parte superiore dell’intestazione:
Applica, Annulla, Indietro, Aiuto e il pulsante di commutazione
Editor · Desktop · Tablet · Mobile.

| Impostazione | Descrizione |
| --- | --- |
| Modulo | Il modulo da visualizzare. Campo obbligatorio – senza modulo non è possibile applicare le impostazioni. Va selezionato a sinistra nell’elenco; la funzione di ricerca in alto consente di trovare i moduli in base al titolo o all’ID. |
| Colore di risalto | Colore per il pulsante «Invia», l’indicatore di campo obbligatorio e il segno di spunta di selezione. Predefinito: MAN Rosso; in alternativa Antracite o Nero. |
| Densità | Standard (altezza campo 40 px) o Compatta (36 px) — per pagine con poco spazio. |
| Indicatore di campo obbligatorio | Asterisco (`*`) o testo completo `(required)` dopo ogni campo obbligatorio. |

## Elenco dei moduli

L'elenco mostra solo i moduli che avete creato voi stessi o che siete autorizzati a modificare
(**diritti di amministrazione**), e tra questi i 100 modificati più di recente. Un
modulo di terze parti che siete autorizzati a incorporare non compare quindi in questo elenco. A tal fine
è presente nella parte inferiore della finestra la sezione **«Inserisci ID manualmente»**: inserisci lì l’
indirizzo completo del modulo o la stringa di 24 caratteri che si trova
alla sua fine. Se l’elenco non si carica, la sezione si apre automaticamente.

## Anteprima

Su desktop, tablet e dispositivi mobili, la finestra mostra il modulo reale nella
larghezza corrispondente, con le impostazioni che state configurando. Il layout
è visualizzato a destra accanto al modulo. I pulsanti Invia, Reimposta e «Your previous
submissions» sono disabilitati nell’anteprima; non viene inviato nulla.

## Blocchi delle versioni precedenti

Fino alla versione 0.1.0-rc.3, «Modulo», «Colore di risalto», «Densità» e «Indicatore di obbligatorietà» erano presenti come
campi separati nella finestra di dialogo. Da allora, la finestra salva tutto in un unico campo
(`form-display-config`); i vecchi campi sono nascosti, ma i loro valori
continuano ad essere validi.

- Un vecchio blocco appare invariato finché non si apporta una modifica nella finestra e
  si applica. Aprire e applicare senza modifiche non comporta alcuna modifica.
- All’apertura, la finestra applica ciò che riesce a leggere dai vecchi campi.
  I campi di selezione non sono sempre leggibili nel Content Designer; in tal caso
  non viene selezionata alcuna opzione e sotto compare **«Non ancora selezionato – fino ad
  allora vale l’impostazione precedente del blocco.»** Il blocco mantiene questa
  impostazione finché non si seleziona un’opzione.
