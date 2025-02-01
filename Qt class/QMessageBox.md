
[[#Класс QMessageBox|Класс QMessageBox]] 10.3
1. [[#Основные методы и сигналы|Основные методы и сигналы]] 10.3.1
2. [[#Окно для вывода обычного сообщения|Окно для вывода обычного сообщения]] 10.3.2
3. [[#Окно запроса подтверждения|Окно запроса подтверждения]] 10.3.3
4. [[#Окно для вывода предупреждающего сообщения|Окно для вывода предупреждающего сообщения]] 10.3.4
5. [[#Окно для вывода критического сообщения|Окно для вывода критического сообщения]] 10.3.5
6. [[#Окно «О программе»|Окно «О программе»]] 10.3.6
7. [[#Окно «About Qt»|Окно «About Qt»]] 10.3.7

# Класс QMessageBox

Класс `QMessageBox` реализует модальные диалоговые окна для вывода сообщений. Иерархия наследования для класса `QMessageBox` выглядит так:
```
(QObject, QPaintDevice) — QWidget — QDialog — QMessageBox
```

Форматы конструктора класса `QMessageBox`:

```c++
#include <QMessageBox>

QMessageBox(QWidget *parent = nullptr)
QMessageBox(QMessageBox::Icon icon, const QString &title,
			const QString &text, QMessageBox::StandardButtons buttons = NoButton,
			QWidget *parent = nullptr,
			Qt::WindowFlags f = Qt::Dialog | Qt::MSWindowsFixedSizeDialogHint)
```

Если в параметре `parent` передан указатель на родительское окно, то диалоговое окно будет центрироваться относительно родительского окна, а не относительно экрана. Параметр `f` задает [[QWidget#Указание типа окна|тип окна]]. В параметре `icon` могут быть указаны следующие константы:

> **QMessageBox::NoIcon** — нет значка;
> 
> **QMessageBox::Question** — значок со знаком вопроса;
> 
> **QMessageBox::Information** — значок информационного сообщения;
> 
> **QMessageBox::Warning** — значок предупреждающего сообщения;
> 
> **QMessageBox::Critical** — значок критического сообщения.

В параметре `buttons` указываются следующие константы (или их комбинация через оператор `|`):

> **QMessageBox::NoButton** — кнопки не установлены;
> 
> **QMessageBox::Ok** — кнопка `OK` с ролью `AcceptRole`;
> 
> **QMessageBox::Cancel** — кнопка `Cancel` с ролью `RejectRole`;
> 
> **QMessageBox::Yes** — кнопка `Yes` с ролью `YesRole`;
> 
> **QMessageBox::YesToAll** — кнопка `Yes to All` с ролью `YesRole`;
> 
> **QMessageBox::No** — кнопка `No` с ролью `NoRole`;
> 
> **QMessageBox::NoToAll** — кнопка `No to All` с ролью `NoRole`;
> 
> **QMessageBox::Open** — кнопка `Open` с ролью `AcceptRole`;
> 
> **QMessageBox::Close** — кнопка `Close` с ролью `RejectRole`;
> 
> **QMessageBox::Save** — кнопка `Save` с ролью `AcceptRole`;
> 
> **QMessageBox::SaveAll** — кнопка `Save All` с ролью `AcceptRole`;
> 
> **QMessageBox::Discard** — кнопка `Discard` или `Don't Save` (надпись на кнопке зависит от операционной системы) с ролью `DestructiveRole`;
> 
> **QMessageBox::Apply** — кнопка `Apply` с ролью `ApplyRole`;
> 
> **QMessageBox::Reset** — кнопка `Reset` с ролью `ResetRole`;
> 
> **QMessageBox::RestoreDefaults** — кнопка `Restore Defaults` с ролью `ResetRole`;
> 
> **QMessageBox::Help** — кнопка `Help` с ролью `HelpRole`;
> 
> **QMessageBox::Abort** — кнопка `Abort` с ролью `RejectRole`;
> 
> **QMessageBox::Retry** — кнопка `Retry` с ролью `AcceptRole`;
> 
> **QMessageBox::Ignore** — кнопка `Ignore` с ролью `AcceptRole`.

Поведение кнопок описывается с помощью ролей. В качестве роли можно указать следующие константы:

> **QMessageBox::InvalidRole** — ошибочная роль;
> 
> **QMessageBox::AcceptRole** — нажатие кнопки устанавливает код возврата равным значению константы `Accepted`;
> 
> **QMessageBox::RejectRole** — нажатие кнопки устанавливает код возврата равным значению константы `Rejected`;
> 
> **QMessageBox::DestructiveRole** — кнопка для отказа от изменений;
> 
> **QMessageBox::ActionRole**;
> 
> **QMessageBox::HelpRole** — кнопка для отображения справки;
> 
> **QMessageBox::YesRole** — кнопка `Yes`;
> 
> **QMessageBox::NoRole** — кнопка `No`;
> 
> **QMessageBox::ResetRole** — кнопка для установки значений по умолчанию;
> 
> **QMessageBox::ApplyRole** — кнопка для принятия изменений.

После создания экземпляра класса следует вызвать метод `exec()` для отображения окна. Метод возвращает код нажатой кнопки. Пример:
```c++
QMessageBox dialog(QMessageBox::Critical,
		"Текст заголовка", "Текст сообщения",
		QMessageBox::Ok | QMessageBox::Cancel,
		this);
		
int result = dialog.exec();
```

## Основные методы и сигналы

Класс `QMessageBox` наследует все методы из базовых классов и содержит следующие дополнительные методы (перечислены только основные методы; полный список смотрите в документации):

> **setIcon()** — устанавливает стандартный значок. Прототип метода:
```c++
void setIcon(QMessageBox::Icon)
```

> **setIconPixmap()** — устанавливает пользовательский значок. Прототип метода:
```c++
void setIconPixmap(const QPixmap &pixmap)
```

> **setWindowTitle()** — задает текст заголовка окна. Прототип метода:
```c++
void setWindowTitle(const QString &title)
```

> **setText()** — задает текст сообщения. Можно указать как обычный текст, так и текст в формате HTML. Перенос строки в обычной строке осуществляется с помощью символа `\n`, а в строке в формате HTML — с помощью тега `<br>`. Прототип метода:
```c++
void setText(const QString &text)
```

> **setInformativeText()** — задает дополнительный текст сообщения, который отображается под обычным текстом сообщения. Можно указать как обычный текст, так и текст в формате HTML. Прототип метода:
```c++
void setInformativeText(const QString &text)
```

> **setDetailedText()** — задает текст описания деталей сообщения. Если текст задан, то будет добавлена кнопка `Show Details`, с помощью которой можно отобразить скрытую панель с описанием. Прототип метода:
```c++
void setDetailedText(const QString &text)
```

> **setTextFormat()** — задает режим отображения текста сообщения. Прототип метода:
```c++
void setTextFormat(Qt::TextFormat format)
```

Могут быть указаны следующие константы:

* **Qt::PlainText** — простой текст;
* **Qt::RichText** — форматированный текст;
* **Qt::AutoText** — автоматическое определение (режим по умолчанию). Если текст содержит теги, то используется режим `RichText`, в противном случае — режим `PlainText`;
* **Qt::MarkdownText;**

> **setStandardButtons()** — устанавливает несколько стандартных кнопок. Прототип метода:
```c++
void setStandardButtons(QMessageBox::StandardButtons buttons)
```

> **addButton()** — добавляет кнопку в окно. Прототипы методов:
```c++
void addButton(QAbstractButton *button, QMessageBox::ButtonRole role)
QPushButton *addButton(const QString &text, QMessageBox::ButtonRole role)
QPushButton *addButton(QMessageBox::StandardButton button)
```

> **setDefaultButton()** — задает кнопку по умолчанию. Прототипы метода:
```c++
void setDefaultButton(QPushButton *button)
void setDefaultButton(QMessageBox::StandardButton button)
```

> **setEscapeButton()** — задает кнопку, которая будет нажата при нажатии клавиши `<Esc>`. Прототипы метода:
```c++
void setEscapeButton(QAbstractButton *button)
void setEscapeButton(QMessageBox::StandardButton button)
```

> **clickedButton()** — возвращает указатель на кнопку, которая была нажата, или нулевой указатель. Прототип метода:
```c++
QAbstractButton *clickedButton() const
```

> **button()** — возвращает указатель на кнопку, соответствующую указанному значению, или нулевой указатель, если стандартная кнопка не была добавлена в окно ранее. Прототип метода:
```c++
QAbstractButton *button(QMessageBox::StandardButton which) const
```

> **buttonRole()** — возвращает роль указанной в параметре кнопки. Если кнопка не была добавлена в окно, то метод возвращает значение константы `InvalidRole`. Прототип метода:
```c++
QMessageBox::ButtonRole buttonRole(QAbstractButton *button) const
```

> **buttons()** — возвращает список с указателями на кнопки, которые были добавлены в окно. Прототип метода:
```c++
QList<QAbstractButton *> buttons() const
```

> **removeButton()** — удаляет кнопку из окна, при этом не удаляя объект кнопки. Прототип метода:
```c++
void removeButton(QAbstractButton *button)
```

Класс `QMessageBox` содержит сигнал `buttonClicked(QAbstractButton *)`, который генерируется при нажатии кнопки в окне. Внутри обработчика через параметр доступен указатель на кнопку.

## Окно для вывода обычного сообщения

Помимо рассмотренных методов класс `QMessageBox` содержит несколько статических методов, реализующих готовые диалоговые окна. Для вывода модального окна с информационным сообщением предназначен статический метод `information()`. Прототип метода:
```c++
static QMessageBox::StandardButton information(QWidget *parent,
				const QString &title, const QString &text,
				QMessageBox::StandardButtons buttons = Ok,
				QMessageBox::StandardButton defaultButton = NoButton)
```

В параметре `parent` передается указатель на родительское окно или нулевой указатель. Если передан указатель, то диалоговое окно будет центрироваться относительно родительского окна, а не относительно экрана. Необязательный параметр `buttons` позволяет указать отображаемые стандартные кнопки (константы, задающие стандартные кнопки, указываются через оператор `|`). По умолчанию отображается кнопка `OK`. Параметр `defaultButton` назначает кнопку по умолчанию. Метод `information()` возвращает код нажатой кнопки. Пример:
```c++
QMessageBox::information(this, "Текст заголовка",
						"Текст сообщения",
						QMessageBox::Close,
						QMessageBox::Close);
```

Результат выполнения этого кода показан на рис. 10.1.

![[ParallelProg_197.png]]

## Окно запроса подтверждения

Для вывода модального окна с запросом подтверждения каких-либо действий предназначен статический метод `question()`. Прототип метода:
```c++
static QMessageBox::StandardButton question(QWidget *parent,
		const QString &title, const QString &text,
		QMessageBox::StandardButtons buttons = StandardButtons(Yes | No),
		QMessageBox::StandardButton defaultButton = NoButton)
```


В параметре `parent` передается указатель на родительское окно или нулевой указатель. Если передан указатель, то диалоговое окно будет центрироваться относительно родительского окна, а не относительно экрана. Необязательный параметр `buttons` позволяет указать отображаемые стандартные кнопки (константы, задающие стандартные кнопки, указываются через оператор `|`). Параметр `defaultButton` назначает кнопку по умолчанию. Метод `question()` возвращает код нажатой кнопки. Пример:
```c++
QMessageBox::StandardButton result = QMessageBox::question(
			this, "Текст заголовка",
			"Вы действительно хотите выполнить действие?",
			QMessageBox::Yes | QMessageBox::No |
			QMessageBox::Cancel,
			QMessageBox::Cancel);
```

Результат выполнения этого кода показан на рис.
![[ParallelProg_196.png]]

## Окно для вывода предупреждающего сообщения

Для вывода модального окна с предупреждающим сообщением предназначен статический метод `warning()`. Прототип метода:
```c++
static QMessageBox::StandardButton warning(QWidget *parent,
		const QString &title, const QString &text,
		QMessageBox::StandardButtons buttons = Ok,
		QMessageBox::StandardButton defaultButton = NoButton)
```

В параметре `parent` передается указатель на родительское окно или нулевой указатель. Если передан указатель, то диалоговое окно будет центрироваться относительно родительского окна, а не относительно экрана. Необязательный параметр `buttons` позволяет указать отображаемые стандартные кнопки (константы, задающие стандартные кнопки, указываются через оператор `|`). По умолчанию отображается кнопка `OK`. Параметр `defaultButton` назначает кнопку по умолчанию. Метод `warning()` возвращает код нажатой кнопки. Пример:

```c++
QMessageBox::StandardButton result = QMessageBox::warning(
			this, "Текст заголовка",
			"Действие может быть опасным. Продолжить?",
			QMessageBox::Yes | QMessageBox::No |
			QMessageBox::Cancel,
			QMessageBox::Cancel);
```

Результат выполнения этого кода показан на рис.

![[ParallelProg_198.png]]

## Окно для вывода критического сообщения

Для вывода модального окна с критическим сообщением предназначен статический метод `critical()`. Прототип метода:
```c++
static QMessageBox::StandardButton critical(QWidget *parent,
			const QString &title, const QString &text,
			QMessageBox::StandardButtons buttons = Ok,
			QMessageBox::StandardButton defaultButton = NoButton)
```

В параметре `parent` передается указатель на родительское окно или нулевой указатель. Если передан указатель, то диалоговое окно будет центрироваться относительно родительского окна, а не относительно экрана. Необязательный параметр `buttons` позволяет указать отображаемые стандартные кнопки (константы, задающие стандартные кнопки, указываются через оператор `|`). По умолчанию отображается кнопка `OK`. Параметр `defaultButton` назначает кнопку по умолчанию. Метод `critical()` возвращает код нажатой кнопки. Пример:
```c++
QMessageBox::critical(this, "Текст заголовка",
			"Программа выполнила недопустимую ошибку и будет закрыта",
			QMessageBox::Ok, QMessageBox::Ok);
```

Результат выполнения этого кода показан на рис.

![[ParallelProg_199.png]]

## Окно «О программе»

Для вывода модального окна с описанием программы и информацией об авторских правах предназначен статический метод `about()`. Прототип метода:
```
static void about(QWidget *parent, const QString &title, const QString &text)
```

В параметре `parent` передается указатель на родительское окно или нулевой указатель. Если передан указатель, то диалоговое окно будет центрироваться относительно родительского окна, а не относительно экрана. Слева от текста сообщения отображается значок приложения, если он был установлен. Пример:
```c++
QMessageBox::about(this, "Текст заголовка", "Описание программы");
```

Результат выполнения этого кода показан на рис.
![[ParallelProg_200.png]]

## Окно «About Qt»

Для вывода модального окна с описанием используемой версии библиотеки Qt предназначен статический метод `aboutQt()`. Прототип метода:
```
static void aboutQt(QWidget *parent, const QString &title = QString())
```

В параметре parent передается указатель на родительское окно или нулевой указатель. Если передан указатель, то диалоговое окно будет центрироваться относительно родительского окна, а не относительно экрана. В параметре `title` можно указать текст, выводимый в заголовке окна. Если параметр не указан, то выводится заголовок «About Qt». Пример:
```c++
QMessageBox::aboutQt(this);
```

