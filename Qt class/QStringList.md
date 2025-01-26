# Класс QStringList: список строк

Класс `QStringList` описывает список строк (специализация `QList<QString>`). Подключение заголовочного файла:
```c++
#include <QStringList>
```

## Создание объекта

Класс `QStringList` содержит следующие конструкторы:
```c++
QStringList(const QString &str)
QStringList(const QList<QString> &other)
QStringList(QList<QString> &&other)
```
Пример:
```c++
QStringList list(QString("A"));
qDebug() << list; // QList("A")

QStringList list2(list);
qDebug() << list2; // QList("A")
```

Класс `QStringList` наследует такие конструкторы из класса [[QList|QList]]:
```c++
QList()
QList(qsizetype size)
QList(qsizetype size, QList::parameter_type value)
QList(std::initializer_list<T> args)
QList(InputIterator first, InputIterator last)
```
Пример:
```c++
QStringList list;

list << "A" << "B" << "C";
qDebug() << list; // QList("A", "B", "C")

QStringList list2 = {QString("A"), QString("B")};
qDebug() << list2; // QList("A", "B")

QStringList list3(list.begin(), list.end());
qDebug() << list3; // QList("A", "B", "C")
```

Над двумя объектами определены операции `==`, `!=`, `<`, `<=`, `>` и `>=`. Пример сравнения двух объектов:

```c++
QStringList list;
list << "A" << "B" << "C";

QStringList list2(list.begin(), list.end());

if (list == list2) {
	qDebug() << "list == list2";
}
```

Кроме того, один объект можно присвоить другому объекту. В этом случае выполняется поэлементное копирование (оператор копирования) или перемещение элементов (оператор перемещения). Пример:

```c++
QStringList list, list2;
list << "A" << "B" << "C";

// Создание копии
list2 = list;
list2.front() = "D";

qDebug() << list; // QList("A", "B", "C")
qDebug() << list2; // QList("D", "B", "C")
```

Доступно также присваивание элементов из списка инициализации:

```c++
QStringList list;
list = {"A", "B", "C"};
qDebug() << list; // QList("A", "B", "C")
```

## Вставка элементов

Вставить элементы в конец списка можно с помощью оператора `<<`:

```c++
QStringList list, list2;

list << "A" << "B";
list << "C";
qDebug() << list; // QList("A", "B", "C")

list2 << list;
qDebug() << list2; // QList("A", "B", "C")
```

Добавить элементы в конец списка позволяет также оператор `+=`:

```c++
QStringList list, list2;

list += "A";
list += "B";
list2 += "C";

list += list2;

qDebug() << list; // QList("A", "B", "C")
```

Для объединения двух списков можно воспользоваться оператором `+`:

```c++
QStringList list, list2, list3;

list << "A" << "B";
list2 << "C" << "D";
list3 = list + list2;

qDebug() << list3; // QList("A", "B", "C", "D")
```

Вставить элементы позволяют также следующие методы:

> **push_front()** — добавляет элемент в начало списка. Прототипы метода:
```c++
void push_front(QList::parameter_type value)
void push_front(QList::rvalue_ref value)
```

> **push_back()** — добавляет элемент в конец списка. Прототипы метода:
```c++
void push_back(QList::parameter_type value)
void push_back(QList::rvalue_ref value)
```
Пример:
```c++
QStringList list = { "B", "C" };

list.push_front("A"); // В начало
list.push_back("D"); // В конец

qDebug() << list; // QList("A", "B", "C", "D")
```

> **prepend()** — добавляет элемент в начало списка. Прототипы метода:
```c++
void prepend(QList::parameter_type value)
void prepend(QList::rvalue_ref value)
```

