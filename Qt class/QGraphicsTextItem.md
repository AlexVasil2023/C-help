
# QGraphicsTextItem

Класс `QGraphicsTextItem` описывает форматированный текст. Иерархия наследования:
```
(QObject, QGraphicsItem) — QGraphicsObject — QGraphicsTextItem
```

Форматы конструктора класса:
```c++
#include <QGraphicsTextItem>

QGraphicsTextItem(QGraphicsItem *parent = nullptr)
QGraphicsTextItem(const QString &text, QGraphicsItem *parent = nullptr)
```

Класс `QGraphicsTextItem` наследует все методы из базовых классов и содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **setPlainText()** — задает простой текст. Прототип метода:
```c++
void setPlainText(const QString &text)
```

> **toPlainText()** — возвращает простой текст. Прототип метода:
```c++
QString toPlainText() const
```

> **setHtml()** — задает HTML-текст. Прототип метода:
```c++
void setHtml(const QString &text)
```

> **toHtml()** — возвращает HTML-текст. Прототип метода:
```c++
QString toHtml() const
```

> **setFont()** — устанавливает шрифт. Прототип метода:
```c++
void setFont(const QFont &font)
```

> **font()** — возвращает объект шрифта. Прототип метода:
```c++
QFont font() const
```

> **setDefaultTextColor()** — задает цвет шрифта по умолчанию. Прототип метода:
```c++
void setDefaultTextColor(const QColor &col)
```

> **setTextWidth()** — задает предпочитаемую ширину строки. Если текст не помещается в установленную ширину, то он будет перенесен на новую строку. Прототип метода:
```c++
void setTextWidth(qreal width)
```

> **textWidth()** — возвращает предпочитаемую ширину текста. Прототип метода:
```c++
qreal textWidth() const
```

> **setDocument()** — устанавливает объект документа. Прототип метода:
```c++
void setDocument(QTextDocument *document)
```

> **document()** — возвращает указатель на объект документа. Прототип метода:
```c++
QTextDocument *document() const
```

> **setTextCursor()** — устанавливает объект курсора. Прототип метода:
```c++
void setTextCursor(const QTextCursor &cursor)
```

> **textCursor()** — возвращает объект курсора. Прототип метода:
```c++
QTextCursor textCursor() const
```

> **setTextInteractionFlags()** — задает режим взаимодействия пользователя с текстом. По умолчанию используется режим `NoTextInteraction`, при котором пользователь не может взаимодействовать с текстом. Прототип метода:
```c++
void setTextInteractionFlags(Qt::TextInteractionFlags flags)
```

> **setTabChangesFocus()** — если в качестве параметра указано значение `false`, то с помощью нажатия клавиши `<Tab>` можно вставить символ табуляции. Если указано значение `true`, то клавиша `<Tab>` используется для передачи фокуса. Прототип метода:
```c++
void setTabChangesFocus(bool b)
```

> **setOpenExternalLinks()** — если в качестве параметра указано значение `true`, то щелчок на гиперссылке приведет к открытию браузера, используемого в системе по умолчанию, и загрузке указанной страницы. Метод работает только при использовании режима `TextBrowserInteraction`. Прототип метода:
```c++
void setOpenExternalLinks(bool open)
```

Класс `QGraphicsTextItem` содержит следующие сигналы:
> **linkActivated(const QString&)** — генерируется при переходе по гиперссылке. Через параметр внутри обработчика доступен URL-адрес;
> 
> **linkHovered(const QString&)** — генерируется при наведении указателя мыши на гиперссылку и выведении указателя. Через параметр внутри обработчика доступен URL-адрес или пустая строка.

