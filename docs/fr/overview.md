# Affichage du formulaire

L'affichage du formulaire permet d'intégrer un formulaire Staffbase existant sur n'importe quelle
page. Les lecteurs peuvent le remplir et l'envoyer directement depuis cette page,
sans avoir à se rendre dans la section « Formulaires » — par exemple sur la page d'accueil, une
page d’équipe ou une page d’action. Il s’affiche selon les normes MAN CI : champs carrés,
surlignage en bleu, rouge uniquement pour le bouton d’envoi, indicateurs de champs obligatoires
et messages d’erreur.

## Ce que fait le widget — et ce qu’il ne fait pas

Il **affiche** un formulaire déjà créé dans l’application Formulaires de Staffbase.
Il **ne crée pas** de formulaire et **ne modifie pas** les questions.
Les questions, les destinataires et l’analyse restent entièrement dans l’application Formulaires ; le
widget n’est qu’un deuxième lieu d’affichage.

Il en résulte qu’il faut d’abord créer et
publier le formulaire dans l’application Formulaires, puis intégrer le widget.

## Ce que voient les lecteurs et lectrices

- Les questions du formulaire dans l’ordre dans lequel elles ont été créées,
  avec indication des champs obligatoires et des textes d’aide.
- La validation n’a lieu qu’au moment de l’envoi ; ensuite, le curseur se place sur le premier
  champ obligatoire manquant. Le pied de page indique le nombre de champs obligatoires non renseignés.
- Après l’envoi, le message de remerciement de l’application de formulaire remplace l’intégralité
  du formulaire.
- Les personnes ayant déjà répondu et qui ne sont pas autorisées à répondre à nouveau voient, à la place du
  formulaire, une mention correspondante.
- Si l’option « Allow users to view their previous submissions » est
  est activée, un bouton « Vos soumissions précédentes » apparaît ; les personnes qui ne sont plus
  autorisées à répondre peuvent consulter directement leurs réponses antérieures.

## À savoir

- C’est l’application de formulaire qui détermine si une personne est autorisée à envoyer (à nouveau) le formulaire — le widget
  lui demande cette information et s’y conforme.
- Les réponses sont intégrées comme d’habitude dans l’analyse de l’application de formulaire. Il n’y a
  pas d’analyse distincte par page.
- Les questions s’affichent dans la langue que l’application de formulaire détermine pour la
  personne qui les lit ; l’interface utilisateur du widget est en anglais.
