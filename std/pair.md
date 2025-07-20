# std::pair

Довольно часто функция возвращает два значения. Есть много способов сделать это, самый простой и часто лучший - определить `struct` для этой цели. Например, мы можем вернуть значение и индикатор успеха:
```c++
struct My_res {
	Entry* ptr;
	Error_code err;
};

My_res complex_search(vector<Entry>& v, const string& s)
{
	Entry* found = nullptr;
	Error_code err = Error_code::found;
	// ... search for s in v ...
	return {found,err};
}

void user(const string& s)
{
	My_res r = complex_search(entry_table, s);
	if (r.err != Error_code::good) {
		// ... handle error ...
	}
	
	// ... use r.ptr ...
}
```

Мы могли бы возразить, что ошибка кодирования в качестве конечного итератора или [[nullptr_t#nullptr|nullptr]] является более элегантной, но это может выражать только один вид сбоя. Часто мы хотели бы вернуть два отдельных значения. Определение конкретной именованной `struct` для каждой пары значений часто работает хорошо и вполне читаемо, если имена `struct` “пара значений” и их членов выбраны правильно. Однако для больших кодовых баз это может привести к увеличению числа имен и соглашений, и это плохо работает для общего кода, где важно согласованное именование. Следовательно, стандартная библиотека предоставляет `pair` в качестве основной реализации для вариантов использования “пары значений”. Используя `pair`, наш простой пример становится:
```c++
pair<Entry*,Error_code> complex_search(vector<Entry>& v, const string& s)
{
	Entry* found = nullptr;
	Error_code err = Error_code::found;
	// ... search for s in v ...
	return {found,err};
}

void user(const string& s)
{
	auto r = complex_search(entry_table,s);
	if (r.second != Error_code::good) {
		// ... handle error ...
	}
	
	// ... use r.first ....
}
```

Члены `pair` называются `first` и `second`. Это имеет смысл с точки зрения разработчика, но в коде приложения мы можем захотеть использовать наши собственные имена. Для решения этой проблемы можно использовать [[Модульность#Структурное связывание|структурное связывание]]:
```c++
void user(const string& s)
{
	auto [ptr,success] = complex_search(entry_table,s);
	if (success != Error_code::good)
		// ... handle error ...
	}
	
	// ... use r.ptr ....
	// search entry_table
}
```

`pair` стандартной библиотеки (из `<utility>`) довольно часто используется для вариантов использования “пары значений” в стандартной библиотеке и других местах. Например, алгоритм стандартной библиотеки [[equal_range|equal_range]] задает `pair` итераторов, определяющих подпоследовательность, удовлетворяющую предикату:
```c++
template<typename Forward_iterator, typename T, typename Compare>
	pair<Forward_iterator,Forward_iterator>
	equal_range(Forward_iterator first, Forward_iterator last, const T& val, Compare cmp);
```

Учитывая отсортированную последовательность `[first:last)`, функция `equal_range()` вернет `pair`, представляющую подпоследовательность, соответствующую предикату `cmp`. Мы можем использовать это для поиска в отсортированной последовательности из `Record`:
```c++
auto less = [](const Record& r1, const Record& r2) 
{ 
	return r1.name<r2.name;             // compare names
};

// assume that v is sorted on its "name" field
void f(const vector<Record>& v)
{
	auto [first,last] = equal_range(v.begin(),v.end(),Record{"Reg"},less);
	for (auto p = first; p!=last; ++p) // print all equal records
		cout << *p;                // assume that << is defined for Record
}
```

`pair` предоставляет операторы, такие как `=`, `==` и `<` если это делают ее элементы. Вывод типа позволяет легко создать `pair` без явного указания ее типа. Например:
```c++
void f(vector<string>& v)
{
	pair p1 {v.begin(),2};                // one way
	auto p2 = make_pair(v.begin(),2);     // another way
	// ...
}
```

И `p1`, и `p2` имеют тип `pair<vector<string>::iterator,int>`.

Когда код не обязательно должен быть универсальным, простая структура с именованными элементами часто приводит к созданию более удобного в обслуживании кода.



# std::make_pair
#std_make_pair


































