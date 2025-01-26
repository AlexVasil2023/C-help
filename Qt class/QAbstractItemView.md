# QAbstractItemView

Абстрактный класс `QAbstractItemView` является базовым классом для всех представлений. Иерархия наследования выглядит так:
```
(QObject, QPaintDevice) — QWidget — QFrame — QAbstractScrollArea —
— QAbstractItemView
```

Класс `QAbstractItemView` содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **setCurrentIndex()** — делает элемент с указанным индексом (экземпляр класса `QModelIndex`) текущим. Метод является слотом. Прототип метода:
```c++
void setCurrentIndex(const QModelIndex &index)
```

> **currentIndex()** — возвращает индекс (экземпляр класса `QModelIndex`) текущего элемента. Прототип метода:
```c++
QModelIndex currentIndex() const
```

> **setRootIndex()** — задает корневой элемент. В качестве параметра указывается экземпляр класса `QModelIndex`. Метод является слотом. Прототип метода:
```c++
virtual void setRootIndex(const QModelIndex &index)
```

> **rootIndex()** — возвращает индекс (экземпляр класса `QModelIndex`) корневого элемента. Прототип метода:
```c++
QModelIndex rootIndex() const
```

> **setAlternatingRowColors()** — если в качестве параметра указано значение `true`, то четные и нечетные строки будут иметь разный цвет фона. Прототип метода:
```c++
void setAlternatingRowColors(bool enable)
```

> **setIndexWidget()** — устанавливает компонент в позицию, указанную индексом (экземпляр класса `QModelIndex`). Прототип метода:
```c++
void setIndexWidget(const QModelIndex &index, QWidget *widget)
```

> **indexWidget()** — возвращает указатель на компонент, установленный ранее в позицию, указанную индексом (экземпляр класса `QModelIndex`). Прототип метода:
```c++
QWidget *indexWidget(const QModelIndex &index) const
```

> **setSelectionModel()** — устанавливает модель выделения. Прототип метода:
```c++
virtual void setSelectionModel(QItemSelectionModel *selectionModel)
```

> **selectionModel()** — возвращает указатель на модель выделения. Прототип метода:
```c++
QItemSelectionModel *selectionModel() const
```

> **setSelectionMode()** — задает режим выделения элементов. Прототип метода:
```c++
void setSelectionMode(QAbstractItemView::SelectionMode mode)
```

В качестве параметра указываются следующие константы:
* ***QAbstractItemView::NoSelection** — элементы не могут быть выделены;
* **QAbstractItemView::SingleSelection** — можно выделить только один элемент; 
* **QAbstractItemView::MultiSelection** — можно выделить несколько элементов. Повторный щелчок на элементе снимает выделение;
* **QAbstractItemView::ExtendedSelection** — можно выделить несколько элементов, удерживая нажатой клавишу `<Ctrl>` или щелкнув мышью на элементе левой кнопкой мыши и перемещая мышь, не отпуская кнопку. Если удерживать нажатой клавишу `<Shift>`, все элементы от текущей позиции до позиции щелчка мышью выделяются;
* **QAbstractItemView::ContiguousSelection** — можно выделить несколько элементов, щелкнув мышью на элементе левой кнопкой мыши и перемещая мышь, не отпуская кнопку. Если удерживать нажатой клавишу `<Shift>`, все элементы от текущей позиции до позиции щелчка мышью выделяются;.

> **setSelectionBehavior()** — задает режим выделения. Прототип метода: 
```c++
void setSelectionBehavior(QAbstractItemView::SelectionBehavior behavior)
```
 
В качестве параметра указываются следующие константы:
* **QAbstractItemView::SelectItems** — выделяется отдельный элемент;
* **QAbstractItemView::SelectRows** — выделяется строка целиком;
* **QAbstractItemView::SelectColumns** — выделяется столбец целиком

> **selectAll()** — выделяет все элементы. Метод является слотом. Прототип метода:
```c++
virtual void selectAll()
```

> **clearSelection()** — снимает выделение. Метод является слотом. Прототип метода:
```c++
void clearSelection()
```

> **setEditTriggers()** — задает действие, при котором производится начало редактирования текста элемента. Прототип метода:
```c++
void setEditTriggers(QAbstractItemView::EditTriggers triggers)
```

В качестве параметра указывается комбинация следующих констант:
* **QAbstractItemView::NoEditTriggers** — редактировать нельзя;
* **QAbstractItemView::CurrentChanged** — при выделении элемента;
* **QAbstractItemView::DoubleClicked** — при двойном щелчке мышью;
* **QAbstractItemView::SelectedClicked** — при одинарном щелчке мышью на выделенном элементе;
* **QAbstractItemView::EditKeyPressed** — при нажатии клавиши `<F2>`;
* **QAbstractItemView::AnyKeyPressed** — при нажатии любой символьной клавиши;
* **QAbstractItemView::AllEditTriggers** — при любом вышеперечисленном действии;

