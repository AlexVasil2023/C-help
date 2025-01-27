# Класс QColor: цвет

Класс `QColor` описывает цвет в цветовых моделях `RGB`, `CMYK`, `HSV` или `HSL`. Форматы конструктора класса `QColor`:
```c++
#include <QColor>

QColor()
QColor(int r, int g, int b, int a = 255)
QColor(const char *name)
QColor(const QString &name)
QColor(QLatin1String name)
QColor(Qt::GlobalColor color)
QColor(QRgba64 rgba64)
QColor(QRgb color)
```

Первый конструктор создает невалидный объект. Проверить объект на валидность можно с помощью метода `isValid()`. Метод возвращает значение `true`, если объект является валидным, и `false` — в противном случае. Прототип метода:
```c++
bool isValid() const
```

Второй конструктор позволяет указать целочисленные значения красной, зеленой и синей составляющих цвета модели `RGB`. В качестве значений указываются числа от 0 до 255. Необязательный параметр `a` задает степень прозрачности цвета. Значение 0 соответствует прозрачному цвету, а значение 255 — полностью непрозрачному. Пример указания красного цвета:
```c++
QColor red(255, 0, 0);
```

В третьем, четвертом и пятом конструкторах указывается название цвета (`transparent` для прозрачного цвета). Пример указания белого цвета:
```c++
QColor white("white");
```

Можно также передать значение в следующих форматах: `"#RGB"`, `"#RRGGBB"`, `"#RRRGGGBBB"`, `"#RRRRGGGGBBBB"`. Пример (выводится предупреждающее сообщение о том, что лучше в этом случае использовать второй конструктор):
```c++
QColor white("#ffffff");
```

Получить список всех поддерживаемых названий цветов позволяет статический метод `colorNames()`. Проверить правильность строки с названием цвета можно с помощью статического метода `isValidColor()`. Метод возвращает значение `true`, если строка является допустимой, и `false` — в противном случае. Прототипы методов:
```c++
static QStringList colorNames()
static bool isValidColor(const QString &name)
static bool isValidColor(QStringView name)
static bool isValidColor(QLatin1String name)
```

Пример:
```c++
qDebug() << QColor::colorNames();
// QList("aliceblue", "antiquewhite" ...)
qDebug() << QColor::isValidColor("lightcyan"); // true
```

В шестом конструкторе указываются следующие константы: `white`, `black`, `red`, `darkRed`, `green`, `darkGreen`, `blue`, `darkBlue`, `cyan`, `darkCyan`, `magenta`, `darkMagenta`, `yellow`, `darkYellow`, `gray`, `darkGray`, `lightGray`, `color0`, `color1` или `transparent` (прозрачный цвет). Константы `color0` (прозрачный цвет) и `color1` (непрозрачный цвет) используются в двухцветных изображениях. Пример:
```c++
QColor white(Qt::white);
```

Задать или получить значения в цветовой модели `RGB` (red, green, blue; красный, зеленый, синий) позволяют следующие методы:

> **setNamedColor()** — задает название цвета в виде строки в форматах `"#RGB"`, `"#RRGGBB"`, `"#RRRGGGBBB"`, `"#RRRRGGGGBBBB"`, "Название цвета" или "transparent" (для прозрачного цвета). Прототип метода:
```c++
void setNamedColor(const QString &name)
void setNamedColor(QStringView name)
void setNamedColor(QLatin1String name)
```

> **name()** — возвращает строковое представление цвета. Прототип метода:
```c++
QString name(QColor::NameFormat format = HexRgb) const
```

Пример:
```c++
QColor white("white");
qDebug() << white.name(); // "#ffffff"
```

> **setRgb()** — задает целочисленные значения красной, зеленой и синей составляющих цвета модели `RGB`. В качестве параметров указываются числа от 0 до 255. Необязательный параметр `a` задает степень прозрачности цвета. Значение 0 соответствует прозрачному цвету, а значение 255 — полностью непрозрачному. Прототипы метода:
```c++
void setRgb(int r, int g, int b, int a = 255)
void setRgb(QRgb rgb)
```

> **setRgbF()** — задает целочисленные значения красной, зеленой и синей составляющих цвета модели `RGB`. В качестве параметров указываются вещественные числа от 0.0 до 1.0. Необязательный параметр `a` задает степень прозрачности цвета. Значение 0.0 соответствует прозрачному цвету, а значение 1.0 — полностью непрозрачному. Прототип метода:
```c++
void setRgbF(float r, float g, float b, float a = 1.0)
```

