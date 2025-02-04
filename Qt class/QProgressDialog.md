
# Окно с индикатором хода процесса

Класс `QProgressDialog` реализует диалоговое окно с индикатором хода процесса и кнопкой `Cancel`. Иерархия наследования для класса `QProgressDialog` выглядит так:
```
(QObject, QPaintDevice) — QWidget — QDialog — QProgressDialog
```

Форматы конструктора класса `QProgressDialog`:
```c++
#include <QProgressDialog>

QProgressDialog(QWidget *parent = nullptr,
		Qt::WindowFlags f = Qt::WindowFlags())
QProgressDialog(const QString &labelText,
		const QString &cancelButtonText, int minimum,
		int maximum, QWidget *parent = nullptr,
		Qt::WindowFlags f = Qt::WindowFlags())
```

Если в параметре `parent` передан указатель на родительское окно, то диалоговое окно будет центрироваться относительно родительского окна, а не относительно экрана. Параметр `f` задает [[QWidget#Указание типа окна|тип окна]].

Класс `QProgressDialog` наследует все методы из базовых классов и содержит следующие дополнительные методы (перечислены только основные методы; полный список смотрите в документации):

> **setLabel()** — позволяет заменить объект надписи. Прототип метода:
```c++
void setLabel(QLabel *label)
```

> **setBar()** — позволяет заменить объект индикатора. Прототип метода:
```c++
void setBar(QProgressBar *bar)
```

> **setCancelButton()** — позволяет заменить объект кнопки. Прототип метода:
```c++
void setCancelButton(QPushButton *cancelButton)
```

> **setValue()** — задает новое значение индикатора. Если диалоговое окно является модальным, то при установке значения автоматически вызывается метод `processEvents()` объекта приложения. Метод является слотом. Прототип метода:
```c++
void setValue(int progress)
```

> **value()** — возвращает текущее значение индикатора в виде числа. Прототип метода:
```c++
int value() const
```

> **setLabelText()** — задает надпись, выводимую над индикатором. Метод является слотом. Прототип метода:
```c++
void setLabelText(const QString &text)
```

> **setCancelButtonText()** — задает надпись, выводимую на кнопке `Cancel`. Метод является слотом. Прототип метода:
```c++
void setCancelButtonText(const QString &cancelButtonText)
```

> **setRange()**, **setMinimum()** и **setMaximum()** — задают минимальное и максимальное значения. Если оба значения равны нулю, то внутри индикатора будут постоянно по кругу перемещаться сегменты, показывая ход выполнения процесса с неопределенным количеством шагов. Методы являются слотами. Прототипы методов:
```c++
void setRange(int min, int max)
void setMinimum(int min)
void setMaximum(int max)
```

> **setMinimumDuration()** — задает промежуток времени в миллисекундах перед отображением окна (по умолчанию значение равно 4000). Окно может быть отображено ранее этого срока при установке значения. Метод является слотом. Прототип метода:
```c++
void setMinimumDuration(int ms)
```

> **reset()** — сбрасывает значение индикатора. Метод является слотом. Прототип метода:
```c++
void reset()
```

> **cancel()** — имитирует нажатие кнопки `Cancel`. Метод является слотом. Прототип метода:
```c++
void cancel()
```

> **setAutoClose()** — если в качестве параметра указано значение `true`, то при сбросе значения окно скрывается. Прототип метода:
```c++
void setAutoClose(bool close)
```

> **setAutoReset()** — если в качестве параметра указано значение `true`, то при достижении максимального значения будет автоматически произведен сброс значения. Прототип метода:
```c++
void setAutoReset(bool reset)
```

> **wasCanceled()** — возвращает значение `true`, если была нажата кнопка `Cancel`. Прототип метода:
```c++
bool wasCanceled() const
```

Класс `QProgressDialog` содержит сигнал `canceled()`, который генерируется при нажатии кнопки `Cancel`.
