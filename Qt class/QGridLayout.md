# QGridLayout

Помимо выравнивания компонентов по горизонтали и вертикали существует возможность размещения компонентов внутри ячеек сетки. Для выравнивания компонентов по сетке предназначен класс `QGridLayout`. Иерархия наследования:
```
(QObject, QLayoutItem) — QLayout — QGridLayout
```

Создать экземпляр класса `QGridLayout` можно с помощью такого конструктора:

```c++
#include <QGridLayout>
QGridLayout(QWidget *parent = nullptr)
```

В необязательном параметре можно передать указатель на родительский компонент. Если параметр не указан, то необходимо передать указатель на сетку в метод `setLayout()` родительского компонента. Типичный пример использования класса `QGridLayout` выглядит так:

```c++
QWidget window; // Родительский компонент
window.setWindowTitle("Выравнивание по сетке");
window.resize(300, 100);

QPushButton *btn1 = new QPushButton("1");
QPushButton *btn2 = new QPushButton("2");
QPushButton *btn3 = new QPushButton("3");
QPushButton *btn4 = new QPushButton("4");
QGridLayout *grid = new QGridLayout(); // Создаем сетку

grid->addWidget(btn1, 0, 0); // Добавляем компоненты
grid->addWidget(btn2, 0, 1);
grid->addWidget(btn3, 1, 0);
grid->addWidget(btn4, 1, 1);

window.setLayout(grid); // Передаем родителю
window.show();
```

Добавить компоненты и удалить их позволяют следующие методы:

> **addWidget()** — добавляет компонент в указанную ячейку сетки. Прототипы метода:
```c++
void addWidget(QWidget *widget, int row, int column,
					Qt::Alignment alignment = Qt::Alignment())
					
void addWidget(QWidget *widget, int fromRow, int fromColumn,
				int rowSpan, int columnSpan,
				Qt::Alignment alignment = Qt::Alignment())
```

В первом параметре передается указатель на компонент, во втором параметре передается индекс строки, а в третьем — индекс столбца. Нумерация строк и столбцов начинается с нуля. Параметр `rowSpan` задает количество объединенных ячеек по вертикали, а параметр `columnSpan` — по горизонтали. Параметр `alignment` задает выравнивание компонента внутри ячейки. Значения, которые можно указать в этом параметре, мы рассматривали в предыдущем разделе. Пример:

```c++
QGridLayout *grid = new QGridLayout();
grid->addWidget(btn1, 0, 0, Qt::AlignLeft);
grid->addWidget(btn2, 0, 1, Qt::AlignRight);
grid->addWidget(btn3, 1, 0, 1, 2);
```

> **addLayout()** — добавляет контейнер в указанную ячейку сетки. Прототипы метода:
```c++
void addLayout(QLayout *layout, int row, int column,
				Qt::Alignment alignment = Qt::Alignment())
				
void addLayout(QLayout *layout, int row, int column,
				int rowSpan, int columnSpan,
				Qt::Alignment alignment = Qt::Alignment())
```

В первом параметре передается указатель на контейнер. Остальные параметры аналогичны параметрам метода `addWidget()`.

Класс `QGridLayout` содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **setRowMinimumHeight()** — задает минимальную высоту строки с индексом `row`. Прототип метода:
```c++
void setRowMinimumHeight(int row, int minSize)
```

> **setColumnMinimumWidth()** — задает минимальную ширину столбца с индексом `column`. Прототип метода:
```c++
void setColumnMinimumWidth(int column, int minSize)
```

> **setRowStretch()** — задает фактор растяжения для строки с индексом `row`. Прототип метода:
```c++
void setRowStretch(int row, int stretch)
```

> **setColumnStretch()** — задает фактор растяжения для столбца с индексом `column`. Прототип метода:
```c++
void setColumnStretch(int column, int stretch)
```

> **setHorizontalSpacing()** — задает расстояние между компонентами по горизонтали. Прототип метода:
```c++
void setHorizontalSpacing(int spacing)
```

> **setVerticalSpacing()** — задает расстояние между компонентами по вертикали. Прототип метода:
```c++
void setVerticalSpacing(int spacing)
```

> **rowCount()** — возвращает количество строк сетки. Прототип метода:
```c++
int rowCount() const
```

> **columnCount()** — возвращает количество столбцов сетки. Прототип метода:
```c++
int columnCount() const
```

