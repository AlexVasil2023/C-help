
[[#Списки типов|Списки типов]] 24
1. [[#Анатомия списков типов|Анатомия списков типов]] 24.1
2. [[#Алгоритмы над списками типов|Алгоритмы над списками типов]] 24.2
	1. [[#Индексация|Индексация]] 24.2.1
	2. [[#Поиск наилучшего соответствия|Поиск наилучшего соответствия]] 24.2.2
	3. [[#Добавление в список типов|Добавление в список типов]] 24.2.3




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





































