
# QMenu

Класс `QMenu` реализует отдельное меню на панели меню, а также вложенное, плавающее и контекстное меню. Иерархия наследования для класса `QMenu` выглядит так:
```
(QObject, QPaintDevice) — QWidget — QMenu
```

Форматы конструктора класса `QMenu`:
```c++
#include <QMenu>

QMenu(QWidget *parent = nullptr)
QMenu(const QString &title, QWidget *parent = nullptr)
```

В параметре `parent` передается указатель на родительский компонент. Внутри текста в параметре `title` символ `&`, указанный перед буквой или цифрой, задает комбинацию клавиш быстрого доступа. В этом случае символ, перед которым указан символ `&`, будет подчеркнут, что является подсказкой пользователю. При одновременном нажатии клавиши `<Alt>` и подчеркнутого символа меню будет выбрано. Чтобы вывести символ `&`, необходимо его удвоить.

Класс `QMenu` наследует все методы из базовых классов и содержит следующие дополнительные методы (перечислены только основные методы; полный список смотрите в документации):

> **addAction()** — добавляет пункт в меню. Прототипы метода:
```c++
void addAction(QAction *action)
QAction *addAction(const QString &text)
QAction *addAction(const QIcon &icon, const QString &text)
QAction *addAction(const QString &text, const QObject *receiver,
		const char *member, const QKeySequence &shortcut = {})
QAction *addAction(const QIcon &icon, const QString &text,
		const QObject *receiver, const char *member,
		const QKeySequence &shortcut = {})
QAction *addAction(const QString &text, Functor functor,
		const QKeySequence &shortcut = 0)
QAction *addAction(const QString &text, const QObject *context,
		Functor functor, const QKeySequence &shortcut = 0)
QAction *addAction(const QIcon &icon, const QString &text,
		Functor functor, const QKeySequence &shortcut = 0)
QAction *addAction(const QIcon &icon, const QString &text,
		const QObject *context, Functor functor,
		const QKeySequence &shortcut = 0)
```

Внутри текста в параметре `text` символ `&`, указанный перед буквой или цифрой, задает комбинацию клавиш быстрого доступа. В этом случае символ, перед которым указан символ `&`, будет подчеркнут, что является подсказкой пользователю. При одновременном нажатии клавиши `<Alt>` и подчеркнутого символа пункт меню будет выбран. Чтобы вывести символ `&`, необходимо его удвоить. Нажатие комбинации клавиш быстрого доступа сработает только в том случае, если меню, в котором находится пункт, является активным.

Параметр `shortcut` задает комбинацию «горячих» клавиш, нажатие которых аналогично выбору пункта в меню. Нажатие комбинации «горячих» клавиш сработает даже в том случае, если меню не является активным.

Добавить пункты в меню и удалить их позволяют следующие методы из класса [[QWidget|QWidget]]:
* **addActions()** — добавляет несколько пунктов в конец меню;
* **insertAction()** — добавляет пункт `action` перед пунктом `before`;
* **insertActions()** — добавляет несколько пунктов, указанных во втором параметре перед пунктом `before`;
* **actions()** — возвращает список с действиями;
* **removeAction()** — удаляет указанное действие из меню.

Прототипы методов:
```c++
void addActions(const QList<QAction *> &actions)
void insertAction(QAction *before, QAction *action)
void insertActions(QAction *before, const QList<QAction *> &actions)
			QList<QAction *> actions() const
void removeAction(QAction *action)
```

> **addSeparator()** — добавляет разделитель в меню и возвращает указатель на экземпляр класса `QAction`. Прототип метода:
```c++
QAction *addSeparator()
```

> **insertSeparator()** — добавляет разделитель перед указанным пунктом и возвращает указатель на экземпляр класса [[QAction|QAction]]. Прототип метода:
```c++
QAction *insertSeparator(QAction *before)
```

> **addMenu()** — добавляет вложенное меню и возвращает указатель на экземпляр класса [[QAction|QAction]]. Прототип метода:
```c++
QAction *addMenu(QMenu *menu)
```

> **addMenu()** — создает вложенное меню, добавляет его в меню и возвращает указатель на него (экземпляр класса `QMenu`). Прототипы метода:
```c++
QMenu *addMenu(const QString &title)
QMenu *addMenu(const QIcon &icon, const QString &title)
```

> **insertMenu()** — добавляет вложенное меню `menu` перед пунктом `before`. Прототип метода:
```c++
QAction *insertMenu(QAction *before, QMenu *menu)
```

> **clear()** — удаляет все действия из меню. Прототип метода:
```c++
void clear()
```

