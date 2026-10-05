# FAQ

**Dans le widget du plugin, un avertissement rouge apparaît pour « Formulaires » — pourquoi ?** 
intention. Le widget du plugin Staffbase intègre les formulaires sous forme d’iframe avec fixé
hauteur. Tant que ce widget est installé, il y met en alerte et pointe vers
sur « FormDisplay » — le formulaire appartient directement à la page dans le CI MAN. 

**Le widget indique « Le formulaire n’a pas pu être chargé » — pourquoi ?** 
Dans la plupart des cas, le formulaire n’est pas (ou ne plus jamais) publié ou l’ID pointe vers un
installation supprimée. ouvre le formulaire dans l’application Formulaires et saisit l’ID avec le
Comparez la configuration des widgets. 

**Les lecteurs verront « Vous avez déjà soumis ce formulaire ».** 
C’est la règle de réponse unique du formulaire, pas le widget. Ou
plusieurs réponses sont autorisées dans les paramètres de l’application Formulaires
. 

**Pourquoi mon formulaire n’apparaît-il pas dans la liste déroulante ?** 
La liste ne montre que les formulaires avec droits administratifs et les plus récents
changé de 100. Dans les deux cas, insérer l’adresse du formulaire dans
Le terrain. 

**Tous les types de questions sont-ils pris en charge ?** 
Saisie de texte, texte de paragraphe, date, liste de sélection, sélection unique et multiple
sont affichés nativement dans le CI MAN. Un type de question inconnu du widget
apparaît sous forme de champ texte afin que la question reste répondable ; Téléchargement de fichiers
ne prend pas actuellement en charge ce widget. 

**Dans quelle langue apparaît la forme ?** 
L’application formulaire propose déjà les questions dans la langue du lecteur
Personne. Les contrôles du widget (soumission, messages d’erreur) sont
En anglais, comme dans le widget Événements. 

**La réponse compte-t-elle pour l’évaluation normale ?** 
Oui. Le widget est envoyé à la même application de formulaire ; les e-mails destinataires, webhooks, et
La liste des réponses se comporte comme lors du remplissage de la zone du formulaire.