[[#Модели]]
1. [[#Доступ к данным внутри модели|Доступ к данным внутри модели]] 
2. [[#Класс QStringListModel|Класс QStringListModel]]
3. [[#Класс QStandardItemModel|Класс QStandardItemModel]]
4. [[#Класс QStandardItem|Класс QStandardItem]]
5. 
6. 
# Модели

Для отображения данных в виде списков и таблиц применяется концепция «модель/представление», позволяющая отделить данные от их представления и избежать дублирования данных. В основе концепции лежат следующие составляющие: 
>
> **модель** — является «оберткой» над данными. Позволяет добавлять, изменять и удалять данные, а также содержит методы для чтения данных и управления ими;
> 
> **представление** — предназначено для отображения элементов модели. В нескольких представлениях можно установить одну модель;
> 
> **модель выделения** — позволяет управлять выделением. Если одна модель выделения установлена сразу в нескольких представлениях, то выделение элемента в одном представлении приведет к выделению соответствующего элемента в другом представлении;
> 
> **промежуточная модель** — является прослойкой между моделью и представлением. Позволяет производить сортировку и фильтрацию данных на основе базовой модели без изменения порядка следования элементов в базовой модели;
> 
> **делегат** — выполняет рисование каждого элемента в отдельности, а также позволяет произвести редактирование данных. В своих программах вы можете наследовать стандартные классы делегатов и полностью управлять отображением данных и их редактированием. За подробной информацией по классам делегатов обращайтесь к документации.

## Доступ к данным внутри модели

Доступ к данным внутри модели реализуется с помощью класса `QModelIndex`. Формат конструктора класса:
```c++
#include <QModelIndex>
QModelIndex()
```

Наиболее часто экземпляр класса `QModelIndex` создается с помощью метода `index()` из класса модели или метода `currentIndex()` из класса `QAbstractItemView`. 

Класс `QModelIndex` содержит следующие методы

> **isValid()** — возвращает значение `true`, если объект является валидным, и `false` — в противном случае. Прототип метода:
```c++
bool isValid() const
```

> **data()** — возвращает данные, хранящиеся в указанной роли. Прототип метода:
```c++
QVariant data(int role = Qt::DisplayRole) const
```

> **flags()** — содержит свойства элемента. Прототип метода:
```c++
Qt::ItemFlags flags() const
```

Возвращает комбинацию следующих констант:

* **Qt::NoItemFlags** — 0 — свойства не установлены;
* **Qt::ItemIsSelectable** — 1 — можно выделить;
* **Qt::ItemIsEditable** — 2 — можно редактировать;
* **Qt::ItemIsDragEnabled** — 4 — можно перетаскивать;
* **Qt::ItemIsDropEnabled** — 8 — можно сбрасывать перетаскиваемые данные;
* **Qt::ItemIsUserCheckable** — 16 — может быть включен и выключен;
* **Qt::ItemIsEnabled** — 32 — пользователь может взаимодействовать с элементом;
* **Qt::ItemIsAutoTristate** — 64;
* **Qt::ItemNeverHasChildren** — 128;
* **Qt::ItemIsUserTristate** — 256;

> **row()** — возвращает индекс строки. Прототип метода:
```c++
int row() const
```

> **column()** — возвращает индекс столбца. Прототип метода:
```c++
int column() const
```

> **parent()** — возвращает индекс элемента (экземпляр класса `QModelIndex`), расположенного на один уровень выше по иерархии. Если элемента нет, то возвращается невалидный экземпляр класса `QModelIndex`. Прототип метода:
```c++
QModelIndex parent() const
```

> **sibling()** — возвращает индекс элемента (экземпляр класса `QModelIndex`), расположенного на том же уровне вложенности на указанной позиции. Если элемента нет, то возвращается невалидный экземпляр класса `QModelIndex`. Прототип метода:
```c++
QModelIndex sibling(int row, int column) const
```

> **model()** — возвращает указатель на модель. Прототип метода:
```c++
const QAbstractItemModel *model() const
```

Следует учитывать, что модель может измениться и экземпляр класса `QModelIndex` будет ссылаться на несуществующий уже элемент. Если необходимо сохранить ссылку на элемент, то следует воспользоваться классом `QPersistentModelIndex`, который содержит те же самые методы, но обеспечивает валидность ссылки.

## Класс QStringListModel

Класс `QStringListModel` реализует одномерную модель, содержащую список строк. Модель можно отобразить с помощью классов [[QListView|QListView]], [[QComboBox|QComboBox]] и др., передав в метод `setModel()`. Иерархия наследования:
```
QObject — QAbstractItemModel — QAbstractListModel — QStringListModel
```

Форматы конструктора класса `QStringListModel`:
```c++
#include <QStringListModel>

QStringListModel(const QStringList &strings, QObject *parent = nullptr)
QStringListModel(QObject *parent = nullptr)
```

Класс `QStringListModel` содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **setStringList()** — устанавливает список строк. Прототип метода:
```c++
void setStringList(const QStringList &strings)
```

> **stringList()** — возвращает список строк, хранимых в модели. Прототип метода:
```c++
QStringList stringList() const
```

> **insertRows()** — вставляет указанное количество элементов в позицию, заданную первым параметром. Остальные элементы сдвигаются в конец списка. Метод возвращает значение `true`, если операция успешно выполнена. Прототип метода:
```c++
virtual bool insertRows(int row, int count, 
						const QModelIndex &parent = QModelIndex())
```

> **removeRows()** — удаляет указанное количество элементов, начиная с позиции, заданной первым параметром. Метод возвращает значение `true`, если операция успешно выполнена. Прототип метода:
```c++
virtual bool removeRows(int row, int count, 
						const QModelIndex &parent = QModelIndex())
```

> **setData()** — задает значение для роли `role` элемента, на который указывает индекс `index`. Метод возвращает значение `true`, если операция успешно выполнена. Прототип метода:
```c++
virtual bool setData(const QModelIndex &index,
					 const QVariant &value, int role = Qt::EditRole)
```

> **data()** — возвращает данные, хранимые в указанной роли элемента, на который ссылается индекс `index`. Прототип метода:
```c++
virtual QVariant data(const QModelIndex &index,
					  int role = Qt::DisplayRole) const
```

> **rowCount()** — возвращает количество строк в модели. Прототип метода:
```c++
virtual int rowCount(const QModelIndex &parent = QModelIndex()) const
```

> **sort()** — производит сортировку. Если во втором параметре указана константа `Qt::AscendingOrder`, то сортировка производится в прямом порядке, а если `Qt::DescendingOrder`, то в обратном. Прототип метода:
```c++
virtual void sort(int column, Qt::SortOrder order = Qt::AscendingOrder)
```

Класс `QStringListModel` наследует метод `index()` из класса `QAbstractListModel`, который возвращает индекс (экземпляр класса `QModelIndex`) внутри модели. Прототип метода:
```c++
virtual QModelIndex index(int row, int column = 0,
						  const QModelIndex &parent = QModelIndex()) const
```

## Класс QStandardItemModel

Класс `QStandardItemModel` реализует двумерную (таблица) и иерархическую модели. Каждый элемент такой модели представлен классом [[#Класс QStandardItem|QStandardItem]]. Модель можно отобразить с помощью классов [[QTableView|QTableView]], [[QTreeView|QTreeView]] и др., передав в метод `setModel()`. Иерархия наследования:
```
QObject — QAbstractItemModel — QStandardItemModel
```

Форматы конструктора класса `QStandardItemModel`:
```c++
#include <QStandardItemModel>

QStandardItemModel(int rows, int columns, QObject *parent = nullptr)
QStandardItemModel(QObject *parent = nullptr)
```

Класс `QStandardItemModel` содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **setRowCount()** — задает количество строк. Прототип метода:
```c++
void setRowCount(int rows)
```

> **setColumnCount()** — задает количество столбцов. Прототип метода:
```c++
void setColumnCount(int columns)
```

> **rowCount()** — возвращает количество строк. Прототип метода:
```c++
virtual int rowCount(const QModelIndex &parent = QModelIndex()) const
```

> **columnCount()** — возвращает количество столбцов. Прототип метода:
```c++
virtual int columnCount(const QModelIndex &parent = QModelIndex()) const
```

> **setItem()** — устанавливает элемент в указанную ячейку. Прототипы метода:
```c++
void setItem(int row, int column, QStandardItem *item)
void setItem(int row, QStandardItem *item)
```

Пример заполнения таблицы:
```c++
QTableView *view = new QTableView();
QStandardItemModel *model = new QStandardItemModel(&window);

model->setRowCount(3);
model->setColumnCount(4);

for (int row = 0, r = model->rowCount(); row < r; ++row) {
	for (int col = 0, c = model->columnCount(); col < c; ++col) {
		QStandardItem *item = new QStandardItem(
							QString("%1, %2").arg(row).arg(col));
		
		model->setItem(row, col, item);
	}
}

view->setModel(model);
```

> **appendRow()** — добавляет одну строку в конец модели. Прототипы метода:
```c++
void appendRow(const QList<QStandardItem *> &items)
void appendRow(QStandardItem *item)
```

> **appendColumn()** — добавляет один столбец в конец модели. Прототип метода:
```c++
void appendColumn(const QList<QStandardItem *> &items)
```

> **insertRow()** — добавляет одну строку в указанную позицию модели. Прототипы метода:
```c++
void insertRow(int row, const QList<QStandardItem *> &items)
void insertRow(int row, QStandardItem *item)
bool insertRow(int row, const QModelIndex &parent = QModelIndex())
```

> **insertRows()** — добавляет несколько строк в указанную позицию модели. Метод возвращает значение true, если операция успешно выполнена. Прототип метода:
```c++
virtual bool insertRows(int row, int count, 
						const QModelIndex &parent = QModelIndex())
```

> **insertColumn()** — добавляет один столбец в указанную позицию модели. Прототипы метода:
```c++
void insertColumn(int column, const QList<QStandardItem *> &items)
bool insertColumn(int column, const QModelIndex &parent = QModelIndex())
```

> **insertColumns()** — добавляет несколько столбцов в указанную позицию. Метод  возвращает значение `true`, если операция успешно выполнена. Прототип метода:
```c++
virtual bool insertColumns(int column, int count, 
						   const QModelIndex &parent = QModelIndex())
```

> **removeRows()** — удаляет указанное количество строк, начиная со строки, имеющей индекс row. Метод возвращает значение `true`, если операция успешно выполнена. Прототип метода:
```c++
virtual bool removeRows(int row, int count,
						const QModelIndex &parent = QModelIndex())
```

> **removeColumns()** — удаляет указанное количество столбцов, начиная со столбца, имеющего индекс `column`. Метод возвращает значение `true`, если операция успешно выполнена. Прототип метода:
```c++
virtual bool removeColumns(int column, int count, 
						   const QModelIndex &parent = QModelIndex())
```

> **takeItem()** — удаляет указанный элемент из модели и возвращает его. Прототип метода:
```c++
QStandardItem *takeItem(int row, int column = 0)
```

> **takeRow()** — удаляет указанную строку из модели и возвращает ее. Прототип метода:
```c++
QList<QStandardItem *> takeRow(int row)
```

> **takeColumn()** — удаляет указанный столбец из модели и возвращает его. Прототип метода:

```c++
QList<QStandardItem *> takeColumn(int column)
```

> **clear()** — удаляет все элементы из модели. Прототип метода:
```c++
void clear()
```

> **item()** — возвращает указатель на элемент, расположенный в указанной ячейке. Прототип метода:
```c++
QStandardItem *item(int row, int column = 0) const
```

> **invisibleRootItem()** — возвращает указатель на невидимый корневой элемент модели. Прототип метода:
```c++
QStandardItem *invisibleRootItem() const
```

**itemFromIndex()** — возвращает указатель на элемент, на который ссылается индекс index. Прототип метода:
```c++
QStandardItem *itemFromIndex(const QModelIndex &index) const
```
> **index()** — возвращает индекс элемента (экземпляр класса `QModelIndex`), расположенного в указанной ячейке. Прототип метода:
```c++
virtual QModelIndex index(int row, int column, 
						  const QModelIndex &parent = QModelIndex()) const
```

> **indexFromItem()** — возвращает индекс элемента (экземпляр класса `QModelIndex`), указатель на который передан в качестве параметра. Прототип метода:
```c++
QModelIndex indexFromItem(const QStandardItem *item) const
```

> **setData()** — задает значение для роли `role` элемента, на который указывает индекс `index`. Метод возвращает значение `true`, если операция успешно выполнена. Прототип метода:
```c++
virtual bool setData(const QModelIndex &index, 
					 const QVariant &value, int role = Qt::EditRole)
```

> **data()** — возвращает данные, хранимые в указанной роли элемента, на который ссылается индекс `index`. Прототип метода:
```c++
virtual QVariant data(const QModelIndex &index, int role = Qt::DisplayRole) const
```

> **setHorizontalHeaderLabels()** — задает заголовки столбцов. В качестве параметра указывается список строк. Прототип метода:
```c++
void setHorizontalHeaderLabels(const QStringList &labels)
```

> **setVerticalHeaderLabels()** — задает заголовки строк. В качестве параметра указывается список строк. Прототип метода:
```c++
void setVerticalHeaderLabels(const QStringList &labels)
```

> **setHorizontalHeaderItem()** — задает заголовок столбца. Прототип метода:
```c++
void setHorizontalHeaderItem(int column, QStandardItem *item)
```

> **setVerticalHeaderItem()** — задает заголовок строки. Прототип метода:
```c++
void setVerticalHeaderItem(int row, QStandardItem *item)
```

> **horizontalHeaderItem()** — возвращает указатель на заголовок столбца. Прототип метода:
```c++
QStandardItem *horizontalHeaderItem(int column) const
```

> **verticalHeaderItem()** — возвращает указатель на заголовок строки. Прототип метода:
```c++
QStandardItem *verticalHeaderItem(int row) const
```

> **setHeaderData()** — задает данные для указанной роли заголовка. В первом параметре указывается индекс строки или столбца, а во втором параметре — ориентация (константы `Qt::Horizontal` или `Qt::Vertical`). Если параметр `role` не указан, то используется значение `EditRole`. Метод возвращает значение `true`, если операция успешно выполнена. Прототип метода:
```c++
virtual bool setHeaderData(int section, 
						   Qt::Orientation orientation, const QVariant &value,
						   int role = Qt::EditRole)
```

> **headerData()** — возвращает данные, хранящиеся в указанной роли заголовка. В первом параметре указывается индекс строки или столбца, а во втором параметре — ориентация. Если параметр `role` не указан, то используется значение `DisplayRole`. Прототип метода:
```c++
virtual QVariant headerData(int section, Qt::Orientation orientation, 
							int role = Qt::DisplayRole) const
```

> **findItems()** — производит поиск элемента внутри модели в указанном в параметре `column` столбце. Допустимые значения параметра `flags` мы рассматривали в [[QComboBox#Поиск элемента внутри списка|разд.]]. В качестве значения метод возвращает список элементов или пустой список. Прототип метода:
```c++
QList<QStandardItem *> findItems(const QString &text, 
								 Qt::MatchFlags flags = Qt::MatchExactly,
								 int column = 0) const
```

> **sort()** — производит сортировку. Если во втором параметре указана константа `Qt::AscendingOrder`, то сортировка производится в прямом порядке, а если `t::DescendingOrder`, то в обратном. Прототип метода:
```c++
virtual void sort(int column, Qt::SortOrder order = Qt::AscendingOrder)
```

> **setSortRole()** — задает [[Roles Element|роль]], по которой производится сортировка. Прототип метода:
```c++
void setSortRole(int role)
```

> **parent()** — возвращает индекс (экземпляр класса `QModelIndex`) родительского элемента. В качестве параметра указывается индекс (экземпляр класса `QModelIndex`) элемента-потомка. Прототип метода:
```c++
virtual QModelIndex parent(const QModelIndex &child) const
```

> **hasChildren(**) — возвращает значение `true`, если существует элемент, расположенный на один уровень ниже по иерархии, и `false` — в противном случае. Прототип метода:
```c++
virtual bool hasChildren(const QModelIndex &parent = QModelIndex()) const
```

При изменении значения элемента генерируется сигнал `itemChanged(QStandardItem *)`. Внутри обработчика через параметр доступен указатель на элемент.

## Класс QStandardItem

Каждый элемент модели `QStandardItemModel` представлен классом `QStandardItem`. Этот класс не только описывает элемент, но и позволяет создавать вложенные структуры. Форматы конструктора класса:
```c++
QStandardItem()
QStandardItem(const QString &text)
QStandardItem(const QIcon &icon, const QString &text)
QStandardItem(int rows, int columns = 1)
```

Класс `QStandardItem` содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **setRowCount()** — задает количество дочерних строк. Прототип метода:
```c++
void setRowCount(int rows)
``` 

> **setColumnCount()** — задает количество дочерних столбцов. Прототип метода:
```c++
void setColumnCount(int columns)
```

> **rowCount()** — возвращает количество дочерних строк. Прототип метода:
```c++
int rowCount() const
```

> **columnCount()** — возвращает количество дочерних столбцов. Прототип метода:
```c++
int columnCount() const
```

> **row()** — возвращает индекс строки в дочерней таблице родительского элемента или значение –1, если элемент не содержит родителя. Прототип метода:
```c++
int row() const
```

> **column()** — возвращает индекс столбца в дочерней таблице родительского элемента или значение –1, если элемент не содержит родителя. Прототип метода:
```c++
int column() const
```

> **setChild()** — устанавливает элемент в указанную ячейку дочерней таблицы. Прототипы метода:
```c++
void setChild(int row, int column, QStandardItem *item)
void setChild(int row, QStandardItem *item)
```

Пример создания иерархии:
```c++
QStandardItem *parent = new QStandardItem(3, 4);
parent->setText("Элемент-родитель");

for (int row = 0; row < 3; ++row) {
	for (int col = 0; col < 4; ++col) {
		QStandardItem *item = new QStandardItem(
				QString("%1, %2").arg(row).arg(col));
		parent->setChild(row, col, item);
	}
}

model->appendRow(parent);
```

> **appendRow()** — добавляет одну строку в конец дочерней таблицы. Прототипы метода:
```c++
void appendRow(const QList<QStandardItem *> &items)
void appendRow(QStandardItem *item)
```

> **appendRows()** — добавляет несколько строк в конец дочерней таблицы. Прототип метода:
```c++
void appendRows(const QList<QStandardItem *> &items)
```

> **appendColumn()** — добавляет один столбец в конец дочерней таблицы. Прототип метода:
```c++
void appendColumn(const QList<QStandardItem *> &items)
```

> **insertRow()** — добавляет одну строку в указанную позицию дочерней таблицы. Прототипы метода:
```c++
void insertRow(int row, const QList<QStandardItem *> &items)
void insertRow(int row, QStandardItem *item)
```

> **insertRows()** — добавляет несколько строк в указанную позицию дочерней таблицы. Прототипы метода:
```c++
void insertRows(int row, const QList<QStandardItem *> &items)
void insertRows(int row, int count)
```

> **insertColumn()** — добавляет один столбец в указанную позицию дочерней таблицы. Прототип метода:
```c++
void insertColumn(int column, const QList<QStandardItem *> &items)
```

> **insertColumns()** — добавляет несколько столбцов в указанную позицию. Прототип метода:
```c++
void insertColumns(int column, int count)
```

> **removeRow()** — удаляет строку с указанным индексом. Прототип метода:
```c++
void removeRow(int row)
```

> **removeRows()** — удаляет указанное количество строк, начиная со строки, имеющей индекс `row`. Прототип метода:
```c++
void removeRows(int row, int count)
```

> **removeColumn()** — удаляет столбец с указанным индексом. Прототип метода:
```c++
void removeColumn(int column)
```

> **removeColumns()** — удаляет указанное количество столбцов, начиная со столбца, имеющего индекс `column`. Прототип метода:
```c++
void removeColumns(int column, int count)
```

> **takeChild()** — удаляет указанный дочерний элемент и возвращает его. Прототип метода:
```c++
QStandardItem *takeChild(int row, int column = 0)
```

> **takeRow()** — удаляет указанную строку из дочерней таблицы и возвращает ее. Прототип метода:
```c++
QList<QStandardItem *> takeRow(int row)
```

> **takeColumn()** — удаляет указанный столбец из дочерней таблицы и возвращает его. Прототип метода:
```c++
QList<QStandardItem *> takeColumn(int column)
```

> **parent()** — возвращает указатель на родительский элемент или нулевой указатель. Прототип метода:
```c++
QStandardItem *parent() const
```

> **child()** — возвращает указатель на дочерний элемент или нулевой указатель. Прототип метода:
```c++
QStandardItem *child(int row, int column = 0) const
```

> **hasChildren()** — возвращает значение `true`, если существует дочерний элемент, и `false` — в противном случае. Прототип метода:
```c++
bool hasChildren() const
```

> **setData()** — устанавливает значение для указанной роли. Прототип метода:
```c++
virtual void setData(const QVariant &value, int role = Qt::UserRole + 1)
```

> **data()** — возвращает значение, хранимое в указанной роли. Прототип метода:
```c++
virtual QVariant data(int role = Qt::UserRole + 1) const
```

> **setText()** — задает текст элемента. Прототип метода:
```c++
void setText(const QString &text)
```

> **text()** — возвращает текст элемента. Прототип метода:
```c++
QString text() const
```

> **setTextAlignment()** — задает выравнивание текста внутри элемента. Прототип метода:
```c++
void setTextAlignment(Qt::Alignment alignment)
```

> **setIcon()** — задает значок, который будет отображен перед текстом. Прототип метода:
```c++
void setIcon(const QIcon &icon)
```

> **setToolTip()** — задает текст всплывающей подсказки. Прототип метода:
```c++
void setToolTip(const QString &toolTip)
```

> **setWhatsThis()** — задает текст для справки. Прототип метода:
```c++
void setWhatsThis(const QString &whatsThis)
```

> **setFont()** — задает шрифт элемента. Прототип метода:
```c++
void setFont(const QFont &font)
```

> **setBackground()** — задает цвет фона. Прототип метода:
```c++
void setBackground(const QBrush &brush)
```

> **setForeground()** — задает цвет текста. Прототип метода:
```c++
void setForeground(const QBrush &brush)
```

> **setCheckable()** — если в качестве параметра указано значение true, то пользователь может взаимодействовать с флажком. Прототип метода:
```c++
void setCheckable(bool checkable)
```

> **isCheckable()** — возвращает значение `true`, если пользователь может взаимодействовать с флажком, и `false` — в противном случае. Прототип метода:
```c++
bool isCheckable() const
```

> **setCheckState()** — задает статус флажка. Прототип метода:
```c++
void setCheckState(Qt::CheckState state)
```

Могут быть указаны следующие константы:
* **Qt::Unchecked** — флажок сброшен;
* **Qt::PartiallyChecked** — флажок частично установлен;
* **Qt::Checked** — флажок установлен;

> **checkState()** — возвращает текущий статус флажка. Прототип метода:
```c++
Qt::CheckState checkState() const
```

> **setAutoTristate()** — если в качестве параметра указано значение `true`, то флажок может иметь три состояния: установлен, сброшен и частично установлен. Управление состоянием родительского флажка выполняется автоматически. Прототип метода:
```c++
void setAutoTristate(bool tristate)
```

Получение значения:
```c++
bool isAutoTristate() const
```

> **setFlags()** — задает свойства элемента. Прототип метода:
```c++
void setFlags(Qt::ItemFlags flags)
```

> **flags()** — возвращает значение установленных свойств элемента. Прототип метода:
```c++
Qt::ItemFlags flags() const
```

> **setSelectable()** — если в качестве параметра указано значение `true`, то пользователь может выделить элемент. Прототип метода:
```c++
void setSelectable(bool selectable)
```

> **setEditable()** — если в качестве параметра указано значение `true`, то пользователь может редактировать текст элемента. Прототип метода:
```c++
void setEditable(bool editable)
```

> **setDragEnabled()** — если в качестве параметра указано значение `true`, то перетаскивание элемента разрешено. Прототип метода:
```c++
void setDragEnabled(bool dragEnabled)
```

> **setDropEnabled()** — если в качестве параметра указано значение `true`, то сброс разрешен. Прототип метода:
```c++
void setDropEnabled(bool dropEnabled)
```

> **setEnabled()** — если в качестве параметра указано значение `true`, то пользователь может взаимодействовать с элементом. Значение `false` делает элемент недоступным. Прототип метода:
```c++
void setEnabled(bool enabled)
```

> **clone()** — возвращает копию элемента. Прототип метода:
```c++
virtual QStandardItem *clone() const
```

> **index()** — возвращает индекс элемента (экземпляр класса `QModelIndex`). Прототип метода:
```c++
QModelIndex index() const
```

> **model()** — возвращает указатель на модель. Прототип метода:
```c++
QStandardItemModel *model() const
```

> **sortChildren()** — производит сортировку дочерней таблицы. Если во втором параметре указана константа `Qt::AscendingOrder`, то сортировка производится в прямом порядке, а если `Qt::DescendingOrder`, то в обратном. Прототип метода:
```c++
void sortChildren(int column, Qt::SortOrder order = Qt::AscendingOrder)
```
