> **append()** — добавляет элемент в конец списка. Прототипы метода:
```c++
void append(QList::parameter_type value)
void append(QList::rvalue_ref value)
void append(const QList<T> &value)
void append(QList<T> &&value)
```
Пример:
```c++
QStringList list = { "B" };

list.prepend("A"); // В начало
list.append("C"); // В конец
qDebug() << list; // QList("A", "B", "C")

QStringList list2 = { "D", "E" };
list.append(list2); // В конец

qDebug() << list; // QList("A", "B", "C", "D", "E")
```

> **insert()** — вставляет элемент перед указанной позицией. Прототипы метода:
```c++
QList::iterator insert(qsizetype i, QList::parameter_type value)

QList::iterator insert(qsizetype i, qsizetype count,
				QList::parameter_type value)
				
QList::iterator insert(qsizetype i, QList::rvalue_ref value)

QList::iterator insert(QList::const_iterator before,
				QList::parameter_type value)
				
QList::iterator insert(QList::const_iterator before,
				qsizetype count, QList::parameter_type value)
				
QList::iterator insert(QList::const_iterator before,
				QList::rvalue_ref value)
```
Пример:
```c++
QStringList list = { "B" };

list.insert(0, "A"); // В начало
list.insert(list.size(), "C"); // В конец
qDebug() << list; // QList("A", "B", "C")

QStringList list2 = { "B" };
list2.insert(list2.cbegin(), "A"); // В начало
list2.insert(list2.cend(), "C"); // В конец
qDebug() << list2; // QList("A", "B", "C")
```

> **emplace()** — вставляет элемент в заданную первым параметром позицию. Значения, указанные через запятую, передаются конструктору объекта. Прототипы метода:
```c++
QList::iterator emplace(qsizetype i, Args &&... args)
QList::iterator emplace(QList::const_iterator before, Args &&... args)
```
Пример:
```c++
QStringList list = { "B" };

list.emplace(0, "A"); // В начало
qDebug() << list; // QList("A", "B")
```

> **emplace_back()** и **emplaceBack()** — создают объект, передавая конструктору указанные через запятую значения, а затем добавляют объект в конец списка. Прототипы методов:
```c++
QList::reference emplace_back(Args &&... args)
QList::reference emplaceBack(Args &&... args)
```
Пример:
```c++
QStringList list = { "A" };

list.emplace_back("B");
list.emplaceBack("C");

qDebug() << list; // QList("A", "B", "C")
```

> **swap()** — меняет элементы двух списков местами:
```c++
QStringList list = { "A" }, list2 = { "B" };

list.swap(list2);

qDebug() << list; // QList("B")
qDebug() << list2; // QList("A")
```

> **swapItemsAt()** — меняет два элемента местами. Прототип метода:
```c++
void swapItemsAt(qsizetype i, qsizetype j)
```
Пример:
```c++
QStringList list = { "A", "B" };
list.swapItemsAt(0, 1);
qDebug() << list; // QList("B", "A")
```

## Определение и изменение количества элементов

Для определения и изменения количества элементов списка предназначены следующие методы:

> **size()**, **length()** и **count()** — возвращают количество элементов списка. Прототипы методов:
```c++
qsizetype size() const
qsizetype length() const
qsizetype count() const
```
Пример:
```c++
QStringList list = { "A", "B", "C" };
qDebug() << list.size(); // 3
qDebug() << list.length(); // 3
qDebug() << list.count(); // 3
```

> **empty()** и **isEmpty()** — возвращают значение `true`, если список не содержит элементов, и `false` — в противном случае. Прототипы методов: 
```c++
bool empty() const
bool isEmpty() **const**
```
Пример:
```c++
QStringList list;

qDebug() << list.empty(); // true
qDebug() << list.isEmpty(); // true

list = { "A", "B", "C" };

qDebug() << list.empty(); // false
qDebug() << list.isEmpty(); // false
```

> **resize()** — задает количество элементов, равное числу `size`. Если указанное количество элементов меньше текущего количества, то лишние элементы будут удалены, в противном случае в конец добавляются пустые строки. Прототип метода:
```c++
void resize(qsizetype size)
```
Пример:
```c++
QStringList list = { "A", "B", "C" };

list.resize(2);
qDebug() << list; // QList("A", "B")

list.resize(4);
qDebug() << list; // QList("A", "B", "", "")
```

