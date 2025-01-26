# QRect

Класс `QRect` описывает координаты и размеры прямоугольной области. Для создания экземпляра класса предназначены следующие форматы конструктора:
```c++
#include <QRect>

QRect()
QRect(int x, int y, int width, int height)
QRect(const QPoint &topLeft, const QSize &size)
QRect(const QPoint &topLeft, const QPoint &bottomRight)
```

Первый конструктор создает экземпляр класса со значениями по умолчанию:

```c++
QRect r;

qDebug() << r.left() << r.top() << r.right() << r.bottom() << r.width() << r.height(); // 0 0 -1 -1 0 0
```

Второй и третий конструкторы позволяют указать координаты левого верхнего угла и размеры области. Во втором конструкторе значения указываются отдельно:

```c++
QRect r(10, 15, 400, 300);

qDebug() << r.left() << r.top() << r.right() << r.bottom() << r.width() << r.height();
// 10 15 409 314 400 300
```

В третьем конструкторе координаты задаются с помощью класса `QPoint`, а размеры — с помощью класса [[QSize|QSize]] :

```c++
QRect r(QPoint(10, 15), QSize(400, 300));

qDebug() << r.left() << r.top() << r.right() << r.bottom() << r.width() << r.height();
// 10 15 409 314 400 300
```

Четвертый конструктор позволяет указать координаты левого верхнего угла и правого нижнего угла. В качестве значений указываются экземпляры класса [[QPoint|QPoint]]:

```c++
QRect r(QPoint(10, 15), QPoint(409, 314));

qDebug() << r.left() << r.top() << r.right() << r.bottom() << r.width() << r.height();
// 10 15 409 314 400 300
```

Пример создания копии объекта:

```c++
QRect r(10, 15, 400, 300);
QRect r2(r);

qDebug() << r2; // QRect(10,15 400x300)
```

Изменить значения уже после создания экземпляра позволяют следующие методы:

> **setLeft()**, **setX()**, **setTop()** и **setY()** — задают координаты левого верхнего угла по осям `X` и `Y` . Прототипы методов:
```c++
void setLeft(int x)
void setX(int x)
void setTop(int y)
void setY(int y)
```

Пример:
```c++
QRect r;
r.setLeft(10);
r.setTop(55);

qDebug() << r; // QRect(10,55 -10x-55)

r.setX(12);
r.setY(81);

qDebug() << r; // QRect(12,81 -12x-81)
```

> **setRight()** и **setBottom()** — задают координаты правого нижнего угла по осям `X` и `Y` . Прототипы методов:
```c++
void setRight(int x)
void setBottom(int y)
```

Пример:
```c++
QRect r;
r.setRight(12);
r.setBottom(81);

qDebug() << r; // QRect(0,0 13x82)
```

> **setTopLeft()** — задает координаты левого верхнего угла. Прототип метода:
```c++
void setTopLeft(const QPoint &position)
```

> **setTopRight()** — задает координаты правого верхнего угла. Прототип метода: 
```c++
void setTopRight(const QPoint &position)
```

> **setBottomLeft()** — задает координаты левого нижнего угла. Прототип метода:
```c++
void setBottomLeft(const QPoint &position)
```

> **setBottomRight()** — задает координаты правого нижнего угла. Прототип метода:
```c++
void setBottomRight(const QPoint &position)
```

Пример:

```c++
QRect r;

r.setTopLeft(QPoint(10, 5));
r.setBottomRight(QPoint(39, 19));

qDebug() << r; // QRect(10,5 30x15)

r.setTopRight(QPoint(39, 5));
r.setBottomLeft(QPoint(10, 19));

qDebug() << r; // QRect(10,5 30x15)
```

> **setWidth()**, **setHeight()** и **setSize()** — задают ширину и высоту области. Прототипы методов:
```c++
void setWidth(int width)
void setHeight(int height)
void setSize(const QSize &size)
```

> **setRect()** — задает координаты левого верхнего угла и размеры области. Прототип метода:
```c++
void setRect(int x, int y, int width, int height)
```

> **setCoords()** — задает координаты левого верхнего угла и правого нижнего угла. Прототип метода:
```c++
void setCoords(int x1, int y1, int x2, int y2)
```

Пример:
```c++
QRect r;

r.setRect(10, 10, 100, 500);
qDebug() << r; // QRect(10,10 100x500)

r.setCoords(10, 10, 109, 509);
qDebug() << r; // QRect(10,10 100x500)
```

