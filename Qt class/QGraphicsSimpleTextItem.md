
# QGraphicsSimpleTextItem

Класс `QGraphicsSimpleTextItem` описывает простой текст. Иерархия наследования:
```
QGraphicsItem — QAbstractGraphicsShapeItem — QGraphicsSimpleTextItem
```

Форматы конструктора класса:
```c++
#include <QGraphicsSimpleTextItem>

QGraphicsSimpleTextItem(QGraphicsItem *parent = nullptr)
QGraphicsSimpleTextItem(const QString &text, QGraphicsItem *parent = nullptr)
```

Класс `QGraphicsSimpleTextItem` наследует все методы из базовых классов и содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **setText()** — задает текст. Прототип метода:
```c++
void setText(const QString &text)
```

> **text()** — возвращает текст. Прототип метода:
```c++
QString text() const
```

> **setFont()** — устанавливает шрифт. Прототип метода:
```c++
void setFont(const QFont &font)
```

> **font()** — возвращает объект шрифта. Прототип метода:
```c++
QFont font() const
```

