# const
[[#const]]
[[constexpr|constexpr]]
[[consteval]|consteval]

C++ поддерживает два понятия неизменяемости (объект с неизменяемым состоянием):
* const: примерно означает “Я обещаю не изменять это значение”. Это используется в первую очередь для указания интерфейсов, чтобы данные можно было передавать функциям с помощью указателей и ссылок, не опасаясь их изменения. Компилятор проверяет исполнение обещания, данного `const`. Значение `const` может быть вычислено во время выполнения.
* [[constexpr|constexpr]]: примерно означает “вычисляется во время компиляции”. Это ключевое слово используется в первую очередь для указания констант, чтобы разрешить размещение данных в памяти, доступной только для чтения (где они вряд ли будут повреждены), и для повышения производительности. Значение [[constexpr|constexpr]] должно быть вычислено компилятором.

Например:
```c++
constexpr int dmv = 17;              // dmv is a named constant
int var = 17;                        // var is not a constant
const double sqv = sqrt(var);        // sqv is a named constant, possibly 
									// computed at run time
double sum(const vector<double>&);   // sum will not modify its argument 
vector<double> v {1.2, 3.4, 4.5};    // v is not a constant
const double s1 = sum(v);            // OK: sum(v) is evaluated at run time
constexpr double s2 = sum(v);        // error: sum(v) is not a constant expression
```

Чтобы функцию можно было использовать в константном выражении, то есть в выражении, которое будет вычисляться компилятором, она должна быть определена [[constexpr|constexpr]] или [[consteval|consteval]]. Например:
```c++
constexpr double square(double x) { return x * x; }
constexpr double max1 = 1.4*square(17);  // OK: 1.4*square(17) is a 
										// constant expression
constexpr double max2 = 1.4*square(var); // error: var is not a constant,
										// so square(var) is not a constant
const double max3 = 1.4*square(var);    // OK: may be evaluated at run time
```

Функция [[constexpr|constexpr]] может использоваться для не константных аргументов, но, когда это делается, результат является не константным выражением. Мы разрешаем вызывать функцию [[constexpr|constexpr]] с не константными аргументами в контекстах, которые не требуют константных выражений. Таким образом, нам не нужно определять по существу одну и ту же функцию дважды: один раз для константных выражений и один раз для переменных. Когда мы хотим, чтобы функция использовалась только для вычисления во время компиляции, мы объявляем ее [[consteval|consteval]], а не [[constexpr|constexpr]]. Например:
```c++
consteval double square2(double x) { return x*x; }
constexpr double max1 = 1.4*square2(17);            // OK: 1.4*square(17) is a 
												   // constant expression
const double max3 = 1.4*square2(var);               // error: var is not a constant
```

Функции, объявленные [[constexpr|constexpr]] или [[consteval|consteval]], являются версией понятия чистых функций в C++. Они не могут иметь побочных эффектов и могут использовать только информацию, переданную им в качестве аргументов. В частности, они не могут изменять нелокальные переменные, но они могут иметь циклы и использовать свои собственные локальные переменные. Например:
```c++
constexpr double nth(double x, int n)      // assume 0<=n
{
	double res = 1;
	int i = 0;
	while (i < n) {               // while-loop: do while the condition is true
		res *= x;
		++i;
	}
	return res;
}
```

В ряде мест константные выражения требуются языковыми правилами (например, для границ массива, литералы оператора `case`, аргументы значения шаблона и констант, объявленных с помощью [[constexpr|constexpr]]). В других случаях вычисления времени компиляции важны для повышения производительности. Независимо от проблем с производительностью, понятие неизменяемости (объекта с неизменяемым состоянием) является важной концепцией проектирования.
