# Поля для ввода даты и времени

Для ввода даты и времени предназначены классы `QDateTimeEdit` (поле для ввода даты и времени), `QDateEdit` (поле для ввода даты) и `QTimeEdit` (поле для ввода времени). Поля могут содержать две кнопки, которые позволяют увеличивать и уменьшать значение внутри поля с помощью щелчка мышью. Иерархия наследования:
```c++
(QObject, QPaintDevice) — QWidget — QAbstractSpinBox — QDateTimeEdit

(QObject, QPaintDevice) — QWidget — QAbstractSpinBox — QDateTimeEdit —
						— QDateEdit

(QObject, QPaintDevice) — QWidget — QAbstractSpinBox — QDateTimeEdit —
						— QTimeEdit
```

Форматы конструкторов классов:

```c++
#include <QDateTimeEdit>

QDateTimeEdit(QTime time, QWidget *parent = nullptr)
QDateTimeEdit(QDate date, QWidget *parent = nullptr)
QDateTimeEdit(const QDateTime &datetime, QWidget *parent = nullptr)
QDateTimeEdit(QWidget *parent = nullptr)

#include <QDateEdit>

QDateEdit(QDate date, QWidget *parent = nullptr)
QDateEdit(QWidget *parent = nullptr)

#include <QTimeEdit>

QTimeEdit(QTime time, QWidget *parent = nullptr)
QTimeEdit(QWidget *parent = nullptr)
```

Класс `QDateTimeEdit` наследует все методы из класса [[QSpinBox|QAbstractSpinBox]] и дополнительно реализует следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **setDateTime()** — устанавливает дату и время. Метод является слотом. Прототип метода:
```c++
void setDateTime(const QDateTime &dateTime)
```

> **setDate()** — устанавливает дату. Метод является слотом. Прототип метода:
```c++
void setDate(QDate date)
```

> **setTime()** — устанавливает время. Метод является слотом. Прототип метода:
```c++
void setTime(QTime time)
```

> **dateTime()** — возвращает экземпляр класса QDateTime с датой и временем. Прототип метода:
```c++
QDateTime dateTime() const
```

> **date()** — возвращает экземпляр класса QDate с датой. Прототип метода:
```c++
QDate date() const
```

> **time()** — возвращает экземпляр класса QTime с временем. Прототип метода:
```c++
QTime time() const
```

> **setDateTimeRange()** — задает диапазон допустимых значений для даты и времени. Прототип метода:
```c++
void setDateTimeRange(const QDateTime &min, const QDateTime &max)
```

> **setMinimumDateTime()** и **setMaximumDateTime()** — задают минимальное и максимальное допустимые значения для даты и времени. Прототипы методов:
```c++
void setMinimumDateTime(const QDateTime &dt)
void setMaximumDateTime(const QDateTime &dt)
```

> `setDateRange()`, `setMinimumDate()` и `setMaximumDate()` — задают минимальное и максимальное допустимые значения для даты. Прототипы методов:
```c++
void setDateRange(QDate min, QDate max)
void setMinimumDate(QDate min)
void setMaximumDate(QDate max)
```

> **setTimeRange()**, **setMinimumTime()** и **setMaximumTime()** — задают минимальное и максимальное допустимые значения для времени. Прототипы методов:
```c++
void setTimeRange(QTime min, QTime max)
void setMinimumTime(QTime min)
void setMaximumTime(QTime max
```

> **setDisplayFormat()** — задает формат отображения даты и времени. Прототип метода:
```c++
void setDisplayFormat(const QString &format)
```

В качестве параметра указывается строка, содержащая специальные символы. Пример указания строки формата:
```c++
dateTimeEdit->setDisplayFormat("dd.MM.yyyy HH:mm:ss");
```

> **setTimeSpec()** — задает зону времени. В качестве параметра можно указать константы `Qt::LocalTime`, `Qt::UTC` или `Qt::OffsetFromUTC`. Прототип метода:
```c++
void setTimeSpec(Qt::TimeSpec spec)
```

> **setCalendarPopup()** — если в качестве параметра указано значение `true`, то дату можно будет выбрать с помощью календаря. Прототип метода:
```c++
void setCalendarPopup(bool enable)
```

> **setSelectedSection()** — выделяет указанную секцию. В качестве параметра можно указать константы `NoSection`, `DaySection`, `MonthSection`, `YearSection`, `HourSection`, `MinuteSection`, `SecondSection`, `MSecSection` или `AmPmSection` из пространства имен `QDateTimeEdit`. Прототип метода:
```c++
void setSelectedSection(QDateTimeEdit::Section section)
```

> **setCurrentSection()** — делает указанную секцию текущей. Прототип метода:
```c++
void setCurrentSection(QDateTimeEdit::Section section)
```

> **setCurrentSectionIndex()** — делает секцию с указанным индексом текущей. Прототип метода:
```c++
void setCurrentSectionIndex(int index)
```

> **currentSection()** — возвращает тип текущей секции. Прототип метода:
```c++
QDateTimeEdit::Section currentSection() const
```

> **currentSectionIndex()** — возвращает индекс текущей секции. Прототип метода:
```c++
int currentSectionIndex() const
```

> **sectionCount()** — возвращает количество секций внутри поля. Прототип метода:
```c++
int sectionCount() const
```

> **sectionAt()** — возвращает тип секции по указанному индексу. Прототип метода:
```c++
QDateTimeEdit::Section sectionAt(int index) const
```

> **sectionText()** — возвращает текст указанной секции. Прототип метода:
```c++
QString sectionText(QDateTimeEdit::Section section) const
```

При изменении внутри поля значений даты или времени генерируются сигналы `timeChanged(QTime)`, `dateChanged(QDate)` и `dateTimeChanged(const QDateTime&)`. Внутри обработчиков через параметр доступно новое значение.

Классы `QDateEdit` (поле для ввода даты) и `QTimeEdit` (поле для ввода времени) созданы для удобства и отличаются от класса `QDateTimeEdit` только форматом отображаемых данных. Эти классы наследуют методы базовых классов и не добавляют больше никаких своих методов.








