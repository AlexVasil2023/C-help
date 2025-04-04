
[[#SFINAE|SFINAE]]
[[#Выражение SFINAE с decltype|Выражение SFINAE с decltype]]
[[#Принцип SFINAE|Принцип SFINAE]]

# SFINAE

В C++ перегрузка функций для различных типов аргументов — распространенная практика. Когда компилятор видит вызов перегруженной функции, он должен рассмотреть каждого кандидата отдельно, оценивая аргументы вызова и выбирая кандидата, который наилучшим образом соответствует передаваемым аргументам (см. дополнительную информацию в #приложении_В, “Разрешение перегрузки”).

В тех случаях, когда набор кандидатов для вызова включает шаблоны функций, компилятор сначала должен определить, какие аргументы шаблона должны использоваться для этого кандидата, затем подставить эти аргументы в список параметров функции и возвращаемый тип, а потом оценить, насколько хорошо она соответствует аргументам (так же, как это делается в случае обычной функции). Однако процесс подстановки может столкнуться с проблемами: он может давать конструкции, которые не имеют никакого смысла. Вместо того, чтобы считать такую бессмысленную подстановку ошибкой, правила языка требуют просто игнорировать кандидатов с такими проблемами.

Этот принцип именуется **`SFINAE`**, что представляет собой аббревиатуру для **“substitution failure is not an error”** (ошибка подстановки ошибкой не является).

Обратите внимание на то, что описанный здесь процесс подстановки отличается от [[Шаблоны классов#Использование шаблона класса Stack|процесса инстанцирования по требованию]]: подстановка может быть выполнена даже для потенциальных инстанцирований, которые на самом деле не нужны (так что компилятор может выяснить, действительно ли они не нужны). Эта подстановка выполняется непосредственно в объявлении функции (но не в ее теле).

Рассмотрим следующий пример:
```c++
// Количество элементов в массиве:
template<typename Т, unsigned N>
std::size_t len(T(&)[N])
{
	return N;
}

// Количество элементов для типа, имеющего член size_type:
template<typename Т>
typename T::size_type len(T const& t)
{
	return t.size();
}
```

Здесь мы определяем два шаблона функций `lеn()`, получающих один обобщенный аргумент.

1. Первый шаблон функции объявляет параметр как `Т(&)[N]`, что означает, что параметр должен быть массивом из `N` элементов типа `Т`.
2. Шаблон второй функции объявляет параметр просто как `Т`, что снимает все ограничения на сам параметр, но имеет возвращаемый тип `Т::size_type`, что требует от передаваемого типа аргумента наличия соответствующего члена `size_type`.

При передаче простого массива или строкового литерала соответствие наблюдается только в случае шаблона функции для простых массивов:
```c++
int а[10];

std::cout << len(a);       // ОК: соответствует только 1еn() для массива
std::cout << len("Hi");    // ОК: соответствует только 1еn() для массива
```

Согласно сигнатуре для второго шаблона функции также наблюдается соответствие при замене `Т` соответственно на `int[10]` и `char const [3]`, но эти подстановки ведут к потенциальным ошибкам в возвращаемом типе `Т: : size_type`. Поэтому второй шаблон при рассмотрении этих вызовов игнорируется.

При передаче [[vector|std::vector<>]] соответствие наблюдается только для второго шаблона:
```c++
std::vector<int> v;
std::cout << len(v);       // OK: годится только len() с типом size_type
```

При передаче простого указателя не подходит ни один из шаблонов функций (без сообщения об ошибке). В результате компилятор сообщает о том, что не может найти ни одной функции `lеn()`, соответствующей переданным аргументам:
```c++
int* р;
std::cout << len(p);       // Ошибка: подходящая 1еn() не найдена
```

Обратите внимание: эта ситуация отличается от передачи объекта с типом, имеющим тип-член `size_type`, но не имеющим функции-члена `size()`, как, например, для [[allocator|std::allocator<>]]:
```c++
std::allocator<int> x;
std::cout << len(x);      // Ошибка: len() найдена, но нет члена size()
```

При передаче объекта такого типа компилятор находит второй шаблон функции как соответствующий вызову. Поэтому вместо сообщения об ошибке, гласящего, что не найдена соответствующая функция `lеn()`, мы получаем сообщение об ошибке времени компиляции, говорящей о том, что невозможен вызов `size()` для `std::allocator<int>`. На этот раз второй шаблон функции не игнорируется.

Игнорирование кандидата при бессмысленности подстановки возвращаемого типа может заставить компилятор выбрать другого кандидата, параметры которого подходят хуже. Например:
```c++
// Количество элементов в простом массиве:
template<typename Т, unsigned N>
std::size_t len(T(&)[N])
{
	return N;
}

// Количество элементов для типа, имеющего тип-член size_type:
template<typename Т>
typename T::size_type len(T const& t)
{
	return t.size ();
}

// Запасной вариант для всех прочих типов:
std::size_t len(...)
{
	return 0;
}
```

Здесь мы также предоставляем общую функцию `len()`, которая соответствует всегда, но имеет наихудшее соответствие (с многоточием `(...)`) в разрешении перегрузки (см. #раздел_В_2).

Итак, для обычных массивов и векторов у нас есть два варианта, причем лучше подходит вариант с конкретными типами. Для указателей годится только запасной вариант, так что компилятор больше не жалуется на отсутствие `len()` для этого вызова. Но для распределителя памяти подходят второй и третий варианты функции, при этом второй шаблон обеспечивает лучшее соответствие. Так что это все еще приводит к сообщению об ошибке о том, что функция-член `size()` не может быть вызвана:
```c++
int а[10];
std::cout << len(a);         // OK: лучше подходит len() для массива
std::cout << len("Hi");      // OK: лучше подходит len() для массива

std::vector<int> v;
std::cout << len(v);         // OK: лучше подходит len() для типа с
							 // типом-членом size_type	
int* р;
std::cout << len(p);         // OK: годится только запасной вариант

std::allocator<int> х;
std::cout << len(x);         // Ошибка: вторая функция len() подходит
							 // лучше, но не может вызвать size() для х
```

Подробнее `SFINAE` рассматривается в #разделе_15_7, а некоторые приложения `SFINAE` — в #разделе_19_4.

==**SFINAE и разрешение перегрузки**==

Со временем принцип `SFINAE` стал столь важным и настолько превалирующим среди разработчиков шаблонов, что эта аббревиатура стала глаголом. Иногда говорят *“мы SFINAE’им функцию"*, имея в виду применение механизма `SFINAE` для обеспечения игнорирования шаблонов функции для определенных ограничений; код шаблонов при этих ограничениях становится недопустимым. Всякий раз, когда вы читаете в стандарте C++, что “шаблон функции не должен участвовать в разрешении перегрузки, если..”, это означает, что для того, чтобы шаблон функции игнорировался для определенных случаев, используется `SFINAE`.

Например, [[thread|std::thread]] объявляет конструктор:
```c++
namespace std
{
	class thread
	{
		public:
			template<typename F, typename... Args>
			explicit thread(F&& f, Args&& ... args);

			...
	};
};
```

co следующим примечанием:

Примечание: этот конструктор не должен участвовать в разрешении перегрузки, если `decay_t<F>` представляет собой тот же тип, что и [[thread|std::thread]].

Это означает, что шаблонный конструктор игнорируется, если он вызывается с [[thread|std::thread]] в качестве первого и единственного аргумента. Причина в том, что в противном случае шаблон-член наподобие показанного иногда может демонстрировать лучшее соответствие, чем любой предопределенный копирующий или [[Семантика перемещения - Шаблоны специальных функций-членов|перемещающий конструктор]] (см. подробности в #16_2_4). Применяя принцип `SFINAE` для игнорирования шаблона конструктора при вызове для потока, мы гарантируем, что, если поток строится из другого потока, всегда используется предопределенный копирующий или перемещающий конструктор.

Применение такой методики на индивидуальной основе может оказаться громоздким. К счастью, стандартная библиотека предоставляет инструменты для более легкого отключения шаблонов. [[Семантика перемещения - Отключение шаблонов с помощью enable_if|Наиболее известным средством является шаблон std::enable_if<>]]. Он позволяет отключить шаблон, просто заменив тип конструкцией с условием отключения шаблона.

В результате реальное объявление [[thread|std::thread]] обычно имеет следующий вид:
```c++
namespace std
{
	class thread
	{
		public:
			template<typename F, typename... Args,
					typename = enable_if_t<!is_same_v<
											decay_t<F>, thread>>>
				explicit thread(F&& f, Args&&... args);
				...
	};
};
```

Подробности реализации [[enable_if|std::enable_if<>]] и описание применения частичной специализации и `SFINAE` приведены в #разделе_20_3.

### Выражение SFINAE с decltype

Не всегда легко найти и сформулировать правильное выражение для того, чтобы воспользоваться принципом `SFINAE` для обеспечения игнорирования шаблона функции при определенных условиях.

Предположим, например, что мы хотим гарантировать, что шаблон функции `len()` игнорируется для аргументов типа, который имеет тип-член `size_type`, но не имеет функции-члена `size()`. Без каких-либо требований к функции-члену `size()` в объявлении функции шаблон будет выбран, после чего его инстанцирование приведет к ошибке:
```c++
template<typename Т>
typename T::size_type len(T const& t)
{
	return t.size ();
}

std::allocator<int> x;
std::cout << len(x)         // Ошибка: выбрана len(), но x
			<< '\n';        // не имеет функции-члена size()
```

Вот как выглядят обычные действия в такой ситуации.
>
> Указываем возвращаемый тип с помощью синтаксиса завершающего возвращаемого типа (trailing return type syntax), с использованием [[auto|auto]] в начале объявления и `->` перед возвращаемым типом в конце.
> 
> Определяем возвращаемый тип с использованием [[decltуре|decltype]] и оператора “запятая”.
> 
> Формулируем все выражения, которые должны быть корректны, в начале оператора “запятая” (преобразуя в `void`, если оператор “запятая” перегружен).
> 
> Определяем объект реального возвращаемого типа в конце оператора запятой.

Например:
```c++
template<typename Т>
auto len(T const& t) -> decltype((void) (t.size()), T::size type())
{
	return t.size();
}
```

Здесь возвращаемый тип задается выражением
```c++
decitype((void) (t.size()), T::size_type())
```

Операнд конструкции [[decltуре|decltype]] представляет собой список выражений, разделенных запятыми, так что последнее выражение `Т::size_type()` дает значение желаемого типа возвращаемого значения (который конструкция [[decltуре|decltype]] использует для преобразования в возвращаемый тип). Перед (последней) запятой находится выражение, которые должно быть корректным (и которое в данном случае представляет собой просто `t.size<>`). Приведение выражения к `void` используется для того, чтобы избежать возможной перегрузки оператора запятой для типа данного выражения.

Обратите внимание на то, что аргумент [[decltуре|decltype]] является невычисляемым операндом, следовательно, например, можно создать “фиктивные объекты” без вызова конструкторов (см. #раздел_11_2_3).

# Принцип SFINAE








