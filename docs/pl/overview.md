# Wyświetlanie formularza

Funkcja wyświetlania formularza pozwala umieścić istniejący formularz Staffbase na
dowolnej stronie. Czytelnicy mogą go wypełnić i wysłać bezpośrednio z tej strony,
bez konieczności przechodzenia do sekcji formularzy — na przykład na stronie głównej,
stronie zespołu czy stronie akcji. Wyświetlany jest zgodnie z wytycznymi MAN CI: kwadratowe
pola, podświetlenie w kolorze antracytowym, kolor czerwony tylko dla przycisku wysyłania, oznaczenia pól obowiązkowych
i komunikaty o błędach.

## Co robi ten widget — a czego nie robi

**Wyświetla** formularz, który został już utworzony w aplikacji formularzy Staffbase.
**Nie tworzy** formularza ani **nie edytuje** pytań.
Pytania, odbiorcy i analiza pozostają w całości w aplikacji Formular;
widżet jest jedynie dodatkowym miejscem wyświetlania.

Wynika z tego, że najpierw należy utworzyć formularz w aplikacji Formular i
opublikować go, a dopiero potem wdrożyć widżet.

## Co widzą czytelnicy

- Pytania formularza w kolejności, w jakiej zostały utworzone,
  z oznaczeniem pól obowiązkowych i tekstami informacyjnymi.
- Sprawdzanie odbywa się dopiero po wysłaniu; następnie fokus przechodzi na pierwsze
  brakujące pole obowiązkowe. Stopka zlicza niezapełnione pola obowiązkowe.
- Po wysłaniu komunikat z podziękowaniem z aplikacji Formular zastępuje cały
  formularz.
- Osoby, które już udzieliły odpowiedzi i nie mogą odpowiadać ponownie, widzą zamiast
  formularza odpowiednią informację.
- Jeśli w aplikacji Formular włączona jest opcja „Allow users to view their previous submissions”
  , pojawia się przycisk „Your previous submissions”; osoby, które nie mogą już
  odpowiadać, widzą bezpośrednio swoje wcześniejsze odpowiedzi.

## Ważne informacje

- O tym, czy dana osoba może (ponownie) wysłać formularz, decyduje aplikacja formularzowa — widżet
  zwraca się do niej z zapytaniem i postępuje zgodnie z jej wskazówkami.
- Odpowiedzi są jak zwykle uwzględniane w analizie aplikacji formularzowej. Nie powstaje
  oddzielna analiza dla każdej strony.
- Pytania pojawiają się w języku, który aplikacja formularzowa rozpoznaje dla osoby
  czytającej; interfejs użytkownika widżetu jest w języku angielskim.
