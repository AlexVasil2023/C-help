# QSize
Класс `QSize` описывает размеры прямоугольной области. Для создания экземпляра класса предназначены следующие форматы конструкторов:

```c++
#include <QSize>

QSize()
QSize(int width, int height)
```

Первый конструктор создает экземпляр класса с отрицательной шириной и высотой. Второй конструктор позволяет явно указать ширину и высоту. Пример:

```c++
QSize s1;
qDebug() << s1; // QSize(-1, -1)

QSize s2(10, 55);
qDebug() << s2; // QSize(10, 55)
```

Пример создания копии объекта:

```c++
QSize s1(10, 55);
QSize s2(s1);
qDebug() << s2; // QSize(10, 55)
```

Через экземпляр класса доступны следующие методы:

> **width()** и **height()** — возвращают ширину и высоту соответственно. Прототипы методов:
```c++
int width() const
int height() const
```

> **rwidth()** и **rheight()** — возвращают ссылки на ширину и высоту соответственно. Прототипы методов:
```c++
int &rwidth()
int &rheight()
```

> **setWidth()** и **setHeight()** — задают ширину и высоту соответственно. Прототипы методов:
```c++
void setWidth(int width)
void setHeight(int height)
```

Пример:

```c++
QSize s;
s.setWidth(10);
s.setHeight(55);

qDebug() << s.width(); // 10
qDebug() << s.height(); // 55
```

> **isNull()** — возвращает `true`, если ширина и высота равны нулю, и `false` — в противном случае. Прототип метода:
```c++
bool isNull() const
```

> **isValid()** — возвращает `true`, если ширина и высота больше или равны нулю, и `false` — в противном случае. Прототип метода:
```c++
bool isValid() const
```

> **isEmpty()** — возвращает `true`, если один параметр (ширина или высота) меньше или равен нулю, и `false` — в противном случае. Прототип метода:
```c++
bool isEmpty() const
```

> **scale()** — производит изменение размеров области в соответствии со значением параметра `mode`. Метод изменяет текущий объект и ничего не возвращает. Прототипы метода:
```c++
void scale(int width, int height, Qt::AspectRatioMode mode)
void scale(const QSize &size, Qt::AspectRatioMode mode)
```
В параметре mode могут быть указаны следующие константы:
- **Qt::IgnoreAspectRatio** — непосредственно изменяет размеры без сохранения пропорций сторон;
- **Qt::KeepAspectRatio** — производится попытка масштабирования старой области внутри новой области без нарушения пропорций;
- **Qt::KeepAspectRatioByExpanding** — производится попытка полностью заполнить новую область без нарушения пропорций старой области.

Если новая ширина или высота имеет значение 0 , то размеры изменяются непосредственно без сохранения пропорций вне зависимости от значения параметра `mode`.

Пример:
```c++
QSize s(50, 20);
s.scale(70, 60, Qt::IgnoreAspectRatio);
qDebug() << s; // QSize(70, 60)

s = QSize(50, 20);
s.scale(70, 60, Qt::KeepAspectRatio);
qDebug() << s; // QSize(70, 28)

s = QSize(50, 20);
s.scale(70, 60, Qt::KeepAspectRatioByExpanding);
qDebug() << s; // QSize(150, 60)
```

Можно также воспользоваться методом `scaled()`. Прототипы метода:
```c++
QSize scaled(int width, int height, Qt::AspectRatioMode mode) const
QSize scaled(const QSize &s, Qt::AspectRatioMode mode) const
```

Пример:
```c++
QSize s(50, 20), s2;
s2 = s.scaled(70, 60, Qt::IgnoreAspectRatio);
qDebug() << s2; // QSize(70, 60)

s2 = s.scaled(70, 60, Qt::KeepAspectRatio);
qDebug() << s2; // QSize(70, 28)

s2 = s.scaled(70, 60, Qt::KeepAspectRatioByExpanding);
qDebug() << s2; // QSize(150, 60)
```

> **boundedTo()** — возвращает экземпляр класса `QSize`, который содержит минимальную ширину и высоту из текущих размеров и размеров, указанных в параметре. Прототип метода:
```c++
QSize boundedTo(const QSize &otherSize) const
```

Пример:
```c++
QSize s(50, 20);
qDebug() << s.boundedTo(QSize(400, 5)); // QSize(50, 5)
qDebug() << s.boundedTo(QSize(40, 50)); // QSize(40, 20)
```

> **expandedTo()** — возвращает экземпляр класса `QSize` , который содержит максимальную ширину и высоту из текущих размеров и размеров, указанных в параметре. Прототип метода:
```c++
QSize expandedTo(const QSize &otherSize) const
```

Пример:
```c++
QSize s(50, 20);

qDebug() << s.expandedTo(QSize(400, 5)); // QSize(400, 20)
qDebug() << s.expandedTo(QSize(40, 50)); // QSize(50, 50)
```

> **transpose()** — меняет значения местами. Метод изменяет текущий объект и ничего не возвращает. Прототип метода:
```c++
void transpose()
```

Пример:
```c++
QSize s(50, 20);
s.transpose();

qDebug() << s; // QSize(20, 50)
```

Можно также воспользоваться методом `transposed()`. Прототип метода:
```c++
QSize transposed() const
```

Пример:
```c++
QSize s(50, 20);
qDebug() << s.transposed(); // QSize(20, 50)
```

Над двумя экземплярами класса `QSize` определены операции `+`,` +=`, `-` (минус), `-=`, `==` и `!=`. Кроме того, экземпляр класса `QSize` можно умножить или разделить на вещественное число (операторы `*`, `*=`, `/ и` `/=` ). Пример:

```c++
QSize s1(50, 20), s2(10, 5);

qDebug() << s1 + s2; // QSize(60, 25)
qDebug() << s1 - s2; // QSize(40, 15)
qDebug() << s1 * 2.5; // QSize(125, 50)
qDebug() << s1 / 2.0; // QSize(25, 10)
qDebug() << (s1 == s2); // false
qDebug() << (s1 != s2); // true
```


















































# QSizeF
#QSizeF









