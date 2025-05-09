
# Инициализация нулем

Для фундаментальных типов данных, таких как `int`, `double` или указатели, не существует стандартного конструктора, который инициализировал бы эти величины каким-либо полезным значением по умолчанию. Напротив, каждая неинициализированная локальная переменная имеет неопределенное значение:
```c++
void foo()
{
	int х;      // Значение х не определено
	int* ptr;   // ptr может указывать куда угодно (но не в никуда)
}
```

Теперь допустим, что мы пишем шаблоны и хотим иметь переменные типа шаблона, инициализированные значением по умолчанию. У нас возникает проблема: ведь с помощью простого определения для встроенных типов этого сделать нельзя:
```c++
template<typename Т>
void foo()
{
	Т х;          // Если Т — встроенный тип, значение х не определено
}
```

По этой причине для встроенных типов можно явно вызывать стандартный конструктор, который инициализирует их нулем (или значением `false` для величин типа `bool`, а для указателей — значением [[nullptr_t#nullptr|nullptr]]). Следовательно, можно обеспечить корректную инициализацию по умолчанию даже для встроенных типов с помощью кода наподобие приведенного ниже:
```c++
template<typename Т>
void foo()
{
	Т х{};      // х равно 0 (false, nullptr) если Т — встроенный тип
}
```

Этот способ инициализации называется инициализацией значением (value initialization), что означает, что для объекта вызывается конструктор либо он инициализируется нулем (zero initialize). Это работает, даже если конструктор объявлен как [[explicit|explicit]].

До С++11 синтаксис, гарантирующий корректную инициализацию, был следующим:
```c++
Т х = Т(); // х равно 0 (false, nullptr) если Т — встроенный тип
```

До C++17 этот механизм (который все еще поддерживается) работал, только если конструктор, выбранный для копирующей инициализации, не был объявлен как [[explicit|explicit]]. В C++17 обязательное устранение копирования позволяет обойти это ограничение, так что работает любой вариант синтаксиса, но инициализация с помощью фигурных скобок дает возможность использовать конструктор со [[Инициализация|списком инициализации]], если конструктор по умолчанию недоступен.

Для гарантии того, что член шаблонного класса, имеющий параметризованный тип, будет инициализирован, следует определить конструктор по умолчанию, который использует инициализатор в фигурных скобках для инициализации членов класса.
```c++
template<typename Т>
class MyClass
{
	private:
		Т х;
		
	public:
		MyClass() : х{}     // Гарантирует инициализацию х даже
		{}                  // для встроенных типов

		...
};
```

Синтаксис для стандартов до C++11
```c++
MyClass() : х()             // Гарантирует инициализацию х даже
							// для встроенных типов
{}
```

также остается работоспособен.

Начиная с C++11, можно также предоставить инициализацию по умолчанию для нестатических членов, так что допустим следующий код:
```c++
template<typename Т>
class MyClass
{
	private:
		Т х{};         // Инициализация х нулем, если не указано иное

	...
};
```

Однако учтите, что аргументы по умолчанию не могут использовать этот синтаксис. Например:
```c++
template<typename Т>
void foo(T р{})        // Ошибка
{  
	...
}
```

Вместо этого следует написать:
```c++
template<typename Т>
void foo(T р = Т{})    // ОК (до С++11 следует использовать Т())
{
	...
}
```

