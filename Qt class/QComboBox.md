[[#Раскрывающийся список]]
1. [[#Добавление, изменение и удаление элементов|Добавление, изменение и удаление элементов]] 7.1.1
2. [[#Изменение настроек|Изменение настроек]] 7.1.2
3. [[#Поиск элемента внутри списка|Поиск элемента внутри списка]] 7.1.3
4. [[#Сигналы|Сигналы]] 7.1.4

# Раскрывающийся список

Класс `QComboBox` реализует раскрывающийся список с возможностью выбора одного пункта. При щелчке мышью на поле появляется список возможных вариантов, а при выборе пункта список сворачивается. Иерархия наследования выглядит так:
```
(QObject, QPaintDevice) — QWidget — QComboBox
```

Формат конструктора класса `QComboBox`:
```c++
#include <QComboBox>

QComboBox(QWidget *parent = nullptr)
```

## Добавление, изменение и удаление элементов

Для добавления, изменения, удаления и получения значения элементов предназначены следующие методы из класса `QComboBox`:

> **addItem()** — добавляет один элемент в конец списка. Прототипы метода:
```c++
void addItem(const QString &text,
			const QVariant &userData = QVariant())

void addItem(const QIcon &icon, const QString &text,
			const QVariant &userData = QVariant())
```

В параметре `text` задается текст элемента списка, а в параметре `icon` — значок, который будет отображен перед текстом. Необязательный параметр `userData` позволяет сохранить пользовательские данные, например индекс в таблице базы данных;

> **addItems()** — добавляет несколько элементов в конец списка. Прототип метода:
```c++
void addItems(const QStringList &texts)
```

> **insertItem()** — вставляет один элемент в указанную позицию списка. Все остальные элементы сдвигаются в конец списка. Прототипы метода:
```c++
void insertItem(int index, const QString &text,
				const QVariant &userData = QVariant())

void insertItem(int index, const QIcon &icon, const QString &text,
				const QVariant &userData = QVariant())
```

> **insertItems()** — вставляет несколько элементов в указанную позицию списка. Все остальные элементы сдвигаются в конец списка. Прототип метода:
```c++
void insertItems(int index, const QStringList &list)
```

> **insertSeparator()** — вставляет разделительную линию в указанную позицию. Прототип метода:
```c++
void insertSeparator(int index)
```

> **setItemText()** — изменяет текст элемента с указанным индексом. Прототип метода:
```c++
void setItemText(int index, const QString &text)
```

> **setItemIcon()** — изменяет значок элемента с указанным индексом. Прототип метода:
```c++
void setItemIcon(int index, const QIcon &icon)
```

> **setItemData()** — изменяет данные для элемента с указанным индексом. Необязательный параметр `role` позволяет указать роль, для которой задаются данные. Например, если указать константу `Qt::ToolTipRole`, то данные задают текст вплывающей подсказки, которая будет отображена при наведении указателя мыши на элемент. По умолчанию изменяются пользовательские данные. Прототип метода:
```c++
void setItemData(int index, const QVariant &value, int role = Qt::UserRole)
```

> **setCurrentIndex()** — делает элемент с указанным индексом текущим. Метод является слотом. Прототип метода:
```c++
void setCurrentIndex(int index)
```

> **currentIndex()** — возвращает индекс текущего элемента. Прототип метода:
```c++
int currentIndex() const
```

> **currentText()** — возвращает текст текущего элемента. Прототип метода:
```c++
QString currentText() const
```

> **itemText()** — возвращает текст элемента с указанным индексом. Прототип метода:
```c++
QString itemText(int index) const
```

> **itemData()** — возвращает данные, сохраненные в роли `role` элемента с индексом `index`. Прототип метода:
```c++
QVariant itemData(int index, int role = Qt::UserRole) const
```

> **currentData()** — возвращает данные, сохраненные в роли `role` текущего элемента. Прототип метода:
```c++
QVariant currentData(int role = Qt::UserRole) const
```

> **count()** — возвращает общее количество элементов списка. Прототип метода:
```c++
int count() const
```

> **removeItem()** — удаляет элемент с указанным индексом. Прототип метода:
```c++
void removeItem(int index)
```

> **clear()** — удаляет все элементы списка. Метод является слотом. Прототип метода:
```c++
void clear()
```

## Изменение настроек

Управлять настройками раскрывающегося списка позволяют следующие методы:

> **setEditable()** — если в качестве параметра указано значение `true`, то пользователь сможет добавлять новые элементы в список путем ввода текста в поле и последующего нажатия клавиши `<Enter>.` Прототип метода:
```c++
void setEditable(bool editable
```

> setInsertPolicy()  — задает режим добавления нового элемента пользователем. Прототип метода:
```c++
void setInsertPolicy(QComboBox::InsertPolicy policy)
```

В качестве параметра указываются следующие константы:

* **QComboBox::NoInsert** — элемент не будет добавлен;
* **QComboBox::InsertAtTop** — элемент вставляется в начало списка;
* **QComboBox::InsertAtCurrent** — будет изменен текст текущего элемента;
* **QComboBox::InsertAtBottom** — элемент вставляется в конец списка;
* **QComboBox::InsertAfterCurrent** — элемент вставляется после текущего элемента;
* **QComboBox::InsertBeforeCurrent** — элемент вставляется перед текущим элементом;
* **QComboBox::InsertAlphabetically** — при вставке учитывается алфавитный порядок следования элементов;

> **setEditText()** — вставляет текст в поле редактирования. Метод является слотом. Прототип метода:
```c++
void setEditText(const QString &text)
```

> **clearEditText()** — удаляет текст из поля редактирования. Метод является слотом. Прототип метода:
```c++
void clearEditText()
```

> **setCompleter()** — позволяет предлагать возможные варианты значений, начинающиеся с введенных пользователем символов. Прототип метода:
```c++
#include <QCompleter>
void setCompleter(QCompleter *completer)
```

Пример:
```c++
QComboBox *comboBox = new QComboBox();
comboBox->setEditable(true);
comboBox->setInsertPolicy(QComboBox::InsertAtTop);

QStringList list;
list << "кадр" << "каменный" << "камень" << "камера";

QCompleter *completer = new QCompleter(list, &window);
completer->setCaseSensitivity(Qt::CaseInsensitive);

comboBox->setCompleter(completer);
```

> **setValidator()** — устанавливает контроль ввода. В качестве значения указывается экземпляр класса, наследующего класс `QValidator` (см. [[QLineEdit#Контроль ввода|Контроль ввода]]). Прототип метода:

```c++
void setValidator(const QValidator *validator)
```

> **setDuplicatesEnabled()** — если в качестве параметра указано значение `true`, то
пользователь может добавить элемент с повторяющимся текстом. По умолча-
нию повторы запрещены. Прототип метода:
```c++
void setDuplicatesEnabled(bool enable)
```

> **setMaxCount()** — задает максимальное количество элементов в списке. Если до вызова метода количество элементов превышало указанное количество, то лишние элементы будут удалены. Прототип метода:
```c++
void setMaxCount(int max)
```

> **setMaxVisibleItems()** — задает максимальное количество видимых элементов в раскрывающемся списке. Прототип метода:
```c++
void setMaxVisibleItems(int maxItems)
```

> **setMinimumContentsLength()** — задает минимальное количество отображаемых символов. Прототип метода:
```c++
void setMinimumContentsLength(int characters)
```

> **setSizeAdjustPolicy()** — устанавливает режим изменения ширины при изменении содержимого. Прототип метода:
```c++
void setSizeAdjustPolicy(QComboBox::SizeAdjustPolicy policy)
```

В качестве параметра указываются следующие константы:

* **QComboBox::AdjustToContents** — ширина будет соответствовать содержимому;
* **QComboBox::AdjustToContentsOnFirstShow** — ширина будет соответствовать ширине, используемой при первом отображении списка;
* **QComboBox::AdjustToMinimumContentsLengthWithIcon** — используется значение минимальной ширины, которое установлено с помощью метода `setMinimumContentsLength()`, плюс ширина значка;

> **setFrame()** — если в качестве параметра указано значение `false`, то поле будет отображаться без рамки. Прототип метода:
```c++
void setFrame(bool)
```

> **setIconSize()** — задает максимальный размер значков. Прототип метода:
```c++
void setIconSize(const QSize &size)
```

> **showPopup()** — отображает список. Прототип метода:
```c++
virtual void showPopup()
```

> **hidePopup()** — скрывает список. Прототип метода:
```c++
virtual void hidePopup()
```

## Поиск элемента внутри списка

Произвести поиск элемента внутри списка позволяют методы `findText()` (поиск в тексте элемента) и `findData()` (поиск данных в указанной роли). Методы возвращают индекс найденного элемента или значение `–1`, если элемент не найден. Прототипы методов:
```c++
int findText(const QString &text,
			Qt::MatchFlags flags = Qt::MatchExactly|Qt::MatchCaseSensitive) const

int findData(const QVariant &data, int role = Qt::UserRole,
			Qt::MatchFlags flags = static_cast<Qt::MatchFlags>(Qt::MatchExactly|
			Qt::MatchCaseSensitive)) const
```

Параметр `flags` задает режим поиска. В качестве значения можно указать комбинацию (через оператор `|`) следующих констант:

> **Qt::MatchExactly** — поиск полного соответствия;
> 
> **Qt::MatchFixedString** — поиск полного соответствия внутри строки, выполняемый по умолчанию без учета регистра символов;
> 
> **Qt::MatchContains** — поиск совпадения с любой частью;
> 
> **Qt::MatchStartsWith** — совпадение с началом;
> 
> **Qt::MatchEndsWith** — совпадение с концом;
> 
> **Qt::MatchRegularExpression** — поиск с помощью регулярного выражения;
> 
> **Qt::MatchWildcard** — используются подстановочные знаки;
> 
> **Qt::MatchCaseSensitive** — поиск с учетом регистра символов;
> 
> **Qt::MatchWrap** — поиск по кругу;
> 
> **Qt::MatchRecursive** — просмотр всей иерархии.
> 
## Сигналы

Класс `QComboBox` содержит следующие сигналы:

> **activated(int)** — генерируется при выборе пункта в списке (даже если индекс не изменился) пользователем. Внутри обработчика доступен индекс элемента;
> 
> **textActivated(const QString&)** — генерируется при выборе пункта в списке (даже если индекс не изменился) пользователем. Внутри обработчика доступен текст элемента;
> 
> **currentIndexChanged(int)** — генерируется при изменении текущего индекса. Внутри обработчика доступен индекс (значение –1, если список пуст) элемента;
> 
> **currentTextChanged(const QString&)** — генерируется при изменении текущего индекса. Внутри обработчика доступен текст элемента;
> 
> **editTextChanged(const QString&)** — генерируется при изменении текста в поле. Внутри обработчика через параметр доступен новый текст;
> 
> **highlighted(int)** — генерируется при наведении указателя мыши на пункт в списке. Внутри обработчика доступен индекс элемента;
> 
> **textHighlighted(const QString&)** — генерируется при наведении указателя мыши на пункт в списке. Внутри обработчика доступен текст элемента.







