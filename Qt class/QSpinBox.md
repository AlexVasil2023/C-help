# Поля для ввода целых и вещественных чисел

Для ввода чисел предназначены классы `QSpinBox` (поле для ввода целых чисел) и `QDoubleSpinBox` (поле для ввода вещественных чисел). Поля могут содержать две кнопки, которые позволяют увеличивать и уменьшать значение внутри поля с помощью щелчка мышью. Иерархия наследования:
```
(QObject, QPaintDevice) — QWidget — QAbstractSpinBox — QSpinBox

(QObject, QPaintDevice) — QWidget — QAbstractSpinBox — QDoubleSpinBox
```

Форматы конструкторов классов `QSpinBox` и `QDoubleSpinBox`:

```c++
#include <QSpinBox>

QSpinBox(QWidget *parent = nullptr)

#include <QDoubleSpinBox>

QDoubleSpinBox(QWidget *parent = nullptr)
```

Классы `QSpinBox` и `QDoubleSpinBox` наследуют следующие методы из класса `QAbstractSpinBox` (перечислены только основные методы; полный список смотрите в документации):

> **setButtonSymbols()** — задает режим отображения кнопок, предназначенных для изменения значения поля с помощью мыши. Прототип метода:
```c++
void setButtonSymbols(QAbstractSpinBox::ButtonSymbols)
```

* **QAbstractSpinBox::UpDownArrows** — отображаются кнопки со стрелками;
* **QAbstractSpinBox::PlusMinus** — отображаются кнопки с символами + и -. Обратите внимание на то, что при использовании некоторых стилей данное значение может быть проигнорировано;
* **QAbstractSpinBox::NoButtons** — кнопки не отображаются.*

Получение значения:
```c++
QAbstractSpinBox::ButtonSymbols buttonSymbols() const
```

> **setAlignment()** — задает режим выравнивания значения внутри поля. Прототип метода:
```c++
void setAlignment(Qt::Alignment flag)
```

Получение значения:
```c++
Qt::Alignment alignment() const
```

> **setWrapping()** — если в качестве параметра указано значение `true`, то значение внутри поля будет изменяться по кругу при нажатии кнопок, например максимальное значение сменится минимальным. Прототип метода:
```c++
void setWrapping(bool)
```

Получение значения:
```c++
bool wrapping() const
```

> **setSpecialValueText()** — позволяет задать строку, которая будет отображаться внутри поля вместо минимального значения. Прототип метода:
```c++
void setSpecialValueText(const QString &txt)
```

Получение значения:
```c++
QString specialValueText() const
```

> **setReadOnly()** — если в качестве параметра указано значение true, то поле будет доступно только для чтения. Прототип метода:
```c++
void setReadOnly(bool)
```

Получение значения:
```c++
bool isReadOnly() const
```

> **setKeyboardTracking()** — если в качестве параметра указано значение `false`, то сигналы `valueChanged()` и `textChanged()` не будут генерироваться при вводе значения с клавиатуры. Прототип метода:
```c++
void setKeyboardTracking(bool)
```

Получение значения:
```c++
bool keyboardTracking() const
```

> **setGroupSeparatorShown()** — если в качестве параметра указано значение `true`, то будут отображаться разделители тысяч. Прототип метода:
```c++
void setGroupSeparatorShown(bool shown)
```

Получение значения:
```c++
bool isGroupSeparatorShown() const
```

> **setFrame()** — если в качестве параметра указано значение `false`, то поле будет отображаться без рамки. Прототип метода:
```c++
void setFrame(bool)
```

Получение значения:
```c++
bool hasFrame() const
```

> **stepDown()** — уменьшает значение на одно приращение. Метод является слотом. Прототип метода:
```c++
void stepDown()
```

> **stepUp()** — увеличивает значение на одно приращение. Метод является слотом. Прототип метода:
```c++
void stepUp()
```

> **stepBy()** — увеличивает (при положительном значении) или уменьшает (при отрицательном значении) значение поля на указанное количество приращений. Прототип метода:
```c++
virtual void stepBy(int steps)
```

> **text()** — возвращает текст, содержащийся внутри поля. Прототип метода:
```c++
QString text() const
```

> **clear()** — очищает поле. Метод является слотом. Прототип метода:
```c++
virtual void clear()
```

> **selectAll()** — выделяет все содержимое поля. Метод является слотом. Прототип метода:
```c++
void selectAll()
```

Класс `QAbstractSpinBox` содержит сигнал `editingFinished()`, который генерируется при потере полем фокуса ввода или нажатии клавиши `<Enter>`.

Классы `QSpinBox` и `QDoubleSpinBox` содержат следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **setValue()** — задает значение поля. Метод является слотом. Прототипы метода:
```c++
void setValue(int val) // QSpinBox

void setValue(double val) // QDoubleSpinBox
```

> **value()** — возвращает число, содержащееся в поле. Прототипы метода:
```c++
int value() const // QSpinBox

double value() const // QDoubleSpinBox
```

> **cleanText()** — возвращает число в виде строки. Прототип метода:
```c++
QString cleanText() const
```

> **setRange()**, **setMinimum()** и **setMaximum()** — задают минимальное и максимальное допустимые значения. Прототипы методов:
```c++
// QSpinBox
void setRange(int minimum, int maximum)
void setMinimum(int min)
void setMaximum(int max)

// QDoubleSpinBox
void setRange(double minimum, double maximum)
void setMinimum(double min)
void setMaximum(double max)
```

> **setPrefix()** — задает текст, который будет отображаться внутри поля перед значением. Прототип метода:
```c++
void setPrefix(const QString &prefix)
```

> **setSuffix()** — задает текст, который будет отображаться внутри поля после значения. Прототип метода:
```c++
void setSuffix(const QString &suffix)
```

> **setSingleStep()** — задает число, которое будет прибавляться или вычитаться из текущего значения поля на каждом шаге. Прототипы метода:
```c++
void setSingleStep(int val) // QSpinBox

void setSingleStep(double val) // QDoubleSpinBox
```

Класс `QDoubleSpinBox` содержит также метод `setDecimals()`, который задает количество цифр после десятичной точки. Прототип метода:
```c++
void setDecimals(int prec)
```

Классы `QSpinBox` и `QDoubleSpinBox` содержат сигналы `valueChanged(int)` (только в классе `QSpinBox`), `valueChanged(double)` (только в классе `QDoubleSpinBox`) и `textChanged(const QString&)`, которые генерируются при изменении значения внутри поля. Внутри обработчика через параметр доступно новое значение в виде числа или строки в зависимости от сигнала.









