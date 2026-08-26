# FAQ

**Une alerte rouge s'affiche dans le widget du plugin sous « Forms » — pourquoi ?**
C'est voulu. Le widget du plugin Staffbase intègre les formulaires sous forme d'iframe à
hauteur fixe. Tant que ce widget est installé, il affiche cet avertissement et renvoie
vers « FormDisplay » — le formulaire doit être placé directement sur la page, dans MAN CI.

**Le widget affiche le message « The form could not be loaded » — pourquoi ?**
Le plus souvent, le formulaire n’est pas (ou plus) publié, ou l’ID renvoie à une
installation supprimée. Ouvrez le formulaire dans l’application Formulaire et comparez l’ID avec la
configuration du widget.

**Les lecteurs voient « You have already submitted this form ».**
Il s’agit de la règle de réponse unique du formulaire, et non du widget. La
possibilité de réponses multiples est définie dans les paramètres de l’application de formulaires
.

**Pourquoi mon formulaire n’apparaît-il pas dans la liste de sélection ?**
La liste n’affiche que les formulaires pour lesquels vous disposez de droits d’administration et les 100 derniers
modifiés. Dans les deux cas, il suffit d’insérer l’adresse du formulaire dans
le champ prévu à cet effet.

**Tous les types de questions sont-ils pris en charge ?**
Saisie de texte, texte en paragraphe, date, liste de sélection, sélection simple et multiple
sont affichés de manière native dans MAN CI. Un type de question inconnu du widget
apparaît sous forme de champ de texte afin que la question reste répondable ; le widget
ne prend actuellement pas en charge les téléchargements de fichiers.

**Dans quelle langue le formulaire s'affiche-t-il ?**
L'application de formulaire fournit déjà les questions dans la langue de la
personne qui les lit. Les éléments de commande du widget (soumission, messages d'erreur) sont
en anglais, comme dans le widget Événements.

**La réponse est-elle prise en compte dans l’évaluation normale ?**
Oui. Le widget envoie les données à la même application de formulaire ; les e-mails de notification, les webhooks et
la liste des réponses fonctionnent de la même manière que lorsque le formulaire est rempli dans la zone dédiée.
