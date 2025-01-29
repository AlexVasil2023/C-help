
# Класс QDialogButtonBox

Класс `QDialogButtonBox` реализует контейнер, в который можно добавить различные кнопки, как пользовательские, так и стандартные. Внешний вид контейнера и расположение кнопок в нем зависят от используемой операционной системы. Иерархия наследования для класса `QDialogButtonBox`:
```
(QObject, QPaintDevice) — QWidget — QDialogButtonBox
```

Форматы конструктора класса `QDialogButtonBox`:
```c++
#include <QDialogButtonBox>

QDialogButtonBox(QWidget *parent = nullptr)
QDialogButtonBox(Qt::Orientation orientation, QWidget *parent = nullptr)
QDialogButtonBox(QDialogButtonBox::StandardButtons buttons,
						QWidget *parent = nullptr)
QDialogButtonBox(QDialogButtonBox::StandardButtons buttons,
						Qt::Orientation orientation, QWidget *parent = nullptr)
```

В параметре `parent` может быть передан указатель на родительский компонент. Параметр `orientation` задает порядок расположения кнопок внутри контейнера. В качестве значения указываются константы `Qt::Horizontal` (по горизонтали; значение по умолчанию) или `Qt::Vertical` (по вертикали). В параметре `buttons` указываются следующие константы (или их комбинация через оператор `|`):

> **QDialogButtonBox::NoButton** — кнопки не установлены;
> 
> **QDialogButtonBox::Ok** — кнопка `OK` с ролью `AcceptRole`;
> 
> **QDialogButtonBox::Cancel** — кнопка `Cancel` с ролью `RejectRole`;
> 
> **QDialogButtonBox::Yes** — кнопка `Yes` с ролью `YesRole`;
> 
> **QDialogButtonBox::YesToAll** — кнопка `Yes to All` с ролью `YesRole`;
> 
> **QDialogButtonBox::No** — кнопка `No` с ролью `NoRole`;
> 
> **QDialogButtonBox::NoToAll** — кнопка `No to All` с ролью `NoRole`;
> 
> **QDialogButtonBox::Open** — кнопка `Open` с ролью `AcceptRole`;
> 
> **QDialogButtonBox::Close** — кнопка `Close` с ролью `RejectRole`;
> 
> **QDialogButtonBox::Save** — кнопка `Save` с ролью `AcceptRole`;
> 
> **QDialogButtonBox::SaveAll** — кнопка `Save All` с ролью `AcceptRole`;
> 
> **QDialogButtonBox::Discard** — кнопка `Discard` или `Don't Save` (надпись на кнопке зависит от операционной системы) с ролью `DestructiveRole`;
> 
> **QDialogButtonBox::Apply** — кнопка `Apply` с ролью `ApplyRole`;
> 
> **QDialogButtonBox::Reset** — кнопка `Reset` с ролью `ResetRole`;
> 
> **QDialogButtonBox::RestoreDefaults** — кнопка `Restore Defaults` с ролью `ResetRole`;
> 
> **QDialogButtonBox::Help** — кнопка `Help` с ролью `HelpRole`;
> 
> **QDialogButtonBox::Abort** — кнопка `Abort` с ролью `RejectRole`;
> 
> **QDialogButtonBox::Retry** — кнопка `Retry` с ролью `AcceptRole`;
> 
> **QDialogButtonBox::Ignore** — кнопка `Ignore` с ролью `AcceptRole`.

Поведение кнопок описывается с помощью ролей. В качестве роли можно указать следующие константы:

> **QDialogButtonBox::InvalidRole** — ошибочная роль;
> 
> **QDialogButtonBox::AcceptRole** — нажатие кнопки устанавливает код возврата равным значению константы `Accepted`;
> 
> **QDialogButtonBox::RejectRole** — нажатие кнопки устанавливает код возврата равным значению константы `Rejected`;
> 
> **QDialogButtonBox::DestructiveRole** — кнопка для отказа от изменений;
> 
> **QDialogButtonBox::ActionRole**;
> 
> **QDialogButtonBox::HelpRole** — кнопка для отображения справки;
> 
> **QDialogButtonBox::YesRole** — кнопка `Yes`;
> 
> **QDialogButtonBox::NoRole** — кнопка `No`;
> 
> **QDialogButtonBox::ResetRole** — кнопка для установки значений по умолчанию;
> 
> **QDialogButtonBox::ApplyRole** — кнопка для принятия изменений.

Класс `QDialogButtonBox` наследует все методы из базовых классов и содержит следующие дополнительные методы (перечислены только основные методы; полный список смотрите в документации):

> **setOrientation()** — задает порядок расположения кнопок внутри контейнера. В качестве значения указываются константы `Qt::Horizontal` (по горизонтали) или `Qt::Vertical` (по вертикали). Прототип метода:
```c++
void setOrientation(Qt::Orientation orientation)
```

> **setStandardButtons()** — устанавливает несколько стандартных кнопок. Прототип метода:
```c++
void setStandardButtons(QDialogButtonBox::StandardButtons buttons)
```

Пример:
```c++
box->setStandardButtons(QDialogButtonBox::Ok | QDialogButtonBox::Cancel);
```

> **addButton()** — добавляет кнопку в контейнер. Прототипы метода:
```c++
void addButton(QAbstractButton *button, QDialogButtonBox::ButtonRole role)
QPushButton *addButton(const QString &text, QDialogButtonBox::ButtonRole role)
QPushButton *addButton(QDialogButtonBox::StandardButton button)
```

> **button()** — возвращает указатель на кнопку, соответствующую указанному значению, или нулевой указатель, если стандартная кнопка не была добавлена в контейнер ранее. Прототип метода:
```c++
QPushButton *button(QDialogButtonBox::StandardButton which) const
```

> **buttonRole()** — возвращает роль указанной в параметре кнопки. Если кнопка не была добавлена в контейнер, то метод возвращает значение константы `InvalidRole`. Прототип метода:
```c++
QDialogButtonBox::ButtonRole buttonRole(QAbstractButton *button) const
```

> **buttons()** — возвращает список с указателями на кнопки, которые были добавлены в контейнер. Прототип метода:
```c++
QList<QAbstractButton *> buttons() const
```

> **removeButton()** — удаляет кнопку из контейнера, при этом не удаляя объект кнопки. Прототип метода:
```c++
void removeButton(QAbstractButton *button)
```

> **clear()** — очищает контейнер и удаляет все кнопки. Прототип метода:
```c++
void clear()
```

> **setCenterButtons()** — если в качестве параметра указано значение `true`, то кнопки будут выравниваться по центру контейнера. Прототип метода:
```c++
void setCenterButtons(bool center)
```

Класс `QDialogButtonBox` содержит следующие сигналы:

> **accepted()** — генерируется при нажатии кнопки с ролью `AcceptRole` или `YesRole`. Этот сигнал можно соединить со слотом `accept()` объекта диалогового окна. Пример:
```c++
connect(box, SIGNAL(accepted()), this, SLOT(accept()));
```

> **rejected()** — генерируется при нажатии кнопки с ролью `RejectRole` или `NoRole`. Этот сигнал можно соединить со слотом `reject()` объекта диалогового окна. Пример:
```c++
connect(box, SIGNAL(rejected()), this, SLOT(reject()));
```

> **helpRequested()** — генерируется при нажатии кнопки с ролью `HelpRole`;

> `clicked(QAbstractButton *)` — генерируется при нажатии любой кнопки внутри контейнера. Внутри обработчика через параметр доступен указатель на кнопку.

