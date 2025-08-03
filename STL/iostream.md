
[[#iostream|iostream]] 11.4(STL)
[[iostream#I/O пользовательских типов]] 11.5(STL)

# iostream

У `iostream` есть состояние, которое мы можем проверить, чтобы определить, была ли операция выполнена успешно. Наиболее распространенным способом является считывание последовательности значений:
```c++
vector<int> read_ints(istream& is)
{
	vector<int> res;
	
	for (int i; is>>i; )
		res.push_back(i);
		
	return res;
}
```

Этот код считывает из` is` до тех пор, пока не встретится что-то, что не является целым числом. Это что-то, как правило, будет концом ввода. Что здесь происходит, так это то, что операция `is>>i` возвращает ссылку на `is`, а тестирование `iostream` выдает значение `true`, если поток готов к следующей операции.

В общем, состояние ввода-вывода содержит всю информацию, необходимую для чтения или записи, такую как информация о [[format#Форматирование в стиле printf()|форматировании]], состояние ошибки (например, достигнут ли конец ввода?) и какой тип буферизации используется. В частности, пользователь может настроить состояние таким образом, чтобы оно отражало, что произошла ошибка ( #§11_5), и очистить состояние, если ошибка не была серьезной. Например, мы могли бы представить версию `read_ints()`, которая принимала бы строку завершающую ввод:
```c++
vector<int> read_ints(istream& is, const string& terminator)
{
	vector<int> res;
	
	for (int i; is >> i; )
		res.push_back(i);
		
	if (is.eof()) // fine: end of file
		return res;
		
	if (is.fail()) { // we failed to read an int; was it the terminator?
		is.clear(); // reset the state to good()

		string s;

		if (is>>s && s==terminator)
			return res;

		is.setstate(ios_base::failbit); // add fail() to is's state
	}
	
	return res;
}

auto v = read_ints(cin,"stop");
```

# I/O пользовательских типов

В дополнение к вводу-выводу встроенных типов и стандартных строк [[string|string]] библиотека `iostream` позволяет нам определять ввод-вывод для наших собственных типов. Например, рассмотрим простой тип `Entry`, который мы могли бы использовать для представления записей в телефонной книге:
```c++
struct Entry {
	string name;
	int number;
};
```

Мы можем определить простой оператор вывода для вывода `Entry`, используя формат` {"name",number}`, аналогичный тому, который мы используем для инициализации в коде:
```c++
ostream& operator<<(ostream& os, const Entry& e)
{
	return os << "{\"" << e.name << "\", " << e.number << "}";
}
```

Пользовательский оператор вывода принимает в качестве первого аргумента выходной поток (по ссылке) и возвращает его в качестве результата.

Соответствующий оператор ввода является более сложным, поскольку он должен
проверять правильность форматирования и обрабатывать ошибки:
```c++
istream& operator>>(istream& is, Entry& e)
// read { "name" , number } pair. Note: formatted with { " " , and }
{
	char c, c2;
	// start with a { followed by a"
	if (is>>c && c=='{' && is>>c2 && c2 == '\"' ) { 
		string name;// the default value of a string is the empty string:""
		
		while (is.get(c) && c!= '\"' ) // anything before a " is part of the
			name+=c;
			
		if (is>>c && c==',') {
			int number = 0;
			if (is>>number>>c && c=='}') { // read the number and a }
				e = {name,number}; // assign to the entry
				return is;
			}
		}
	}

	is.setstate(ios_base::failbit); // register the failure in the stream
	
	return is;
}
```

Операция ввода возвращает ссылку на свой [[stream#std istream|istream]], которую можно использовать для проверки успешности выполнения операции. Например, использование в качестве условия `is>>c` означает “Удалось ли нам прочитать `char` из `is` в `c`?”

По умолчанию `is>>c` пропускает пробельные символы, а `is.get(c)` этого не делает, поэтому этот оператор ввода `Entry` игнорирует (пропускает) пробелы вне строки имени, но не внутри нее. Например:
```c++
{ "John Marwood Cleese", 123456 }
{"Michael Edward Palin", 987654}
```

Мы можем прочитать такую пару значений из входных данных в `Entry`, например, так:
```c++
for (Entry ee; cin>>ee; ) // read from cin into ee
	cout << ee <<'\n';    // write ee to cout
```

Вывод в таком случае:
```c++
{"John Marwood Cleese", 123456}
{"Michael Edward Palin", 987654}
```

[[regex#Регулярные выражения|Смотрите]] для более систематизированного метода распознавания шаблонов в потоках символов (сопоставление с регулярными выражениями).





