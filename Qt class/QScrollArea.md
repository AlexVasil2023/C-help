# QScrollArea 

Класс `QScrollArea` реализует область с полосами прокрутки. Если компонент не помещается в размеры области, то автоматически отображаются полосы прокрутки. Изменение положения полос прокрутки с помощью мыши автоматически приводит к прокрутке содержимого области. Иерархия наследования выглядит так:
```
(QObject, QPaintDevice) — QWidget — QFrame — QAbstractScrollArea — QScrollArea
```

Конструктор класса `QScrollArea` имеет следующий формат:
```c++
#include <QScrollArea>

QScrollArea(QWidget *parent = nullptr)
```

Класс `QScrollArea` содержит следующие методы:

> **setWidget()** — добавляет компонент в область прокрутки. Прототип метода:
```c++
void setWidget(QWidget *widget)
```

> **widget()** — возвращает указатель на компонент, который расположен внутри области. Прототип метода:
```c++
QWidget *widget() const
```

> **setWidgetResizable()** — если в качестве параметра указано значение `true`, то при изменении размеров области будут изменяться и размеры компонента. Значение `false` запрещает изменение размеров компонента. Прототип метода:
```c++
void setWidgetResizable(bool resizable)
```

Получение значения:
```c++
bool widgetResizable() const
```

> **setAlignment()** — задает местоположение компонента внутри области, когда размеры области больше размеров компонента. Прототип метода:
```c++
void setAlignment(Qt::Alignment)
```

Пример:
```c++
scrollArea.setAlignment(Qt::AlignCenter);
```

Получение значения:
```c++
Qt::Alignment alignment() const
```

> **ensureVisible()** — прокручивает область к точке с координатами (`x, y`) и полями `xmargin` и `ymargin`. Прототип метода:
```c++
void ensureVisible(int x, int y, int xmargin = 50, int ymargin = 50)
```

> **ensureWidgetVisible()** — прокручивает область таким образом, чтобы `childWidget` был видим. Прототип метода:
```c++
void ensureWidgetVisible(QWidget *childWidget, int xmargin = 50, int ymargin = 50)
```

> **takeWidget()** — удаляет компонент из области и возвращает указатель на него. Сам компонент не удаляется. Прототип метода:
```c++
QWidget *takeWidget()
```

Класс `QScrollArea` наследует следующие методы из класса` QAbstractScrollArea` (перечислены только основные методы; полный список смотрите в документации):

> **horizontalScrollBar()** — возвращает указатель на горизонтальную полосу прокрутки (экземпляр класса [[QScrollBar|QScrollBar]]). Прототип метода:
```c++
QScrollBar *horizontalScrollBar() const
```

> **verticalScrollBar()** — возвращает указатель на вертикальную полосу прокрутки (экземпляр класса [[QScrollBar|QScrollBar]]). Прототип метода:
```c++
QScrollBar *verticalScrollBar() const
```

> **cornerWidget()** — возвращает указатель на компонент, расположенный в правом нижнем углу между двумя полосами прокрутки. Прототип метода:
```c++
QWidget *cornerWidget() const
```

> **viewport()** — возвращает указатель на окно области прокрутки. Прототип метода:
```c++
QWidget *viewport() const
```

> **setHorizontalScrollBarPolicy()** — устанавливает режим отображения горизонтальной полосы прокрутки. Прототип метода:
```c++
void setHorizontalScrollBarPolicy(Qt::ScrollBarPolicy mode)
```

Получение значения:
```c++
Qt::ScrollBarPolicy horizontalScrollBarPolicy() const
```

> **setVerticalScrollBarPolicy()** — устанавливает режим отображения вертикальной полосы прокрутки. Прототип метода:
```c++
void setVerticalScrollBarPolicy(Qt::ScrollBarPolicy mode)
```

В параметре `mode` могут быть указаны следующие константы:

> **Qt::ScrollBarAsNeeded** — полоса прокрутки отображается только в том случае, если размеры компонента больше размеров области;
> 
> **Qt::ScrollBarAlwaysOff** — полоса прокрутки никогда не отображается;
> 
> **Qt::ScrollBarAlwaysOn** — полоса прокрутки всегда отображается.

Получение значения:

```c++
Qt::ScrollBarPolicy verticalScrollBarPolicy() const
```


