
[[#QPainter|Класс QPainter]] 8.2
1. [[#Рисование линий и фигур|Рисование линий и фигур]] 8.2.1
2. [[#Вывод текста|Вывод текста]] 8.2.2
3. [[#Вывод изображения|Вывод изображения]] 8.2.3
4. [[#Преобразование систем координат|Преобразование систем координат]] 8.2.4
5. [[#Сохранение команд рисования в файл|Сохранение команд рисования в файл]] 8.2.5

# QPainter

Класс `QPainter` содержит все необходимые средства, позволяющие выполнять рисование геометрических фигур и текста на поверхности, которая реализуется классом [[QPaintDevice|QPaintDevice]]. Класс [[QPaintDevice|QPaintDevice]] наследуют классы [[QWidget|QWidget]], [[QPicture|QPicture]], [[QPixmap|QPixmap]], [[QImage|QImage]], [[QPrinter|QPrinter]] и некоторые другие. Таким образом, мы можем рисовать как на поверхности любого компонента, так и на изображении. Форматы конструктора класса:
```c++
#include <QPainter>

QPainter()
QPainter(QPaintDevice *device)
```

Первый конструктор создает объект, который не подключен ни к одному устройству. Чтобы подключиться к устройству и захватить контекст рисования, необходимо вызвать метод `begin()` и передать ему указатель на экземпляр класса, являющегося наследником класса [[QPaintDevice|QPaintDevice]]. Метод возвращает значение `true`, если контекст успешно захвачен, и `false` — в противном случае. Прототип метода:

```c++
bool begin(QPaintDevice *device)
```

В один момент времени только один объект может рисовать на устройстве, поэтому после окончания рисования необходимо освободить контекст рисования с помощью метода `end()`. Прототип метода:

```c++
bool end()
```

С учетом сказанного код, позволяющий рисовать на компоненте, будет выглядеть так:
```c++
void Widget::paintEvent(QPaintEvent *e)
{
	QPainter painter;
	painter.begin(this);
	
		// Здесь производим рисование на компоненте
		
	painter.end();
}
```

Второй конструктор принимает указатель на экземпляр класса, являющегося наследником класса [[QPaintDevice|QPaintDevice]], подключается к этому устройству и сразу захватывает контекст рисования. Контекст рисования автоматически освобождается внутри деструктора класса `QPainter` при уничтожении объекта. Так как объект автоматически уничтожается при выходе из метода [[QPaintEvent|paintEvent()]], то метод `end()` можно и не вызывать. Пример рисования на компоненте:
```c++
void Widget::paintEvent(QPaintEvent *e)
{
	QPainter painter(this);
	// Здесь производим рисование на компоненте
}
```

Проверить успешность захвата контекста рисования можно с помощью метода `isActive()`. Метод возвращает значение `true`, если контекст захвачен, и `false` — в противном случае. Прототип метода:
```c++
bool isActive() const
```

## Рисование линий и фигур

После захвата контекста рисования следует установить перо и кисть. С помощью пера производится рисование точек, линий и контуров фигур, а с помощью кисти — заполнение фона фигур. Установить перо позволяет метод `setPen()` из класса `QPainter`. Прототипы метода:
```c++
void setPen(const QPen &pen)
void setPen(const QColor &color)
void setPen(Qt::PenStyle style)
```

Для установки кисти предназначен метод `setBrush()`. Прототипы метода:
```c++
void setBrush(const QBrush &brush)
void setBrush(Qt::BrushStyle style)
```

Устанавливать перо или кисть нужно будет перед каждой операцией рисования, требующей изменения цвета или стиля. Если перо или кисть не установлены, то будут использоваться объекты с настройками по умолчанию. После установки пера и кисти можно приступать к рисованию точек, линий, фигур, текста и др.

Для рисования точек, линий и фигур класс [[QPainter|QPainter]] предоставляет следующие методы (перечислены только основные методы; полный список смотрите в документации по классу `QPainter`):

> **drawPoint()** — рисует точку. Прототипы метода:
```c++
void drawPoint(int x, int y)
void drawPoint(const QPoint &position)
void drawPoint(const QPointF &position)
```

> **drawPoints()** — рисует несколько точек. Прототипы метода:
```c++
void drawPoints(const QPoint *points, int pointCount)
void drawPoints(const QPointF *points, int pointCount)
void drawPoints(const QPolygon &points)
void drawPoints(const QPolygonF &points)
```

> **drawLine()** — рисует линию. Прототипы метода:
```c++
void drawLine(const QLine &line)
void drawLine(const QLineF &line)
void drawLine(const QPoint &p1, const QPoint &p2)
void drawLine(const QPointF &p1, const QPointF &p2)
void drawLine(int x1, int y1, int x2, int y2)
```

> **drawLines()** — рисует несколько отдельных линий. Прототипы метода:
```c++
void drawLines(const QList<QLine> &lines)
void drawLines(const QList<QLineF> &lines)
void drawLines(const QList<QPoint> &pointPairs)
void drawLines(const QList<QPointF> &pointPairs)
void drawLines(const QLine *lines, int lineCount)
void drawLines(const QLineF *lines, int lineCount)
void drawLines(const QPoint *pointPairs, int lineCount)
void drawLines(const QPointF *pointPairs, int lineCount)
```

> **drawPolyline()** — рисует несколько линий, которые соединяют указанные точки. Первая и последняя точки не соединяются. Прототипы метода:
```c++
void drawPolyline(const QPoint *points, int pointCount)
void drawPolyline(const QPointF *points, int pointCount)
void drawPolyline(const QPolygon &points)
void drawPolyline(const QPolygonF &points)
```

> **drawRect()** — рисует прямоугольник с границей и заливкой. Чтобы убрать границу, следует использовать перо со стилем `NoPen`, а чтобы убрать заливку — кисть со стилем `NoBrush`. Прототипы метода:
```c++
void drawRect(int x, int y, int width, int height)
void drawRect(const QRect &rectangle)
void drawRect(const QRectF &rectangle)
```

> **drawRects()** — рисует несколько прямоугольников. Прототипы метода:
```c++
void drawRects(const QRect *rectangles, int rectCount)
void drawRects(const QRectF *rectangles, int rectCount)
void drawRects(const QList<QRect> &rectangles)
void drawRects(const QList<QRectF> &rectangles)
```

> **fillRect()** — рисует прямоугольник с заливкой без границы. Прототипы метода:
```c++
void fillRect(int x, int y, int width, int height, const QColor &color)
void fillRect(int x, int y, int width, int height, Qt::GlobalColor color)
void fillRect(int x, int y, int width, int height, const QBrush &brush)
void fillRect(int x, int y, int width, int height, Qt::BrushStyle style)
void fillRect(int x, int y, int width, int height, QGradient::Preset preset)
void fillRect(const QRect &rectangle, const QColor &color)
void fillRect(const QRect &rectangle, Qt::GlobalColor color)
void fillRect(const QRect &rectangle, const QBrush &brush)
void fillRect(const QRect &rectangle, Qt::BrushStyle style)
void fillRect(const QRect &rectangle, QGradient::Preset preset)
void fillRect(const QRectF &rectangle, const QColor &color)
void fillRect(const QRectF &rectangle, Qt::GlobalColor color)
void fillRect(const QRectF &rectangle, const QBrush &brush)
void fillRect(const QRectF &rectangle, Qt::BrushStyle style)
void fillRect(const QRectF &rectangle, QGradient::Preset preset)
```

> **drawRoundedRect()** — рисует прямоугольник с границей, заливкой и скругленными краями. Прототипы метода:
```c++
void drawRoundedRect(int x, int y, int w, int h, qreal xRadius,
							qreal yRadius, Qt::SizeMode mode = Qt::AbsoluteSize)
void drawRoundedRect(const QRect &rect, qreal xRadius,
							qreal yRadius, Qt::SizeMode mode = Qt::AbsoluteSize)
void drawRoundedRect(const QRectF &rect, qreal xRadius,
							qreal yRadius, Qt::SizeMode mode = Qt::AbsoluteSize)
```

> **drawPolygon()** — рисует многоугольник с границей и заливкой. Прототипы метода:
```c++
void drawPolygon(const QPoint *points, int pointCount,
									Qt::FillRule fillRule = Qt::OddEvenFill)
void drawPolygon(const QPointF *points, int pointCount,
									Qt::FillRule fillRule = Qt::OddEvenFill)
void drawPolygon(const QPolygon &points,
									Qt::FillRule fillRule = Qt::OddEvenFill)
void drawPolygon(const QPolygonF &points,
									Qt::FillRule fillRule = Qt::OddEvenFill)
```

> **drawEllipse()** — рисует эллипс с границей и заливкой. Прототипы метода:
```c++
void drawEllipse(int x, int y, int width, int height)
void drawEllipse(const QRect &rectangle)
void drawEllipse(const QRectF &rectangle)
void drawEllipse(const QPoint &center, int rx, int ry)
void drawEllipse(const QPointF &center, qreal rx, qreal ry)
```

В первых трех форматах указываются координаты и размеры прямоугольника, в который необходимо вписать эллипс. В двух последних форматах первый параметр задает координаты центра, параметр `rx` — радиус по оси `X`, а параметр `ry` — радиус по оси `Y`;

> **drawArc()** — рисует дугу. Прототипы метода:
```c++
void drawArc(int x, int y, int width, int height, int startAngle, int spanAngle)
void drawArc(const QRect &rectangle, int startAngle, int spanAngle)
void drawArc(const QRectF &rectangle, int startAngle, int spanAngle)
```

Следует учитывать, что значения углов задаются в значениях 1/16 градуса. Полный круг эквивалентен значению 16 * 360. Нулевой угол находится в позиции трех часов. Положительные значения углов отсчитываются против часовой стрелки, а отрицательные — по часовой стрелке;

> **drawChord()** — рисует замкнутую дугу. Метод `drawChord()` аналогичен методу `drawArc()`, но замыкает крайние точки дуги прямой линией. Прототипы метода:
```c++
void drawChord(int x, int y, int width, int height, int startAngle, int spanAngle)
void drawChord(const QRect &rectangle, int startAngle, int spanAngle)
void drawChord(const QRectF &rectangle, int startAngle, int spanAngle)
```

> **drawPie()** — рисует замкнутый сектор. Метод `drawPie()` аналогичен методу `drawArc()`, но замыкает крайние точки дуги с центром окружности. Прототипы метода:
```c++
void drawPie(int x, int y, int width, int height, int startAngle, int spanAngle)
void drawPie(const QRect &rectangle, int startAngle, int spanAngle)
void drawPie(const QRectF &rectangle, int startAngle, int spanAngle)
```

При выводе некоторых фигур (например, эллипса) контур может отображаться в виде «лесенки». Чтобы сгладить контуры фигур, следует вызвать метод `setRenderHint()` и передать ему константу `Antialiasing`. Прототип метода: 
```c++
void setRenderHint(QPainter::RenderHint hint, bool on = true)
```
Пример:
```c++
painter.setRenderHint(QPainter::Antialiasing);
```

## Вывод текста

Вывести текст позволяет метод `drawText()` из класса `QPainter`. Прототипы метода:
```c++
void drawText(int x, int y, const QString &text)
void drawText(const QPoint &position, const QString &text)
void drawText(const QPointF &position, const QString &text)
void drawText(int x, int y, int width, int height, int flags,
						const QString &text, QRect *boundingRect = nullptr)
void drawText(const QRect &rectangle, int flags, const QString &text,
						QRect *boundingRect = nullptr)
void drawText(const QRectF &rectangle, int flags, const QString &text,
						QRectF *boundingRect = nullptr)
void drawText(const QRectF &rectangle, const QString &text,
						const QTextOption &option = QTextOption())
```

Первые три формата метода выводят текст, начиная с указанных координат.

Следующие три формата выводят текст в указанную прямоугольную область. Если текст не помещается в прямоугольную область, то он будет обрезан, если не указан флаг `TextDontClip`. В параметре `flags` через оператор `|` указываются константы `AlignLeft`, `AlignRight`, `AlignHCenter`, `AlignTop`, `AlignBottom`, `AlignVCenter` или `AlignCenter`, задающие выравнивание текста внутри прямоугольной области, а также следующие константы:

> **Qt::TextDontClip** — текст может выйти за пределы указанной прямоугольной области;
>
> **Qt::TextSingleLine** — все специальные символы трактуются как пробелы, и текст выводится в одну строку;
>
> **Qt::TextWordWrap** — если текст не помещается на одной строке, то будет произведен перенос по границам слова;
>
> **Qt::TextShowMnemonic** — символ, перед которым указан символ `&`, будет подчеркнут. Чтобы вывести символ `&`, его необходимо удвоить;
>
>Qt::TextExpandTabs — символы табуляции будут обрабатываться.

Седьмой формат метода `drawText()` также выводит текст в указанную прямоугольную область, но выравнивание текста и другие опции задаются с помощью экземпляра класса `QTextOption`. Например, с помощью этого класса можно отобразить непечатаемые символы (символ пробела, табуляцию и др.). Получить координаты и размеры прямоугольника, в который вписывается текст, позволяет метод `boundingRect()`. Прототипы метода:

```c++
QRect boundingRect(int x, int y, int w, int h, int flags, const QString &text)
QRect boundingRect(const QRect &rectangle, int flags, const QString &text)
QRectF boundingRect(const QRectF &rectangle, int flags, const QString &text)
QRectF boundingRect(const QRectF &rectangle, const QString &text,
									const QTextOption &option = QTextOption())
```

При выводе текста линии букв могут отображаться в виде «лесенки». Чтобы сгладить контуры, следует вызвать метод `setRenderHint()` и передать ему константу `TextAntialiasing`. Пример:
```c++
painter.setRenderHint(QPainter::TextAntialiasing);
```

## Вывод изображения

Для вывода растровых изображений на рисунок предназначены методы `drawPixmap()` и `drawImage()` из класса `QPainter`. Метод `drawPixmap()` предназначен для вывода изображений, хранимых в экземпляре класса `QPixmap`. Прототипы метода `drawPixmap()`:
```c++
void drawPixmap(int x, int y, const QPixmap &pixmap)
void drawPixmap(const QPoint &point, const QPixmap &pixmap)
void drawPixmap(const QPointF &point, const QPixmap &pixmap)
void drawPixmap(int x, int y, int width, int height, const QPixmap &pixmap)
void drawPixmap(const QRect &rectangle, const QPixmap &pixmap)
void drawPixmap(int x, int y, const QPixmap &pixmap,
											int sx, int sy, int sw, int sh)
void drawPixmap(const QPoint &point, const QPixmap &pixmap,
											const QRect &source)
void drawPixmap(const QPointF &point, const QPixmap &pixmap,
											const QRectF &source)
void drawPixmap(int x, int y, int w, int h, const QPixmap &pixmap,
											int sx, int sy, int sw, int sh)
void drawPixmap(const QRect &target, const QPixmap &pixmap,
											const QRect &source)
void drawPixmap(const QRectF &target, const QPixmap &pixmap,
											const QRectF &source)
```

Первые три формата задают координаты, в которые будет установлен левый верхний угол изображения, и экземпляр класса `QPixmap`. Пример:
```c++
QPixmap pixmap("C:\\cpp\\projectsQt\\Test\\photo.jpg");
painter.drawPixmap(3, 3, pixmap);
```

Четвертый и пятый форматы позволяют ограничить вывод изображения указанной прямоугольной областью. Если размеры области не совпадают с размерами изображения, то производится масштабирование изображения. При несоответствии пропорций изображение может быть искажено.

Шестой, седьмой и восьмой форматы задают координаты, в которые будет установлен левый верхний угол фрагмента изображения. Координаты и размеры вставляемого фрагмента изображения указываются после экземпляра класса `QPixmap` в виде отдельных составляющих или экземпляров классов [[QRect|QRect]] или [[QRect#QRectF|QRectF]].

Последние три формата ограничивают вывод фрагмента изображения указанной прямоугольной областью. Координаты и размеры вставляемого фрагмента изображения указываются после экземпляра класса [[QPixmap|QPixmap]] в виде отдельных составляющих или экземпляров классов [[QRect#QRect|QRect]] или [[QRect#QRectF|QRectF]]. Если размеры области не совпадают с размерами фрагмента изображения, то производится масштабирование изображения. При несоответствии пропорций изображение может быть искажено. Метод `drawImage()` предназначен для вывода изображений, хранимых в экземпляре класса [[QImage|QImage]]. При выводе экземпляр класса [[QImage|QImage]] преобразуется в экземпляр класса [[QPixmap|QPixmap]]. Тип преобразования задается с помощью необязательного параметра `flags`. Прототипы метода `drawImage()`:
```c++
void drawImage(const QPoint &point, const QImage &image)
void drawImage(const QPointF &point, const QImage &image)
void drawImage(const QRect &rectangle, const QImage &image)
void drawImage(const QRectF &rectangle, const QImage &image)
void drawImage(int x, int y, const QImage &image,
						int sx = 0, int sy = 0, int sw = -1, int sh = -1,
						Qt::ImageConversionFlags flags = Qt::AutoColor)
void drawImage(const QPoint &point, const QImage &image,
						const QRect &source,
						Qt::ImageConversionFlags flags = Qt::AutoColor)
void drawImage(const QPointF &point, const QImage &image,
						const QRectF &source,
						Qt::ImageConversionFlags flags = Qt::AutoColor)
void drawImage(const QRect &target, const QImage &image,
						const QRect &source,
						Qt::ImageConversionFlags flags = Qt::AutoColor)
void drawImage(const QRectF &target, const QImage &image,
						const QRectF &source,
						Qt::ImageConversionFlags flags = Qt::AutoColor)
```

Первые два формата (а также пятый формат со значениями по умолчанию) задают координаты, в которые будет установлен левый верхний угол изображения, и экземпляр класса [[QImage|QImage]]. Пример:
```c++
QImage img("C:\\cpp\\projectsQt\\Test\\photo.jpg");
painter.drawImage(3, 3, img);
```

Третий и четвертый форматы позволяют ограничить вывод изображения указанной прямоугольной областью. Если размеры области не совпадают с размерами изображения, то производится масштабирование изображения. При несоответствии пропорций изображение может быть искажено.

Пятый, шестой и седьмой форматы задают координаты, в которые будет установлен левый верхний угол фрагмента изображения. Координаты и размеры вставляемого фрагмента изображения указываются после экземпляра класса [[QImage|QImage]] в виде отдельных составляющих или экземпляров классов [[QRect#QRect|QRect]] или [[QRect#QRectF|QRectF]].

Последние два формата ограничивают вывод фрагмента изображения указанной прямоугольной областью. Координаты и размеры вставляемого фрагмента изображения указываются после экземпляра класса [[QImage|QImage]] в виде экземпляров классов [[QRect#QRect|QRect]] или [[QRect#QRectF|QRectF]]. Если размеры области не совпадают с размерами фрагмента изображения, то производится масштабирование изображения. При несоответствии пропорций изображение может быть искажено.

## Преобразование систем координат

Существуют две системы координат: физическая (`viewport`; система координат устройства) и логическая (`window`). При рисовании координаты из логической системы координат преобразуются в систему координат устройства. По умолчанию эти две системы координат совпадают. В некоторых случаях возникает необходимость изменить координаты. Выполнить изменение физической системы координат позволяет метод `setViewport()`, а получить текущее значение можно с помощью метода `viewport()`. Прототипы методов:
```c++
void setViewport(int x, int y, int width, int height)
void setViewport(const QRect &rectangle)

QRect viewport() **const**
```
Выполнить изменение логической системы координат позволяет метод `setWindow()`, а получить текущее значение можно с помощью метода `window()`. Прототипы методов:
```C++
void setWindow(int x, int y, int width, int height)
void setWindow(const QRect &rectangle)

QRect window() const
```

Произвести дополнительную трансформацию системы координат позволяют следующие методы из класса `QPainter`:

> **translate()** — перемещает начало координат в указанную точку. По умолчанию начало координат находится в левом верхнем углу. Положительная ось `X` направлена вправо, а положительная ось `Y` — вниз. Прототипы метода:
```C++
void translate(qreal dx, qreal dy)
void translate(const QPoint &offset)
void translate(const QPointF &offset)
```

> **rotate()** — поворачивает систему координат на указанное количество градусов (указывается вещественное число). Положительное значение вызывает поворот по часовой стрелке, а отрицательное значение — против часовой стрелки. Прототип метода:
```C++
void rotate(qreal angle)
```

> **scale()** — масштабирует систему координат. В качестве значений указываются вещественные числа. Если значение меньше единицы, то выполняется уменьшение, а если больше единицы, то увеличение. Прототип метода:
```C++
void scale(qreal sx, qreal sy)
```

> **shear()** — сдвигает систему координат. Прототип метода:
```C++
void shear(qreal sh, qreal sv)
```

Все указанные трансформации влияют на последующие операции рисования и не изменяют ранее нарисованные фигуры. Чтобы после трансформации восстановить систему координат, следует предварительно сохранить состояние в стеке с помощью метода `save()`, а после окончания рисования вызвать метод `restore()`:
```c++
	painter.save(); // Сохраняем состояние
				
		// Трансформируем и рисуем

		painter.restore(); // Восстанавливаем состояние
```

## Сохранение команд рисования в файл

Класс [[QPicture|QPicture]] исполняет роль устройства для рисования с возможностью сохранения команд рисования в файл специального формата и последующего восстановления команд. Иерархия наследования:
```
QPaintDevice — QPicture
```

Форматы конструктора класса:
```c++
#include <QPicture>

QPicture(int formatVersion = -1)
QPicture(const QPicture &pic)
```

Первый конструктор создает пустой рисунок. Необязательный параметр `formatVersion` задает версию формата. Если параметр не указан, то используется формат, принятый в текущей версии Qt. Второй конструктор создает копию рисунка.

Для сохранения и загрузки рисунка предназначены следующие методы:
> **save()** — сохраняет рисунок в файл. Метод возвращает значение `true`, если рисунок успешно сохранен, и `false` — в противном случае. Прототипы метода:
```c++
bool save(const QString &fileName)
bool save(QIODevice *dev)
```

> **load()** — загружает рисунок из файла. Метод возвращает значение `true`, если рисунок успешно загружен, и `false` — в противном случае. Прототипы метода:
```c++
bool load(const QString &fileName)
bool load(QIODevice *dev)
```

Для вывода загруженного рисунка на устройство рисования предназначен метод `drawPicture()` из класса [[QPainter|QPainter]]. Прототипы метода:
```c++
void drawPicture(int x, int y, const QPicture &picture)
void drawPicture(const QPoint &point, const QPicture &picture)
void drawPicture(const QPointF &point, const QPicture &picture)
```

Пример сохранения рисунка:
```c++
QPainter painter;
QPicture pic;

painter.begin(&pic);
	// Здесь что-то рисуем
painter.end();

pic.save("C:\\cpp\\projectsQt\\Test\\pic.dat");
```

Пример вывода загруженного рисунка на поверхность компонента:
```c++
void Widget::paintEvent(QPaintEvent *e)
{
	QPainter painter(this);
	
	QPicture pic;
	pic.load("C:\\cpp\\projectsQt\\Test\\pic.dat");
	
	painter.drawPicture(0, 0, pic);
}
```

