
# Тень (QGraphicsDropShadowEffect)

Класс `QGraphicsDropShadowEffect` реализует тень. Иерархия наследования:
```
QObject — QGraphicsEffect — QGraphicsDropShadowEffect
```

Формат конструктора класса:
```c++
#include <QGraphicsDropShadowEffect>

QGraphicsDropShadowEffect(QObject *parent = nullptr)
```

Класс `QGraphicsDropShadowEffect` наследует все методы из базовых классов и содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **setColor()** — задает цвет тени. Метод является слотом. Прототип метода:
```c++
void setColor(const QColor &color)
```

> **color()** — возвращает цвет тени. Прототип метода:
```c++
QColor color() const
```

> **setBlurRadius()** — задает радиус размытия тени. Метод является слотом. Прототип метода:
```c++
void setBlurRadius(qreal blurRadius)
```

> **blurRadius()** — возвращает радиус размытия тени. Прототип метода:
```c++
qreal blurRadius() const
```

> **setOffset()** — задает смещение тени. Метод является слотом. Прототипы метода:
```c++
void setOffset(qreal d)
void setOffset(qreal dx, qreal dy)
void setOffset(const QPointF &ofs)
```

> **offset()** — возвращает смещение тени. Прототип метода:
```c++
QPointF offset() const
```

> **setXOffset()** — задает смещение по оси `X`. Метод является слотом. Прототип метода:
```c++
void setXOffset(qreal dx)
```

> **xOffset()** — возвращает смещение по оси `X`. Прототип метода:
```c++
qreal xOffset() const
```

> **setYOffset()** — задает смещение по оси `Y`. Метод является слотом. Прототип метода:
```c++
void setYOffset(qreal dy)
```

> **yOffset()** — возвращает смещение по оси `Y`. Прототип метода:
```c++
qreal yOffset() const
```

Класс `QGraphicsDropShadowEffect` содержит следующие сигналы:
> **colorChanged(const QColor&)** — генерируется при изменении цвета тени. Внутри обработчика через параметр доступен новый цвет (экземпляр класса [[QColor|QColor]]);
>
> **blurRadiusChanged(qreal)** — генерируется при изменении радиуса размытия. Внутри обработчика через параметр доступно новое значение;
> 
> **offsetChanged(const QPointF&)** — генерируется при изменении смещения. Внутри обработчика через параметр доступно новое значение (экземпляр класса [[QPoint#QPointF|QPointF]]).