> **setRed()**, **setGreen()**, **setBlue()** и **setAlpha()** — задают значения отдельных составляющих цвета. В качестве параметров указываются числа от 0 до 255. Прототипы методов:
```c++
void setRed(int red)
void setGreen(int green)
void setBlue(int blue)
void setAlpha(int alpha)
```

> **setRedF()**, **setGreenF()**, **setBlueF()** и **setAlphaF()** — задают значения отдельных составляющих цвета. В качестве параметров указываются вещественные числа от 0.0 до 1.0. Прототипы методов:
```c++
void setRedF(float red)
void setGreenF(float green)
void setBlueF(float blue)
void setAlphaF(float alpha)
```

> **fromRgb()** — возвращает экземпляр класса `QColor` с указанными значениями. В качестве параметров указываются числа от 0 до 255. Метод является статическим. Прототипы метода:
```c++
static QColor fromRgb(int r, int g, int b, int a = 255)
static QColor fromRgb(QRgb rgb)
```

Пример:
```c++
QColor white = QColor::fromRgb(255, 255, 255, 255);
```

> **fromRgbF()** — возвращает экземпляр класса `QColor` с указанными значениями. В качестве параметров указываются вещественные числа от 0.0 до 1.0. Метод является статическим. Прототип метода:
```c++
static QColor fromRgbF(float r, float g, float b, float a = 1.0)
```

> **getRgb()** — позволяет получить целочисленные значения составляющих цвета. Прототип метода:
```c++
void getRgb(int *r, int *g, int *b, int *a = nullptr) const
```

> **getRgbF()** — позволяет получить вещественные значения составляющих цвета. Прототип метода:
```c++
void getRgbF(float *r, float *g, float *b, float *a = nullptr) const
```

> **red()**, **green()**, **blue()** и **alpha()** — возвращают целочисленные значения отдельных составляющих цвета. Прототипы методов:
```c++
int red() const
int green() const
int blue() const
int alpha() const
```

> **redF()**, **greenF()**, **blueF()** и **alphaF()** — возвращают вещественные значения отдельных составляющих цвета. Прототипы методов:
```c++
float redF() const
float greenF() const
float blueF() const
float alphaF() const
```

> **lighter()** — если параметр имеет значение больше 100, то возвращает новый объект с более светлым цветом, а если меньше 100, то с более темным. Прототип метода:
```c++
QColor lighter(int factor = 150) const
```

> **darker()** — если параметр имеет значение больше 100, то возвращает новый объект с более темным цветом, а если меньше 100, то с более светлым. Прототип метода:
```c++
QColor darker(int factor = 200) const
```

Задать или получить значения в цветовой модели `CMYK` (cyan, magenta, yellow, key; голубой, пурпурный, желтый, «ключевой» (черный)) позволяют следующие методы:
> **etCmyk()** — задает целочисленные значения составляющих цвета модели `CMYK`. В качестве параметров указываются числа от 0 до 255. Необязательный параметр a задает степень прозрачности цвета. Значение 0 соответствует прозрачному цвету, а значение 255 — полностью непрозрачному. Прототип метода:
```c++
void setCmyk(int c, int m, int y, int k, int a = 255)
```

> **fromCmyk()** — возвращает экземпляр класса `QColor` с указанными значениями. В качестве параметров задаются числа от 0 до 255. Метод является статическим. Прототип метода:
```c++
static QColor fromCmyk(int c, int m, int y, int k, int a = 255)
```

Пример:
```c++
QColor white = QColor::fromCmyk(0, 0, 0, 0, 255);
```

> **getCmyk()** — позволяет получить значения отдельных составляющих цвета. Прототип метода:
```c++
void getCmyk(int *c, int *m, int *y, int *k, int *a = nullptr) const
```

> **cyan()**, **magenta()**, **yellow()**, **black()** и **alpha()** — возвращают целочисленные значения отдельных составляющих цвета. Прототипы методов:
```c++
int cyan() const
int magenta() const
int yellow() const
int black() const
int alpha() const
```

> **setCmykF()** — задает значения составляющих цвета модели `CMYK`. В качестве параметров указываются вещественные числа от 0.0 до 1.0. Необязательный параметр `a` задает степень прозрачности цвета. Значение 0.0 соответствует прозрачному цвету, а значение 1.0 — полностью непрозрачному. Прототип метода:
```c++
void setCmykF(float c, float m, float y, float k, float a = 1.0)
```

