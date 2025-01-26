# Реализация FileIO

Помните, что `FileIO API`, который мы хотим создать, должен выглядеть следующим образом.

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

Свойства мы опустим, так как они представляют собой простые сеттеры и геттеры. Метод `read` открывает файл в режиме чтения и считывает данные с помощью текстового потока.

```c++
void FileIO::read()
{
	if(m_source.isEmpty()) {
		return;
	}

	QFile file(m_source.toLocalFile());
	
	if(!file.exists()) {
		qWarning() << "Does not exist: " << m_source.toLocalFil
		return;
	}
	
	if(file.open(QIODevice::ReadOnly)) {
		QTextStream stream(&file);
		m_text = stream.readAll();
		
		emit textChanged(m_text);
	}
}
```

При изменении текста необходимо сообщить об этом другим пользователям с помощью команды `emit textChanged(m_text)` . В противном случае привязка свойств не будет работать.

Метод `write` делает то же самое, но открывает файл в режиме записи и использует поток для записи содержимого свойства `text`.

```c++
void FileIO::read()
{
	if(m_source.isEmpty()) {
		return;
	}
	
	QFile file(m_source.toLocalFile());

	if(!file.exists()) {
		qWarning() << "Does not exist: " << m_source.toLocalFil
		return;
	}
	
	if(file.open(QIODevice::ReadOnly)) {
		QTextStream stream(&file);
		m_text = stream.readAll();
		emit textChanged(m_text);
	}
}
```

Чтобы сделать тип видимым для QML, мы добавляем макрос `QML_ELEMENT` сразу после строк `Q_PROPERTY` . Это сообщает Qt, что тип должен быть доступен для QML. Если необходимо задать имя, отличное от имени класса C++, можно использовать макрос
`QML_NAMED_ELEMENT`.

Не забудьте в конце вызвать `make install`. В противном случае файлы вашего плагина не будут скопированы в папку qml, и движок qml не сможет найти модуль.

> Поскольку чтение и запись являются блокирующими вызовами функций, использовать этот `FileIO` следует только для небольших текстов, иначе вы заблокируете UI-поток Qt. Будьте внимательны!

# Использование FileIO

Теперь мы можем использовать наш созданный файл для доступа к некоторым данным. В этом примере мы получим некоторые данные о городе в формате `JSON` и отобразим их в таблице. Мы создаем два проекта: один для плагина расширения (называется `fileio`), который предоставляет нам возможность чтения и записи текста из файла, и второй, который отображает данные в таблице, (`CityUI`). `CityUI` использует расширение `fileio` для чтения и записи файлов.

![[QML FileIO.png]]

Данные `JSON` - это просто текст, отформатированный таким образом, что его можно преобразовать в корректный JS-объект/массив и обратно в текст. Мы используем наш `FileIO` для чтения данных в формате `JSON` и преобразования их в JS-объект с помощью встроенной в `Javascript` функции `JSON.parse()`. В дальнейшем эти данные используются в качестве модели для табличного представления. Это реализовано в функциях `read document` и `write document`, показанных ниже.

```c++
FileIO {
	id: io
}

function readDocument() {
	io.source = openDialog.fileUrl
	io.read()
	view.model = JSON.parse(io.text)
}

function saveDocument() {
	var data = view.model
	io.text = JSON.stringify(data, null, 4)
	io.write()
}
```

Данные `JSON`, используемые в этом примере, находятся в файле `cities.json`. Он содержит список записей данных о городах, где каждая запись содержит интересные данные о городе, как показано ниже.

```c++
[
	{
		"area": "1928",
		"city": "Shanghai",
		"country": "China",
		"flag": "22px-Flag_of_the_People's_Republic_of_China.sv
		"population": "13831900"
	},
	...
]
```

# Окно приложения

Мы используем мастер Qt Creator QtQuick Application для создания приложения на основе Qt Quick Controls 2. Мы не будем использовать новые формы QML, поскольку это трудно объяснить в книге, хотя новый подход к формам с файлом `ui.qml` гораздо удобнее предыдущего. Поэтому пока можно удалить файл форм. В базовой комплектации это окно `ApplicationWindow`, которое может содержать панель инструментов, меню и строку состояния. Менюбар мы будем использовать только для создания некоторых стандартных пунктов меню для открытия и сохранения документа. В базовой конфигурации будет просто отображаться пустое окно.

```c++
import QtQuick 2.5
import QtQuick.Controls 1.3
import QtQuick.Window 2.2
import QtQuick.Dialogs 1.2

ApplicationWindow {
	id: root
	title: qsTr("City UI")
	width: 640
	height: 480
	visible: true
}
```
































