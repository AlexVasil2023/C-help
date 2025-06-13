
1. [[#Применение итераторов|Применение итераторов]] (13.2 - STL)
2. [[#Типы итераторов|Типы итераторов]] (13.3 - STL)
	1. [[#ostream_iterator и istream_iterator|Потоковые итераторы]] (13.3.1 - STL)

# Применение итераторов

Для контейнера можно получить несколько итераторов, ссылающихся на полезные элементы; [[begin|begin()]] и [[end|end()]] являются лучшими примерами этого. Кроме того, многие алгоритмы возвращают итераторы. Например, стандартный алгоритм [[find|find]] выполняет поиск значения в последовательности и возвращает итератор найденного элемента:
```c++
// does s contain the character c?
bool has_c(const string& s, char c) 
{
	auto p = find(s.begin(),s.end(),c);
	if (p!=s.end())
		return true;
	else
		return false;
}
```

Как и многие алгоритмы поиска в стандартных библиотеках, [[find|find]] возвращает [[end|end()]] для указания “не найдено”. Эквивалентным, более коротким определением `has_c()` является:
```c++
// does s contain the character c?
bool has_c(const string& s, char c) 
{
	return find(s,c)!=s.end();
}
```

Более интересным упражнением было бы найти местоположение всех вхождений символа в строку. Мы можем вернуть набор вхождений в виде `vector<char*>`. Возврат [[vector|vector]] эффективен, поскольку [[vector|vector]] обеспечивает [[Основные операции#Копирование контейнеров|семантику перемещения]]. Предполагая, что мы хотели бы изменить найденные местоположения, мы передаем неконстантную строку:
```c++
// find all occurrences of c in s
vector<string::iterator> find_all(string& s, char c) 
{
	vector<char*> res;
	for (auto p = s.begin(); p!=s.end(); ++p)
		if (*p==c)
			res.push_back(&*p);
	
	return res;
}
```

Мы итерируемся по строке, используя обычный цикл, перемещая итератор `p` вперед по одному элементу за раз, при помощи `++`, и просматривая элементы, используя оператор разыменования `*`. Мы можем протестировать `find_all()` следующим образом:
```c++
void test()
{
	string m {"Mary had a little lamb"};
	for (auto p : find_all(m, `a` ))
		if (*p!= a )
			cerr << "a bug!\n";
}
```

Этот вызов функции `find_all()` можно было бы графически представить следующим образом:
![[Algoritm_2.png]]

Итераторы и стандартные алгоритмы работают эквивалентно с каждым стандартным контейнером, для которого их использование имеет смысл. Следовательно, мы могли бы обобщить `find_all()`:
```c++
template<typename C, typename V>
// find all occurrences of v in c
vector<typename C::iterator> find_all(C& c, V v) 
{
	vector<typename C::iterator> res;
	for (auto p = c.begin(); p!=c.end(); ++p)
		if (*p==v)
			res.push_back(p);

	return res;
}
```

Ключевое слово [[typename|typename]] необходимо для информирования компилятора о том, что `iterator C` должен быть типом, а не значением какого-либо типа, скажем, целым числом 7.

В качестве альтернативы мы могли бы вернуть вектор обычных указателей на элементы:
```c++
template<typename C, typename V>
auto find_all(C& c, V v) // find all occurrences of v in c
{
	vector<range_value_t<C>*> res;
	for (auto& x : c)
		if (x==v)
			res.push_back(&x);

	return res;
}
```

Пока я этим занимался, я также упростил код, используя [[for|цикл for]] для диапазонов и [[range#range_value_t|range_value_t]] стандартной библиотеки для присвоения имен типу элементов.

Упрощенная версия [[range#range_value_t|range_value_t]] может быть определена следующим образом:
```c++
template<typename T>
using range_value_type_t = T::value_type;
```

Используя любую версию `find_all()`, мы можем написать:
```c++
void test()
{
	string m {"Mary had a little lamb"};

	for (auto p : find_all(m, `a` )) // p is a string::iterator
		if (*p!= a )
			cerr << "string bug!\n";
			
	list<int> ld {1, 2, 3, 1, -11, 2};
	for (auto p : find_all(ld,1)) // p is a list<int>::iterator
		if (*p!=1)
			cerr << "list bug!\n";
			
	vector<string> vs {"red", "blue", "green", "green", "orange", "green"};
	// p is a vector<string>::iterator
	for (auto p : find_all(vs,"red")) 
	if (*p!="red")
		cerr << "vector bug!\n";
	
	for (auto p : find_all(vs,"green"))
		*p = "vert";
}
```

Итераторы используются для разделения алгоритмов и контейнеров. Алгоритм оперирует своими данными с помощью итераторов и ничего не знает о контейнере, в котором хранятся элементы. И наоборот, контейнер ничего не знает об алгоритмах, работающих с его элементами; все, что он делает, - это предоставляет итераторы по запросу (например, [[begin|begin()]] и [[end|end()]]). Эта модель разделения между хранилищем данных и алгоритмом обеспечивает очень общее и гибкое программное обеспечение.

![[Algoritm_3.png]]

# Типы итераторов

Что такое итераторы на самом деле? Любой конкретный итератор является объектом некоторого типа. Однако существует множество различных типов итераторов - итератор должен содержать информацию, необходимую для выполнения своей работы для определенного типа контейнера. Эти типы итераторов могут быть такими же разными, как контейнеры и специализированные потребности, которым они служат. Например, итератор [[vector|vector]] может быть обычным указателем, потому что указатель - это вполне разумный способ ссылки на элемент [[vector|vector]]:

![[Algoritm_4.png]]

В качестве альтернативы итератор [[vector|vector]] может быть реализован как указатель на [[vector|vector]] плюс индекс:

![[Algoritm_5.png]]

Использование такого итератора позволяет проверять диапазон.

Итератор [[list|list]] должен быть чем-то более сложным, чем простой указатель на элемент, потому что элемент [[list|list]], как правило, не знает, где находится следующий элемент этого [[list|list]]. Таким образом, итератор [[list|list]] может быть указателем на ссылку:

![[Algoritm_6.png]]

Что является общим для всех итераторов, так это их семантика и названия их операций. Например, применение `++` к любому итератору приводит к созданию итератора, который ссылается на следующий элемент. Аналогично, `*` возвращает элемент, на который ссылается итератор. На самом деле, любой объект, который подчиняется нескольким простым правилам, подобным этим, является итератором. Итератор - это общая идея, [[Concepts#Концепт STL|концепт]], и различные виды итераторов доступны в качестве [[Concepts|concept]] стандартной библиотеки, таких как [[iterator#forward_iterator|forward_iterator]] и [[iterator#random_access_iterator|random_access_iterator]]. Кроме того, пользователям редко требуется знать тип конкретного итератора; каждый контейнер “знает” свои типы итераторов и делает их доступными под условными именами [[iterator|iterator]] и [[iterator#const_iterator|const_iterator]]. Например, `list<Entry>::iterator` - это общий тип итератора для `list<Entry>`. Нам редко приходится беспокоиться о деталях определения этого типа. В некоторых случаях итератор не является типом элемента, поэтому стандартная библиотека предлагает `iterator_t<X>`, который работает везде, где определен итератор `X`.

## ostream_iterator и istream_iterator

Итераторы - это общая и полезная концепция для работы с последовательностями элементов в контейнерах. Однако контейнеры - не единственное место, где мы находим последовательности элементов. Например, входной поток тоже генерирует последовательность значений, и мы записываем последовательность значений в выходной поток. Следовательно, понятие итераторов может быть с пользой применено к вводу и выводу.

Чтобы создать `ostream_iterator`, нам нужно указать, какой поток будет использоваться, и тип записываемых в него объектов. Например:
```c++
ostream_iterator<string> oo {cout}; // write strings to cout
```

Результатом присвоения `*oo` является запись присвоенного значения в [[cout|cout]]. Например:
```c++
int main()
{
	*oo = "Hello, "; // meaning cout<<"Hello, "
	++oo;
	*oo = "world!\n"; // meaning cout<<"world!\n"
}
```

Это еще один способ записи каноничного сообщения в стандартный вывод. `++oo` выполняется для имитации записи в массив через указатель. Таким образом, мы можем использовать алгоритмы для потоков. Например:
```c++
vector<string> v{ "Hello", ", ", "World!\n" };
copy(v, oo);
```

Аналогично, `istream_iterator` - это то, что позволяет нам обрабатывать входной поток как контейнер, доступный только для чтения. Опять же, мы должны указать используемый поток и тип ожидаемых значений:
```c++
istream_iterator<string> ii {cin};
```

Итераторы ввода используются парами, представляющими последовательность, поэтому мы должны предоставить `istream_iterator` для указания конца ввода. Это `istream_iterator` по умолчанию:
```c++
istream_iterator<string> eos {};
```

Как правило, `istream_iterator` и `ostream_iterator` не используются напрямую. Вместо этого они предоставляются в качестве аргументов алгоритмам. Например, мы можем написать простую программу для чтения файла, сортировки прочитанных слов, устранения дубликатов и записи результата в другой файл:
```c++
int main()
{
	string from, to;
	cin >> from >> to; // get source and target file names
	ifstream is {from}; // input stream for file "from"
	istream_iterator<string> ii {is}; // input iterator for stream
	istream_iterator<string> eos {}; // input sentinel
	ofstream os {to}; // output stream for file "to"
	
	// output iterator for stream plus a separator
	ostream_iterator<string> oo {os,"\n"}; 
	// b is a vector initialized from input
	vector<string> b {ii,eos};  
	
	sort(b); // sort the buffer
	// copy the buffer to output, discard replicated values
	unique_copy(b,oo); 

	return !is.eof() || !os; // return error state (§1.2.1, §11.4)
}
```

Я использовал диапазонные версии [[sort|sort()]] и [[unique_copy|unique_copy()]]. Я мог бы использовать итераторы напрямую, например, `sort(b.begin(),b.end())`, как это обычно бывает в старом коде.

Пожалуйста, помните, что для использования как традиционной итераторной версии алгоритма стандартной библиотеки, так и его диапазонного аналога, нам нужно либо явно указать вызов версии для диапазона, либо [[Обзор стандартной библиотеки - STL#Пространство имён ranges|использовать using]]:
```c++
copy(v, oo); // potentially ambiguous
ranges::copy(v, oo); // OK
using ranges::copy(v, oo); // copy(v, oo) OK from here on
copy(v, oo); // OK
```

[[fstream#ifstream|ifstream]] - это [[stream#std istream|istream]], который может быть прикреплен к файлу, а [[fstream#ofstream|ofstream]] - это [[stream#std ostream|ostream]], который может быть прикреплен к файлу. Второй аргумент `ostream_iterator` используется для разграничения выходных значений.
На самом деле, эта программа длиннее, чем должна быть. Мы считываем строки в [[vector|vector]], затем [[sort|sort()]] их, а затем записываем, устраняя дубликаты. Более элегантным решением является вообще не хранить дубликаты. Это можно сделать, сохранив [[string|string]] в [[set|set]], который не содержит дубликатов и поддерживает порядок своих элементов. Таким образом, мы могли бы заменить две строки, использующие [[vector|vector]], на одну, использующую [[set|set]], и заменить [[unique_copy|unique_copy()]] более простой copy():
```c++
set<string> b {ii,eos}; // collect strings from input
copy(b,oo); // copy buffer to output
```

Мы использовали имена `ii`, `eos` и `oo` только один раз, чтобы еще больше уменьшить размер программы:

```c++
int main()
{
	string from, to;
	cin >> from >> to; // get source and target file names
	ifstream is {from}; // input stream for file "from"
	ofstream os {to}; // output stream for file "to"
	set<string> b {
		istream_iterator<string>{is},
		istream_iterator<string>{}}; // read input
	copy(b,ostream_iterator<string>{os,"\n"}); // copy to output
	return !is.eof() || !os; // return error state (§1.2.1, §11.4)
}
```

Улучшит ли это последнее упрощение читабельность или нет, зависит от вкуса и опыта.


# iterator
#iterator



# const_iterator
#const_iterator

# iterator_t
#iterator_t


# input_iterator
#input_iterator


# forward_iterator
#forward_iterator

# random_access_iterator
#random_access_iterator





