# QFormLayout

Класс `QFormLayout` позволяет выравнивать компоненты формы. Контейнер по умолчанию состоит из двух столбцов. Первый столбец предназначен для вывода надписи, а второй столбец — для вывода компонента, например текстового поля. При этом надпись связывается с компонентом, что позволяет назначать клавиши быстрого доступа, указав символ `&` перед буквой внутри текста надписи. После нажатия комбинации клавиш быстрого доступа (комбинация `<Alt> + буква`) в фокусе окажется компонент, расположенный справа от надписи. Иерархия наследования выглядит так:
```
(QObject, QLayoutItem) — QLayout — QFormLayout
```

Создать экземпляр класса `QFormLayout` позволяет следующий конструктор:

```c++
#include <QFormLayout>
QFormLayout(QWidget *parent = nullptr)
```

В необязательном параметре можно передать указатель на родительский компонент. Если параметр не указан, то необходимо передать указатель на контейнер в метод `setLayout()` родительского компонента. Типичный пример использования класса `QFormLayout` выглядит так:

```c++
QWidget window;
window.setWindowTitle("QFormLayout");
window.resize(300, 150);

QLineEdit *lineEdit = new QLineEdit();
QTextEdit *textEdit = new QTextEdit();

QPushButton *btn1 = new QPushButton("О&тправить");
QPushButton *btn2 = new QPushButton("О&чистить");

QHBoxLayout *hbox = new QHBoxLayout();
hbox->addWidget(btn1);
hbox->addWidget(btn2);

QFormLayout *form = new QFormLayout();
form->addRow("&Название:", lineEdit);
form->addRow("&Описание:", textEdit);
form->addRow(hbox);

window.setLayout(form);
window.show();
```

Результат выполнения этого кода:
![[ParallelProg_9.png]]

Класс `QFormLayout` содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **addRow()** — добавляет строку в конец контейнера. Прототипы метода:
```c++
void addRow(const QString &labelText, QWidget *field)
void addRow(const QString &labelText, QLayout *field)
void addRow(QWidget *label, QWidget *field)
void addRow(QWidget *label, QLayout *field)
void addRow(QWidget *widget)
void addRow(QLayout *layout)
```

В параметре `labelText` можно указать текст, внутри которого перед какой-либо буквой указан символ `&`. В этом случае надпись связывается с компонентом, указанном во втором параметре. После нажатия комбинации клавиш быстрого доступа (комбинация `<Alt> + буква`) этот компонент окажется в фокусе ввода. Если в первом параметре указан экземпляр класса [[QLabel|QLabel]], то связь с компонентом необходимо устанавливать вручную, передав указатель на компонент в метод `setBuddy()`. Если указан только один параметр, то компонент (или контейнер) займет сразу два столбца;

> **insertRow()** — добавляет строку в указанную позицию контейнера. Если указано отрицательное значение в первом параметре, то компонент добавляется в конец контейнера. Прототипы метода:
```c++
void insertRow(int row, const QString &labelText, QWidget *field)
void insertRow(int row, const QString &labelText, QLayout *field)
void insertRow(int row, QWidget *label, QWidget *field)
void insertRow(int row, QWidget *label, QLayout *field)
void insertRow(int row, QWidget *widget)
void insertRow(int row, QLayout *layout)
```

> **setFormAlignment()** — задает режим выравнивания формы. Прототип метода:
```c++
void setFormAlignment(Qt::Alignment alignment)
```
Пример:
```c++
form->setFormAlignment(Qt::AlignLeft | Qt::AlignTop);
```

> **setLabelAlignment()** — задает режим выравнивания надписи. Прототип метода
```c++
void setLabelAlignment(Qt::Alignment alignment)
```
Пример выравнивания по правому краю:
```c++
form->setLabelAlignment(Qt::AlignRight);
```

> **setRowWrapPolicy()** — задает местоположение надписи. Прототип метода:
```c++
void setRowWrapPolicy(QFormLayout::RowWrapPolicy policy)
```
В качестве параметра указываются следующие константы:
* **QFormLayout::DontWrapRows** — надписи расположены слева от компонентов;
* **QFormLayout::WrapLongRows** — длинные надписи могут находиться выше компонентов, а короткие надписи — слева от компонентов;
* **QFormLayout::WrapAllRows** — надписи расположены выше компонентов;

> **setFieldGrowthPolicy()** — задает режим управления размерами компонентов. Прототип метода:
```c++
void setFieldGrowthPolicy(QFormLayout::FieldGrowthPolicy policy)
```

В качестве параметра указываются следующие константы:
* **QFormLayout::FieldsStayAtSizeHint** — размеры компонентов будут соответствовать рекомендуемым (возвращаемым методом `sizeHint()`);
* **QFormLayout::ExpandingFieldsGrow** — компоненты, для которых установлена политика изменения размеров `QSizePolicy::Expanding` или `QSizePolicy::MinimumExpanding`, будут занимать всю доступную ширину. Размеры остальных компонентов будут соответствовать рекомендуемым;
* **QFormLayout::AllNonFixedFieldsGrow** — все компоненты (если это возможно) будут занимать всю доступную ширину;

> **setSpacing()** — задает расстояние между компонентами по горизонтали и вертикали. Прототип метода:
```c++
void setSpacing(int)
```

> **setHorizontalSpacing()** — задает расстояние между компонентами по горизонтали. Прототип метода:
```c++
void setHorizontalSpacing(int spacing)
```

> **setVerticalSpacing()** — задает расстояние между компонентами по вертикали. Прототип метода:
```c++
void setVerticalSpacing(int spacing)
```






























