
[[#variant|variant]] 15.4.1 (STL)
[[#std variant C++17|std::variant C++17]]
[[#Контролируемые объединения|Контролируемые объединения]] 26 (Template)
1. [[#Хранилище|Хранилище]] 26.1
2. [[#Дизайн|Дизайн]] 26.2
3. [[#Запрос и извлечение значения|Запрос и извлечение значения]] 26.3
4. [[#Инициализация, присваивание и уничтожение элементов|Инициализация, присваивание и уничтожение элементов]] 26.4
	1. [[#Инстанцирования|Инстанцирования]] 26.4.1
	2. [[#Уничтожение|Уничтожение]] 26.4.2
	3. [[#Присваивание|Присваивание]] 26.4.3
		1. [[launder|std::launder()]]
5. [[#Посетители|Посетители]] 26.5
	1. [[#Возвращаемый тип visit()|Возвращаемый тип visit ()]] 26.5.1
	2. [[#Общий возвращаемый тип|Общий возвращаемый тип]] 26.5.2
6. [[#Инициализация и присваивание Variant|Инициализация и присваивание Variant]] 26.6


# variant

`variant<A, B, C>` часто является более безопасной и удобной альтернативой явному использованию [[union|union]]. Возможно, самым простым примером является возврат либо значения, либо кода ошибки:
```c++
variant<string,Error_code> compose_message(istream& s)
{
	string mess;
	
	// ... read from s and compose message ...
	if (no_problems)
		return mess;                 // return a string
	else
	return Error_code{some_problem}; // return an Error_code
}
```

Когда вы присваиваете `variant` значение или инициализируете его, он запоминает тип этого значения. Позже мы сможем узнать, какой тип содержит `variant`, и извлечь значение. Например:
```c++
auto m = compose_message(cin);

if (holds_alternative<string>(m)) 
{
	cout << get<string>(m);
}
else {
	auto err = get<Error_code>(m);
	// ... handle error ...
}
```

Этот стиль нравится некоторым людям, которым не нравятся [[Обработка ошибок#Альтернативные способы обработки ошибок|исключения]], но есть и более интересные варианты использования. Например, простому компилятору может потребоваться различать различные типы узлов с различными представлениями:
```c++
using Node = variant<Expression, Statement, Declaration, Type>;
void check(Node* p)
{
	if (holds_alternative<Expression>(*p)) 
	{
		Expression& e = get<Expression>(*p);
		// ...
	}
	else if (holds_alternative<Statement>(*p)) 
	{
		Statement& s = get<Statement>(*p);
		// ...
	}
	
	// ... Declaration and Type ...
}
```

Такая схема проверки альтернатив для принятия решения о соответствующих действиях настолько распространена и относительно неэффективна, что заслуживает прямой поддержки:
```c++
void check(Node* p)
{
	visit(overloaded {
		[](Expression& e) { /* ... */ },
		[](Statement& s) { /* ... */ },
		// ... Declaration and Type ...
	}, *p);
}
```

Это в основном эквивалентно вызову виртуальной функции, но потенциально быстрее. Как и во всех заявлениях о производительности, это “потенциально быстрее” должно быть подтверждено измерениями, когда производительность имеет решающее значение. Для большинства применений разница в производительности незначительна.

Класс `overloaded` необходим и, как ни странно, не является стандартным. Это “кусочек волшебства”, который создает набор перегрузок из набора аргументов (обычно лямбд):
```c++
template<class... Ts>
struct overloaded : Ts... {              // variadic template
	using Ts::operator()...;
};

template<class... Ts>
overloaded(Ts...) -> overloaded<Ts...>;  // deduction guide
```

Затем “посетитель” `visit` применяет `()` к объекту `overload`, который выбирает наиболее подходящую лямбду для вызова в соответствии с правилами выведения перегрузки.

Правила выведения - это механизм для разрешения тонких двусмысленностей, в первую очередь для [[Template_STL#Выведение типов аргументов шаблонов|конструкторов шаблонов классов в базовых библиотеках]].

Если мы попытаемся получить доступ к `variant`, содержащему тип, отличный от ожидаемого, будет брошено исключение `bad_variant_access`.

# std::variant C++17

Концепция “вариант” может показаться знакомой тем, кто имел дело с Visual Basic. Вариант – это типобезопасное объединение [[union|union]], которое в заданный момент времени содержит значение одного из альтернативных типов (причем, здесь не может быть ссылок, массивов или [[void|void]]).  
```c++
std::variant<int, double> v{ 12 };
std::get<int>(v); // == 12
std::get<0>(v); // == 12

v = 12.0;

std::get<double>(v); // == 12.0
std::get<1>(v); // == 12.0
```

Простой пример: допустим, есть некоторые данные, где возраст человека может быть представлен в виде целого числа или в виде строки с датой рождения. Можно представить такую информацию при помощи варианта, содержащего беззнаковое целое число или строку. Присваивая целое число переменной, мы задаем значение, а затем можем извлечь его при помощи [[get|std::get]], вот так:
```c++
std::variant<uint32_t, std::string> age;
age = 51; 

auto a = std::get<uint32_t>(age);
```

Если попытаться использовать член, который не задан таким образом, то программа выбросит исключение:
```c++
try { 	
	std::cout << std::get<std::string>(age) << std::endl;
}catch ( std::bad_variant_access &ex ) { 	
	std::cout << "Doesn't contain a string" << std::endl;
}
```

Зачем использовать `std::variant`, а не обычное объединение? В основном потому, что объединения присутствуют в языке прежде всего ради совместимости с C и не работают с объектами, не относящимися к POD-типам. Отсюда, в частности, следует, что в объединение не так-то просто поместить члены с копиями пользовательских конструкторов копирования и деструкторов. С `std::variant` таких ограничений нет.

# Контролируемые объединения

Кортежи, разработанные в предыдущей главе, объединяют значения некоторого списка типов в одно значение, обеспечивая примерно такую же функциональность, как и простая структура. С учетом этой аналогии естественно задаться вопросом, чему же соответствует объединение ([[union|union]]), которое содержит единственное значение, но это значение имеет тип, выбранный из некоторого множества возможных типов. Например, поле базы данных может содержать целое число, значение с плавающей точкой, строку или бинарный объект, но в любой момент времени оно может содержать значение только одного из этих типов.

В этой главе мы разработаем шаблон класса `Variant`, который динамически хранит значение одного из заданного набора возможных типов, аналогичный шаблону стандартной библиотеки C++17 `std::variant<>`. `Variant` — это контролируемое объединение (`discriminated union`), т.е. оно знает, какое из его возможных типов значений в настоящее время активно, и обеспечивает лучшую безопасность типов, чем эквивалентное объединение C++. Сам `Variant` является вариативным шаблоном, принимающим список типов, который может иметь активное значение. Например, переменная
```c++
Variant<int, double, string> field;
```

может хранить `int`, `double` или [[string|string]], но в каждый момент времени — только одно из этих значений. Поведение `Variant` иллюстрируется следующей программой:
```c++
#include "variant.hpp"
#include <iostream>
#include <string>

int main()
{
	Variant<int, double, std::string> field(17);
	
	if(field.is<int>())
	{
		std::cout << "Field хранит целое значение "
				  << field.get<int>() << '\n';
	}

	field = 42;             // Присваивание значения того же типа
	field = "hello";        // Присваивание значения иного типа

	std::cout << "Теперь field хранит строку '"
			  << field.get<std::string>() << ”'\n";
}
```

Вывод этого кода имеет следующий вид:
```c++
Field хранит целое значение 17
Теперь field хранит строку 'hello'
```

Переменной типа `Variant` может быть присвоено значение любого из его типов. Мы можем проверить, содержит ли переменная в настоящее время значение типа `Т` с помощью функции-члена `is<T>()`, а затем получить сохраненное значение с помощью функции-члена `get<T>()`.

# Хранилище

Первый главный аспект дизайна нашего типа `Variant` представляет собой управление хранением активного значения, т.е. значения, которое в настоящий момент хранится в переменной. Различные типы, вероятно, имеют различные размеры и выравнивание. Кроме того, типу `Variant` необходимо хранить дискриминатор (`discriminator`), указывающий, какой из возможных типов является типом активного значения. Один простой (хотя и неэффективный) механизм хранения непосредственно использует [[tuple (Кортежи)|кортеж]]:
```c++
template<typename... Types>
class Variant
{
	public:
		Tuple<Types...> storage;
		unsigned char discriminator;
}
```

Здесь дискриминатор действует как динамический индекс в кортеже. Допустимое значение имеет только тот элемент кортежа, статический индекс которого равен текущему значению дискриминатора, так что когда `discriminator` равен `0`, `get<0>` (`storage`) обеспечивает доступ к активному значению; когда `discriminator` равен `1`, доступ к активному значению обеспечивает `get<1>` (`storage`), и т. д.

Мы могли бы построить базовый вариант операций `is<T>()` и `get<T>()` поверх кортежа. Однако это довольно неэффективное решение, поскольку сам `Variant` при этом требует количество памяти, равное сумме размеров типов всех возможных значений, даже если одновременно будет активен только один из них.

Лучший подход использует перекрытие памяти для всех возможных типов. Мы могли бы осуществить его путем [[tuple (Кортежи)#Хранилище|рекурсивного развертывания контролируемого объединения на голову и хвост]], но с помощью объединения, а не класса:
```c++
template<typename... Types>
union VariantStorage;

template<typename Head, typename... Tail>
union VariantStorage<Head, Tail...>
{
	Head head;
	VariantStorage<Tail...> tail;
};

template<>
union VariantStorage<>
{
};
```

Здесь объединение гарантированно имеет достаточный размер и выравнивание, чтобы позволить хранение любого из типов в `Types` в любой момент времени. К сожалению, с таким объединением довольно трудно работать, потому что большинство методов, которые мы будем использовать для реализации `Variant`, будут применять наследование, которое для объединения является недопустимым.

Вместо этого мы предпочитаем низкоуровневое представление хранилища: массив символов, размер которого достаточен для хранения любых типов, и с выравниванием, подходящим для любого из типов, используемый нами как буфер для хранения активного значения. Шаблон класса `VariantStorage` реализует этот буфер вместе с дискриминатором:
```c++
#include <new>        // Для std::launder()

template<typename... Types>
class VariantStorage
{
		using LargestT = LargestType<Typelist<Types...>>;
		alignas(Types...) unsigned char buffer[sizeof(LargestT)];
		unsigned char discriminator = 0;
	
	public:
		unsigned char getDiscriminator() const
		{
			return discriminator;
		}
		
		void setDiscriminator(unsigned char d)
		{
			discriminator = d;
		}
	
		void* getRawBuffer()
		{
			return buffer;
		}
		
		const void* getRawBuffer() const
		{
			return buffer;
		}
		
		template<typename T>
		T* getBufferAs()
		{
			return std::launder(reinterpret_cast<T*>(buffer));
		}
		
		template<typename T>
		T const* getBufferAs() const
		{
			return std::launder(reinterpret_cast<T const*>(buffer));
		}
};
```

Здесь мы используем [[Списки типов - template#Поиск наилучшего соответствия|разработанную метапрограмму LargestType для вычисления размера буфера]], гарантируя достаточный его размер для любого из типов значений. Аналогично раскрытие пакета `alignas` гарантирует, что буфер будет иметь выравнивание, подходящее для любого из типов. Вычисленный нами размер буфера, по сути, представляет собой машинное представление показанного выше объединения. Мы можем получить доступ к указателю на буфер с помощью `getBuffer()` и манипулировать с памятью путем явного приведения типов, размещающего `new` (для создания новых значений) и явного вызова деструкторов (для уничтожения созданных значений). Если вы незнакомы с [[launder|std::launder()]], используемым в `getBufferAs ()`, то пока что достаточно знать, что он возвращает неизмененным свой аргумент. Мы поясним его роль, когда будем говорить об операторах присваивания для нашего шаблона Variant.

# Дизайн

Теперь, когда у нас есть решение проблемы хранения для контролируемых объединений, мы проектируем сам тип `Variant`. Как и с типом [[tuple (Кортежи)#Кортежи|Tuple]], мы используем наследование для предоставления поведения для каждого типа в списке `Types`. Однако в отличие от `Types` эти базовые классы не имеют хранилища. Вместо этого каждой из базовых классов использует [[Шаблоны и наследование#Странно рекурсивный шаблон проектирования|Странно рекурсивный шаблон проектирования]] (Curiously Recurring Template Pattern — CRTP), для доступа к общему хранилищу через наиболее производный тип.

Шаблон класса `VariantChoice`, определенный ниже, предоставляет базовые операции, необходимые для работы с буфером, когда активным значением объединения является (или будет) значение типа `Т`:
```c++
#include "findindexof.hpp"

template<typename T, typename... Types>
class VariantChoice
{
		using Derived = Variant<Types...>;
		
		Derived& getDerived()
		{
			return *static_cast<Derived*>(this);
		}
		
		Derived const& getDerived() const
		{
			return *static_cast<Derived const*>(this);
		}
	
	protected:
		// Вычисление дискриминатора для данного типа
		constexpr static unsigned Discriminator =
			FindIndexOfT<Typelist<Types...>, T>::value + 1;
	
	public:
		VariantChoice() { }
		VariantChoice(T const& value); // Cm. variantchoiceinit.hpp
		VariantChoice(T&& value);      // Cm. variantchoiceinit.hpp
		bool destroy();                // Cm. variantchoicedestroy.hpp
		Deriveds operator=(T const& value) ;// Cm. variantchoiceassign.hpp
		Deriveds operator=(T&& value); // Cm. variantchoiceassign.hpp
};
```

Пакет параметров шаблона `Types` будет содержать все типы в `Variant`. Это позволяет нам сформировать тип `Derived` (для CRTP) и таким образом обеспечить операцию нисходящего приведения `getDerived()`. Второе интересное применение `Types` заключается в том, чтобы найти размещение конкретного типа `Т` в списке `Types`, чего мы добиваемся с помощью метафункции `FindlndexOfT`:
```c++
template<typename List, typename T, unsigned N = 0,
			bool Empty = IsEmpty<List>::value>
struct FindlndexOfT;

// Рекурсивный случай:
template<typename List, typename T, unsigned N>
struct FindlndexOfT<List, T, N, false>
	: public IfThenElse < std::is_same<Front<List>, T>::value,
	std::integral_constant<unsigned, N>,
	FindlndexOfT < PopFront<List>, T, N + 1 >>
{
};

// Базовый случай:
template<typename List, typename Т, unsigned N>
struct FindlndexOfT<List, T, N, true>
{
};
```

Это значение индекса используется для вычисления значения дискриминатора, соответствующего `Т`; мы вернемся к конкретным значениям дискриминатора позже.

Скелет `Variant`, приведенный ниже, иллюстрирует взаимоотношения `Variant`, `VariantStorage` и `VariantChoice`:
```c++
template<typename... Types>
class Variant
	: private VariantStorage<Types... >,
	private VariantChoice<Types, Types...>...
{
	template<typename T, typename... OtherTypes>
	friend class VariantChoice;  // Включение CRTP
	...	
};
```

Как упоминалось ранее, каждый `Variant` имеет единственный, общий базовый класс `VariantStorage`. Кроме того, он имеет некоторое количество базовых классов `VariantChoice`, которые получаются из следующих [[Вглубь шаблонов#Множественные и вложенные раскрытия пакетов|раскрытий вложенных пакетов]]:
```c++
VariantChoice<Types, Types...>...
```

В этом случае у нас есть два раскрытия: внешнее раскрытие производит базовый класс `VariantChoice` для каждого типа `Т` в `Types` путем раскрытия первой ссылки на `Types`. Внутреннее раскрытие второго вхождения `Types` дополнительно проходит все типы в `Types` для каждого базового класса `VariantChoice`. Для
```c++
Variant<int, double, std::string>
```

этот дает следующее множество базовых классов `VariantChoice`:
```c++
VariantChoice<int, int, double, std::string>,
VariantChoice<double, int, double, std::string>,
VariantChoice<std::string, int, double, std::string>
```

Для этих трех базовых классов значениями дискриминаторов будут `1`, `2` и `3` соответственно. Когда член `discriminator` хранилища соответствует дискриминатору определенного базового класса `VariantChoice`, этот базовый класс отвечает за управление активным значением.

Нулевое значение дискриминатора зарезервировано для случаев, когда `Variant` не содержит значения, — странное состояние, которое может наблюдаться только при генерации исключения во время присваивания. На протяжении всего обсуждения `Variant` мы будем достаточно внимательны и аккуратны, чтобы справиться с нулевым дискриминатором (и устанавливать его при необходимости), но его обсуждение мы отложим до #раздела_26_4_3.

Полное определение `Variant` приведено далее. В следующих разделах будут описаны реализации каждого из членов `Variant`.
```c++
template<typename... Types>
class Variant
	: private VariantStorage<Types...>,
	  private VariantChoice<Types, Types...>...
{
		template<typename T, typename... OtherTypes>
		friend class VariantChoice;

	public:
		template<typename T> bool is() const; // Cm. variantis.hpp
		template<typename T> T& get() &;      // Cm. variantget.hpp
		template<typename T> T const& get() const&;// Cm. variantget.hpp
		template<typename T> T&& get() &&;    // Cm. variantget.hpp

		// Cm. variantvisit.hpp:
		template<typename R = ComputedResultType, typename Visitor>
		VisitResult<R, Visitor, Types& ...> visit(Visitor && vis) &;
			
		template<typename R = ComputedResultType, typename Visitor>
		VisitResult<R, Visitor, Types const& ...>
			visit(Visitor && vis) const&;
			
		template<typename R = ComputedResultType, typename Visitor>
		VisitResult < R, Visitor, Types && ... >
			visit(Visitor && vis) &&;
			
		using VariantChoice<Types, Types...>::VariantChoice...;
		Variant();                      // Cm. variantdefaultctor.hpp
		Variant(Variant const& source); // Cm. variantcopyctor.hpp
		Variant(Variant&& source);      // Cm. variantmovector.hpp

		template<typename... SourceTypes>
		Variant(Variant<SourceTypes...> const&
				source);                // Cm. variantcopyctortmpl.hpp
			
		template<typename... SourceTypes>
		Variant(Variant<SourceTypes...>&& source);
		
		using VariantChoice<Types, Types...>::operator=...;
		
		Variants operator=(Variant const& 
				source);                // Cm. variantcopyassign.hpp

		Variants operator=(Variant&& source);
		
		template<typename... SourceTypes>
		Variant& operator=(Variant<SourceTypes...> const& source);

		template<typename... SourceTypes>
		Variant& operator=(Variant<SourceTypes...>&& source);

		bool empty() const;
		
		~Variant()
		{
			destroy();
		}
		
		void destroy();                 // Cm. variantdestroy.hpp
};
```

# Запрос и извлечение значения

Фундаментальными запросами для типа `Variant` являются запрос, имеет ли его активное значение определенный тип `Т`, и доступ к активному значению, когда его тип известен. Функция-член `is()`, определяемая ниже, выясняет, хранит ли `Variant` в настоящее время значение типа `Т`:
```c++
template<typename... Types>
template<typename T>
bool Variant<Types...>::is() const
{
	return this->getDiscriminator() == 
				VariantChoice<T, Types...>::Discriminator;
}
```

Для данной переменной `v`, значение `v.is<int>()` выясняет, имеет ли активное значение переменной тип `int`. Проверка реализована очень просто — она сравнивает значение дискриминатора со значением дискриминатора соответствующего базового класса `VariantChoice`.

Если искомый тип `Т` не найден в списке, базовый класс `VariantChoice` не будет инстанцирован, поскольку `FindlndexOfТ` не будет содержать член `value`, что приведет к (преднамеренному) сбою компиляции `is<T>()`. Это предотвращает ошибку пользователя, когда он запрашивает тип, который не может храниться в контролируемом объединении.

Функция-член `get()` извлекает ссылку на хранимое значение. Ей должен быть передан извлекаемый тип (например, `v.get<int>()`), и она корректна только тогда, когда активное значение имеет этот указанный тип:
```c++
#include <exception>

class EmptyVariant : public std::exception
{
};

template<typename... Types>
template<typename T>
Т& Variant<Types...>::get() &
{
	if(empty())
	{
		throw EmptyVariant();
	}
	
	assert(is<T>());
	return *this->template getBufferAs<T>();
};
```

Когда `Variant` не имеет значения (его дискриминатор равен `0`), метод `get()` генерирует исключение `EmptyVariant`. Условия, при которых дискриминатор может быть нулевым, сами возникают из-за исключения (см. #раздел_26_4_3). Другие попытки получить значение некорректного типа являются ошибками программиста, обнаруживаемые с помощью [[assert|assert()]].

# Инициализация, присваивание и уничтожение элементов

Когда активное значение имеет тип `Т`, за обработку его инициализации, присваивания и уничтожения отвечает базовый класс `VariantChoice`. В данном разделе эти фундаментальные операции рассматриваются при заполнении соответствующих пробелов шаблона класса `VariantChoice`.

## Инстанцирования

Мы начинаем с инициализации `Variant` с помощью значения одного из типов, которые он может хранить (например, инициализация `Variant<int, double, string>` значением `double`). Это достигается с помощью конструкторов `VariantChoice`, которые принимают значение типа `Т`:
```c++
#include <utility> // for std::move{)
template<typename T, typename... Types>
VariantChoice<T, Types...>::VariantChoice(T const& value)
{
	// Размещение значения в буфере
	//и установка дискриминатора типа:
	new (getDerived().getRawBuffer()) Т(value);
	getDerived().setDiscriminator(Discriminator);
}

template<typename T, typename... Types>
VariantChoice<T, Types...>::VariantChoice(T&& value)
{
	// Размещение перемещаемого значения в буфере
	// и установка дискриминатора типа:
	new (getDerived().getRawBuffer()) Т(std::move(value));
	getDerived().setDiscriminator(Discriminator);
}
```

В каждом случае конструктор использует операцию `CRTP getDerived()` для доступа к совместно используемому буферу, а затем выполняет размещающий оператор `new` для инициализации хранилища новым значением типа `Т`. Первый конструктор является копирующим конструктором, в то время как второй — перемещающим конструктором. Затем конструкторы устанавливают значение дискриминатора для указания (динамического) типа хранимого значения.

Наша конечная цель состоит в получении возможности инициализировать объединение значением любого из его типов, даже учитывая неявные преобразования. Например:
```c++
// Неявное преобразование в string:
Variant<int, double, string> v("hello");
```

Для этого мы наследуем конструкторы `VariantChoice` в самом `Variant` с использованием объявлений `using`:
```c++
using VariantChoice<Types, Types...>::VariantChoice...;
```

По сути, это объявление `using` создает конструкторы `Variant`, которые копируют или перемещают каждый тип `Т` в `Types`. Для `Variant<int, double, string>` такими конструкторами являются:
```c++
Variant(int const&);
Variant(int&&);
Variant(double const&);
Variant(double&&);
Variant(string const&);
Variant(string&&);
```

## Уничтожение

Когда `Variant` инициализируется, значение создается в его буфере. Операция `destroy` выполняет уничтожение этого значения:
```c++
template<typename T, typename... Types>
bool VariantChoice<T, Types...>::destroy()
{
	if (getDerived().getDiscriminator() == Discriminator)
	{
		// Если типы совпадают, вызывается размещающее удаление:
		getDerived().template getBufferAs<T>()->~T();
		return true;
	}
	
	return false;
}
```

При соответствии дискриминаторов мы явным образом уничтожаем содержимое буфера путем вызова соответствующего деструктора с использованием `->~Т()`.

Операция `VariantChoice::destroy()` полезна только тогда, когда дискриминатор совпадает. Тем не менее в общем случае мы хотим уничтожить значение, хранящееся в `Variant`, независимо от того, какой тип в настоящее время активен. Поэтому `Variant::destroy()` вызывает все операции `VariantChoice::destroy()` в базовых классах:
```c++
template<typename... Types>
void Variant<Types...>::destroy()
{
	// Вызов destroy() для каждого базового класса VariantChoice;
	// успешным будет максимум один вызов:
	bool results [] =
	{
		VariantChoice<Types, Types...>::destroy()...
	};

	// Указывает, что объект не хранит никакого значения
	this->setDiscriminator(0);
}
```

Раскрытие пакета в инициализаторе `results` гарантирует, что `destroy` вызывается для каждого из базовых классов `VariantChoice`. Успешным будет максимум один из этих вызовов (с подходящим дискриминатором), после чего объект остается пустым. Пустое состояние указывается нулевым значением дискриминатора.

Массив `results` сам по себе присутствует только для того, чтобы обеспечить контекст для использования списка инициализации; его фактические значения игнорируются. В C++17 для устранения необходимости в этой лишней переменной можно использовать [[Вглубь шаблонов#Выражения свертки|выражения свертки]]:
```c++
template<typename... Types>
void Variant<Types...>::destroy()
{
	// Вызов destroy() для каждого базового класса VariantChoice;
	// успешным будет максимум один вызов:
	(VariantChoice<Types, Types...>::destroy(), ...);
	
	// Указывает, что объект не хранит никакого значения
	this->setDiscriminator(0);
}
```

## Присваивание

Присваивание основывается на инициализации и уничтожении, что иллюстрируется операторами присваивания:
```c++
template<typename T, typename... Types>
auto VariantChoice<T,Types...>::operator=(T const& value)->Derived&
{
	if (getDerived().getDiscriminator() == Discriminator)
	{
		// Присваивание нового значения того же типа:
		*getDerived().template getBufferAs<T>() = value;
	}
	else
	{
		// Присваивание нового значения другого типа:
		getDerived().destroy(); // destroy() для всех типов
		new (getDerived().getRawBuffer())
			T (value);          // Размещение нового значения

		getDerived().setDiscriminator(Discriminator);
	}
	
	return getDerived();
}

template<typename T, typename... Types>
auto VariantChoice<T, Types...>::operator= (T&& value) -> Derived&
{
	if (getDerived().getDiscriminator() == Discriminator)
	{
		// Присваивание нового значения того же типа:
		*getDerived().template getBufferAs<T>() = std::move(value);
	}
	else
	{
		// Присваивание нового значения другого типа:
		getDerived().destroy(); 	// destroy() для всех типов
		new (getDerived().getRawBuffer())
			T(std::move(value));    // Размещение нового значения

		getDerived().setDiscriminator(Discriminator);
	}
	
	return getDerived();
}
```

Как и в случае с инициализацией одним из типов хранимых значений, каждый `VariantChoice` предоставляет собственный оператор присваивания, который копирует (или перемещает) значение своего типа в хранилище `Variant`. Эти операторы присваивания наследуются типом `Variant` с помощью следующего объявления `using`:
```c++
using VariantChoice<Types, Types...>::operator=...;
```

Реализация оператора присваивания имеет два пути. Если объект `Variant` уже хранит значение данного типа `Т` (идентифицируется путем соответствия дискриминатора), то оператор присваивания будет копировать (или перемещать) значение типа `Т` непосредственно в буфер. Дискриминатор при этом не изменяется.

Если в объекте хранится значение типа, отличного от `Т`, присваивание выполняется в два этапа: сначала текущее значение уничтожается с помощью вызова `Variant::destroy()`, а затем новое значение типа `Т` инициализируется с помощью размещающего `new` с соответствующим изменением дискриминатора.

При таком двухэтапном присваивании с помощью размещающего `new` возникают три распространенные проблемы, которые следует принять во внимание:
>
> присваивание самому себе;
> 
> исключения:
> 
> [[launder|std::launder()]].

***===Присваивание самому себе===***

Присваивание самому себе может произойти из-за выражения наподобие следующего:
```c++
v = v.get<T>()
```

При такой реализации двухэтапного присваивания, как показано выше, исходное значение будет уничтожено, прежде чем оно будет скопировано, что может привести к повреждению памяти. К счастью, присваивание самому себе подразумевает соответствие дискриминатора, так что такой код будет просто вызывать оператор присваивания для `Т`, а не выполнять оба этапа присваивания.

***===Исключения===***

Если уничтожение существующего значения завершается, но при инициализации нового значения генерируется исключение, — каким при этом будет состояние объекта `Variant`? В нашей реализации `Variant::destroy()` сбрасывает значение дискриминатора в нулевое. В случаях без генерации исключения дискриминатор будет должным образом установлен после завершения инициализации. Если же исключение генерируется во время инициализации нового значения, дискриминатор остается нулевым, указывая, что `Variant` не хранит никакого значения. В нашем дизайне это единственный способ получить `Variant` без значения.

Приведенная ниже программа показывает, как получить `Variant` без хранимого значения путем попытки копировать значение типа, копирующий конструктор которого генерирует исключение:
```c++
#include "variant.hpp"
#include <exception>
#include <iostream>
#include <string>

class CopiedNonCopyable : public std::exception
{
};

class NonCopyable
{
	public:
		NonCopyable()
		{
		}
		
		NonCopyable(NonCopyable const&)
		{
			throw CopiedNonCopyable();
		}
		
		NonCopyable(NonCopyable&&) = default;
		
		NonCopyables operator= (NonCopyable const&)
		{
			throw CopiedNonCopyable() ;
		}
		
		NonCopyable& operator= (NonCopyable&&) = default;
};

int main()
{
	Variant<int, NonCopyable> v(17);
	try
	{
		NonCopyable nc;
		v = nc;
	}
	catch (CopiedNonCopyable)
	{
		std::cout << "Копирующее присваивание "
				  << "NonCopyable завершилось неудачно." << '\n';
		
		if(!v.is<int>() && !v.is<NonCopyable>())
		{
			std::cout << "Variant не имеет значения." << '\n';
		}
	}
}
```

Вывод этой программы имеет следующий вид:
```
Копирующее присваивание NonCopyable завершилось неудачно.
Variant не имеет значения.
```

Доступ к объекту `Variant`, не содержащему значения, независимо от способа (через метод `get()` или механизм посетителя (`visitor`), описанный в следующем разделе) генерирует исключение `EmptyVariant`, которое позволяет программам восстановиться после этой исключительной ситуации. Функция-член `empty()` проверяет, не является ли объект пустым:
```c++
template<typename... Types>
bool Variant<Types... >::empty() const
{
	return this->getDiscriminator() == 0;
}
```

Третья проблема, связанная с нашим двухэтапным присваиванием, заключается в тонкости, о которой комитету по стандартизации C++ стало известно только в конце процесса стандартизации С++17. Далее мы вкратце обсудим ее.

### std::launder()

[[launder|см. std::launder()]]

# Посетители

Функции-члены `is()` и `get()` позволяют проверить, имеет ли действующее значение определенный тип, и получить доступ к значению с этим типом. Однако проверка всех возможных типов в пределах варианта быстро переходит в избыточную цепочку инструкций [[if|if]]. Например, следующий фрагмент выводит значение `Variant<int, double, string>` с именем `v`:
```c++
if(v.is<int>())
{
	std::cout << v.get<int>();
}
else if (v.is<double>())
{
	std::cout << v.get<double>();
}
else
{
	std::cout << v.get<string>();
}
```

Обобщение этого кода для вывода значения, хранящегося в произвольном объединении, требует рекурсивно инстанцируемого шаблона основной и вспомогательной функции. Например:
```c++
#include "variant.hpp"
#include <iostream>

template<typename V, typename Head, typename... Tail>
void printImpl(V const& v)
{
	if (v.template is<Head>0)
	{
		std::cout << v.template get<Head>();
	}
	else if constexpr(sizeof...(Tail) > 0)
	{
		printImpl<V, Tail...>(v);
	}
}

template<typename... Types>
void print(Variant<Types...> const& v)
{
	printImpl<Variant<Types...>, Types...> (v);
}

int main()
{
	Variant<int, short, float, double> v(1.5);
	print(v);
}
```

Это значительное количество кода для относительно простой операции. Чтобы его упростить, рассмотрим проблему расширения `Variant` операцией `visit()`. Затем клиент передает функциональный объект-посетитель, `operator()` которого будет вызываться с активным значением. Поскольку активное значение может быть любого из возможных типов `Variant`, этот `operator()`, вероятно, должен либо быть перегруженным, либо являться шаблоном функции. Например, универсальное лямбда-выражение обеспечивает шаблонный `operator()`, позволяющий нам лаконично представлять операцию вывода объединения `v`:
```c++
v.visit([](auto const& value)
{
	std::cout << value;
});
```

Это обобщенное лямбда-выражение примерно эквивалентно следующему функциональному объекту, полезному для компиляторов, если они еще не поддерживают обобщенные лямбда-выражения:
```c++
class VariantPrinter
{
	public:
		template<typename T>
		void operator()(T const& value) const
		{
			std::cout << value;
		}
};
```

Ядро операции `visit()` похоже на рекурсивную операцию [[print|print]]: она обходит типы `Variant`, проверяя, имеет ли активное значение данный тип (с помощью `is<T>()`), а найдя подходящий тип, выполняет соответствующие действия:
```c++
template<typename R, typename V, typename Visitor,
		 typename Head, typename... Tail>
R variantVisitlmpl(V&& variant, Visitor&& vis,
					Typelist<Head, Tail...>)
{
	if (variant.template is<Head>())
	{
		return static_cast<R>(
				std::forward<visitor>(vis)(
						std::forward<V>(variant).template get<Head>()));
	}
	else if constexpr(sizeof...(Tail) > 0)
	{
		return variantVisitImpl<R>(std::forward<V>(variant) ,
									std::forward<Visitor>(vis),
									Typelist<Tail...>());
	}
	else
	{
		throw EmptyVariant() ;
	}
}
```

`variantVisitImpl()` представляет собой шаблон свободной функции (не являющейся членом класса) с рядом параметров шаблона. Параметр шаблона `R` описывает тип результата операции посещения, к которому мы вернемся позднее. `V` является типом объединения, a `Visitor` представляет собой тип посетителя. `Head` и `Tail` используются для разделения типов `Variant` для эффективной рекурсии.

Первый [[if|if]] выполняет проверку (времени выполнения), имеет ли действующее значение данного `Variant` тип `Head`: если да, то значение извлекается из `Variant` с помощью `get<Head>()` и передается посетителю, завершая рекурсию. Второй [[if|if]] выполняет рекурсию, когда имеются иные элементы для рассмотрения. Если ни один из типов не подошел — значит, `Variant` не содержит значение, и в этом случае реализация генерирует исключение `EmptyVariant`.

Не считая вычисления типа результата, предоставляемого `VisitResult` (будет обсуждаться в следующем разделе), реализация `visit()` проста:
```c++
template<typename... Types>
template<typename R, typename Visitor>
VisitResult<R, Visitor, Types& ...>
Variant<Types...>::visit(Visitor&& vis)&
{
	using Result = VisitResult<R, Visitor, Types& ...>;
	return variantVisitImpl<Result>(*this, std::forward<visitor>(vis),
									Typelist<Types...>());
}

template<typename... Types>
template<typename R, typename Visitor>
VisitResult<R, Visitor, Types const& ...>
Variant<Types...>::visit(Visitor&& vis) const&
{
	using Result = VisitResult<R, Visitor, Types const& ...>;
	return variantVisitImpl<Result>(*this, std::forward<visitor>(vis),
										Typelist<Types...>());
}

template<typename... Types>
template<typename R, typename Visitor>
VisitResult < R, Visitor, Types&& ... >
Variant<Types...>::visit(Visitor&& vis)&&
{
	using Result = VisitResult < R, Visitor, Types && ... >;
	return variantVisitImpl<Result>(std::move(*this),
									std::forward<Visitor>(vis),
									Typelist<Types...>());
}
```

Реализации выполняют непосредственное делегирование функции `variantVisitImpl`, передавая ей само объединение, посетителя (с помощью прямой передачи) и полный перечень типов. Единственное различие между тремя приведенными реализациями заключается в том, как они передают объединение — как `Variant&`, `Variant const&` или `Variant&&`.

## Возвращаемый тип visit()

Возвращаемый тип `visit()` остается загадкой. Данный посетитель может иметь различные перегрузки `operator()`, которые производят различные возвращаемые типы, шаблонные операторы `operator()`, возвращаемый тип которых зависит от типов параметров или их сочетания. Например, рассмотрим следующее обобщенное лямбда-выражение:
```c++
[](auto const& value)
{
	return value + 1;
}
```

Возможность явно указать возвращаемый тип важна, когда нет универсального решения. Однако требование явно указывать тип результата во всех случаях может давать излишне многословный код. Поэтому `visit()` предоставляет оба варианта, используя сочетание аргумента шаблона по умолчанию и простой метапрограммы. Вспомните объявление `visit()`:
```c++
template<typename R = ComputedResultType, typename Visitor>
VisitResult<R, Visitor, Types& ...> visit(Visitor && vis) &;
```

Параметр шаблона `R`, который мы явно указываем в приведенном выше примере, также имеет аргумент по умолчанию, так что он не всегда обязан быть указан явно. Этот аргумент по умолчанию представляет собой неполный тип ограничителя `ComputedResultType`:
```c++
class ComputedResultType;
```

Для вычисления своего возвращаемого типа `visit()` проходит по всем параметрам шаблона `VisitResult` — шаблона псевдонима, который обеспечивает доступ к новому свойству типа `VisitResultT`:
```c++
// Явно указанный возвращаемый тип посетителя:

template<typename R, typename Visitor, typename... ElementTypes>
class VisitResultT
{
	public:
		using Type = R;
};

template<typename R, typename Visitor, typename... ElementTypes>
using VisitResult =
		typename VisitResultT<R, Visitor, ElementTypes...>::Type;
```

Основное определение `VisitResultT` обрабатывает случаи, когда явно указан аргумент `R`, так что `Туре` определен как `R`. Отдельная частичная специализация применяется, когда `R` получает аргумент по умолчанию, `ComputedResultType`:
```c++
template<typename Visitor, typename... ElementTypes>
class VisitResultT<ComputedResultType, Visitor, ElementTypes...>
{
	...
}
```

Эта частичная специализация отвечает за вычисление соответствующего возвращаемого типа для общего случая и является предметом рассмотрения следующего раздела.

## Общий возвращаемый тип

Как при вызове посетителя, который может производить различные возвращаемые типы для каждого из типов элементов объединения, можно объединить эти типы в один-единственный возвращаемый тип `visit()`? Есть некоторые очевидные случаи — если посетитель возвращает один и тот же тип для каждого типа элемента, то он должен быть возвращаемым типом `visit()`.

C++ уже имеет понятие [[Шаблоны функций#Возвращаемый тип как общий тип|общего возвращаемого типа]]: в тернарном выражении `b?х:у` тип выражения является общим типом для типов `х` и `у`. Например, если `х` имеет тип `int`, а `у` имеет тип `double`, то общим типом является тип `double`, потому что `int` повышается до `double`. Можно представить понятие общего типа в виде свойства типа:
```c++
using std::declval;
template<typename T, typename U>
class CommonTypeT
{
	public:
		using Type = decltype(true ? declval<T>() : declval<U>());
};

template<typename T, typename U>
using CommonType = typename CommonTypeT<T, U>::Type;
```

Понятие общего типа расширяется для множества типов: общий тип — это тип, к которому могут быть расширены все типы множества. Для нашего посетителя мы хотим вычислить общий тип для возвращаемых типов, которые посетитель будет производить при вызове с каждым из типов объединения:
```c++
#include "accumulate.hpp"
#include "commontype.hpp"

// Возвращаемый тип, полученный при вызове
// посетителя со значением типа Т:
template<typename Visitor, typename Т>
using VisitElementResult = decltype(declval<Visitor>()(declval<T>()));

// Общий возвращаемый тип для посетителя,
// вызванного с каждым из данных типов элементов:
template<typename Visitor, typename... ElementTypes>
class VisitResultT<ComputedResultType, Visitor, ElementTypes...>
{
		using ResultTypes =
				Typelist<VisitElementResult<visitor, ElementTypes>...>;
	public:
		using Type =
				Accumulate<PopFront<ResultTypes>, CommonTypeT,
							Front<ResultTypes>>;
};
```

Вычисление `VisitResult` выполняется в два этапа. Сначала `VisitElementResult` вычисляет возвращаемый тип, создаваемый при вызове посетителя со значением типа `Т`. Эта метафункция применяется к каждому из данных типов элементов, чтобы определить все возвращаемые типы, которые может производить посетитель, и захватывает результат в список типов `ResultTypes`.

Затем в вычислениях используется алгоритм [[accumulate|Accumulate]], для того, чтобы применить вычисление общего типа к списку возвращаемых типов. Его начальное значение (третий аргумент [[accumulate|Accumulate]]) представляет собой первый возвращаемый тип, посредством `CommonTypeT` объединяется с последовательными значениями из остальной части списка типа `ResultTypes`. Конечным результатом является общий тип, к которому могут быть приведены все возвращаемые типы посетителей, или ошибка, если возвращаемые типы несовместимы.

Начиная с C++11, стандартная библиотека предоставляет соответствующее свойство типов, [[common_type|std::common_type<>]], которое, эффективно комбинируя `CommonTypeT` и [[accumulate|Accumulate]], использует этот подход для того, чтобы получить общий тип для произвольного количества переданных типов (см. #раздел_Г_5). С помощью [[common_type|std::common_type<>]] реализация `VisitResultT` упрощается:
```c++
template<typename Visitor, typename... ElementTypes>
class VisitResultT<ComputedResultType, Visitor, ElementTypes...>
{
	public:
		using Type = std::common_type_t<
							VisitElementResult<Visitor,ElementTypes>...>;
};
```

Следующая демонстрационная программа выводит тип, полученный путем передачи посетителю обобщенного лямбда-выражения, которое добавляет `1` к получаемому значению:
```c++
#include "variant.hpp"
#include <iostream>
#include <typeinfo>

int main()
{
	Variant<int, short, double, float> v(1.5);
	auto result = v.visit([](auto const & value)
	{
		return value + 1;
	});
	
	std::cout << typeid(result).name() << ' \n';
}
```

Выходом этой программы будет имя [[type_info|type_infо]] для `double`, потому что это тип, к которому могут быть преобразованы все возвращаемые типы.

# Инициализация и присваивание Variant

Контролируемые объединения можно инициализировать и присваивать различными способами, включая конструирование по умолчанию, копирующее и перемещающее конструирования, а также копирующее и перемещающее присваивания. В этом разделе подробно описаны эти операции `Variant`.

***===Инициализация по умолчанию===***

Должны ли контролируемые объединения предоставлять конструкторы по умолчанию? Если нет, то такие объединения может быть излишне трудно использовать, потому что они всегда должны будут иметь начальное значение (даже когда программно оно не имеет смысла). Если же оно предоставляет конструктор по умолчанию, то какова должна быть его семантика? Одна возможная семантика состоит в том, чтобы для инициализации по умолчанию иметь пустое объединение, представленное нулевым дискриминатором.

Однако такие пустые объединения в общем случае полезными не являются (например, их нельзя посещать или искать значения для извлечения), а кроме того, такой режим инициализации по умолчанию будет способствовать тому, что уникальное состояние [[variant#Присваивание|пустого объединения]] превратится в достаточно распространенное.

В качестве альтернативы конструктор по умолчанию может строить значение некоторого типа. Для нашего объединения мы следуем семантике `std::variant<>` C++17 и конструируем по умолчанию значение первого типа в списке типов:
```c++
template<typename... Types>
Variant<Types...>::Variant()
{
	*this = Front<Typelist<Types...>>();
}
```

Этот подход прост и предсказуем, и в большинстве случаев позволяет избежать введения пустых объединений. Его поведение демонстрирует следующая программа:
```c++
#include "variant.hpp"
#include <iostream>

int main()
{
	Variant<int, double> v;

	if (v.is<int> ())
	{
		std::cout << "Построенный no умолчанию v хранит int "
					<< v.get<int>() << ’ \n ’;
	}

	Variant<double, int> v2;
	
	if(v2.is<double> ())
	{
		std::cout << "Построенный no умолчанию v2 хранит double
					<< v2.get<double>() << ` \n `;
	}
}
```

Вывод данной программы имеет следующий вид:
```
Построенный по умолчанию v хранит int О
Построенный по умолчанию v2 хранит double О
```

***===Копирующая/перемещающая инициализация===***

Копирующая и перемещающая инициализация более интересна. Для копирования исходного объединения нужно определить, какой тип хранится в настоящее время, создать с помощью копирующего конструирования это значение в буфере и установить значение дискриминатора. К счастью, `visit()` обрабатывает декодирование активного значения исходного объединения, а оператор копирующего присваивания, унаследованный от `VariantChoice`, создает копию значения в буфере, что позволяет написать компактную реализацию:
```c++
template<typename... Types>
Variant<TypesVariant(Variant const& source)
{
	if (!source.empty())
	{
		source.visit([&](auto const & value)
		{
			*this = value;
		});
	}
}
```

Перемещающий конструктор отличается только тем, что использует [[move|std::move]] при посещении исходного объединения и выполняет перемещающее присваивание из исходного значения:
```c++
template<typename... Types>
Variant<Types...>::Variant(Variant&& source)
{
	if (!source.empty())
	{
		std::move(source).visit([&](auto&& value)
		{
			*this = std::move(value);
		});
	}
}
```

Один из самых интересных аспектов реализации на основе идиомы посетителя заключается в том, что он работает и для шаблонных вариантов операций копирования и перемещения. Например, шаблонный копирующий конструктор может быть определен следующим образом:
```c++
template<typename... Types>
template<typename... SourceTypes>
Variant<Types...>::Variant(Variant<SourceTypes...> const& source)
{
	if (!source.empty())
	{
		source.visit([&](auto const & value)
		{
			*this = value;
		});
	}
}
```

Поскольку этот код посещает исходное объединение, присваивание `*this` будет выполняться для каждого из его типов. Разрешение перегрузки для этого присваивания будет находить наиболее подходящий целевой тип для каждого исходного типа, выполняя при необходимости неявные преобразования. В следующем примере показано построение и присваивание из различных типов объединения:
```c++
#include "variant.hpp"
#include <iostream>
#include <string>

int main()
{
	Variant<short, float, char const*> v1((short)123);
	
	Variant<int, std::string, double> v2(v1);
	std::cout << "v2 содержит int " << v2.get<int>() << '\n';
	
	v1 = 3.14f;
	Variant<double, int, std::string> v3(std::move(v1));
	std::cout << "v3 содержит double " << v3.get<double>() << '\n';

	v1 = "hello";
	Variant<double, int, std::string> v4(std::move(v1));
	std::cout << "v4 содержит string " << v4.get<std::string>() << '\n';
}
```

Построение или присваивание `v1` переменным `v2` или `v3` включает целочисленное расширение (`short` в `int`), расширение значений с плавающей точкой (`float` в `double`) и пользовательские преобразования (`char const*` в `std::string`). Выход этой программы имеет следующий вид:
```
v2 содержит int 123
v3 содержит double 3.14
v4 содержит string hello
```

***===Присваивание===***

Операторы присваивания `Variant` похожи на копирующий и перемещающий конструкторы, показанные выше. Здесь мы приводим только оператор копирующего присваивания:
```c++
template<typename... Types>
Variant<Types...>& Variant<Types...>::operator= (Variant const&
		source)
{
	if (!source.empty())
	{
		source.visit([&](auto const & value)
		{
			*this - value;
		});
	}
	else
	{
		destroy();
	}
	
	return *this;
}
```

Единственное интересное дополнение находится в ветви `else`: когда исходное объединение не содержит значения (на что указывает нулевой дискриминатор), мы уничтожаем значение, неявно устанавливая его дискриминатор равным `0`.

