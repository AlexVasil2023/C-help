
# Изменение прозрачности (QGraphicsOpacityEffect)

Класс `QGraphicsOpacityEffect` реализует эффект прозрачности. Иерархия наследования:
```
QObject — QGraphicsEffect — QGraphicsOpacityEffect
```

Формат конструктора класса:
```c++
#include <QGraphicsOpacityEffect>

QGraphicsOpacityEffect(QObject *parent = nullptr)
```

Класс `QGraphicsOpacityEffect` наследует все методы из базовых классов и содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **setOpacity()** — задает степень прозрачности. В качестве значения указывается вещественное число от 0.0 до 1.0. По умолчанию используется значение 0.7. Метод является слотом. Прототип метода:
```c++
void setOpacity(qreal opacity)
```

> **opacity()** — возвращает степень прозрачности. Прототип метода:
```c++
qreal opacity() const
```

> **setOpacityMask()** — задает маску. Метод является слотом. Прототип метода:
```c++
void setOpacityMask(const QBrush &mask)
```

> **opacityMask()** — возвращает маску. Прототип метода:
```c++
QBrush opacityMask() const
```

Класс `QGraphicsOpacityEffect` содержит следующие сигналы:

> **opacityChanged(qreal)** — генерируется при изменении степени прозрачности. Внутри обработчика через параметр доступно новое значение;
> 
> **opacityMaskChanged(const QBrush&)** — генерируется при изменении маски.
