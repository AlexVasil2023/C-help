# QSplitter

Класс `QSplitter` позволяет изменять размеры добавленных компонентов с помощью мыши. Иерархия наследования выглядит так:

```
(QObject, QPaintDevice) — QWidget — QFrame — QSplitter
```

Конструктор класса `QSplitter` имеет два формата:

```c++
#include <QSplitter>

QSplitter(QWidget *parent = nullptr)
QSplitter(Qt::Orientation orientation, QWidget *parent = nullptr)
```

В параметре `parent` передается указатель на родительский компонент. Если параметр не указан или имеет значение [[nullptr_t|nullptr]], то компонент будет обладать своим собственным окном. Параметр `orientation` задает ориентацию размещения компонентов. Могут быть заданы константы `Qt::Horizontal` (по горизонтали) или `Qt::Vertical` (по вертикали). Если параметр не указан, то компоненты размещаются по горизонтали. Пример использования класса `QSplitter`:

```c++
QWidget window;
window.setWindowTitle("Класс QSplitter");
window.resize(400, 250);

QSplitter *splitter = new QSplitter(Qt::Vertical);
QSplitter *splitter2 = new QSplitter(Qt::Horizontal);

QLabel *label1 = new QLabel("Содержимое 1");
QLabel *label2 = new QLabel("Содержимое 2");
QLabel *label3 = new QLabel("Содержимое 3");

label1->setFrameStyle(QFrame::Box | QFrame::Plain);
label2->setFrameStyle(QFrame::Box | QFrame::Plain);
label3->setFrameStyle(QFrame::Box | QFrame::Plain);

splitter2->addWidget(label1);
splitter2->addWidget(label2);
splitter->addWidget(splitter2);
splitter->addWidget(label3);

QVBoxLayout *vbox = new QVBoxLayout();
vbox->addWidget(splitter);

window.setLayout(vbox);
window.show();
```

Класс `QSplitter` содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **addWidget()** — добавляет компонент в конец контейнера. Прототип метода:
```c++
void addWidget(QWidget *widget) 
```

> **insertWidget()** — добавляет компонент в указанную позицию. Если компонент был добавлен ранее, то он будет перемещен в новую позицию. Прототип метода:
```c++
void insertWidget(int index, QWidget *widget)
```

> **setOrientation()** — задает ориентацию размещения компонентов. Могут быть заданы константы `Qt::Horizontal` (по горизонтали) или `Qt::Vertical` (по вертикали). Прототип метода:
```c++
void setOrientation(Qt::Orientation)
```

Получение значения:
```c++
Qt::Orientation orientation() const
```

> **setHandleWidth()** — задает ширину компонента-разделителя, взявшись за который мышью, можно изменить размер области. Прототип метода:
```c++
void setHandleWidth(int)
```

Получение значения:
```c++
int handleWidth() const
```

> **saveState()** — возвращает экземпляр класса [[QByteArray|QByteArray]] с размерами всех областей. Эти данные можно сохранить (например, в файл), а затем восстановить с помощью метода `restoreState()`. Прототипы методов:
```c++
QByteArray saveState() const
bool restoreState(const QByteArray &state)
```

> **setChildrenCollapsible()** — если в параметре указано значение `false`, то пользователь не сможет уменьшить размеры всех компонентов до нуля. По умолчанию размер может быть нулевым, даже если установлены минимальные размеры компонента. Прототип метода:
```c++
void setChildrenCollapsible(bool)
```

Получение значения:
```c++
bool childrenCollapsible() const
```

> **setCollapsible()** — значение `false` во втором параметре запрещает уменьшение размеров до нуля для компонента с указанным индексом. Прототип метода:
```c++
void setCollapsible(int index, bool collapse)
```

Получение значения:
```c++
bool isCollapsible(int index) const
```

> **setOpaqueResize()** — если в качестве параметра указано значение `false`, то размеры компонентов изменятся только после окончания перемещения границы и отпускания кнопки мыши. В процессе перемещения мыши вместе с ней будет перемещаться специальный компонент в виде линии. Прототип метода:
```c++
void setOpaqueResize(bool opaque = true)
```

Получение значения:
```c++
bool opaqueResize() const
```

> **setStretchFactor()** — задает фактор растяжения для компонента с указанным индексом. Прототип метода:
```c++
void setStretchFactor(int index, int stretch)
```

> **setSizes()** — задает размеры всех компонентов. Для горизонтального контейнера указывается список со значениями ширины каждого компонента, а для вертикального контейнера — список со значениями высоты каждого компонента. Прототип метода:
```c++
void setSizes(const QList<int> &list)
```

> **sizes()** — возвращает список с размерами (шириной или высотой). Прототип метода:
```c++
QList<int> sizes() const
```

> **count()** — возвращает количество компонентов. Прототип метода:
```c++
int count() const
```

> **widget()** — возвращает указатель на компонент, который расположен по указанному индексу. Прототип метода:
```c++
QWidget *widget(int index) const
```

> **indexOf()** — возвращает индекс области, в которой расположен компонент. Если компонент не найден, возвращается значение –1. Прототип метода:
```c++
int indexOf(QWidget *widget) const
```

При изменении размеров генерируется сигнал `splitterMoved(int,int)`. Через первый параметр внутри обработчика доступна новая позиция, а через второй параметр — индекс перемещаемого разделителя.