> **capacity()** — возвращает количество элементов, которое может содержать список без перераспределения памяти. Прототип метода: 
```c++
qsizetype capacity() const
```

> **reserve()** — позволяет задать минимальное количество элементов, которое может содержать список без перераспределения памяти. Прототип метода:
```c++
void reserve(qsizetype size)
```
Пример указания минимального размера списка:
```c++
QStringList list;

list.reserve(50);

qDebug() << list.size(); // 0
qDebug() << list.capacity(); // 50
```

> **shrink_to_fit()** и **squeeze()** — уменьшают размер списка до минимального значения. Прототипы методов:
```c++
void shrink_to_fit()
void squeeze()
```
Пример:
```c++
QStringList list;

list.reserve(50);
qDebug() << list.capacity(); // 50

list.squeeze();
qDebug() << list.capacity(); // 0
```

## Удаление элементов

Для удаления элементов предназначены следующие методы:
> **pop_front()** и **removeFirst()** — удаляют первый элемент. Прототипы методов:
```c++
void pop_front()
void removeFirst()
```
Пример:
```c++
QStringList list = { "A", "B", "C" };

list.pop_front();
qDebug() << list; // QList("B", "C")

list.removeFirst();
qDebug() << list; // QList("C")
```

> **pop_back()** и **removeLast()** — удаляют последний элемент. Прототипы методов:
```c++
void pop_back()
void removeLast()
```
Пример:
```c++
QStringList list = { "A", "B", "C" };

list.pop_back();
qDebug() << list; // QList("A", "B")

list.removeLast();
qDebug() << list; // QList("A")
```

> **erase()** — удаляет один элемент или элементы из диапазона. Прототипы метода:
```c++
QList::iterator erase(QList::const_iterator pos)

QList::iterator erase(QList::const_iterator begin,
						QList::const_iterator end)
```
Пример:
```c++
QStringList list = { "A", "B", "C", "D" };

list.erase(list.cbegin());
qDebug() << list; // QList("B", "C", "D")

list.erase(list.cbegin(), list.cend());
qDebug() << list; // QList()
```
Для удаления элементов можно также воспользоваться функцией `erase()`. Прототип функции:
```c++
qsizetype erase(QList<T> &list, const AT &t)
```
> **erase_if()** — удаляет элементы, для которых функция `pred` возвращает `true`. Прототип функции:
```c++
qsizetype erase_if(QList<T> &list, Predicate pred)
```
Пример:
```c++
QStringList list = { "A", "B", "C", "B" };

qsizetype n = erase_if(list, [](const QString &s){
		return s == QString("B");
	});
	
qDebug() << list; // QList("A", "C")
qDebug() << n; // 2
```

> **remove()** — удаляет `n` элементов, начиная с индекса `i`. Прототип метода:
```c++
void remove(qsizetype i, qsizetype n = 1)
```
Пример:
```c++
QStringList list = { "A", "B", "C", "D" };

list.remove(0, 3);
qDebug() << list; // QList("D")

list = { "A", "B", "C", "D" };

list.remove(1);
qDebug() << list; // QList("A", "C", "D")
```

> **removeAt()** — удаляет элемент, расположенный по индексу `i`. Прототип метода:
```c++
void removeAt(qsizetype i)
```
Пример:
```c++
QStringList list = { "A", "B", "C", "D" };

list.removeAt(0);
qDebug() << list; // QList("B", "C", "D")
```

> **removeOne()** — удаляет первый элемент с указанным значением. Прототип метода:
```c++
bool removeOne(const AT &t)
```
Пример:
```c++
QStringList list = { "A", "B", "C", "B" };

qDebug() << list.removeOne("B"); // true
qDebug() << list; // QList("A", "C", "B")
```

