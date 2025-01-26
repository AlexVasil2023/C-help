# Календарь

Класс `QCalendarWidget` реализует календарь с возможностью выбора даты и перемещения по месяцам с помощью мыши и клавиатуры. Иерархия наследования:
```
(QObject, QPaintDevice) — QWidget — QCalendarWidget
```

Формат конструктора класса `QCalendarWidget`:
```c++
#include <QCalendarWidget>

QCalendarWidget(QWidget *parent = nullptr)
```

Класс `QCalendarWidget` содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **setSelectedDate()** — устанавливает указанную дату. Метод является слотом. Прототип метода:
```c++
void setSelectedDate(QDate date)
```

> **selectedDate()** — возвращает экземпляр класса [[QDate|QDate]] с выбранной датой. Прототип метода:
```c++
QDate selectedDate() const
```

> **setDateRange()**, **setMinimumDate()** и **setMaximumDate()** — задают минимальное и максимальное допустимые значения для даты. Метод `setDateRange()` является слотом. Прототипы методов:
```c++
void setDateRange(QDate min, QDate max)

void setMinimumDate(QDate date)

void setMaximumDate(QDate date)
```

> **setCurrentPage()** — делает текущей страницу с указанным годом и месяцем. Выбранная дата при этом не изменяется. Метод является слотом. Прототип метода:
```c++
void setCurrentPage(int year, int month)
```

> **monthShown()** — возвращает месяц (число от 1 до 12), отображаемый на текущей странице. Прототип метода:
```c++
int monthShown() const
```

> **yearShown()** — возвращает год, отображаемый на текущей странице. Прототип метода:
```c++
int yearShown() const
```

> **showSelectedDate()** — отображает страницу с выбранной датой. Выбранная дата при этом не изменяется. Метод является слотом. Прототип метода:
```c++
void showSelectedDate()
```

> **showToday()** — отображает страницу с сегодняшней датой. Выбранная дата при этом не изменяется. Метод является слотом. Прототип метода:
```c++
void showToday()
```

> **showPreviousMonth()** — отображает страницу с предыдущим месяцем. Выбранная дата при этом не изменяется. Метод является слотом. Прототип метода:
```c++
void showPreviousMonth()
```

> **showNextMonth()** — отображает страницу со следующим месяцем. Выбранная дата при этом не изменяется. Метод является слотом. Прототип метода:
```c++
void showNextMonth()
```

> **showPreviousYear()** — отображает страницу с текущим месяцем в предыдущем году. Выбранная дата при этом не изменяется. Метод является слотом. Прототип метода:
```c++
void showPreviousYear()
```

> **showNextYear()** — отображает страницу с текущим месяцем в следующем году. Выбранная дата при этом не изменяется. Метод является слотом. Прототип метода:
```c++
void showNextYear()
```

> **setFirstDayOfWeek()** — задает первый день недели. По умолчанию первый день недели зависит от локали. Прототип метода:
```c++
void setFirstDayOfWeek(Qt::DayOfWeek dayOfWeek)
```

> **setNavigationBarVisible()** — если в качестве параметра указано значение `false`, то панель навигации выводиться не будет. Метод является слотом. Прототип метода:
```c++
void setNavigationBarVisible(bool visible)
```

> **setHorizontalHeaderFormat()** — задает формат горизонтального заголовка. Прототип метода:
```c++
void setHorizontalHeaderFormat(QCalendarWidget::HorizontalHeaderFormat format)
```

В качестве параметра можно указать следующие константы:

* **QCalendarWidget::NoHorizontalHeader** — заголовок не отображается;
* **QCalendarWidget::SingleLetterDayNames** — отображается только первая буква из названия дня недели;
* **QCalendarWidget::ShortDayNames** — отображается сокращенное название дня недели;
• **QCalendarWidget::LongDayNames** — отображается полное название дня недели;

> **setVerticalHeaderFormat()** — задает формат вертикального заголовка. Прототип метода:
```c++
void setVerticalHeaderFormat(QCalendarWidget::VerticalHeaderFormat format)
```

В качестве параметра можно указать следующие константы:

* **QCalendarWidget::NoVerticalHeader** — заголовок не отображается;
* **QCalendarWidget::ISOWeekNumbers** — отображается номер недели в году;

> **setGridVisible()** — если в качестве параметра указано значение `true`, то будут отображены линии сетки. Метод является слотом. Прототип метода:
```c++
void setGridVisible(bool show)
```

> **setSelectionMode()** — задает режим выделения даты. Прототип метода:
```c++
void setSelectionMode(QCalendarWidget::SelectionMode mode)
```

В качестве параметра можно указать следующие константы:

* **QCalendarWidget::NoSelection** — дата не может быть выбрана пользователем;
* **QCalendarWidget::SingleSelection** — может быть выбрана одна дата;

> **setHeaderTextFormat()** — задает формат ячеек заголовка. Прототип метода:
```c++
void setHeaderTextFormat(const QTextCharFormat &format)
```

> 	**setWeekdayTextFormat()** — задает формат ячеек для указанного дня недели. В первом параметре указываются константы `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday` или `Sunday`. Прототип метода:
```c++
void setWeekdayTextFormat(Qt::DayOfWeek dayOfWeek,
							const QTextCharFormat &format)
```

> **setDateTextFormat()** — задает формат ячейки с указанной датой. Прототип метода:
```c++
void setDateTextFormat(QDate date, const QTextCharFormat &format)
```

Класс `QCalendarWidget` содержит следующие сигналы:

> **activated(QDate)** — генерируется при двойном щелчке мышью или нажатии клавиши `<Enter>`. Внутри обработчика через параметр доступна дата;
> 
> **clicked(QDate)** — генерируется при щелчке мышью на доступной дате. Внутри обработчика через параметр доступна выбранная дата;
> 
> **currentPageChanged(int,int)** — генерируется при изменении страницы. Внутри обработчика через первый параметр доступен год, а через второй — месяц;
> 
> **selectionChanged()** — генерируется при изменении выбранной даты пользователем или из программы.











