
[[#Многострочное текстовое поле]]
1. [[#Основные методы и сигналы|Основные методы и сигналы]]
2. [[#Изменение настроек поля|Изменение настроек поля]]
3. [[#Изменение характеристик текста и фона|Изменение характеристик текста и фона]]
4. [[#Класс QTextDocument]]
5. [[#Класс QTextCursor|Класс QTextCursor]]


# Многострочное текстовое поле

Многострочное текстовое поле предназначено для ввода и редактирования как простого текста, так и текста в формате HTML. Поле по умолчанию поддерживает технологию `drag & drop`, стандартные комбинации клавиш быстрого доступа, работу с буфером обмена и многое другое. Многострочное текстовое поле реализуется с помощью класса `QTextEdit`. Иерархия наследования:
```
(QObject, QPaintDevice) — QWidget — QFrame — QAbstractScrollArea — QTextEdit
```

Конструктор класса `QTextEdit` имеет два формата:
```c++
#include <QTextEdit>

QTextEdit(const QString &text, QWidget *parent = nullptr)
QTextEdit(QWidget *parent = nullptr)
```

В параметре parent передается указатель на родительский компонент. Если параметр не указан или имеет значение [[nullptr_t|nullptr]], то компонент будет обладать своим собственным окном. Параметр `text` позволяет задать текст в формате HTML, который будет отображен в текстовом поле.

> Класс `QTextEdit` предназначен для отображения как простого текста, так и текста в формате HTML. Если поддержка HTML не нужна, то следует воспользоваться классом [[QPlainTextEdit|QPlainTextEdit]], который оптимизирован для работы с простым текстом большого объема.

## Основные методы и сигналы

Класс `QTextEdit` содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **setText()** — вставляет указанный текст в поле. Текст может быть простым или в формате HTML. Метод является слотом. Прототип метода:
```c++
void setText(const QString &text)
```

> **setPlainText()** — вставляет простой текст. Метод является слотом. Прототип метода:
```c++
void setPlainText(const QString &text)
```

> **setHtml()** — вставляет текст в формате HTML. Метод является слотом. Прототип метода:
```c++
void setHtml(const QString &text)
```

> **insertPlainText()** — вставляет простой текст в текущую позицию текстового курсора. Если в поле был выделен фрагмент, то он будет удален. Метод является слотом. Прототип метода:
```c++
void insertPlainText(const QString &text)
```

> **insertHtml()** — вставляет текст в формате HTML в текущую позицию текстового курсора. Если в поле был выделен фрагмент, то он будет удален. Метод является слотом. Прототип метода:
```c++
void insertHtml(const QString &text)
```

> **append()** — добавляет новый абзац с указанным текстом в формате HTML в конец поля. Метод является слотом. Прототип метода:
```c++
void append(const QString &text)
```

> **setPlaceholderText()** — задает текст подсказки пользователю, который будет выводиться в поле, когда оно не содержит значения и находится вне фокуса ввода. Прототип метода:
```c++
void setPlaceholderText(const QString &)
```

Получение значения:
```c++
QString placeholderText() const
```

> **setDocumentTitle()** — задает текст заголовка документа (для тега `<title>`). Прототип метода:
```c++
void setDocumentTitle(const QString &title)
```

> **documentTitle()** — возвращает текст заголовка (из тега `<title>`). Прототип метода:
```c++
QString documentTitle() const
```

> **toPlainText()** — возвращает простой текст, содержащийся в текстовом поле. Прототип метода:
```c++
QString toPlainText() const
```

> **toHtml()** — возвращает текст в формате HTML. Прототип метода:
```c++
QString toHtml() const
```

> **clear()** — удаляет весь текст из поля. Метод является слотом. Прототип метода:
```c++
void clear()
```

> **selectAll()** — выделяет весь текст в поле. Метод является слотом. Прототип метода:
```c++
void selectAll()
```

> **zoomIn()** — увеличивает масштаб шрифта. Метод является слотом. Прототип метода:
```c++
void zoomIn(int range = 1)
```

> **zoomOut()** — уменьшает масштаб шрифта. Метод является слотом. Прототип метода:
```c++
void zoomOut(int range = 1)
```

> **cut()** — копирует выделенный текст в буфер обмена, а затем удаляет его из поля при условии, что есть выделенный фрагмент. Метод является слотом. Прототип метода:
```c++
void cut()
```

> **copy()** — копирует выделенный текст в буфер обмена при условии, что есть выделенный фрагмент. Метод является слотом. Прототип метода:
```c++
void copy()
```

> **paste()** — вставляет текст из буфера обмена в текущую позицию текстового курсора при условии, что поле доступно для редактирования. Метод является слотом. Прототип метода:
```c++
void paste()
```

> **canPaste()** — возвращает `true`, если из буфера обмена можно вставить текст, и `false` — в противном случае. Прототип метода:
```c++
bool canPaste() const
```

> **setAcceptRichText()** — если в качестве параметра указано значение `true`, то в поле можно будет вставить текст в формате HTML из буфера обмена или с помощью перетаскивания. Значение `false` отключает эту возможность. Прототип метода:
```c++
void setAcceptRichText(bool accept)
```

> **acceptRichText()** — возвращает значение `true`, если в поле можно вставить текст в формате HTML, и `false` — в противном случае. Прототип метода:
```c++
bool acceptRichText() const
```

> **undo()** — отменяет последнюю операцию ввода пользователем при условии, что отмена возможна. Метод является слотом. Прототип метода:
```c++
void undo()
```

> **redo()** — повторяет последнюю отмененную операцию ввода пользователем, если это возможно. Метод является слотом. Прототип метода:
```c++
void redo()
```

> **setUndoRedoEnabled()** — если в качестве значения указано значение `true`, то операции отмены и повтора действий разрешены, а если `false`, то запрещены. Прототип метода:
```c++
void setUndoRedoEnabled(bool enable)
```

> **isUndoRedoEnabled()** — возвращает значение `true`, если операции отмены и повтора действий разрешены, и `false`, если запрещены. Прототип метода:
```c++
bool isUndoRedoEnabled() const
```

> **createStandardContextMenu()** — создает стандартное меню, которое отображается при щелчке правой кнопкой мыши в текстовом поле. Чтобы изменить стандартное меню, следует создать класс, наследующий класс `QTextEdit`, и переопределить метод `contextMenuEvent()`. Внутри этого метода можно создать свое собственное меню или добавить новый пункт в стандартное меню. Прототипы метода:
```c++
QMenu *createStandardContextMenu()
QMenu *createStandardContextMenu(const QPoint &position)
```

> **ensureCursorVisible()** — прокручивает область таким образом, чтобы текстовый курсор оказался в зоне видимости. Прототип метода:
```c++
void ensureCursorVisible()
```

> **find()** — производит поиск фрагмента (по умолчанию в прямом направлении без учета регистра символов) в текстовом поле. Если фрагмент найден, то он выделяется и метод возвращает значение `true`, в противном случае — значение `false`. Прототипы метода:
```c++
bool find(const QString &exp,
			QTextDocument::FindFlags options = QTextDocument::FindFlags())

bool find(const QRegularExpression &exp,
			QTextDocument::FindFlags options = QTextDocument::FindFlags())
```

В необязательном параметре `options` можно указать комбинацию (через оператор `|`) следующих констант:
* **QTextDocument::FindBackward** — поиск в обратном направлении, а не в прямом;
* **QTextDocument::FindCaseSensitively** — поиск с учетом регистра символов;
* **QTextDocument::FindWholeWords** — поиск слов целиком, а не фрагментов;

> **print()** — отправляет содержимое текстового поля на печать. Прототип метода:
```c++
void print(QPagedPaintDevice *printer) const
```

Класс `QTextEdit` содержит следующие сигналы:

> **currentCharFormatChanged(const QTextCharFormat&)** — генерируется при изменении формата. Внутри обработчика через параметр доступен новый формат;
>
> **cursorPositionChanged()** — генерируется при изменении положения текстового курсора;
>
> **selectionChanged()** — генерируется при изменении выделения;
> 
> **textChanged()** — генерируется при изменении текста внутри поля;
> 
> **copyAvailable(bool)** — генерируется при изменении возможности скопировать фрагмент. Внутри обработчика через параметр доступно значение `true`, если фрагмент можно скопировать, и `false` — в противном случае;
>
>**undoAvailable(bool)** — генерируется при изменении возможности отменить операцию ввода. Внутри обработчика через параметр доступно значение `true`, если можно отменить операцию ввода, и `false` — в противном случае;
>
> **redoAvailable(bool)** — генерируется при изменении возможности повторить отмененную операцию ввода. Внутри обработчика через параметр доступно значение `true`, если можно повторить отмененную операцию ввода, и `false` — в противном случае.

## Изменение настроек поля

Для изменения настроек предназначены следующие методы из класса `QTextEdit` (перечислены только основные методы; полный список смотрите в документации):

> **setTextInteractionFlags()** — задает режим взаимодействия пользователя с текстом. Прототип метода:
```c++
void setTextInteractionFlags(Qt::TextInteractionFlags flags)
```

Можно указать следующие константы (или их комбинацию через оператор `|`):
* **Qt::NoTextInteraction** — пользователь не может взаимодействовать с текстом;
* **Qt::TextSelectableByMouse** — текст можно выделить и скопировать в буфер обмена;
* **Qt::TextSelectableByKeyboard** — текст можно выделить с помощью клавиш клавиатуры. Внутри поля будет отображен текстовый курсор;
* **Qt::LinksAccessibleByMouse** — на гиперссылке можно щелкнуть мышью и скопировать ее адрес;
* **Qt::LinksAccessibleByKeyboard** — с гиперссылкой можно взаимодействовать с помощью клавиатуры. Перемещаться между гиперссылками можно с помощью клавиши `<Tab>`, а переходить по гиперссылке — при нажатии клавиши `<Enter>`;
* **Qt::TextEditable** — текст можно редактировать;
* **Qt::TextEditorInteraction** — комбинация `Qt::TextSelectableByMouse | Qt::TextSelectableByKeyboard | Qt::TextEditable`;
* **Qt::TextBrowserInteraction** — комбинация `Qt::TextSelectableByMouse | Qt::LinksAccessibleByMouse | Qt::LinksAccessibleByKeyboard`.

Получение значения:
```c++
Qt::TextInteractionFlags textInteractionFlags() const
```

> **setReadOnly()** — если в качестве параметра указано значение `true`, то поле будет доступно только для чтения. Прототип метода:
```c++
void setReadOnly(bool)
```

> **isReadOnly()** — возвращает значение `true`, если поле доступно только для чтения, и `false` — в противном случае. Прототип метода:
```c++
bool isReadOnly() const
```

> **setLineWrapMode()** — задает режим переноса строк. Прототип метода:
```c++
void setLineWrapMode(QTextEdit::LineWrapMode mode)
```

В качестве значения могут быть указаны следующие константы:
* **QTextEdit::NoWrap** — перенос строк не производится;
* **QTextEdit::WidgetWidth** — перенос строки при достижении ширины поля;
* **QTextEdit::FixedPixelWidth** — перенос строки при достижении фиксированной ширины в пикселах, которую можно задать с помощью метода `setLineWrapColumnOrWidth()`;
* **QTextEdit::FixedColumnWidth** — перенос строки при достижении фиксированной ширины в буквах, которую можно задать с помощью метода `setLineWrapColumnOrWidth()`.

Получение значения:
```c++
QTextEdit::LineWrapMode lineWrapMode() const
```

> **setLineWrapColumnOrWidth()** — задает ширину колонки. Прототип метода:
```c++
void setLineWrapColumnOrWidth(int w)
```

Получение значения:
```c++
int lineWrapColumnOrWidth() const
```

> **setWordWrapMode()** — задает режим переноса по словам. Прототип метода:
```c++
void setWordWrapMode(QTextOption::WrapMode policy)
```

В качестве значения могут быть указаны следующие константы:
* **QTextOption::NoWrap** — перенос по словам не производится;
* **QTextOption::WordWrap** — перенос строк только по словам;
* **QTextOption::ManualWrap** — аналогичен режиму `NoWrap`;
* **QTextOption::WrapAnywhere** — перенос строки может быть внутри слова;
* **QTextOption::WrapAtWordBoundaryOrAnywhere** — по возможности перенос по словам. Если это невозможно, то перенос строки может быть внутри слова.

Получение значения:
```c++
QTextOption::WrapMode wordWrapMode() const
```

> **setOverwriteMode()** — если в качестве параметра указано значение `true`, то вводимый текст будет замещать ранее введенный. Значение `false` отключает замещение. Прототип метода:
```c++
void setOverwriteMode(bool overwrite)
```

> **overwriteMode()** — возвращает значение `true`, если вводимый текст замещает ранее введенный, и `false` — в противном случае. Прототип метода:
```c++
bool overwriteMode() const
```

> **setAutoFormatting()** — задает режим автоматического форматирования. Прототип метода:
```c++
void setAutoFormatting(QTextEdit::AutoFormatting features)
```

В качестве значения могут быть указаны следующие константы:
> **QTextEdit::AutoNone** — автоматическое форматирование не используется;
> **QTextEdit::AutoBulletList** — автоматически создавать маркированный список при вводе пользователем в начале строки символа `*`;
> **QTextEdit::AutoAll** — включить все автоматические режимы. Эквивалентно режиму `AutoBulletList`.

Получение значения:
```c++
QTextEdit::AutoFormatting autoFormatting() const
```

> **setCursorWidth()** — задает ширину текстового курсора. Прототип метода:
```c++
void setCursorWidth(int width)
```

Получение значения:
```c++
int cursorWidth() const
```

> **setTabChangesFocus()** — если в качестве параметра указано значение `false`, то с помощью нажатия клавиши `<Tab>` можно вставить символ табуляции в поле. Если указано значение `true`, то клавиша `<Tab>` используется для передачи фокуса между компонентами. Прототип метода:
```c++
void setTabChangesFocus(bool)
```

Получение значения:
```c++
bool tabChangesFocus() const
```

> **setTabStopDistance()** — задает ширину символа табуляции в пикселах. Прототип метода:
```c++
void setTabStopDistance(qreal distance)
```

Получение значения:
```c++
qreal tabStopDistance() const
```

## Изменение характеристик текста и фона

Для изменения характеристик текста и фона предназначены следующие методы из класса `QTextEdit` (перечислены только основные методы; полный список смотрите в документации):

> **setCurrentFont()** — задает текущий шрифт. Метод является слотом. Прототип метода:
```c++
void setCurrentFont(const QFont &f)
```

В качестве параметра указывается экземпляр класса [[QFont|QFont]]. Конструктор класса [[QFont|QFont]] имеет следующие форматы:

```c++
QFont()

QFont(const QStringList &families, int pointSize = -1,
									int weight = -1, bool italic = false)
									
QFont(const QFont &font)

QFont(const QFont &font, const QPaintDevice *pd)
```

В параметре `families` указывается название шрифта. Необязательный параметр `pointSize` задает размер шрифта. В параметре `weight` можно указать степень жирности шрифта в виде констант `Light`, `Normal`, `DemiBold`, `Bold` или `Black`. Если в параметре `italic` указано значение `true`, то шрифт будет курсивным;

> **currentFont()** — возвращает экземпляр класса [[QFont|QFont]] с текущими характеристиками шрифта. Прототип метода:
```c++
QFont currentFont() const
```

> **setFontFamily()** — задает название текущего шрифта. Метод является слотом. Прототип метода:
```c++
void setFontFamily(const QString &fontFamily)
```

> **fontFamily()** — возвращает название текущего шрифта. Прототип метода:
```c++
QString fontFamily() const
```

> **setFontPointSize()** — задает размер текущего шрифта. Метод является слотом. Прототип метода:
```c++
void setFontPointSize(qreal)
```

> **fontPointSize()** — возвращает размер текущего шрифта. Прототип метода:
```c++
qreal fontPointSize() const
```

> **setFontWeight()** — задает жирность текущего шрифта. Метод является слотом. Прототип метода:
```c++
void setFontWeight(int weight)
```

> **fontWeight()** — возвращает жирность текущего шрифта. Прототип метода:
```c++
int fontWeight() const
```

> **setFontItalic()** — если в качестве параметра указано значение `true`, то шрифт будет курсивным. Метод является слотом. Прототип метода:
```c++
void setFontItalic(bool italic)
```

> **fontItalic()** — возвращает `true`, если шрифт курсивный, и `false` — в противном случае. Прототип метода:
```c++
bool fontItalic() const
```

> **setFontUnderline()** — если в качестве параметра указано значение `true`, то текст будет подчеркнутым. Метод является слотом. Прототип метода:
```c++
void setFontUnderline(bool underline)
```

> **fontUnderline()** — возвращает true, если текст подчеркнутый, и `false` — в противном случае. Прототип метода:
```c++
bool fontUnderline() const
```

> **setTextColor()** — задает цвет текста. В качестве значения можно указать константу (например: `Qt::black`, `Qt::white` и т. д.) или экземпляр класса [[QColor|QColor]] (например: `QColor("red")`, `QColor(255, 0, 0)` и др.). Метод является слотом. Прототип метода:
```c++
void setTextColor(const QColor &c)
```

> **textColor()** — возвращает экземпляр класса [[QColor|QColor]] с цветом текущего текста. Прототип метода:
```c++
QColor textColor() const
```

> **setTextBackgroundColor()** — задает цвет фона. В качестве значения можно указать константу (например: `Qt::black`, `Qt::white` и т. д.) или экземпляр класса [[QColor|QColor]] (например: `QColor("red")`, `QColor(255, 0, 0)` и др.). Метод является слотом. Прототип метода:
```c++
void setTextBackgroundColor(const QColor &c)
```

> **textBackgroundColor()** — возвращает экземпляр класса [[QColor|QColor]] с цветом фона. Прототип метода:
```c++
QColor textBackgroundColor() const
```

> **setAlignment()** — задает горизонтальное выравнивание текста внутри абзаца. [[QHBoxLayout and QVBoxLayout|Допустимые значения]]. Метод является слотом. Прототип метода:
```c++
void setAlignment(Qt::Alignment)
```

> **alignment()** — возвращает значение выравнивания текста внутри абзаца. Прототип метода:
```c++
Qt::Alignment alignment() const
```

Задать формат символов можно также с помощью класса `QTextCharFormat`, который содержит дополнительные настройки. После создания экземпляр класса следует передать в метод `setCurrentCharFormat()`. Прототип метода:
```c++
void setCurrentCharFormat(const QTextCharFormat &format)
```

Получить экземпляр класса с текущими настройками позволяет метод `currentCharFormat()`. Прототип метода:
```c+
QTextCharFormat currentCharFormat() const
```

За подробной информацией по классу `QTextCharFormat` обращайтесь к документации.

## Класс QTextDocument

Класс `QTextDocument` реализует документ, который отображается в многострочном текстовом поле. Получить указатель на текущий документ позволяет метод `document()` из класса `QTextEdit`. Прототип метода:
```c++
QTextDocument *document() const
```

Установить новый документ можно с помощью метода `setDocument()`. Прототип метода:
```c++
void setDocument(QTextDocument *document)
```

Иерархия наследования:
```c++
QObject — QTextDocument
```

Конструктор класса `QTextDocument` имеет два формата:
```c++
#include <QTextDocument>

QTextDocument(const QString &text, QObject *parent = nullptr)
QTextDocument(QObject *parent = nullptr)
```

В параметре `parent` передается указатель на родительский компонент. Параметр `text` позволяет задать текст в простом формате (не в HTML-формате), который будет отображен в текстовом поле.

Класс `QTextDocument` содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **setPlainText()** — вставляет простой текст. Прототип метода:
```c++
void setPlainText(const QString &text)
```

> **setHtml()** — вставляет текст в формате HTML. Прототип метода:
```c++
void setHtml(const QString &html)
```

> **toPlainText()** — возвращает простой текст, содержащийся в документе. Прототип метода:
```c++
QString toPlainText() const
```

> **toHtml()** — возвращает текст в формате HTML. Прототип метода:
```c++
QString toHtml() const
```

> **clear()** — удаляет весь текст из документа. Прототип метода:
```c++
virtual void clear()
```

> **isEmpty()** — возвращает значение `true`, если документ пустой, и `false` — в противном случае. Прототип метода:
```c++
bool isEmpty() const
```

> **isModified()** — возвращает значение `true`, если документ был изменен, и `false` — в противном случае. Прототип метода:
```c++
bool isModified() const
```

Изменить значение позволяет следующий слот:
```c++
void setModified(bool m = true)
```

> **undo()** — отменяет последнюю операцию ввода пользователем при условии, что отмена возможна. Метод является слотом. Прототип метода:
```c++
void undo()
```

> **redo()** — повторяет последнюю отмененную операцию ввода пользователем, если это возможно. Метод является слотом. Прототип метода:
```c++
void redo()
```

> **isUndoAvailable()** — возвращает значение `true`, если можно отменить последнюю операцию ввода, и `false` — в противном случае. Прототип метода:
```c++
bool isUndoAvailable() const
```

> **isRedoAvailable()** — возвращает значение `true`, если можно повторить последнюю отмененную операцию ввода, и `false` — в противном случае. Прототип метода:
```c++
bool isRedoAvailable() const
```

> **setUndoRedoEnabled()** — если в качестве параметра указано значение `true`, то операции отмены и повтора действий разрешены, а если `false`, то запрещены. Прототип метода:
```c++
void setUndoRedoEnabled(bool enable)
```

> **isUndoRedoEnabled()** — возвращает значение `true`, если операции отмены и повтора действий разрешены, и `false`, если запрещены. Прототип метода:
```c++
bool isUndoRedoEnabled() const
```

> **availableUndoSteps()** — возвращает количество возможных операций отмены. Прототип метода:
```c++
int availableUndoSteps() const
```

> **availableRedoSteps()** — возвращает количество возможных повторов отмененных операций. Прототип метода:
```c++
int availableRedoSteps() const
```

> **clearUndoRedoStacks()** — очищает список возможных отмен и/или повторов. Прототип метода:
```c++
void clearUndoRedoStacks(QTextDocument::Stacks
						stacksToClear = UndoAndRedoStacks)
```

В качестве параметра можно указать следующие константы:
* **QTextDocument::UndoStack** — только список возможных отмен;
* **QTextDocument::RedoStack** — только список возможных повторов;
* **QTextDocument::UndoAndRedoStacks** — очищаются оба списка;

> **print()** — отправляет содержимое документа на печать. Прототип метода:
```c++
void print(QPagedPaintDevice *printer) const
```

> **find()** — производит поиск фрагмента в документе. Метод возвращает экземпляр класса [[#Класс QTextCursor|QTextCursor]]. Если фрагмент не найден, то объект курсора будет нулевым. Проверить успешность операции можно с помощью метода `isNull()` объекта курсора. Прототипы метода:
```c++
QTextCursor find(const QString &subString,
					const QTextCursor &cursor,
					QTextDocument::FindFlags options = FindFlags()) const
					
QTextCursor find(const QString &subString, int position = 0,
				QTextDocument::FindFlags options = FindFlags()) const
				
QTextCursor find(const QRegularExpression &expr, int from = 0,
				QTextDocument::FindFlags options = FindFlags()) const
				
QTextCursor find(const QRegularExpression &expr,
				const QTextCursor &cursor,
				QTextDocument::FindFlags options = FindFlags()) const
```

Параметр `subString` задает искомый фрагмент, а параметр `expr` позволяет указать регулярное выражение. По умолчанию обычный поиск производится без учета регистра символов в прямом направлении, начиная с позиции `position` или от текстового курсора, указанного в параметре `cursor`. В необязательном параметре `options` можно указать комбинацию (через оператор `|`) следующих констант:

* **QTextDocument::FindBackward** — поиск в обратном направлении, а не в прямом;
* **QTextDocument::FindCaseSensitively** — поиск с учетом регистра символов;
* **QTextDocument::FindWholeWords** — поиск слов целиком, а не фрагментов;

> **setDefaultFont()** — задает шрифт по умолчанию для документа. Прототип метода:
```c++
void setDefaultFont(const QFont &font)
```

Получение значения:
```c++
QFont defaultFont() const
```

В качестве параметра указывается экземпляр класса [[QFont]]. Конструктор класса [[QFont]] имеет следующие форматы:
```c++
QFont()

QFont(const QStringList &families, int pointSize = -1,
			int weight = -1, bool italic = false)
			
QFont(const QFont &font)

QFont(const QFont &font, const QPaintDevice *pd)
```

В параметре `families` указывается название шрифта. Необязательный параметр `pointSize` задает размер шрифта. В параметре `weight` можно указать степень жирности шрифта в виде констант `Light`, `Normal`, `DemiBold`, `Bold` или `Black`. Если в параметре `italic` указано значение `true`, то шрифт будет курсивным;

> **setDefaultStyleSheet()** — устанавливает таблицу стилей CSS по умолчанию для документа. Прототип метода:
```c++
void setDefaultStyleSheet(const QString &sheet)
```

Получение значения:
```c++
QString defaultStyleSheet() const
```

> **setDocumentMargin()** — задает отступ от краев поля до текста. Прототип метода:
```c++
void setDocumentMargin(qreal margin)
```

> **documentMargin()** — возвращает величину отступа от краев поля до текста. Прототип метода:
```c++
qreal documentMargin() const
```

> **setMaximumBlockCount()** — задает максимальное количество текстовых блоков в документе. Если количество блоков становится больше указанного значения, то первый блок будет удален. Прототип метода:
```c++
void setMaximumBlockCount(int maximum)
```

> **maximumBlockCount()** — возвращает максимальное количество текстовых блоков. Прототип метода:
```c++
int maximumBlockCount() const
```

> **characterCount()** — возвращает количество символов в документе. Прототип метода:
```c++
int characterCount() const
```

> **lineCount()** — возвращает количество абзацев в документе. Прототип метода:
```c++
int lineCount() const
```

> **blockCount()** — возвращает количество текстовых блоков в документе. Прототип метода:
```c++
int blockCount() const
```

> **firstBlock()** — возвращает экземпляр класса `QTextBlock`, который содержит первый текстовый блок документа. Прототип метода:
```c++
QTextBlock firstBlock() const
```

> **lastBlock()** — возвращает экземпляр класса `QTextBlock`, который содержит последний текстовый блок документа. Прототип метода:
```c++
QTextBlock lastBlock() const
```

> **findBlock()** — возвращает экземпляр класса `QTextBlock`, который содержит текстовый блок документа, включающий символ с указанным индексом. Прототип метода:
```c++
QTextBlock findBlock(int pos) const
```

> **findBlockByNumber()** — возвращает экземпляр класса `QTextBlock`, который содержит текстовый блок документа с указанным индексом. Прототип метода:
```c++
QTextBlock findBlockByNumber(int blockNumber) const
```

Класс `QTextDocument` содержит следующие основные сигналы (полный список смотрите в документации):

> **undoAvailable(bool)** — генерируется при изменении возможности отменить операцию ввода. Внутри обработчика через параметр доступно значение `true`, если можно отменить операцию ввода, и `false` — в противном случае;
>
>**redoAvailable(bool)** — генерируется при изменении возможности повторить отмененную операцию ввода. Внутри обработчика через параметр доступно значение `true`, если можно повторить отмененную операцию ввода, и `false` — в противном случае;
>
> **undoCommandAdded()** — генерируется при добавлении операции ввода в список возможных отмен;
>
> **blockCountChanged(int)** — генерируется при изменении количества текстовых блоков. Внутри обработчика через параметр доступно новое количество текстовых блоков;
>
> **cursorPositionChanged(const QTextCursor&)** — генерируется при изменении позиции текстового курсора из-за операции редактирования. Обратите внимание на то, что при простом перемещении текстового курсора сигнал не генерируется;
>
> **contentsChange(int,int,int)** — генерируется при изменении текста. Внутри обработчика через первый параметр доступен индекс позиции внутри документа, через второй параметр — количество удаленных символов, а через третий параметр — количество добавленных символов;
>
> **contentsChanged()** — генерируется при любом изменении документа;

## Класс QTextCursor

Класс `QTextCursor` реализует текстовый курсор, выделение и позволяет изменять документ. Конструктор класса `QTextCursor` имеет следующие форматы:

```c++
#include <QTextCursor>

QTextCursor()
QTextCursor(QTextDocument *document)
QTextCursor(QTextFrame *frame)
QTextCursor(const QTextBlock &block)
QTextCursor(const QTextCursor &cursor)
```

Создать текстовый курсор, установить его в документе и управлять им позволяют следующие методы из класса [[#Многострочное текстовое поле|QTextEdit]]:

> **textCursor()** — возвращает видимый в данный момент текстовый курсор (экземпляр класса `QTextCursor`). Чтобы изменения затронули текущий документ, необходимо передать этот объект в метод `setTextCursor()`. Прототип метода:
```c++
QTextCursor textCursor() const
```

> **setTextCursor()** — устанавливает текстовый курсор, экземпляр которого указан в качестве параметра. Прототип метода:
```c++
void setTextCursor(const QTextCursor &cursor)
```

> **cursorForPosition()** — возвращает текстовый курсор, который соответствует позиции, указанной в качестве параметра. Позиция задается с помощью экземпляра класса [[QPoint|QPoint]] в координатах области. Прототип метода:
```c++
QTextCursor cursorForPosition(const QPoint &pos) const
```

> **moveCursor()** — перемещает текстовый курсор внутри документа. Прототип метода:
```c++
void moveCursor(QTextCursor::MoveOperation operation,
				QTextCursor::MoveMode mode = QTextCursor::MoveAnchor)
```

В первом параметре можно указать следующие константы:

* **QTextCursor::NoMove** — не перемещать курсор;
* **QTextCursor::Start** — в начало документа;
* **QTextCursor::Up** — на одну строку вверх;
* **QTextCursor::StartOfLine** — в начало текущей строки;
* **QTextCursor::StartOfBlock** — в начало текущего текстового блока;
* **QTextCursor::StartOfWord** — в начало текущего слова;
* **QTextCursor::PreviousBlock** — в начало предыдущего текстового блока;
* **QTextCursor::PreviousCharacter** — сдвинуть на один символ влево;
* **QTextCursor::PreviousWord** — в начало предыдущего слова;
* **QTextCursor::Left** — сдвинуть на один символ влево;
* **QTextCursor::WordLeft** — влево на одно слово;
* **QTextCursor::End** — в конец документа;
* **QTextCursor::Down** — на одну строку вниз;
* **QTextCursor::EndOfLine** — в конец текущей строки;
* **QTextCursor::EndOfWord** — в конец текущего слова;
* **QTextCursor::EndOfBlock** — в конец текущего текстового блока;
* **QTextCursor::NextBlock** — в начало следующего текстового блока;
* **QTextCursor::NextCharacter** — сдвинуть на один символ вправо;
* **QTextCursor::NextWord** — в начало следующего слова;
* **QTextCursor::Right** — сдвинуть на один символ вправо;
* **QTextCursor::WordRight** — в начало следующего слова.

Помимо перечисленных констант существуют также константы `NextCell`, `PreviousCell`, `NextRow` и `PreviousRow`, позволяющие перемещать текстовый курсор внутри таблицы. В необязательном параметре `mode` можно указать следующие константы:
* **QTextCursor::MoveAnchor** — если существует выделенный фрагмент, то выделение будет снято и текстовый курсор переместится в новое место (значение по умолчанию);
* **QTextCursor::KeepAnchor** — фрагмент текста от старой позиции курсора до новой будет выделен.

Класс **QTextCursor** содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **isNull()** — возвращает значение `true`, если объект курсора является нулевым (создан с помощью конструктора без параметра), и `false` — в противном случае. Прототип метода:
```c++
bool isNull() const
```

> **setPosition()** — перемещает текстовый курсор внутри документа. В первом параметре указывается позиция внутри документа. Необязательный параметр `mode` аналогичен одноименному параметру в методе `moveCursor()` из класса `QTextEdit`. Прототип метода:
```c++
void setPosition(int pos, QTextCursor::MoveMode m = MoveAnchor)
```

> **movePosition()** — перемещает текстовый курсор внутри документа. Прототип метода:
```c++
bool movePosition(QTextCursor::MoveOperation operation,
					QTextCursor::MoveMode mode = MoveAnchor, int n = 1)
```

Параметры `operation` и `mode` аналогичны одноименным параметрам в методе `moveCursor()` из класса `QTextEdit`. Необязательный параметр `n` позволяет указать количество перемещений. Например, переместить курсор на 10 символов вперед
можно так:
```c++
QTextCursor cur = textEdit->textCursor();
cur.movePosition(QTextCursor::NextCharacter, QTextCursor::MoveAnchor, 10);
textEdit->setTextCursor(cur);
```

Метод `movePosition()` возвращает значение `true`, если операция успешно выполнена указанное количество раз. Если было выполнено меньшее количество перемещений (например, из-за достижения конца документа), то метод возвращает значение `false`;

> **position()** — возвращает позицию текстового курсора внутри документа. Прототип метода:
```c++
int position() const
```

> **positionInBlock()** — возвращает позицию текстового курсора внутри блока. Прототип метода:
```c++
int positionInBlock() const
```

> **block()** — возвращает экземпляр класса `QTextBlock`, который описывает текстовый блок, содержащий курсор. Прототип метода:
```c++
QTextBlock block() const
```

> **blockNumber()** — возвращает индекс текстового блока, содержащего курсор. Прототип метода:
```c++
int blockNumber() const
```

> **atStart()** — возвращает значение `true`, если текстовый курсор находится в начале документа, и `false` — в противном случае. Прототип метода:
```c++
bool atStart() const
```

> **atEnd()** — возвращает значение `true`, если текстовый курсор находится в конце документа, и `false` — в противном случае. Прототип метода:
```c++
bool atEnd() const
```

> **atBlockStart()** — возвращает значение `true`, если текстовый курсор находится в начале блока, и `false` — в противном случае. Прототип метода:
```c++
bool atBlockStart() const
```

> **atBlockEnd()** — возвращает значение `true`, если текстовый курсор находится в конце блока, и `false` — в противном случае. Прототип метода:
```c++
bool atBlockEnd() const
```

> **select()** — выделяет фрагмент в документе в соответствии с указанным режимом. Прототип метода:
```c++ 
void select(QTextCursor::SelectionType selection)
```

В качестве параметра можно указать следующие константы:

* **QTextCursor::WordUnderCursor** — выделяет слово, в котором расположен курсор;
* **QTextCursor::LineUnderCursor** — выделяет текущую строку;
* **QTextCursor::BlockUnderCursor** — выделяет текущий текстовый блок;
* **QTextCursor::Document** — выделяет весь документ;

> **hasSelection()** — возвращает значение `true`, если существует выделенный фрагмент, и `false` — в противном случае. Прототип метода:
```c++
bool hasSelection() const
```

> **hasComplexSelection()** — возвращает значение `true`, если выделенный фрагмент содержит сложное форматирование, а не просто текст, и `false` — в противном случае. Прототип метода:
```c++
bool hasComplexSelection() const
```

> **clearSelection()** — снимает выделение. Прототип метода:
```c++
void clearSelection()
```

> **selectionStart()** — возвращает начальную позицию выделенного фрагмента. Прототип метода:
```c++
int selectionStart() const
```

> **selectionEnd()** — возвращает конечную позицию выделенного фрагмента. Прототип метода:
```c++
int selectionEnd() const
```

> **selectedText()** — возвращает текст выделенного фрагмента. Обратите внимание: если выделенный фрагмент занимает несколько строк, то вместо символа перевода строки вставляется символ с кодом `\u2029`. Прототип метода:
```c++
QString selectedText() const
```

> **selection()** — возвращает экземпляр класса `QTextDocumentFragment`, который описывает выделенный фрагмент. Получить текст позволяют методы `toPlainText()` (возвращает простой текст) и `toHtml()` (возвращает текст в формате HTML) из этого класса. Прототип метода:
```c++
QTextDocumentFragment selection() const
```

> **removeSelectedText()** — удаляет выделенный фрагмент. Прототип метода:
```c++
void removeSelectedText()
```

> **deleteChar()** — если нет выделенного фрагмента, то удаляет символ справа от курсора, в противном случае удаляет выделенный фрагмент. Прототип метода:
```c++
void deleteChar()
```

> **deletePreviousChar()** — если нет выделенного фрагмента, то удаляет символ слева от курсора, в противном случае удаляет выделенный фрагмент. Прототип метода:
```c++
void deletePreviousChar()
```

> `beginEditBlock()` и `endEditBlock()` — задают начало и конец блока инструкций. Эти инструкции могут быть отменены или повторены как единое целое с помощью методов `undo()` и `redo()`. Прототипы методов:
```c++
void beginEditBlock()

void endEditBlock()
```

> **joinPreviousEditBlock()** — делает последующие инструкции частью предыдущего блока инструкций. Прототип метода:
```c++
void joinPreviousEditBlock()
```

> **setKeepPositionOnInsert()** — если в качестве параметра указано значение `true`, то после операции вставки курсор сохранит свою предыдущую позицию. По умолчанию позиция курсора при вставке изменяется. Прототип метода:
```c++
void setKeepPositionOnInsert(bool)
```

> **insertText()** — вставляет простой текст. Прототипы метода:
```c++
void insertText(const QString &text)

void insertText(const QString &text,
				const QTextCharFormat &format)
```

> **insertHtml()** — вставляет текст в формате HTML. Прототип метода:
```c++
void insertHtml(const QString &html)
```

С помощью методов `insertBlock(),` `insertFragment()`, `insertFrame()`, `insertImage()`, `insertList()` и `insertTable()` можно вставить различные элементы, например изображения, списки и др. Изменить формат выделенного фрагмента позволяют методы `mergeBlockCharFormat()`, `mergeBlockFormat()` и `mergeCharFormat()`. За подробной информацией по этим методам обращайтесь к документации.




























