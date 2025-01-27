# QFont

Класс `QFont` описывает характеристики шрифта. Форматы конструктора класса:
```c++
#include <QFont>

QFont()
QFont(const QStringList &families, int pointSize = -1, int weight = -1,
													bool italic = false)
QFont(const QFont &font)
QFont(const QFont &font, const QPaintDevice *pd)
```

Первый конструктор создает объект шрифта с настройками, используемыми приложением по умолчанию. Установить шрифт приложения по умолчанию позволяет статический метод `setFont()` из класса [[QApplication|QApplication]]. Прототип метода:
```c++
static void setFont(const QFont &font, const char *className = nullptr)
```

Получить значение позволяет статический метод `font()` из класса [[QApplication|QApplication]]:
```c++
static QFont font()
static QFont font(const QWidget *widget)
static QFont font(const char *className)
```

Второй конструктор позволяет указать основные характеристики шрифта. В первом параметре указывается название шрифта или семейства в виде строки. Необязательный параметр `pointSize` задает размер шрифта. В параметре `weight` можно указать степень жирности шрифта: значение констант `QFont::Light`, `QFont::Normal`, `QFont::DemiBold`, `QFont::Bold` или `QFont::Black`. Если в параметре `italic` указано значение `true`, то шрифт будет курсивным.

Класс `QFont` содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **setFamily()** — задает название шрифта или семейства. Прототип метода:
```c++
void setFamily(const QString &family)
```

> **family()** — возвращает название шрифта. Прототип метода:
```c++
QString family() const
```

> **setPointSize()** и **setPointSizeF()** — задают размер шрифта в пунктах. Прототипы методов:
```c++
void setPointSize(int pointSize)
void setPointSizeF(qreal pointSize)
```

> **pointSize()** — возвращает размер шрифта в пунктах в виде целого числа или значение –1, если размер шрифта был установлен в пикселах. Прототип метода:
```c++
int pointSize() const
```

> **pointSizeF()** — возвращает размер шрифта в пунктах в виде вещественного числа или значение –1, если размер шрифта был установлен в пикселах. Прототип метода:
```c++
qreal pointSizeF() const
```

> **setPixelSize()** — задает размер шрифта в пикселах. Прототип метода:
```c++
void setPixelSize(int pixelSize)
```

> **pixelSize()** — возвращает размер шрифта в пикселах или значение –1, если размер шрифта был установлен в пунктах. Прототип метода:
```c++
int pixelSize() const
```

> **setWeight()** — задает степень жирности шрифта: значение констант `QFont::Light`, `QFont::Normal`, `QFont::DemiBold`, `QFont::Bold` или `QFont::Black`. Прототип метода:
```c++
void setWeight(QFont::Weight weight)
```

> **weight()** — возвращает степень жирности шрифта. Прототип метода:
```c++
QFont::Weight weight() const
```

> **setBold()** — если в качестве параметра указано значение `true`, то жирность шрифта устанавливается равной значению константы `Bold`, а если `false`, то равной значению константы `Normal`. Прототип метода:
```c++
void setBold(bool enable)
```

> **bold()** — возвращает значение `true`, если степень жирности шрифта больше значения константы `Normal`, и `false` — в противном случае. Прототип метода:
```c++
bool bold() const
```

> **setItalic()** — если в качестве параметра указано значение `true`, то шрифт будет курсивным, а если `false`, то нормальным. Прототип метода:
```c++
void setItalic(bool enable)
```

> **italic()** — возвращает значение `true`, если шрифт курсивный, и `false` — в противном случае. Прототип метода:
```c++
bool italic() const
```

> **setUnderline()** — если в качестве параметра указано значение `true`, то текст будет подчеркнутым, а если `false`, то не подчеркнутым. Прототип метода:
```c++
void setUnderline(bool enable)
```

> **underline()** — возвращает значение `true`, если текст будет подчеркнут, и `false` — в противном случае. Прототип метода:
```c++
bool underline() const
```

> **setOverline()** — если в качестве параметра указано значение `true`, то над текстом будет выводиться черта. Прототип метода:
```c++
void setOverline(bool enable)
```

> **overline()** — возвращает значение `true`, если над текстом будет выводиться черта, и `false` — в противном случае. Прототип метода:
```c++
bool overline() const
```

> **setStrikeOut()** — если в качестве параметра указано значение `true`, то текст будет перечеркнутым. Прототип метода:
```c++
void setStrikeOut(bool enable)
```

> **strikeOut()** — возвращает значение `true`, если текст будет перечеркнутым, и `false` — в противном случае. Прототип метода:
```c++
bool strikeOut() const
```

Получить список всех доступных в системе шрифтов позволяет статический метод `families()` из класса [[QFontDatabase|QFontDatabase]]. Метод возвращает список строк. Прототип метода:
```c++
static QStringList families(QFontDatabase::WritingSystem writingSystem = Any)
```

Пример:
```c++
// #include <QFontDatabase>
qDebug() << QFontDatabase::families();
```

Чтобы получить список доступных стилей для указанного шрифта, следует воспользоваться статическим методом `styles()` из класса [[QFontDatabase|QFontDatabase]]. Прототип метода:
```c++
static QStringList styles(const QString &family)
```

Пример:
```c++
qDebug() << QFontDatabase::styles("Tahoma");
// QList("Обычный", "Полужирный")
```

Получить допустимые размеры для указанного стиля можно с помощью статического метода метода `smoothSizes()` из класса [[QFontDatabase|QFontDatabase]]. Прототип метода:
```c++
static QList<int> smoothSizes(const QString &family, const QString &styleName)
```

Пример:
```c++
qDebug() << QFontDatabase::smoothSizes("Tahoma", "Обычный");
// QList(6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26,
// 28, 36, 48, 72)
```

Очень часто необходимо произвести выравнивание выводимого текста внутри некоторой области. Чтобы это сделать, нужно знать размеры области, в которую вписан текст. Получить эти значения позволяют следующие методы из класса [[QFontMetrics|QFontMetrics]]:
> **height()** — возвращает высоту шрифта. Прототип метода:
```c++
int height() const
```

> **boundingRect()** — возвращает экземпляр класса [[QRect|QRect]] с координатами и размерами прямоугольной области, в которую вписан текст. Прототипы метода:
```c++
QRect boundingRect(QChar ch) const
QRect boundingRect(const QString &text) const
QRect boundingRect(const QRect &rect, int flags,
					const QString &text, int tabStops = 0,
					int *tabArray = nullptr) const
QRect boundingRect(int x, int y, int width, int height,
					int flags, const QString &text, int tabStops = 0,
					int *tabArray = nullptr) const
```

Пример получения размеров области:
```c++
QFont font("Tahoma", 16);
QFontMetrics fm(font);
qDebug() << fm.height(); // 25
qDebug() << fm.boundingRect("Строка"); // QRect(0,-21 65x25)
```


