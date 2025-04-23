
[[#Строковые потоки]] 11.7.3(STL)
1. [[#istringstream]]
2. [[#ostringstream]]
3. [[#stringstream]]

# Строковые потоки

В `<sstream>`, стандартная библиотека предоставляет потоки для чтения и записи в строку:
>
> [[#istringstream]] для чтения из [[string|string]]
> 
> [[#ostringstream|ostringstream]] для записи в [[string|string]]
> 
> [[#stringstream|stringstream]] для чтения и записи в [[string|string]].

Например:
```c++
void test()
{
	ostringstream oss;
	oss << "{temperature," << scientific << 123.4567890 << "}";
	cout << oss.view() << '\n';
}
```

Содержимое `ostringstream` может быть прочитано с помощью `str()` (содержимое в виде копии [[string|string]]) или `view()` (содержимое в виде [[string_view|string_view]]). Одним из распространенных способов использования `ostringstream` является форматирование перед передачей результирующей строки в графический интерфейс. Аналогично, строку, полученную из графического интерфейса пользователя, можно прочитать с помощью операций форматированного ввода , поместив ее в [[#istringstream|istringstream]].

`stringstream` можно использовать как для чтения, так и для записи. Например, мы можем определить операцию, которая может преобразовать любой тип представленый в виде [[string|string]] в другой, который также может быть представлен в виде [[string|string]]:
```c++
template<typename Target = string, typename Source = string>
Target to(Source arg) // convert Source to Target
{
	stringstream buf;
	Target result;
	
	if (!(buf << arg) // write arg into stream
			|| !(buf >> result) // read result from stream
			|| !(buf >> std::ws).eof()) // is anything left in stream?
		
	throw runtime_error{"to<>() failed"};
	
	return result;
}
```

Аргумент шаблона функции должен быть явно указан только в том случае, если он не может быть выведен или если значение по умолчанию отсутствует ( #§8_2_4), поэтому мы можем написать:
```c++
auto x1 = to<string, double>(1.2); // very explicit (and verbose)
auto x2 = to<string>(1.2);         // Source is deduced to double
auto x3 = to<>(1.2);               // Target is defaulted to string; Source 
								   // is deduced to double
auto x4 = to(1.2);                 // the <> is redundant;
								   // Target is defaulted to string; Source 
								   // is deduced to double
```

Если все аргументы шаблона функции заданы по умолчанию, угловые скобки `<>` можно опустить.

Я считаю это хорошим примером универсальности и простоты использования, которые могут быть достигнуты сочетанием возможностей языка и стандартной библиотеки.
## istringstream
#istringstream


## ostringstream
#ostringstream


# stringstream
#stringstream


