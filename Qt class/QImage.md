# QImage

Класс `QImage` предназначен для работы с изображениями в контекстно-независимом представлении. Перед выводом на экран экземпляр класса `QImage` преобразуется в экземпляр класса [[QPixmap|QPixmap]]. Иерархия наследования:
```
QPaintDevice — QImage
```

Так как класс `QImage` наследует класс [[QPaintDevice|QPaintDevice]], мы можем использовать его как поверхность для рисования. Однако следует учитывать, что не на всех форматах изображения можно рисовать. Для рисования лучше использовать изображение формата `Format_ARGB32_Premultiplied`. Вывести изображение на рисунок позволяет метод `drawImage()` из класса [[QPainter|QPainter]].

Форматы конструктора класса:
```c++
#include <QImage>
QImage()
QImage(int width, int height, QImage::Format format)
QImage(const QSize &size, QImage::Format format)
QImage(const QString &fileName, const char *f = nullptr)
QImage(const char *const [] xpm)
QImage(uchar *data, int width, int height, qsizetype bytesPerLine,
							QImage::Format format,
							QImageCleanupFunction cleanupFunction = nullptr,
							void *cleanupInfo = nullptr)
QImage(const uchar *data, int width, int height, qsizetype bytesPerLine,
							QImage::Format format,
QImageCleanupFunction cleanupFunction = nullptr,
							void *cleanupInfo = nullptr)
QImage(const uchar *data, int width, int height, QImage::Format format,
							QImageCleanupFunction cleanupFunction = nullptr,
							void *cleanupInfo = nullptr)
QImage(uchar *data, int width, int height, QImage::Format format,
							QImageCleanupFunction cleanupFunction = nullptr,
							void *cleanupInfo = nullptr)
QImage(const QImage &image)
QImage(QImage &&other)
```

Первый конструктор создает нулевой объект изображения. Второй и третий конструкторы позволяют указать размеры изображения. Если размеры равны нулю, то будет создан нулевой объект изображения. Четвертый конструктор предназначен для загрузки изображения из файла. Во втором параметре указывается тип изображения в виде строки. Если второй параметр не указан, то формат определяется автоматически.

В параметре `format` можно указать следующие константы:
> **QImage::Format_Invalid** — формат не определен;
> **QImage::Format_Mono** — глубина цвета 1 бит;
> **QImage::Format_MonoLSB** — глубина цвета 1 бит;
> **QImage::Format_Indexed8** — глубина цвета 8 бит;
> **QImage::Format_RGB32** — RGB без альфа-канала, глубина цвета 32 бита;
> **QImage::Format_ARGB32** — RGB с альфа-каналом, глубина цвета 32 бита;
> **QImage::Format_ARGB32_Premultiplied** — RGB с альфа-каналом, глубина цвета > 32 бита. Этот формат лучше использовать для рисования;
> **QImage::Format_RGB16**;
> **QImage::Format_ARGB8565_Premultiplied**;
> **QImage::Format_RGB666**;
> **QImage::Format_ARGB6666_Premultiplied**;
> **QImage::Format_RGB555**;
> **QImage::Format_ARGB8555_Premultiplied**;
> **QImage::Format_RGB888**;
> **QImage::Format_RGB444**;
> **QImage::Format_ARGB4444_Premultiplied**;
> **QImage::Format_RGBX8888**;
> **QImage::Format_RGBA8888**;
> **QImage::Format_RGBA8888_Premultiplied**;
> **QImage::Format_BGR30**;
> **QImage::Format_A2BGR30_Premultiplied**;
> **QImage::Format_RGB30**;
> **QImage::Format_A2RGB30_Premultiplied**;
> **QImage::Format_Alpha8**;
> **QImage::Format_Grayscale8**;
> **QImage::Format_Grayscale16**;
> **QImage::Format_RGBX64**;
> **QImage::Format_RGBA64**;
> **QImage::Format_RGBA64_Premultiplied**;
> **QImage::Format_BGR888**.

Класс `QImage` содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **isNull()** — возвращает значение `true`, если объект является нулевым, и `false` — в противном случае. Прототип метода:
```c++
bool isNull() const
```

> **load()** — загружает изображение из файла. В параметре `fileName` задается абсолютный или относительный путь к файлу. В параметре `format` указывается тип изображения. Если параметр не указан, то тип определяется автоматически. Метод возвращает значение `true`, если изображение успешно загружено, и `false` — в противном случае. Прототип метода:
```c++
bool load(const QString &fileName, const char *format = nullptr)
bool load(QIODevice *device, const char *format)
```

> **loadFromData()** — загружает изображение из массива или экземпляра класса [[QByteArray|QByteArray]]. Метод возвращает значение `true,` если изображение успешно загружено, и `false` — в противном случае. Прототипы метода:
```c++
bool loadFromData(const uchar *data, int len, const char *format = nullptr)
bool loadFromData(const QByteArray &data, const char *format = nullptr)
```

> **fromData()** — загружает изображение из массива или экземпляра класса [[QByteArray|QByteArray]] и возвращает экземпляр класса `QImage`. Метод является статическим. Прототипы метода:
```c++
static QImage fromData(const uchar *data, int size,
										const char *format = nullptr)
static QImage fromData(const QByteArray &data,
										const char *format = nullptr)
```

> **save()** — сохраняет изображение в файл. В параметре `fileName` указывается абсолютный или относительный путь к файлу. Во втором параметре можно задать тип изображения в виде строки. Если параметр не указан, то тип определяется автоматически по расширению файла. Необязательный параметр `quality` позволяет задать качество изображения. Можно передать значение в диапазоне от 0 до 100. Метод возвращает значение `true`, если изображение успешно сохранено, и `false` — в противном случае. Прототипы метода:
```c++
bool save(const QString &fileName, const char *format = nullptr,
											int quality = -1) const
bool save(QIODevice *device, const char *format = nullptr,
											int quality = -1) const
```

