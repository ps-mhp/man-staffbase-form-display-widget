# FAQ

**W widżecie wtyczki przy pozycji „Formularze” pojawia się czerwone ostrzeżenie — dlaczego?**
To zamierzone działanie. Widżet wtyczki Staffbase osadza formularze jako ramki iframe o stałej
wysokości. Dopóki ten widget jest zainstalowany, wyświetla tam ostrzeżenie i odsyła
do „FormDisplay” — formularz powinien znajdować się bezpośrednio na stronie, w MAN CI.

**Widget wyświetla komunikat „The form could not be loaded” — dlaczego?**
Najczęściej formularz nie jest (już) opublikowany lub identyfikator wskazuje na
usuniętą instalację. Otwórz formularz w aplikacji formularzy i porównaj identyfikator z
konfiguracją widżetu.

**Czytelnicy widzą komunikat „You have already submitted this form”.**
Jest to zasada jednokrotnego wypełniania formularza, a nie widżetu. To, czy
dozwolone jest wielokrotne wypełnianie, określa się w ustawieniach aplikacji formularzy
.

**Dlaczego mój formularz nie pojawia się na liście?**
Lista w oknie „Wybierz formularz” pokazuje tylko formularze z
uprawnieniami administracyjnymi, a spośród nich 100 ostatnio zmienionych. W obu przypadkach
pomocna jest sekcja „Wprowadź identyfikator ręcznie”: należy tam wpisać adres formularza lub
jego identyfikator.

**W przypadku opcji „Gęstość” lub „Kolor akcentujący” nie jest wybrana żadna opcja – czy coś nie działa?**
Nie. Blok pochodzi ze starszej wersji, a okno nie mogło odczytać
starego ustawienia w Content Designerze. Dopóki nie wybierzesz opcji,
dotychczasowe ustawienie bloku pozostaje niezmienione.

**Czy mogę wysłać coś w podglądzie okna?**
Nie. Podgląd pokazuje prawdziwy formularz, ale nie przyjmuje żadnych danych;
nic nie zostanie wysłane.

**Czy obsługiwane są wszystkie typy pytań?**
Wprowadzanie tekstu, tekst akapitowy, data, lista wyboru, wybór pojedynczy i wielokrotny
są wyświetlane natywnie w MAN CI. Typ pytania nieznany widżetowi
pojawia się jako pole tekstowe, aby można było na nie odpowiedzieć; widżet nie obsługuje obecnie
przesyłania plików.

**W jakim języku wyświetla się formularz?**
Aplikacja formularzowa dostarcza pytania już w języku osoby
czytającej. Elementy sterujące widżetu (przycisk „Wyślij”, komunikaty o błędach) są
w języku angielskim, tak jak w widżecie wydarzeń.

**Czy odpowiedź jest uwzględniana w standardowej analizie wyników?**
Tak. Widżet wysyła dane do tej samej aplikacji formularzowej; wiadomości e-mail do odbiorców, webhooki oraz
lista odpowiedzi działają tak samo, jak w przypadku wypełniania formularza w obszarze formularzy.
