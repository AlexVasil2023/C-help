# Свертка параметров шаблона (Fold expressions)

Для начала несколько слов о том, что вообще такое свертка списка (также известна  как #fold, #reduce или #accumulate).  
Свертка – это функция, которая применяет заданную комбинирующую функцию к последовательным парам элементов в списке и возвращает результат. Простейшим примером может служить суммирование элементов списка при помощи свертки:  
Пример:
```c++
std::vector<int> lst = { 1, 3, 5, 7 };

int res = std::accumulate(lst.begin(), lst.end(), 0, [](int a, int b)  { 
	return a + b; 
});

std::cout << res << '\n'; // 16
```
Если комбинирующая функция применяется к первому элементу списка и результату рекурсивной обработки хвоста списка, то свертка называется **правоассоциативной.** В нашем примере получим:
```c++
1 + (3 + (5 + (7 + 0)))
```
Если комбинирующая функция применяется к результату рекурсивной обработки начала списка _(весь список без последнего элемента)_ и последнему элементу, то свертка называется **левоассоциативной**. В нашем примере получим:
```c++
(((0 + 1) + 3) + 5) + 7
```
Таким образом, тип свертки определяет порядок вычислений.  
В C++17 появилась поддержка свертки для списка параметров шаблонов. Она имеет следующий синтаксис:

| (pack op ...)      | Унарная правоассоциативная свертка  |
| ------------------ | ----------------------------------- |
| (… op pack)        | Унарная левоассоциативная свертка   |
| (pack op… op init) | Бинарная правоассоциативная свертка |
| (init op… op pack) | Бинарная левоассоциативная свертка  |
_op_ – один из следующих бинарных операторов:
```c++
+ - * / % ^ & | ~ = < > << >> += -= *= /= %=^= &= |= <<= >>= == != <= >= && || , .* ->*
```
_pack_ – выражение, содержащее нераскрытую группу параметров (parameter pack)  
_init_ – начальное значение  
  
Вот, например, шаблонная функция, принимающая переменное число параметров и вычисляющая их сумму:
```c++
// C++17
#include <iostream>

template<typename... Args>
auto Sum(Args... args)
{
	return (args + ...);
}

int main(){  
	std::cout << Sum(1, 2, 3, 4, 5) << '\n'; // 15  
	return 0;
}
```
Примечание: В данном примере функцию _Sum_ можно было бы объявить как [[constexpr|constexpr]].  
Если мы хотим указать начальное значение, то используем бинарную свертку:
```c++
// C++17
#include <iostream>

template<typename... Args>
auto Func(Args... args)
{  
	return (args + ... + 100);
}

int main(){  
	std::cout << Func(1, 2, 3, 4, 5) << '\n'; //115  
	return 0;
}
```
До C++17 чтобы реализовать подобную функцию, пришлось бы явно указывать правила для рекурсии:
```c++
// C++14
#include <iostream>

auto Sum(){  
	return 0;
}

template<typename Arg, typename... Args>
auto Sum(Arg first, Args... rest)
{  
	return first + Sum(rest...);
}

int main(){  
	std::cout << Sum(1, 2, 3, 4); // 10  
	return 0;
}
```
Отдельно хочется отметить оператор ',' (запятая), который раскроет **_pack_** в последовательность действий, перечисленных через запятую. Пример:
```c++
// C++17
#include <iostream>

template<typename T, typename... Args>
void PushToVector(std::vector<T>& v, Args&&... args)
{  
	(v.push_back(std::forward<Args>(args)), ...);  //Раскрывается в
					// последовательность выражений через запятую вида:  
					//v.push_back(std::forward<Args_1>(arg1)),  
					//v.push_back(std::forward<Args_2>(arg2)),  
					//....
}

int main(){  
	std::vector<int> vct;  
	PushToVector(vct, 1, 4, 5, 8);  
	
	return 0;
}
```
Таким образом, свертка сильно упрощает работу с **variadic templates**.