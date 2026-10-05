# Affichage de formulaires

Le visualiseur de formulaire amène un formulaire existant de la Staffbase vers un
n’importe quelle page. Les lecteurs peuvent la remplir et l’envoyer directement là-bas, 
sans passer à la zone de formulaire — par exemple, sur la page d’accueil, un
page d’équipe ou page d’action. Elle est affichée dans le CI MAN : angular
Champs, focus en bleu, rouge seulement pour le bouton d’envoi, marqueur de champ obligatoire
et des messages d’erreur. 

## Ce que le widget fait — et ne fait pas

Il **affiche** un formulaire déjà disponible dans l’application Staffbase
est créé. Il ne crée **pas** de formulaire et **ne** modifie pas les questions. 
Les questions, les destinataires et l’évaluation restent entièrement dans l’application de formulaire ; le
Widget n’est qu’un second emplacement de sortie. 

Cela signifie : D’abord créer le formulaire dans l’application formulaire et
, puis insérer le widget. 

## Ce que voient les lecteurs

- Les questions de la forme dans l’ordre dans lequel elles ont été créées, 
  avec des marquages de champs obligatoires et des textes d’information. 
- La vérification n’est effectuée qu’à l’envoi ; puis la mise au point passe au premier
  Champ obligatoire manquant. Le pied de pied compte les champs obligatoires ouverts. 
- Une fois soumis, le message de remerciement de l’application Forms remplace l’intégralité
  forme. 
- Si vous avez déjà répondu et que vous n’êtes pas autorisé à répondre à nouveau, vous verrez le
  forme. 
- Est-ce que « Permettre aux utilisateurs de voir leurs soumissions précédentes » dans l’application de formulaires 
  activé, il y a un bouton « Vos soumissions précédentes » ; si vous n’êtes plus activé
  voit directement ses réponses précédentes. 

## Important à savoir

- Le fait que quelqu’un soit autorisé à soumettre (à nouveau) est décidé par l’application de formulaire — le widget
  demande-t-elle et la suit. 
- Les réponses s’exécutent comme d’habitude dans l’évaluation de l’application de formulaire. Elle est créée
  Pas d’évaluation séparée par page. 
- Les questions apparaissent dans la langue utilisée par l’application de formulaires pour le lecteur
  personne ; l’interface utilisateur du widget est en anglais.