> **isEmpty()** — возвращает значение `true`, если меню не содержит видимых пунктов, и `false` — в противном случае. Прототип метода:
```c++
bool isEmpty() const
```

> **menuAction()** — возвращает объект действия (экземпляр класса [[QAction|QAction]]), связанный с данным меню. С помощью этого объекта можно скрыть меню (с помощью метода `setVisible()`) или сделать его неактивным (с помощью метода `setEnabled()`). Прототип метода:
```c++
QAction *menuAction() const
```

> **setTitle()** — задает название меню. Прототип метода:
```c++
void setTitle(const QString &title)
```

> **title()** — возвращает название меню. Прототип метода:
```c++
QString title() const
```

> **setIcon()** — задает значок меню. Прототип метода:
```c++
void setIcon(const QIcon &icon)
```

> **icon()** — возвращает значок меню. Прототип метода:
```c++
QIcon icon() const
```

> **setActiveAction()** — делает активным указанный пункт. Прототип метода:
```c++
void setActiveAction(QAction *act)
```

> **activeAction()** — возвращает указатель на активный пункт или нулевой указатель. Прототип метода:
```c++
QAction *activeAction() const
```

> **setDefaultAction()** — задает пункт по умолчанию. Прототип метода:
```c++
void setDefaultAction(QAction *act)
```

> **defaultAction()** — возвращает указатель на пункт по умолчанию или нулевой указатель. Прототип метода:
```c++
QAction *defaultAction() const
```

> **setTearOffEnabled()** — если в качестве параметра указано значение `true`, то в начало меню добавляется пункт с пунктирной линией, с помощью щелчка на котором можно оторвать меню от панели и сделать его плавающим (отображаемым в отдельном окне, которое можно разместить в любой части экрана). Прототип метода:
```c++
void setTearOffEnabled(bool)
```

> **isTearOffEnabled()** — возвращает значение `true`, если меню может быть плавающим, и `false` — в противном случае. Прототип метода:
```c++
bool isTearOffEnabled() const
```

> **isTearOffMenuVisible()** — возвращает значение `true`, если плавающее меню отображается в отдельном окне, и `false` — в противном случае. Прототип метода:
```c++
bool isTearOffMenuVisible() const
```

> **hideTearOffMenu()** — скрывает плавающее меню. Прототип метода:
```c++
void hideTearOffMenu()
```

> **setSeparatorsCollapsible()** — если в качестве параметра указано значение `true`, то вместо нескольких разделителей, идущих подряд, будет отображаться один разделитель. Кроме того, разделители, расположенные по краям меню, также будут скрыты. Прототип метода:
```c++
void setSeparatorsCollapsible(bool collapse)
```

> **popup()** — отображает меню по указанным глобальным координатам. Если указан второй параметр, то меню отображается таким образом, чтобы по координатам был расположен указанный пункт меню. Прототип метода:
```c++
void popup(const QPoint &p, QAction *atAction = nullptr)
```

> **exec()** — отображает меню по указанным глобальным координатам и возвращает указатель на экземпляр класса [[QAction|QAction]] (соответствующий выбранному пункту) или нулевой указатель (если пункт не выбран, например нажата клавиша `<Esc>`). Если указан второй параметр, то меню отображается таким образом, чтобы по координатам был расположен указанный пункт меню. Прототипы метода:
```c++
QAction *exec()
QAction *exec(const QPoint &p, QAction *action = nullptr)
```

Для отображения меню можно также воспользоваться статическим методом `exec()`. Метод отображает меню по указанным глобальным координатам и возвращает указатель на экземпляр класса [[QAction|QAction]] (соответствующий выбранному пункту) или нулевой указатель (если пункт не выбран, например нажата клавиша `<Esc>`). Прототипы метода:
```c++
static QAction *exec(const QList<QAction *> &actions,
			const QPoint &pos,
			QAction *at = nullptr, QWidget *parent = nullptr)
```

Если указан параметр `at`, то меню отображается таким образом, чтобы по координатам был расположен указанный пункт меню. В параметре `parent` передается указатель на родительский компонент.

Класс `QMenu` содержит следующие сигналы:

> **`hovered(QAction *)`** — генерируется при наведении указателя мыши на пункт меню. Внутри обработчика через параметр доступен указатель на экземпляр класса [[QAction|QAction]];
>
> **`triggered(QAction *)`** — генерируется при выборе пункта меню. Внутри обработчика через параметр доступен указатель на экземпляр класса [[QAction|QAction]];
>
> **`aboutToShow()`** — генерируется перед отображением меню;
>
> **`aboutToHide()`** — генерируется перед сокрытием меню.

