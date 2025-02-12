
# Класс QMdiArea

Класс `QMdiArea` реализует MDI-область, внутри которой могут располагаться вложенные окна (экземпляры класса `QMdiSubWindow`). Иерархия наследования для класса `QMdiArea` выглядит так:
```
(QObject, QPaintDevice) — QWidget — QFrame — QAbstractScrollArea — QMdiArea
```

Конструктор класса `QMdiArea` имеет следующий формат:
```c++
#include <QMdiArea>

QMdiArea(QWidget *parent = nullptr)
```

Класс `QMdiArea` содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **addSubWindow()** — создает вложенное окно, добавляет в него компонент `widget` и возвращает указатель на созданное окно (экземпляр класса `QMdiSubWindow`). Прототип метода:
```c++
QMdiSubWindow *addSubWindow(QWidget *widget,
				Qt::WindowFlags windowFlags = Qt::WindowFlags())
```

Чтобы окно автоматически удалялось при закрытии, необходимо установить опцию `WA_DeleteOnClose`, а чтобы отобразить окно, следует вызвать метод `show()`;

> **activeSubWindow()** — возвращает указатель на активное вложенное окно (экземпляр класса `QMdiSubWindow`) или нулевой указатель. Прототип метода:
```c++
QMdiSubWindow *activeSubWindow() const
```

> **currentSubWindow()** — возвращает указатель на текущее вложенное окно (экземпляр класса `QMdiSubWindow`) или нулевой указатель. Результат выполнения этого метода аналогичен результату выполнения метода `activeSubWindow()`, если MDI-область находится в активном окне. Прототип метода:
```c++
QMdiSubWindow *currentSubWindow() const
```

> **subWindowList()** — возвращает список с указателями на все вложенные окна (экземпляры класса `QMdiSubWindow`), добавленные в MDI-область, или пустой список. Прототип метода:
```c++
QList<QMdiSubWindow *> subWindowList(
					QMdiArea::WindowOrder order = CreationOrder) const
```

В параметре `order` указываются следующие константы:
* **`QMdiArea::CreationOrder`** — окна в списке расположены в порядке добавления в MDI-область;
* **`QMdiArea::StackingOrder`** — окна в списке расположены в порядке наложения. Последний элемент в списке будет содержать указатель на самое верхнее окно, а последний элемент — указатель на самое нижнее окно;
* **`QMdiArea::ActivationHistoryOrder`** — окна в списке расположены в порядке истории получения фокуса. Последний элемент в списке будет содержать указатель на окно, получившее фокус последним;

> **removeSubWindow()** — удаляет вложенное окно из MDI-области. Прототип метода:
```c++
void removeSubWindow(QWidget *widget)
```

> **setActiveSubWindow()** — делает указанное вложенное окно активным. Если в качестве параметра указано значение `nullptr`, то все окна станут неактивными. Метод является слотом. Прототип метода:
```c++
void setActiveSubWindow(QMdiSubWindow *window)
```

> **setActivationOrder()** — задает режим передачи фокуса при использовании методов `activatePreviousSubWindow()`, `activateNextSubWindow()` и др. В параметре `order` оказываются такие же константы, как и в параметре `order` метода `subWindowList()`. Прототип метода:
```c++
void setActivationOrder(QMdiArea::WindowOrder order)
```

> **activationOrder()** — возвращает режим передачи фокуса. Прототип метода:
```c++
QMdiArea::WindowOrder activationOrder() const
```

> **activatePreviousSubWindow()** — делает активным предыдущее вложенное окно. Метод является слотом. Порядок передачи фокуса устанавливается с помощью метода `setActivationOrder()`. Прототип метода:
```c++
void activatePreviousSubWindow()
```

> **activateNextSubWindow()** — делает активным следующее вложенное окно. Метод является слотом. Порядок передачи фокуса устанавливается с помощью метода `setActivationOrder()`. Прототип метода:
```c++
void activateNextSubWindow()
```

> **closeActiveSubWindow()** — закрывает активное вложенное окно. Метод является слотом. Прототип метода:
```c++
void closeActiveSubWindow()
```

> **closeAllSubWindows()** — закрывает все вложенные окна. Метод является слотом. Прототип метода:
```c++
void closeAllSubWindows()
```

> **cascadeSubWindows()** — упорядочивает вложенные окна, располагая их каскадом. Метод является слотом. Прототип метода:
```c++
void cascadeSubWindows()
```

> **tileSubWindows()** — упорядочивает вложенные окна, располагая их мозаикой. Метод является слотом. Прототип метода:
```c++
void tileSubWindows()
```

> **setViewMode()** — задает режим отображения документов в MDI-области. Прототип метода:
```c++
void setViewMode(QMdiArea::ViewMode mode)
```

В параметре `mode` указываются следующие константы:
* **QMdiArea::SubWindowView** — в отдельном окне с рамкой (по умолчанию);
* **QMdiArea::TabbedView** — на отдельной вкладке на панели с вкладками;

> **viewMode()** — возвращает режим отображения документов в MDI-области. Прототип метода:
```c++
QMdiArea::ViewMode viewMode() const
```

> **setTabPosition()** — задает позицию отображения заголовков вкладок при использовании режима `TabbedView`. По умолчанию заголовки вкладок отображаются сверху. Прототип метода:
```c++
void setTabPosition(QTabWidget::TabPosition position)
```

В качестве параметра `position` могут быть указаны следующие константы:
* **QTabWidget::North** — сверху;
* **QTabWidget::South** — снизу;
* **QTabWidget::West** — слева;
* **QTabWidget::East** — справа;

> **tabPosition()** — возвращает позицию отображения заголовков вкладок при использовании режима `TabbedView`. Прототип метода:
```c++
QTabWidget::TabPosition tabPosition() const
```

> **setTabShape()** — задает форму углов ярлыков вкладок при использовании режима `TabbedView`. Прототип метода:
```c++
void setTabShape(QTabWidget::TabShape shape)
```

Могут быть указаны следующие константы:
* **`QTabWidget::Rounded`** — скругленные углы (значение по умолчанию);
* **`QTabWidget::Triangular`** — треугольная форма;

> **tabShape()** — возвращает форму углов ярлыков вкладок в области заголовка при использовании режима `TabbedView`. Прототип метода:
```c++
QTabWidget::TabShape tabShape() const
```

> **setBackground()** — задает кисть для заполнения фона MDI-области. Прототип метода:
```c++
void setBackground(const QBrush &background)
```

> **setOption()** — если во втором параметре указано значение `true`, то производит установку опции, а если `false`, то сбрасывает опцию. В параметре `option` может быть указана константа `DontMaximizeSubWindowOnActivation`. Если эта опция установлена, то при передаче фокуса из максимально раскрытого окна отображаемое окно не будет максимально раскрываться. Прототип метода:
```c++
void setOption(QMdiArea::AreaOption option, bool on = true)
```

> **testOption()** — возвращает значение `true`, если указанная опция установлена, и `false` — в противном случае. Прототип метода:
```c++
bool testOption(QMdiArea::AreaOption option) const
```

Класс `QMdiArea` содержит сигнал `subWindowActivated(QMdiSubWindow *)`, который генерируется при изменении активности вложенных окон. Внутри обработчика через параметр доступен указатель на активное вложенное окно (экземпляр класса `QMdiSubWindow`) или нулевой указатель.
