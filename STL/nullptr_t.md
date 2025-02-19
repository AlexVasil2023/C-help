
[[#nullptr]]
[[#std nullptr_t|std::nullptr_t]]
# nullptr

Мы стараемся гарантировать, что указатель всегда указывает на объект, чтобы разыменование его было допустимым. Когда у нас нет объекта, на который можно указать, или если нам нужно представить понятие “объект недоступен” (например, для конца списка), мы присваиваем указателю значение `nullptr` (“нулевой указатель”). Существует только один `nullptr`, общий для всех типов указателей:
```c++
double* pd = nullptr;
Link<Record>* lst = nullptr;          // pointer to a Link to a Record
int x = nullptr;                      // error: nullptr is a pointer not an integer
```

Часто бывает разумно проверить, что аргумент указателя действительно указывает на что-то:
```c++
int count_x(const char* p, char x)
	// count the number of occurrences of x in p[]
	// p is assumed to point to a zero-terminated array of char (or to nothing)
{
	if (p==nullptr)
		return 0;
		
	int count = 0;
	for (; *p!=0; ++p)
		if (*p==x)
			++count;
			
	return count;
}
```

Мы можем сместить указатель, чтобы он указывал на следующий элемент массива, используя `++`, а также опустить инициализатор в операторе `for`, если он нам не нужен.

Определение `count_x()` предполагает, что `char*` является строкой в стиле C, то есть указатель указывает на массив `char`, заканчивающийся нулем. Символы в строковом литерале неизменяемы, поэтому для возможности вызова `count_x("Hello!")` я объявил в `count_x()` константный аргумент `const char*`.

В старом коде обычно используется `0` или `NULL` вместо `nullptr`. Однако использование `nullptr` устраняет потенциальную путаницу между целыми числами (такими как `0` или `NULL`) и указателями (такими как `nullptr`).

В примере `count_x()` мы не используем часть оператора `for` предназначенную для инициализатора, поэтому мы можем использовать более простой оператор `while`:
```c++
int count_x(const char* p, char x)
	// count the number of occurrences of x in p[]
	// p is assumed to point to a zero-terminated array of char (or to nothing)
{
	if (p==nullptr)
		return 0;
		
	int count = 0;
	while (*p) {
		if (*p==x)
			++count;
		
		++p;
	}
	
	return count;
}
```

Оператор `while` выполняется до тех пор, пока его условие не станет ложным (`false`).

Проверка числового значения (например, `while (*p)` в `count_x()`) эквивалентна сравнению значения с 0 (например, `while (*p!=0)`). Проверка значения указателя (например, `if (p)`) эквивалентна сравнению значения с `nullptr` (например, `if (p!=nullptr)`).

Нет никакой “нулевой ссылки”. Ссылка должна ссылаться на допустимый объект (и реализации предполагают, что это так). Существуют неясные и хитроумные способы нарушить это правило; но не делайте этого.

# std::nullptr_t

#std_nullptr_t













