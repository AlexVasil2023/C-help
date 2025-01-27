# Управление выделением элементов

Класс `QItemSelectionModel` реализует модель, позволяющую централизованно управлять выделением сразу в нескольких представлениях. Установить модель выделения позволяет метод `setSelectionModel()` из класса [[QAbstractItemView]], а получить указатель на модель можно с помощью метода `selectionModel()`. Если одна модель выделения установлена сразу в нескольких представлениях, то выделение элемента в одном представлении приведет к выделению соответствующего элемента в другом представлении. Иерархия наследования выглядит так:
```
QObject — QItemSelectionModel
```

Форматы конструктора класса `QItemSelectionModel`:
```c++
#include <QItemSelectionModel>

QItemSelectionModel(QAbstractItemModel *model, QObject *parent)
QItemSelectionModel(QAbstractItemModel *model = nullptr)
```

Класс `QItemSelectionModel` содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **hasSelection()** — возвращает значение `true`, если существует выделенный элемент, и `false` — в противном случае. Прототип метода:
```c++
bool hasSelection() const
```

> **isSelected()** — возвращает значение `true`, если элемент с указанным индексом (экземпляр класса `QModelIndex`) выделен, и `false` — в противном случае. Прототип метода:
```c++
bool isSelected(const QModelIndex &index) const
```

> **isRowSelected()** — возвращает значение `true`, если строка с индексом `row` и родителем `parent` выделена, и `false` — в противном случае. Прототип метода:
```c++
bool isRowSelected(int row, const QModelIndex &parent = QModelIndex()) const
```

> **isColumnSelected()** — возвращает значение `true`, если столбец с индексом `column` и родителем `parent` выделен, и `false` — в противном случае. Прототип метода:
```c++
bool isColumnSelected(int column, const QModelIndex &parent = QModelIndex()) const
```

> **rowIntersectsSelection()** — возвращает значение `true`, если строка с индексом `row` и родителем `parent` содержит выделенный элемент, и `false` — в противном случае. Прототип метода:
```c++
bool rowIntersectsSelection(int row,
						const QModelIndex &parent = QModelIndex()) const
```

> **columnIntersectsSelection()** — возвращает значение `true`, если столбец с индексом `column` и родителем `parent` содержит выделенный элемент, и `false` — в противном случае. Прототип метода:
```c++
bool columnIntersectsSelection(int column,
						const QModelIndex &parent = QModelIndex()) const
```

> **selectedIndexes()** — возвращает список индексов (экземпляры класса `QModelIndex`) выделенных элементов или пустой список. Прототип метода:
```c++
QModelIndexList selectedIndexes() const
```

> **selectedRows()** — возвращает список индексов (экземпляры класса `QModelIndex`) выделенных элементов из указанного столбца. Элемент попадет в список только в том случае, если строка выделена полностью. Прототип метода:
```c++
QModelIndexList selectedRows(int column = 0) const
```

> **selectedColumns()** — возвращает список индексов (экземпляры класса `QModelIndex`) выделенных элементов из указанной строки. Элемент попадет в список только в том случае, если столбец выделен полностью. Прототип метода:
```c++
QModelIndexList selectedColumns(int row = 0) const
```

> **selection()** — возвращает экземпляр класса `QItemSelection`. Прототип метода:
```c++
const QItemSelection selection() const
```

> **select()** — изменяет выделение элемента. Метод является слотом. Прототипы метода:
```c++
virtual void select(const QItemSelection &selection,
						QItemSelectionModel::SelectionFlags command)
						
virtual void select(const QModelIndex &index,
						QItemSelectionModel::SelectionFlags command)
```

Во втором параметре указываются следующие константы (или их комбинация через оператор `|`):
* **QItemSelectionModel::NoUpdate** — без изменений;
* **QItemSelectionModel::Clear** — снимает выделение всех элементов;
* **QItemSelectionModel::Select** — выделяет элемент;
* **QItemSelectionModel::Deselect** — снимает выделение с элемента;
* **QItemSelectionModel::Toggle** — выделяет элемент, если он не выделен, или снимает выделение, если элемент был выделен;
* **QItemSelectionModel::Current** — изменяет выделение текущего элемента;
* **QItemSelectionModel::Rows** — индекс будет расширен так, чтобы охватить всю строку;
* **QItemSelectionModel::Columns** — индекс будет расширен так, чтобы охватить весь столбец;
* **QItemSelectionModel::SelectCurrent** — комбинация `Select | Current`;
* **QItemSelectionModel::ToggleCurrent** — комбинация `Toggle | Current`;
* **QItemSelectionModel::ClearAndSelect** — комбинация `Clear | Select`;

> **setCurrentIndex()** — делает элемент текущим и изменяет режим выделения. Метод является слотом. Прототип метода:
```c++
virtual void setCurrentIndex(const QModelIndex &index,
						QItemSelectionModel::SelectionFlags command)
```

> **currentIndex()** — возвращает индекс (экземпляр класса `QModelIndex`) текущего элемента. Прототип метода:
```c++
QModelIndex currentIndex() const
```

> **clearSelection()** — снимает все выделения. Метод является слотом. Прототип метода:
```c++
void clearSelection()
```

Класс `QItemSelectionModel` содержит следующие основные сигналы:
> **currentChanged(const QModelIndex&, const QModelIndex&)** — генерируется при изменении индекса текущего элемента. Внутри обработчика через первый параметр доступен индекс текущего элемента, а через второй параметр — индекс предыдущего элемента;
>
> **currentRowChanged(const QModelIndex&, const QModelIndex&)** — генерируется, когда текущий элемент перемещается в другую строку. Внутри обработчика через первый параметр доступен индекс текущего элемента, а через второй параметр — индекс предыдущего элемента;
> 
> **currentColumnChanged(const QModelIndex&, const QModelIndex&)** — генерируется, когда текущий элемент перемещается в другой столбец. Внутри обработчика через первый параметр доступен индекс текущего элемента, а через второй параметр — индекс предыдущего элемента;
> 
> **selectionChanged(const QItemSelection&, const QItemSelection&)** — генерируется при изменении выделения.





