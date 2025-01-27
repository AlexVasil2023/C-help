# QBitmap

Класс `QBitmap` предназначен для работы с изображениями, имеющими глубину цвета равной одному биту, в контекстно-зависимом представлении. Наиболее часто класс `QBitmap` используется для создания масок изображений. Иерархия наследования:
```
QPaintDevice — QPixmap — QBitmap
```

Так как класс `QBitmap` наследует класс [[QPaintDevice|QPaintDevice]], мы можем использовать его как поверхность для рисования. Цвет пера и кисти задается константами `Qt::color0` (прозрачный цвет) и `Qt::color1` (непрозрачный цвет). Вывести изображение на рисунок позволяет метод `drawPixmap()` из класса [[QPainter|QPainter]].

Форматы конструктора класса:
```c++
#include <QBitmap>

QBitmap()
QBitmap(int width, int height)
QBitmap(const QSize &size)
QBitmap(const QString &fileName, const char *format = nullptr)
```

Класс `QBitmap` наследует все методы из класса [[QPixmap|QPixmap]] и содержит следующие дополнительные методы (перечислены только основные методы; полный список смотрите в документации):

> **fromImage()** — преобразует экземпляр класса [[QImage|QImage]] в экземпляр класса `QBitmap` и возвращает его. Метод является статическим. Прототипы метода:
```c++
static QBitmap fromImage(const QImage &image,
								Qt::ImageConversionFlags flags = Qt::AutoColor)
static QBitmap fromImage(QImage &&image,
								Qt::ImageConversionFlags flags = Qt::AutoColor)
```

> **fromPixmap()** — преобразует экземпляр класса [[QPixmap|QPixmap]] в экземпляр класса `QBitmap`и возвращает его. Метод является статическим. Прототип метода:
```c++
static QBitmap fromPixmap(const QPixmap &pixmap)
```

> **transformed()** — производит трансформацию изображения (например, поворот) и возвращает экземпляр класса `QBitmap`. Исходное изображение не изменяется. Прототип метода:
```c++
QBitmap transformed(const QTransform &matrix) const
```

> **clear()** — устанавливает все биты изображения в значение `Qt::color0`. Прототип метода:
```c++
void clear()
```

