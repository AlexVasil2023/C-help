
# QGraphicsRectItem - Прямоугольник

Класс `QGraphicsRectItem` описывает прямоугольник. Иерархия наследования: 
```
QGraphicsItem — QAbstractGraphicsShapeItem — QGraphicsRectItem
```

Форматы конструктора класса:
```c++
#include <QGraphicsRectItem>
QGraphicsRectItem(QGraphicsItem *parent = nullptr)
QGraphicsRectItem(qreal x, qreal y, qreal width, qreal height,
									QGraphicsItem *parent = nullptr)
QGraphicsRectItem(const QRectF &rect, QGraphicsItem *parent = nullptr)
```

Класс `QGraphicsRectItem` наследует все методы из базовых классов и содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **setRect()** — устанавливает прямоугольник. Прототипы метода:
```c++
void setRect(qreal x, qreal y, qreal width, qreal height)
void setRect(const QRectF &rectangle)
```

> **rect()** — возвращает экземпляр класса [[QRect#QRectF|QRectF]]. Прототип метода:
```c++
QRectF rect() const
```

