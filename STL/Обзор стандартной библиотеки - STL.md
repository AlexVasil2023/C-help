
[[#Введение|Введение]] 9.1
[[#Компоненты стандартной библиотеки|Компоненты стандартной библиотеки]] 9.2
[[#Организация стандартной библиотеки|Организация стандартной библиотеки]] 9.3
1. [[#Пространства имён|Пространства имён]] 9.3.1
2. [[#Пространство имён ranges|Пространство имён ranges]] 9.3.2
3. [[#Модули|Модули]] 9.3.3
4. [[#Заголовочные файлы|Заголовочные файлы]] 9.3.4

# Введение

Ни одна серьёзная программа не написана на голом языке программирования. Во-первых, имеется набор уже существующих библиотек, которые формируют основу для дальнейшей разработки. Большинство программ утомительно писать на голом языке, тем более практически любая задача может быть упрощена с помощью хороших библиотек.

Спецификация стандартной библиотеки составляет более двух третей от стандарта ISO C++. Изучите её и используйте вместо самописных «велосипедов». Много умственного труда было вложено в разработку стандартной библиотеки, еще больше - в её реализацию, и много усилий будет затрачено на её обслуживание и расширение. Средства стандартной библиотеки, описанные в этой книге, являются частью каждой полной реализации C++. В дополнение к компонентам стандартной библиотеки, большинство реализаций предлагают системы “графического пользовательского интерфейса” (GUI), веб-интерфейсы, интерфейсы баз данных и т.д. Аналогичным образом, большинство сред разработки приложений предоставляют “базовые библиотеки” для корпоративных или промышленных “стандартных” сред разработки и/или выполнения. Помимо этого, существует не одна тысяча библиотек, поддерживающих специализированные области применения. Здесь я не описываю библиотеки, системы или среды, выходящие за рамки стандартной библиотеки. Цель состоит в том, чтобы предоставить самодостаточное описание C++, определённое в стандарте C++,2020, и сохранить переносимость примеров. Естественно, программисту рекомендуется изучить более обширные возможности, доступные в большинстве систем.

# Компоненты стандартной библиотеки

Средства, предоставляемые стандартной библиотекой, могут быть классифицированы следующим образом:
>
> Поддержка языком программирования времени выполнения (например, для аллокации, исключений и информации о типе во время выполнения RTTI)
> 
> Стандартная библиотека C (с очень незначительными изменениями, чтобы свести к минимуму нарушения системы типов).
> 
> Строки с поддержкой международных наборов символов, локализации и представления подстрок только для чтения ( #§10_2).
> 
> Поддержка регулярных выражений ( #§10_4).
> 
> Потоки ввода-вывода - это расширяемая платформа для ввода и вывода, в которую пользователи могут добавлять свои собственные типы, потоки, стратегии буферизации, локали и наборы символов ( #глава_11). Он также предлагает средства для гибкого форматирования выходных данных ( #§11_6_2).
> 
> Кроссплатформенная библиотека для управления файловыми системами ( #§11_9).
> 
> Базовый набор контейнеров (таких как [[vector|vector]] и [[map|map]]) и алгоритмов (таких как [[find|find()]], [[sort|sort()]] и [[merge|merge()]]). Этот набор, условно называемый STL, является расширяемым, поэтому пользователи могут добавлять свои собственные контейнеры и алгоритмы.
> 
> Диапазоны ( #§14_1), включая представления ( #§14_2), генераторы ( #§14_3) и конвейеры ( #§14_4).
> 
> [[Concepts|Концепты для основных типов и диапазонов]].
> 
> Поддержка числовых вычислений, таких как стандартные математические функции, комплексные числа, векторы с [[Классы#Арифметические типы|арифметическими операциями]], математические константы и генераторы случайных чисел ( #глава_16).
> 
> Поддержка параллельного программирования, включая потоки [[thread#std thread|thread]] и [[lock|блокировки lock]]. Поддержка параллелизма является основополагающей, так что пользователи могут добавлять поддержку новых моделей параллелизма в виде библиотек.
> 
> Синхронные и асинхронные сопрограммы ( #§18_6).
> 
> Параллельные версии большинства алгоритмов STL и некоторых численных алгоритмов, таких как [[sort#std sort|sort()]] и [[reduce|reduce()]].
> 
> Утилиты для поддержки метапрограммирования (например, функции типов; #§16_4), универсального программирования в стиле STL (например, [[pair|pair]]) и обобщённого программирования (например, [[variant|variant]] и [[optional|optional]]).
> 
> “Умные указатели” для управления ресурсами (например, [[unique_ptr|unique_ptr]] и [[shared_ptr|shared_ptr]].
> 
> Контейнеры специального назначения, такие как [[Array|array]], [[bitset|bitset]]  и [[tuple (Кортежи)|tuple (Кортежи)]].
> 
> Поддержка абсолютного времени и длительностей, например, [[Chrono#std chrono time_point (Моменты времени)]] и [[#std chro­no system_clock|system_clock]].
> 
> Поддержка календарей, например, [[month|month]] и [[time_zone|time_zone]].
> 
> Суффиксы для популярных единиц измерения, таких как ms для миллисекунд и i для мнимых чисел.
> 
> Способы манипулирования последовательностями элементов, такими как представления ( #§14_2), [[string_view|string_view]] и [[span|span]].

Основными критериями для включения класса в библиотеку были следующие:
>
> Он может быть полезен почти каждому программисту на C++ (как новичкам, так и экспертам).
> 
> Он мог бы быть предоставлен в общем виде, который не добавляет значительных накладных расходов по сравнению с более простой версией того же средства.
> 
> Простые способы использования должны быть легкими в освоении (относительно сложности, присущей им задачи).

По сути, стандартная библиотека C++ предоставляет наиболее распространенные фундаментальные структуры данных вместе с фундаментальными алгоритмами, используемыми в них.

# Организация стандартной библиотеки

Средства стандартной библиотеки размещены в пространстве имен std и доступны
пользователям через модули или заголовочные файлы.

## Пространства имён

Каждое средство стандартной библиотеки предоставляется через некоторый стандартный заголовочный файл. Например:
```c++
#include<string>
#include<list>
```

Эта запись делает доступными стандартные [[string|string]] и [[list|list]].

Стандартная библиотека определена в [[namespace#namespace (Пространства имён)|пространстве имен]], называемом `std`. Для использования средств стандартной библиотеки можно использовать префикс `std::`:
```c++
std::string sheep {"Four legs Good; two legs Baaad!"};
	std::list<std::string> slogans {"War is Peace", "Freedom is Slavery", 
									"Ignorance is Strength"};
```

Для краткости я редко использую префикс `std::` в примерах. Я также не включаю `#include` и не импортирую `import` необходимые заголовки или модули явно. Чтобы скомпилировать и запустить приведенные здесь фрагменты программы, вы должны сделать доступными соответствующие части стандартной библиотеки. Например:
```c++
#include<string> // make the standard string facilities accessible

using namespace std; // make std names available without std:: prefix

string s {"C++ is a general-purpose programming language"}; 
// OK: string is std::string
```

Как правило, это дурной тон - сбрасывать каждое имя из пространства имён в глобальное пространство имён. Однако в этой книге я использую исключительно стандартную библиотеку, и полезно знать, что она предлагает.

Стандартная библиотека предлагает несколько вложенных пространств имен для `std`, доступ к которым возможен только с помощью явного указания:
>
> [[Chrono|std::chrono]]: все удобства от `chrono`, включая [[Chrono#std literals chrono_literals|std::literals::chrono_literals]].
>
> [[Chrono#std literals chrono_literals|std::literals::chrono_literals]]: суффиксы обозначающие: `y` - годы, `d` - дни, `h` - часы, `min` - минуты, `ms` - миллисекунды, `ns` - наносекунды, `s` - секунды и `us` - микросекунды.
> 
> `std::literals::complex_literals`: суффиксы `i` для мнимых `double`, `if` для мнимых `float` и `il` для мнимых `long double`.
> 
> `std::literals::string_literals`: суффикс `s` для строк.
> 
> `std::literals::string_view_literals`: суффикс `sv` для строкового представления.
> 
> `std::numbers` для математических констант.
> 
> `std::pmr` для полиморфных ресурсов памяти.

Чтобы использовать суффикс из подпространства имен, мы должны ввести его в пространство имен, в котором мы хотим его использовать. Например:
```c++
// no mention of complex_literals
auto z1 = 2+3i; // error: no suffix 'i'
using namespace literals::complex_literals; // make the complex 
											// literals visible
auto z2 = 2+3i; // ok: z2 is a complex<double>
```
Не существует последовательной философии для того, что должно быть в подпространстве имен. Однако суффиксы не могут быть определены явно, поэтому мы можем ввести в область видимости только один набор суффиксов, не рискуя вызвать двусмысленности. Поэтому суффиксы для библиотеки, предназначенной для работы с другими библиотеками (которые могут определять свои собственные суффиксы), помещаются во вложенные пространства имен.

## Пространство имён ranges

Стандартная библиотека предлагает алгоритмы, такие как [[sort|sort()]] и [[copy|copy()]], в двух версиях:
>
> Традиционная версия последовательности, использующая пару итераторов; например, `sort(begin(v), v.end())`
> 
> Версия диапазона, использующая один диапазон; например, `sort(v)`

В идеале эти две версии должны прекрасно перегружаться без каких-либо особых усилий. Однако они этого не делают. Например:
```c++
using namespace std;
using namespace ranges;
void f(vector<int>& v)
{
	sort(v.begin(),v.end());      // error: ambiguous
	sort(v);                      // error: ambiguous
}
```

Для защиты от двусмысленностей при использовании традиционных неограниченных шаблонов стандарт требует, чтобы мы явно вводили версию диапазона алгоритма стандартной библиотеки в область видимости:
```c++
using namespace std;

void g(vector<int>& v)
{
	sort(v.begin(),v.end());           // OK
	sort(v);                           // error: no matching function (in std)
	ranges::sort(v);                   // OK
	
	using ranges::sort;                // sort(v) OK from here on
	sort(v);                           // OK
}
```

## Модули

Пока нет никаких модулей стандартной библиотеки. C++23, вероятно, исправит это упущение (вызванное нехваткой времени у комитета). На данный момент я использую `module std`, который, вероятно, станет стандартным, предлагая все возможности из `namespace std`. См. #Приложение_A.

## Заголовочные файлы

Вот подборка заголовков стандартной библиотеки, все из которых содержат объявления в пространстве имен `std`:

| `<algorithm>`     | [[copy\|copy()]], [[find\|find()]], [[sort\|sort()]]                                                                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<array>`         | [[Array\|Array]]                                                                                                                                                                   |
| `<chrono>`        | [[Chrono#std chrono duration\|duration]], [[Chrono#std chrono time_point (Моменты времени)\|time_point]], [[month\|month]], [[time_zone\|time_zone]]                               |
| `<cmath>`         | sqrt(), pow()                                                                                                                                                                      |
| `<complex>`       | [[complex\|complex]], sqrt(), pow()                                                                                                                                                |
| `<concepts>`      | [[Concepts#концепт floating_point\|floating_point]], [[Concepts#концепт copyable\|copyable]], [[Concepts#концепт predicate\|predicate]], [[Concepts#концепт invocable\|invocable]] |
| `<filesystem>`    | [[path#path\|path]]                                                                                                                                                                |
| `<format>`        | [[format#std format\|format]]                                                                                                                                                      |
| `<fstream>`       | [[fstream#fstream\|fstream]], [[fstream#ifstream\|ifstream]], [[fstream#ofstream\|ofstream]]                                                                                       |
| `<functional>`    | [[function#std function\|function]], [[greater_equal\|greater_equal]], [[hash\|hash]], [[range#range_value_t\|range_value_t]]                                                      |
| `<future>`        | [[future\|future]], [[promise\|promise]]                                                                                                                                           |
| `<ios>`           | hex, dec, scientific, fixed, defaultfloat                                                                                                                                          |
| `<iostream>`      | [[stream#std istream\|istream]], [[stream#std ostream\|ostream]], [[cin\|cin]], [[cout\|cout]]                                                                                     |
| `<map>`           | [[map#std map\|map]], [[multimap\|multimap]]                                                                                                                                       |
| `<memory>`        | [[unique_ptr\|unique_ptr]], [[shared_ptr\|shared_ptr]], [[allocator#std allocator\|allocator]]                                                                                     |
| `<random>`        | [[default_random_engine#default_random_engine\|default_random_engine]], [[normal_distribution#normal_distribution\|normal_distribution]]                                           |
| `<ranges>`        | sized_range, subrange, take(), split(), iterator_t                                                                                                                                 |
| `<regex>`         | regex, smatch                                                                                                                                                                      |
| `<string>`        | [[string#std string\|string]], [[string#basic_string\|basic_string]]                                                                                                               |
| `<string_view>`   | [[string_view#std string_view C++17\|string_view]]                                                                                                                                 |
| `<set>`           | [[set\|set]], [[multiset\|multiset]]                                                                                                                                               |
| `<sstream>`       | [[std/sstream#istringstream\|istringstream]], [[std/sstream#ostringstream\|ostringstream]]                                                                                                 |
| `<stdexcept>`     | length_error, out_of_range, runtime_error                                                                                                                                          |
| `<tuple>`         | [[tuple (Кортежи)#std tuple\|tuple]], get<>(), [[tuple (Кортежи)#std tuple_size\|tuple_size<>]]                                                                                                        |
| `<thread>`        | [[thread\|thread]]                                                                                                                                                                 |
| `<unordered_map>` | [[unordered_map#std unordered_map\|unordered_map]], [[unordered_multimap#unordered_multimap\|unordered_multimap]]                                                                  |
| `<utility>`       | [[move\|move()]], [[swap\|swap()]], [[pair\|pair]]                                                                                                                                 |
| `<variant>`       | [[variant#std variant C++17\|variant]]                                                                                                                                             |
| `<vector>`        | [[vector#std vector\|vector]]                                                                                                                                                      |

Этот список далеко не полный.

Заголовки из стандартной библиотеки C, такие как `<stdlib.h>`, тоже поддерживаются. Для каждого такого заголовка также существует версия с префиксом `c` в названии и удаленным `.h`. Эта версия, такая как `<cstdlib>`, помещает свои объявления как в `std`, так и в глобальное пространство имен.

Заголовки отражают историю разработки стандартной библиотеки. Следовательно, они не всегда так логичны и легки для запоминания, как хотелось бы. Это одна из причин использовать вместо этого модуль, такой как std.
