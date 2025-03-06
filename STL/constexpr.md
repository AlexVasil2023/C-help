
[[#constexpr C++11]]
[[#constexpr C++17]]
[[#Ослабление ограничений для constexpr функций C++14]]
[[#if constexpr|if constexpr]]

# constexpr C++11

Выражения, которые вычисляются во время компиляции. В константном выражении могут выполняться только несложные вычисления.

```c++
constexpr int square(int x) {
  return x * x;
}

int square2(int x) {
  return x * x;
}

int a = square(2);  // mov DWORD PTR [rbp-4], 4

int b = square2(2); // mov edi, 2
                    // call square2(int)
                    // mov DWORD PTR [rbp-8], eax
```

Константные выражения с классами:

```c++
struct Complex {
  constexpr Complex(double r, double i) : re(r), im(i) { }
  constexpr double real() { return re; }
  constexpr double imag() { return im; }

private:
  double re;
  double im;
};

constexpr Complex I(0, 1);
```

# constexpr C++17

В C++17 появилась возможность выполнять условные конструкции на этапе  компиляции. Это очень мощный инструмент, особенно полезный в  метапрограммировании. Приведу простой пример:

```c++
// C++17
#include <iostream>
#include <type_traits>

template <typename T>
auto GetValue(T t){  
	if constexpr (std::is_pointer<T>::value)  {    
		return *t;  
	}  
	else  {    
		return t;  
	}
}

int main(){  
	int v = 10;  
	
	std::cout << GetValue(v) << '\n'; // 10  
	std::cout << GetValue(&v) << '\n'; // 10  
	
	return 0;
}
```

```c++
template <typename T>
constexpr bool isIntegral() {
  if constexpr (std::is_integral<T>::value) {
    return true;
  } else {
    return false;
  }
}

static_assert(isIntegral<int>() == true);
static_assert(isIntegral<char>() == true);
static_assert(isIntegral<double>() == false);
struct S {};
static_assert(isIntegral<S>() == false);
```

До C++17 нам пришлось бы использовать [[SFINAE|SFINAE]] и [[enable_if|enable_if]]:

```c++
// C++14

template<typename T>
typename std::enable_if<std::is_pointer<T>::value,  std::remove_pointer_t<T>>::type
GetValue(T t)
{  
	return *t;
}

template<typename T>
typename std::enable_if<!std::is_pointer<T>::value, T>::type
GetValue(T t)
{  
	return t;
}

int main()
{  
	int v = 10;  
	std::cout << GetValue(v) << '\n'; // 10  
	std::cout << GetValue(&v) << '\n'; // 10  
	
	return 0;
}
```

Не трудно заметить, что код с `constexpr if` на порядок читабельнее.

# Ослабление ограничений для constexpr функций C++14

Обновления C++14 этот значительно расширили набор конструкций, допустимых в **`constexpr`** функциях: добавились **`if`-операторы**, множественные **`return`**, **циклы** и т.д.
```c++
constexpr int factorial(int n) {
  if (n <= 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}

factorial(5); // == 120
```

# if constexpr
#if_constexpr





