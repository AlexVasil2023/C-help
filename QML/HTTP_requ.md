
HTTP-запрос в Qt обычно выполняется с помощью QNetworkRequest и QNetworkReply с сайта c++, а затем ответ передается с помощью интеграции Qt/C++ в пространство QML. Поэтому мы попытаемся немного расширить границы и использовать текущие средства, которые предоставляет нам Qt Quick для взаимодействия с конечной точкой сети. Для этого мы используем объект-помощник для выполнения цикла HTTP-запрос-ответ. Он представлен в виде объекта javascript XMLHttpRequest .

Объект `XMLHttpRequest` позволяет пользователю зарегистрировать функцию-обработчик ответа и URL. Запрос может быть отправлен с использованием одного из глаголов HTTP (get, post, put, delete, ...). После получения ответа вызывается функция-обработчик. Функция-обработчик вызывается несколько раз. Каждый раз, когда состояние запроса изменилось (например, пришли заголовки или запрос выполнен).

Приведем небольшой пример:

```c++
function request() {
	var xhr = new XMLHttpRequest();
	
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED)
			print('HEADERS_RECEIVED');
		} else if(xhr.readyState === XMLHttpRequest.DONE) {
			print('DONE');
		}
	}
	
	xhr.open("GET", "http://example.com");
	xhr.send();
}
```

Для ответа можно получить XML-формат или просто необработанный текст. Можно выполнить итерацию по полученному XML, но чаще всего сейчас используется необработанный текст для ответа в формате JSON. Документ JSON будет использоваться для преобразования текста в JS-объект с помощью JSON.parse(text) .

```c++
/* ... */
	} else if(xhr.readyState === XMLHttpRequest.DONE) {
		var object = JSON.parse(xhr.responseText.toString());
	print(JSON.stringify(object, null, 2));
}
```

В обработчике ответа мы получаем необработанный текст ответа и преобразуем его в объект javascript. Теперь этот JSON-объект является корректным JS-объектом (в javascript объектом может быть как объект, так и массив).****

> Похоже, что преобразование `toString()` сначала делает код более стабильным. Без явного преобразования у меня несколько раз возникали ошибки парсера. Не знаю точно, в чем причина.

## Вызовы Flickr

Рассмотрим более реальный пример. Типичным примером является использование сервиса `Flickr` для получения публичной ленты новых загруженных фотографий. Для этого мы можем использовать URL http://api.flickr.com/services/feeds/photos_public.gne. К сожалению, по умолчанию он возвращает XML-поток, который может быть легко разобран `XmlListModel` в qml. В рамках данного примера мы хотели бы остановиться на данных в формате JSON. Чтобы получить чистый JSON-ответ, необходимо добавить к запросу некоторые параметры: http://api.flickr.com/services/feeds/photos_public.gne?format=json&nojsoncallback=1 . В результате будет возвращен ответ в формате JSON без обратного вызова JSON.

> - Обратный вызов JSON превращает ответ JSON в вызов функции. Это сокращение, используемое в HTML- программировании, когда для выполнения JSON-запроса используется тег script. Ответ вызывает локальную функцию, определенную обратным вызовом. В QML не существует механизма, работающего с обратными вызовами JSON.

Сначала рассмотрим ответ с помощью curl: "http://api.flickr.com/services/feeds/photos_public.gne?fo
Ответ будет примерно таким:
```c++
{
	"title": "Recent Uploads tagged munich",
	...
	"items": [
		{
			"title": "Candle lit dinner in Munich",
			"media": {"m":"http://farm8.staticflickr.com/7313/11444
			...
		},{
			"title": "Munich after sunset: a train full of \"must h
			"media": {"m":"http://farm8.staticflickr.com/7394/11443
			...
		}
	]
	...
}
```

Возвращаемый JSON-документ имеет определенную структуру. Объект, который имеет свойство `title` и свойство `items`. Где заголовок - это строка, а `items` - массив объектов. При преобразовании этого текста в JSON-документ можно получить доступ к отдельным записям, поскольку это корректная структура JS-объект/массив.

```C++
// JS code
obj = JSON.parse(response);
print(obj.title) // => "Recent Uploads tagged munich"

for(var i=0; i<obj.items.length; i++) {
	// iterate of the items array entries
	print(obj.items[i].title) // title of picture
	print(obj.items[i].media.m) // url of thumbnail
}
```

Будучи допустимым массивом JS, мы можем использовать массив `obj.items` и в качестве модели для представления списка. Сейчас мы попробуем это сделать. Сначала нам нужно получить ответ и преобразовать его в корректный JS-объект. А затем мы можем просто установить свойство response.items в качестве модели для представления списка.

```C++
function request() {
	const xhr = new XMLHttpRequest()
	xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED)
			print('HEADERS_RECEIVED')
		} else if(xhr.readyState === XMLHttpRequest.DONE) {
			print('DONE')
			const response = JSON.parse(xhr.responseText.toStri
			// Set JS object as model for listview
			view.model = response.items
		}
	}
xhr.open("GET", "http://api.flickr.com/services/feeds/photo
xhr.send()
}
```

Здесь приведен полный исходный код, в котором мы создаем запрос при загрузке компонента. Ответ на запрос затем используется в качестве модели для нашего простого представления списка.

```c++
import QtQuick

Rectangle {
	id: root
	width: 320
	height: 480
	
	ListView {
		id: view
		anchors.fill: parent
		
		delegate: Thumbnail {
			required property var modelData
			width: view.width
			text: modelData.title
			iconSource: modelData.media.m
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
				// Set JS object as model for listview
				view.model = response.items
			}
		}
	
		xhr.open("GET", "http://api.flickr.com/services/feeds/p
		xhr.send()
	}
	
	Component.onCompleted: {
		root.request()
	}
}	
```

Когда документ полностью загружен ( Component.onCompleted ), мы запрашиваем у `Flickr` последнее содержимое ленты. По прибытии мы разбираем ответ в формате `JSON` и устанавливаем массив `items` в качестве модели для нашего представления. У представления списка есть делегат, который отображает в строке значок миниатюры и текст заголовка.

Другой вариант - иметь заполнитель `ListModel` и добавлять каждый элемент в модель списка. Для поддержки больших моделей необходимо поддерживать пагинацию (например, страница 1 из 10) и ленивый поиск содержимого.























