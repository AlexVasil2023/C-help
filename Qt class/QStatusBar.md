
# QStatusBar (Управление строкой состояния)

Класс `QStatusBar` реализует строку состояния, в которую можно выводить различные сообщения. Помимо текстовой информации в строку состояния можно добавить различные компоненты, например индикатор выполнения процесса. Строка состояния состоит из трех секций:
> *секция для временных сообщений*. Секция реализована по умолчанию. В эту секцию, например, выводятся сообщения, сохраненные в объекте действия с помощью метода `setStatusTip()`, при наведении указателя мыши на пункт меню или кнопку на панели инструментов. Вывести пользовательское сообщение во временную секцию можно с помощью метода `showMessage()`;
>
> *обычная секция.* При выводе временного сообщения содержимое обычной секции скрывается. Чтобы отображать сообщения в обычной секции, необходимо предварительно добавить туда компоненты с помощью метода `addWidget()` или `insertWidget()`. Добавленные компоненты выравниваются по левой стороне строки состояния;
>
> *постоянная секция.* При выводе временного сообщения содержимое постоянной секции не скрывается. Чтобы отображать сообщения в постоянной секции, необходимо предварительно добавить туда компоненты с помощью метода `addPermanentWidget()` или `insertPermanentWidget()`. Добавленные компоненты выравниваются по правой стороне строки состояния.

Получить указатель на строку состояния, установленную в главном окне, позволяет метод `statusBar()` из класса [[QMainWindow|QMainWindow]], а установить пользовательскую панель вместо стандартной можно с помощью метода `setStatusBar()`. Иерархия наследования для класса `QStatusBar` выглядит так:
```
(QObject, QPaintDevice) — QWidget — QStatusBar
```

Формат конструктора класса `QStatusBar`:
```c++
#include <QStatusBar>

QStatusBar(QWidget *parent = nullptr)
```

Класс `QStatusBar` наследует все методы из базовых классов и содержит следующие дополнительные методы (перечислены только основные методы; полный список смотрите в документации):

> **showMessage()** — выводит временное сообщение в строку состояния. Во втором параметре можно указать время в миллисекундах, на которое показывается сообщение. Если во втором параметре указано значение 0, то сообщение показывается до тех пор, пока не будет выведено новое сообщение или вызван метод `clearMessage()`. Метод является слотом. Прототип метода:
```c++
void showMessage(const QString &message, int timeout = 0)
```

> **currentMessage()** — возвращает временное сообщение, отображаемое в строке состояния. Прототип метода:
```c++
QString currentMessage() const
```

> **clearMessage()** — удаляет временное сообщение из строки состояния. Метод является слотом. Прототип метода:
```c++
void clearMessage()
```

> **addWidget()** — добавляет указанный компонент в конец обычной секции. В параметре `stretch` может быть указан фактор растяжения. Прототип метода:
```c++
void addWidget(QWidget *widget, int stretch = 0)
```

> **insertWidget()** — добавляет компонент в указанную позицию обычной секции и возвращает индекс позиции. В параметре `stretch` может быть указан фактор растяжения. Прототип метода:
```c++
int insertWidget(int index, QWidget *widget, int stretch = 0)
```

> **addPermanentWidget()** — добавляет указанный компонент в конец постоянной секции. В параметре `stretch` может быть указан фактор растяжения. Прототип метода:
```c++
void addPermanentWidget(QWidget *widget, int stretch = 0)
```

> **insertPermanentWidget()** — добавляет компонент в указанную позицию постоянной секции и возвращает индекс позиции. В параметре `stretch` может быть указан фактор растяжения. Прототип метода:
```c++
int insertPermanentWidget(int index, QWidget *widget, int stretch = 0)
```

> **removeWidget()** — удаляет компонент из обычной или постоянной секции. Обратите внимание на то, что сам компонент не удаляется, а только скрывается и лишается родителя. В дальнейшем компонент можно добавить в другое место. Прототип метода:
```c++
void removeWidget(QWidget *widget)
```

> **setSizeGripEnabled()** — если в качестве параметра указано значение `true`, то в правом нижнем углу строки состояния будет отображаться маркер изменения размера. Значение `false` скрывает маркер. Прототип метода:
```c++
void setSizeGripEnabled(bool)
```

Класс `QStatusBar` содержит сигнал `messageChanged(const QString&)`, который генерируется при изменении текста во временной секции. Внутри обработчика через параметр доступно новое сообщение или пустая строка.

