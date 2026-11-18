# FAQ

**Dans le widget du plugin, un avertissement rouge s'affiche sous « Forms » — pourquoi ?**
C'est voulu. Le widget du plugin Staffbase intègre les formulaires sous forme d'iframe à
hauteur fixe. Tant que ce widget est installé, il affiche cet avertissement et renvoie
vers « FormDisplay » — le formulaire doit être intégré directement à la page, dans MAN CI.

**Le widget affiche le message « The form could not be loaded » — pourquoi ?**
La plupart du temps, le formulaire n’est pas (ou plus) publié ou l’ID renvoie à une
installation supprimée. Ouvrez le formulaire dans l’application de formulaires et comparez l’ID avec la
configuration du widget.

**Les lecteurs voient « You have already submitted this form ».**
Il s’agit de la règle de réponse unique du formulaire, et non du widget. La
possibilité de réponses multiples est définie dans les paramètres de l’application de formulaires
.

**Pourquoi mon formulaire n’apparaît-il pas dans la liste ?**
La liste de la fenêtre « Sélectionner un formulaire » n’affiche que les formulaires pour lesquels
vous disposez de droits d’administration, et parmi ceux-ci, les 100 derniers modifiés. Dans les deux cas,
la section « Saisir l’ID manuellement » peut vous aider : saisissez-y l’adresse du formulaire ou
son ID.

**Aucune option n’est sélectionnée pour la densité ou la couleur d’accentuation – y a-t-il un problème ?**
Non. Le bloc provient d’une version antérieure, et la fenêtre n’a pas pu lire l’
ancien paramètre dans le Content Designer. Tant que vous n’avez pas sélectionné d’option,
le paramètre précédent du bloc reste inchangé.

**Puis-je envoyer quelque chose depuis l’aperçu de la fenêtre ?**
Non. L’aperçu affiche le formulaire réel, mais n’accepte aucune saisie ;
rien n’est envoyé.

**Tous les types de questions sont-ils pris en charge ?**
Saisie de texte, texte en paragraphe, date, liste de sélection, sélection simple et multiple
sont affichés nativement dans MAN CI. Un type de question inconnu du widget
apparaît sous forme de champ de texte afin que la question reste répondable ; le widget
ne prend actuellement pas en charge les téléchargements de fichiers.

**Dans quelle langue le formulaire s'affiche-t-il ?**
L'application de formulaire fournit déjà les questions dans la langue de la
personne qui les lit. Les éléments de commande du widget (soumission, messages d'erreur) sont
en anglais, comme dans le widget Événements.

**La réponse est-elle prise en compte dans l’évaluation normale ?**
Oui. Le widget envoie les données à la même application de formulaire ; les e-mails de notification, les webhooks et
la liste des réponses fonctionnent de la même manière que lorsque le formulaire est rempli dans la zone dédiée.
