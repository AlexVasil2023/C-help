# Содержание плагина

**Плагин** - это библиотека с определенным интерфейсом, которая загружается по требованию. Это отличается от библиотеки тем, что библиотека связывается и загружается при запуске приложения. В случае QML интерфейс называется [[QQmlExtensionPlugin|QQmlExtensionPlugin]] . В нем есть два интересных для нас метода `initializeEngine()` и `registerTypes()`. При загрузке плагина сначала вызывается метод `initializeEngine()`, который позволяет нам получить доступ к движку для отображения объектов плагина в
корневой контекст. В большинстве случаев вы будете использовать только метод `registerTypes()`. Он позволяет зарегистрировать пользовательские QML-типы в движке по указанному URL. Для начала создадим небольшой класс утилиты `FileIO`. Он позволит читать и записывать текстовые файлы из QML. Первая итерация может выглядеть следующим образом в имитированной реализации QML.

```c++
// FileIO.qml (good)
QtObject {
	function write(path, text) {};
	function read(path) { return "TEXT" }
}
```

Это чистая QML-реализация возможного QML API на базе C++. Мы используем ее для изучения API. Мы видим, что нам нужны функции чтения и записи . Мы также видим, что функция записи принимает путь и `text`, а функция `read` принимает путь и возвращает текст. Как видно, `path` и `text` являются общими параметрами, и, возможно, мы можем извлечь их как свойства, чтобы упростить использование API в декларативном контексте.

```c++
// FileIO.qml (better)
QtObject {
	property url source
	property string text
	
	function write() {} // open file and write text
	function read() {} // read file and assign to text
}
```

Да, это больше похоже на QML API. Мы используем свойства для того, чтобы среда могла привязываться к нашим свойствам и реагировать на изменения.

Для создания такого API на языке C++ нам потребуется создать интерфейс Qt C++, который будет выглядеть следующим образом.

```c++
class FileIO : public QObject {
	...
	
	Q_PROPERTY(QUrl source READ source WRITE setSource NOTIFY s
	Q_PROPERTY(QString text READ text WRITE setText NOTIFY text
	
	...
public:
	
	Q_INVOKABLE void read();
	Q_INVOKABLE void write();

	...
}
```

Тип `FileIO` должен быть зарегистрирован в движке QML. Мы хотим использовать его в модуле "org.example.io"

```c++
import org.example.io 1.0
	
FileIO {}
```

Плагин может отображать несколько типов с помощью одного модуля. Но он не может отображать несколько модулей от одного плагина. Поэтому между модулями и плагинами существует связь "один к одному". Эта связь выражается идентификатором модуля.

## Создание плагина

Qt Creator содержит мастер создания подключаемого модуля QtQuick 2 QML Extension Plugin, который находится в разделе Library при создании нового проекта. Мы используем его для создания подключаемого модуля `fileio` с объектом `FileIO` для запуска внутри модуля org.example.io .

> Текущий мастер генерирует проект на основе [[QMake|QMake]]. Для создания проекта на основе [[CMake|CMake]] используйте пример из этой главы.

Проект должен состоять из файлов `fileio.h` и `fileio.cpp`, которые объявляют и реализуют тип `FileIO`, и файла `fileio_plugin.cpp`, содержащего собственно класс подключаемого модуля, который позволяет движку QML обнаруживать расширение.

Класс подключаемого модуля является производным от класса [[QQmlEngineExtensionPlugin|QQmlEngineExtensionPlugin]] и содержит макросы `Q_OBJECT` и `Q_PLUGIN_METADATA`. Весь файл можно увидеть ниже.

```c++
#include <QQmlEngineExtensionPlugin>

class FileioPlugin : public QQmlEngineExtensionPlugin
{
	Q_OBJECT
	Q_PLUGIN_METADATA(IID QQmlEngineExtensionInterface_iid)
};

#include "fileio_plugin.moc"
```

Расширение автоматически обнаружит и зарегистрирует все типы, помеченные `QML_ELEMENT` и `QML_NAMED_ELEMENT`. Как это делается, мы увидим ниже в разделе "Реализация FileIO".

Для того чтобы импорт модуля работал, пользователю также необходимо указать URI, например, `import org.example.io`. Интересно, что мы нигде не видим URI модуля. Он задается извне с помощью файла `qmldir`, либо в файле `CMakeLists.txt` вашего проекта.

Файл `qmldir` определяет содержимое вашего QML-плагина или, лучше сказать, QML-сторону вашего плагина. Собственноручно написанный файл `qmldir` для нашего плагина должен выглядеть примерно так:

```c++
module org.example.io
plugin fileio
```

Модуль - это URI, который импортирует пользователь, а после него вы указываете, какой плагин нужно загрузить для данного URI. Строка `plugin` должна совпадать с именем файла `plugin` (под mac это будет `libfileio_debug.dylib` в файловой системе и `fileio` в `qmldir`, для `Linux`- системы такая же строка будет выглядеть как `libfileio.so`). Эти файлы создаются программой Qt Creator на основе заданной информации. 

Более простой способ создания корректного файла `qmldir` - в `CMakeLists.txt` для вашего проекта, в макросе `qt_add_qml_module`. Здесь параметр URI используется для указания URI плагина, например, org.example.io . Таким образом, файл `qmldir` генерируется при сборке проекта.

При импорте модуля с именем "org.example.io" движок QML будет искать в одном из путей импорта и попытается найти путь `"org/example/io"` с `qmldir`. Затем `qmldir` укажет движку, какую библиотеку следует загрузить в качестве подключаемого модуля расширения `QML`, используя URI модуля. Два модуля с одинаковыми URI будут
переопределять друг друга

