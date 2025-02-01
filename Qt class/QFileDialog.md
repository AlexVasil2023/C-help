
[[#QFileDialog|Класс QFileDialog]] 10.5
1. [[#Основные методы и сигналы|Основные методы и сигналы]]  10.5.1
2. [[#Окно для выбора каталога]] 10.5.2
3. [[#Окно для открытия файла|Окно для открытия файла]] 10.5.3
4. [[#Окно для сохранения файла|Окно для сохранения файла]] 10.5.4

# QFileDialog

Класс `QFileDialog` реализует модальные диалоговые окна для выбора файла или каталога. Иерархия наследования для класса `QFileDialog` выглядит так:
```
(QObject, QPaintDevice) — QWidget — QDialog — QFileDialog
```

Форматы конструктора класса `QFileDialog`:
```c++
#include <QFileDialog>
QFileDialog(QWidget *parent, Qt::WindowFlags flags)
QFileDialog(QWidget *parent = nullptr,
			const QString &caption = QString(),
			const QString &directory = QString(),
			const QString &filter = QString())
```

Если в параметре `parent` передан указатель на родительское окно, то диалоговое окно будет центрироваться относительно родительского окна, а не относительно экрана. Параметр `flags` задает [[QWidget#Указание типа окна|тип окна]]. Необязательный параметр `caption` позволяет указать заголовок окна, параметр `directory` — начальный каталог, а параметр `filter` — ограничивает отображение файлов указанным фильтром.

После создания экземпляра класса следует вызвать метод `exec()` для отображения окна. Метод возвращает код возврата в виде значения следующих констант: `Accepted` или `Rejected`.

## Основные методы и сигналы

Класс `QFileDialog` наследует все методы из базовых классов и содержит следующие дополнительные методы (перечислены только основные методы; полный список смотрите в документации):

> **setAcceptMode()** — задает тип окна. Прототип метода:
```c++
void setAcceptMode(QFileDialog::AcceptMode mode)
```

В качестве параметра указываются следующие константы:
* **QFileDialog::AcceptOpen** — окно для открытия файла (по умолчанию);
* **QFileDialog::AcceptSave** — окно для сохранения файла;

> **setViewMode()** — задает режим отображения файлов. Прототип метода:
```c++
void setViewMode(QFileDialog::ViewMode mode)
```

В качестве параметра указываются следующие константы:
> `QFileDialog::Detail` — отображается детальная информация о файлах;
> `QFileDialog::List` — отображается только значок и название файла;

> **setFileMode()** — задает тип возвращаемого значения. Прототип метода:
```c++
void setFileMode(QFileDialog::FileMode mode)
```

В качестве параметра указываются следующие константы:
* **QFileDialog::AnyFile** — имя файла независимо от того, существует он или нет;
* **QFileDialog::ExistingFile** — имя существующего файла;
* **QFileDialog::Directory** — имя каталога;
* **QFileDialog::ExistingFiles** — список из нескольких существующих файлов. Несколько файлов можно выбрать, удерживая нажатой клавишу `<Ctrl>`;

> **setOption()** — если во втором параметре указано значение `true`, то производит установку указанной в первом параметре опции, а если `false`, то сбрасывает опцию. Прототип метода:
```c++
void setOption(QFileDialog::Option option, bool on = true)
```

В первом параметре можно указать следующие константы:
* **QFileDialog::ShowDirsOnly** — отображать только названия каталогов. Опция работает только при использовании типа возвращаемого значения `Directory`;
* **QFileDialog::DontResolveSymlinks**;
* **QFileDialog::DontConfirmOverwrite** — не спрашивать разрешения, если выбран существующий файл;
* **QFileDialog::DontUseNativeDialog**;
* **QFileDialog::ReadOnly** — режим только для чтения;
* **QFileDialog::HideNameFilterDetails** — скрывает детали фильтра;
* **QFileDialog::DontUseCustomDirectoryIcons**;

> **setOptions()** — позволяет установить сразу несколько опций сразу. Прототип метода:
```c++
void setOptions(QFileDialog::Options options)
```

> **setDirectory()** — задает отображаемый каталог. Прототипы метода:
```c++
void setDirectory(const QString &directory)
void setDirectory(const QDir &directory)
```

> **directory()** — возвращает экземпляр класса [[QDir|QDir]] с путем к отображаемому каталогу. Прототип метода:
```c++
QDir directory() const
```

> **setNameFilter()** — устанавливает фильтр. Чтобы установить несколько фильтров, необходимо перечислить их через две «точки с запятой». Прототип метода:
```c++
void setNameFilter(const QString &filter)
```

Пример:
```c++
dialog.setNameFilter("All (*);;Images (*.png *.jpg)");
```

> **setNameFilters()** — устанавливает несколько фильтров. Прототип метода:
```c++
void setNameFilters(const QStringList &filters)
```

Пример:
```c++
QStringList list;
list << "All (*)" << "Images (*.png *.jpg)";

dialog.setNameFilters(list);
```

> **selectFile()** — выбирает указанный файл. Прототип метода:
```c++
void selectFile(const QString &filename)
```

> **selectedFiles()** — возвращает список с выбранными файлами. Прототип метода:
```c++
QStringList selectedFiles() const
```

> **setDefaultSuffix()** — задает расширение, которое добавляется к файлу при отсутствии указанного расширения. Прототип метода:
```c++
void setDefaultSuffix(const QString &suffix)
```

> **setHistory()** — задает список истории. Прототип метода:
```c++
void setHistory(const QStringList &paths)
```
> **setSidebarUrls()** — задает список URL-адресов, отображаемый на боковой панели. Прототип метода:
```c++
void setSidebarUrls(const QList<QUrl> &urls)
```

> **setLabelText()** — позволяет изменить текст указанной надписи. Прототип метода:
```c++
void setLabelText(QFileDialog::DialogLabel label, const QString &text)
```

В первом параметре указываются следующие константы:
* **QFileDialog::LookIn** — надпись слева от списка с каталогами;
* **QFileDialog::FileName** — надпись слева от поля с названием файла;
* **QFileDialog::FileType** — надпись слева от поля с типами файлов;
* **QFileDialog::Accept** — надпись на кнопке, нажатие которой приведет к принятию диалога (по умолчанию — `Open` или `Save`);
* **QFileDialog::Reject** — надпись на кнопке, нажатие которой приведет к отмене диалога (по умолчанию — `Cancel`);

> **saveState()** — возвращает экземпляр класса [[QByteArray|QByteArray]] с текущими настройками. Прототип метода:
```c++
QByteArray saveState() const
```

> **restoreState()** — восстанавливает настройки и возвращает статус успешности выполненной операции. Прототип метода:
```c++
bool restoreState(const QByteArray &state)
```

Класс `QFileDialog` содержит следующие основные сигналы (полный список смотрите в документации):

> **currentChanged(const QString&)** — генерируется при изменении текущего файла. Внутри обработчика через параметр доступен новый путь;
> 
> **directoryEntered(const QString&)** — генерируется при изменении каталога. Внутри обработчика через параметр доступен новый путь;
> 
> **filterSelected(const QString&)** — генерируется при изменении фильтра. Внутри обработчика через параметр доступен новый фильтр;
> 
> **fileSelected(const QString&)** — генерируется при выборе файла и принятии диалога. Внутри обработчика через параметр доступен путь;
> 
> **filesSelected(const QStringList&)** — генерируется при выборе нескольких файлов и принятии диалога. Внутри обработчика через параметр доступен список с путями.

## Окно для выбора каталога

Помимо рассмотренных методов класс `QFileDialog` содержит несколько статических методов, реализующих готовые диалоговые окна. Окно для выбора каталога реализуется с помощью статического метода `getExistingDirectory()`. Прототип метода:

```c++
static QString getExistingDirectory(QWidget *parent = nullptr,
		const QString &caption = QString(), const QString &dir = QString(),
		QFileDialog::Options options = ShowDirsOnly)
```

В параметре `parent` передается указатель на родительское окно или нулевой указатель. Необязательный параметр `caption` задает текст заголовка окна, параметр `dir` — текущий каталог, а параметр `options` устанавливает опции (см. [[QFileDialog#Основные методы и сигналы|описание метода setOption()]]). Метод возвращает выбранный каталог или пустую строку. Пример:
```c++
QString dir = QFileDialog::getExistingDirectory(this,
					"Заголовок окна",
					QDir::currentPath());
qDebug() << dir;
```

Результат выполнения этого кода показан на рис.

Можно также воспользоваться статическим методом `getExistingDirectoryUrl()`:
```c++
static QUrl getExistingDirectoryUrl(QWidget *parent = nullptr,
				const QString &caption = QString(), const QUrl &dir = QUrl(),
				QFileDialog::Options options = ShowDirsOnly,
				const QStringList &supportedSchemes = QStringList())
```

![[gui_4.png]]

## Окно для открытия файла

Окно для открытия одного файла реализуется с помощью статического метода `getOpenFileName()`. Прототип метода:
```c++
static QString getOpenFileName(QWidget *parent = nullptr,
		const QString &caption = QString(), const QString &dir = QString(),
		const QString &filter = QString(), QString *selectedFilter = nullptr,
		QFileDialog::Options options = Options())
```

В параметре `parent` передается указатель на родительское окно или нулевой указатель. Необязательный параметр `caption` задает текст заголовка окна, параметр `dir` — текущий каталог, параметр `filter` — фильтр, а параметр `options` устанавливает опции (см. [[#Основные методы и сигналы|описание метода setOption()]]). Метод возвращает выбранный файл или пустую строку. Пример:
```c++
QString f = QFileDialog::getOpenFileName(this,
		"Заголовок окна", "C:\\cpp\\projectsQt\\Test",
		"All (*);;Images (*.png *.jpg)");
		
qDebug() << f;
```

Результат выполнения этого кода показан на рис..

Можно также воспользоваться статическим методом `getOpenFileUrl()`:
```c++
static QUrl getOpenFileUrl(QWidget *parent = nullptr,
		const QString &caption = QString(), const QUrl &dir = QUrl(),
		const QString &filter = QString(), QString *selectedFilter = nullptr,
		QFileDialog::Options options = Options(),
		const QStringList &supportedSchemes = QStringList())
```

![[gui_5.png]]

Окно для открытия нескольких файлов реализуется с помощью статического метода `getOpenFileNames()`. Прототип метода:
```c++
static QStringList getOpenFileNames(QWidget *parent = nullptr,
		const QString &caption = QString(), const QString &dir = QString(),
		const QString &filter = QString(), QString *selectedFilter = nullptr,
		QFileDialog::Options options = Options())
```

Метод возвращает список с выбранными файлами или пустой список. Пример:

```c++
QStringList list = QFileDialog::getOpenFileNames(this,
		"Заголовок окна", "C:\\cpp\\projectsQt\\Test",
		"All (*);;Images (*.png *.jpg)");

qDebug() << list;
```

Можно также воспользоваться статическим методом `getOpenFileUrls()`:

```c++
static QList<QUrl> getOpenFileUrls(QWidget *parent = nullptr,
		const QString &caption = QString(), const QUrl &dir = QUrl(),
		const QString &filter = QString(), QString *selectedFilter = nullptr,
		QFileDialog::Options options = Options(),
		const QStringList &supportedSchemes = QStringList())
```

## Окно для сохранения файла

Окно для сохранения файла реализуется с помощью статического метода `getSaveFileName()`. Прототип метода:

```c++
static QString getSaveFileName(QWidget *parent = nullptr,
		const QString &caption = QString(), const QString &dir = QString(),
		const QString &filter = QString(), QString *selectedFilter = nullptr,
		QFileDialog::Options options = Options())
```

В параметре `parent` передается указатель на родительское окно или нулевой указатель. Необязательный параметр `caption` задает текст заголовка окна, параметр `dir` — текущий каталог, параметр `filter` — фильтр, а параметр `options` устанавливает опции (см. описание метода [[#Основные методы и сигналы|описание метода setOption()]]). Метод возвращает выбранный файл или пустую строку. Пример:
```c++
QString f = QFileDialog::getSaveFileName(this,
		"Заголовок окна", "C:\\cpp\\projectsQt\\Test",
		"All (*);;Images (*.png *.jpg)");
		
qDebug() << f;
```

Результат выполнения этого кода показан на рис.
![[gui_6.png]]

Можно также воспользоваться статическим методом `getOpenFileUrls()`:
```c++
static QUrl getSaveFileUrl(QWidget *parent = nullptr,
		const QString &caption = QString(), const QUrl &dir = QUrl(),
		const QString &filter = QString(), QString *selectedFilter = nullptr,
		QFileDialog::Options options = Options(),
		const QStringList &supportedSchemes = QStringList())
```

