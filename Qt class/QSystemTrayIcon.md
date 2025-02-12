
# Добавление значка приложения в область уведомлений

Класс `QSystemTrayIcon` позволяет добавить значок приложения в область уведомлений, расположенную в правой части Панели задач в Windows. Иерархия наследования для класса `QSystemTrayIcon` выглядит так:
```
QObject — QSystemTrayIcon
```

Форматы конструктора класса `QSystemTrayIcon`:
```c++
#include <QSystemTrayIcon>

QSystemTrayIcon(QObject *parent = nullptr)
QSystemTrayIcon(const QIcon &icon, QObject *parent = nullptr)
```

Класс `QSystemTrayIcon` содержит следующие основные методы:

> **isSystemTrayAvailable()** — возвращает значение `true`, если можно отобразить значок в области уведомлений, и `false` — в противном случае. Метод является статическим. Прототип метода:
```c++
static bool isSystemTrayAvailable()
```

> **setIcon()** — устанавливает значок. Установить значок можно также в конструкторе класса. Прототип метода:
```c++
void setIcon(const QIcon &icon)
```

> **icon()** — возвращает значок. Прототип метода:
```c++
QIcon icon() const
```

> **setContextMenu()** — устанавливает контекстное меню, отображаемое при щелчке правой кнопкой мыши на значке. Прототип метода:
```c++
void setContextMenu(QMenu *menu)
```

> **contextMenu()** — возвращает указатель на контекстное меню. Прототип метода:
```c++
QMenu *contextMenu() const
```

> **setToolTip()** — задает текст всплывающей подсказки. Прототип метода:
```c++
void setToolTip(const QString &tip)
```

> **toolTip()** — возвращает текст всплывающей подсказки. Прототип метода:
```c++
QString toolTip() const
```

> **setVisible()** — если в качестве параметра указано значение `true`, то отображает значок, а если `false`, то скрывает значок. Метод является слотом. Прототип метода:
```c++
void setVisible(bool visible)
```

> **show()** — отображает значок. Метод является слотом. Прототип метода:
```c++
void show()
```

> **hide()** — скрывает значок. Метод является слотом. Прототип метода:
```c++
void hide()
```

> **isVisible()** — возвращает значение `true`, если значок виден, и `false` — в противном случае. Прототип метода:
```c++
bool isVisible() const
```

> **geometry()** — возвращает экземпляр класса [[QRect|QRect]] с размерами и координатами значка на экране. Прототип метода:
```c++
QRect geometry() const
```

> **showMessage()** — позволяет отобразить сообщение в области уведомлений. Метод является слотом. Прототипы метода:
```c++
void showMessage(const QString &title, const QString &message,
			QSystemTrayIcon::MessageIcon ico =
			QSystemTrayIcon::Information,
			int millisecondsTimeoutHint = 10000)
void showMessage(const QString &title, const QString &message,
			const QIcon &icon, int millisecondsTimeoutHint = 10000)
```

Необязательный параметр `ico` задает значок, который отображается слева от заголовка сообщения. В качестве значения можно указать константы `NoIcon`, `Information`, `Warning` или `Critical`. Необязательный параметр `millisecondsTimeoutHint` задает промежуток времени, на который отображается сообщение. Обратите внимание на то, что сообщение может не показываться вообще, кроме того, значение параметра в некоторых операционных системах игнорируется;

> **supportsMessages()** — возвращает значение `true`, если вывод сообщений поддерживается, и `false` — в противном случае. Метод является статическим. Прототип метода:
```c++
static bool supportsMessages()
```

Класс `QSystemTrayIcon` содержит следующие сигналы:
> **activated(QSystemTrayIcon::ActivationReason)** — генерируется при щелчке мышью на значке. Внутри обработчика через параметр доступна причина в виде значения следующих констант:
* **QSystemTrayIcon::Unknown** — неизвестная причина;
* **QSystemTrayIcon::Context** — нажата правая кнопка мыши;
* **QSystemTrayIcon::DoubleClick** — двойной щелчок мышью;
* **QSystemTrayIcon::Trigger** — нажата левая кнопка мыши;
* **QSystemTrayIcon::MiddleClick** — нажата средняя кнопка мыши;

> **messageClicked()** — генерируется при щелчке мышью в области сообщения.
