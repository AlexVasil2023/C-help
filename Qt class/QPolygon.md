
[[#Класс QPolygon многоугольник]]
[[#QPolygonF]]

# Класс QPolygon: многоугольник

Класс `QPolygon` описывает координаты вершин многоугольника. Форматы конструктора класса:
```c++
#include <QPolygon>

QPolygon()
QPolygon(const QList<QPoint> &points)
QPolygon(const QRect &rectangle, bool closed = false)
```

Первый конструктор создает пустой объект. Заполнить объект координатами вершин можно с помощью оператора `<<`. Пример добавления координат вершин треугольника:
```c++
QPolygon polygon;
polygon << QPoint(20, 20) << QPoint(120, 20) << QPoint(20, 120);
```

Во втором конструкторе указывается список с экземплярами класса [[QPoint|QPoint]], которые задают координаты отдельных вершин. Пример:
```c++
QList<QPoint> list;
list << QPoint(180, 20) << QPoint(280, 20) << QPoint(280, 120);
QPolygon polygon2(list);
```

Третий конструктор создает многоугольник на основе экземпляра класса [[QRect|QRect]]. Если параметр `closed` имеет значение `false`, то будут созданы четыре вершины, а если значение `true`, то пять вершин (образуют замкнутый контур).

Класс `QPolygon` содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **setPoints()** — устанавливает координаты вершин. Ранее установленные значения удаляются. Количество устанавливаемых точек задается параметром `nPoints`. Прототипы метода:
```c++
void setPoints(int nPoints, const int *points)
void setPoints(int nPoints, int firstx, int firsty, ...)
```

> **setPoint()** — задает координаты для вершины с указанным индексом. Прототипы метода:
```c++
void setPoint(int index, int x, int y)
void setPoint(int index, const QPoint &point)
```

> **point()** — возвращает экземпляр класса [[QPoint|QPoint]] с координатами вершины, индекс которой указан в параметре. Получить координаты можно также, передав адреса переменных в качестве параметров. Прототипы метода:
```c++
QPoint point(int index) const
void point(int index, int *x, int *y) const
```

> **boundingRect()** — возвращает экземпляр класса [[QRect|QRect]] с координатами и размерами прямоугольной области, в которую вписан многоугольник. Прототип метода:
```c++
QRect boundingRect() const
```

# QPolygonF
#QPolygonF

