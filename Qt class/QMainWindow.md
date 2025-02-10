# QMainWindow

Класс `QMainWindow` реализует главное окно приложения, содержащее меню, панели инструментов, прикрепляемые панели, центральный компонент и строку состояния. Иерархия наследования для класса `QMainWindow` выглядит так:
```
(QObject, QPaintDevice) — QWidget — QMainWindow
```

Конструктор класса `QMainWindow` имеет следующий формат:

```c++
#include <QMainWindow>
QMainWindow(QWidget *parent = nullptr, Qt::WindowFlags flags = Qt::WindowFlags())
```

В параметре `parent` передается указатель на родительское окно. Какие именно [[QWidget#Указание типа окна|значения можно указать в параметре flags,]].

Класс `QMainWindow` наследует все методы из базовых классов и содержит следующие дополнительные методы (перечислены только основные методы; полный список смотрите в документации):

> **setCentralWidget()** — делает указанный компонент центральным компонентом главного окна. Прототип метода:
```c++
void setCentralWidget(QWidget *widget)
```

> **centralWidget()** — возвращает указатель на центральный компонент или нулевой указатель, если компонент не был установлен. Прототип метода:
```c++
QWidget *centralWidget() const
```

> **menuBar()** — возвращает указатель на главное меню. Прототип метода:
```c++
QMenuBar *menuBar() const
```

> **menuWidget()** — возвращает указатель на компонент, в котором расположено главное меню. Прототип метода:
```c++
QWidget *menuWidget() const
```

> **setMenuBar()** — позволяет установить пользовательское меню вместо стандартного. Прототип метода:
```c++
void setMenuBar(QMenuBar *menuBar)
```

> **setMenuWidget()** — позволяет установить компонент главного меню. Прототип метода:
```c++
void setMenuWidget(QWidget *menuBar)
```

> **createPopupMenu()** — создает контекстное меню с пунктами, позволяющими отобразить или скрыть панели инструментов и прикрепляемые панели, и возвращает указатель на меню (экземпляр класса [[QMenu|QMenu]]). Это меню по умолчанию отображается при щелчке правой кнопкой мыши в области меню, панели инструментов или прикрепляемых панелей. Переопределив этот метод, можно реализовать собственное контекстное меню. Прототип метода:
```c++
virtual QMenu *createPopupMenu()
```

> **statusBar()** — возвращает указатель на строку состояния. Прототип метода:
```c++
QStatusBar *statusBar() const
```

> **setStatusBar()** — позволяет заменить стандартную строку состояния. Прототип метода:
```c++
void setStatusBar(QStatusBar *statusbar)
```

> **addToolBar()** — добавляет панель инструментов. Прототипы метода:
```c++
void addToolBar(QToolBar *toolbar)
void addToolBar(Qt::ToolBarArea area, QToolBar *toolbar)
QToolBar *addToolBar(const QString &title)
```

Первый прототип добавляет панель инструментов в верхнюю часть окна. Второй прототип позволяет указать местоположение панели. В качестве параметра `area` могут быть указаны следующие константы: `Qt::LeftToolBarArea` (слева), `Qt::RightToolBarArea` (справа), `Qt::TopToolBarArea` (сверху) или `Qt::BottomToolBarArea` (снизу). Третий прототип создает панель инструментов с указанным именем, добавляет ее в верхнюю область окна и возвращает указатель на нее;

> **insertToolBar()** — добавляет панель `toolbar` перед панелью `before`. Прототип метода:
```c++
void insertToolBar(QToolBar *before, QToolBar *toolbar)
```

> **removeToolBar()** — удаляет панель инструментов из окна и скрывает ее. При этом объект панели инструментов не удаляется и далее может быть добавлен в другое место. Прототип метода:
```c++
void removeToolBar(QToolBar *toolbar)
```

> **toolBarArea()** — возвращает местоположение указанной панели инструментов в виде значений констант `Qt::LeftToolBarArea` (слева), `Qt::RightToolBarArea` (справа), **Qt::TopToolBarArea** (сверху), `Qt::BottomToolBarArea` (снизу) или `Qt::NoToolBarArea` (положение не определено). Прототип метода:
```c++
Qt::ToolBarArea toolBarArea(const QToolBar *toolbar) const
```

> **setToolButtonStyle()** — задает стиль кнопок на панели инструментов. Прототип метода:
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

> **setIconSize()** — задает размеры значков. Прототип метода:
```c++
void setIconSize(const QSize &iconSize)
```

> **iconSize()** — возвращает размеры значков. Прототип метода:
```c++
QSize iconSize() const
```

> **setAnimated()** — если в качестве параметра указано значение `true` (используется по умолчанию), то вставка панелей инструментов и прикрепляемых панелей в новое место по окончании перемещения будет производиться с анимацией. Метод является слотом. Прототип метода:
```c++
void setAnimated(bool enabled)
```

> **addToolBarBreak()** — вставляет разрыв в указанное место после всех добавленных ранее панелей. По умолчанию панели добавляются друг за другом на одной строке. С помощью этого метода можно поместить панели инструментов на двух и более строках. Прототип метода:
```c++
void addToolBarBreak(Qt::ToolBarArea area = Qt::TopToolBarArea)
```

> **insertToolBarBreak()** — вставляет разрыв перед указанной панелью инструментов. Прототип метода:
```c++
void insertToolBarBreak(QToolBar *before)
```

> **removeToolBarBreak()** — удаляет разрыв перед указанной панелью. Прототип метода:
```c++
void removeToolBarBreak(QToolBar *before)
```

> **toolBarBreak()** — возвращает значение `true`, если перед указанной панелью инструментов существует разрыв, и `false` — в противном случае. Прототип метода:
```c++
bool toolBarBreak(QToolBar *toolbar) const
```

> **addDockWidget()** — добавляет прикрепляемую панель. Прототипы метода:
```c++
void addDockWidget(Qt::DockWidgetArea area,
					QDockWidget *dockwidget)
void addDockWidget(Qt::DockWidgetArea area,
					QDockWidget *dockwidget, Qt::Orientation orientation)
```

Первый прототип добавляет прикрепляемую панель в указанную область окна. В качестве параметра `area` могут быть указаны следующие константы: `Qt::LeftDockWidgetArea` (слева), `Qt::RightDockWidgetArea` (справа), `Qt::TopDockWidgetArea` (сверху) или `Qt::BottomDockWidgetArea` (снизу). Второй прототип позволяет дополнительно указать ориентацию при добавлении панели. В качестве параметра `orientation` могут быть указаны следующие константы: `Qt::Horizontal` или `Qt::Vertical`. Если указана константа `Qt::Horizontal`, то добавляемая панель будет расположена справа от ранее добавленной панели, а если `Qt::Vertical`, то снизу;

> **removeDockWidget()** — удаляет панель из окна и скрывает ее. При этом объект панели не удаляется и далее может быть добавлен в другую область. Прототип метода:
```c++
void removeDockWidget(QDockWidget *dockwidget)
```

> **dockWidgetArea()** — возвращает местоположение указанной панели в виде значений констант `Qt::LeftDockWidgetArea` (слева), `Qt::RightDockWidgetArea` (справа), `Qt::TopDockWidgetArea` (сверху), `Qt::BottomDockWidgetArea` (снизу) или `Qt::NoDockWidgetArea` (положение не определено). Прототип метода: 
```c++
Qt::DockWidgetArea dockWidgetArea(QDockWidget *dockwidget) const
```

> **setDockOptions()** — устанавливает опции для прикрепляемых панелей. Значение по умолчанию: `AnimatedDocks` | `AllowTabbedDocks`. Прототип метода:
```c++
void setDockOptions(QMainWindow::DockOptions options)
```

В качестве значения указывается комбинация (через оператор `|`) следующих констант:
* **QMainWindow::AnimatedDocks** — если опция установлена, то вставка панелей в новое место по окончании перемещения будет производиться с анимацией;
* **QMainWindow::AllowNestedDocks** — если опция установлена, то области (в которые можно добавить панели) могут быть разделены, чтобы вместить больше панелей;
* **QMainWindow::AllowTabbedDocks** — если опция установлена, то одна панель может быть наложена пользователем на другую. При этом добавляется панель с вкладками. С помощью щелчка мышью на заголовке вкладки можно выбрать отображаемую в данный момент панель;
* **QMainWindow::ForceTabbedDocks** — если опция установлена, то панели не могут быть расположены рядом друг с другом. При этом опция `AllowNestedDocks` игнорируется;
* **QMainWindow::VerticalTabs** — если опция установлена, то заголовки вкладок отображаются с внешнего края области (если область справа, то заголовки вкладок справа; если область слева, то заголовки слева; если область сверху, то заголовки вкладок сверху; если область снизу, то заголовки вкладок снизу). Если опция не установлена, то заголовки вкладок отображаются снизу. Опция `AllowTabbedDocks` должна быть установлена.

> **ОБРАТИТЕ ВНИМАНИЕ**
>Опции необходимо устанавливать до добавления прикрепляемых панелей. Исключением являются опции `AnimatedDocks` и `VerticalTabs`.

> **dockOptions()** — возвращает комбинацию установленных опций. Прототип метода:
```c++
QMainWindow::DockOptions dockOptions() const
```

> **setDockNestingEnabled()** — если указано значение `true`, то метод устанавливает опцию `AllowNestedDocks`, а если указано значение `false`, то сбрасывает опцию. Метод является слотом. Прототип метода:
```c++
void setDockNestingEnabled(bool enabled)
```

> **isDockNestingEnabled()** — возвращает значение `true`, если опция `AllowNestedDocks` установлена, и `false` — в противном случае. Прототип метода:
```c++
bool isDockNestingEnabled() const
```

> **setTabPosition()** — задает позицию отображения заголовков вкладок прикрепляемых панелей для указанной области. По умолчанию заголовки вкладок отображаются снизу. Прототип метода:
```c++
void setTabPosition(Qt::DockWidgetAreas areas, 
					QTabWidget::TabPosition tabPosition)
```

В качестве параметра `tabPosition` могут быть указаны следующие константы:
* **QTabWidget::North** — сверху;
* **QTabWidget::South** — снизу;
* **QTabWidget::West** — слева;
* **QTabWidget::East** — справа;

> **tabPosition()** — возвращает позицию отображения заголовков вкладок прикрепляемых панелей для указанной области. Прототип метода:
```c++
QTabWidget::TabPosition tabPosition(Qt::DockWidgetArea area) const
```

> **setTabShape()** — задает форму углов ярлыков вкладок в области заголовка. Прототип метода:
```c++
void setTabShape(QTabWidget::TabShape tabShape)
```

Могут быть указаны следующие константы:
* **QTabWidget::Rounded** — скругленные углы (значение по умолчанию);
* **QTabWidget::Triangular** — треугольная форма;

> **tabShape()** — возвращает форму углов ярлыков вкладок в области заголовка. Прототип метода:
```c++
QTabWidget::TabShape tabShape() const
```

> **setCorner()** — позволяет закрепить указанный угол за определенной областью. По умолчанию верхние углы закреплены за верхней областью, а нижние углы — за нижней областью. Прототип метода
```c++
void setCorner(Qt::Corner corner, Qt::DockWidgetArea area)
```

В качестве параметра `area` могут быть указаны следующие константы: `Qt::LeftDockWidgetArea` (слева), `Qt::RightDockWidgetArea` (справа), `Qt::TopDockWidgetArea` (сверху) или `Qt::BottomDockWidgetArea` (снизу). В параметре `corner` указываются следующие константы:
* **Qt::TopLeftCorner** — левый верхний угол;
* **Qt::TopRightCorner** — правый верхний угол;
* **Qt::BottomLeftCorner** — левый нижний угол;
* **Qt::BottomRightCorner** — правый нижний угол;

> **corner()** — возвращает область, за которой закреплен указанный угол. Прототип метода:
```c++
Qt::DockWidgetArea corner(Qt::Corner corner) const
```

> **splitDockWidget()** — разделяет область, занимаемую панелью `first`, и добавляет панель `first` в первую часть, а панель `second` — во вторую часть. Порядок расположения частей зависит от параметра `orientation`. В качестве параметра `orientation` могут быть указаны следующие константы: `Qt::Horizontal` или `Qt::Vertical`. Если указана константа `Qt::Horizontal`, то панель `second` будет расположена справа, а если `Qt::Vertical`, то снизу. Если панель `first` расположена на вкладке, то панель `second` будет добавлена на новую вкладку, при этом разделения области не происходит. Прототип метода:
```c++
void splitDockWidget(QDockWidget *first, QDockWidget *second,
					Qt::Orientation orientation)
```

> **tabifyDockWidget()** — размещает панель `second` над панелью `first`, создавая таким образом область с вкладками. Прототип метода:
```c++
void tabifyDockWidget(QDockWidget *first, QDockWidget *second)
```

> **tabifiedDockWidgets()** — возвращает список указателей на панели, которые расположены на других вкладках в области панели, указанной в качестве параметра. Прототип метода:
```c++
QList<QDockWidget *> tabifiedDockWidgets(QDockWidget *dockwidget) const
```

> **saveState()** — возвращает экземпляр класса [[QByteArray|QByteArray]] с размерами и положением всех панелей инструментов и прикрепляемых панелей. Эти данные можно сохранить (например, в файл), а затем восстановить с помощью метода `restoreState()`. Прототипы методов:
```c++
QByteArray saveState(int version = 0) const
bool restoreState(const QByteArray &state, int version = 0)
```

Обратите внимание на то, что все панели инструментов и прикрепляемые панели должны иметь уникальные объектные имена. Задать объектное имя можно с помощью метода `setObjectName()` из класса [[QObject|QObject]]. Прототип метода:
```c++
void setObjectName(const QString &name)
```

Чтобы сохранить размеры окна, следует воспользоваться методом `saveGeometry()` из класса [[QWidget|QWidget]]. Метод возвращает экземпляр класса [[QByteArray|QByteArray]] с размерами окна. Чтобы восстановить размеры окна, следует воспользоваться методом `restoreGeometry()`. Прототипы методов:
```c++
QByteArray saveGeometry() const
bool restoreGeometry(const QByteArray &geometry)
```

> **restoreDockWidget()** — восстанавливает состояние указанной панели, если она создана после вызова метода `restoreState()`. Метод возвращает значение `true`, если состояние панели успешно восстановлено, и `false` — в противном случае. Прототип метода:
```c++
bool restoreDockWidget(QDockWidget *dockwidget)
```