> **removeAll()** — удаляет все элементы с указанным значением и возвращает количество удаленных элементов. Прототип метода:
```c++
qsizetype removeAll(const AT &t)
```
Пример:
```c++
QStringList list = { "A", "B", "C", "B" };

qDebug() << list.removeAll("B"); // 2
qDebug() << list; // QList("A", "C")
```

> **removeIf()** — удаляет элементы, для которых функция `pred` возвращает `true`. Прототип метода:
```c++
qsizetype removeIf(Predicate pred)
```
Пример:
```c++
QStringList list = { "A", "B", "C", "B" };

qsizetype n = list.removeIf([](const QString &s){
		return s == QString("B");
	});
	
qDebug() << n; // 2
qDebug() << list; // QList("A", "C")
```

> **takeFirst()** — удаляет первый элемент и возвращает его. Прототип метода:
```c++
QList::value_type takeFirst()
```
Пример:
```c++
QStringList list = { "A", "B", "C" };
QString s = list.takeFirst();

qDebug() << s; // "A"
qDebug() << list; // QList("B", "C")
```

> **takeLast()** — удаляет последний элемент и возвращает его. Прототип метода:
```c++
QList::value_type takeLast()
```
Пример:
```c++
QStringList list = { "A", "B", "C" };
QString s = list.takeLast();

qDebug() << s; // "C"
qDebug() << list; // QList("A", "B")
```

> **takeAt()** — удаляет элемент с указанным индексом и возвращает его. Прототип метода:
```c++
T takeAt(qsizetype i)
```
Пример:
```c++
QStringList list = { "A", "B", "C" };
QString s = list.takeAt(1);

qDebug() << s; // "B"
qDebug() << list; // QList("A", "C")
```

> **clear()** — удаляет все элементы. Прототип метода:
``` c++
void clear()
```
Пример:
```c++
QStringList list = { "A", "B", "C" };
list.clear();
qDebug() << list; // QList()
```

> **removeDuplicates()** — удаляет все повторы элементов. Метод возвращает количество удаленных элементов. Прототип метода:
```c++
qsizetype removeDuplicates()
```
Пример:
```c++
QStringList list = { "A", "B", "B", "A" };
qsizetype n = list.removeDuplicates();

qDebug() << list; // QList("A", "B")
qDebug() << n; // 2
```

## Доступ к элементам

Обратиться к элементам списка можно, указав индекс внутри квадратных скобок. Можно как получить значение, так и изменить его:
```c++
QStringList list = { "A", "B", "C" };
qDebug() << list[0]; // "A"

list[0] = "D";
qDebug() << list; // QList("D", "B", "C")
```

Для доступа к элементам списка предназначены следующие методы:

> **front()** — возвращает ссылку на первый элемент. Метод позволяет как получить значение, так и изменить его. Прототипы метода:
```c++
QList::reference front()
QList::const_reference front() const
```

> **back()** — возвращает ссылку на последний элемент. Метод позволяет как получить значение, так и изменить его. Прототипы метода:
```c++
QList::reference back()
QList::const_reference back() const
```
Пример:
```c++
QStringList list = { "A", "B", "C" };

list.front() = "D";
list.back() = "E";

qDebug() << list.front(); // "D"
qDebug() << list.back(); // "E"
qDebug() << list; // QList("D", "B", "E")
```

> **at()** — возвращает константную ссылку на элемент, расположенный по указанному индексу. Прототип метода:
```c++
QList::const_reference at(qsizetype i) const
```
Пример:
```c++
QStringList list = { "A", "B", "C" };
qDebug() << list.at(0); // "A"
```

> **first()** — возвращает ссылку на первый элемент. Метод позволяет как получить значение, так и изменить его. Прототипы метода:
```c++
T &first()
const T &first() const
```

