
# QGraphicsItemGroup

Объединить несколько объектов в группу позволяет класс `QGraphicsItemGroup`. После группировки над объектами можно выполнять различные преобразования, например перемещать одновременно все объекты группы. Иерархия наследования для класса `QGraphicsItemGroup` выглядит так:
```
QGraphicsItem — QGraphicsItemGroup
```

Формат конструктора класса:
```c++
#include <QGraphicsItemGroup>

QGraphicsItemGroup(QGraphicsItem *parent = nullptr)
```

Класс `QGraphicsItemGroup` наследует все методы из класса [[QGraphicsItem|QGraphicsItem]] и содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **addToGroup()** — добавляет объект в группу. Прототип метода:
```c++
void addToGroup(QGraphicsItem *item)
```

> **removeFromGroup()** — удаляет объект из группы. Прототип метода:
```c++
void removeFromGroup(QGraphicsItem *item)
```

Создать группу и добавить ее на сцену можно также с помощью метода `createItemGroup()` из класса [[QGraphicsScene#Класс QGraphicsScene сцена|QGraphicsScene]]. Метод возвращает указатель на группу (экземпляр класса `QGraphicsItemGroup`). Удалить группу со сцены позволяет метод `destroyItemGroup()` из класса [[QGraphicsScene#Класс QGraphicsScene сцена|QGraphicsScene]]. Прототипы методов:
```c++
QGraphicsItemGroup *createItemGroup(const QList<QGraphicsItem *> &items)
void destroyItemGroup(QGraphicsItemGroup *group)
```

Добавить объект в группу позволяет также метод `setGroup()` из класса [[QGraphicsItem#Класс QGraphicsItem базовый класс для графических объектов|QGraphicsItem]]. Получить указатель на группу, к которой прикреплен объект, можно с помощью метода `group()` из класса [[QGraphicsItem#Класс QGraphicsItem базовый класс для графических объектов|QGraphicsItem]]. Если объект не прикреплен к группе, то метод возвращает нулевой указатель. Прототипы методов:
```c++
void setGroup(QGraphicsItemGroup *group)
QGraphicsItemGroup *group() const
```

