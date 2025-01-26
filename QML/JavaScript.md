# JavaScript

**JavaScript** - это лингва-франка для разработки веб-клиентов. Он также начинает набирать обороты в разработке веб-серверов, в основном на базе **node js**. Поэтому он является подходящим дополнением к декларативному языку QML в качестве императивного языка. Сам QML как декларативный язык используется для выражения иерархии пользовательского интерфейса, но ограничен для выражения
операционного кода. Иногда требуется способ выражения операций, и здесь на помощь приходит **JavaScript**.

> В сообществе Qt существует открытый вопрос о правильном сочетании QML/JS/Qt C++ в современном Qt-приложении. По общему мнению, рекомендуется ограничить JS-часть приложения до минимума и выполнять бизнес-логику в Qt C++, а логику пользовательского интерфейса - в QML/JS.

Небольшой пример того, как выглядит JS, используемый в QML:

```c++
Button {
	width: 200
	height: 300
	property bool checked: false
	text: "Click to toggle"
	
	// JS function
	function doToggle() {
		checked = !checked
	}
	
	onClicked: {
		// this is also JavaScript
		doToggle();
		console.log('checked: ' + checked)
	}
}
```

Таким образом, **JavaScript** может присутствовать в QML во многих местах: как отдельная JS-функция, как JS-модуль и как правая сторона привязки свойства.

```c++
import "util.js" as Util // import a pure JS module

Button {
	width: 200
	height: width*2 // JS on the right side of property binding
	
	// standalone function (not really useful)
	function log(msg) {
		console.log("Button> " + msg);
	}
	
	onClicked: {
		// this is JavaScript
		log();
		Qt.quit();
	}
}
```

В QML вы декларируете пользовательский интерфейс, а с помощью **JavaScript** делаете его функциональным. Так сколько же **JavaScript** следует писать? Это зависит от вашего стиля и насколько хорошо вы знакомы с разработкой на **JS**. **JS** - слабо типизированный язык, что затрудняет выявление дефектов типов. Кроме того, функции ожидают всех вариаций аргументов, что может быть очень неприятной ошибкой. Способом обнаружения дефектов является строгое модульное тестирование или приемочное тестирование. Поэтому, если вы разрабатываете реальную логику (а не несколько строк кода) на **JS**, вам следует начать использовать подход "тест-первый". Вообще, смешанные команды (Qt/C++ и QML/JS) очень успешны, когда они минимизируют количество **JS** во фронтенде в качестве доменной логики и делают всю тяжелую работу на Qt C++ в бэкенде. Бэкенд должен пройти строгое модульное тестирование, чтобы разработчики фронтенда могли доверять коду и сосредоточиться на всех этих мелких требованиях к пользовательскому интерфейсу.

> В целом: backend-разработчики ориентированы на функциональность, а frontend-разработчики - на историю пользователя.

## Браузер/HTML против Qt Quick/QML

Браузер - это среда выполнения, в которой происходит рендеринг HTML и выполнение Javascript, связанного с HTML. В настоящее время современные веб-приложения содержат гораздо больше JavaScript, чем HTML. Javascript внутри браузера представляет собой стандартную среду ECMAScript с некоторыми дополнительными API браузера. Типичная среда JS в браузере имеет глобальный объект window , который используется для взаимодействия с окном браузера
(заголовок, расположение URL, дерево DOM и т.д.) Браузеры предоставляют функции для доступа к узлам DOM по их id, классу и т.д. (которые были использованы jQuery для предоставления селекторов CSS), а в последнее время и к селекторам CSS ( querySelector, querySelectorAll). Кроме того, существует возможность вызова функции через определенное время ( setTimeout ) и многократного вызова ( setInterval ). Кроме этих (и других браузерных API), среда аналогична QML/JS.

Еще одно различие заключается в том, как JS может проявляться в HTML и QML. В HTML JS можно выполнять только при начальной загрузке страницы или в обработчиках событий (например, загрузка страницы, нажатие кнопки мыши). Например, ваш JS инициализируется обычно при загрузке страницы, что сравнимо с `Component.onCompleted` в QML. По умолчанию в браузере нельзя использовать JS для привязки свойств (AngularJS расширяет дерево DOM, позволяя использовать их, но это далеко от стандартного HTML).

В QML язык JS является в большей степени гражданином первого класса и гораздо глубже интегрирован в дерево рендеринга QML. Это делает синтаксис гораздо более читаемым. Помимо этих различий, люди, разрабатывавшие HTML/JS-приложения, должны чувствовать себя в QML/JS как дома.

## Язык JS

В этой главе не будет дано общее представление о **JavaScript**. Для общего ознакомления с **JavaScript** существуют и другие книги, пожалуйста, посетите этот замечательный раздел на сайте Mozilla Developer Network (https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript) .

На первый взгляд **JavaScript** - очень обычный язык и мало чем отличается от других языков:

