
[[#Класс QGraphicsItem базовый класс для графических объектов|Класс QGraphicsItem: базовый класс для графических объектов]] 9.3
1. [[#Настройка параметров объекта|Настройка параметров объекта]] 9.3.1
2. [[#Трансформация объекта|Трансформация объекта]] 9.3.2
3. [[#Прочие методы|Прочие методы]] 9.3.3

# Класс QGraphicsItem: базовый класс для графических объектов

Абстрактный класс `QGraphicsItem` является базовым классом для графических объектов. Формат конструктора класса:
```c++
QGraphicsItem(QGraphicsItem *parent = nullptr)
```

В параметре `parent` может быть передан указатель на родительский объект (экземпляр класса, наследующего класс `QGraphicsItem`).

Так как класс `QGraphicsItem` является абстрактным, создать экземпляр этого класса нельзя. Чтобы создать новый графический объект, следует наследовать класс `QGraphicsItem` и переопределить как минимум методы `boundingRect()` и `paint()`. Метод `boundingRect()` должен возвращать экземпляр класса [[QRect#QRectF|QRectF]] с координатами и размерами прямоугольной области, ограничивающей объект. Внутри метода `paint()` необходимо выполнить рисование объекта. Прототипы методов:
```c++
virtual QRectF boundingRect() const = 0
virtual void paint(QPainter *painter,
			const QStyleOptionGraphicsItem *option, QWidget *widget = nullptr) = 0
```

Для обработки столкновений следует также переопределить метод `shape()`. Метод должен возвращать экземпляр класса [[QPainterPath|QPainterPath]]. Прототип метода:

## Настройка параметров объекта

Для настройки различных параметров объекта предназначены следующие методы из класса `QGraphicsItem` (перечислены только основные методы; полный список смотрите в документации):

> **setPos()** — задает позицию объекта относительно родителя или сцены (при отсутствии родителя). Прототипы метода:
```c++
void setPos(qreal x, qreal y)
void setPos(const QPointF &pos)
```

> **pos()** — возвращает экземпляр класса [[QPoint#QPointF|QPointF]] с текущими координатами относительно родителя или сцены (при отсутствии родителя). Прототип метода:
```c++
QPointF pos() const
```

> **scenePos()** — возвращает экземпляр класса [[QPoint#QPointF|QPointF]] с текущими координатами относительно сцены. Прототип метода:
```c++
QPointF scenePos() const
```

> **sceneBoundingRect()** — возвращает экземпляр класса [[QPoint#QPointF|QPointF]], который содержит координаты (относительно сцены) и размеры прямоугольника, ограничивающего объект. Прототип метода:
```c++
QRectF sceneBoundingRect() const
```

> **setX()** и **setY()** — задают позицию объекта по отдельным осям. Прототипы методов:
```c++
void setX(qreal x)
void setY(qreal y)
```

> `x()` и `y()` — возвращают позицию объекта по отдельным осям. Прототипы методов:
```c++
qreal x() const
qreal y() const
```

> **setZValue()** — задает позицию объекта по оси `Z`. Объект с большим значением рисуется выше объекта с меньшим значением. По умолчанию для всех объектов значение равно 0.0. Прототип метода:
```c++
void setZValue(qreal z)
```

> **zValue()** — возвращает позицию объекта по оси `Z`. Прототип метода:
```c++
qreal zValue() const
```

> **moveBy()** — сдвигает объект на указанное смещение относительно текущей позиции. Прототип метода:
```c++
void moveBy(qreal dx, qreal dy)
```

> **prepareGeometryChange()** — этот метод следует вызвать перед изменением размеров объекта, чтобы поддержать индекс сцены в актуальном состоянии. Прототип метода:
```c++
protected: void prepareGeometryChange()
```

> **scene()** — возвращает указатель на сцену. Прототип метода:
```c++
QGraphicsScene *scene() const
```

> **setFlag()** — устанавливает (если второй параметр имеет значение `true`) или сбрасывает (если второй параметр имеет значение `false`) указанный флаг. Прототип метода:
```c++
void setFlag(QGraphicsItem::GraphicsItemFlag flag, bool enabled = true)
```

В первом параметре могут быть указаны следующие константы:
* **QGraphicsItem::ItemIsMovable** — объект можно перемещать с помощью мыши;
* **QGraphicsItem::ItemIsSelectable** — объект можно выделять;
* **QGraphicsItem::ItemIsFocusable** — объект может получить фокус ввода;
* **QGraphicsItem::ItemClipsToShape**;
* **QGraphicsItem::ItemClipsChildrenToShape**;
* **QGraphicsItem::ItemIgnoresTransformations** — объект игнорирует наследуемые трансформации;
* **QGraphicsItem::ItemIgnoresParentOpacity** — объект игнорирует прозрачность родителя;
* **QGraphicsItem::ItemDoesntPropagateOpacityToChildren** — прозрачность объекта не распространяется на потомков;
* **QGraphicsItem::ItemStacksBehindParent** — объект располагается позади родителя;
* **QGraphicsItem::ItemUsesExtendedStyleOption**;
* **QGraphicsItem::ItemHasNoContents**;
* **QGraphicsItem::ItemSendsGeometryChanges**;
* **QGraphicsItem::ItemAcceptsInputMethod**;
* **QGraphicsItem::ItemNegativeZStacksBehindParent**;
* **QGraphicsItem::ItemIsPanel** — объект является панелью;
* **QGraphicsItem::ItemSendsScenePositionChanges**;

> **setFlags()** — устанавливает несколько флагов. Константы указываются через оператор `|`. Прототип метода:
```c++
void setFlags(QGraphicsItem::GraphicsItemFlags flags)
```

> **flags()** — возвращает комбинацию установленных флагов. Прототип метода:
```c++
QGraphicsItem::GraphicsItemFlags flags() const
```

> **setOpacity()** — задает степень прозрачности объекта. В качестве значения указывается вещественное число от 0.0 (полностью прозрачный) до 1.0 (полностью непрозрачный). Прототип метода:
```c++
void setOpacity(qreal opacity)
```

> **opacity()** — возвращает степень прозрачности объекта. Прототип метода:
```c++
qreal opacity() const
```

> **setToolTip()** — задает текст всплывающей подсказки. Прототип метода:
```c++
void setToolTip(const QString &toolTip)
```

> **setCursor()** — задает внешний вид указателя мыши при наведении указателя на объект. Прототип метода:
```c++
void setCursor(const QCursor &cursor)
```

> **unsetCursor()** — отменяет изменение указателя мыши. Прототип метода:
```c++
void unsetCursor()
```

> **setVisible()** — если в качестве параметра указано значение `true`, то объект будет видим. Значение `false` скрывает объект. Прототип метода:
```c++
void setVisible(bool visible)
```

> **show()** — делает объект видимым. Прототип метода:
```c++
void show()
```

> **hide()** — скрывает объект. Прототип метода:
```c++
void hide()
```

> **isVisible()** — возвращает значение `true`, если объект видим, и `false`, если скрыт. Прототип метода:
```c++
bool isVisible() const
```

> **setEnabled()** — если в качестве параметра указано значение `true`, то объект будет доступен. Значение `false` делает объект недоступным. Недоступный объект не получает никаких событий, и его нельзя выделить. Прототип метода:
```c++
void setEnabled(bool enabled)
```

> **isEnabled()** — возвращает значение `true`, если объект доступен, и `false`, если недоступен. Прототип метода:
```c++
bool isEnabled() const
```

> **setSelected()** — если в качестве параметра указано значение `true`, то объект будет выделен. Значение `false` снимает выделение. Чтобы объект можно было выделить, необходимо установить флаг `ItemIsSelectable`, например с помощью метода `setFlag()` из класса `QGraphicsItem`. Прототип метода:
```c++
void setSelected(bool selected)
```

> **isSelected()** — возвращает значение `true`, если объект выделен, и `false` — в противном случае. Прототип метода:
```c++
bool isSelected() const
```

> **setFocus()** — устанавливает фокус ввода на объект. В параметре `focusReason` можно указать причину изменения фокуса ввода. Чтобы объект мог принимать фокус ввода, необходимо установить флаг `ItemIsFocusable`, например с помощью метода `setFlag()` из класса `QGraphicsItem`. Прототип метода:
```c++
void setFocus(Qt::FocusReason focusReason = Qt::OtherFocusReason)
```

> **clearFocus()** — убирает фокус ввода с объекта. Прототип метода:
```c++
void clearFocus()
```

> **hasFocus()** — возвращает значение `true`, если объект находится в фокусе ввода, и `false` — в противном случае. Прототип метода:
```c++
bool hasFocus() const
```

> **grabKeyboard()** — захватывает ввод с клавиатуры. Прототип метода:
```c++
void grabKeyboard()
```

> **ungrabKeyboard()** — освобождает ввод с клавиатуры. Прототип метода:
```c++
void ungrabKeyboard();
```

> **grabMouse()** — захватывает мышь. Прототип метода:
```c++
void grabMouse()
```

> **ungrabMouse()** — освобождает мышь. Прототип метода:
```c++
void ungrabMouse()
```

## Трансформация объекта

Произвести трансформацию графического объекта позволяют следующие методы из класса `QGraphicsItem`:

> **setTransformOriginPoint()** — перемещает начало координат в указанную точку. Прототипы метода:
```c++
void setTransformOriginPoint(qreal x, qreal y)
void setTransformOriginPoint(const QPointF &origin)
```

> **setRotation()** — поворачивает объект на указанное количество градусов (указывается вещественное число). Положительное значение вызывает поворот по часовой стрелке, а отрицательное значение — против часовой стрелки. Прототип метода:
```c++
void setRotation(qreal angle)
```

> **rotation()** — возвращает текущий угол поворота. Прототип метода:
```c++
qreal rotation() const
```

> **setScale()** — масштабирует систему координат. Если значение меньше единицы, то выполняется уменьшение, а если больше единицы, то увеличение. Прототип метода:
```c++
void setScale(qreal factor)
```

> **scale()** — возвращает текущий масштаб. Прототип метода:
```c++
qreal scale() const
```

Установить матрицу трансформаций позволяет метод `setTransform()`, а получить матрицу можно с помощью метода `transform()`. Для получения матрицы трансформации сцены предназначен метод `sceneTransform()`. Сбросить все трансформации позволяет метод `resetTransform()`. Прототипы методов:

```c++
void setTransform(const QTransform &matrix, bool combine = false)
QTransform transform() const
QTransform sceneTransform() const
void resetTransform()
```

## Прочие методы

Помимо рассмотренных методов класс `QGraphicsItem` содержит следующие дополнительные методы (перечислены только основные методы; полный список смотрите в документации):

> **setParentItem()** — задает родительский объект. Местоположение дочернего объекта задается в координатах родительского объекта. Прототип метода:
```c++
void setParentItem(QGraphicsItem *newParent)
```

> **parentItem()** — возвращает указатель на родительский объект. Прототип метода:
```c++
QGraphicsItem *parentItem() const
```

> **topLevelItem()** — возвращает указатель на родительский объект верхнего уровня. Прототип метода:
```c++
QGraphicsItem *topLevelItem() const
```

> **childItems()** — возвращает список с указателями на дочерние объекты. Прототип метода:
```c++
QList<QGraphicsItem *> childItems() const
```

> **collidingItems()** — возвращает список с указателями на объекты, которые сталкиваются с данным объектом. Если таких объектов нет, то метод возвращает пустой список. [[QGraphicsScene#Поиск объектов|Возможные значения параметра mode]]. Прототип метода:
```c++
QList<QGraphicsItem *> collidingItems(
				Qt::ItemSelectionMode mode = Qt::IntersectsItemShape) const
```

> **collidesWithItem()** — возвращает значение `true`, если данный объект сталкивается с объектом, указанным в первом параметре. [[QGraphicsScene#Поиск объектов|Возможные значения параметра mode]]. Прототип метода:
```c++
virtual bool collidesWithItem(const QGraphicsItem *other,
				Qt::ItemSelectionMode mode = Qt::IntersectsItemShape) const
```

> **ensureVisible()** — прокручивает область таким образом, чтобы указанный прямоугольник находился в видимой области представления. Прототипы метода:
```c++
void ensureVisible(qreal x, qreal y, qreal w, qreal h,
							int xmargin = 50, int ymargin = 50)
void ensureVisible(const QRectF &rect = QRectF(),
							int xmargin = 50, int ymargin = 50)
```

> **update()** — вызывает перерисовку указанной прямоугольной области. Прототипы метода:
```c++
void update(qreal x, qreal y, qreal width, qreal height)
void update(const QRectF &rect = QRectF())
```

