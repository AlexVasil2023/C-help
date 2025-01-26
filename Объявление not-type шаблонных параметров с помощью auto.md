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
