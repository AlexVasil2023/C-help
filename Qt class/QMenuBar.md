
# QMenuBar

Класс `QMenuBar` описывает горизонтальную панель меню. Панель меню реализована в главном окне приложения по умолчанию. Получить указатель на нее можно с помощью метода `menuBar()` из класса [[QMainWindow|QMainWindow]]. Установить свою панель позволяет метод `setMenuBar()`. Иерархия наследования для класса `QMenuBar` выглядит так:
```
(QObject, QPaintDevice) — QWidget — QMenuBar
```

Конструктор класса `QMenuBar` имеет следующий формат:
```c++
#include <QMenuBar>

QMenuBar(QWidget *parent = nullptr)
```

Класс `QMenuBar` наследует все методы из базовых классов и содержит следующие дополнительные методы (перечислены только основные методы; полный список смотрите в документации):

> **addMenu()** — добавляет меню на панель и возвращает указатель на экземпляр класса [[QAction|QAction]], с помощью которого, например, можно скрыть меню (с помощью метода `setVisible()`) или сделать его неактивным (с помощью метода `setEnabled()`). Прототип метода:
```c++
QAction *addMenu(QMenu *menu)
```

> **addMenu()** — создает меню, добавляет его на панель и возвращает указатель на него (экземпляр класса [[QMenu|QMenu]]). Внутри текста в параметре `title` символ `&`, указанный перед буквой или цифрой, задает комбинацию клавиш быстрого доступа. В этом случае символ, перед которым указан символ `&`, будет подчеркнут, что является подсказкой пользователю. При одновременном нажатии клавиши `<Alt>` и подчеркнутого символа меню будет выбрано. Чтобы вывести символ `&`, необходимо его удвоить. Прототипы метода:
```c++
QMenu *addMenu(const QString &title)
QMenu *addMenu(const QIcon &icon, const QString &title)
```

> **insertMenu()** — добавляет меню menu перед пунктом before. Прототип метода:
```c++
QAction *insertMenu(QAction *before, QMenu *menu)
```

> **addAction()** — добавляет пункт в меню. Прототипы метода:
```c++
QAction *addAction(const QString &text)
QAction *addAction(const QString &text, const QObject *receiver,
					const char *member)
QAction *addAction(const QString &text, const Obj *receiver,
					PointerToMemberFunctionOrFunctor method)
QAction *addAction(const QString &text, Functor functor)
```

> **clear()** — удаляет все действия из панели меню. Прототип метода:
```c++
void clear()
```

> **setActiveAction()** — делает активным указанное действие. Прототип метода:
```c++
void setActiveAction(QAction *act)
```

> **activeAction()** — возвращает активное действие (указатель на экземпляр класса [[QAction|QAction]]) или нулевой указатель. Прототип метода:
```c++
QAction *activeAction() const
```

> **setDefaultUp()** — если в качестве параметра указано значение `true`, то пункты меню будут отображаться выше панели меню, а не ниже. Прототип метода:
```c++
void setDefaultUp(bool)
```

> **setVisible()** — если в качестве параметра указано значение `false`, то панель меню будет скрыта. Значение true отображает панель меню. Прототип метода:
```c++
virtual void setVisible(bool visible)
```

Класс `QMenuBar` содержит следующие сигналы:
> **`hovered(QAction *)`** — генерируется при наведении указателя мыши на пункт меню. Внутри обработчика через параметр доступен указатель на экземпляр класса [[QAction|QAction]];
> 
> **`triggered(QAction *)`** — генерируется при выборе пункта меню. Внутри обработчика через параметр доступен указатель на экземпляр класса [[QAction|QAction]].

