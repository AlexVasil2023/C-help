
[[template Нетиповые параметры шаблонов|template Нетиповые параметры шаблонов]] 3
1. [[#Параметры шаблонов классов, не являющиеся типами|Параметры шаблонов классов, не являющиеся типами]] 3.1
2. [[#Параметры шаблонов функций, не являющиеся типами|Параметры шаблонов функций, не являющиеся типами]] 3.2
3. [[#Ограничения на параметры шаблонов, не являющиеся типами|Ограничения на параметры шаблонов, не являющиеся типами]] 3.3
4. [[#Тип параметра шаблона auto|Тип параметра шаблона auto]] 3.4
5. [[#Объявление not-type шаблонных параметров с помощью auto C++17|Объявление not-type шаблонных параметров с помощью auto C++17]]

# Нетиповые параметры шаблонов

Параметры шаблонов классов или функций не обязаны быть типами. Они могут быть и обычными величинами. В этом случае, как и для шаблонов с параметрами типа, программист создает код, в котором некоторые детали остаются открытыми до момента, когда этот код будет использоваться. Однако эти детали представляют собой не типы, а величины. При использовании такого шаблона эти величины требуется указать явно, после чего выполняется инстанцирование кода шаблона. В данной главе эта возможность продемонстрирована на примере новой версии шаблона класса стека. Кроме того, здесь приведен пример параметров шаблона функции, не являющихся типами, и рассмотрены некоторые ограничения применения этой технологии.

# Параметры шаблонов классов, не являющиеся типами

В отличие от примеров реализаций стека из предыдущих глав его можно реализовать и на базе массива с фиксированным размером, в котором будут храниться элементы. Преимущество этого метода состоит в сокращении расхода ресурсов на управление памятью, независимо от того, выполняет это управление программист или стандартный контейнер. Однако возникает другая проблема: какой размер для такого стека будет оптимальным? Если указать размер меньший, чем требуется, это приведет к переполнению стека. Если задать слишком большой размер, память будет расходоваться неэффективно. Напрашивается вполне резонное решение: оставить определение этого значения на усмотрение пользователя — он должен указать максимальный размер, необходимый для работы именно с его элементами.

Для этого определим размер в качестве параметра шаблона.
```c++
#include <array>
#include <cassert>

template<typename T, std::size_t Maxsize>
class Stack
{
	private:
		std::array<T, Maxsize> elems;     // Элементы
		std::size_t numElems;             // Текущее количество элементов

	public:
		Stack();                          // Конструктор
		void push(T const& elem);         // Добавление в стек
		void pop();                       // Снятие со стека
		Т consts top() const;             // Возврат верхнего элемента
		
		bool empty() const                // Проверка пустоты стека
		{
			return numElems == 0;
		}
		
		std::size_t sized const           // Текущее количество элементов
		{
			return numElems;
		}
};

template<typename T, std::size_t Maxsize>
Stack<T, Maxsize> ::Stack()
	: numElems(0)                         // Изначально элементов нет
{
	// Никаких действий
}

template<typename Т, std::size_t Maxsize>
void Stack<T, Maxsize> ::push(T const& elem)
{
	assert(numElems < Maxsize);
	elems[numElems] = elem;              // Добавление элемента
	
	++numElems;                          // Увеличение количества элементов
}

template<typename Т, std::size_t Maxsize>
void Stack<T, Maxsize>::pop()
{
	assert(!empty());
	--numElems;                         // Уменьшение количества элементов
}

template<typename T, std::size_t Maxsize>
T const& Stack<T, Maxsize>::top() const
{
	assert(!empty());
	return elems[numElems-1];            // Возврат последнего элемента
}
```

Новый второй параметр шаблона `Maxsize` имеет тип `int`. Он задает размер внутреннего массива элементов стека:
```c++
template<typename Т, std::size_t Maxsize>
class Stack
{
	private:
		std::array<T, Maxsize> elems; // Элементы
};
```

Кроме того, он используется в функции `push()` для проверки заполненности стека.
```c++
template<typename Т, std::size_t Maxsize>
void Stack<T, Maxsize>::push(T consts elem)
{
	assert(numElems < Maxsize);
	elems[numElems] = elem;           // Добавление элемента
	++numElems;                       // Увеличение количества элементов
}
```

Для того чтобы использовать этот шаблон класса, следует указать как тип элементов, так и максимальный размер стека.
```c++
#include "stacknontype.hpp"
#include <iostream>
#include <string>

int main()
{
	Stack<int, 20> int20Stack;          // Стек для 20 int
	Stack<int, 40> int40Stack;          // Стек ДЛЯ 40 int
	Stack<std::string, 40> stringStack; // Стек ДЛЯ 40 string

	// Работа co стеком для 20 int
	int20Stack.push(7);
	std::cout << int20Stack.top() << '\n';
	int20Stack.pop();
	
	// Работа co стеком для 40 строк
	stringStack.push("hello");
	std::cout << stringStack.top() << '\n';
	stringStack.pop();
}
```

Обратите внимание на то, что каждый экземпляр шаблона имеет свой собственный тип. Таким образом, `int20Stack` и `int40Stack` — это два различных типа. Преобразование этих типов один в другой — ни явное, ни неявное — не определено. Следовательно, нельзя использовать один тип вместо другого и нельзя присваивать значение одного из этих типов другому.

Остается добавить, что для параметров шаблона можно указать значения по умолчанию:
```c++
template<typename Т = int, std::size_t MaxSize = 100>
class Stack
{
	...
};
```

Однако с точки зрения хорошего дизайна это может не быть корректным решением в данном примере. Значения по умолчанию должны быть интуитивно корректны. Но ни тип `int`, ни максимальный размер, равный 100, не кажутся интуитивно корректными для типа обобщенного стека. Таким образом, будет лучше, если оба эти значения программист будет указывать явно, так что эти два атрибута всегда будут документированы в объявлении.

# Параметры шаблонов функций, не являющиеся типами

Можно также определить параметры, не являющиеся типами, и для шаблонов функций. Например, приведенный ниже шаблон функции определяет группу функций, предназначенных для добавления некоторого значения.
```c++
template<int Val, typename T>
T addValue(T x)
{
	return x + Val;
}
```

Функции такого вида могут быть полезны тогда, когда функции или операции используются в качестве параметров. Например, при работе со стандартной библиотекой шаблонов экземпляр этого шаблона функции можно использовать для добавления определенного значения к каждому элементу коллекции:
```c++
std::transform(source.begin(),
				source.end(),      // Начало и конец источника
				dest.begin(),      // Начало приемника
				addValue<5, int>); // Операция
```

Последний аргумент инстанцирует шаблон функции `addValue<>` для добавления 5 к переданному значению типа `int`. Получающаяся функция вызывается для каждого элемента исходной коллекции `source`, в процессе чего она преобразуется в целевую коллекцию `dest`.

Обратите внимание: вы должны указать аргумент `int` в качестве параметра `Т` шаблона `addValue<>`. Вывод работает только при непосредственном вызове, а алгоритму `std::transform()` требуется полный тип для вывода типа четвертого параметра. В языке нет поддержки подстановки/вывода только некоторых параметров шаблона с последующим рассмотрением и выводом прочих параметров.

Можно также указать, что параметр шаблона выводится из предыдущего параметра — например, чтобы получить тип возвращаемого значения из переданного параметра, не являющегося типом:
```c++
template<auto Val, typename Т = decltype(Val)>
T foo();
```

или чтобы гарантировать, что переданное значение того же типа, что и переданный тип:
```c++
template <typename Т, Т Val = Т{}>
Т bar();
```

# Ограничения на параметры шаблонов, не являющиеся типами

Учтите, что на параметры шаблонов, не являющиеся типами, накладываются определенные ограничения. В общем случае такими параметрами могут быть только целочисленные константы (включая перечисления), указатели на объекты/функции/члены, l-ссылки на объекты или функции либо [[nullptr_t#std nullptr_t|std::nullptr_t]] (тип значения [[nullptr_t#nullptr|nullptr]]).

Использование чисел с плавающей точкой и объектов с типом класса в качестве параметров шаблона не разрешено.
```c++
template<double VAT>        // Ошибка: значения с плавающей точкой в
double process(double v)    // качестве параметров шаблонов не разрешены
{
	return v * VAT;
}

template<std::string name>  // Ошибка: объекты классов в качестве
class MyClass               // параметров шаблонов не разрешены
{
	...
};
```

При передаче в качестве аргументов шаблона указателей или ссылок объекты не должны быть строковыми литералами, временными значениями, членами-данными или иными подобъектами. Эти ограничения ослаблялись с каждой новой версией C++, и до C++17 применялись дополнительные ограничения:
* в С++98 и С++03 объекты должны были иметь внешнее связывание;
* в С++11 и С++14 объекты должны были иметь внешнее или внутреннее связывание.

Таким образом, следующий код невозможен:
```c++
template<char const* name>
class Message
{
	...
};

Message<"hi"> x;       // Ошибка: строковый литерал "hi" не разрешен
```

Однако есть и обходные пути (зависящие от используемой версии C++):
```c++
extern char const s03[] = "hi";     // Внешнее связывание
char const s11[] = "hi";            // Внутреннее связывание

int main()
{
	Message<s03> m03;               // OK (все версии)
	Message<s11> m11;               // OK, начиная с С++11
	
	static char const s17[] = "hi"; // Связывания нет
	Message<s17> m17;               // ОК, начиная с С++17
```

Во всех трех случаях массив константных символов инициализируется строкой `"hi"`, и этот объект используется в качестве параметра шаблона, объявленного как `char const*`. Этот способ работает во всех версиях C++, если объект имеет внешнее связывание (s03), в С++11 и С++14, если он имеет внутреннее связывание (s 11), и, начиная с С++17, если он не имеет связывания вообще.

Подробнее этот вопрос рассматривается в #разделе_12_3_3, а в #разделе_17_2 освещаются возможные изменения в этой области в будущем.

> **Избежание неверных выражений**

Аргументами параметров шаблонов, не являющихся типами, могут быть любые выражения времени компиляции. Например:
```c++
template<int I, bool В>
class С;

...

С < sizeof(int) + 4, sizeof(int) == 4 > с;
```

Обратите, однако, внимание на то, что если в выражении используется оператор `>`, то вы должны поместить все выражение в круглые скобки, так, чтобы вложенные `>` не были восприняты как завершение списка аргументов:
```c++
С<42, sizeof(int)> 4 > с;               // Ошибка: первый > завершает
										// список аргументов шаблона
С<42, (sizeof(int) > 4) > с;            // ОК
```

# Тип параметра шаблона auto

Начиная с C++17, можно определить параметр шаблона, не являющийся типом, как обобщенный, т.е. способный принимать любой тип, который разрешен для таких параметров. Используя эту возможность, можно предоставить еще более универсальный класс стека с фиксированным размером:
```c++
#include <array>
#include <cassert>

template<typename T, auto Maxsize>
class Stack
{
	public:
		using size_type = decltype(Maxsize);
	
	private:
		std::array<T, Maxsize> elems;  // Элементы
		size_type numElems;            // Текущее количество элементов

	public:
		Stack();                       // Конструктор
		void push(T const& elem);      // Добавление в стек
		void pop();                    // Снятие со стека
		T const& top() const;          // Возврат верхнего элемента

		bool empty() const             // Проверка пустоты стека
		{
			return numElems == 0;
		}

		size_type size() const         // Текущее количество элементов
		{
			return numElems;
		}

		// Конструктор
		template<typename T, auto Maxsize>
		Stack<T, Maxsize>::Stack()
			: numElems(0)               // Изначально элементов нет
		{
										// Никаких действий
		}

		template<typename T, auto Maxsize>
		void Stack<T, Maxsize>::push(T const& elem)
		{
			assert(numElems < Maxsize);
			elems[numElems] = elem;     // Добавление элемента
			++numElems;                 // Увеличение количества элементов
		}

		template<typename Т, auto Maxsize>
		void Stack<T, Maxsize>::pop()
		{
			assert(!empty());
			--numElems;                // Уменьшение количества элементов
		}

		template<typename T, auto Maxsize>
		T const& Stack<T, Maxsize>::top () const
		{
			assert(!empty());
			return elems[numElems - 1];// Возврат последнего элемента
		}
};
```

Определяя
```c++
template<typename Т, auto Maxsize>
class Stack
{
	...
}
```

с использованием заместителя типа [[auto|auto]], мы указываем, что `Maxsize` является значением, тип которого еще не указан. Он может быть любым типом, который разрешен для параметров шаблонов, не являющихся типами.

Внутри шаблона класса можно использовать как значение этого параметра:
```c++
std::array<T, Maxsize> elems;          // Элементы
```

так и его тип:
```c++
using size_type = decltype(Maxsize);
```

который затем можно применить, например, в качестве возвращаемого типа функции-члена `size()`:
```c++
size_type size() const
{
	return numElems;
}
```

Начиная с C++14, [[auto|auto]] можно использовать и в качестве возвращаемого типа, выводимого компилятором:
```c++
auto size() const                  // Текущее количество элементов
{
	return numElems;
}
```

При таком объявлении класса тип для возврата количества элементов определяется типом, используемым для указания максимального числа элементов при создании стека:
```c++
#include <iostream>
#include <string>
#include "stackauto.hpp"

int main()
{
	Stack<int, 20u> int20Stack;         // Стек для 20 целых (int)
	Stack<std::string, 40> stringStack; // Стек для 40 строк (string)

	// Работа co стеком для 20 целых (int)
	int20Stack.push(7);
	std::cout << int20Stack.top() << '\n';
	auto size1 = int20Stack.size();
	
	// Работа co стеком для 40 строк (string)
	stringStack.push("hello");
	std::cout << stringStack.top() << ' \n';
	auto size2 = stringStack.size();
	
	if (!std::is_same_v<decltype(size1), decltype(size2)>)
	(
		std::cout << "Типы size различны" << '\n';
	}
)
```

При объявлении
```c++
Stack<int, 20u> int20Stack;            // Стек для 20 целых (int)
```

внутренний тип размера стека — `unsigned int`, поскольку передано значение 20u.

При объявлении
```c++
Stack<std::string,40> stringStack;     // Стек для 40 строк (string)
```

внутренний тип размера стека — `int`, поскольку передано значение 40.

Функция `size()` для этих двух стеков возвращает разные типы, так что после
```c++
auto size1 = int20Stack.size();
...
auto size2 = stringStack.size();
```

типы переменных `size1` и `size2` различны. Используя стандартное свойство типа [[is_same|std::is_same]] (см. #раздел_Г_3_3) и ключевое слово [[decltуре|decltype]], мы можем в этом убедиться:
```c++
if (!std::is_same<decltype(size1), decltype(size2)>::value)
{
	std::cout << "Типы size различны" << '\n';
}
```

Этот код приводит к выводу на консоль
```c++
Типы size различны
```

Начиная с C++17, для свойств, возвращающих значения, можно использовать суффикс `_v` и опустить `::value` (см. #раздел_5_6):
```c++
if(!std::is_same_v<decltype(size1), decltype(size2)>)
{
	std::cout << "Типы size различны" << '\n';
)
```

Обратите внимание на то, что другие ограничения на тип параметров шаблона, не являющихся типами, остаются в силе. В частности, по-прежнему остаются в силе рассматривавшиеся  [[#Ограничения на параметры шаблонов, не являющиеся типами|ограничения]], накладываемые на возможные типы аргументов шаблона, не являющихся типами. Например:
```c++
Stack<int, 3.14> sd;   // Ошибка: аргумент типа с плавающей точкой
```

А поскольку можно также передать строки как константные массивы (начиная с C++17, даже как [[#Ограничения на параметры шаблонов, не являющиеся типами|локально объявленные статические]]), следующий код вполне корректен:
```c++
#include <iostream>

template<auto Т>        // Значение любого разрешенного параметра,
						//не являющегося типом (начиная с С++17)
class Message
{
	public:
		void print()
		{
			std::cout << T << '\n';
		}
};

int main()
{
	Message<42> msg1;
	msg1.print();        // Инициализация значением 42 и его вывод
	
	static char const s[] = "hello";
	Message<s> msg2; // Инициализация значением char const[6] "hello"
	msg2.print();    // и вывод этого значения

}
```

Заметим также, что возможна даже конструкция `template<decltype (auto) N>`, которая позволяет инстанцировать `N` как ссылку:
```c++
template<decltype(auto) N>
class С
{
	...
};

int i;
C<(i)> x;       // N представляет собой int&
```

Подробности представлены в #разделе_15_10_1.

# Объявление not-type шаблонных параметров с помощью auto C++17

Если тип объекта входит в список not-type template, он может быть использован в качестве аргумента шаблона с помощью `auto`.
```c++
template <auto ... seq> 
struct my_integer_sequence { 
	// реализация... 
}; 

// Явная передача типа ' int` в качестве аргумента шаблона 
auto seq = std::integer_sequence<int, 0, 1, 2>(); 
// Вывод типа `int` 
auto seq2 = my_integer_sequence<0, 1, 2>();
```

```c++
// C++17

template<auto n>
void Func() 
{ /* .... */ }

int main(){  
	Func<42>();  // выведет тип int  
	Func<'c'>(); // выведет тип char  
	
	return 0;
}
```
Ранее единственным способом передать **non-type template** параметр с неизвестным типом была передача двух параметров – типа и значения. Другими словами, ранее этот пример выглядел бы следующим образом:
```c++
// C++14
template<typename Type, Type n>
void Func() 
{ /* .... */ }

int main(){  
	Func<int, 42>();  
	Func<char, 'c'>();  
	
	return 0;
}
```