Переместить область при изменении координат позволяют следующие методы:

> **moveTo()**, **moveLeft()** и **moveTop()** — перемещают координаты левого верхнего угла. Прототипы методов:
```c++
void moveTo(int x, int y)
void moveTo(const QPoint &position)
void moveLeft(int x)
void moveTop(int y)
```

Пример:
```c++
QRect r(10, 15, 400, 300);

r.moveTo(0, 0);
qDebug() << r; // QRect(0,0 400x300)

r.moveTo(QPoint(10, 10));
qDebug() << r; // QRect(10,10 400x300)

r.moveLeft(5);
r.moveTop(0);
qDebug() << r; // QRect(5,0 400x300)
```

> **moveRight()** и **moveBottom()** — перемещают координаты правого нижнего угла. Прототипы методов:
```c++
void moveRight(int x)
void moveBottom(int y)
```

> **moveTopLeft()** — перемещает координаты левого верхнего угла. Прототип метода:
```c++
void moveTopLeft(const QPoint &position)
```

> **moveTopRight()** — перемещает координаты правого верхнего угла. Прототип метода:
```c++
void moveTopRight(const QPoint &position)
```

> **moveBottomLeft()** — перемещает координаты левого нижнего угла. Прототип метода:
```c++
void moveBottomLeft(const QPoint &position)
```

> **moveBottomRight()** — перемещает координаты правого нижнего угла. Прототип метода:
```c++
void moveBottomRight(const QPoint &position)
```

Пример:
```c++
QRect r(10, 15, 400, 300);

r.moveTopLeft(QPoint(0, 0));
qDebug() << r; // QRect(0,0 400x300)

r.moveBottomRight(QPoint(599, 499));
qDebug() << r; // QRect(200,200 400x300)
```

> **moveCenter()** — перемещает координаты центра. Прототип метода:
```c++
void moveCenter(const QPoint &position)
```

> **translate()** — перемещает координаты левого верхнего угла относительно текущего значения координат. Прототипы метода:
```c++
void translate(int dx, int dy)
void translate(const QPoint &offset)
```

Пример:
```c++
QRect r(0, 0, 400, 300);

r.translate(20, 15);
qDebug() << r; // QRect(20,15 400x300)

r.translate(QPoint(10, 5));
qDebug() << r; // QRect(30,20 400x300)
```

> **translated()** — метод аналогичен методу `translate()`, но возвращает новый экземпляр класса [[QRect|QRect]] , а не изменяет текущий. Прототипы метода:
```c++
QRect translated(int dx, int dy) const
QRect translated(const QPoint &offset) const
```

> **adjust()** — сдвигает координаты левого верхнего угла и правого нижнего угла относительно текущих значений координат. Прототип метода:
```c++
void adjust(int dx1, int dy1, int dx2, int dy2)
```

Пример:
```c++
QRect r(0, 0, 400, 300);
r.adjust(10, 5, 10, 5);
qDebug() << r; // QRect(10,5 400x300)
```

> **adjusted()** — метод аналогичен методу `adjust()` , но возвращает новый экземпляр класса [[QRect|QRect]] , а не изменяет текущий. Прототип метода:
```c++
QRect adjusted(int dx1, int dy1, int dx2, int dy2) const
```

Для получения значений предназначены следующие методы:

> **left()** и **x()** — возвращают координату левого верхнего угла по оси `X`. Прототипы методов:
```c++
int left() const
int x() const
```

> **top()** и **y()** — возвращают координату левого верхнего угла по оси `Y`. Прототипы методов:
```c++
int top() const
int y() const
```

> **right()** и **bottom()** — возвращают координаты правого нижнего угла по осям `X` и `Y` соответственно. Прототипы методов:
```c++
int right() const
int bottom() const
```

> **width()** и **height()** — возвращают ширину и высоту соответственно. Прототипы методов:
```c++
int width() const
int height() const
```

> **size()** — возвращает размеры в виде экземпляра класса [[QSize|QSize]]. Прототип метода:
```c++
QSize size() const
```

Пример:
```c++
QRect r(10, 15, 400, 300);

qDebug() << r.left() << r.top() << r.x() << r.y() << r.right() << r.bottom();
// 10 15 10 15 409 314
qDebug() << r.width() << r.height() << r.size(); 
// 400 300 QSize(400, 300)
```

> **topLeft()** — возвращает координаты левого верхнего угла. Прототип метода:
```c++
QPoint topLeft() const
```

