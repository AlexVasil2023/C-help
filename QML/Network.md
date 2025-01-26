# Работа в сети

Qt 6 поставляется с богатым набором сетевых классов на стороне C++. Например, имеются высокоуровневые классы для работы с протокольным уровнем HTTP по схеме "запрос-ответ", такие как `QNetworkRequest` , `QNetworkReply` и `QNetworkAccessManager` . А также классы более низкого уровня на уровне протокола `TCP/IP` или `UDP`, такие как [[QTcpSocket|QTcpSocket]] , [[QTcpServer|QTcpServer]] и [[QUdpSocket|QUdpSocket]]. Существуют дополнительные классы для управления прокси-серверами, сетевым кэшем, а также сетевой конфигурацией системы.

В этой главе речь пойдет не о сетевом взаимодействии на C++, а о Qt Quick и сетевом взаимодействии. Итак, как я могу соединить свой пользовательский интерфейс QML/JS непосредственно с сетевой службой или как я могу обслуживать свой пользовательский интерфейс через сетевую службу? 

## Обслуживание пользовательского интерфейса через HTTP

Для загрузки простого пользовательского интерфейса по протоколу `HTTP` нам необходим веб-сервер, который обслуживает документы пользовательского интерфейса. Мы начнем с создания собственного простого веб-сервера с помощью однострочника на языке `python`. Но сначала нам нужно создать демонстрационный пользовательский интерфейс. Для этого мы создадим небольшой файл `RemoteComponent.qml` в папке проекта и создадим внутри него красный прямоугольник.

```c++
// RemoteComponent.qml
import QtQuick

Rectangle {
	width: 320
	height: 320
	color: '#ff0000'
}
```

Для обслуживания этого файла мы можем запустить небольшой python-скрипт:

```python
cd <PROJECT>
python -m http.server 8080
```

Теперь наш файл должен быть доступен через http://localhost:8080/RemoteComponent.qml . Вы можете протестировать его с помощью:

```sh
curl http://localhost:8080/RemoteComponent.qml
```