> **fill()** — производит заливку изображения определенным цветом. Прототипы метода:
```c++
void fill(const QColor &color)
void fill(Qt::GlobalColor color)
void fill(uint pixelValue)
```

> **width()** — возвращает ширину изображения. Прототип метода:
```c++
int width() const
```

> **height()** — возвращает высоту изображения. Прототип метода:
```c++
int height() const
```

> **size()** — возвращает экземпляр класса [[QSize|QSize]] с размерами изображения. Прототип метода:
```c++
QSize size() const
```

> **rect()** — возвращает экземпляр класса [[QRect|QRect]] с координатами и размерами и прямоугольной области, ограничивающей изображение. Прототип метода:
```c++
QRect rect() const
```

> **depth()** — возвращает глубину цвета. Прототип метода:
```c++
int depth() const
```

> **format()** — возвращает формат изображения (см. значения параметра `format` в конструкторе класса `QImage`). Прототип метода:
```c++
QImage::Format format() const
```

> **setPixel()** — задает цвет указанного пиксела. В параметре `index_or_rgb` для 8-битных изображений задается индекс цвета в палитре, а для 32-битных — целочисленное значение цвета. Прототипы метода:
```c++
void setPixel(int x, int y, uint index_or_rgb)
void setPixel(const QPoint &position, uint index_or_rgb)
```

> **setPixelColor()** — задает цвет указанного пиксела. Прототипы метода:
```c++
void setPixelColor(int x, int y, const QColor &color)
void setPixelColor(const QPoint &position, const QColor &color)
```

> **pixel()** — возвращает целочисленное значение цвета указанного пиксела. Прототипы метода:
```c++
QRgb pixel(int x, int y) const
QRgb pixel(const QPoint &position) const
```

> **pixelColor()** — возвращает цвет указанного пиксела. Прототипы метода:
```c++
QColor pixelColor(int x, int y) const
QColor pixelColor(const QPoint &position) const
```

> **convertToFormat()** — преобразует формат изображения (см. значения параметра `format` в конструкторе класса `QImage`) и возвращает экземпляр класса `QImage`. Прототипы метода:
```c++
QImage convertToFormat(QImage::Format format,
				Qt::ImageConversionFlags flags = Qt::AutoColor) const &
QImage convertToFormat(QImage::Format format,
				Qt::ImageConversionFlags flags = Qt::AutoColor) &&
QImage convertToFormat(QImage::Format format,
				const QList<QRgb> &colorTable,
Qt::ImageConversionFlags flags = Qt::AutoColor) const
```

> **copy()** — возвращает экземпляр класса `QImage` с фрагментом изображения. Если параметр `rect` не указан, то изображение копируется полностью. Прототипы метода:
```c++
QImage copy(const QRect &rect = QRect()) const
QImage copy(int x, int y, int width, int height) const
```

> **scaled()** — изменяет размер изображения и возвращает экземпляр класса QImage. Исходное изображение не изменяется. Прототипы метода:
```c++
QImage scaled(int width, int height,
					Qt::AspectRatioMode am = Qt::IgnoreAspectRatio,
					Qt::TransformationMode tm = Qt::FastTransformation) const
QImage scaled(const QSize &size,
					Qt::AspectRatioMode am = Qt::IgnoreAspectRatio,
					Qt::TransformationMode tm = Qt::FastTransformation) const
```

В необязательном параметре `am` могут быть указаны следующие константы:
* **Qt::IgnoreAspectRatio** — непосредственно изменяет размеры без сохранения пропорций сторон;
* **Qt::KeepAspectRatio** — производится попытка масштабирования старой области внутри новой области без нарушения пропорций;
* **Qt::KeepAspectRatioByExpanding** — производится попытка полностью заполнить новую область без нарушения пропорций старой области.

В необязательном параметре `tm` могут быть указаны следующие константы:
* **Qt::FastTransformation** — сглаживание выключено;
* **Qt::SmoothTransformation** — сглаживание включено;

> **scaledToWidth()** — изменяет ширину изображения и возвращает экземпляр класса `QImage`. Высота изображения изменяется пропорционально. Исходное изображение не изменяется. Параметр `mode` аналогичен параметру `tm` в методе `scaled()`. Прототип метода:
```c++
QImage scaledToWidth(int width,
				Qt::TransformationMode mode = Qt::FastTransformation) const
```

> **scaledToHeight()** — изменяет высоту изображения и возвращает экземпляр класса `QImage`. Ширина изображения изменяется пропорционально. Исходное изображение не изменяется. Параметр `mode` аналогичен параметру `tm` в методе `scaled()`. Прототип метода:
```c++
QImage scaledToHeight(int height,
				Qt::TransformationMode mode = Qt::FastTransformation) const
```

> **transformed()** — производит трансформацию изображения (например, поворот) и возвращает экземпляр класса `QImage`. Исходное изображение не изменяется. Прототип метода:
```c++
QImage transformed(const QTransform &matrix,
				Qt::TransformationMode mode = Qt::FastTransformation) const
```

> **invertPixels()** — инвертирует значения всех пикселов в изображении. В необязательном параметре `mode` могут быть указаны константы `QImage::InvertRgb` или `QImage::InvertRgba`. Прототип метода:
```c++
void invertPixels(QImage::InvertMode mode = InvertRgb)
```

> **mirrored()** — создает зеркальный образ изображения. Прототипы метода:
```c++
QImage mirrored(bool horizontal = false, bool vertical = true) const &
QImage mirrored(bool horizontal = false, bool vertical = true) &&
```
