[[#Класс QGraphicsScene сцена|Класс QGraphicsScene: сцена]] 9.1
1. [[#Настройка параметров сцены|Настройка параметров сцены]] 9.1.1
2. [[#Добавление и удаление графических объектов|Добавление и удаление графических объектов]] 9.1.2
3. [[#Добавление компонентов на сцену|Добавление компонентов на сцену]] 9.1.3
4. [[#Поиск объектов|Поиск объектов]] 9.1.4
5. [[#Управление фокусом ввода|Управление фокусом ввода]] 9.1.5
6. [[#Управление выделением объектов|Управление выделением объектов]] 9.1.6
7.  [[#Прочие методы и сигналы|Прочие методы и сигналы]] 9.1.7
8. 
9. 

# Класс QGraphicsScene: сцена

Класс `QGraphicsScene` исполняет роль сцены, на которой расположены графические объекты. Этот класс содержит также множество методов для управления этими объектами. Иерархия наследования выглядит так:
```
QObject — QGraphicsScene
```

Форматы конструктора:
```c++
#include <QGraphicsScene>

QGraphicsScene(QObject *parent = nullptr)
QGraphicsScene(qreal x, qreal y, qreal width, qreal height,
										QObject *parent = nullptr)
QGraphicsScene(const QRectF &sceneRect, QObject *parent = nullptr)
```

Первый конструктор создает сцену, не имеющую определенного размера. Второй и третий конструкторы позволяют указать размеры сцены в виде вещественных чисел или экземпляра класса [[QRect#QRectF|QRectF]]. В качестве параметра parent можно передать указатель на родительский компонент.

## Настройка параметров сцены

Для настройки различных параметров сцены предназначены следующие методы из класса `QGraphicsScene`:
> **setSceneRect()** — задает координаты и размеры сцены. Прототипы метода:
```c++
void setSceneRect(qreal x, qreal y, qreal w, qreal h)
void setSceneRect(const QRectF &rect)
```

> **sceneRect()** — возвращает экземпляр класса QRectF с координатами и размерами сцены. Прототип метода:
```c++
QRectF sceneRect() const
```

> **width()** и **height()** — возвращают ширину и высоту сцены соответственно в виде вещественного числа. Прототипы методов:
```c++
qreal width() const
qreal height() const
```

> **itemsBoundingRect()** — возвращает экземпляр класса [[QRect#QRectF|QRectF]] с координатами и размерами прямоугольника, в который можно вписать все объекты, расположенные на сцене. Прототип метода:
```c++
QRectF itemsBoundingRect() const
```

> **setBackgroundBrush()** — задает кисть для заднего плана (расположен под графическими объектами). Чтобы изменить задний фон, можно также переопределить метод `drawBackground()` и произвести в нем рисование. Прототип метода:
```c++
void setBackgroundBrush(const QBrush &brush)
```

> **setForegroundBrush()** — задает кисть для переднего плана (расположен над графическими объектами). Чтобы изменить передний фон, можно также переопределить метод `drawForeground()` и произвести в нем рисование. Прототип метода:
```c++
void setForegroundBrush(const QBrush &brush)
```

> **setFont()** — задает шрифт сцены по умолчанию. Прототип метода:
```c++
void setFont(const QFont &font)
```

> **setItemIndexMethod()** — задает режим индексации объектов сцены. Прототип метода:
```c++
void setItemIndexMethod(QGraphicsScene::ItemIndexMethod method)
```

В качестве параметра указываются следующие константы:
> **QGraphicsScene::BspTreeIndex** — для поиска объектов используется индекс в виде бинарного дерева. Этот режим следует использовать для сцен, на коQGraphicsScene::BspTreeIndex — для поиска объектов используется индекс в виде бинарного дерева. Этот режим следует использовать для сцен, на ко
> 
 > **QGraphicsScene::NoIndex** — индекс не используется. Этот режим следует использовать для динамических сцен;
>
> **setBspTreeDepth()** — задает глубину дерева при использовании режима `BspTreeIndexa`. По умолчанию установлено значение 0, которое означает, что глубина выбирается автоматически. Прототип метода:
```c++
void setBspTreeDepth(int depth)
```

> **bspTreeDepth()** — возвращает текущее значение глубины дерева при использовании режима BspTreeIndex. Прототип метода:

## Добавление и удаление графических объектов

Для добавления графических объектов на сцену и удаления их предназначены следующие методы из класса `QGraphicsScene`:

> **addItem()** — добавляет графический объект на сцену. В качестве значения указывается экземпляр класса, который наследует класс `QGraphicsItem`, например `QGraphicsEllipseItem` (эллипс). Прототип метода:
```c++
void addItem(QGraphicsItem *item)
```

> **addLine()** — создает линию, добавляет ее на сцену и возвращает указатель на нее (экземпляр класса `QGraphicsLineItem`). Прототипы метода:
```c++
QGraphicsLineItem *addLine(qreal x1, qreal y1, qreal x2, qreal y2,
								const QPen &pen = QPen())

QGraphicsLineItem *addLine(const QLineF &line,
								const QPen &pen = QPen())
```

> **addRect()** — создает прямоугольник, добавляет его на сцену и возвращает указатель на него (экземпляр класса `QGraphicsRectItem`). Прототипы метода:
```c++
QGraphicsRectItem *addRect(qreal x, qreal y, qreal w, qreal h,
					const QPen &pen = QPen(), const QBrush &brush = QBrush())
QGraphicsRectItem *addRect(const QRectF &rect,
					const QPen &pen = QPen(), const QBrush &brush = QBrush())
```

> **addPolygon()** — создает многоугольник, добавляет его на сцену и возвращает указатель на него (экземпляр класса `QGraphicsPolygonItem`). Прототип метода:
```c++
QGraphicsPolygonItem *addPolygon(const QPolygonF &polygon,
					const QPen &pen = QPen(), const QBrush &brush = QBrush())
```

> **addEllipse()** — создает эллипс, добавляет его на сцену и возвращает указатель на него (экземпляр класса `QGraphicsEllipseItem`). Прототипы метода:
```c++
QGraphicsEllipseItem *addEllipse(qreal x, qreal y, qreal w,
					qreal h, const QPen &pen = QPen(),
					const QBrush &brush = QBrush())
QGraphicsEllipseItem *addEllipse(const QRectF &rect,
					const QPen &pen = QPen(), const QBrush &brush = QBrush())
```

> **addPixmap()** — создает изображение, добавляет его на сцену и возвращает указатель на него (экземпляр класса `QGraphicsPixmapItem`). Прототип метода:
```c++
QGraphicsPixmapItem *addPixmap(const QPixmap &pixmap)
```

> **addSimpleText()** — создает экземпляр класса `QGraphicsSimpleTextItem`, добавляет его на сцену в позицию с координатами (0, 0) и возвращает указатель на него. Прототип метода:
```c++
QGraphicsSimpleTextItem *addSimpleText(const QString &text,
					const QFont &font = QFont())
```

> **addText()** — создает экземпляр класса `QGraphicsTextItem`, добавляет его на сцену в позицию с координатами (0, 0) и возвращает указатель на него. Прототип метода:
```c++
QGraphicsTextItem *addText(const QString &text, const QFont &font = QFont())
```

> **addPath()** — создает экземпляр класса `QGraphicsPathItem`, добавляет его на сцену и возвращает указатель на него. Прототип метода:
```c++
QGraphicsPathItem *addPath(const QPainterPath &path,
					const QPen &pen = QPen(), const QBrush &brush = QBrush())
```

> **removeItem()** — убирает графический объект (и всех его потомков) со сцены. Графический объект при этом не удаляется и, например, может быть добавлен на другую сцену. Прототип метода:
```c++
void removeItem(QGraphicsItem *item)
```

> **clear()** — удаляет все элементы со сцены. Метод является слотом. Прототип метода:
```c++
void clear()
```

> **createItemGroup()** — группирует объекты, добавляет группу на сцену и возвращает указатель на экземпляр класса `QGraphicsItemGroup`. Прототип метода:
```c++
QGraphicsItemGroup *createItemGroup(const QList<QGraphicsItem *> &items)
```

> **destroyItemGroup()** — удаляет группу со сцены. Прототип метода:
```c++
void destroyItemGroup(QGraphicsItemGroup *group)
```

## Добавление компонентов на сцену

Помимо графических объектов на сцену можно добавить компоненты, которые будут функционировать как обычно. Добавить компонент на сцену позволяет метод `addWidget()` из класса `QGraphicsScene`. Прототип метода:
```c++
QGraphicsProxyWidget *addWidget(QWidget *widget,
					Qt::WindowFlags wFlags = Qt::WindowFlags())
```

В первом параметре указывается экземпляр класса, который наследует класс `QWidget`. Во втором параметре задается [[QWidget#Указание типа окна|тип окна]]. Метод возвращает указатель на добавленный компонент (экземпляр класса `QGraphicsProxyWidget`).

Чтобы изменить текст в заголовке окна, следует воспользоваться методом `setWindowTitle()` из класса [[QGraphicsWidget#QGraphicsWidget|QGraphicsWidget]].

Сделать окно активным позволяет метод `setActiveWindow()`. Получить указатель на активное окно можно с помощью метода `activeWindow()`. Если активного окна нет, то метод возвращает нулевой указатель. Прототипы методов:
```c++
void setActiveWindow(QGraphicsWidget *widget)
QGraphicsWidget *activeWindow() const
```

## Поиск объектов

Для поиска объектов предназначены следующие методы из класса `QGraphicsScene`:

> **itemAt()** — возвращает указатель на верхний видимый объект, который расположен по указанным координатам, или нулевой указатель, если объекта нет. Прототипы метода:
```c++
QGraphicsItem *itemAt(qreal x, qreal y, 
							  const QTransform &deviceTransform) const
QGraphicsItem *itemAt(const QPointF &position, 
							  const QTransform &deviceTransform) const
```

> **collidingItems()** — возвращает список с указателями на объекты, которые сталкиваются с указанным в первом параметре объектом. Если таких объектов нет, то метод возвращает пустой список. Прототип метода:
```c++
QList<QGraphicsItem *> collidingItems(const QGraphicsItem *item,
				Qt::ItemSelectionMode mode = Qt::IntersectsItemShape) const
```

> **items()** — возвращает список с указателями на все объекты или на объекты, расположенные по указанным координатам, или объекты, попадающие в указанную область. Если объектов нет, то возвращается пустой список. Прототипы метода:
```c++
QList<QGraphicsItem *> items(
					Qt::SortOrder order = Qt::DescendingOrder) const
QList<QGraphicsItem *> items(const QPointF &pos,
					Qt::ItemSelectionMode mode = Qt::IntersectsItemShape,
					Qt::SortOrder order = Qt::DescendingOrder,
					const QTransform &deviceTransform = QTransform()) const
QList<QGraphicsItem *> items(qreal x, qreal y, qreal w, qreal h,
					Qt::ItemSelectionMode mode, Qt::SortOrder order,
					const QTransform &deviceTransform = QTransform()) const
QList<QGraphicsItem *> items(const QRectF &rect,
					Qt::ItemSelectionMode mode = Qt::IntersectsItemShape,
					Qt::SortOrder order = Qt::DescendingOrder,
					const QTransform &deviceTransform = QTransform()) const
QList<QGraphicsItem *> items(const QPolygonF &polygon,
					Qt::ItemSelectionMode mode = Qt::IntersectsItemShape,
					Qt::SortOrder order = Qt::DescendingOrder,
					const QTransform &deviceTransform = QTransform()) const
QList<QGraphicsItem *> items(const QPainterPath &path,
					Qt::ItemSelectionMode mode = Qt::IntersectsItemShape,
					Qt::SortOrder order = Qt::DescendingOrder,
					const QTransform &deviceTransform = QTransform()) const
```

В параметре `order` указываются константы `Qt::AscendingOrder` (в прямом порядке) или `Qt::DescendingOrder` (в обратном порядке).

В параметре `mode` могут быть указаны следующие константы:
> **Qt::ContainsItemShape** — объект попадет в список, если все точки объекта находятся внутри области;
> 
> **Qt::IntersectsItemShape** — объект попадет в список, если любая точка объекта попадет в область;
> 
> **Qt::ContainsItemBoundingRect** — объект попадет в список, если охватывающий прямоугольник полностью находится внутри области;
> 
> **Qt::IntersectsItemBoundingRect** — объект попадет в список, если любая точка охватывающего прямоугольника попадет в область.

## Управление фокусом ввода

Обладать фокусом ввода с клавиатуры может как сцена в целом, так и отдельный объект на сцене. Если фокус установлен на отдельный объект, то все события клавиатуры перенаправляются этому объекту. Чтобы объект мог принимать фокус ввода, необходимо установить флаг `ItemIsFocusable`, например с помощью метода `setFlag()` из класса `QGraphicsItem`. Для управления фокусом ввода предназначены следующие методы из класса `QGraphicsScene`:
> **setFocus()** — устанавливает фокус ввода на сцену. В параметре `focusReason` можно указать причину [[process signal and event#Установка фокуса ввода|изменения фокуса ввода]]. Прототип метода:
```c++
void setFocus(Qt::FocusReason focusReason = Qt::OtherFocusReason)
```

> **setFocusItem()** — устанавливает фокус ввода на указанный графический объект на сцене. Если сцена была вне фокуса ввода, то она автоматически получит фокус. Если объект не может принимать фокус, то метод просто убирает фокус с объекта, который обладает фокусом ввода в данный момент. В параметре `focusReason` можно указать причину изменения фокуса ввода. Прототип метода:
```c++
void setFocusItem(QGraphicsItem *item,
					Qt::FocusReason focusReason = Qt::OtherFocusReason)
```

> **clearFocus()** — убирает фокус ввода со сцены. Объект на сцене, который обладает фокусом ввода в данный момент, потеряет фокус, но получит его снова, когда фокус будет снова установлен на сцену. Прототип метода:
```c++
void clearFocus()
```

> **hasFocus()** — возвращает значение `true`, если сцена имеет фокус ввода, и `false` — в противном случае. Прототип метода:
```c++
bool hasFocus() const
```

> **focusItem()** — возвращает указатель на объект, который обладает фокусом ввода, или нулевой указатель. Прототип метода:
```c++
QGraphicsItem *focusItem() const
```

> **setStickyFocus()** — если в качестве параметра указано значение `true`, то при щелчке мышью на фоне сцены или на объекте, который не может принимать фокус, объект, владеющий фокусом, не потеряет фокус ввода. По умолчанию фокус убирается. Прототип метода:
```c++
void setStickyFocus(bool enabled)
```

> **stickyFocus()** — возвращает значение `true`, если фокус ввода не будет убран с объекта при щелчке мышью на фоне или на объекте, который не может принимать фокус. Прототип метода:
```c++
bool stickyFocus() const
```

## Управление выделением объектов

Чтобы объект можно было выделить (с помощью мыши или из программы), необходимо установить флаг `ItemIsSelectable`, например с помощью метода `setFlag()` из класса `QGraphicsItem`. Для управления выделением объектов предназначены следующие методы из класса `QGraphicsScene`:

> **setSelectionArea()** — выделяет объекты внутри указанной области. Чтобы выделить только один объект, следует воспользоваться методом `setSelected()` из класса `QGraphicsItem`. Прототипы метода:
```c++
void setSelectionArea(const QPainterPath &path,
					const QTransform &deviceTransform)
void setSelectionArea(const QPainterPath &path,
					Qt::ItemSelectionOperation selectionOperation =
					Qt::ReplaceSelection, Qt::ItemSelectionMode mode =
					Qt::IntersectsItemShape,
					const QTransform &deviceTransform = QTransform())
```

В параметре mode могут быть указаны следующие константы:
> **Qt::ContainsItemShape** — объект будет выделен, если все точки объекта находятся внутри области выделения;
> 
> **Qt::IntersectsItemShape** — объект будет выделен, если любая точка объекта попадет в область выделения;
> 
> **Qt::ContainsItemBoundingRect** — объект будет выделен, если охватывающий прямоугольник полностью находится внутри области выделения;
> 
> **Qt::IntersectsItemBoundingRect** — объект будет выделен, если любая точка охватывающего прямоугольника попадет в область выделения;
```c++
QPainterPath selectionArea() const
```

> **selectedItems()** — возвращает список с указателями на выделенные объекты или пустой список, если выделенных объектов нет. Прототип метода:
```c++
QList<QGraphicsItem *> selectedItems() const
```

> **clearSelection()** — снимает выделение. Метод является слотом. Прототип метода:
```c++
void clearSelection()
```

## Прочие методы и сигналы

Помимо рассмотренных методов класс `QGraphicsScene` содержит следующие дополнительные методы (перечислены только основные методы; полный список смотрите в документации):

> **isActive()** — возвращает значение `true`, если сцена отображается представлением, и `false` — в противном случае. Прототип метода:
```c++
bool isActive() const
```

> **views()** — возвращает список с представлениями (экземпляры класса `QGraphicsView`), к которым подключена сцена. Если сцена не подключена к представлениям, то возвращается пустой список. Прототип метода:
```c++
QList<QGraphicsView *> views() const
```

> **mouseGrabberItem()** — возвращает указатель на объект, который владеет мышью, или нулевой указатель, если такого объекта нет. Прототип метода:
```c++
QGraphicsItem *mouseGrabberItem() const
```

> **render()** — позволяет вывести содержимое сцены на принтер или на устройство рисования. Прототип метода:
```c++
void render(QPainter *painter, const QRectF &target = QRectF(),
				const QRectF &source = QRectF(),
				Qt::AspectRatioMode aspectRatioMode = Qt::KeepAspectRatio)
```

Параметр `target` задает координаты и размеры устройства рисования, а параметр
source — координаты и размеры прямоугольной области на сцене. Если пара-
метры не указаны, то используются размеры устройства рисования и сцены;

> **invalidate()** — вызывает перерисовку указанных слоев внутри прямоугольной области на сцене. Прототипы метода (второй прототип является слотом):
```c++
void invalidate(qreal x, qreal y, qreal w, qreal h,
						QGraphicsScene::SceneLayers layers = AllLayers)
void invalidate(const QRectF &rect = QRectF(),
						QGraphicsScene::SceneLayers layers = AllLayers)
```

В параметре `layers` могут быть указаны следующие константы:
* **QGraphicsScene::ItemLayer** — слой объекта;
* **QGraphicsScene::BackgroundLayer** — слой заднего плана;
* **QGraphicsScene::ForegroundLayer** — слой переднего плана;
* **QGraphicsScene::AllLayers** — все слои. Сначала отрисовывается слой заднего плана, затем слой объекта и в конце слой переднего плана;

> **update()** — вызывает перерисовку указанной прямоугольной области сцены. Прототипы метода (второй прототип является слотом):
```c++
void update(qreal x, qreal y, qreal w, qreal h)
void update(const QRectF &rect = QRectF())
```

Класс `QGraphicsScene` содержит следующие сигналы:

> **`changed(const QList<QRectF>&)`** — генерируется при изменении сцены. Внутри обработчика через параметр доступен список с экземплярами класса [[QRect#QRectF|QRectF]] или пустой список;
>
> **`sceneRectChanged(const QRectF&)`** — генерируется при изменении размеров сцены. Внутри обработчика через параметр доступен экземпляр класса [[QRect#QRectF|QRectF]] с новыми координатами и размерами сцены;
> 
> **`selectionChanged()`** — генерируется при изменении выделения объектов;
> 
> **`focusItemChanged(QGraphicsItem*, QGraphicsItem*, Qt::FocusReason)`** — генерируется при изменении фокуса.




















