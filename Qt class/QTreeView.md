# QTreeView (Иерархический список)

Класс `QTreeView` реализует иерархический список. Иерархия наследования:
```
(QObject, QPaintDevice) — QWidget — QFrame — QAbstractScrollArea —
											— QAbstractItemView — QTreeView
```

Формат конструктора класса `QTreeView`:
```c++
#include <QTreeView>

QTreeView(QWidget *parent = nullptr)
```

Класс `QTreeView` наследует все методы и сигналы из класса [[QAbstractItemView|QAbstractItemView]] и дополнительно содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):
> **setModel()** — устанавливает модель. Прототип метода:
```c++
virtual void setModel(QAbstractItemModel *model)
```

> **model()** — возвращает указатель на модель. Прототип метода:
```c++
QAbstractItemModel *model() const
```

> **header()** — возвращает указатель на горизонтальный заголовок (экземпляр класса `QHeaderView`). Прототип метода:
```c++
QHeaderView *header() const
```

> **setColumnWidth()** — задает ширину столбца с указанным в первом параметре индексом. Прототип метода:
```c++
void setColumnWidth(int column, int width)
```

> **columnWidth()** — возвращает ширину столбца. Прототип метода:
```c++
int columnWidth(int column) const
```

> **resizeColumnToContents()** — изменяет ширину указанного столбца таким образом, чтобы поместилось все содержимое. Метод является слотом. Прототип метода:
```c++
void resizeColumnToContents(int column)
```

> **setUniformRowHeights()** — если в качестве параметра указано значение `true`, то все элементы будут иметь одинаковую высоту. Прототип метода:
```c++
void setUniformRowHeights(bool uniform)
```

> **setHeaderHidden()** — если в качестве параметра указано значение `true`, то заголовок будет скрыт. Значение `false` отображает заголовок. Прототип метода:
```c++
void setHeaderHidden(bool hide)
```

> **isHeaderHidden()** — возвращает значение `true`, если заголовок скрыт, и `false` — в противном случае. Прототип метода:
```c++
bool isHeaderHidden() const
```

> **setColumnHidden()** — если во втором параметре указано значение `true`, то столбец с индексом, указанным в первом параметре, будет скрыт. Значение `false` отображает столбец. Прототип метода:
```c++
void setColumnHidden(int column, bool hide)
```

> **hideColumn()** — скрывает столбец с указанным индексом. Метод является слотом. Прототип метода:
```c++
void hideColumn(int column)
```

> **showColumn()** — отображает столбец с указанным индексом. Метод является слотом. Прототип метода:
```c++
void showColumn(int column)
```

> **isColumnHidden()** — возвращает значение `true`, если столбец с указанным индексом скрыт, и `false` — в противном случае. Прототип метода:
```c++
bool isColumnHidden(int column) const
```

> **setRowHidden()** — если в третьем параметре указано значение `true`, то строка с индексом row и родителем parent будет скрыта. Значение `false` отображает строку. Прототип метода:
```c++
void setRowHidden(int row, const QModelIndex &parent, bool hide)
```

> **isRowHidden()** — возвращает значение `true`, если строка с указанным индексом `row` и родителем `parent` скрыта, и `false` — в противном случае. Прототип метода:
```c++
bool isRowHidden(int row, const QModelIndex &parent) const
```

> **setExpanded()** — если во втором параметре указано значение `true`, то элементы, которые являются дочерними для элемента с указанным в первом параметре индексом, будут отображены, а если `false`, то скрыты. Прототип метода:
```c++
void setExpanded(const QModelIndex &index, bool expanded)
```

> **expand()** — отображает элементы, которые являются дочерними для элемента с указанным индексом. Метод является слотом. Прототип метода:
```c++
void expand(const QModelIndex &index)
```

> **expandToDepth()** — отображает все дочерние элементы до указанного уровня. Метод является слотом. Прототип метода:
```c++
void expandToDepth(int depth)
```

> **expandAll()** — отображает все дочерние элементы. Метод является слотом. Прототип метода:
```c++
void expandAll()
```

> **collapse()** — скрывает элементы, которые являются дочерними для элемента с указанным индексом. Метод является слотом. Прототип метода:
```c++
void collapse(const QModelIndex &index)
```

> **collapseAll()** — скрывает все дочерние элементы. Метод является слотом. Прототип метода:
```c++
void collapseAll()
```

> **isExpanded()** — возвращает значение `true`, если элементы, которые являются дочерними для элемента с указанным индексом, отображены, и `false` — в противном случае. Прототип метода:
```c++
bool isExpanded(const QModelIndex &index) const
```

> **setItemsExpandable()** — если в качестве параметра указано значение `false`, то пользователь не сможет отображать или скрывать дочерние элементы. Прототип метода:
```c++
void setItemsExpandable(bool enable)
```

> **setAnimated()** — если в качестве параметра указано значение `true`, то отображение и сокрытие дочерних элементов будет производиться с анимацией. Прототип метода:
```c++
void setAnimated(bool enable)
```

> **setIndentation()** — задает отступ для дочерних элементов. Прототип метода:
```c++
void setIndentation(int)
```

> **setRootIsDecorated()** — если в качестве параметра указано значение `false`, то для элементов верхнего уровня не будут показываться компоненты, с помощью которых производится отображение и сокрытие дочерних элементов. Прототип метода:
```c++
void setRootIsDecorated(bool show)
```

> **setSortingEnabled()** — если в качестве параметра указано значение `true`, то столбцы можно сортировать с помощью щелчка мышью на заголовке столбца. При этом в заголовке показывается текущее направление сортировки. Прототип метода:
```c++
void setSortingEnabled(bool enable)
```

> **sortByColumn()** — производит сортировку. Если во втором параметре указана константа `Qt::AscendingOrder`, то сортировка производится в прямом порядке, а если `Qt::DescendingOrder`, то в обратном. Метод является слотом. Прототип метода:
```c++
void sortByColumn(int column, Qt::SortOrder order)
```

> **setWordWrap()** — если в качестве параметра указано значение `true`, то текст элемента может быть перенесен на другую строку. Прототип метода:
```c++
void setWordWrap(bool on)
```

Класс `QTreeView` содержит следующие сигналы:
> **expanded(const QModelIndex&)** — генерируется при отображении дочерних элементов. Внутри обработчика через параметр доступен индекс (экземпляр класса `QModelIndex`) элемента;
>
>**collapsed(const QModelIndex&)** — генерируется при сокрытии дочерних элементов. Внутри обработчика через параметр доступен индекс (экземпляр класса `QModelIndex`) элемента.





