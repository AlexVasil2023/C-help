# REST API

Чтобы использовать веб-сервис, его нужно сначала создать. Для создания простого цветового веб-сервиса мы будем использовать `Flask` (https://flask.palletsprojects.com (https://flask.palletsprojects.com)) - простой `HTTP-сервер` приложений на основе python. Можно также использовать любой другой веб-сервер, принимающий и возвращающий данные в формате `JSON`. Идея заключается в том, чтобы иметь список именованных цветов, которыми можно управлять с помощью веб-сервиса. Под управлением в данном случае понимается `CRUD` (создание-чтение-обновление-удаление).

Простой веб-сервис на `Flask` может быть написан в одном файле. Мы начинаем с пустого файла `server.py`. Внутри этого файла мы создадим некоторый кодовый код и загрузим наши начальные цвета из внешнего `JSON-файла`. См. также документацию `Flask quickstart` (https://flask.palletsprojects.com/en/2.0.x/quickstart/).

```python
from flask import Flask, jsonify, request
import json

with open('colors.json', 'r') as file:
colors = json.load(file)

app = Flask(__name__)
```

```python
# Регистрация и внедрение услуг...

if __name__ == '__main__':
app.run(debug = True)
```

При запуске этого скрипта будет предоставлен web-сервер по адресу http://localhost:5000 (http://localhost:5000) , который пока не обслуживает ничего полезного.
Теперь мы начнем добавлять конечные точки CRUD (Create, Read,
Update, Delete) в наш маленький веб-сервис.

## Запрос на чтение

Для чтения данных с нашего веб-сервера мы предоставим метод `GET` для всех цветов.

```python
@app.route('/colors', methods = ['GET'])
def get_colors():
return jsonify({ "data" : colors })
```

В результате будут возвращены цвета по конечной точке '/colors'. Чтобы проверить это, мы можем использовать `curl` для создания HTTP-запроса.

```
curl -i -GET http://localhost:5000/colors
```

Что вернет нам список цветов в виде JSON-данных.

## Чтение и запись

Для чтения отдельного цвета по имени мы предоставляем конечную точку `details`, которая находится по адресу `/colors/<name>` . Имя - это параметр конечной точки, который идентифицирует отдельный цвет.

```python
@app.route('/colors/<name>', methods = ['GET'])
def get_color(name):
	for color in colors:
		if color["name"] == name:
			return jsonify(color)
	return jsonify({ 'error' : True })
```

И мы можем проверить это, снова используя curl. Например, чтобы получить запись красного цвета.

```
curl -i -GET http://localhost:5000/colors/red
```

Он вернет одну запись о цвете в виде данных в формате JSON.

## Создание записи

До сих пор мы использовали только метод `HTTP GET`. Для создания записи на стороне сервера мы будем использовать метод `POST` и передадим информацию о новом цвете вместе с данными `POST`. Местонахождение конечной точки такое же, как и для получения всех цветов. Но на этот раз мы ожидаем POST-запрос.

```python
@app.route('/colors', methods= ['POST'])
def create_color():
	print('create color')
	color = {
		'name': request.json['name'],
		'value': request.json['value']
	}
colors.append(color)
return jsonify(color), 201
```

`Curl` достаточно гибок, чтобы позволить нам предоставлять JSON-данные в качестве новой записи внутри POST-запроса.

```
curl -i -H "Content-Type: application/json" -X POST -d '{"name"
```

## Обновление записи

Для обновления отдельной записи мы используем HTTP-метод PUT. Конечная точка такая же, как и для получения отдельной записи о цвете. При успешном обновлении цвета мы возвращаем обновленный цвет в виде JSON-данных.

```c++
@app.route('/colors/<name>', methods= ['PUT'])
def update_color(name):
	for color in colors:
		if color["name"] == name:
			color['value'] = request.json.get('value', color['v
			return jsonify(color)
	return jsonify({ 'error' : True })
```

В запросе `curl` мы указываем только обновляемые значения в виде JSON-данных, а затем именованную конечную точку для идентификации обновляемого цвета.

```
curl -i -H "Content-Type: application/json" -X PUT -d '{"value"
```

## Удаление записи

Для удаления записи используется HTTP-глагол `DELETE`. Для отдельного цвета используется та же конечная точка, но на этот раз HTTP-глагол `DELETE`.

```python
@app.route('/colors/<name>', methods=['DELETE'])
def delete_color(name):
	for color in colors:
		if color["name"] == name:
			colors.remove(color)
			return jsonify(color)
	return jsonify({ 'error' : True })
```

Этот запрос выглядит аналогично GET-запросу для отдельного цвета.

```
curl -i -X DELETE http://localhost:5000/colors/red
```

## Глаголы HTTP

Теперь мы можем читать все цвета, читать определенный цвет, создавать новый цвет, обновлять цвет и удалять цвет. Кроме того, мы знаем конечные точки HTTP для нашего API.

```
# Read All
GET http://localhost:5000/colors
# Create Entry
POST http://localhost:5000/colors
# Read Entry
GET http://localhost:5000/colors/${name}
# Update Entry
PUT http://localhost:5000/colors/${name}
# Delete Entry
DELETE http://localhost:5000/colors/${name}
```

Теперь наш маленький REST-сервер готов, и мы можем сосредоточиться на QML и клиентской части. Чтобы создать простой в использовании API, нам нужно сопоставить каждое действие с отдельным HTTP-запросом и предоставить простой API нашим пользователям.

## Клиентский REST

Для демонстрации REST-клиента мы написали небольшую цветовую сетку. Цветовая сетка отображает цвета, полученные от веб-сервиса через HTTP-запросы. Наш Пользовательский интерфейс предоставляет следующие команды:

> - Get a color list
> - Create color
> - Read the last color
> - Update last color
> - Delete the last color

Мы упаковываем наш API в собственный JS-файл colorservice.js и импортируем его в наш пользовательский интерфейс как Service . Внутри модуля сервиса ( colorservice.js ), мы создаем вспомогательную функцию, которая будет выполнять за нас HTTP-запросы:

```js
function request(verb, endpoint, obj, cb) {
	print('request: ' + verb + ' ' + BASE + (endpoint ? '/' + e
	var xhr = new XMLHttpRequest()
	xhr.onreadystatechange = function() {

		print('xhr: on ready state change: ' + xhr.readyState)
		if(xhr.readyState === XMLHttpRequest.DONE) {
			if(cb) {
				var res = JSON.parse(xhr.responseText.toString(
				cb(res)
			}
		}
	}
	
	xhr.open(verb, BASE + (endpoint ? '/' + endpoint : ''))
	xhr.setRequestHeader('Content-Type', 'application/json')
	xhr.setRequestHeader('Accept', 'application/json')
	var data = obj ? JSON.stringify(obj) : ''
	xhr.send(data)
}
```

Он принимает четыре аргумента. Параметр `verb`, который определяет используемый HTTP-глагол (`GET`, `POST`, `PUT`, `DELETE`). Второй параметр - конечная точка, которая будет использоваться в качестве постфикса к адресу BASE (например, 'http://localhost:5000/colors (http://localhost:5000/colors) '). Третий параметр - необязательный `obj`, который будет отправлен сервису в виде JSON-данных. Последний параметр определяет обратный вызов, который будет вызван при возврате ответа. Обратный вызов получает объект response с данными ответа. Перед отправкой запроса мы указываем, что отправляем и принимаем JSON-данные, изменяя заголовок запроса. С помощью этой вспомогательной функции запроса мы можем реализовать простые команды, определенные нами ранее (create, read, update, delete). Этот код находится в реализации сервиса: 

```js
function getColors(cb) {
	// GET http://localhost:5000/colors
	request('GET', null, null, cb)
}

function createColor(entry, cb) {
	// POST http://localhost:5000/colors
	request('POST', null, entry, cb)
}

function getColor(name, cb) {
	// GET http://localhost:5000/colors/${name}
	request('GET', name, null, cb)
}

function updateColor(name, entry, cb) {
	// PUT http://localhost:5000/colors/${name}
	request('PUT', name, entry, cb)
}

function deleteColor(name, cb) {
	// DELETE http://localhost:5000/colors/${name}
	request('DELETE', name, null, cb)
}
```

В пользовательском интерфейсе мы используем сервис для реализации наших команд. В качестве поставщика данных для `GridView` у нас есть `ListModel` с идентификатором `gridModel`. Команды отображаются с помощью UI-элемента `Button`. Импорт нашей библиотеки сервисов довольно прост:

```c++
import "colorservice.js" as Service
```

Чтение списка цветов с сервера:

```c++
Button {
	text: 'Read Colors'
	onClicked: {
		Service.getColors(function(response) {
			print('handle get colors response: ' + JSON.stringi
			gridModel.clear()
			const entries = response.data
			
			for(let i=0; i<entries.length; i++) {
				gridModel.append(entries[i])
			}
		})
	}
}
```

Создайте на сервере новую запись о цвете:

```c++
Button {
	text: 'Create New'
	
	onClicked: {
		const index = gridModel.count - 1
		const entry = {
			name: 'color-' + index,
			value: Qt.hsla(Math.random(), 0.5, 0.5, 1.0).toStri
		}
		Service.createColor(entry, function(response) {
			print('handle create color response: ' + JSON.strin
			gridModel.append(response)
		})
	}
}
```

Чтение цвета по его названию:

```c++
Button {
	text: 'Read Last Color'
	onClicked: {
		const index = gridModel.count - 1
		const name = gridModel.get(index).name

		Service.getColor(name, function(response) {
			print('handle get color response:' + JSON.stringify
			message.text = response.value
		})
	}
}
```

Обновление записи о цвете на сервере на основе имени цвета:

```c++
Button {
	text: 'Update Last Color'
	
	onClicked: {
		const index = gridModel.count - 1
		const name = gridModel.get(index).name
		
		const entry = {
			value: Qt.hsla(Math.random(), 0.5, 0.5, 1.0).toStri
		}
		
		Service.updateColor(name, entry, function(response) {
			print('handle update color response: ' + JSON.strin
			gridModel.setProperty(gridModel.count - 1, 'value',
		})
	}
}
```

Удаление цвета по имени цвета:

```c++
Button {
	text: 'Delete Last Color'
	
	onClicked: {
		const index = gridModel.count - 1
		const name = gridModel.get(index).name
		Service.deleteColor(name)
		gridModel.remove(index, 1)
	}
}
```

На этом CRUD-операции (создание, чтение, обновление, удаление) с использованием REST API завершены. Существуют и другие возможности создания Web-Service API. Например, на основе модулей, и каждый модуль будет иметь одну конечную точку. При этом API может быть определен с помощью JSON RPC (http://www.jsonrpc.org/ (http://www.jsonrpc.org/) ). Конечно, можно использовать и API на основе XML, но подход на основе JSON имеет большие преимущества, поскольку парсинг встроен в QML/JS как часть JavaScript.



































