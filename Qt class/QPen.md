
# Класс QPen: перо

Класс `QPen` описывает перо, с помощью которого производится рисование точек, линий и контуров фигур. Форматы конструктора класса:
```c++
#include <QPen>
QPen()
QPen(const QColor &color)
QPen(Qt::PenStyle style)
QPen(const QBrush &brush, qreal width,
		Qt::PenStyle style = Qt::SolidLine,
		Qt::PenCapStyle cap = Qt::SquareCap,
		Qt::PenJoinStyle join = Qt::BevelJoin)
QPen(const QPen &pen)
QPen(QPen &&pen)
```

Первый конструктор создает перо черного цвета с настройками по умолчанию. Второй конструктор задает только цвет пера с помощью экземпляра класса [[QColor|QColor]]. Третий конструктор позволяет указать стиль линии. В качестве значения указываются следующие константы:

> **Qt::NoPen** — линия не выводится;
> 
> **Qt::SolidLine** — сплошная линия;
> 
> **Qt::DashLine** — штриховая линия;
> 
> **Qt::DotLine** — пунктирная линия;
> 
> **Qt::DashDotLine** — штрих и точка, штрих и точка и т. д.;
> 
> **Qt::DashDotDotLine** — штрих и две точки, штрих и две точки и т. д.;
> 
> **Qt::CustomDashLine** — пользовательский стиль.

Четвертый конструктор позволяет задать все характеристики пера за один раз. В первом параметре указывается экземпляр класса [[QBrush|QBrush]] или класса [[QColor|QColor]]. Ширина линии передается во втором параметре, а стиль линии в необязательном параметре `style`. Необязательный параметр `cap` задает стиль концов линии. В качестве значения указываются следующие константы:

> **Qt::FlatCap** — квадратный конец линии. Длина линии не превышает указанных граничных точек;
> 
> **Qt::SquareCap** — квадратный конец линии. Длина линии увеличивается с обоих концов на половину ширины линии;
> 
> **Qt::RoundCap** — скругленные концы. Длина линии увеличивается с обоих концов на половину ширины линии.

Необязательный параметр `join` задает стиль перехода одной линии в другую. В качестве значения указываются следующие константы:

> **Qt::MiterJoin** — линии соединяются под острым углом;
> 
> **Qt::BevelJoin** — пространство между концами линий заполняется цветом линии;
> 
> **Qt::RoundJoin** — скругленные углы;
> 
> **Qt::SvgMiterJoin**.

Класс `QPen` содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **setColor()** — задает цвет линии. Прототип метода:
```c++
void setColor(const QColor &color)
```

> **setBrush()** — задает кисть. Прототип метода:
```c++
void setBrush(const QBrush &brush)
```

> **setWidth()** и **setWidthF()** — задают ширину линии. Прототипы методов:
```c++
void setWidth(int width)
void setWidthF(qreal width)
```

> **setStyle()** — задает стиль линии (см. значения параметра `style` в третьем формате конструктора класса `QPen`). Прототип метода:
```c++
void setStyle(Qt::PenStyle style)
```

> **setCapStyle()** — задает стиль концов линии (см. значения параметра `cap` в четвертом формате конструктора класса `QPen`). Прототип метода:
```c++
void setCapStyle(Qt::PenCapStyle style)
```

> **setJoinStyle()** — задает стиль перехода одной линии в другую (см. значения параметра `join` в четвертом формате конструктора класса `QPen`). Прототип метода:
```c++
void setJoinStyle(Qt::PenJoinStyle style)
```