> **last()** — возвращает ссылку на последний элемент. Метод позволяет как получить значение, так и изменить его. Прототипы метода:
```c++
T &last()
const T &last() const
```
Пример:
```c++
QStringList list = { "A", "B", "C" };

list.first() = "D";
list.last() = "E";

qDebug() << list.first(); // "D"
qDebug() << list.last(); // "E"
qDebug() << list; // QList("D", "B", "E")
```

> **value()** — возвращает значение элемента, расположенного по указанному индексу, или значение `defaultValue`, если такого индекса нет. Прототипы метода:
```c++
T value(qsizetype i) const
T value(qsizetype i, QList::parameter_type defaultValue) const
```
Пример:
```c++
QStringList list = { "A", "B", "C" };
qDebug() << list.value(0); // "A"
qDebug() << list.value(1); // "B"
```
Можно также воспользоваться следующими методами:
```c++
QList::pointer data()
QList::const_pointer data() const
QList::const_pointer constData() const
const T &constFirst() const
const T &constLast() const
```

## Итераторы

**Итератор** — это объект, выполняющий в контейнере роль указателя. С помощью итератора можно перемещаться внутри контейнера и получать доступ к отдельным элементам. В классе [[QList|QList]] определены следующие типы итераторов:

> **iterator** — итератор. При увеличении значения итератор перемещается к концу списка. Пример объявления переменной:
```c++
QStringList::iterator it;
```

> **const_iterator** — константный итератор. Изменить значение, на которое ссылается итератор, нельзя. Пример объявления переменной:
```c++
QStringList::const_iterator it;
```

> **reverse_iterator** — обратный итератор. При увеличении значения итератор перемещается к началу списка. Пример объявления переменной:
```c++
QStringList::reverse_iterator it;
```

> **const_reverse_iterator** — константный обратный итератор. Изменить значение, на которое ссылается итератор, нельзя. Пример объявления переменной: 
```c++
QStringList::const_reverse_iterator it;
```

Присвоить значения переменным позволяют следующие методы:

> **begin()** — возвращает итератор, установленный на первый элемент. Прототипы метода:
```c++
QList::iterator begin()
QList::const_iterator begin() const
```
Выведем первый элемент:
```c++
QStringList list = { "A", "B", "C" };
QStringList::iterator it = list.begin();
qDebug() << *it; // "A"
```

> **end()** — возвращает итератор, установленный на позицию после последнего элемента. Прототипы метода:
```c++
QList::iterator end()
QList::const_iterator end() const
```
Выведем последний символ строки:
```c++
QStringList list = { "A", "B", "C" };
QStringList::iterator it = list.end();
qDebug() << *(--it); // "C"
```

> **cbegin()** и **constBegin()** — возвращают константный итератор, установленный на первый символ строки. Прототипы методов: 
```c++
QList::const_iterator cbegin() const
QList::const_iterator constBegin() const
```

> **cend()** и **constEnd()** — возвращают константный итератор, установленный на позицию после последнего символа строки. Прототипы методов:
```c++
QList::const_iterator cend() const
QList::const_iterator constEnd() const
```

> **rbegin()** — возвращает обратный итератор, установленный на последний элемент. Прототипы метода:
```c++
QList::reverse_iterator rbegin()
QList::const_reverse_iterator rbegin() const
```
Выведем последний элемент:
```c++
QStringList list = { "A", "B", "C" };
QStringList::reverse_iterator it = list.rbegin();
qDebug() << *it; // "C"
```

> **rend()** — возвращает обратный итератор, установленный на позицию перед первым элементом. Прототипы метода:
```c++
QList::reverse_iterator rend()
QList::const_reverse_iterator rend() const
```
Выведем первый элемент:
```c++
QStringList list = { "A", "B", "C" };
QStringList::reverse_iterator it = list.rend();
qDebug() << *(--it); // "A"
```

> **crbegin()** — возвращает константный обратный итератор, установленный на последний элемент. Прототип метода
```c++
QList::const_reverse_iterator crbegin() const
```

> **crend()** — возвращает константный обратный итератор, установленный на позицию перед первым элементом. Прототип метода:
```c++
QList::const_reverse_iterator crend() const
```

