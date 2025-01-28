
# Изменение цвета (QGraphicsColorizeEffect)

Класс `QGraphicsColorizeEffect` реализует эффект изменения цвета. Иерархия наследования:
```
QObject — QGraphicsEffect — QGraphicsColorizeEffect
```

Формат конструктора класса:
```c++
#include <QGraphicsColorizeEffect>

QGraphicsColorizeEffect(QObject *parent = nullptr)
```

Класс `QGraphicsColorizeEffect` наследует все методы из базовых классов и содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **setColor()** — задает цвет. Метод является слотом. Прототип метода:
```c++
void setColor(const QColor &c)
```

> **color()** — возвращает текущий цвет. Прототип метода:
```c++
QColor color() const
```

> **setStrength()** — задает интенсивность цвета. В качестве значения указывается вещественное число от 0.0 до 1.0 (значение по умолчанию). Метод является слотом. Прототип метода:
```c++
void setStrength(qreal strength)
```

> **strength()** — возвращает интенсивность цвета. Прототип метода:
```c++
qreal strength() const
```

Класс `QGraphicsColorizeEffect` содержит следующие сигналы:

> **colorChanged(const QColor&)** — генерируется при изменении цвета. Внутри обработчика через параметр доступен новый цвет (экземпляр класса [[QColor|QColor]]);
> 
> **strengthChanged(qreal)** — генерируется при изменении интенсивности цвета. Внутри обработчика через параметр доступно новое значение.

