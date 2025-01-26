# Локальные файлы

Возможно ли также загружать локальные (XML/JSON) файлы с помощью `XMLHttpRequest`. Например, локальный файл с именем `"colors.json"` может быть загружен с помощью:

```js
xhr.open("GET", "colors.json")
```

Мы используем его для чтения таблицы цветов и отображения ее в виде сетки. Модификация файла со стороны Qt Quick невозможна. Для сохранения данных обратно в источник нам потребуется небольшой HTTP-сервер на основе `REST` или собственное расширение Qt Quick для доступа к файлам.

```c++
import QtQuick

Rectangle {
	width: 360
	height: 360
	color: '#000'
	
	GridView {
		id: view
		anchors.fill: parent
		cellWidth: width / 4
		cellHeight: cellWidth
		
		delegate: Rectangle {
			required property var modelData
			width: view.cellWidth
			height: view.cellHeight
			color: modelData.value
		}
	}
	
	function request() {
		const xhr = new XMLHttpRequest()
		
		xhr.onreadystatechange = function() {
			if (xhr.readyState === XMLHttpRequest.HEADERS_RECEI
				print('HEADERS_RECEIVED')
			} else if(xhr.readyState === XMLHttpRequest.DONE) {
				print('DONE')
				const response = JSON.parse(xhr.responseText.to
				view.model = response.colors
			}
		}
		
		xhr.open("GET", "colors.json")
		xhr.send()
	}
	
	Component.onCompleted: {
		request()
	}
}
```
>
> По умолчанию использование `GET` для локального файла запрещено движком QML. Чтобы преодолеть это ограничение, можно установить переменную окружения `QML_XHR_ALLOW_FILE_READ` в значение 1 :
>
```sh
QML_XHR_ALLOW_FILE_READ=1 qml localfiles.qml
```
>
>Проблема заключается в том, что если разрешить QML- приложению читать локальные файлы через `XMLHttpRequest`, т.е. `XHR` , то это открывает всю файловую систему для чтения, что является потенциальной проблемой безопасности. Qt позволяет читать локальные файлы только в том случае, если установлена переменная окружения, так что это решение является осознанным.
>
  Вместо `XMLHttpRequest` для доступа к локальным файлам можно также использовать `XmlListModel`.

```c++
import QtQuick
import QtQml.XmlListModel

Rectangle {
	width: 360
	height: 360
	color: '#000'
	
	GridView {
		id: view
		anchors.fill: parent
		cellWidth: width / 4
		cellHeight: cellWidth
		model: xmlModel
		
		delegate: Rectangle {
			id: delegate
			required property var model
			width: view.cellWidth
			height: view.cellHeight
			color: model.value
			
			Text {
				anchors.centerIn: parent
				text: delegate.model.name
			}
		}
	}
	
	XmlListModel {
		id: xmlModel
		source: "colors.xml"
		query: "/colors/color"
		XmlListModelRole { name: 'name'; elementName: 'name' }
		XmlListModelRole { name: 'value'; elementName: 'value'
	}
}
```

С помощью `XmlListModel` можно читать только XML-файлы, но не JSON-файлы.































