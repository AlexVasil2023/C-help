# Веб-сокеты

Модуль `WebSockets` предоставляет реализацию протокола `WebSockets` протокол для клиентов и серверов `WebSockets`. Он является зеркальным отражением модуля Qt CPP. Он позволяет отправлять строковые и двоичные сообщения по полнодуплексному каналу связи. Обычно WebSocket устанавливается путем создания HTTP-соединения с сервером, после чего сервер "модернизирует" это соединение до `WebSocket`-соединения.

В Qt/QML можно также просто использовать объекты `WebSocket` и `WebSocketServer` для создания прямого WebSocket-соединения. Протокол `WebSocket` использует схему URL "ws" или "wss" для безопасного соединения.

Вы можете использовать модуль web socket qml, предварительно импортировав его.

```c++
import QtWebSockets

WebSocket {
	id: socket
}
```

## WS Server

Вы можете легко создать свой собственный WS-сервер, используя C++ часть Qt WebSocket, или использовать другую реализацию WS, что мне кажется очень интересным. Она интересна тем, что позволяет соединить удивительное качество рендеринга QML с большим расширением серверов веб-приложений. В данном примере мы будем использовать сервер веб-сокетов на базе Node JS с помощью модуля ws (https://npmjs.org/package/ws). Для этого сначала необходимо установить node js (http://nodejs.org/) . Затем создайте папку `ws_server` и установите пакет `ws` с помощью менеджера пакетов `node (npm)`.

Код должен создать простой эхо-сервер в `NodeJS`, который будет передавать наши сообщения обратно QML-клиенту.

![[QML Anima_5.png]]

```
cd ws_server
npm install ws
```

Инструмент npm загружает и устанавливает пакет ws и зависимости в локальную папку.

Файл `server.js` будет представлять собой реализацию нашего сервера. Код сервера создаст сервер веб-сокетов на порту 3000 и будет слушать входящее соединение. При входящем соединении он будет посылать приветствие и ожидает сообщений от клиента. Каждое сообщение, отправленное клиентом по сокету, будет отправлено обратно клиенту.

```c++
const WebSocketServer = require('ws').Server
const server = new WebSocketServer({ port : 3000 })

server.on('connection', function(socket) {
	console.log('client connected')
	
	socket.on('message', function(msg) {
			console.log('Message: %s', msg)
		socket.send(msg.toString())
	});
	s
	ocket.send('Welcome to Awesome Chat')
});

console.log('listening on port ' + server.options.port)
```

Необходимо привыкнуть к нотации `JavaScript` и обратным вызовам функций.

## Клиент WS

На стороне клиента нам необходимо представление списка для отображения сообщений и TextInput для ввода пользователем нового сообщения в чате.

В примере мы будем использовать метку белого цвета.

```c++
// Label.qml
import QtQuick

Text {
	color: '#fff'
	horizontalAlignment: Text.AlignLeft
	verticalAlignment: Text.AlignVCenter
}
```

Наше представление чата представляет собой представление списка, в котором текст добавляется к модели списка. Каждая запись отображается с помощью строки с префиксом и меткой сообщения. Мы используем коэффициент ширины ячейки `cw` для разбиения на 24 столбца.

```c++
// ChatView.qml
import QtQuick

ListView {
	id: root
	width: 100
	height: 62
	model: ListModel {}
	function append(prefix, message) {
		model.append({prefix: prefix, message: message})
	}
	
	delegate: Row {
		id: delegate
		required property var model
		property real cw: width / 24
		width: root.width
		height: 18
		
		Label {
			width: delegate.cw * 1
			height: parent.height
			text: delegate.model.prefix
		}
	
		Label {
			width: delegate.cw * 23
			height: parent.height
			text: delegate.model.message
		}
	}
}
```

Ввод чата представляет собой обычный текстовый ввод, обведенный цветной рамкой.

```c++
// ChatInput.qml
import QtQuick

FocusScope {
	id: root
	property alias text: input.text
	signal accepted(string text)
	width: 240
	height: 32
	
	Rectangle {
		anchors.fill: parent
		color: '#000'
		border.color: '#fff'
		border.width: 2
	}
	
	TextInput {
		id: input
		anchors.left: parent.left
		anchors.right: parent.right
		anchors.verticalCenter: parent.verticalCenter
		anchors.leftMargin: 4
		anchors.rightMargin: 4
		color: '#fff'
		focus: true
		
		onAccepted: function () {
			root.accepted(text)
		}
	}
}
```

Когда веб-сокет получает сообщение, он добавляет его в представление чата. То же самое относится и к изменению статуса. Также, когда пользователь вводит сообщение в чат, его копия добавляется в представление чата на стороне клиента, а само сообщение отправляется на сервер.

```c++
// ws_client.qml
import QtQuick
import QtWebSockets

Rectangle {
	width: 360
	height: 360
	color: '#000'
	
	ChatView {
		id: box
		anchors.left: parent.left
		anchors.right: parent.right
		anchors.top: parent.top
		anchors.bottom: input.top
	}
	
	ChatInput {
		id: input
		anchors.left: parent.left
		anchors.right: parent.right
		anchors.bottom: parent.bottom
		focus: true
		
		onAccepted: function(text) {
			print('send message: ' + text)
			socket.sendTextMessage(text)
			box.append('>', text)
			text = ''
		}
	}
	
	WebSocket {
		id: socket
		url: "ws://localhost:3000"
		active: true
		
		onTextMessageReceived: function (message) {
			box.append('<', message)
		}

		onStatusChanged: {
			if (socket.status == WebSocket.Error) {
				box.append('#', 'socket error ' + socket.errorS
			} else if (socket.status == WebSocket.Open) {
				box.append('#', 'socket open')
			} else if (socket.status == WebSocket.Closed) {
				box.append('#', 'socket closed')
			}
		}
	}
}
```

Сначала необходимо запустить сервер, а затем клиент. В нашем простом клиенте нет механизма повторного соединения.

Запуск сервера

```sh
cd ws_server
node server.js
```

Запуск клиента

```sh
cd ws_client
qml ws_client.qml
```

При вводе текста и нажатии клавиши Enter вы должны увидеть примерно следующее.

![[QML Anima_6.png]]

















