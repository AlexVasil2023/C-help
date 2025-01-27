
# QGraphicsPixmapItem

Класс `QGraphicsPixmapItem` описывает изображение. Иерархия наследования:
```
QGraphicsItem — QGraphicsPixmapItem
```

Форматы конструктора класса:
```c++
#include <QGraphicsPixmapItem>

QGraphicsPixmapItem(QGraphicsItem *parent = nullptr)
QGraphicsPixmapItem(const QPixmap &pixmap, QGraphicsItem *parent = nullptr)
```

Класс `QGraphicsPixmapItem` наследует все методы из класса [[QGraphicsItem|QGraphicsItem]] и содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **setPixmap()** — устанавливает изображение. Прототип метода:
```c++
void setPixmap(const QPixmap &pixmap)
```

> **pixmap()** — возвращает экземпляр класса QPixmap. Прототип метода:
```c++
QPixmap pixmap() const
```

> **setOffset()** — задает местоположение изображения. Прототипы метода:
```c++
void setOffset(qreal x, qreal y)
void setOffset(const QPointF &offset)
```

> **offset()** — возвращает местоположение изображения (экземпляр класса [[QPoint#QPointF|QPointF]]). Прототип метода:
```c++
QPointF offset() const
```

> **setShapeMode()** — задает режим определения формы изображения. Прототип метода:
```c++
void setShapeMode(QGraphicsPixmapItem::ShapeMode mode)
```

В качестве параметра могут быть указаны следующие константы:
* **QGraphicsPixmapItem::MaskShape** — используется результат выполнения метода `mask()` из класса [[QPixmap#QPixmap|QPixmap]] (значение по умолчанию);
* **QGraphicsPixmapItem::BoundingRectShape** — форма определяется по контуру изображения;
* **QGraphicsPixmapItem::HeuristicMaskShape** — используется результат выполнения метода `createHeuristicMask()` из класса [[QPixmap|QPixmap]];

> **setTransformationMode()** — задает режим сглаживания. Прототип метода:
```c++
void setTransformationMode(Qt::TransformationMode mode)
```

В качестве параметра могут быть указаны следующие константы:
* **Qt::FastTransformation** — сглаживание выключено (по умолчанию);
* **Qt::SmoothTransformation** — сглаживание включено.