С итераторами можно производить такие же операции, как и с указателями. Чтобы получить или изменить значение, на которое ссылается итератор, перед названием переменной указывается оператор `*` (`*it`). Перемещение итератора осуществляется с помощью операторов `+`, `-`, `++` и `--`. Кроме того, итераторы можно сравнивать с помощью операторов сравнения.

## Перебор элементов

Перебрать все элементы можно с помощью циклов [[for|for , for each]] и итераторов. Пример использования цикла [[for|for each]]:

```c++
QStringList list = { "A", "B", "C" };

for (QString &el : list) {
	qDebug() << el;
}
```

Пример перебора элементов с помощью итераторов и цикла [[for|for]]:

```c++
QStringList list = { "A", "B", "C" };
QStringList::iterator it1, it2;
QStringList::reverse_iterator it3, it4;

// Перебор в прямом порядке
for (it1 = list.begin(), it2 = list.end(); it1 != it2; ++it1) {
	qDebug() << *it1;
}

qDebug() << "------------------";

// Перебор в обратном порядке
for (it3 = list.rbegin(), it4 = list.rend(); it3 != it4; ++it3) {
	qDebug() << *it3;
}
```

## Сортировка списка

Для сортировки списка предназначен метод **sort()**. Прототип метода:
```c++
void sort(Qt::CaseSensitivity cs = Qt::CaseSensitive)
```

Если в параметре `cs` указана константа `Qt::CaseSensitive`, то сравнение зависит от регистра символов. Чтобы сравнение не зависело от регистра символов, нужно указать константу `Qt::CaseInsensitive`:
```c++
QStringList list = { "C", "A", "B" };

list.sort(Qt::CaseSensitive);
qDebug() << list; // QList("A", "B", "C")
```

## Получение фрагмента списка

Получить фрагмент списка позволяют следующие методы:

> **sliced()** — возвращает фрагмент длиной `n`, начиная с индекса `pos`. Если второй параметр не задан, то возвращаются все элементы до конца списка. Прототипы метода:
```c++
QList<T> sliced(qsizetype pos) const
QList<T> sliced(qsizetype pos, qsizetype n) const
```
Пример:
```c++
QStringList list = { "A", "B", "C", "D" };
QStringList list2 = list.sliced(1);
qDebug() << list2; // QList("B", "C", "D")
list2 = list.sliced(1, 2);
qDebug() << list2; // QList("B", "C")
```

> **mid()** — возвращает фрагмент длиной `length`, начиная с индекса `pos`. Если второй параметр не задан, то возвращаются все элементы до конца списка. Прототип метода:
```c++
QList<T> mid(qsizetype pos, qsizetype length = -1) const
```
Пример:
```c++
QStringList list = { "A", "B", "C", "D" };

QStringList list2 = list.mid(1);
qDebug() << list2; // QList("B", "C", "D")

list2 = list.mid(1, 2);
qDebug() << list2; // QList("B", "C")
```

> **first()** — возвращает список с первыми элементами в количестве `n`. Прототип метода:
```c++
QList<T> first(qsizetype n) const
```
Пример:
```c++
QStringList list = { "A", "B", "C", "D" };
QStringList list2 = list.first(2);
qDebug() << list2; // QList("A", "B")
```

> **last()** — возвращает список с последними элементами в количестве `n`. Прототип метода:
```c++
QList<T> last(qsizetype n) const
```
Пример:
```c++
QStringList list = { "A", "B", "C", "D" };
QStringList list2 = list.last(2);
qDebug() << list2; // QList("C", "D")
```

## Поиск элементов

Выполнить поиск элемента внутри списка позволяют следующие методы:

