
# QGraphicsEllipseItem

Класс `QGraphicsEllipseItem` описывает эллипс. Иерархия наследования:
```
QGraphicsItem — QAbstractGraphicsShapeItem — QGraphicsEllipseItem
```

Форматы конструктора класса:
```c++
#include <QGraphicsEllipseItem>

QGraphicsEllipseItem(QGraphicsItem *parent = nullptr)
QGraphicsEllipseItem(qreal x, qreal y, qreal width, qreal height,
						QGraphicsItem *parent = nullptr)
QGraphicsEllipseItem(const QRectF &rect, QGraphicsItem *parent = nullptr)
```

Класс `QGraphicsEllipseItem` наследует все методы из базовых классов и содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):
> **setRect()** — устанавливает прямоугольник, в который необходимо вписать эллипс. Прототипы метода:
```c++
void setRect(qreal x, qreal y, qreal width, qreal height)
void setRect(const QRectF &rect)
```

> **rect()** — возвращает экземпляр класса [[QRect#QRectF|QRectF]]. Прототип метода:
```c++
QRectF rect() const
```

> **setStartAngle()** и **setSpanAngle()** — задают начальный и конечный углы сектора соответственно. Следует учитывать, что величины углов задаются в значениях 1/16 градуса. Полный круг эквивалентен значению 16 * 360. Нулевой угол находится в позиции трех часов. Положительные значения углов отсчитываются против часовой стрелки, а отрицательные — по часовой стрелке. Прототипы методов:
```c++
void setStartAngle(int angle)
void setSpanAngle(int angle)
```

> **startAngle()** и **spanAngle()** — возвращают значения начального и конечного углов сектора соответственно. Прототипы методов:
```c++
int startAngle() const
int spanAngle() const
```

