
# QGraphicsLineItem

Класс `QGraphicsLineItem` описывает линию. Иерархия наследования: 
```
QGraphicsItem — QGraphicsLineItem
```

Форматы конструктора класса:
```c++
#include <QGraphicsLineItem>

QGraphicsLineItem(QGraphicsItem *parent = nullptr)
QGraphicsLineItem(qreal x1, qreal y1, qreal x2, qreal y2,
									QGraphicsItem *parent = nullptr)
QGraphicsLineItem(const QLineF &line, QGraphicsItem *parent = nullptr)
```

Класс `QGraphicsLineItem` наследует все методы из класса [[QGraphicsItem|QGraphicsItem]] и содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **setLine()** — устанавливает линию. Прототипы метода:
```c++
void setLine(qreal x1, qreal y1, qreal x2, qreal y2)
void setLine(const QLineF &line)
```

> **line()** — возвращает экземпляр класса QLineF. Прототип метода:
```c++
QLineF line() const
```

> **setPen()** — устанавливает перо. Прототип метода:
```c++
void setPen(const QPen &pen)
```

