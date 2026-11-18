# Ustawienia

Wszystkie ustawienia wprowadza się w oknie **„Wybierz formularz”**, które otwiera się wraz z
oknem dialogowym konfiguracji bloku. Po lewej stronie znajduje się lista formularzy,
a pośrodku – wybrany formularz i jego układ. W górnej części:
Zastosuj, Anuluj, Cofnij, Pomoc oraz przełącznik
Edytor · Komputer stacjonarny · Tablet · Urządzenie mobilne.

| Ustawienie | Opis |
| --- | --- |
| Formularz | Formularz, który ma być wyświetlany. Pole obowiązkowe – bez formularza nie można zatwierdzić zmian. Wybiera się go po lewej stronie na liście; wyszukiwarka powyżej pozwala znaleźć formularze według tytułu lub identyfikatora. |
| Kolor akcentujący | Kolor przycisku „Wyślij”, oznaczenia pola obowiązkowego i zaznaczenia wyboru. Domyślnie MAN Czerwony; alternatywnie antracyt lub czerń. |
| Gęstość | Standardowa (wysokość pola 40 px) lub kompaktowa (36 px) — dla stron o ograniczonej przestrzeni. |
| Oznaczenie pola obowiązkowego | Gwiazdka (`*`) lub napis `(required)` za każdym polem obowiązkowym. |

## Lista formularzy

Lista wyświetla wyłącznie formularze, które sam utworzyłeś lub które możesz edytować
(**uprawnienia administracyjne**), a spośród nich 100 ostatnio zmienionych. Formularz
należący do kogoś innego, który możesz osadzić, nie pojawi się więc na tej liście. W tym celu
w dolnej części okna znajduje się sekcja **„Wprowadź ID ręcznie”**: należy tam
wpisać pełny adres formularza lub 24-znakowy ciąg znaków znajdujący się
na jego końcu. Jeśli lista się nie ładuje, sekcja ta otworzy się automatycznie.

## Podgląd

W wersjach na komputery stacjonarne, tablety i urządzenia mobilne okno wyświetla rzeczywisty formularz w
odpowiedniej szerokości, z ustawieniami, które właśnie wprowadzasz. Układ
jest wtedy widoczny po prawej stronie. Przyciski „Wyślij”, „Resetuj” i „Your previous
submissions” są zablokowane w podglądzie; nic nie zostanie wysłane.

## Bloki ze starszych wersji

Do wersji 0.1.0-rc.3 formularz, kolor akcentujący, gęstość i oznaczenie obowiązkowości były
wyświetlane jako osobne pola w oknie dialogowym. Od tego czasu okno zapisuje wszystko w jednym polu
(`form-display-config`); stare pola są ukryte, ale ich wartości
nadal obowiązują.

- Stary blok wygląda tak samo, dopóki nie wprowadzisz zmian w oknie i
  nie zatwierdzisz ich. Otwarcie i zatwierdzenie bez zmian nie powoduje zapisania żadnych zmian.
- Po otwarciu okno przejmuje wartości, które może odczytać ze starych pól.
  Pola wyboru nie zawsze mogą być odczytane w Content Designerze; w takim przypadku
  żadna opcja nie jest tam zaznaczona, a poniżej widnieje napis **„Jeszcze nie wybrano – do
  tego momentu obowiązuje dotychczasowe ustawienie bloku.”** Blok zachowuje to
  ustawienie, dopóki nie wybierzesz opcji.
