# QBrush

Класс `QBrush` описывает кисть, с помощью которой производится заполнение фона фигур. Форматы конструктора класса:
```c++
#include <QBrush>

QBrush()
QBrush(const QColor &color, Qt::BrushStyle style = Qt::SolidPattern)
QBrush(Qt::GlobalColor color, Qt::BrushStyle style = Qt::SolidPattern)
QBrush(Qt::BrushStyle style)
QBrush(const QGradient &gradient)
QBrush(const QColor &color, const QPixmap &pixmap)
QBrush(Qt::GlobalColor color, const QPixmap &pixmap)
QBrush(const QPixmap &pixmap)
QBrush(const QImage &image)
QBrush(const QBrush &other)
```

Параметр `color` задает цвет кисти. Можно передать экземпляр класса [[QColor|QColor]] или константу, например `Qt::black`.

В параметре `style` указываются константы, задающие стиль кисти, например: `Qt::NoBrush`, `Qt::SolidPattern`, `Qt::Dense1Pattern`, `Qt::Dense2Pattern`, `Qt::Dense3Pattern`, `Qt::Dense4Pattern`, `Qt::Dense5Pattern`, `Qt::Dense6Pattern`, `Qt::Dense7Pattern`, `Qt::CrossPattern` и др. С помощью этого параметра можно сделать цвет сплошным (`SolidPattern`) или имеющим текстуру (например, константа `CrossPattern` задает текстуру в виде сетки).

Параметр `gradient` позволяет установить градиентную заливку. В качестве значения указываются экземпляры классов [[QLinearGradient|QLinearGradient]] (линейный градиент), [[QConicalGradient|QConicalGradient]] (конический градиент) или [[QRadialGradient|QRadialGradient]] (радиальный градиент). За подробной информацией по этим классам обращайтесь к документации.

Параметры `pixmap` и `image` предназначены для установки изображения в качестве текстуры.

Класс `QBrush` содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

>**setColor()** — задает цвет кисти. Прототипы метода:
```c++
void setColor(const QColor &color)
void setColor(Qt::GlobalColor color)
```

> **setStyle()** — задает стиль кисти (см. значения параметра `style` в конструкторе класса `QBrush`). Прототип метода:
```c++
void setStyle(Qt::BrushStyle style)
```

> **setTexture()** — устанавливает растровое изображение. В качестве параметра можно указать экземпляр классов [[QPixmap|QPixmap]] или [[QBitmap|QBitmap]]. Прототип метода:
```c++
void setTexture(const QPixmap &pixmap)
```

> **setTextureImage()** — устанавливает изображение. Прототип метода:
```c++
void setTextureImage(const QImage &image)
```