> **indexOf()** — производит поиск элемента с начала списка или с индекса `from` до конца списка. Возвращает индекс первого совпадения, если элемент найден, или значение `–1` — в противном случае. Прототипы метода:
```c++
qsizetype indexOf(const AT &value, qsizetype from = 0) const

qsizetype indexOf(const QRegularExpression &re,
						qsizetype from = 0) const
```
Пример:
```c++
QStringList list = { "A", "B", "C", "B" };

qDebug() << list.indexOf("B"); // 1
qDebug() << list.indexOf("D"); // -1
qDebug() << list.indexOf("B", 2); // 3
```

> **lastIndexOf()** — производит поиск элемента с конца списка или с индекса `from` до начала списка. Возвращает индекс первого совпадения, если элемент найден, или значение `–1` — в противном случае. Прототипы метода:
```c++
qsizetype lastIndexOf(const AT &value, qsizetype from = -1) const

qsizetype lastIndexOf(const QRegularExpression &re,
						qsizetype from = -1) const
```
Пример:
```c++
QStringList list = { "A", "B", "C", "B" };

qDebug() << list.lastIndexOf("B"); // 3
qDebug() << list.lastIndexOf("D"); // -1
qDebug() << list.lastIndexOf("B", 2); // 1
```

> **contains()** — проверяет, содержит ли список указанный элемент. Если содержит, то возвращается значение `true`, в противном случае — `false`. Прототипы метода:
```c++
bool contains(const QString &str,
					Qt::CaseSensitivity cs = Qt::CaseSensitive) const
					
bool contains(QLatin1String str,
					Qt::CaseSensitivity cs = Qt::CaseSensitive) const
					
bool contains(QStringView str,
					Qt::CaseSensitivity cs = Qt::CaseSensitive) const
```

Если в параметре `cs` указана константа `Qt::CaseSensitive`, то сравнение зависит от регистра символов. Чтобы сравнение не зависело от регистра символов, нужно указать константу `Qt::CaseInsensitive`:
```c++
QStringList list = { "A", "B", "C" };

qDebug() << list.contains("B"); // true
qDebug() << list.contains("D"); // false
qDebug() << list.contains("b"); // false
qDebug() << list.contains("b", Qt::CaseInsensitive); // true
```

> **startsWith()** — проверяет, начинается ли список с указанного элемента. Если начинается, то возвращается значение `true`, в противном случае — `false`. Прототип метода:
```c++
bool startsWith(QList::parameter_type value) const
```
Пример:
```c++
QStringList list = { "A", "B", "C" };

qDebug() << list.startsWith("A"); // true
qDebug() << list.startsWith("B"); // false
```

> **endsWith()** — проверяет, заканчивается ли список указанным элементом. Если заканчивается, то возвращается значение `true`, в противном случае — `false`. Прототип метода:
```c++
bool endsWith(QList::parameter_type value) const
```
Пример:
```c++
QStringList list = { "A", "B", "C" };

qDebug() << list.endsWith("C"); // true
qDebug() << list.endsWith("B"); // false
```

> **count()** — возвращает число вхождений элемента в список. Если элемент в списке отсутствует, то возвращается значение `0`. Прототип метода:
```c++
qsizetype count(const AT &value) const
```
Пример:
```c++
QStringList list = { "A", "B", "C", "B" };

qDebug() << list.count("B"); // 2
qDebug() << list.count("D"); // 0
```

## Замена элементов

Произвести замену в списке позволяют следующие методы:

> **fill()** — заменяет все элементы указанным элементом. Во втором параметре можно передать новый размер списка. Прототип метода:
```c++
QList<T> &fill(QList::parameter_type value, qsizetype size = -1)
```
Пример:
```c++
QStringList list = { "A", "B", "C" };

qDebug() << list.fill("*"); // QList("*", "*", "*")
qDebug() << list.fill("+", 2); // QList("+", "+")
```

> move() — перемещает элемент. Прототип метода:
```c++
void move(qsizetype from, qsizetype to)
```
Пример:
```c++
QStringList list = { "A", "B", "C" };
list.move(1, 2);
qDebug() << list; // QList("A", "C", "B")
```

