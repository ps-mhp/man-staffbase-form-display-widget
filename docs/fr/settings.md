# Paramètres

Tout est géré dans la fenêtre **« Sélectionner un formulaire »**, qui s'ouvre via la
boîte de dialogue de configuration du bloc. À gauche se trouve la liste des formulaires,
au centre, le formulaire sélectionné et sa mise en page. En haut, dans l'en-tête :
Appliquer, Annuler, Annuler la dernière action, Aide et le bouton de basculement
Éditeur · Ordinateur de bureau · Tablette · Mobile.

| Paramètre | Description |
| --- | --- |
| Formulaire | Le formulaire à afficher. Champ obligatoire – impossible de valider sans formulaire. À sélectionner à gauche dans la liste ; la recherche située au-dessus permet de trouver des formulaires par titre ou par ID. |
| Couleur d’accent | Couleur du bouton « Envoyer », de l’indicateur d’obligation et de la coche de sélection. Par défaut : rouge MAN ; alternatives : anthracite ou noir. |
| Densité | Standard (hauteur de champ de 40 px) ou Compact (36 px) — pour les pages disposant de peu d'espace. |
| Indicateur de champ obligatoire | Astérisque (`*`) ou mention `(required)` en toutes lettres après chaque champ obligatoire. |

## Vers la liste des formulaires

La liste n'affiche que les formulaires que vous avez créés vous-même ou que vous êtes autorisé à modifier
(**droits d'administration**), et parmi ceux-ci, les 100 derniers modifiés. Un
formulaire tiers que vous êtes autorisé à intégrer n'apparaîtra donc pas ici. Pour cela,
vous trouverez en bas de la fenêtre la section **« Saisir l’ID manuellement »** : saisissez-y l’
adresse complète du formulaire ou la chaîne de 24 caractères située à
sa fin. Si la liste ne se charge pas, la section s’ouvre automatiquement.

## Aperçu

Sur ordinateur, tablette et mobile, la fenêtre affiche le formulaire réel dans la
largeur correspondante, avec la mise en page que vous êtes en train de définir. La mise en page
apparaît alors à droite. Les boutons « Envoyer », « Réinitialiser » et « Vos soumissions précédentes »
sont désactivés dans l’aperçu ; rien n’est envoyé.

## Blocs issus des versions antérieures

Jusqu’à la version 0.1.0-rc.3, le formulaire, la couleur d’accentuation, la densité et le marqueur d’obligation figuraient comme
des champs distincts dans la boîte de dialogue. Depuis, la fenêtre enregistre tout dans un seul champ
(`form-display-config`) ; les anciens champs sont masqués, mais leurs valeurs
restent valables.

- Un ancien bloc semble inchangé jusqu’à ce que vous modifiiez quelque chose dans la fenêtre et que vous
  validiiez. Ouvrir et valider sans modification n’entraîne aucune modification.
- À l’ouverture, la fenêtre reprend ce qu’elle peut lire dans les anciens champs.
  Les listes déroulantes ne peuvent pas toujours être lues dans le Content Designer ; dans ce cas,
  aucune option n’est sélectionnée et la mention **« Pas encore sélectionné – jusqu’à
  lors, le paramètre précédent du bloc s’applique. »** apparaît en dessous. Le bloc conserve ce
  paramètre jusqu’à ce que vous sélectionniez une option.