Или просто укажите браузеру на это место. К сожалению, ваш браузер не понимает QML и не сможет отобразить документ. К счастью, такой QML-браузер существует. Он называется `Canonic` (https://www.canonic.com) . Canonic сам построен на QML и запускается в браузере через WebAssembly. Однако если вы используете `WebAssembly`-версию `Canonic`, вы не сможете просматривать файлы, обслуживаемые с `localhost`; немного позже вы увидите, как сделать ваши QML-файлы доступными для использования с `WebAssembly`-версией `Canonic`. При желании можно загрузить код для запуска `Canonic` в качестве приложения на рабочем столе, однако это связано с проблемами безопасности (подробнее см. здесь (https://docs.page/canonic/canonic) и здесь (https://doc.qt.io/qt-6/qtqml-documents-networktransparency.html#implications-for-application-security)).

Кроме того, Qt 6 предоставляет двоичный файл qml, который можно использовать как веб-браузер. Вы можете напрямую загрузить удаленный QML-документ с помощью следующей команды:

```sh
qml http://localhost:8080/RemoteComponent.qm
```

Другим способом импорта удаленного QML-документа является его динамическая загрузка с помощью QML! Для этого мы используем элемент `Loader` для получения удаленного документа.

```c++
// LocalHostExample.qml
import QtQuick

Loader {
	id: root
	source: 'http://localhost:8080/RemoteComponent.qml'
	
	onLoaded: {
		root.width = root.item.width // qmllint disable
		root.height = root.item.height // qmllint disable
	}
}
```

Теперь мы можем попросить исполняемый файл qml загрузить локальный Документ-загрузчик `LocalHostExample.qml`.

```sh
qml LocalHostExample.qml
```

> Если вы не хотите запускать локальный сервер, вы также можете воспользоваться сервисом `gist` с `GitHub`. `gist` представляет собой буфер обмена, подобный таким онлайн-сервисам, как `Pastebin` и другие. Он доступен по адресу https://gist.github.com (https://gist.github.com) . Для данного примера я создал небольшой `gist` по URL https://gist.github.com/jryannel/7983492 (https://gist.github.com/jryannel/7983492) . В результате появится зеленый прямоугольник. Поскольку URL gist будет предоставлять сайт в виде HTML-кода, к URL нужно прикрепить /raw, чтобы получить исходный файл, а не HTML- код.
> 
> Поскольку это содержимое размещено на веб-сервере с публичным веб-адресом, для его просмотра теперь можно использовать веб-версию `Canonic`. Для этого достаточно указать в браузере адрес https://app.canonic.com/#http://gist.github.com/jryannel/7983492(https://app.canonic.com/#http://gist.github.com/jryannel/7983492) . Разумеется, для просмотра собственных файлов необходимо изменить часть после `#`.

```c++
// GistExample.qml
import QtQuick

Loader {
	id: root
	source: 'https://gist.github.com/jryannel/7983492/raw'
	
	onLoaded: {
		root.width = root.item.width // qmllint disable
		root.height = root.item.height // qmllint disable
	}
}
```

Для загрузки другого файла по сети из `RemoteComponent.qml` необходимо создать специальный файл `qmldir` в том же каталоге на сервере. После этого вы сможете ссылаться на компонент по его имени.

## Сетевые компоненты

Давайте проведем небольшой эксперимент. Добавим на сторону пульта небольшую кнопку в качестве компонента многократного использования.

Вот структура каталогов, которую мы будем использовать:

```
./src/SimpleExample.qml
./src/remote/qmldir
./src/remote/Button.qml
./src/remote/RemoteComponent.qml
```

Наш файл `SimpleExample.qml` аналогичен предыдущему файлу `main.qml` пример:

```c++
import QtQuick

Loader {
	id: root
	anchors.fill: parent
	source: 'http://localhost:8080/RemoteComponent.qml'
	
	onLoaded: {
		root.width = root.item.width // qmllint disable
		root.height = root.item.height // qmllint disable
	}
}
```

В удаленном каталоге мы обновим файл `RemoteComponent.qml`, чтобы он использовал пользовательский компонент `Button`:

```c++
// remote/RemoteComponent.qml
import QtQuick

Rectangle {
	width: 320
	height: 320
	color: '#ff0000'
	
	Button {
		anchors.centerIn: parent
		text: qsTr('Click Me')
		onClicked: Qt.quit()
	}
}
```

Поскольку наши компоненты размещаются удаленно, движку QML необходимо знать, какие еще компоненты доступны удаленно. Для этого мы определяем содержимое нашего удаленного каталога в файле `qmldir`:

```
# qmldir
Button 1.0 Button.qml
```

И, наконец, создадим наш фиктивный файл `Button.qml`

```c++
// remote/Button.qml
import QtQuick.Controls

Button {
}
```

Теперь мы можем запустить наш веб-сервер (не забывайте, что теперь у нас есть удаленный подкаталог):

```
cd src/serve-qml-networked-components/
python -m http.server --directory ./remote 8080
```

И удаленный загрузчик QML:

```
qml SimpleExample.qml
```

## Импорт каталога компонентов QML

Определив файл qmldir, можно также напрямую импортировать библиотеку компонентов из удаленного хранилища. Для этого работает классический импорт:

```c++
import QtQuick
import "http://localhost:8080" as Remote

Rectangle {
	width: 320
	height: 320
	color: 'blue'
	
	Remote.Button {
		anchors.centerIn: parent
		text: qsTr('Quit')
		onClicked: Qt.quit()
	}
}
```

> При использовании компонентов из локальной файловой системы они создаются немедленно, без задержки. При загрузке компонентов по сети они создаются асинхронно. Это приводит к тому, что время создания компонента неизвестно, и он может быть еще не полностью загружен, когда другие уже завершены. Учитывайте это при работе с компонентами, загруженными по сети.
>
> Будьте очень осторожны при загрузке компонентов QML из Интернета. При этом возникает риск случайной загрузки вредоносных компонентов, которые могут нанести вред вашему компьютеру.
> 
> Эти риски безопасности были задокументированы (https://doc.qt.io/qt-6/qtqml-documents-networktransparency.html#implications-for-application-security) компанией Qt. 

















