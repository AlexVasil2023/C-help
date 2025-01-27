
[[#Класс QGraphicsView представление|Класс QGraphicsView: представление]] 9.2
1. [[#Настройка параметров представления|Настройка параметров представления]] 9.2.1
2. [[#Преобразования между координатами представления и сцены|Преобразования между координатами представления и сцены]] 9.2.2
3. [[#Поиск объектов|Поиск объектов]] 9.2.3
4. [[#Трансформация систем координат|Трансформация систем координат]] 9.2.4
5. [[#Прочие методы|Прочие методы]] 9.2.5

# Класс QGraphicsView: представление

Класс `QGraphicsView` предназначен для отображения сцены. Одну сцену можно отображать с помощью нескольких представлений. Иерархия наследования:
```
(QObject, QPaintDevice) — QWidget — QFrame — QAbstractScrollArea — QGraphicsView
```

Форматы конструктора класса:
```c++
#include <QGraphicsView>

QGraphicsView(QWidget *parent = nullptr)
QGraphicsView(QGraphicsScene *scene, QWidget *parent = nullptr)
```

## Настройка параметров представления

Для настройки различных параметров представления предназначены следующие методы из класса `QGraphicsView` (перечислены только основные методы; полный список смотрите в документации):
> **setScene()** — устанавливает сцену в представление. Прототип метода:
```c++
void setScene(QGraphicsScene *scene)
```

> **scene()** — возвращает указатель на сцену. Прототип метода:
```c++
QGraphicsScene *scene() const
```

> **setSceneRect()** — задает координаты и размеры сцены. Прототипы метода:
```c++
void setSceneRect(qreal x, qreal y, qreal w, qreal h)
void setSceneRect(const QRectF &rect)
```

> **sceneRect()** — возвращает экземпляр класса [[QRect#QRectF|QRectF]] с координатами и размерами сцены. Прототип метода:
```c++
QRectF sceneRect() const
```

> **setBackgroundBrush()** — задает кисть для заднего плана сцены (расположен под графическими объектами). Прототип метода:
```c++
void setBackgroundBrush(const QBrush &brush)
```

> **setForegroundBrush()** — задает кисть для переднего плана сцены (расположен над графическими объектами). Прототип метода:
```c++
void setForegroundBrush(const QBrush &brush)
```

> **setCacheMode()** — задает режим кеширования. Прототип метода:
```c++
void setCacheMode(QGraphicsView::CacheMode mode)
```
В качестве параметра могут быть указаны следующие константы:
* **QGraphicsView::CacheNone** — без кеширования;
* **QGraphicsView::CacheBackground** — кешируется задний фон;

> **resetCachedContent()** — сбрасывает кеш. Прототип метода:
```c++
void resetCachedContent()
```

> **setAlignment()** — задает выравнивание сцены внутри представления при отсутствии полос прокрутки. По умолчанию сцена центрируется по горизонтали и вертикали. Прототип метода:
```c++
void setAlignment(Qt::Alignment alignment)
```

> **setInteractive()** — если в качестве параметра указано значение `true`, то пользователь может взаимодействовать с объектами на сцене (интерактивный режим используется по умолчанию). Значение `false` устанавливает режим только для чтения. Прототип метода:
```c++
void setInteractive(bool allowed)
```

> **isInteractive()** — возвращает значение `true`, если используется интерактивный режим, и `false` — в противном случае. Прототип метода:
```c++
bool isInteractive() const
```

> **setDragMode()** — задает действие, которое производится при щелчке левой кнопкой мыши на фоне и перемещении мыши. Получить текущее действие позволяет метод `dragMode()`. Прототипы методов:
```c++
void setDragMode(QGraphicsView::DragMode mode)
QGraphicsView::DragMode dragMode() const
```

В качестве параметра `mode` могут быть указаны следующие константы:
* **QGraphicsView::NoDrag** — действие не определено; 
* **QGraphicsView::ScrollHandDrag** — перемещение мыши при нажатой левой кнопке будет приводить к прокрутке сцены. При этом указатель мыши примет вид сжатой или разжатой руки;
* **QGraphicsView::RubberBandDrag** — создается область выделения. Объекты, частично или полностью (задается с помощью метода `setRubberBandSelectionMode()`) попавшие в эту область, будут выделены (при условии, что установлен флаг `ItemIsSelectable`). Действие выполняется только в интерактивном режиме;

> **setRubberBandSelectionMode()** — задает режим выделения объектов при установленном флаге `RubberBandDrag`. Прототип метода:
```c++
void setRubberBandSelectionMode(Qt::ItemSelectionMode mode)
```

В параметре `mode` могут быть указаны следующие константы:
* **Qt::ContainsItemShape** — объект будет выделен, если все точки объекта находятся внутри области выделения;
* **Qt::IntersectsItemShape** — объект будет выделен, если любая точка объекта попадет в область выделения;
* **Qt::ContainsItemBoundingRect** — объект будет выделен, если охватывающий прямоугольник полностью находится внутри области выделения;
* **Qt::IntersectsItemBoundingRect** — объект будет выделен, если любая точка охватывающего прямоугольника попадет в область выделения.

## Преобразования между координатами представления и сцены

Для преобразования между координатами представления и сцены предназначены следующие методы из класса `QGraphicsView`:
```c++
QPoint mapFromScene(qreal x, qreal y) const
QPoint mapFromScene(const QPointF &point) const
QPolygon mapFromScene(qreal x, qreal y, qreal w, qreal h) const
QPolygon mapFromScene(const QRectF &rect) const
QPolygon mapFromScene(const QPolygonF &polygon) const
QPainterPath mapFromScene(const QPainterPath &path) const
```

> **mapToScene()** — преобразует координаты из системы координат представления в систему координат сцены. Прототипы метода:
```c++
QPointF mapToScene(int x, int y) const
QPointF mapToScene(const QPoint &point) const
QPolygonF mapToScene(int x, int y, int w, int h) const
QPolygonF mapToScene(const QRect &rect) const
QPolygonF mapToScene(const QPolygon &polygon) const
QPainterPath mapToScene(const QPainterPath &path) const
```

## Поиск объектов

Для поиска объектов на сцене предназначены следующие методы:

> **itemAt()** — возвращает указатель на верхний видимый объект, который расположен по указанным координатам, или нулевой указатель, если объекта нет. В качестве значений указываются координаты в системе координат представления, а не сцены. Прототипы метода:
```c++
QGraphicsItem *itemAt(int x, int y) const
QGraphicsItem *itemAt(const QPoint &pos) const
```

> **items()** — возвращает список с указателями на все объекты или на объекты, расположенные по указанным координатам, или объекты, попадающие в указанную область. Если объектов нет, то возвращается пустой список. В качестве значений указываются координаты в системе координат представления, а не сцены. Прототипы метода:
```c++
QList<QGraphicsItem *> items() const
QList<QGraphicsItem *> items(int x, int y) const
QList<QGraphicsItem *> items(const QPoint &pos) const
QList<QGraphicsItem *> items(int x, int y, int w, int h,
				Qt::ItemSelectionMode mode = Qt::IntersectsItemShape) const
QList<QGraphicsItem *> items(const QRect &rect,
				Qt::ItemSelectionMode mode = Qt::IntersectsItemShape) const
QList<QGraphicsItem *> items(const QPolygon &polygon,
				Qt::ItemSelectionMode mode = Qt::IntersectsItemShape) const
QList<QGraphicsItem *> items(const QPainterPath &path,
				Qt::ItemSelectionMode mode = Qt::IntersectsItemShape) const
```

## Трансформация систем координат

Произвести трансформацию системы координат позволяют следующие методы из класса `QGraphicsView`:

> **translate()** — перемещает начало координат в указанную точку. По умолчанию начало координат находится в левом верхнем углу. Положительная ось `X` направлена вправо, а положительная ось `Y` — вниз. Прототип метода:
```c++
void translate(qreal dx, qreal dy)
```

> **rotate()** — поворачивает систему координат на указанное количество градусов (указывается вещественное число). Положительное значение вызывает поворот по часовой стрелке, а отрицательное значение — против часовой стрелки. Прототип метода:
```c++
void rotate(qreal angle)
```

> **scale()** — масштабирует систему координат. Если значение меньше единицы, то выполняется уменьшение, а если больше единицы, то увеличение. Прототип метода:
```c++
void scale(qreal sx, qreal sy)
```

> **shear()** — сдвигает систему координат. Прототип метода:
```c++
void shear(qreal sh, qreal sv)
```

> **resetTransform()** — отменяет все трансформации. Прототип метода:
```c++
void resetTransform()
```

Несколько трансформаций можно произвести последовательно друг за другом. В этом случае следует учитывать, что порядок следования трансформаций имеет значение. Если одна и та же последовательность выполняется несколько раз, то ее можно сохранить в экземпляре класса [[QTransform|QTransform]], а затем установить с помощью метода `setTransform()`. Получить установленную матрицу позволяет метод `transform()`. Прототипы методов:

```c++
void setTransform(const QTransform &matrix, bool combine = false)
QTransform transform() const
```

## Прочие методы

Помимо рассмотренных методов класс `QGraphicsView` содержит следующие дополнительные методы (перечислены только основные методы; полный список смотрите в документации):

> **centerOn()** — прокручивает область таким образом, чтобы указанная точка или объект находились в центре видимой области представления. Прототипы метода:
```c++
void centerOn(qreal x, qreal y)
void centerOn(const QPointF &pos)
void centerOn(const QGraphicsItem *item)
```

> **ensureVisible()** — прокручивает область таким образом, чтобы указанный прямоугольник или объект находились в видимой области представления. Прототипы метода:
```C++
void ensureVisible(qreal x, qreal y, qreal w, qreal h,
					int xmargin = 50, int ymargin = 50)
void ensureVisible(const QRectF &rect,
					int xmargin = 50, int ymargin = 50)
void ensureVisible(const QGraphicsItem *item,
					int xmargin = 50, int ymargin = 50)
```

> **fitInView()** — прокручивает и масштабирует область таким образом, чтобы указанный прямоугольник или объект занимали всю видимую область представления. Прототипы метода:
```C++
void fitInView(qreal x, qreal y, qreal w, qreal h,
					Qt::AspectRatioMode aspectRatioMode = Qt::IgnoreAspectRatio)
void fitInView(const QRectF &rect,
					Qt::AspectRatioMode aspectRatioMode = Qt::IgnoreAspectRatio)
void fitInView(const QGraphicsItem *item,
					Qt::AspectRatioMode aspectRatioMode = Qt::IgnoreAspectRatio)
```

> **render()** — позволяет вывести содержимое представления на принтер или на устройство рисования. Прототип метода:
```C++
void render(QPainter *painter, const QRectF &target = QRectF(),
					const QRect &source = QRect(),
					Qt::AspectRatioMode aspectRatioMode = Qt::KeepAspectRatio)
```

> **invalidateScene()** — вызывает перерисовку указанных слоев внутри прямоугольной области на сцене. Метод является слотом. Прототип метода
```C++
void invalidateScene(const QRectF &rect = QRectF(),
				QGraphicsScene::SceneLayers layers = QGraphicsScene::AllLayers)
```

> **updateSceneRect()** — вызывает перерисовку указанной прямоугольной области сцены. Метод является слотом. Прототип метода:
```C++
void updateSceneRect(const QRectF &rect)
```

> **updateScene()** — вызывает перерисовку указанных прямоугольных областей. Метод является слотом. Прототип метода:
```C++
void updateScene(const QList<QRectF> &rects)
```

