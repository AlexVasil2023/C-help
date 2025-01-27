# QPixmap

Класс `QPixmap` предназначен для работы с изображениями в контекстно-зависимом представлении. Данные хранятся в виде, позволяющем отображать изображение на экране наиболее эффективным способом, поэтому класс часто используется в качестве буфера для рисования перед выводом на экран. Иерархия наследования:
```
QPaintDevice — QPixmap
```

Так как класс `QPixmap` наследует класс [[QPaintDevice|QPaintDevice]], мы можем использовать его как поверхность для рисования. Вывести изображение на рисунок позволяет метод `drawPixmap()` из класса [[QPainter|QPainter]]

Форматы конструктора класса:
```c++
#include <QPixmap>

QPixmap()
QPixmap(int width, int height)
QPixmap(const QSize &size)
QPixmap(const QString &fileName, const char *format = nullptr,
								Qt::ImageConversionFlags flags = Qt::AutoColor)
QPixmap(const QPixmap &pixmap)
QPixmap(QPixmap &&other)
QPixmap(const char *const [] xpm)
```

Первый конструктор создает нулевой объект изображения. Второй и третий конструкторы позволяют указать размеры изображения. Если размеры равны нулю, то будет создан нулевой объект изображения. Четвертый конструктор предназначен для загрузки изображения из файла, а пятый конструктор создает копию изображения.

Класс `QPixmap` содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **isNull()** — возвращает значение `true`, если объект является нулевым, и `false` — в противном случае. Прототип метода:
```c++
bool isNull() const
```

> **load()** — загружает изображение из файла. В первом параметре указывается абсолютный или относительный путь к файлу. Во втором параметре можно указать тип изображения. Если параметр не указан, то тип определяется автоматически. Необязательный параметр `flags` задает тип преобразования. Метод возвращает значение `true`, если изображение успешно загружено, и `false` — в противном случае. Прототип метода:
```c++
bool load(const QString &fileName, const char *format = nullptr,
								Qt::ImageConversionFlags flags = Qt::AutoColor)
```

> **loadFromData()** — загружает изображение из массива или экземпляра класса [[QByteArray|QByteArray]]. Метод возвращает значение `true`, если изображение успешно загружено, и `false` — в противном случае. Прототипы метода:
```c++
bool loadFromData(const uchar *data, uint len, const char *format = nullptr,
								Qt::ImageConversionFlags flags = Qt::AutoColor)

bool loadFromData(const QByteArray &data, const char *format = nullptr,
								Qt::ImageConversionFlags flags = Qt::AutoColor)
```

> **save()** — сохраняет изображение в файл. В параметре `fileName` указывается абсолютный или относительный путь к файлу. В параметре `format` можно задать тип изображения в виде строки. Если параметр не указан, то тип определяется автоматически по расширению файла. Необязательный параметр `quality` позволяет задать качество изображения. Можно передать значение в диапазоне от 0 до 100. Метод возвращает значение `true`, если изображение успешно сохранено, и `false` — в противном случае. Прототипы метода:
```c++
bool save(const QString &fileName, const char *format = nullptr,
													int quality = -1) const
bool save(QIODevice *device, const char *format = nullptr,
													int quality = -1) const
```

> **convertFromImage()** — преобразует экземпляр класса [[QImage|QImage]] в экземпляр класса `QPixmap`. Метод возвращает значение `true`, если изображение успешно преобразовано, и `false` — в противном случае. Прототип метода:
```c++
bool convertFromImage(const QImage &image,
							Qt::ImageConversionFlags flags = Qt::AutoColor)
```

> **fromImage()** — преобразует экземпляр класса [[QImage|QImage]] в экземпляр класса `QPixmap` и возвращает его. Метод является статическим. Прототипы метода:
```c++
static QPixmap fromImage(const QImage &image,
							Qt::ImageConversionFlags flags = Qt::AutoColor)
static QPixmap fromImage(QImage &&image,
							Qt::ImageConversionFlags flags = Qt::AutoColor)
```

> **toImage()** — преобразует экземпляр класса `QPixmap` в экземпляр класса [[QImage|QImage]] и возвращает его. Прототип метода:
```c++
QImage toImage() const
```

> **fill()** — производит заливку изображения указанным цветом. Прототип метода:
```c++
void fill(const QColor &color = Qt::white)
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

> **isQBitmap()** — возвращает значение `true`, если глубина цвета равна одному биту, и `false` — в противном случае. Прототип метода:
```c++
bool isQBitmap() const
```

> **setMask()** — устанавливает маску. Прототип метода:
```c++
void setMask(const QBitmap &mask)
```

> **mask()** — возвращает экземпляр класса [[QBitmap|QBitmap]] с маской изображения. Прототип метода:
```c++
QBitmap mask() const
```

> **copy()** — возвращает экземпляр класса [[QPixmap|QPixmap]] с фрагментом изображения. Если параметр `rect` не указан, то изображение копируется полностью. Прототипы метода:
```c++
QPixmap copy(int x, int y, int width, int height) const
QPixmap copy(const QRect &rect = QRect()) const
```

> **scaled()** — изменяет размер изображения и возвращает экземпляр класса `QPixmap`.  Исходное изображение не изменяется. Прототипы метода:
```c++
QPixmap scaled(int width, int height,
					Qt::AspectRatioMode am = Qt::IgnoreAspectRatio,
					Qt::TransformationMode tm = Qt::FastTransformation) const

QPixmap scaled(const QSize &size,
					Qt::AspectRatioMode am = Qt::IgnoreAspectRatio,
					Qt::TransformationMode tm = Qt::FastTransformation) const
```

В необязательном параметре `am` могут быть указаны следующие константы:
> **Qt::IgnoreAspectRatio** — непосредственно изменяет размеры без сохранения пропорций сторон;
>
> **Qt::KeepAspectRatio** — производится попытка масштабирования старой области внутри новой области без нарушения пропорций;
>
> **Qt::KeepAspectRatioByExpanding** — производится попытка полностью заполнить новую область без нарушения пропорций старой области.

В необязательном параметре `tm` могут быть указаны следующие константы:
> **Qt::FastTransformation** — сглаживание выключено;
> **Qt::SmoothTransformation** — сглаживание включено;

> **scaledToWidth()** — изменяет ширину изображения и возвращает экземпляр класса `QPixmap`. Высота изображения изменяется пропорционально. Исходное изображение не изменяется. Параметр `mode` аналогичен параметру `tm` в методе `scaled()`. Прототип метода:
```c++
QPixmap scaledToWidth(int width,
				Qt::TransformationMode mode = Qt::FastTransformation) const
```

> **scaledToHeight()** — изменяет высоту изображения и возвращает экземпляр класса `QPixmap`. Ширина изображения изменяется пропорционально. Исходное изображение не изменяется. Параметр `mode` аналогичен параметру `tm` в методе `scaled()`. Прототип метода:
```c++
QPixmap scaledToHeight(int height,
				Qt::TransformationMode mode = Qt::FastTransformation) const
```

> **transformed()** — производит трансформацию изображения (например, поворот) и возвращает экземпляр класса `QPixmap`. Исходное изображение не изменяется. Трансформация задается с помощью экземпляра класса [[QTransform|QTransform]]. Параметр `mode` аналогичен параметру `tm` в методе `scaled()`. Прототип метода:
```c++
QPixmap transformed(const QTransform &transform,
					Qt::TransformationMode mode = Qt::FastTransformation) const
```







