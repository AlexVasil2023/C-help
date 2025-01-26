# QChar

Класс `QChar` описывает символ в кодировке UTF-16 (один символ занимает два байта). Подключение заголовочного файла:

```c++
#include <QChar>
```

## Создание объекта

Создать объект позволяют следующие конструкторы:

```c++
QChar()
QChar(char ch)
QChar(uchar ch)
QChar(wchar_t ch)
QChar(char16_t ch)
QChar(QLatin1Char ch)
QChar(QChar::SpecialCharacter ch)
QChar(int code)
QChar(uint code)
QChar(short code)
QChar(uchar cell, uchar row)
QChar(ushort code)
```

Пример:

```c++
QChar ch1 = L'к';
QChar ch2 = L'd';
char16_t ch3 = ch1.unicode();
qDebug() << ch3; // '\u043a'
qDebug() << (ushort)ch3; // 1082
qDebug() << ch2.toLatin1(); // d
```

## Изменение регистра символа

Изменить регистр символа позволяют следующие методы:

> **toLower()** — возвращает символ в нижнем регистре. Прототип метода: `QChar toLower() const`
  Пример:
```c++
QChar ch1 = L'К';
QChar ch2 = L'D';
qDebug() << ch1.toLower(); // '\u043a'
qDebug() << ch2.toLower(); // 'd'
```

> **toUpper()** — возвращает символ в верхнем регистре. Прототип метода: `QChar toUpper() const`
  Пример:
```c++
QChar ch1 = L'к';
QChar ch2 = L'd';
qDebug() << ch1.toUpper(); // '\u041a'
qDebug() << ch2.toUpper(); // 'D'
```

> **isLower()** — возвращает значение `true` , если объект содержит символ в нижнем регистре и `false` — в противном случае. Прототип метода: `bool isLower() const`
	Пример:
```
QChar ch1 = L'D';
QChar ch2 = L'd';
qDebug() << ch1.isLower(); // false
qDebug() << ch2.isLower(); // true
```

> **isUpper()** — возвращает значение `true`, если объект содержит символ в верхнем регистре, и `false` — в противном случае. Прототип метода: `bool isUpper() cons`
> Пример:
```c++
QChar ch1 = L'D';
QChar ch2 = L'd';
qDebug() << ch1.isUpper(); // true
qDebug() << ch2.isUpper(); // false
```

## Проверка типа содержимого символа

Проверить тип содержимого символа позволяют следующие методы:

> **isDigit()** - возвращает значение `true`, если символ является десятичной цифрой, в противном случае - `false` . Прототип метода: `bool isDigit() const`
> Пример:
```c++
QChar ch1 = L'1';
QChar ch2 = L'd';
qDebug() << ch1.isDigit(); // true
qDebug() << ch2.isDigit(); // false
```

> **isNumber()** - возвращает значение `true` , если символ является числом, в противном случае - `false`. Прототип метода: `bool isNumber() const`
> Пример:
```c++
QChar ch1 = L'1';
QChar ch2 = L'd';
qDebug() << ch1.isNumber(); // true
qDebug() << ch2.isNumber(); // false
```

> **digitValue()** — возвращает числовое значение цифры или значение - 1, если символ не является цифрой. Прототип метода: `int digitValue() const`
> Пример:
```c++
QChar ch1 = L'2';
QChar ch2 = L'd';
qDebug() << ch1.digitValue(); // 2
qDebug() << ch2.digitValue(); // -1
```

> **isLetter()** — возвращает значение `true`, если символ является буквой, в противном случае - `false`. Прототип метода: `bool isLetter() const`
   Пример:
```c++
QChar ch1 = L'1';
QChar ch2 = L'd';
qDebug() << ch1.isLetter(); // false
qDebug() << ch2.isLetter(); // true
```

> **isSpace()** - возвращает значение `true`, если символ является пробельным символом (пробелом, табуляцией, переводом строки или возвратом каретки), в противном случае - `false` . Прототип метода: `bool isSpace() const`
> Пример:
```c++
QChar ch1 = L'd';
QChar ch2 = L' ';
qDebug() << ch1.isSpace(); // false
qDebug() << ch2.isSpace(); // true
```

> `isLetterOrNumber()` - возвращает значение `true`, если символ является буквой или цифрой, в противном случае - `false`. Прототип метода: `bool isLetterOrNumber() const`
> Пример:
```c++
QChar ch1 = L'd';
QChar ch2 = L'\r';
qDebug() << ch1.isLetterOrNumber(); // true
qDebug() << ch2.isLetterOrNumber(); // false
```

> **isPunct()** - возвращает значение `true`, если символ является символом пунктуации, в противном случае - `false`. Прототип метода: `bool isPunct() const`
> Пример:
```c++
QChar ch1 = L'.';
QChar ch2 = L',';
qDebug() << ch1.isPunct(); // true
qDebug() << ch2.isPunct(); // true
```

> **isPrint()** - возвращает значение `true`, если символ является печатаемым (включая пробел), в противном случае - `false`. Прототип метода: `bool isPrint() const`
> Пример:
```c++
QChar ch1 = L'8';
QChar ch2 = L'\r';
qDebug() << ch1.isPrint(); // true
qDebug() << ch2.isPrint(); // false
```

> `isNull()` - возвращает значение true , если символ является нулевым символом, в противном случае - `false`. Прототип метода: `bool isNull() const`
> Пример:
```c++
QChar ch1;
QChar ch2 = L'd';
qDebug() << ch1.isNull(); // true
qDebug() << ch2.isNull(); // false
```

> Прочие методы:
> **bool isMark() const**
> **bool isNonCharacter() const**
> **bool isSymbol() const**

