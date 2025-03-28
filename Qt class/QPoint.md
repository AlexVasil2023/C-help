# QPoint
Класс `QPoint` описывает координаты точки. Для создания экземпляра класса предназначены следующие форматы конструкторов:

```c++
#include <QPoint>

QPoint()
QPoint(int xpos, int ypos)
```

Первый конструктор создает экземпляр класса с нулевыми координатами:

```c++
QPoint p;
qDebug() << p.x() << p.y(); // 0 0
```

Второй конструктор позволяет явно указать координаты точки:

```c++
QPoint p(10, 88);
qDebug() << p.x() << p.y(); // 10 88
```

Пример создания копии объекта:

```c++
QPoint p(10, 88);
QPoint p2(p);
qDebug() << p2.x() << p2.y(); // 10 88
```

Через экземпляр класса доступны следующие методы:

> **x()** и **y()** — возвращают координаты по осям `X` и `Y` соответственно. Прототипы методов:
```c++
int x() const
int y() const
```

> **rx()** и **ry()** — возвращают ссылки на координаты по осям `X` и `Y` соответственно. Прототипы методов:
```c++
int &rx()
int &ry()
```

> **setX()** и **setY()** — задают координаты по осям `X` и `Y` соответственно. Прототипы методов:
```c++
void setX(int x)
void setY(int y)
```

> **isNull()** — возвращает `true`, если координаты равны нулю, и `false` — в противном случае. Прототип метода:
```c++
bool isNull() const
```
Пример:
```c++
QPoint p;
qDebug() << p.isNull(); // true
p.setX(10);
p.setY(88);
qDebug() << p.x() << p.y(); // 10 88
qDebug() << p.isNull(); // false
```

> **manhattanLength()** — возвращает сумму абсолютных значений координат:
```c++
int manhattanLength() const
```
Пример:
```c++
QPoint p(10, 88);
qDebug() << p.manhattanLength(); // 98
```

Над двумя экземплярами класса `QPoint` определены операции `+`, `+=`, `- (минус)`, `-=`, `==` и `!=` . Для смены знака координат можно воспользоваться унарным оператором `-`. Кроме того, экземпляр класса `QPoint` можно умножить или разделить на вещественное число (операторы `*`, `*=`, `/` и `/=`). Пример:

```c++
QPoint p1(10, 20), p2(5, 9);

qDebug() << p1 + p2; // QPoint(15,29)
qDebug() << p1 - p2; // QPoint(5,11)

qDebug() << p1 * 2.5; // QPoint(25,50)
qDebug() << p1 / 2.0; // QPoint(5,10)

qDebug() << (p1 == p2); // false
qDebug() << (p1 != p2); // true

qDebug() << (-p1); // QPoint(-10,-20)
```

# QPointF

#QPointF













