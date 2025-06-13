
[[#Пути|Пути]] 11.9.1 (STL)

# Пути
Рассмотрим пример:

```c++
path f = "dir/hypothetical.cpp"; // naming a file
assert(exists(f)); // f must exist

if (is_regular_file(f)) // is f an ordinary file?
	cout << f << " is a file; its size is " << file_size(f) << '\n';
```

Обратите внимание, что программа, управляющая файловой системой, обычно выполняется на компьютере вместе с другими программами. Таким образом, содержимое файловой системы может изменяться между двумя командами. Например, несмотря на то, что мы сначала тщательно утверждали, что `f` существует, это может уже не соответствовать действительности, когда в следующей строке мы спрашиваем, является ли `f` обычным файлом.

Путь [[filesystem#Path|path]] - это довольно сложный класс, способный обрабатывать различные наборы символов и соглашения многих операционных систем. В частности, он может обрабатывать имена файлов из командной строки, представленные `main()`; например:
```C++
int main(int argc, char* argv[])
{
	if (argc < 2) {
		cerr << "arguments expected\n";
		
		return 1;
	}

	path p {argv[1]}; // create a path from the command line
	cout << p << " " << exists(p) << '\n'; // note: a path can be printed 
										// like a string
	...
}
```

Путь [[filesystem#Path|path]] не проверяется на достоверность до тех пор, пока он не будет использован. Даже в этом случае его действительность зависит от соглашений системы, в которой выполняется программа.

Естественно, можно использовать [[filesystem#Path|path]] для открытия файла:
```C++
void use(path p)
{
	ofstream f {p};
	
	if (!f) error("bad file name: ", p);
		f << "Hello, file!";
}
```

В дополнение к [[filesystem#Path|path]], [[filesystem|<filesystem>]] предлагает типы для обхода каталогов и запроса свойств найденных файлов:

| `path`                         | Путь к каталогу                             |
| ------------------------------ | ------------------------------------------- |
| `filesystem_error`             | Исключение файловой системы                 |
| `directory_entry`              | Запись в каталоге                           |
| `directory_iterator`           | Для итерации по каталогу                    |
| `recursive_directory_iterator` | Для итерации по каталогу и его подкаталогам |

Рассмотрим простой, но не совсем уж нереальный пример:
```c++
void print_directory(path p) // print the names of all files in p
{
	try
	{
		if (is_directory(p)) {
			cout << p << ":\n";
			
			for (const directory_entry& x : directory_iterator{p})
				cout << " " << x.path() << '\n';
		}
	}
	catch (const filesystem_error& ex) {
		cerr << ex.what() << '\n';
	}
}
```

Строка может быть неявно преобразована в [[filesystem#Path|path]], поэтому мы можем использовать `print_directory` следующим образом:
```c++
void use()
{
	print_directory("."); // current directory
	print_directory(".."); // parent directory
	print_directory("/"); // Unix root directory
	print_directory("c:"); // Windows volume C
	
	for (string s; cin>>s; )
		print_directory(s);
}
```

Если бы я хотел также перечислить подкаталоги, я бы сказал `recursive_directory_iterator{p}`. Если бы я хотел напечатать записи в лексикографическом порядке, я бы скопировал [[filesystem#Path|path]] в [[vector|vector]] и отсортировал их перед печатью.

Класс [[filesystem#Path|path]] предлагает множество распространенных и полезных операций:

Операции с путями (некоторые) `p` и `p2` это [[filesystem#Path|path]]

| `value_type`               | Тип символа, используемый собственной кодировкой файловой системы: char в POSIX, wchar_t в Windows |
| -------------------------- | -------------------------------------------------------------------------------------------------- |
| `string_type`              | [[string#basic_string\|std::basic_string<value_type>]]                                             |
| `const_iterator`           | [[const\|const]] двунаправленный итератор с `value_type` для [[filesystem#Path\|path]]             |
| `iterator`                 | Псевдоним для `const_iterator`                                                                     |
| `p=p2`                     | Присвоить p2 в p                                                                                   |
| p/=p2                      | p и p2 объединить с использованием разделителя (по умолчанию `/`)                                  |
| `p+=p2`                    | p и p2 объединить (без разделителя)                                                                |
| `s=p.native()`             | Ссылка на нативный формат p                                                                        |
| `s=p.string()`             | `p` в нативном формате в виде [[string\|string]]                                                   |
| `s=p.generic_string()`     | p в общем формате в виде [[string\|string]]                                                        |
| `p2=p.filename()`          | Часть пути p включающая только имя файла                                                           |
| `p2=p.stem()`              | Часть пути p включающая только каталоги                                                            |
| `p2=p.extension()`         | Часть пути p включающая расширение файла                                                           |
| `i=p.begin()`              | Начальный итератор последовательности элементов p                                                  |
| `i= p.end()`               | Конечный итератор последовательности элементов p                                                   |
| `p==p2, p!=p2`             | Проверка на равенство и неравество путей p и p2                                                    |
| `p<p2, p<=p2, p>p2, p>=p2` | Лексикографическое сравнение                                                                       |
| `is>>p, os<<p`             | Потоковый I/O в/из p                                                                               |
| `u8path(s)`                | Путь из источника s, в кодировке UTF-8                                                             |

Например:
```c++
void test(path p)
{
	if (is_directory(p)) {
		cout << p << ":\n";
		
		for (const directory_entry& x : directory_iterator(p)) {
			const path& f = x; // refer to the path part of a directory en-
			try
				if (f.extension() == ".exe")
					cout << f.stem() << " is a Windows executable\n";
				else 
				{
					string n = f.extension().string();
					
					if (n == ".cpp" || n == ".C" || n == ".cxx")
						cout << f.stem() << " is a C++ source file\n";
				}
		}
	}
}
```

Мы используем [[filesystem#Path|path]] в качестве строки (например, `f.extension`), и мы можем извлекать строки различных типов из [[filesystem#Path|path]] (например, `f.extension().string()`).

Соглашения об именовании, естественные языки и строковые кодировки отличаются высокой сложностью. Абстракции файловой системы стандартной библиотеки обеспечивают переносимость и значительное упрощение.