> **replace()** — заменяет элемент. Прототипы метода:
```c++
void replace(qsizetype i, QList::parameter_type value)
void replace(qsizetype i, QList::rvalue_ref value)
```
Пример:
```c++
QStringList list = { "A", "B", "C" };
list.replace(1, "D");
qDebug() << list; // QList("A", "D", "C")
```

> **replaceInStrings()** — заменяет фрагмент `before` фрагментом `after` во всех элементах списка. Прототипы метода:
```c++
QStringList &replaceInStrings(const QString &before,
						const QString &after,
						Qt::CaseSensitivity cs = Qt::CaseSensitive)
						
QStringList &replaceInStrings(QStringView before,
						QStringView after,
						Qt::CaseSensitivity cs = Qt::CaseSensitive)
						
QStringList &replaceInStrings(const QString &before,
						QStringView after,
						Qt::CaseSensitivity cs = Qt::CaseSensitive)
						
QStringList &replaceInStrings(QStringView before,
						const QString &after,
						Qt::CaseSensitivity cs = Qt::CaseSensitive)
						
QStringList &replaceInStrings(const QRegularExpression &re,
						const QString &after)
```
Заменим все числа символом `+` с помощью регулярного выражения:
```c++
// #include <QRegularExpression>

QStringList list = { "A12", "B23", "C45" };

list.replaceInStrings(QRegularExpression("[0-9]+"), "+");
qDebug() << list; // QList("A+", "B+", "C+")
```
Если в параметре `cs` указана константа `Qt::CaseSensitive`, то поиск зависит от регистра символов. Чтобы поиск не зависел от регистра символов, нужно указать константу `Qt::CaseInsensitive`:
```c++
QStringList list = { "A1", "a2", "B3" };

list.replaceInStrings("a", "+");
qDebug() << list; // QList("A1", "+2", "B3")

list.replaceInStrings("a", "+", Qt::CaseInsensitive);
qDebug() << list; // QList("+1", "+2", "B3")
```

## Фильтрация списка

Метод `filter()` возвращает список строк, содержащих подстроку `str`. Прототипы метода:

```c++
QStringList filter(const QString &str,
						Qt::CaseSensitivity cs = Qt::CaseSensitive) const
						
QStringList filter(QStringView str,
						Qt::CaseSensitivity cs = Qt::CaseSensitive) const
						
QStringList filter(const QRegularExpression &re) const
```

Пример получения элементов, содержащих числа:
```c++
// #include <QRegularExpression>
QStringList list = { "A12", "B23", "C", "D" };
QStringList list2 = list.filter(QRegularExpression("[0-9]+"));
qDebug() << list2; // QList("A12", "B23")
```
Если в параметре `cs` указана константа `Qt::CaseSensitive`, то поиск зависит от регистра символов. Чтобы поиск не зависел от регистра символов, нужно указать константу `Qt::CaseInsensitive`:
```c++
QStringList list = { "A", "a", "C", "D" };

QStringList list2 = list.filter("a");
qDebug() << list2; // QList("a")

list2 = list.filter("a", Qt::CaseInsensitive);
qDebug() << list2; // QList("A", "a")
```

## Преобразование списка в строку

Преобразовать список в строку позволяет метод **join()** . Элементы добавляются через указанный разделитель. Прототипы метода:
```c++
QString join(QChar separator) const
QString join(const QString &separator) const
QString join(QStringView separator) const
QString join(QLatin1String separator) const
```
Пример:
```c++
QStringList list = { "A", "B", "C", "D" };

QString str = list.join(L',');
qDebug() << str; // "A,B,C,D"

str = list.join("+");
qDebug() << str; // "A+B+C+D"
```
Выполнить обратную операцию позволяет метод `split()` из класса [[QString|QString]]:
```c++
QString str = "A,B,C,D";
QStringList list = str.split(",");
qDebug() << list; // QList("A", "B", "C", "D")
```