> **setIconSize()** — задает размер значков. Прототип метода:
```c++
void setIconSize(const QSize &size)
```

> **setTextElideMode()** — задает режим обрезки текста, если он не помещается в отведенную область. В месте пропуска выводится многоточие. Прототип метода:
```c++
void setTextElideMode(Qt::TextElideMode mode)
```

Могут быть указаны следующие константы:
* **Qt::ElideLeft** — текст обрезается слева;
* **Qt::ElideRight** — текст обрезается справа;
* **Qt::ElideMiddle** — текст обрезается посередине;
* **Qt::ElideNone** — текст не обрезается;

> **setTabKeyNavigation()** — если в качестве параметра указано значение `true`, то между элементами можно перемещаться с помощью клавиши `<Tab>`. Прототип метода:
```c++
void setTabKeyNavigation(bool enable)
```

> **scrollTo()** — прокручивает представление таким образом, чтобы элемент, на который ссылается индекс (экземпляр класса `QModelIndex`), был видим. Прототип метода:
```c++
virtual void scrollTo(const QModelIndex &index, 
						QAbstractItemView::ScrollHint hint = EnsureVisible)
```

В параметре `hint` указываются следующие константы:
* **QAbstractItemView::EnsureVisible** — элемент должен быть в области видимости;
* **QAbstractItemView::PositionAtTop** — элемент отображается в верхней части;
* **QAbstractItemView::PositionAtBottom** — элемент отображается в нижней части;
* **QAbstractItemView::PositionAtCenter** — элемент отображается в центре;

> **scrollToTop()** — прокручивает представление в самое начало. Метод является слотом. Прототип метода:
```c++
void scrollToTop()
```

> **scrollToBottom()** — прокручивает представление в самый конец. Метод является слотом. Прототип метода:
```c++
void scrollToBottom()
```

> **setDragEnabled()** — если в качестве параметра указано значение `true`, то перетаскивание элементов разрешено. Прототип метода:
```c++
void setDragEnabled(bool enable)
```

> **setDragDropMode()** — задает режим технологии `drag & drop`. Прототип метода:
```c++
void setDragDropMode(QAbstractItemView::DragDropMode behavior)
```

В качестве параметра указываются следующие константы:
* **QAbstractItemView::NoDragDrop** — `drag & drop` не поддерживается;
* **QAbstractItemView::DragOnly** — поддерживается только перетаскивание;
* **QAbstractItemView::DropOnly** — поддерживается только сбрасывание;
* **QAbstractItemView::DragDrop** — поддерживается перетаскивание и сбрасывание;
* **QAbstractItemView::InternalMove** — перетаскивание и сбрасывание самого элемента, а не его копии, представление принимает операции только от себя;

> **setDefaultDropAction()** — задает действие по умолчанию при перетаскивании. Прототип метода:
```c++
void setDefaultDropAction(Qt::DropAction dropAction)
```

> **setDropIndicatorShown()** — если в качестве параметра указано значение `true`, то позиция возможного сброса элемента будет выделена. Прототип метода:
```c++
void setDropIndicatorShown(bool enable)
```

> **setAutoScroll()** — если в качестве параметра указано значение `true`, то при перетаскивании пункта будет производиться автоматическая прокрутка. Прототип метода:
```c++
void setAutoScroll(bool enable)
```

> **setAutoScrollMargin()** — задает расстояние от края области, при достижении которого будет производиться автоматическая прокрутка области. Прототип метода:
```c++
void setAutoScrollMargin(int margin)
```

> **activated(const QModelIndex&)** — генерируется при активизации элемента, например путем нажатия клавиши `<Enter>`. Внутри обработчика через параметр доступен индекс элемента (экземпляр класса `QModelIndex`);
>
> **pressed(const QModelIndex&)** — генерируется при нажатии кнопки мыши над элементом. Внутри обработчика через параметр доступен индекс элемента (экземпляр класса `QModelIndex`); 
>
> **clicked(const QModelIndex&)** — генерируется при нажатии и отпускании кнопки мыши над элементом. Внутри обработчика через параметр доступен индекс элемента (экземпляр класса `QModelIndex`);
> 
> **doubleClicked(const QModelIndex&)** — генерируется при двойном щелчке мышью над элементом. Внутри обработчика через параметр доступен индекс элемента (экземпляр класса `QModelIndex`);
> 
> **entered(const QModelIndex&)** — генерируется при вхождении указателя мыши в область элемента. Чтобы сигнал сработал, необходимо включить обработку перемещения указателя с помощью метода `setMouseTracking()` из класса [[QWidget|QWidget]]. Внутри обработчика через параметр доступен индекс элемента (экземпляр класса `QModelIndex`);
> 
> **viewportEntered()** — генерируется при вхождении указателя мыши в область компонента. Чтобы сигнал сработал, необходимо включить обработку перемещения указателя с помощью метода `setMouseTracking()` из класса [[QWidget|QWidget]].


