
# Размытие (QGraphicsBlurEffect)

Класс `QGraphicsBlurEffect` реализует эффект размытия. Иерархия наследования:
```
QObject — QGraphicsEffect — QGraphicsBlurEffect
```

Формат конструктора класса:
```c++
#include <QGraphicsBlurEffect>

QGraphicsBlurEffect(QObject *parent = nullptr)
```

Класс `QGraphicsBlurEffect` наследует все методы из базовых классов и содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **setBlurRadius()** — задает радиус размытия. Метод является слотом. Прототип метода:
```c++
void setBlurRadius(qreal blurRadius)
```

> **blurRadius()** — возвращает радиус размытия. Прототип метода:
```c++
qreal blurRadius() const
```

Класс **QGraphicsBlurEffect** содержит сигнал `blurRadiusChanged(qreal)`, который генерируется при изменении радиуса размытия. Внутри обработчика через параметр доступно новое значение.

