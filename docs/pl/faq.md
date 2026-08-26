# FAQ

**W widżecie wtyczki przy pozycji „Formularze” pojawia się czerwone ostrzeżenie — dlaczego?**
To zamierzone działanie. Widżet wtyczki Staffbase osadza formularze jako ramki iframe o stałej
wysokości. Dopóki ten widżet jest zainstalowany, wyświetla tam ostrzeżenie i odsyła
do „FormDisplay” — formularz powinien znajdować się bezpośrednio na stronie w MAN CI.

**Widżet wyświetla komunikat „The form could not be loaded” — dlaczego?**
Najczęściej formularz nie jest (już) opublikowany lub identyfikator (ID) odnosi się do
usuniętej instalacji. Otwórz formularz w aplikacji formularzy i porównaj identyfikator z
konfiguracją widżetu.

**Czytelnicy widzą komunikat „You have already submitted this form”.**
Jest to zasada jednokrotnego wypełniania formularza, a nie widżetu. To, czy
dozwolone są wielokrotne wypełnienia, określa się w ustawieniach aplikacji formularzy.
**

**Dlaczego mój formularz nie pojawia się na liście wyboru?**
Lista wyświetla tylko formularze z uprawnieniami administracyjnymi oraz ostatnio
zmienione 100. W obu przypadkach pomocne jest wklejenie adresu formularza do
odpowiedniego pola.

**Czy obsługiwane są wszystkie typy pytań?**
Wprowadzanie tekstu, tekst akapitowy, data, lista wyboru, wybór pojedynczy i wielokrotny
są wyświetlane natywnie w MAN CI. Typ pytania nieznany widżetowi
pojawia się jako pole tekstowe, aby można było na nie odpowiedzieć; przesyłanie plików
nie jest obecnie obsługiwane przez widżet.

**W jakim języku wyświetla się formularz?**
Aplikacja formularza dostarcza pytania już w języku osoby
czytającej. Elementy sterujące widżetu (przycisk „Wyślij”, komunikaty o błędach) są
w języku angielskim, tak jak w widżecie wydarzeń.

**Czy odpowiedź jest uwzględniana w standardowej analizie wyników?**
Tak. Widżet wysyła dane do tej samej aplikacji formularzowej; wiadomości e-mail do odbiorców, webhooki oraz
lista odpowiedzi działają tak samo, jak w przypadku wypełniania formularza w obszarze formularzy.
