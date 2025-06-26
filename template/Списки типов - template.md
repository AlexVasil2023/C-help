
[[#Списки типов|Списки типов]] 24
1. [[#Анатомия списков типов|Анатомия списков типов]] 24.1
2. [[#Алгоритмы над списками типов|Алгоритмы над списками типов]] 24.2
	1. [[#Индексация|Индексация]] 24.2.1
	2. [[#Поиск наилучшего соответствия|Поиск наилучшего соответствия]] 24.2.2
	3. [[#Добавление в список типов|Добавление в список типов]] 24.2.3
	4. [[#Обращение порядка типов в списке|Обращение порядка типов в списке]] 24.2.4
	5. [[#Преобразование списка типов|Преобразование списка типов]] 24.2.5
	6. [[#Накопление списков типов|Накопление списков типов]] 24.2.6
	7. [[#Сортировка вставками|Сортировка вставками]] 24.2.7
3. [[#Списки нетиповых параметров|Списки нетиповых параметров]] 24.3



# Списки типов

Эффективное программирование обычно требует использования различных структур данных, и метапрограммирование в этом смысле ничем не отличается. Для метапрограммирования типов центральной структурой данных является список типов ([[typelist|typelist]]), который, как следует из его имени, представляет собой список, содержащий типы. Шаблонные метапрограммы могут работать с этими списками типов, в конечном итоге производя часть выполнимой программы. В этой главе мы обсуждаем методы работы со списками типов. Поскольку большинство операций, связанных со списками типов, используются в шаблонном метапрограммировании, мы рекомендуем вам сначала познакомиться с [[Метапрограммирование|метапрограммированием]].

# Анатомия списков типов

Список типов — это тип, который содержит типы и с которым может работать шаблонная метапрограмма. Он обеспечивает операции, обычно предоставляемые списками: перебор элементов (типов), содержащихся в списке, добавление или удаление элементов. Однако списки типов отличаются от большинства схожих структур данных времени выполнения, таких как [[list|std::list]], тем, что они не допускают изменения. Например, добавление элемента к [[list|std::list]] изменяет сам список, и эти изменения можно наблюдать в любой другой части программы, которая имеет доступ к данному списку. Добавление же элемента в список типов не изменяет исходный тип: вместо этого добавление элемента в существующий список создает новый тип, не изменяя оригинал. Читатели, знакомые с языками функционального программирования, такими как `Scheme`, `ML` и `Haskell`, скорее всего, увидят параллели между работой со списками типов в C++ и списками на этих языках.

Список типов обычно реализуется как специализация шаблона класса, который кодирует содержимое списка типов (т.е. содержащиеся в нем типы и их порядок) в аргументах его шаблона. Непосредственная реализация списка типов кодирует элементы в пакет параметров:
```c++
template<typename... Elements>
class Typelist
{
};
```

Элементы [[typelist|Typelist]] записываются непосредственно как его аргументы шаблона. Пустой список типов записывается как `Typelist<>`, список, содержащий только `int`, записывается как `Typelist<int>`, и так далее. Вот список типов, содержащий знаковые целочисленные типы:
```c++
using SignedlntegralTypes =
	Typelist<signed char, short, int, long, long long>;
```

Работа с таким списком типов обычно требует разделения списка на части, как правило, путем отделения первого элемента списка (головы списка) от остальных элементов в списке (хвоста). Например, метафункция `Front` извлекает первый элемент из списка типов:
```c++
template<typename List>
class FrontT;

template<typename Head, typename... Tail>
class FrontT<Typelist<Head, Tail...>>
{
	public:
		using Type = Head;
};

template<typename List>
using Front = typename FrontT<List>::Type;
```

Таким образом, `FrontT<SignedIntegralTypes>::Type` (более лаконично записываемый как `Front<SignedIntegralTypes>`) производит `signed char`. Аналогично, метафункция `PopFront` удаляет первый элемент из списка типов. Ее реализация делит элементы списка типов на голову и хвост, а затем формирует новую специализацию `Typelist` из элементов хвоста.
```c++
template<typename List>
class PopFrontT;

template<typename Head, typename... Tail>
class PopFrontT<Typelist<Head, Tail...>> 
{
	public:
		using Type = Typelist<Tail...>;
};

template<typename List>
using PopFront = typename PopFrontT<List>::Type;
```

`PopFront<SignedIntegralTypes>` производит список типов:
```c++
Typelist<short, int, long, long long>
```

Можно также вставлять элементы в начало списка типов путем захвата всех существующих элементов в пакет параметров шаблона с последующим созданием новой специализации `Typelist`, содержащей все элементы:
```c++
template<typename List, typename NewElement>
class PushFrontT;

template<typename... Elements, typename NewElement>
class PushFrontT<Typelist<Elements...>, NewElement>
{
	public:
		using Type = Typelist<NewElement, Elements...>;
};

template<typename List, typename NewElement>
using PushFront = typename PushFrontT<List, NewElement>::Type;
```

Как можно ожидать,
```c++
PushFront<SignedIntegralTypes, bool>
```

дает
```c++
Typelist<bool, signed char, short, int, long, long long>
```

# Алгоритмы над списками типов

Фундаментальные операции над списками типов `Front`, `PopFront` и `PushFront` могут быть объединены для более интересных действий со списками типов. Например, можно заменить первый элемент списка типа путем применения `PushFront` к результату `PopFront`:
```c++
using Type = PushFront<PopFront<SignedIntegralTypes>, bool>;
// Эквивалентно Typelist<bool, short, int, long, long long>
```

Идя дальше, мы можем реализовать алгоритмы — поиска, преобразования, обращения — как шаблонные метафункции, работающие со списками типов.

## Индексация

Одна из наиболее фундаментальных операций над списком типов должна извлекать определенный элемент из списка. [[Списки типов - template#Анатомия списков типов|Показано, как реализовать операцию, которая извлекает первый элемент]]. Здесь мы обобщим эту операцию для извлечения N-гo элемента. Например, чтобы извлечь тип с индексом 2 из данного списка типов, можно написать:
```c++
using TL = NthElement<Typelist<short, int, long>, 2>;
```

что делает `TL` псевдонимом для `long`. Операция `NthElement` реализуется рекурсивной метапрограммой, которая проходит по списку до тех пор, пока не найдет запрашиваемый элемент:
```c++
// Рекурсивный случай:
template<typename List, unsigned N>
class NthElementT : public NthElementT < PopFront<List>, N-1 >
{
};

// Базовый случай:
template<typename List>
class NthElementT<List, 0> : public FrontT<List>
{
};

template<typename List, unsigned N>
using NthElement = typename NthElementT<List, N>::Type;
```

Сначала рассмотрим базовый случай, обрабатываемый частичной специализацией, для случая, когда `N` равно `0`. Данная специализация завершает рекурсию, предоставляя элемент из начала списка. Это делается путем открытого (`public`) наследования от `FrontT<List>`, который (косвенно) обеспечивает псевдоним типа `Туре`, представляющий первый элемент этого списка, а следовательно, и результат метафункции `NthElement`, с использованием [[Реализация свойств типов#Преобразующие свойства|метафункциональной передачи]].

Рекурсивный случай, который является также определением первичного шаблона, проходит по списку. Поскольку частичная специализация гарантирует, что `N > 0`, в рекурсивном случае из списка удаляется первый элемент и запрашивается (`N-1`)-й элемент из оставшихся в списке. В нашем примере
```c++
NthElementT<Typelist<short, int, long>, 2>
```

наследуется от
```c++
NthElementT<Typelist<int, long>, 1>
```

который наследуется от
```c++
NthElementT<Typelist<long>, 0>
```

Здесь мы достигаем базового случая, и наследование от `FrontT<Typelist<long>>` предоставляет окончательный результат через вложенный тип `Туре`.

## Поиск наилучшего соответствия

Многие алгоритмы над списками типов выполняют поиск данных в этих списках. Например, может потребоваться найти наибольший из содержащихся в списке типов (скажем, для выделения достаточного количества памяти для любого из имеющихся типов). Такой поиск также может быть выполнен с помощью рекурсивной шаблонной метапрограммы:
```c++
template<typename List>
class LargestTypeT;

// Рекурсивный случай:
template<typename List>
class LargestTypeT
{
	private:
		using First = Front<List>;
		using Rest = typename LargestTypeT<PopFront<List>>::Type;

	public:
		using Type = IfThenElse<(sizeof(First)>=sizeof(Rest)),First,Rest>;
};

// Базовый случай:
template<>
class LargestTypeT<Typelist<>>
{
	public:
		using Type = char;
};

template<typename List>
using LargestType = typename LargestTypeT<List>::Type;
```

Алгоритм `LargestType` вернет первый из наибольших типов в списке. Например, для списка `Typelist<bool, int, long, short>` этот алгоритм вернет первый тип, имеющий тот же размер, что и тип `long`, — которым может быть `int` или `long`, в зависимости от вашей платформы.

Первичный шаблон для `LargestTypeT` использует распространенную идиому первый/осталъные, которая состоит из трех этапов. На первом этапе вычисляется частичный результат на основе первого элемента, который в данном случае является передним элементом списка, и помещается в первую `First`. Далее выполняется рекурсия для вычисления результата для остальных элементов в списке, и этот результат помещается в `Rest`. Например, для списка типов `Typelist<bool, int, long, short>` на первом этапе рекурсии `First` представляет собой `bool`, в то время как `Rest` является результатом применения алгоритма к `Typelist<int, long, short>`. Наконец, третий этап объединяет результаты `First` и `Rest` для получения решения. Здесь IfThenElse выбирает больший элемент из первого элемента в списке `First`, или лучшего из кандидатов в `Rest`, и возвращает победителя. Оператор `>=` разрешает неопределенность равных элементов в пользу элемента, который в исходном списке находится раньше.

Рекурсия прекращается, когда список пуст. По умолчанию мы используем `char` как тип-страж для инициализации алгоритма, потому что любой тип имеет размер не меньше, чем у `char`.

Обратите внимание на то, что в базовом случае явно упоминается пустой список типов `Typelist<>`. Это не совсем неудачно, так как мешает применению других форм списков типов, к которым мы вернемся в последующих разделах (включая #разделы_24_3, #24_5 и #главу_25, “Кортежи”). Для решения этой проблемы мы вводим метафункцию `IsEmpty`, которая определяет, не является ли данный список типов пустым:
```c++
template<typename List>
class IsEmpty
{
	public:
		static constexpr bool value = false;
};

template<>
class IsEmpty<Typelist<>>
{
	public:
		static constexpr bool value = true;
};
```

Используя `IsEmpty`, мы можем реализовать `LargestType` так, что он будет одинаково хорошо работать для любого списка типов, который реализует `Front`, `PopFront` и `IsEmpty`, как показано ниже:
```c++
template<typename List, bool Empty = IsEmpty<List>::value>
class LargestTypeT;

// Рекурсивный случай:
template<typename List>
class LargestTypeT<List, false>
{
	private:
		using Contender = Front<List>;
		using Best = typename LargestTypeT<PopFront<List>>::Type;
	
	public:
		using Type = IfThenElse<(sizeof(Contender)>=sizeof(Best) ),
								Contender, Best>;
};

// Базовый случай:
template<typename List>
class LargestTypeT<List, true>
{
	public:
		using Type = char;
};

template<typename List>
using LargestType = typename LargestTypeT<List>::Type;
```

Имеющий значение по умолчанию второй параметр шаблона `LargestTypeT`, `Empty`, проверяет, пуст ли список. Если нет, в рекурсивном случае (у которого этот аргумент равен `false`) продолжается исследование списка. В противном случае базовый случай (для которого этот аргумент имеет значение `true`) прекращает рекурсию и обеспечивает исходный результат (`char`).

## Добавление в список типов

Примитивная операция `PushFront` позволяет нам добавить новый элемент в начало списка типов, производя новый список. Предположим, что вместо этого мы хотим добавить новый элемент в конец списка, как мы часто поступаем с такими контейнерами, как [[list|std::list]] и [[vector|std::vector]], во время выполнения, чтобы получить операцию `PushBack`. Для нашего шаблона `Typelist` требуется только небольшая [[Списки типов - template#Анатомия списков типов|модификация реализации `PushFront`]]:
```c++
template<typename List, typename NewElement>
class PushBackT;

template<typename... Elements, typename NewElement>
class PushBackT<Typelist<Elements...>, NewElement>
{
	public:
		using Type = Typelist<Elements..., NewElement>;
};

template<typename List, typename NewElement>
using PushBack = typename PushBackT<List, NewElement>::Type;
```

Однако, как и в случае алгоритма `LargestType`, мы можем реализовать общий алгоритм `PushBack`, который использует только примитивные операции `Front`, `PushFront`, `PopFront` и `IsEmpty`:
```c++
template<typename List, typename NewElement, bool = IsEmpty<List>::value>
class PushBackRecT;

// Рекурсивный случай:
template<typename List, typename NewElement>
class PushBackRecT<List, NewElement, false>
{
	using Head = Front<List>;
	using Tail = PopFront<List>;
	using NewTail = typename PushBackRecT<Tail, NewElement>::Type;

	public:
		using Type = PushFront<Head, NewTail>;
};

// Базовый случай:
template<typename List, typename NewElement>
class PushBackRecT<List, NewElement, true>
{
	public:
		using Type = PushFront<List, NewElement>;
};

// Обобщенная операция PushBack:
template<typename List, typename NewElement>
class PushBackT : public PushBackRecT<List, NewElement> { };

template<typename List, typename NewElement>
using PushBack = typename PushBackT<List, NewElement>::Type;
```

Шаблон `PushBackRecT` управляет рекурсией. В базовом случае мы используем `PushFront` для добавления `NewElement` в пустой список, поскольку для пустого списка `PushFront` эквивалентен `PushBack`. Рекурсивный случай гораздо более интересен: он разбивает список на первый элемент (`Head`) и список типов, содержащий остальные элементы (`Tail`). Затем новый элемент добавляется к `Tail`, рекурсивно производя `NewTail`. Затем мы снова используем `PushFront`, чтобы добавить `Head` в начало списка `NewTail` для формирования окончательного списка.

Давайте раскроем рекурсию для простого примера:
```c++
PushBackRecT<Typelist<short, int>, long>
```

На первом этапе `Head` представляет собой `short`, a `Tail` — `Typelist<int>`. Мы рекурсивно переходим к
```c++
PushBackRecT<Typelist<int>, long>
```

где `Head` представляет собой `int`, a `Tail` — `Typelist<>`.
Еще один шаг рекурсии состоит в вычислении
```c++
PushBackRecT<Typelist<>, long>
```

что представляет собой базовый случай, и возвращает `PushFront<Typelist<>, long>`. Эта конструкция вычисляется как `Typelist<long>`. Затем рекурсия сворачивается, внося предыдущий `Head` в начало списка:
```c++
PushFront<int, Typelist<long>>
```

Так получается `Typelist<int, long>`. Дальнейшее сворачивание рекурсии приводит к внесению первого (внешнего) `Head` (`short`) в список:
```c++
PushFront<short, Typelist<int, long>>
```

Так получается окончательный результат:
```c++
Typelist<short, int, long>
```

Обобщенная реализация `PushBackRecT` работает со списками типов любых разновидностей подобно предыдущим алгоритмам, разработанным в этом разделе. Для вычисления ей требуется линейное количество инстанцирований шаблонов, поскольку для списка типов длины `N` будет выполняться `N+1` инстанцирований `PushBackRecT` и `PushFrontT`, а также `N` инстанцирований `FrontT` и `PopFrontT`. Подсчет количества инстанцирований шаблонов может дать грубую оценку времени, которое потребуется для компиляции конкретной метапрограммы, потому что инстанцирование шаблона само по себе является довольно сложным процессом для компилятора.

Время компиляции может оказаться проблемой для больших шаблонных метапрограмм, поэтому имеет смысл попытаться уменьшить количество инстанцирований шаблонов, выполняемых этими алгоритмами. В действительности наша первая реализация `PushBack` с использованием частичной специализации `Typelist` требует только константного количества инстанцирований шаблонов, что делает его гораздо более эффективным (во время компиляции), чем обобщенная версия. Кроме того, будучи описанной как частичная специализация `PushBackT`, эта эффективная реализация будет автоматически выбрана при применении `PushBack` к экземпляру `Typelist`, перенося понятие [[Перегрузка свойств типов#Специализация алгоритма|специализации алгоритма]] на шаблонные метапрограммы. Многие из способов, представленных в этом разделе, могут быть применены к шаблонным метапрограммам для уменьшения количества инстанцирований шаблонов, выполняемых алгоритмом.

## Обращение порядка типов в списке

Когда списки типов содержат элементы в некотором порядке, удобно иметь возможность изменить порядок элементов в списке с помощью некоторого алгоритма. Например, [[Списки типов - template#Анатомия списков типов|список `SignedlntegralTypes`]], содержит типы в порядке увеличения их целочисленного ранга. Однако может быть более полезным обратить этот список для получения списка `Typelist<long long, long, int, short, signed char>`. Алгоритм `Reverse` реализуется следующей метафункцией:
```c++
template<typename List, bool Empty = IsEmpty<List>::value>
class ReverseT;

template<typename List>
using Reverse = typename ReverseT<List>::Type;

// Рекурсивный случай:
template<typename List>
class ReverseT<List, false>
	: public PushBackT<Reverse<PopFront<List>>, FrontcList>> 
{  };

// Базовый случай:
template<typename List>
class ReverseT<List, true>
{
	public:
		using Type = List;
};
```

Базовый случай для рекурсии в этой метафункции представляет собой тождественную функцию для пустого списка. Рекурсивный случай разделяет список на его первый элемент и оставшиеся элементы в списке. Например, для типа `Typelist<short, int, long>` рекурсивный шаг отделяет первый элемент (`short`) от остальных элементов (`Typelist<int, long>`). Затем выполняется рекурсивное обращение этого списка остальных элементов (что дает тип `Typelist<long, int>`) и, наконец, к обращенному списку добавляется первый элемент с помощью `PushBackT` (и мы получаем тип `Typelist<long, int, short>`).

Алгоритм `Reverse` делает для списков типов возможной реализацию операции `РорВаскТ`, которая удаляет последний элемент из списка:
```c++
template<typename List>
class PopBackT
{
	public:
		using Type = Reverse<PopFront<Reverse<List>>>;
};

template<typename List>
using PopBack = typename PopBackT<List>::Type;
```

Этот алгоритм обращает список, удаляет из обращенного списка первый элемент с использованием `PopFront`, а затем еще раз обращает порядок элементов в получившемся списке.

## Преобразование списка типов

Наши предыдущие алгоритмы для работы со списками типов позволили нам извлекать из списка произвольные элементы, выполнять поиск в списке, создавать новые и изменять существующие списки. Однако нам еще предстоит выполнение любых операций с элементами внутри списка типов. Например, мы хотим, “преобразовать” все типы в списке определенным образом, например, добавив к каждому типу квалификатор [[const|const]] с использованием метафункции `AddConst`:
```c++
template<typename T>
struct AddConstT
{
	using Type = T const;
};

template<typename T>
using AddConst = typename AddConstT<T>::Type;
```

С этой целью мы реализуем алгоритм [[transform|Transform]], который принимает список типов и метафункцию, и производит другой список типов, содержащий результат применения метафункции к каждому типу. Например, тип
```c++
Transform<SignedlntegralTypes, AddConstT>
```

будет представлять собой список типов, содержащий `signed char const`, `short const`, `int const`, `long const` и `long long const`. Метафункция предоставляется как шаблонный параметр шаблона, который отображает входной тип на выходной. Алгоритм [[transform|Transform]] сам по себе является, как и ожидалось, рекурсивным алгоритмом:
```c++
template<typename List, template<typename T> class MetaFun,
			bool Empty = IsEmpty<List>::value>
class TransformT;

// Рекурсивный случай:
template<typename List, template<typename T> class MetaFun>
class TransformT<List, MetaFun, false>
	: public PushFrontT<typename TransformT<PopFront<List>,
											MetaFun>::Type,
						typename MetaFun<Front<List>>::Type>
{
};

// Базовый случай:
template<typename List, template<typename T> class MetaFun>
class TransformT<List, MetaFun, true>
{
	public:
		using Type = List;
};

template<typename List, template<typename T> class MetaFun>
using Transform = typename TransformT<List, MetaFun>::Type;
```

Рекурсивный случай прост, хотя синтаксически и тяжеловесен. Результатом преобразования является преобразование первого элемента в списке (второй аргумент `PushFront`) и добавление его в начало последовательности, генерируемой рекурсивным преобразованием остальных элементов в списке типов (первый аргумент `PushFront`).

[[Списки типов - template#Обращение порядка типов в списке|В разделе]] показано, как можно получить более эффективную реализацию алгоритма [[transform|Transform]].

## Накопление списков типов

[[transform|Transform]] является полезным алгоритмом для преобразования каждого элемента в списке. Он часто используется в сочетании с алгоритмом [[accumulate|Accumulate]], который объединяет все элементы последовательности в единое результирующее значение6. Алгоритм [[accumulate|Accumulate]] получает список типов `Т` с элементами `Т1`, `Т2`, ..., `TN`, исходный тип `I` и метафункцию `F`, которая принимает два типа и возвращает тип. Алгоритм возвращает `F(F(F(... F(I; T1), T2), ..., TN-1),TN)`, где на `i-м` шаге накопления `F` применяется к результату предыдущих `i-1` шагов и `Тi`.

В зависимости от списка типов, выбора `F` и первоначального типа, мы можем использовать [[accumulate|Accumulate]] для получения целого ряда различных результатов. Например, если `F` выбирает больший из двух типов, [[accumulate|Accumulate]] будет вести себя как алгоритм `LargestType`. С другой стороны, если `F` принимает список типов и тип, добавляет этот тип в конец списка типов, [[accumulate|Accumulate]] будет вести
себя как алгоритм `Reverse`.

Реализация алгоритма [[accumulate|Accumulate]] следует нашим стандартным методам рекурсивного метапрограммирования:
```c++
template<typename List,
			template<typename X, typename Y> class F,
			typename I,
			bool = IsEmpty<List>::value>
class AccumulateT;

// Рекурсивный случай:
template<typename List,
			template<typename X, typename Y> class F,
			typename I>
class AccumulateT<List, F, I, false>
	: public AccumulateT<PopFront<List>, F,
		typename F<I, Front<List>>::Type>
(
};

// Базовый случай:
template<typename List,
		 template<typename X, typename Y> class F,
		 typename I>
class AccumulateT<List, F, I, true>
{
	public:
		using Type = I;
};

template<typename List,
		 template<typename X, typename Y> class F,
		 typename I>
using Accumulate = typename AccumulateT<List, F, I>::Type;
```

Здесь исходный тип `I` также используется как аккумулятор, захватывая текущий результат. Таким образом, базовый случай возвращает этот результат, когда достигает конца списка типов. В рекурсивном случае алгоритм применяет `F` к предыдущему результату (`I`) и первому элементу списка, передавая результат применения `F` как начальный тип для накопления оставшейся части списка.

Имея [[accumulate|Accumulate]], можно обратить список типов, используя `PushFrontT` в качестве метафункции `F` и пустой список `TypeList<T>` в качестве начального типа `I`:
```c++
using Result =
	Accumulate<signedIntegralTypes, PushFrontT, Typelist<>>;
// Создает TypeList<long long, long, int, short, signed char>
```

Реализация `LargestTypeAcc` версии `LargestType` на основе `Accumulator` требует несколько большего количества усилий, так как нам нужна метафункция, возвращающая больший из двух типов:
```c++
template<typename T, typename U>
class LargerTypeT
	: public IfThenElseT<sizeof(T) >= sizeof(U), T, U >
{
};

template<typename Typelist>
class LargestTypeAccT
	: public AccumulateT<PopFront<Typelist>, LargerTypeT,
			Front<Typelist>>
{
};

template<typename Typelist>
using LargestTypeAcc = typename LargestTypeAccT<Typelist>::Type;
```

Обратите внимание та то, что эта формулировка `LargestType` требует непустой список типов, потому что первый элемент списка используется в качестве начального типа. Мы могли бы обрабатывать случай пустого списка явно, либо возвращая некоторый ограничивающий тип (`char` или `void`), либо [[SFINAE#SFINAE и свойства|делая сам алгоритм дружественным по отношению к SFINAE]]:
```c++
template<typename Т, typename U>
class LargerTypeT
: public IfThenElseT<sizeof(T) >= sizeof(U), T, U >
{
};

template<typename Typelist, bool = IsEmpty<Typelist>::value>
class LargestTypeAccT;

template<typename Typelist>
class LargestTypeAccT<Typelist, false>
	: public AccumulateT<PopFront<Typelist>, LargerTypeT,
				FrontcTypelist>>
{
};

template<typename Typelist>
class LargestTypeAccT<Typelist, true>
{
};

template<typename Typelist>
using LargestTypeAcc = typename LargestTypeAccT<Typelist>::Type;
```

[[accumulate|Accumulate]] является мощным алгоритмом для работы со списками типов, потому что он позволяет выразить множество различных операций, так что его можно считать одним из основополагающих алгоритмов для работы со списками типов.

## Сортировка вставками

В качестве последнего алгоритма для работы со списками типов реализуем сортировку вставками. Как и в прочих алгоритмах, рекурсивный шаг разбивает список на его “голову” (первый элемент списка) и “хвост”, состоящий из остальных элементов. Затем “хвост” рекурсивно сортируется, а “голова” вставляется в корректную позицию в отсортированном списке. Оболочка этого алгоритма выражена как алгоритм для работы со списками типов:
```c++
template<typename List,
			template<typename T, typename U> class Compare,
			bool = IsEmpty<List>::value>
class InsertionSortT;

template<typename List,
			template<typename T, typename U> class Compare>
using InsertionSort = typename InsertionSortT<List, Compare>::Type;

// Рекурсивный случай (вставка первого элемента
// в отсортированный список):
template<typename List,
			template<typename Т, typename U> class Compare>
class InsertionSortT<List, Compare, false>
	: public InsertSortedT<lnsertionSort<PopFront<List>, Compare>,
							Front<List>, Compare>
{
};

// Базовый случай (пустой список является отсортированным):
template<typename List,
			template<typename Т, typename U> class Compare>
class InsertionSortT<List, Compare, true>
{
	public:
		using Type = List;
};
```

Параметр `Compare` представляет собой компаратор, используемый для упорядочения элементов в списке типов. Он принимает два типа и вычисляет логическое значение, возвращаемое через значение члена `value`. Базовый случай — пустой список типов — тривиален.

Ядром сортировки вставками является метафункция `InsertSortedT`, которая вставляет значение в отсортированный список в первой точке, где список после вставки останется отсортированным:
```c++
#include "identity.hpp"

template<typename List, typename Element,
			template<typename T, typename U> class Compare,
			bool = IsEmpty<List>::value>
class InsertSortedT;

// Рекурсивный случай:
template<typename List, typename Element,
			template<typename T, typename U> class Compare>
class InsertSortedT<List, Element, Compare, false>
{
	// Вычисление хвоста результирующего списка:
	using NewTail =
		typename IfThenElse<Compare<Element, Front<List>>::value,
		IdentityT<List>,
		InsertSortedT<PopFront<List>, Element, Compare>>::Type;
	
	// Вычисление головы результирующего списка:
	using NewHead = IfThenElse<Compare<Element, Front<List>>::value,
			Element,
			Front<List>>;

	public:
		using Type = PushFront<NewTail, NewHead>;
};

// Базовый случай:
template<typename List, typename Element,
			template<typename T, typename U> class Compare>
class InsertSortedT<List, Element, Compare, true>
	: public PushFrontT<List, Element>
{
};

template<typename List, typename Element,
			template<typename T, typename U> class Compare>
using InsertSorted = typename
					InsertSortedT<List, Element, Compare>::Type;
```

И снова базовый случай тривиален, потому что список из одного элемента всегда отсортирован. Рекурсивный случай отличается от базового вставкой элемента на корректное место в списке. Если вставляемый элемент предшествует первому элементу в (уже отсортированном) списке, результатом является добавление элемента в список с помощью `PushFront`. В противном случае список разделяется на “голову” и “хвост”, выполняется рекурсивная вставка элемента в “хвост”, а затем “голова” добавляется к списку, получающемуся в результате вставки элемента в “хвост”.

Данная реализация включает в себя оптимизацию времени компиляции, позволяющую [[Реализация свойств типов#If-Then-Else|избежать инстанцирования типов, которые не будут использоваться]]. Приведенная ниже реализация также является технически правильной:
```c++
template<typename List, typename Element,
			template<typename T, typename U> class Compare>
class InsertSortedT<List, Element, Compare, false>
	: public IfThenElseT<Compare<Element, Front<List>>::value,
						PushFront<List, Element>,
						PushFront<InsertSorted<PopFront<List>,
									Element, Compare>,
								Front<List>>>
{
};
```

Однако такая формулировка рекурсивного случая чересчур неэффективна, поскольку вычисляет аргументы шаблона в обеих ветвях `IfThenElseT`, хотя использоваться будет только одна ветвь. В нашем случае `PushFront` в ветви `then`, как правило — довольно дешевая конструкция, но этого нельзя сказать о рекурсивном вызове `InsertSorted` в ветви `else`.

В оптимизированной реализации первый `IfThenElse` вычисляет хвост полученного списка, `NewTail`. Вторым и третьим аргументами `IfThenElse` являются две метафункции, которые будут вычислять результаты для своих ветвей. Второй аргумент [[Реализация свойств типов#If-Then-Else|(ветвь then) использует IdentityT]], чтобы оставить список неизмененным. Третий аргумент (ветвь `else`) использует `InsertSortedT` для вычисления результата вставки элемента в отсортированный список. На верхнем уровне будет инстанцирована только одна из метафункций `IdentityT` и `InsertSortedT`, так что будет выполнена только очень небольшая работа (в наихудшем случае — `PopFront`). Затем второй `IfThenElse` вычисляет голову результирующего списка; ветви выполняются немедленно, потому что они обе считаются дешевыми. Окончательный список строится из вычисленных `NewHead` и `NewTail`. Эта формулировка обладает гем желательным свойством, что количество инстанцирований, требующихся для вставки элемента в отсортированный список, пропорционально его позиции в результирующем списке. Это проявляется в виде свойства сортировки вставками более высокого уровня, состоящего в том, что количество инстанцирований для сортировки уже отсортированного списка линейно зависит от длины списка. (Сортировка вставками остается квадратичной в смысле количества инстанцирований для входных данных, отсортированных в обратном порядке.)

Приведенная ниже программа демонстрирует использование сортировки вставками для упорядочения списка типов на основании их размеров. Операция сравнения использует оператор [[sizeof|sizeof]] и сравнивает результаты:
```c++
template<typename Т,
struct SmallerThanT
{
	static constexpr bool value = sizeof(T) < sizeof(U);
}

void testlnsertionSort()
{
	using Types = Typelist<int, char, short, double>
	using ST = InsertionSort<Types, SmallerThanT>;
	
	std::cout <<
		std::is_same<ST, Typelist<char, short, int, double>>::value
		<< '\n';
}
```

# Списки нетиповых параметров







