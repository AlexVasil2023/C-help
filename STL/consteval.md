
# consteval

Когда мы хотим, чтобы функция использовалась только для вычисления во время компиляции, мы объявляем ее [[consteval|consteval]], а не [[constexpr|constexpr]]. Например:
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















