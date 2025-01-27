# Список для выбора шрифта

Класс `QFontComboBox` реализует раскрывающийся список с названиями шрифтов. Шрифт можно выбрать из списка или ввести название в поле, при этом будут отображаться названия, начинающиеся с введенных букв. Иерархия наследования:
```
(QObject, QPaintDevice) — QWidget — QComboBox — QFontComboBox
```

Формат конструктора класса `QFontComboBox`:
```c++
#include <QFontComboBox>

QFontComboBox(QWidget *parent = nullptr)
```

Класс `QFontComboBox` наследует все методы и сигналы из класса [[QComboBox|QComboBox]]  и содержит несколько дополнительных методов:

> **setCurrentFont()** — делает текущим элемент, соответствующий указанному шрифту. Метод является слотом. Прототип метода:
```c++
void setCurrentFont(const QFont &f)
```

Пример:
```c++
comboBox->setCurrentFont(QFont("Verdana"));
```

> **currentFont()** — возвращает экземпляр класса [[QFont|QFont]] с выбранным шрифтом. Прототип метода:
```c++
QFont currentFont() const
```

Пример вывода названия шрифта:
```c++
qDebug() << comboBox->currentFont().family();
```

> **setFontFilters()** — ограничивает список указанными типами шрифтов. Прототип метода:
```c++
void setFontFilters(QFontComboBox::FontFilters filters)
```

В качестве параметра указывается комбинация следующих констант:
* **QFontComboBox::AllFonts** — все типы шрифтов;
* **QFontComboBox::ScalableFonts** — масштабируемые шрифты;
* **QFontComboBox::NonScalableFonts** — немасштабируемые шрифты;
* **QFontComboBox::MonospacedFonts** — моноширинные шрифты;
* **QFontComboBox::ProportionalFonts** — пропорциональные шрифты.

Класс `QFontComboBox` содержит сигнал `currentFontChanged(const QFont&)`, который генерируется при изменении текущего шрифта. Внутри обработчика доступен экземпляр класса [[QFont|QFont]] с текущим шрифтом.







