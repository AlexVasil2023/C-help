
# QGraphicsPolygonItem

Класс `QGraphicsPolygonItem` описывает многоугольник. Иерархия наследования:
```
QGraphicsItem — QAbstractGraphicsShapeItem — QGraphicsPolygonItem
```

Форматы конструктора класса:
```c++
#include <QGraphicsPolygonItem>

QGraphicsPolygonItem(QGraphicsItem *parent = nullptr)
QGraphicsPolygonItem(const QPolygonF &polygon, QGraphicsItem *parent = nullptr)
```

Класс `QGraphicsPolygonItem` наследует все методы из базовых классов и содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):
* **setPolygon()** — устанавливает многоугольник. Прототип метода:
```c++
void setPolygon(const QPolygonF &polygon)
```

* **polygon()** — возвращает экземпляр класса [[QPolygon#QPolygonF|QPolygonF]]. Прототип метода:
```c++
QPolygonF polygon() const
```

