# QGroupBox

Состояние некоторых компонентов может зависеть от состояния других компонентов, например из нескольких переключателей можно выбрать только один. В этом случае компоненты объединяют в группу. Группа компонентов отображается внутри рамки, на границе которой выводится текст подсказки. Реализовать группу позволяет класс `QGroupBox`. Иерархия наследования выглядит так:

```
(QObject, QPaintDevice) — QWidget — QGroupBox
```

Создать экземпляр класса `QGroupBox` позволяют следующие конструкторы:

```c++
#include <QGroupBox>

QGroupBox(QWidget *parent = nullptr)
QGroupBox(const QString &title, QWidget *parent = nullptr)
```

В необязательном параметре `parent` можно передать указатель на родительский компонент. Параметр `title` задает текст подсказки, которая отобразится на верхней границе рамки. Внутри текста подсказки символ `&`, указанный перед буквой, задает комбинацию клавиш быстрого доступа. В этом случае буква, перед которой указан символ `&`, будет подчеркнута, что является подсказкой пользователю. При одновременном нажатии клавиши `<Alt>` и подчеркнутой буквы первый компонент внутри группы окажется в фокусе ввода.

После создания экземпляра класса `QGroupBox` следует добавить компоненты в какой-либо контейнер, а затем передать указатель на контейнер в метод `setLayout()`. Типичный пример использования класса `QGroupBox` выглядит так:

```c++
QWidget window;
window.setWindowTitle("Класс QGroupBox");
window.resize(350, 80);

QRadioButton *radio1 = new QRadioButton("&Да");
QRadioButton *radio2 = new QRadioButton("&Нет");

QVBoxLayout *vbox = new QVBoxLayout();
QGroupBox *box = new QGroupBox("&Вы знаете язык C++?");
QHBoxLayout *hbox = new QHBoxLayout();

hbox->addWidget(radio1);
hbox->addWidget(radio2);
box->setLayout(hbox);

vbox->addWidget(box);
window.setLayout(vbox);
radio1->setChecked(true); // Выбираем первый переключатель

window.show();
```

Результат выполнения этого кода:

![[GUI_1.png]]

Класс `QGroupBox` содержит следующие методы:

> **setTitle()** — задает текст подсказки. Прототип метода:
```c++
void setTitle(const QString &title)
```

Получение значения:
```c++
QString title() const
```

> **setAlignment()** — задает горизонтальное местоположение текста подсказки. В параметре указываются следующие константы `Qt::AlignLeft`, `Qt::AlignHCenter` или `Qt::AlignRight`. Прототип метода:
```c++
void setAlignment(int alignment)
```

Пример:
```c++
box->setAlignment(Qt::AlignRight);
```

Получение значения:
```c++
Qt::Alignment alignment() const
```

> **setCheckable()** — если в параметре указать значение `true`, то перед текстом подсказки будет отображен флажок. Если флажок установлен, то группа будет активной, а если флажок снят, то все компоненты внутри группы станут неактивными. По умолчанию флажок не отображается. Прототип метода:
```c++
void setCheckable(bool checkable)
```

> **isCheckable()** — возвращает значение `true`, если флажок выводится перед надписью, и `false` — в противном случае. Прототип метода:
```c++
bool isCheckable() const
```

> **setChecked()** — если в параметре указать значение `true`, то флажок, отображаемый перед текстом подсказки, будет установлен. Значение `false` сбрасывает флажок. Метод является слотом. Прототип метода:
```c++
void setChecked(bool checked)
```

> **isChecked()** — возвращает значение `true`, если флажок, отображаемый перед текстом подсказки, установлен, и `false` — в противном случае. Прототип метода:
```c++
bool isChecked() const
```

> **setFlat()** — если в параметре указано значение true, то отображается только верхняя граница рамки, а если `false`, то все границы рамки. Прототип метода:
```c++
void setFlat(bool flat)
```

> **isFlat()** — возвращает значение `true`, если отображается только верхняя граница рамки, и `false` — если все границы рамки. Прототип метода:
```c++
bool isFlat() const
```

Класс `QGroupBox` содержит следующие сигналы:

> **clicked(bool checked=false)** — генерируется при щелчке мышью на флажке, выводимом перед текстом подсказки. Если состояние флажка изменяется с помощью метода `setChecked()`, то сигнал не генерируется. Через параметр внутри обработчика доступно значение `true`, если флажок установлен, и `false` — если сброшен;
> 
> `toggled(bool)` — генерируется при изменении статуса флажка, выводимого перед текстом подсказки. Через параметр внутри обработчика доступно значение `true`, если флажок установлен, и `false` — если сброшен.