> **topRight()** — возвращает координаты правого верхнего угла. Прототип метода:
```c++
QPoint topRight() const
```

> **bottomLeft()** — возвращает координаты левого нижнего угла. Прототип метода: 
```c++
QPoint bottomLeft() const
```

> **bottomRight()** — возвращает координаты правого нижнего угла. Прототип метода:
```c++
QPoint bottomRight() const
```

Пример:
```c++
QRect r(10, 15, 400, 300);

qDebug() << r.topLeft() << r.topRight();
// QPoint(10,15) QPoint(409,15)

qDebug() << r.bottomLeft() << r.bottomRight();
// QPoint(10,314) QPoint(409,314)
```

> **center()** — возвращает координаты центра области. Прототип метода:
```c++
QPoint center() const
```

Например, вывести окно по центру доступной области экрана можно так:

```c++
QScreen *screen = QApplication::primaryScreen();
QRect rect = screen->availableGeometry();
window.move(rect.center() - window.rect().center());
```

> **getRect()** — позволяет получить координаты левого верхнего угла и размеры области. Прототип метода:
```c++
void getRect(int *x, int *y, int *width, int *height) const
```

> **getCoords()** — позволяет получить координаты левого верхнего угла и правого нижнего угла. Прототип метода:
```c++
void getCoords(int *x1, int *y1, int *x2, int *y2) const
```

Прочие методы:

> **isNull()** — возвращает true , если ширина и высота равны нулю, и `false` — в противном случае. Прототип метода:
```c++
bool isNull() const
```

> **isValid()** — возвращает true , если `left() <= right()` и `top() <= bottom()`, и `false` — в противном случае. Прототип метода:
```c++
bool isValid() const
```

> **isEmpty()** — возвращает `true` , если `left()` > right() или top() > `bottom()` , и `false` — в противном случае. Прототип метода:
```c++
bool isEmpty() const
```

> **normalized()** — исправляет ситуацию, при которой `left() > right()` или **top() > bottom() ,** и возвращает новый экземпляр класса [[QRect|QRect]]. Прототип метода:
```c++
QRect normalized() const
```

Пример:
```c++
QRect r(QPoint(409, 314), QPoint(10, 15));

qDebug() << r; // QRect(409,314 -398x-298)
qDebug() << r.normalized(); // QRect(11,16 398x298)
```

Пример:
```c++
QRect r(0, 0, 400, 300);

qDebug() << r.contains(0, 10); // true
qDebug() << r.contains(0, 10, true); // false
```

> **contains()** — возвращает `true` , если указанная область расположена внутри текущей области или на ее краю, и `false` — в противном случае. Если в параметре proper указано значение `true`, то указанная область должна быть расположена только внутри текущей области, а не на ее краю. Значение параметра по умолчанию — false . Прототип метода:
```c++
bool contains(const QRect &rectangle, bool proper = false) const
```

Пример:
```c++
QRect r(0, 0, 400, 300);

qDebug() << r.contains(QRect(0, 0, 20, 5)); // true
qDebug() << r.contains(QRect(0, 0, 20, 5), true); // false
```

> **intersects()** — возвращает true , если указанная область пересекается с текущей областью, и false — в противном случае. Прототип метода:
```c++
bool intersects(const QRect &rectangle) const
```

> **intersected()** — возвращает область, которая расположена на пересечении текущей и указанной областей. Прототип метода:
```c++
QRect intersected(const QRect &rectangle) const
```

Пример:

```c++
QRect r(0, 0, 20, 20);
qDebug() << r.intersects(QRect(10, 10, 20, 20));
// true

qDebug() << r.intersected(QRect(10, 10, 20, 20));
// QRect(10,10 10x10)
```

> **united()** — возвращает область, которая охватывает текущую и указанную области. Прототип метода:
```c++
QRect united(const QRect &rectangle) const
```

Пример:

```c++
QRect r(0, 0, 20, 20);
qDebug() << r.united(QRect(30, 30, 20, 20)); // QRect(0,0 50x50)
```

Над двумя экземплярами класса `QRect` определены операции `&` и `&=` (пересечение), `|` и `|= `(объединение), `==` и `!`= . 

Пример:
```c++
QRect r1(0, 0, 20, 20), r2(10, 10, 20, 20);

qDebug() << (r1 & r2); // QRect(10,10 10x10)
qDebug() << (r1 | r2); // QRect(0,0 30x30)
qDebug() << (r1 == r2); // false
qDebug() << (r1 != r2); // true
```










# QRectF



















