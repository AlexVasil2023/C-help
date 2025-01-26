# Таблица

Класс `QTableView` реализует таблицу. Иерархия наследования выглядит так:
```
(QObject, QPaintDevice) — QWidget — QFrame — QAbstractScrollArea —
											— QAbstractItemView — QTableView
```

Формат конструктора класса `QTableView`:
```c++
#include <QTableView>

QTableView(QWidget *parent = nullptr)
```

Класс `QTableView` наследует все методы и сигналы из класса [[QAbstractItemView|QAbstractItemView]] и дополнительно содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **setModel()** — устанавливает модель. Прототип метода:
```c++
virtual void setModel(QAbstractItemModel *model)
```

> **model()** — возвращает указатель на модель. Прототип метода:
```c++
QAbstractItemModel *model() const
```

> **horizontalHeader()** — возвращает указатель на горизонтальный заголовок (экземпляр класса `QHeaderView`). Прототип метода:
```c++
QHeaderView *horizontalHeader() const
```

> **verticalHeader()** — возвращает указатель на вертикальный заголовок (экземпляр класса `QHeaderView`). Прототип метода:
```c++
QHeaderView *verticalHeader() const
```

Скрыть заголовки можно так:
```c++
view->horizontalHeader()->hide();
view->verticalHeader()->hide();
```

> **setRowHeight()** — задает высоту строки с указанным в первом параметре индексом. Прототип метода:
```c++
void setRowHeight(int row, int height)
```

> **setColumnWidth()** — задает ширину столбца с указанным в первом параметре индексом. Прототип метода:
```c++
void setColumnWidth(int column, int width)
```

> **rowHeight()** — возвращает высоту строки. Прототип метода:
```c++
int rowHeight(int row) const
```

> **columnWidth()** — возвращает ширину столбца. Прототип метода:
```c++
int columnWidth(int column) const
```

> **resizeRowToContents()** — изменяет размер указанной строки таким образом, чтобы поместилось все содержимое. Метод является слотом. Прототип метода:
```c++
void resizeRowToContents(int row)
```

> **resizeRowsToContents()** — изменяет размер всех строк таким образом, чтобы поместилось все содержимое. Метод является слотом. Прототип метода:
```c++
void resizeRowsToContents()
```

> **resizeColumnToContents()** — изменяет размер указанного столбца таким образом, чтобы поместилось все содержимое. Метод является слотом. Прототип метода:
```c++
void resizeColumnToContents(int column)
```

> **resizeColumnsToContents()** — изменяет размер всех столбцов таким образом, чтобы поместилось все содержимое. Метод является слотом. Прототип метода:
```c++
void resizeColumnsToContents()
```

> **setSpan()** — растягивает элемент с указанными в первых двух параметрах индексами на заданное количество строк и столбцов. Происходит как бы объединение ячеек таблицы. Прототип метода:
```c++
void setSpan(int row, int column, int rowSpanCount, int columnSpanCount)
```

> **rowSpan()** — возвращает количество ячеек в строке, которое занимает элемент с указанными индексами. Прототип метода:
```c++
int rowSpan(int row, int column) const
```

> **columnSpan()** — возвращает количество ячеек в столбце, которое занимает элемент с указанными индексами. Прототип метода:
```c++
int columnSpan(int row, int column) const
```

> **clearSpans()** — отменяет все объединения ячеек. Прототип метода:
```c++
void clearSpans()
```

> **setRowHidden()** — если во втором параметре указано значение `true`, то строка с индексом, указанным в первом параметре, будет скрыта. Значение `false` отображает строку. Прототип метода:
```c++
void setRowHidden(int row, bool hide)
```

> **hideRow()** — скрывает строку с указанным индексом. Метод является слотом. Прототип метода:
```c++
void hideRow(int row)
```

> **showRow()** — отображает строку с указанным индексом. Метод является слотом. Прототип метода:
```c++
void showRow(int row)
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

> **isRowHidden()** — возвращает значение `true`, если строка с указанным индексом скрыта, и `false` — в противном случае. Прототип метода:
```c++
bool isRowHidden(int row) const
```

> **isColumnHidden()** — возвращает значение `true`, если столбец с указанным индексом скрыт, и `false` — в противном случае. Прототип метода:
```c++
bool isColumnHidden(int column) const
```

> **selectRow()** — выделяет строку с указанным индексом. Метод является слотом. Прототип метода:
```c++
void selectRow(int row)
```

> **selectColumn()** — выделяет столбец с указанным индексом. Метод является слотом. Прототип метода:
```c++
void selectColumn(int column)
```

> **setGridStyle()** — задает стиль линий сетки. Прототип метода:
```c++
void setGridStyle(Qt::PenStyle style)
```

В качестве параметра указываются следующие константы:
* **Qt::NoPen** — линии не выводятся;
* **Qt::SolidLine** — сплошная линия;
* **Qt::DashLine** — штриховая линия;
* **Qt::DotLine** — пунктирная линия;
* **Qt::DashDotLine** — штрих и точка, штрих и точка и т. д.;
* **Qt::DashDotDotLine** — штрих и две точки, штрих и две точки и т. д.;

> **setShowGrid()** — если в качестве параметра указано значение `true`, то сетка будет отображена, а если `false`, то скрыта. Метод является слотом. Прототип метода:
```c++
void setShowGrid(bool show)
```

> **setSortingEnabled()** — если в качестве параметра указано значение `true`, то столбцы можно сортировать с помощью щелчка мышью на заголовке столбца. При этом в заголовке показывается текущее направление сортировки. Прототип метода:
```c++
void setSortingEnabled(bool enable)
```

> **setCornerButtonEnabled()** — если в качестве параметра указано значение `true`, то с помощью кнопки в левом верхнем углу заголовка можно выделить всю таблицу. Значение `false` отключает кнопку. Прототип метода:
```c++
void setCornerButtonEnabled(bool enable)
```

> **setWordWrap()** — если в качестве параметра указано значение `true`, то текст элемента может быть перенесен на другую строку. Прототип метода:
```c++
void setWordWrap(bool on)
```

> **sortByColumn()** — производит сортировку. Если во втором параметре указана константа `Qt::AscendingOrder`, то сортировка производится в прямом порядке, а если `Qt::DescendingOrder`, то в обратном. Метод является слотом. Прототип метода:
```c++
void sortByColumn(int column, Qt::SortOrder order)
```