```js
function countDown() {
	for(var i=0; i<10; i++) {
		console.log('index: ' + i)
	}
}

function countDown2() {
	var i=10;
	while( i>0 ) {
		i--;
	}
}
```

Но учтите, что в JS есть область видимости функций, а не блоков, как в C++ (см. раздел Функции и область видимости функций (https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Functions_and_function_scope)).

Операторы `if ... else, break, continue` также работают как положено. В случае `switch` можно сравнивать и другие типы, а не только целочисленные значения:

```js
function getAge(name) {
	// switch over a string
	switch(name) {
		case "father":
			return 58;
		
		case "mother":
			return 56;
	}

	return unknown;
}
```

**JS** знает несколько значений, которые могут быть ложными, например, `false`, `0`, `""`, `undefined`, `null`). Например, функция по умолчанию возвращает значение `undefined`. Для проверки на `false` используется оператор тождества `===` . Оператор равенства `==` выполняет преобразование типов для проверки равенства. По возможности используйте более быстрый и качественный оператор `=== strict equality`, который проверяет тождество (см. Операторы сравнения (https://developer.mozilla.org/en-).US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators) ).

Под капотом у **javascript** есть свои собственные способы выполнения задач. Например, массивы:

```js
function doIt() {
	var a = [] // empty arrays
	a.push(10) // addend number on arrays
	a.push("Monkey") // append string on arrays
	console.log(a.length) // prints 2
	a[0] // returns 10
	a[1] // returns Monkey
	a[2] // returns undefined
	a[99] = "String" // a valid assignment
	console.log(a.length) // prints 100
	a[98] // contains the value undefined
}
```

Кроме того, для людей, пришедших из C++ или Java, которые привыкли к ОО-языкам, JS просто работает по-другому. JS не является в чистом виде ОО-языком, это так называемый язык, основанный на прототипах.

Каждый объект имеет объект-прототип. Объект создается на основе своего объекта-прототипа. Подробнее об этом можно прочитать в книге Javascript the Good Parts
Дугласа Крокфорда (http://javascript.crockford.com).

Для тестирования небольших JS-фрагментов можно воспользоваться онлайн-консолью JS Console (http://jsconsole.com) или просто собрать небольшой кусочек QML-кода:

```c++
import QtQuick 2.5

Item {
	function runJS() {
		console.log("Your JS code goes here");
	}
	
	Component.onCompleted: {
		runJS();
	}
}
```

## JS-объекты

При работе с JS есть некоторые объекты и методы, которые используются чаще всего. Здесь собрана небольшая их коллекция.

> - `Math.floor(v)`, `Math.ceil(v)`, `Math.round(v)` - наибольшее, наименьшее, округленное целое число из `float`
> 
> - `Math.random()` - создание случайного числа в диапазоне от 0 до 1 
> 
> - `Object.keys(o)` - получение ключей из объекта (включая `QObject`)
> 
> - `JSON.parse(s)`, `JSON.stringify(o)` - преобразование между JS-объектом и JSON-строкой
> 
> - `Number.toFixed(p)` - плавающая цифра фиксированной точности 
> 
> - `Date - манипуляция с датой

#Примеры_использования_js_в_QML
Их также можно найти на сайте: Справочник по **JavaScript** (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference) Здесь приведены небольшие и ограниченные примеры использования JS в QML. Они должны дать вам представление о том, как можно использовать JS внутри QML

## Вывести все ключи из элемента QML

```js
Item {
	id: root
	
	Component.onCompleted: {
		var keys = Object.keys(root);
		for(var i=0; i<keys.length; i++) {
			var key = keys[i];
			// prints all properties, signals, functions from o
			console.log(key + ' : ' + root[key]);
		}
	}
}
```

## Разбор объекта до JSON-строки и обратно

```js
Item {
	property var obj: {
		key: 'value'
	}
	
	Component.onCompleted: {
		var data = JSON.stringify(obj);
		console.log(data);
		var obj = JSON.parse(data);
		console.log(obj.key); // > 'value'
	}
}
```

## Текущая дата

```js
Item {
	Timer {
		id: timeUpdater
		interval: 100
		running: true
		repeat: true
		
		onTriggered: {
			var d = new Date();
			console.log(d.getSeconds());
		}
	}
}
```

## Вызов функции по имени

```js
Item {
	id: root

	function doIt() {
		console.log("doIt()")
	}
	
	Component.onCompleted: {
		// Call using function execution
		root["doIt"]();
		var fn = root["doIt"];
		
		// Call using JS call method (could pass in a custom th
		fn.call()
	}
}
```

## Создание JS-консоли

В качестве небольшого примера мы создадим JS-консоль. Нам необходимо поле ввода, в которое пользователь сможет вводить свои JS-выражения, а в идеале должен быть список выводимых результатов. Поскольку консоль должна быть больше похожа на настольное приложение, мы используем модуль Qt Quick Controls.

> JS-консоль в вашем следующем проекте может быть очень полезна для тестирования. Дополненная эффектом `Quake - Terminal`, она также хороша для того, чтобы произвести впечатление на клиентов. Чтобы использовать ее с умом, необходимо контролировать область видимости, в которой оценивается JS-консоль, например, текущий экран, основная модель данных, синглтонный объект ядра или все вместе.

![[QML js.png]]

Мы используем Qt Creator для создания проекта Qt Quick UI с использованием элементов управления Qt Quick. Назовем проект JSConsole. После завершения работы мастера у нас уже есть базовая структура приложения с окном приложения и меню для выхода из него.

Для ввода данных мы используем текстовое поле `TextField` и кнопку `Button` для отправки ввода на оценку. Результат оценки выражения отображается с помощью `ListView` с моделью `ListModel` в качестве модели и двумя метками для отображения выражения и результата оценки.

Наше приложение будет разбито на два файла:

> - JSConsole.qml : основной вид приложения
> 
> - jsconsole.js : библиотека javascript, отвечающая за оценку высказываний пользователя

## JSConsole.qml
### Окно приложения

```c++
// JSConsole.qml
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import QtQuick.Window
import "jsconsole.js" as Util

ApplicationWindow {
	id: root
	
	title: qsTr("JSConsole")
	width: 640
	height: 480
	visible: true
	
	menuBar: MenuBar {
		Menu {
			title: qsTr("File")
			
			MenuItem {
				text: qsTr("Exit")
				onTriggered: Qt.quit()
			}
		}
	}
```

### Форма

```c++
ColumnLayout {
	anchors.fill: parent
	anchors.margins: 9
	
	RowLayout {
		Layout.fillWidth: true
		
		TextField {
			id: input
			Layout.fillWidth: true
			focus: true
			
			onAccepted: {
				// call our evaluation function on root
				root.jsCall(input.text)
			}
		}
		
		Button {
			text: qsTr("Send")
			
			onClicked: {
				// call our evaluation function on root
				root.jsCall(input.text)
			}
		}
	}
	
	Item {
		Layout.fillWidth: true
		Layout.fillHeight: true
		
		Rectangle {
			anchors.fill: parent
			color: '#333'
			border.color: Qt.darker(color)
			opacity: 0.2
			radius: 2
		}
		
		ScrollView {
			id: scrollView
			anchors.fill: parent
			anchors.margins: 9
			
			ListView {
				id: resultView
				
				model: ListModel {
					id: outputModel
				}
				
				delegate: ColumnLayout {
					id: delegate
					required property var model
					
					width: ListView.view.width
					Label {
						Layout.fillWidth: true
						color: 'green'
						text: "> " + delegate.model.expression
					}
					Label {
						Layout.fillWidth: true
						color: delegate.model.error === "" ? 'b
						text: delegate.model.error === "" ? ""
					}
					Rectangle {
						height: 1
						Layout.fillWidth: true
						color: '#333'
						opacity: 0.2
					}
				}
			}
		}
	}
}
```

### Вызов библиотеки

Функция оценки `jsCall` выполняет оценку не сама по себе, для более четкого разделения она была перенесена в JS-модуль ( jsconsole.js ).

```c++
import "jsconsole.js" as Util

function jsCall(exp) {
	const data = Util.call(exp)
	// insert the result at the beginning of the list
	outputModel.insert(0, data)
}
```

> - Для безопасности мы не используем функцию `eval` из JS, поскольку это позволило бы пользователю изменять локальную область видимости. Мы используем конструктор `Function` для создания JS-функции во время выполнения и передаем нашу область видимости в качестве этой переменной. Поскольку функция создается каждый раз, она не действует как закрытие и хранит свою собственную область видимости, нам нужно использовать `this.a = 10`, чтобы сохранить значение внутри этой области видимости функции. Эта область видимости устанавливается скриптом в переменную scope.

## jsconsole.js

```c++
// jsconsole.js
.pragma library

const scope = {
	// our custom scope injected into our function evaluation
}

function call(msg) {
	const exp = msg.toString()
	console.log(exp)
	
	const data = {
		expression : msg,
		result: "",
		error: ""
	}
	
	try {
			const fun = new Function('return (' + exp + ')')
			data.result = JSON.stringify(fun.call(scope), null, 2)
			console.log('scope: ' + JSON.stringify(scope, null, 2),
	} catch(e) {
			console.log(e.toString())
			data.error = e.toString()
	}
	
	return data
}
```

Данные, возвращаемые из функции вызова, представляют собой JS-объект со свойствами `result`, `expression` и `error: data: { expression: "", result: "", error: "" }`. Мы можем использовать этот JS-объект непосредственно внутри `ListModel` и обращаться к нему затем из делегата, например, `delegate.model.expression` дает нам входное выражение.






























