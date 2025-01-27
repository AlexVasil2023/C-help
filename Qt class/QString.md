# QString

[[#QString|QString]] 
1. [[#Создание объекта]]
2. [[#Преобразование объекта в другой тип данных]]
3. [[#Получение и изменение размера строки]]
4. [[#Доступ к отдельным символам]]
5. [[#Перебор символов строки]]
6. [[#Итераторы]]
7. [[#Конкатенация строк]]


В целом, работа с текстом в Qt основана на Unicode. Для этого используется класс `QString`. Он поставляется с множеством замечательных функций, которые можно ожидать от современного фреймворка. Для 8-битных данных обычно используется класс [[QByteArray|QByteArray]] , а для ASCII-идентификаторов - `QLatin1String` для экономии памяти. Для списка строк можно использовать `QList<QString>` или просто класс [[QStringList|QStringList]] (который является производным от `QList<QString>` ).

Ниже приведены примеры использования класса `QString`. `QString` может быть создан в стеке, но хранит свои данные в куче. Кроме того, при присваивании одной строки другой данные не копируются - только ссылка на них. Таким образом, это очень дешево и позволяет разработчику сосредоточиться на коде, а не на работе с памятью. `QString` использует счетчики ссылок, чтобы знать, когда данные можно безопасно удалить. 

```c++
QString data("A,B,C,D");              // создание простой строки
									 
// разбить на части
QStringList list = data.split(",");

// создаем новую строку из частей QString out =
list.join(",");

// проверить, что оба значения одинаковы 
QVERIFY(data == out);

// изменить первый символ на верхний регистр
QVERIFY(QString("A") == out[0].toUpper());
```

Ниже показано, как преобразовать число в строку и обратно. Существуют также функции преобразования для `float`, `double` и других типов. Просто найдите в документации Qt использованную здесь функцию, и вы найдете другие.

```c++
// создаем некоторые переменные 
int v = 10;
int base = 10;

// преобразование int в строку 
QString a = QString::number(v, base);

// и обратно, используя и устанавливая значение ok в true при успехе 
bool ok(false);
int v2 = a.toInt(&ok, base);

// проверяем результаты
QVERIFY(ok == true);
QVERIFY(v = v2);
```

Часто в тексте необходимо иметь параметризованный текст. Одним из вариантов может быть использование `QString("Hello" + name)`, но более гибким методом является подход с использованием маркеров `arg`. Он сохраняет порядок и при переводе, когда порядок может измениться.

```c++
// создаем имя
QString name("Joe");

// получить день недели в виде строки
QString weekday = QDate::currentDate().toString("dddd");

// форматирование текста с использованием параметров (%1, %2)
QString hello = QString("Здравствуйте %1. Сегодня %2.").arg(name).arg();

// Это сработало в понедельник. Обещаю!
if(Qt::Monday == QDate::currentDate().dayOfWeek()) {
	QCOMPARE(QString("Hello Joe. Today is Monday."), hello);
} else {
	QVERIFY(QString("Привет, Джо. Сегодня понедельник.") != hello);
}
```

Иногда требуется использовать символы `Unicode` непосредственно в коде. Для этого необходимо вспомнить, как их обозначать для классов `QChar` и `QString`.

```c++
// Создаем юникодный символ, используя юникод для smile :-)
QChar smile(0x263A);
// вы должны увидеть на консоли символ :-)
qDebug() << smile;

// Использование юникода в строке
QChar smile2 = QString("\u263A").at(0);
QVERIFY(smile == smile2);

// Создаем 12 смайлов в векторе QVector<QChar>
smilies(12); smilies.fill(smile);

// Видите ли вы смайлы qDebug()
<< smilies;
```

Это дает вам несколько примеров того, как можно легко обрабатывать текст в Qt с поддержкой `Unicode`. Для неюникодных текстов класс [[QByteArray|QByteArray]] также имеет множество вспомогательных функций для преобразования. 

## Создание объекта

Создать объект позволяют следующие конструкторы класса `QString`:

```c++
QString()
QString(QChar ch)
QString(qsizetype size, QChar ch)
QString(const QChar *unicode, qsizetype size = -1)
QString(const char *str)
QString(const QByteArray &ba)
QString(const char8_t *str)
QString(QLatin1String str)
QString(const QString &other)
QString(QString &&other)
```

Примеры:

```c++
QChar ch = L'd';
QString str1 = ch;
qDebug() << str1; // "d"
QString str2(5, ch);
qDebug() << str2; // "ddddd"
```

Пятый конструктор принимает C-строку в кодировке UTF-8. Учитывая, что файл у нас сохранен в кодировке UTF-8, никаких дополнительных действий выполнять не нужно. Везде, где ожидается объект `QString`, мы можем передать C-строку:

```c++
QString str = "строка";
qDebug() << str; // "строка"
```

Создать объект позволяют также следующие статические методы:

```c++
static QString fromUtf8(const char *str, qsizetype size)
static QString fromUtf8(QByteArrayView str)
static QString fromUtf8(const QByteArray &str)
static QString fromUtf8(const char8_t *str)
static QString fromUtf8(const char8_t *str, qsizetype size)
static QString fromWCharArray(const wchar_t *string, qsizetype size = -1)
static QString fromRawData(const QChar *unicode, qsizetype size)
static QString fromStdString(const std::string &str)
static QString fromStdWString(const std::wstring &str)
static QString fromLatin1(const char *str, qsizetype size)
static QString fromLatin1(QByteArrayView str)
static QString fromLatin1(const QByteArray &str)
static QString fromLocal8Bit(const char *str, qsizetype size)
static QString fromLocal8Bit(QByteArrayView str)
static QString fromLocal8Bit(const QByteArray &str)
static QString fromUtf16(const char16_t *unicode, qsizetype size = -1)
static QString fromUcs4(const char32_t *unicode, qsizetype size = -1)
static QString fromStdU16String(const std::u16string &str)
static QString fromStdU32String(const std::u32string &str)
static QString fromCFString(CFStringRef string)
static QString fromNSString(const NSString *string)
```

Пример:

```c++
QString str1 = QString::fromUtf8("строка");
qDebug() << str1; // "строка"
std::string s("строка");
QString str2 = QString::fromStdString(s);
qDebug() << str2; // "строка"
std::wstring w(L"строка");
QString str3 = QString::fromStdWString(w);
qDebug() << str3; // "строка"
```

Присвоить значение после создания объекта позволяет оператор =:

```c++
QString str;
str = "строка";
qDebug() << str; // "строка"
```

Можно также воспользоваться следующими методами:

```c++
QString &setRawData(const QChar *unicode, qsizetype size)
QString &setUnicode(const QChar *unicode, qsizetype size)
QString &setUtf16(const ushort *unicode, qsizetype size)
```

## Преобразование объекта в другой тип данных

Преобразовать объект QString в другой тип данных позволяют следующие методы:

```c++
QChar *data()
const QChar *data() const
const QChar *unicode() const
const QChar *constData() const
const ushort *utf16() const
QByteArray toUtf8() const
std::string toStdString() const
std::wstring toStdWString() const
qsizetype toWCharArray(wchar_t *array) const
std::u16string toStdU16String() const
std::u32string toStdU32String() const
QList<uint> toUcs4() const
QByteArray toLatin1() const
QByteArray toLocal8Bit() const
CFStringRef toCFString() const
NSString *toNSString() const
```

Пример:

```c++
QString str1 = "строка";
std::string s = str1.toStdString();
QString str2 = QString::fromStdString(s);
qDebug() << str2; // "строка"
std::wstring w = str1.toStdWString();
qDebug() << w; // "строка"
```

## Получение и изменение размера строки

Для получения и изменения размера строки предназначены следующие методы:

> **size()**, **length()** и **count()** — возвращают текущее количество символов в строке. Прототипы методов: `qsizetype size() const`, `qsizetype length() const`, `qsizetype count() const`

Пример:
```c++
QString str("строка");
qDebug() << str.size(); // 6
qDebug() << str.length(); // 6
qDebug() << str.count(); // 6
```

> **capacity()** — возвращает количество символов, которое можно записать в строку без перераспределения памяти. Прототип метода: `qsizetype capacity() const`
> Пример:
```c++
QString str("строка");
qDebug() << str.size(); // 6
qDebug() << str.capacity(); // 12
str += " строка2 строка3";
qDebug() << str.size(); // 22
qDebug() << str.capacity(); // 24
```

> **reserve()** — позволяет задать минимальное количество символов, которое можно записать в строку без перераспределения памяти. Как видно из предыдущего примера, выделение дополнительной памяти производится автоматически с некоторым запасом. Если дозапись в строку производится часто, то это может снизить эффективность программы, т. к. перераспределение памяти будет выполнено несколько раз. Поэтому, если количество символов заранее известно, следует указать его с помощью метода `reserve()`. Прототип метода: `void reserve(qsizetype size)`
> Пример указания минимального размера строки:
```c++
QString str("строка");
str.reserve(50);
qDebug() << str.size(); // 6
qDebug() << str.capacity(); // 50
str += " строка2 строка3";
qDebug() << str.size(); // 22
qDebug() << str.capacity(); // 50
```

> **shrink_to_fit()** и **squeeze()** — уменьшают размер строки до минимального значения. Прототипы методов: `void shrink_to_fit()`, `void squeeze()`
> Пример:
```c++
QString str("строка");
str.reserve(50);
qDebug() << str.capacity(); // 50
str.squeeze();
qDebug() << str.capacity(); // 6
```

> **resize()** — задает количество символов в строке, равное числу `n`. Если указанное количество символов меньше текущего количества, то лишние символы будут удалены. Если количество символов необходимо увеличить, то в параметре `ch` можно указать символ, который заполнит новое пространство. Прототипы метода: `void resize(qsizetype n)`, `void resize(qsizetype n, QChar ch)`
> Пример:
```c++
QString str("строка");
str.resize(4);
qDebug() << str; // "стро"
str.resize(8, L'*');
qDebug() << str; // "стро****"
```

> **truncate()** — обрезает строку до указанного количества символов. Если размер строки меньше указанного количества, то ничего не происходит. Прототип метода: `void truncate(qsizetype position)`
> Пример:
```c++
QString str("строка");
str.truncate(4);
qDebug() << str; // "стро"
```

> **clear()** — удаляет все символы. Прототип метода: `void clear()`
> Пример:
```c++
QString str("строка");
str.clear();
qDebug() << str.size(); // 0
```

> **isEmpty()** — возвращает значение `true`, если строка не содержит символов, и `false` — в противном случае. Прототип метода: `bool isEmpty() const` 
> Пример:
```c++
QString str("строка");
qDebug() << str.isEmpty(); // false
str.clear();
qDebug() << str.isEmpty(); // true
```

> **isNull()** — возвращает значение `true`, если объект не содержит строки, даже пустой, и `false` — в противном случае. Прототип метода: `bool isNull() const`
> Пример:
```c++
QString str1;
qDebug() << str1.isNull(); // true
QString str2("");
qDebug() << str2.isNull(); // false
```

> **fill()** — заменяет все символы в строке указанным символом. Во втором параметре можно передать новый размер строки. Прототип метода: `QString &fill(QChar ch, qsizetype size = -1)`
> Пример:
```c++
QString str = "ABC";
str.fill(L'*');
qDebug() << str; // "***"
str.fill(L'+', 2);
qDebug() << str; // "++"
```

> **leftJustified()** — задает новый размер строки. Метод возвращает измененную строку. Прототип метода: `QString leftJustified(qsizetype width, QChar fill = QLatin1Char(' '), bool truncate = false) const`
> Если число `width` больше размера строки, то после строки будут добавлены символы `fill` 
```c++
QString str = "строка";
QString str2 = str.leftJustified(10, L'*');
qDebug() << str2; // "строка****"
```

Если число `width` меньше размера строки, то поведение зависит от параметра `truncate`. Если параметр `truncate` имеет значение `false`, то возвращается вся строка, в противном случае строка обрезается:

```c++
QString str = "строка";
QString str2 = str.leftJustified(3, L'*');
qDebug() << str2; // "строка"
str2 = str.leftJustified(3, L'*', true);
qDebug() << str2; // "стр"
```

> **rightJustified()** — задает новый размер строки. Метод возвращает измененную строку. Прототип метода: `QString rightJustified(qsizetype width, QChar fill = QLatin1Char(' '), bool truncate = false) const`
> Если число `width` больше размера строки, то перед строкой будут добавлены символы `fill` 
```c++
QString str = "строка";
QString str2 = str.rightJustified(10, L'*');
qDebug() << str2; // "****строка"
```
Если число `width` меньше размера строки, то поведение зависит от параметра `truncate`. Если параметр `truncate` имеет значение `false`, то возвращается вся строка, в противном случае строка обрезается:

```c++
QString str = "строка";
QString str2 = str.rightJustified(3, L'*');
qDebug() << str2; // "строка"
str2 = str.rightJustified(3, L'*', true);
qDebug() << str2; // "стр"
```

## Доступ к отдельным символам

К любому символу в строке можно обратиться как к элементу массива. Достаточно указать его индекс в квадратных скобках. Нумерация начинается с нуля. Можно как получить символ, так и изменить его. Если индекс выходит за границы диапазона, то возвращаемое значение не определено. Каждый символ в строке является объектом [[QChar|QChar]].
Пример доступа к символу по индексу:
```c++
QString str = "string";
qDebug() << str[0]; // 's'
str[0] = QChar(L'S');
qDebug() << str; // "String"
```

Для доступа к символам можно также воспользоваться следующими методами:

> **at()** — возвращает символ, расположенный по индексу `pos`. Метод позволяет как получить символ, так и изменить его. Если индекс выходит за границы диапазона, то возникнет ошибка. Прототип метода: 
> `const QChar at(qsizetype pos) const` 
> Пример:
```c++
QString str = "string";
qDebug() << str.at(0); // 's'
```

> **front()** — возвращает ссылку на первый символ в строке или сам символ. Метод позволяет как получить символ, так и изменить его. Прототипы метода:
> `QChar front() const`
> `QChar &front()`
> Пример:
```c++
QString str = "String";
str.front() = L's';
qDebug() << str.front(); // 's'
qDebug() << str; // "string"
```

> **back()** — возвращает ссылку на последний символ в строке или сам символ. Метод позволяет как получить символ, так и изменить его. Прототипы метода:
> `QChar back() const`
> `QChar &back()`
> Пример:
```c++
QString str = "String";
str.back() = L'G';
qDebug() << str.back(); // 'G'
qDebug() << str; // "StrinG"
```

## Перебор символов строки

Перебрать символы внутри строки позволяет цикл [[for|for]]. В качестве примера выведем все символы по одному на строке:

```c++
QString str = "string";

for (qsizetype i = 0, len = str.size(); i < len; ++i) {
	qDebug() << str[i];
}
```

Для перебора всех символов строки удобно использовать цикл [[for|for each]]:

```c++
QString str = "string";

for (QChar &ch : str) {
	qDebug() << ch;
}
```

## Итераторы

***Итератор*** — это объект, выполняющий в контейнере роль указателя. С помощью итератора можно перемещаться внутри контейнера и получать доступ к отдельным элементам. В классе `QString` определены следующие типы итераторов:

> **iterator** — итератор. При увеличении значения итератор перемещается к концу строки. Пример объявления переменной:
```c++
QString::iterator it;
```

> **const_iterator** — константный итератор. Изменить значение, на которое ссылается итератор, нельзя. Пример объявления переменной:
```c++
QString::const_iterator it;
```

> **reverse_iterator** — обратный итератор. При увеличении значения итератор перемещается к началу строки. Пример объявления переменной:
```c++
QString::reverse_iterator it;
```

> **const_reverse_iterator** — константный обратный итератор. Изменить значение, на которое ссылается итератор, нельзя. Пример объявления переменной:
```c++
QString::const_reverse_iterator it;
```

Присвоить значения переменным позволяют следующие методы:

> **begin()** — возвращает итератор, установленный на первый символ строки. Прототипы метода:
```c++
QString::iterator begin()
QString::const_iterator begin() const
```
Выведем первый символ строки:
```c++
QString str = "String";
QString::iterator it = str.begin();
qDebug() << *it; // 'S'
```

> **end()** — возвращает итератор, установленный на позицию после последнего символа строки. Прототипы метода:
```c++
QString::iterator end()
QString::const_iterator end() const
```
Выведем последний символ строки:
```c++
QString str = "String";
QString::iterator it = str.end();
qDebug() << *(--it); // 'g'
```

> **cbegin()** и **constBegin()** — возвращают константный итератор, установленный на первый символ строки. Прототипы методов:
```c++
QString::const_iterator cbegin() const
QString::const_iterator constBegin() const
```

> **cend()** и **constEnd()** — возвращают константный итератор, установленный на позицию после последнего символа строки. Прототипы методов:
```c++
QString::const_iterator cend() const
QString::const_iterator constEnd() const
```

> **rbegin()** — возвращает обратный итератор, установленный на последний символ строки. Прототипы метода:
```c++
QString::reverse_iterator rbegin()
QString::const_reverse_iterator rbegin() const
```
Выведем последний символ строки:
```c++
QString str = "String";
QString::reverse_iterator it = str.rbegin();
qDebug() << *it; // 'g'
```

> **rend()** — возвращает обратный итератор, установленный на позицию перед первым символом строки. Прототипы метода:
```c++
QString::reverse_iterator rend()
QString::const_reverse_iterator rend() const
```
Выведем первый символ строки:
```c++
QString str = "String";
QString::reverse_iterator it = str.rend();
qDebug() << *(--it); // 'S'
```

> **crbegin()** — возвращает константный обратный итератор, установленный на последний символ строки. Прототип метода:
```c++
QString::const_reverse_iterator crbegin() const
```

> **crend()** — возвращает константный обратный итератор, установленный на позицию перед первым символом строки. Прототип метода:
```c++
QString::const_reverse_iterator crend() const
```

С итераторами можно производить такие же операции, как и с указателями. Чтобы получить или изменить значение, на которое ссылается итератор, перед названием переменной указывается оператор `*` `(*it )`. Перемещение итератора существляется с помощью операторов `+` , `-` , `++` и `--`. Кроме того, итераторы можно сравнивать с помощью операторов сравнения. В качестве примера изменим значение первого символа, а затем выведем все символы строки в прямом и обратном порядке с помощью цикла [[for|for]] (листинг).

```c++
QString str = "String";
QString::iterator it1, it2;
QString::reverse_iterator it3, it4;
it1 = str.begin();
*it1 = L's'; // Изменение значения

// Перебор символов в прямом порядке
for (it1 = str.begin(), it2 = str.end(); it1 != it2; ++it1) 
	qDebug() << *it1;

qDebug() << "------------------";

// Перебор символов в обратном порядке
for (it3 = str.rbegin(), it4 = str.rend(); it3 != it4; ++it3)
	qDebug() << *it3;
```


## Конкатенация строк

Для объектов класса `QString` определена операция конкатенации (объединения строк). Оператор + позволяет объединить:

> **два объекта класса `QString`**:
```c++
QString str1 = "A", str2 = "B";
QString str3 = str1 + str2;
qDebug() << str3; // "AB"
```

> **объект класса `QString` с C-строкой в кодировке UTF-8**
```c++
QString str1 = "A", str2, str3;
str2 = str1 + "B";
str3 = "B" + str1;
qDebug() << str2; // "AB"
qDebug() << str3; // "BA"
```

Помимо оператора + доступен оператор += , который производит конкатенацию с присваиванием:

```c++
QString str1 = "A", str2 = "B";
str1 += "C";
qDebug() << str1; // "AC"

str2 += str1;
qDebug() << str2; // "BAC"

str2 += QChar(L'D');
qDebug() << str2; // "BACD"
```

## Добавление и вставка символов

Для добавления и вставки символов предназначены следующие методы:

> **push_back()** — добавляет символ или строку в конец исходной строки. Прототип метода:
```c++
void push_back(QChar ch)
void push_back(const QString &other)
```
Пример:
```c++
QString str = "String";

str.push_back(L'1');
qDebug() << str; // "String1"

str.push_back(" String2");
qDebug() << str; // "String1 String2"
```

> **append()** — добавляет символ или строку в конец исходной строки. Прототипы метода:
```c++
QString &append(QChar ch)
QString &append(const char *str)
QString &append(const QString &str)
QString &append(const QChar *str, qsizetype len)
QString &append(QLatin1String str)
QString &append(const QByteArray &ba)
```
Пример:
```c++
QString str = "String";

str.append(L'1');
qDebug() << str; // "String1"

str.append(" String2").append(" String3");
qDebug() << str; // "String1 String2 String3"
```

> **insert()** — вставляет символы или строки в позицию, указанную индексом. Остальные символы сдвигаются к концу строки. Прототипы метода:
```c++
QString &insert(qsizetype position, QChar ch)
QString &insert(qsizetype position, const char *str)
QString &insert(qsizetype position, const QString &str)
QString &insert(qsizetype position, const QChar *unicode, qsizetype size)
QString &insert(qsizetype position, QStringView str)
QString &insert(qsizetype position, QLatin1String str)
QString &insert(qsizetype position, const QByteArray &str)
```
Пример:
```c++
QString str = "A";

str.insert(0, L'*'); // В начало строки
qDebug() << str; // "*A"

str.insert(str.size(), "+++"); // В конец строки
qDebug() << str; // "*A+++"
```

> **push_front()** — добавляет символ или строку в начало исходной строки. Прототипы метода:
```c++
void push_front(QChar ch)
void push_front(const QString &other)
```
Пример:
```c++
QString str = "A";

str.push_front(L'*');
qDebug() << str; // "*A"

str.push_front("+++");
qDebug() << str; // "+++*A"
```

> **prepend()** — добавляет символ или строку в начало исходной строки. Прототипы метода:
```c++
QString &prepend(QChar ch)
QString &prepend(const char *str)
QString &prepend(const QString &str)
QString &prepend(const QChar *str, qsizetype len)
QString &prepend(QStringView str)
QString &prepend(QLatin1String str)
QString &prepend(const QByteArray &ba)
```
Пример:
```c++
QString str = "A";
str.prepend(L'*');
qDebug() << str; // "*A"
str.prepend("+++");
qDebug() << str; // "+++*A"
```

> **repeated()** — возвращает строку, являющуюся повтором исходной строки `n` раз. Прототип метода:
```c++
QString repeated(qsizetype n) const
```
Пример:
```c++
QString str = "ABC";
qDebug() << str.repeated(3); // "ABCABCABC"
```

##  Удаление символов

Для удаления символов предназначены следующие методы:

> **truncate()** — обрезает строку до указанного количества символов. Если размер строки меньше указанного количества, то ничего не происходит. Прототип метода:
```c++
void truncate(qsizetype position)
```
Пример:
```c++
QString str("строка");
str.truncate(4);
qDebug() << str; // "стро"
```

> **clear()** — удаляет все символы. Прототип метода:
```c++
void clear()
```
Пример:
```c++
QString str("строка");
str.clear();
qDebug() << str.size(); // 0
```

> **erase()** — удаляет символы внутри диапазона, ограниченного двумя итераторами. Прототип метода:
```c++
QString::iterator erase(QString::const_iterator first,
QString::const_iterator last)
```
Пример:
```c++
QString str = "ABCDE";
QString::const_iterator first = str.cbegin();
QString::const_iterator last = str.cend();

++first;
--last;

QString::iterator it = str.erase(first, last);

qDebug() << str; // "AE"
qDebug() << *it; // 'E'
```
Для удаления символов можно также воспользоваться функцией `erase()`. Прототип функции:
```c++
qsizetype erase(QString &s, const T &t)
```
Пример:
```c++
QString str = "nN123n";
qsizetype n = erase(str, QChar(L'n'));
qDebug() << str; // "N123"
qDebug() << n; // 2
```

> **erase_if()** — удаляет символы, для которых функция pred возвращает `true`. Прототип функции:
```c++
qsizetype erase_if(QString &s, Predicate pred)
```
Удалим букву `n` вне зависимости от регистра символов:
```c++
QString str = "nN123n";

qsizetype n = erase_if(str, [](const QChar &ch){
	return (ch == QChar(L'n')) || (ch == QChar(L'N'));
});

qDebug() << str; // "123"
qDebug() << n; // 3
```

> **remove()** — удаляет символы. Прототипы метода: 
```c++
QString &remove(qsizetype position, qsizetype n)
QString &remove(QChar ch,
Qt::CaseSensitivity cs = Qt::CaseSensitive)
QString &remove(const QString &str,
Qt::CaseSensitivity cs = Qt::CaseSensitive)
QString &remove(QLatin1String str,
Qt::CaseSensitivity cs = Qt::CaseSensitive)
QString &remove(const QRegularExpression &re)
```
Пример:
```c++
QString str = "123456";

str.remove(0, 3);
qDebug() << str; // "456"

str.remove(L'6');
qDebug() << str; // "45"

str.remove("5");
qDebug() << str; // "4"
```

Если в параметре `cs` указана константа `Qt::CaseSensitive`, то поиск зависит от регистра символов. Чтобы поиск не зависел от регистра символов, нужно указать константу `Qt::CaseInsensitive `:
```c++
QString str = "nN123";

str.remove("n", Qt::CaseSensitive);
qDebug() << str; // "N123"

str = "nN123";

str.remove("n", Qt::CaseInsensitive);
qDebug() << str; // "123"
```

> **removeIf()** — удаляет символы, для которых функция pred возвращает `true`. Прототип метода:
```c++
QString &removeIf(Predicate pred)
```
Удалим букву `n` вне зависимости от регистра символов:
```c++
QString str = "nN123";

str.removeIf([](const QChar &ch){
	return (ch == QChar(L'n')) || (ch == QChar(L'N'));
});

qDebug() << str; // "123"
```

> **trimmed()** — удаляет пробельные символы в начале и конце строки и возвращает измененную строку. Пробельными символами считаются: пробел, символ перевода строки (`\n`), символ возврата каретки (`\r`), символы горизонтальной (`\t`) и вертикальной (`\v`) табуляции, перевод формата (`\f`). Прототип метода: 
```c++
QString trimmed() const
``` 
Пример:
```c++
QString str = " str\n\r\v\t\f";
qDebug() << str.trimmed(); // "str"
```

> **simplified()** — удаляет пробельные символы в начале и конце строки и возвращает измененную строку. Дополнительно заменяет пробельные символы внутри строки одним пробелом. Пробельными символами считаются: пробел, символ перевода строки (`\n`), символ возврата каретки (`\r`), символы горизонтальной (`\t`) и вертикальной (`\v`) табуляции, перевод формата (`\f`). Прототип метода:
```c++
QString simplified() const
```
Пример:
```c++
QString str = " str \n\v str\n\r\v\t\f";
qDebug() << str.simplified(); // "str str"
```

> **chop()** — удаляет указанное количество символов из конца строки. Прототип метода:
```c++
void chop(qsizetype n)
```
Пример:
```c++
QString str = "123456";
str.chop(3);
qDebug() << str; // "123"
```

> **chopped()** — удаляет указанное количество символов из конца строки и возвращает измененную строку. Прототип метода:
```c++
QString chopped(qsizetype len) const
```
Пример:
```c++
QString str = "123456";
QString str2 = str.chopped(3);
qDebug() << str2; // "123"
```

> **first()** и **left()** — возвращают указанное количество символов из начала строки. Прототипы методов:
```c++
QString first(qsizetype n) const
QString left(qsizetype n) const
```
Пример:
```c++
QString str = "123456";
QString str2 = str.first(3);
qDebug() << str2; // "123"
```
При использовании метода `left()`, если количество больше размера строки или меньше нуля, возвращается вся строка:
```c++
QString str = "123456";
QString str2 = str.left(3);
qDebug() << str2; // "123"
str2 = str.left(8);
qDebug() << str2; // "123456"
```

> **last()** и **right()** — возвращают указанное количество символов из конца строки. Прототипы методов:
```c++
QString last(qsizetype n) const
QString right(qsizetype n) const
```
Пример:
```c++
QString str = "123456";
QString str2 = str.last(3);
qDebug() << str2; // "456"
```
При использовании метода `right()` , если количество больше размера строки или меньше нуля, возвращается вся строка:
```c++
QString str = "123456";
QString str2 = str.right(3);
qDebug() << str2; // "456"
str2 = str.right(8);
qDebug() << str2; // "123456"
```

## Изменение регистра символов

Изменить регистр символов строки позволяют следующие методы:

> **toLower()** — переводит все символы в нижний регистр и возвращает новую строку. Прототип метода:
```c++
QString toLower() const
```
Пример:
```c++
QString str1 = "СТРОКА";
QString str2 = str1.toLower();
qDebug() << str2; // "строка"
```

> **toUpper()** — переводит все символы в верхний регистр и возвращает новую строку. Прототип метода:
```c++
QString toUpper() const
```
Пример:
```c++
QString str1 = "строка";
QString str2 = str1.toUpper();
qDebug() << str2; // "СТРОКА"
```

> **isLower()** — возвращает значение `true`, если все символы в строке в нижнем регистре, и `false` — в противном случае. Прототип метода: 
```c++
bool isLower() const
```
Пример:
```c++
QString str1 = "строка";
QString str2 = "СТРОКА";
qDebug() << str1.isLower(); // true
qDebug() << str2.isLower(); // false
```

> **isUpper()** — возвращает значение `true`, если все символы в строке в верхнем регистре и `false` — в противном случае. Прототип метода:
```c++
bool isUpper() const
```
Пример:
```c++
QString str1 = "строка";
QString str2 = "СТРОКА";
qDebug() << str1.isUpper(); // false
qDebug() << str2.isUpper(); // true
```

## Получение фрагмента строки

> Метод **sliced()** возвращает фрагмент строки, состоящий из `n` символов, начиная с индекса `pos`. Если длина не задана, то возвращается фрагмент, начиная с индекса `pos` до конца строки. Прототипы метода:
```c++
QString sliced(qsizetype pos) const
QString sliced(qsizetype pos, qsizetype n) const
```
Пример:
```c++
QString str = "строка";

qDebug() << str.sliced(0, 3); // "стр"

qDebug() << str.sliced(3); // "ока"
```

> Можно также воспользоваться аналогичным методом **mid()**. Прототип метода:
```c++
QString mid(qsizetype position, qsizetype n = -1) const
```
Пример:
```c++
QString str = "строка";

qDebug() << str.mid(0, 3); // "стр"

qDebug() << str.mid(3); // "ока"
```

Если параметр `position` имеет значение больше размера строки, то метод вернет пустую строку. Если параметр `n` имеет значение больше оставшихся символов в строке, то метод вернет оставшиеся символы:
```c++
QString str = "строка";

qDebug() << str.mid(10, 3); // ""

qDebug() << str.mid(3, 8); // "ока"
```

## Поиск в строке

Перечислим методы, предназначенные для поиска в строке:

> **indexOf()** — производит поиск символа или фрагмента с начала строки или с индекса `from` до конца строки. Возвращает индекс первого совпадения, если фрагмент найден или значение `–1` — в противном случае. Прототипы метода:
```c++
qsizetype indexOf(QChar ch, qsizetype from = 0,
					Qt::CaseSensitivity cs = Qt::CaseSensitive) const
					
qsizetype indexOf(const QString &str, qsizetype from = 0,
					Qt::CaseSensitivity cs = Qt::CaseSensitive) const
					
qsizetype indexOf(QStringView str, qsizetype from = 0,
					Qt::CaseSensitivity cs = Qt::CaseSensitive) const
					
qsizetype indexOf(QLatin1String str, qsizetype from = 0,
					Qt::CaseSensitivity cs = Qt::CaseSensitive) const
					
qsizetype indexOf(const QRegularExpression &re,
					qsizetype from = 0,
					QRegularExpressionMatch *rmatch = nullptr) const
```
Пример:
```c++
QString str = "123454321";
qDebug() << str.indexOf(L'2'); // 1
qDebug() << str.indexOf(L'6'); // -1
qDebug() << str.indexOf(L'2', 3); // 7
qDebug() << str.indexOf("2"); // 1
qDebug() << str.indexOf("6"); // -1
qDebug() << str.indexOf("2", 3); // 7
```
Если в параметре `cs` указана константа `Qt::CaseSensitive`, то поиск зависит от регистра символов. Чтобы поиск не зависел от регистра символов, нужно указать константу `Qt::CaseInsensitive`:
```c++
QString str = "строка";
qDebug() << str.indexOf(L'т', 0, Qt::CaseSensitive); // 1
qDebug() << str.indexOf(L'Т', 0, Qt::CaseSensitive); // -1
qDebug() << str.indexOf(L'Т', 0, Qt::CaseInsensitive); // 1
```

> **lastIndexOf()** — производит поиск символа или фрагмента с конца строки или с индекса from до начала строки. Возвращает индекс первого совпадения, если фрагмент найден, или значение `–1` — в противном случае. Прототипы метода:
```c++
qsizetype lastIndexOf(QChar ch, qsizetype from = -1,
				Qt::CaseSensitivity cs = Qt::CaseSensitive) const
				
qsizetype lastIndexOf(const QString &str, qsizetype from = -1,
				Qt::CaseSensitivity cs = Qt::CaseSensitive) const
				
qsizetype lastIndexOf(QStringView str, qsizetype from = -1,
				Qt::CaseSensitivity cs = Qt::CaseSensitive) const
				
qsizetype lastIndexOf(QLatin1String str, qsizetype from = -1,
				Qt::CaseSensitivity cs = Qt::CaseSensitive) const

qsizetype lastIndexOf(const QRegularExpression &re,
				qsizetype from = -1,
				QRegularExpressionMatch *rmatch = nullptr) const
```
Пример:
```c++
QString str = "123454321";
qDebug() << str.lastIndexOf(L'2'); // 7
qDebug() << str.lastIndexOf(L'6'); // -1
qDebug() << str.lastIndexOf(L'2', 3); // 1
qDebug() << str.lastIndexOf("2"); // 7
qDebug() << str.lastIndexOf("6"); // -1
qDebug() << str.lastIndexOf("2", 3); // 1
```
Если в параметре `cs` указана константа `Qt::CaseSensitive`, то поиск зависит от регистра символов. Чтобы поиск не зависел от регистра символов, нужно указать константу `Qt::CaseInsensitive`:
```c++
QString str = "строка";
qDebug() << str.lastIndexOf(L'т', -1, Qt::CaseSensitive); // 1
qDebug() << str.lastIndexOf(L'Т', -1, Qt::CaseSensitive); // -1
qDebug() << str.lastIndexOf(L'Т', -1, Qt::CaseInsensitive); // 1
```

> **contains()** — проверяет, содержит ли строка указанную подстроку. Если содержит, то возвращается значение `true`, в противном случае — `false`. Прототипы метода:
```c++
bool contains(QChar ch,
			Qt::CaseSensitivity cs = Qt::CaseSensitive) const
			
bool contains(const QString &str,
			Qt::CaseSensitivity cs = Qt::CaseSensitive) const
			
bool contains(QStringView str,
			Qt::CaseSensitivity cs = Qt::CaseSensitive) const
			
bool contains(QLatin1String str,
			Qt::CaseSensitivity cs = Qt::CaseSensitive) const
			
bool contains(const QRegularExpression &re,
			QRegularExpressionMatch *rmatch = nullptr) const
```
Пример:
```c++
QString str = "123454321";

qDebug() << str.contains(L'2'); // true
qDebug() << str.contains(L'6'); // false
qDebug() << str.contains("2"); // true
qDebug() << str.contains("6"); // false
```
Если в параметре `cs` указана константа `Qt::CaseSensitive`, то поиск зависит от регистра символов. Чтобы поиск не зависел от регистра символов, нужно указать константу `Qt::CaseInsensitive`:
```c++
QString str = "строка";
qDebug() << str.contains(L'т', Qt::CaseSensitive); // true
qDebug() << str.contains(L'Т', Qt::CaseSensitive); // false
qDebug() << str.contains(L'Т', Qt::CaseInsensitive); // true
```

> **startsWith()** — проверяет, начинается ли строка с указанной подстроки. Если начинается, то возвращается значение `true`, в противном случае — `false`. Прототипы метода:
```c++
bool startsWith(QChar c,
				Qt::CaseSensitivity cs = Qt::CaseSensitive) const
				
bool startsWith(const QString &s,
				Qt::CaseSensitivity cs = Qt::CaseSensitive) const
				
bool startsWith(QStringView str,
				Qt::CaseSensitivity cs = Qt::CaseSensitive) const
				
bool startsWith(QLatin1String s,
				Qt::CaseSensitivity cs = Qt::CaseSensitive) const
```
Пример:
```c++
QString str = "строка";

qDebug() << str.startsWith(L'с'); // true
qDebug() << str.startsWith(L'С'); // false
qDebug() << str.startsWith("стр"); // true
qDebug() << str.startsWith("Стр"); // false
```
Если в параметре `cs` указана константа `Qt::CaseSensitive`, то поиск зависит от регистра символов. Чтобы поиск не зависел от регистра символов, нужно указать константу `Qt::CaseInsensitive`:
```c++
QString str = "строка";

qDebug() << str.startsWith(L'с', Qt::CaseSensitive); // true
qDebug() << str.startsWith(L'С', Qt::CaseSensitive); // false
qDebug() << str.startsWith(L'С', Qt::CaseInsensitive); // true
```

> **endsWith()** — проверяет, заканчивается ли строка указанной подстрокой. Если заканчивается, то возвращается значение `true`, в противном случае — `false`. Прототипы метода:
```c++
bool endsWith(QChar c,
				Qt::CaseSensitivity cs = Qt::CaseSensitive) const
				
bool endsWith(const QString &s,
				Qt::CaseSensitivity cs = Qt::CaseSensitive) const
				
bool endsWith(QStringView str,
				Qt::CaseSensitivity cs = Qt::CaseSensitive) const
				
bool endsWith(QLatin1String s,
				Qt::CaseSensitivity cs = Qt::CaseSensitive) const
```
Пример:
```c++
QString str = "строка";

qDebug() << str.endsWith(L'а'); // true
qDebug() << str.endsWith(L'А'); // false
qDebug() << str.endsWith("ока"); // true
qDebug() << str.endsWith("Ока"); // false
```
Если в параметре cs указана константа `Qt::CaseSensitive`, то поиск зависит от регистра символов. Чтобы поиск не зависел от регистра символов, нужно указать константу `Qt::CaseInsensitive`:
```c++
QString str = "строка";

qDebug() << str.endsWith(L'а', Qt::CaseSensitive); // true
qDebug() << str.endsWith(L'А', Qt::CaseSensitive); // false
qDebug() << str.endsWith(L'А', Qt::CaseInsensitive); // true
```

> **count()** — возвращает число вхождений подстроки в строку. Если подстрока в строку не входит, то возвращается значение 0. Прототипы метода: 
```c++
qsizetype count(QChar ch,
				Qt::CaseSensitivity cs = Qt::CaseSensitive) const
				
qsizetype count(const QString &str,
				Qt::CaseSensitivity cs = Qt::CaseSensitive) const
				
qsizetype count(QStringView str,
				Qt::CaseSensitivity cs = Qt::CaseSensitive) const
				
qsizetype count(const QRegularExpression &re) const
```
Пример:
```c++
QString str = "пример пример";

qDebug() << str.count(L'п'); // 2
qDebug() << str.count(L'т'); // 0
qDebug() << str.count("при"); // 2
qDebug() << str.count("При"); // 0
```
Если в параметре `cs` указана константа `Qt::CaseSensitive`, то поиск зависит от регистра символов. Чтобы поиск не зависел от регистра символов, нужно указать константу `Qt::CaseInsensitive`:
```c++
QString str = "пример пример";
qDebug() << str.count(L'П', Qt::CaseSensitive); // 0
qDebug() << str.count(L'П', Qt::CaseInsensitive); // 2
```

## Замена в строке

Произвести замену в строке позволяют следующие методы:
> **fill()** — заменяет все символы в строке указанным символом. Во втором параметре можно передать новый размер строки. Прототип метода:
```c++
QString &fill(QChar ch, qsizetype size = -1)
```
Пример:
```c++
QString str = "ABC";

str.fill(L'*');
qDebug() << str; // "***"

str.fill(L'+', 2);
qDebug() << str; // "++"
```

> **swap()** — меняет содержимое двух строк местами. Прототип метода:
```c++
void swap(QString &other)
```
Пример:
```c++
QString str1("12345"), str2("67890");

str1.swap(str2);

qDebug() << str1; // "67890"
qDebug() << str2; // "12345"
```

> **replace()** — заменяет фрагмент строки отдельным символом или подстрокой. Если вставляемая подстрока меньше фрагмента, то остальные символы сдвигаются к началу строки, а если больше, то раздвигаются таким образом, чтобы вместить всю вставляемую подстроку. Прототипы метода:
```c++
QString &replace(qsizetype position, qsizetype n, QChar after)

QString &replace(qsizetype position, qsizetype n,
							const QString &after)
							
QString &replace(qsizetype position, qsizetype n,
							const QChar *unicode, qsizetype size)
							
QString &replace(QChar before, QChar after,
							Qt::CaseSensitivity cs = Qt::CaseSensitive)
							
QString &replace(QChar ch, const QString &after,
							Qt::CaseSensitivity cs = Qt::CaseSensitive)
							
QString &replace(QChar ch, QLatin1String after,
							Qt::CaseSensitivity cs = Qt::CaseSensitive)
							
QString &replace(const QChar *before, qsizetype blen,
							const QChar *after, qsizetype alen,
							Qt::CaseSensitivity cs = Qt::CaseSensitive)
							
QString &replace(const QString &before, const QString &after,
							Qt::CaseSensitivity cs = Qt::CaseSensitive)
							
QString &replace(const QString &before, QLatin1String after,
							Qt::CaseSensitivity cs = Qt::CaseSensitive)
							
QString &replace(QLatin1String before, QLatin1String after,
							Qt::CaseSensitivity cs = Qt::CaseSensitive)
							
QString &replace(QLatin1String before, const QString &after,
							Qt::CaseSensitivity cs = Qt::CaseSensitive)
							
QString &replace(const QRegularExpression &re,
							const QString &after)
```
Пример:
```c++
QString str = "12345";
str.replace(0, 3, L'*');
qDebug() << str; // "*45"

str = "12345";
str.replace(0, 3, "++++");
qDebug() << str; // "++++45"

str = "12345";
str.replace(L'2', L'8');
qDebug() << str; // "18345"

str = "12345";
str.replace("234", "+++");
qDebug() << str; // "1+++5"

str = "12 34 532";
// #include <QRegularExpression>
str.replace(QRegularExpression("[0-9]+"), "+");
qDebug() << str; // "+ + +"
```
Если в параметре `cs` указана константа `Qt::CaseSensitive`, то поиск зависит от регистра символов. Чтобы поиск не зависел от регистра символов, нужно указать константу `Qt::CaseInsensitive`:
```c++
QString str = "тест";

str.replace("Е", "о", Qt::CaseSensitive);
qDebug() << str; // "тест"

str.replace("Е", "о", Qt::CaseInsensitive);
qDebug() << str; // "тост"
```

> **toHtmlEscaped()** — заменяет специальные символы из HTML соответствующими HTML-эквивалентами и возвращает измененную строку. Прототип метода: 
```c++
QString toHtmlEscaped() const
```
Пример:
```c++
QString str = "<b>\"&";
QString str2 = str.toHtmlEscaped();
qDebug() << str2; // "&lt;b&gt;&quot;&amp;"
```

## Сравнение строк

Над двумя объектами или объектом класса `QString` и C-строкой определены операции `==`, `!=`, `<`, `>`, `<=` и `>=`:
```c++
QString str1 = "abc", str2 = "abcd";

if (str1 == str2) {
	qDebug() << "str1 == str2";
}
else if (str1 < str2) {
	qDebug() << "str1 < str2";
}
else if (str1 > str2) {
	qDebug() << "str1 > str2";
} // Результат: str1 < str2
```

Обратите внимание на то, что сравнивать с помощью этих операторов C-строки нельзя, т. к. будут сравниваться адреса, а не символы в строках. Для сравнения C-строк необходимо использовать специальные функции, например **`strcmp()`**. Для корректной работы операторов сравнения необходимо, чтобы справа или слева от оператора находился объект класса `QString`. Пример:

```c++
char a[] = "abc", b[] = "abc";
QString c = "abc";

qDebug() << (a == b); // Сравниваются адреса!!!
qDebug() << (a == c); // OK (равны)
qDebug() << (c == b); // OK (равны)
```

Для сравнения объекта класса `QString` с другим объектом класса `QString` можно использовать метод `compare()`. В качестве значения метод возвращает:
> **отрицательное число** — если объект класса `QString` меньше строки, переданной в качестве параметра;
> **0** — если строки равны;
> **положительное число** — если объект класса `QString` больше строки, переданной в качестве параметра

Прототипы метода:

```c++
int compare(QChar ch, Qt::CaseSensitivity cs = Qt::CaseSensitive) const

int compare(const QString &other,
					Qt::CaseSensitivity cs = Qt::CaseSensitive) const
					
int compare(QStringView s,
					Qt::CaseSensitivity cs = Qt::CaseSensitive) const
					
int compare(QLatin1String other,
					Qt::CaseSensitivity cs = Qt::CaseSensitive) const
```

Пример:

```c++
QString str1 = "abc", str2 = "abd";

qDebug() << str1.compare("abd"); // -1
qDebug() << str2.compare("abd"); // 0
qDebug() << str1.compare("abb"); // 1
```

Если в параметре `cs` указана константа `Qt::CaseSensitive`, то сравнение зависит от регистра символов. Чтобы сравнение не зависело от регистра символов, нужно указать константу `Qt::CaseInsensitive`:
```c++
QString str1 = "abc", str2 = "ABC";
qDebug() << str1.compare(str2, Qt::CaseSensitive); // 32
qDebug() << str1.compare(str2, Qt::CaseInsensitive); // 0
```

Можно также воспользоваться статическим методом `compare()`. Прототипы метода:
```c++
static int compare(const QString &s1, const QString &s2,
								Qt::CaseSensitivity cs = Qt::CaseSensitive)
								
static int compare(const QString &s1, QLatin1String s2,
								Qt::CaseSensitivity cs = Qt::CaseSensitive)
								
static int compare(QLatin1String s1, const QString &s2,
								Qt::CaseSensitivity cs = Qt::CaseSensitive)
								
static int compare(const QString &s1, QStringView s2,
								Qt::CaseSensitivity cs = Qt::CaseSensitive)
								
static int compare(QStringView s1, const QString &s2,
								Qt::CaseSensitivity cs = Qt::CaseSensitive)
```
Пример:
```c++
QString str1 = "abc", str2 = "abd";

qDebug() << QString::compare(str1, "abd"); // -1
qDebug() << QString::compare(str2, "abd"); // 0
qDebug() << QString::compare(str1, "abb"); // 1
```

Если в параметре cs указана константа `Qt::CaseSensitive`, то сравнение зависит от регистра символов. Чтобы сравнение не зависело от регистра символов, нужно указать константу `Qt::CaseInsensitive`:
```c++
QString str1 = "abc", str2 = "ABC";

qDebug() << QString::compare(str1, str2, Qt::CaseSensitive); // 32
qDebug() << QString::compare(str1, str2, Qt::CaseInsensitive); // 0
```

Можно также воспользоваться статическим методом `localeAwareCompare()`, который учитывает настройки локали. Прототипы метода:
```c++
static int localeAwareCompare(const QString &s1, const QString &s2)
static int localeAwareCompare(QStringView s1, QStringView s2)
```
Пример:
```c++
QString str1 = "abc", str2 = "abd";

qDebug() << QString::localeAwareCompare(str1, "abd"); // -1
qDebug() << QString::localeAwareCompare(str2, "abd"); // 0
qDebug() << QString::localeAwareCompare(str1, "abb"); // 1
```

## Преобразование строки в число

Для преобразования строки в число используются следующие методы:

```c++
short toShort(bool *ok = nullptr, int base = 10) const
ushort toUShort(bool *ok = nullptr, int base = 10) const
int toInt(bool *ok = nullptr, int base = 10) const
uint toUInt(bool *ok = nullptr, int base = 10) const
long toLong(bool *ok = nullptr, int base = 10) const
ulong toULong(bool *ok = nullptr, int base = 10) const
qlonglong toLongLong(bool *ok = nullptr, int base = 10) const
qulonglong toULongLong(bool *ok = nullptr, int base = 10) const
float toFloat(bool *ok = nullptr) const
double toDouble(bool *ok = nullptr) const
```

Пробельные символы в начале строки игнорируются. Результат выполнения операции доступен через первый параметр (значение `true`, если операция выполнена успешно). Метод возвращает преобразованное число или значение `0`, если преобразовать не удалось. Пример преобразования строки в целое число:

```c++
QString str = " \n\r25";
bool ok;
int n = str.toInt(&ok);

qDebug() << n; // 25
qDebug() << ok; // true

str = "ff";
n = str.toInt(&ok);

qDebug() << n; // 0
qDebug() << ok; // false
```

В параметре `base` можно указать систему счисления или значение `0`, при котором система счисления определяется автоматически:

```c++
QString str = " \n\r25";
bool ok;
int n = str.toInt(&ok, 10);
qDebug() << n; // 25
qDebug() << ok; // true

str = "ff";
n = str.toInt(&ok, 16);
qDebug() << n; // 255
qDebug() << ok; // true
```

При преобразовании всегда используется локаль `C`. Если нужно учитывать настройки произвольной локали, то следует воспользоваться следующими методами из класса `QLocale`:

```c++
#include <QLocale>
short toShort(const QString &s, bool *ok = nullptr) const
short toShort(QStringView s, bool *ok = nullptr) const
ushort toUShort(const QString &s, bool *ok = nullptr) const
ushort toUShort(QStringView s, bool *ok = nullptr) const
int toInt(const QString &s, bool *ok = nullptr) const
int toInt(QStringView s, bool *ok = nullptr) const
uint toUInt(const QString &s, bool *ok = nullptr) const
uint toUInt(QStringView s, bool *ok = nullptr) const
long toLong(const QString &s, bool *ok = nullptr) const
long toLong(QStringView s, bool *ok = nullptr) const
ulong toULong(const QString &s, bool *ok = nullptr) const
ulong toULong(QStringView s, bool *ok = nullptr) const
qlonglong toLongLong(const QString &s, bool *ok = nullptr) const
qlonglong toLongLong(QStringView s, bool *ok = nullptr) const
qulonglong toULongLong(const QString &s, bool *ok = nullptr) const
qulonglong toULongLong(QStringView s, bool *ok = nullptr) const
float toFloat(const QString &s, bool *ok = nullptr) const
float toFloat(QStringView s, bool *ok = nullptr) const
double toDouble(const QString &s, bool *ok = nullptr) const
double toDouble(QStringView s, bool *ok = nullptr) const
```

Пример:

```c++
QString str = "25.56";
bool ok;
double n = str.toDouble(&ok);
qDebug() << n; // 25.56
qDebug() << ok; // true

str = "25,56";
n = str.toDouble(&ok);
qDebug() << n; // 0
qDebug() << ok; // false

QLocale ru(QLocale::Russian);
n = ru.toDouble(str, &ok);
qDebug() << n; // 25.56
qDebug() << ok; // true
```

## Преобразование числа в строку

Преобразовать число в строку позволяют следующие методы:

```c++
QString &setNum(short n, int base = 10)
QString &setNum(ushort n, int base = 10)
QString &setNum(int n, int base = 10)
QString &setNum(uint n, int base = 10)
QString &setNum(long n, int base = 10)
QString &setNum(ulong n, int base = 10)
QString &setNum(qlonglong n, int base = 10)
QString &setNum(qulonglong n, int base = 10)
QString &setNum(float n, char format = 'g', int precision = 6)
QString &setNum(double n, char format = 'g', int precision = 6)
```

А также статические методы:

```c++
static QString number(int n, int base = 10)
static QString number(uint n, int base = 10)
static QString number(long n, int base = 10)
static QString number(ulong n, int base = 10)
static QString number(qlonglong n, int base = 10)
static QString number(qulonglong n, int base = 10)
static QString number(double n, char format = 'g', int precision = 6)
```

Пример:

```c++
QString str;

str.setNum(25);
qDebug() << str; // "25"

str.setNum(25.56);
qDebug() << str; // "25.56"

str = QString::number(25);
qDebug() << str; // "25"

str = QString::number(25.56);
qDebug() << str; // "25.56"
```

В параметре `base` можно указать систему счисления:

```c++
QString str;

str.setNum(255, 16);
qDebug() << str; // "ff"

str = QString::number(255, 16);
qDebug() << str; // "ff"
```

При преобразовании всегда используется локаль `C`. Если нужно учитывать настройки произвольной локали, то следует воспользоваться методом `toString()` из класса [[QLocale|QLocale]]:

```c++
#include <QLocale>
QString toString(short i) const
QString toString(ushort i) const
QString toString(int i) const
QString toString(uint i) const
QString toString(long i) const
QString toString(ulong i) const
QString toString(qlonglong i) const
QString toString(qulonglong i) const
QString toString(float i, char f = 'g', int prec = 6) const
QString toString(double i, char f = 'g', int prec = 6) const
```

Пример:

```c++
QLocale ru(QLocale::Russian);
QString str = ru.toString(25.56);
qDebug() << str; // "25,56"
```

## Форматирование строки

Выполнить подстановку значения в строку позволяет метод `arg()`. Прототипы метода:

```c++
QString arg(short a, int fieldWidth = 0, int base = 10,
					QChar fillChar = QLatin1Char(' ')) const
					
QString arg(ushort a, int fieldWidth = 0, int base = 10,
					QChar fillChar = QLatin1Char(' ')) const
					
QString arg(int a, int fieldWidth = 0, int base = 10,
					QChar fillChar = QLatin1Char(' ')) const
					
QString arg(uint a, int fieldWidth = 0, int base = 10,
					QChar fillChar = QLatin1Char(' ')) const
					
QString arg(long a, int fieldWidth = 0, int base = 10,
					QChar fillChar = QLatin1Char(' ')) const
					
QString arg(ulong a, int fieldWidth = 0, int base = 10,
					QChar fillChar = QLatin1Char(' ')) const
					
QString arg(qlonglong a, int fieldWidth = 0, int base = 10,
					QChar fillChar = QLatin1Char(' ')) const
					
QString arg(qulonglong a, int fieldWidth = 0, int base = 10,
					QChar fillChar = QLatin1Char(' ')) const
					
QString arg(double a, int fieldWidth = 0, char format = 'g',
					int precision = -1, QChar fillChar = QLatin1Char(' ')) const
					
QString arg(char a, int fieldWidth = 0,
					QChar fillChar = QLatin1Char(' ')) const

QString arg(QChar a, int fieldWidth = 0,
					QChar fillChar = QLatin1Char(' ')) const
					
QString arg(const QString &a, int fieldWidth = 0,
					QChar fillChar = QLatin1Char(' ')) const
					
QString arg(QStringView a, int fieldWidth = 0,
					QChar fillChar = QLatin1Char(' ')) const
					
QString arg(QLatin1String a, int fieldWidth = 0,
					QChar fillChar = QLatin1Char(' ')) const
					
QString arg(Args &&... args) const
```

Место вставки в строке помечается комбинацией `%N`, где `N` — число от 1 до 99:

```c++
QString str = QString("%1").arg(25.56);
qDebug() << str; // "25.56"

QString str2 = QString("%1 %2").arg(2).arg("июня");
qDebug() << str2; // "2 июня"
```

При преобразовании всегда используется локаль `C`. Если нужно учитывать настройки произвольной локали, то следует перед цифрой указать букву `L`:

```c++
// Настройка локали
QLocale::setDefault(QLocale(QLocale::Russian));
QString str = QString("%1 %L2").arg(25.56).arg(25.56);
qDebug() << str; // "25.56 25,56"
```

В параметре `fieldWidth` можно указать ширину поля. Если число положительное, то выравнивание производится по правой стороне поля, а если отрицательное — по левой стороне поля. Пустое пространство заполняется символом `fillChar`:

```c++
QString str = QString("%1").arg(25, 7, 10, QChar(L'*'));
qDebug() << str; // "*****25"

QString str2 = QString("%1").arg(25, -7, 10, QChar(L'*'));
qDebug() << str2; // "25*****"
```

Для форматирования строки можно также воспользоваться следующими статическими методами:

```c++
static QString asprintf(const char *cformat, ...)
static QString vasprintf(const char *cformat, va_list ap)
```

Пример:

```c++
QString str = QString::asprintf("%d %.2f", 2, 2.5);
qDebug() << str; // "2 2.50"
```

## Разделение строки на подстроки по разделителю

Метод `split()` разбивает строку по разделителю или шаблону и возвращает список подстрок. Прототипы метода:

```c++
QStringList split(QChar sep,
						Qt::SplitBehavior behavior = Qt::KeepEmptyParts,
						Qt::CaseSensitivity cs = Qt::CaseSensitive) const

QStringList split(const QString &sep,
						Qt::SplitBehavior behavior = Qt::KeepEmptyParts,
						Qt::CaseSensitivity cs = Qt::CaseSensitive) const
						
QStringList split(const QRegularExpression &re,
						Qt::SplitBehavior behavior = Qt::KeepEmptyParts) const
```

Если в параметре `behavior` указано значение `Qt::SkipEmptyParts`, то пустые подстроки не будут добавляться в список. Пример:

```c++
// #include <QStringList>
QString str = "12,,34,56";

QStringList list = str.split(L',', Qt::KeepEmptyParts);
qDebug() << list; // QList("12", "", "34", "56")

QStringList list2 = str.split(L',', Qt::SkipEmptyParts);
qDebug() << list2; // QList("12", "34", "56")
```

Если в параметре `cs` указана константа `Qt::CaseSensitive`, то сравнение зависит от регистра символов. Чтобы сравнение не зависело от регистра символов, нужно указать константу `Qt::CaseInsensitive`:

```c++
// #include <QStringList>
QString str = "12aA34a56";

QStringList list = str.split("a", Qt::SkipEmptyParts,
Qt::CaseSensitive);
qDebug() << list; // QList("12", "A34", "56")

QStringList list2 = str.split("a", Qt::SkipEmptyParts,
Qt::CaseInsensitive);
qDebug() << list2; // QList("12", "34", "56")
```

В первом параметре можно указать шаблон регулярного выражения:

```c++
// #include <QStringList>
// #include <QRegularExpression>

QString str = "word1, word2\nword3\r\nword4.word5";

QStringList list = str.split(QRegularExpression("[\\s,.]+"),
Qt::SkipEmptyParts);
qDebug() << list;
// QList("word1", "word2", "word3", "word4", "word5")
```

Пример добавления всех букв из строки в список:

```c++
QString str = "word";

QStringList list = str.split(QString(), Qt::SkipEmptyParts);
qDebug() << list; // QList("w", "o", "r", "d")
```

Выполнить обратную операцию позволяет метод `join()` из класса [[QStringList|QStringList]]:

```c++
// #include <QStringList>
QStringList list = { "A", "B", "C", "D" };

QString str = list.join(L',');
qDebug() << str; // "A,B,C,D"
```
Метод `section()` разделяет строку на подстроки по разделителю и возвращает строку, содержащую подстроки от индекса `start` до индекса `end`. Прототипы метода:

```c++
QString section(QChar sep, qsizetype start, qsizetype end = -1,
						QString::SectionFlags flags = SectionDefault) const
						
QString section(const QString &sep, qsizetype start, qsizetype end = -1,
						QString::SectionFlags flags = SectionDefault) const
						
QString section(const QRegularExpression &re, qsizetype start,
						qsizetype end = -1,
						QString::SectionFlags flags = SectionDefault) const
```

Пример:

```c++
QString str = "1,2,3,4,5,6";

QString str2 = str.section(L',', 2, 2);
qDebug() << str2; // "3"

str2 = str.section(L',', 2, 3);
qDebug() << str2; // "3,4"

str2 = str.section(L',', 2, 4);
qDebug() << str2; // "3,4,5"
```