> **fromCmykF()** — возвращает экземпляр класса `QColor` с указанными значениями. В качестве параметров задаются вещественные числа от 0.0 до 1.0. Метод является статическим. Прототип метода:
```c++
static QColor fromCmykF(float c, float m, float y, float k, float a = 1.0)
```

> **getCmykF()** — позволяет получить значения отдельных составляющих цвета. Прототип метода:
```c++
void getCmykF(float *c, float *m, float *y, float *k, float *a = nullptr) const
```

> **cyanF()**, **magentaF()**, **yellowF()**, **blackF()** и **alphaF()** — возвращают вещественные значения отдельных составляющих цвета. Прототипы методов:
```c++
float cyanF() const
float magentaF() const
float yellowF() const
float blackF() const
float alphaF() const
```

Задать или получить значения в цветовой модели `HSV` (**hue**, **saturation**, **value**; оттенок, насыщенность, значение (яркость)) позволяют следующие методы:

> **setHsv()** — задает целочисленные значения составляющих цвета модели `HSV`. В первом параметре указывается число от 0 до 359, а в остальных параметрах — числа от 0 до 255. Прототип метода:
```c++
void setHsv(int h, int s, int v, int a = 255)
```

> **fromHsv()** — возвращает экземпляр класса `QColor` с указанными значениями. Метод является статическим. Прототип метода:
```c++
static QColor fromHsv(int h, int s, int v, int a = 255)
```

Пример:
```c++
QColor white = QColor::fromHsv(0, 0, 255, 255);
```

> **getHsv()** — позволяет получить значения отдельных составляющих цвета. Прототип метода:
```c++
void getHsv(int *h, int *s, int *v, int *a = nullptr) const
```

> **hsvHue()**, **hsvSaturation()**, **value()** и **alpha()** — возвращают целочисленные значения отдельных составляющих цвета. Прототипы методов:
```c++
int hsvHue() const
int hsvSaturation() const
int value() const
int alpha() const
```

> **setHsvF()** — задает значения составляющих цвета модели `HSV`. В качестве параметров указываются вещественные числа от 0.0 до 1.0. Прототип метода:
```c++
void setHsvF(float h, float s, float v, float a = 1.0)
```

> **fromHsvF()** — возвращает экземпляр класса `QColor` с указанными значениями. В качестве параметров задаются вещественные числа от 0.0 до 1.0. Метод является статическим. Прототип метода:
```c++
static QColor fromHsvF(float h, float s, float v, float a = 1.0)
```

> **getHsvF()** — позволяет получить значения отдельных составляющих цвета. Прототип метода:
```c++
void getHsvF(float *h, float *s, float *v, float *a = nullptr) const
```

> **hsvHueF()**, **hsvSaturationF()**, **valueF()** и **alphaF()** — возвращают вещественные значения отдельных составляющих цвета. Прототипы методов:
```c++
float hsvHueF() const
float hsvSaturationF() const
float valueF() const
float alphaF() const
```

Цветовая модель `HSL` (hue, saturation, lightness) отличается от модели `HSV` только последней составляющей. Описание этой модели и полный перечень методов для установки и получения значений смотрите в документации.

Для получения типа используемой модели и преобразования между моделями предназначены следующие методы:
> **spec()** — позволяет узнать тип используемой модели. Возвращает значение одной из следующих констант: Invalid (0), Rgb (1), ExtendedRgb (5), Hsv (2), Cmyk (3) или Hsl (4). Прототип метода:
```c++
QColor::Spec spec() const
```

> **convertTo()** — преобразует тип модели. В качестве параметра указываются константы, которые перечислены в описании метода `spec()`. Метод возвращает новый объект. Прототип метода:
```c++
QColor convertTo(QColor::Spec colorSpec) const
```

Пример преобразования:
```c++
QColor whiteHSV = QColor::fromHsv(0, 0, 255);
QColor whiteRGB = whiteHSV.convertTo(QColor::Rgb);
```

Вместо метода `convertTo()` удобнее воспользоваться методами `toRgb()`, `toExtendedRgb()`, `toCmyk()`, `toHsv()` или `toHsl()`, которые возвращают новый объект. Прототипы методов:
```c++
QColor toRgb() const
QColor toExtendedRgb() const
QColor toCmyk() const
QColor toHsv() const
QColor toHsl() const
```

