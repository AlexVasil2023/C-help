
# Класс QToolBar

Класс `QToolBar` реализует панель инструментов, которую можно перемещать с помощью мыши. Иерархия наследования для класса `QToolBar` выглядит так:
```
(QObject, QPaintDevice) — QWidget — QToolBar
```

Форматы конструктора класса `QToolBar`:
```c++
#include <QToolBar>

QToolBar(QWidget *parent = nullptr)
QToolBar(const QString &title, QWidget *parent = nullptr)
```

В параметре `parent` передается указатель на родительский компонент, а в параметре `title` задается название панели, которое отображается в контекстном меню при щелчке правой кнопкой мыши в области меню, панелей инструментов или на заголовке прикрепляемых панелей. С помощью контекстного меню можно скрыть или отобразить панель инструментов.

Класс `QToolBar` наследует все методы из базовых классов и содержит следующие дополнительные методы (перечислены только основные методы; полный список смотрите в документации):

> **addAction()** — добавляет действие на панель инструментов. Прототипы метода:
```c++
void addAction(QAction *action);
QAction *addAction(const QString &text)
QAction *addAction(const QIcon &icon, const QString &text)
QAction *addAction(const QString &text, const QObject *receiver,
					const char *member)
QAction *addAction(const QIcon &icon, const QString &text,
					const QObject *receiver, const char *member)
QAction *addAction(const QString &text, Functor functor)
QAction *addAction(const QString &text, const QObject *context,
					Functor functor)
QAction *addAction(const QIcon &icon, const QString &text, Functor functor)
QAction *addAction(const QIcon &icon, const QString &text,
					const QObject *context, Functor functor)
```

Добавить действия на панель инструментов и удалить их позволяют следующие методы из класса `QWidget`: `addActions()`, `insertAction()`, `insertActions()`, `actions()`, `removeAction()`;

> **addSeparator()** — добавляет разделитель и возвращает указатель на экземпляр класса `QAction`. Прототип метода:
```c++
QAction *addSeparator()
```

> **insertSeparator()** — добавляет разделитель перед указанным действием и возвращает указатель на экземпляр класса [[QAction|QAction]]. Прототип метода:
```c++
QAction *insertSeparator(QAction *before)
```

> **addWidget()** — позволяет добавить компонент, например раскрывающийся список. Прототип метода:
```c++
QAction *addWidget(QWidget *widget)
```

> **insertWidget()** — добавляет компонент перед указанным действием и возвращает указатель на экземпляр класса [[QAction|QAction]]. Прототип метода:
```c++
QAction *insertWidget(QAction *before, QWidget *widget)
```

> **widgetForAction()** — возвращает указатель на компонент, который связан с указанным действием. Прототип метода:
```c++
QWidget *widgetForAction(QAction *action) const
```

> **clear()** — удаляет все действия из панели инструментов. Прототип метода:
```c++
void clear()
```

> **setAllowedAreas()** — задает области, к которым можно прикрепить панель инструментов. В качестве параметра указываются константы (или их комбинация через оператор `|`) `Qt::LeftToolBarArea` (слева), `Qt::RightToolBarArea` (справа), `Qt::TopToolBarArea` (сверху), `Qt::BottomToolBarArea` (снизу) или `Qt::AllToolBarAreas`. Прототип метода:
```c++
void setAllowedAreas(Qt::ToolBarAreas areas)
```

> **setMovable()** — если в качестве параметра указано значение `true` (значение по умолчанию), то панель можно перемещать с помощью мыши. Значение `false` запрещает перемещение. Прототип метода:
```c++
void setMovable(bool movable)
```

> **isMovable()** — возвращает значение `true`, если панель можно перемещать с помощью мыши, и `false` — в противном случае. Прототип метода:
```c++
bool isMovable() const
```

> **setFloatable()** — если в качестве параметра указано значение `true` (значение по умолчанию), то панель можно использовать как отдельное окно, а если указано значение `false`, то нет. Прототип метода:
```c++
void setFloatable(bool floatable)
```

> **isFloatable()** — возвращает значение `true`, если панель можно использовать как отдельное окно, и `false` — в противном случае. Прототип метода:
```c++
bool isFloatable() const
```

> **isFloating()** — возвращает значение `true`, если панель отображается в отдельном окне, и `false` — в противном случае. Прототип метода:
```c++
bool isFloating() const
```

> **setToolButtonStyle()** — задает стиль кнопок на панели инструментов. Метод является слотом. Прототип метода:
```c++
void setToolButtonStyle(Qt::ToolButtonStyle toolButtonStyle)
```

В качестве параметра указываются следующие константы:
* **Qt::ToolButtonIconOnly** — отображается только значок;
* **Qt::ToolButtonTextOnly** — отображается только текст;
* **Qt::ToolButtonTextBesideIcon** — текст отображается справа от значка;
* **Qt::ToolButtonTextUnderIcon** — текст отображается под значком;
* **Qt::ToolButtonFollowStyle** — зависит от используемого стиля;

> **toolButtonStyle()** — возвращает стиль кнопок на панели инструментов. Прототип метода:
```c++
Qt::ToolButtonStyle toolButtonStyle() const
```

> **setIconSize()** — задает размеры значков. Метод является слотом. Прототип метода:
```c++
void setIconSize(const QSize &iconSize)
```

> **iconSize()** — возвращает размеры значков. Прототип метода:
```c++
QSize iconSize() const
```

> **toggleViewAction()** — возвращает объект действия (указатель на экземпляр класса [[QAction|QAction]]), с помощью которого можно скрыть или отобразить панель. Прототип метода:
```c++
QAction *toggleViewAction() const
```

Класс `QToolBar` содержит следующие сигналы (перечислены только основные сигналы; полный список смотрите в документации):

> **`actionTriggered(QAction *)`** — генерируется при нажатии кнопки на панели. Внутри обработчика через параметр доступен указатель на экземпляр класса [[QAction|QAction]];

> **`visibilityChanged(bool)`** — генерируется при изменении видимости панели. Внутри обработчика через параметр доступно значение `true`, если панель видима, и `false` — если скрыта;

> **`topLevelChanged(bool)`** — генерируется при изменении положения панели. Внутри обработчика через параметр доступно значение `true`, если панель отображается в отдельном окне, и `false` — если прикреплена к области.

