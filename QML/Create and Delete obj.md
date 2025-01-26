# Создание и уничтожение объектов

Элемент [[Loader|Loader]] позволяет динамически заполнять часть пользовательского интерфейса. Однако общая структура интерфейса при этом остается статичной.
С помощью `JavaScript` можно сделать еще один шаг и полностью динамически инстанцировать элементы QML. 

Прежде чем мы погрузимся в детали динамического создания элементов, необходимо понять суть рабочего процесса. При загрузке фрагмента QML из файла или даже через Интернет создается компонент. Компонент заключает в себе интерпретируемый QML-код и может быть использован для создания элементов. Это означает, что загрузка фрагмента QML-кода и создание на его основе элементов - двухэтапный процесс. Сначала QML-код разбирается на компоненты. Затем компонент используется для инстанцирования реальных объектов элементов.

Помимо создания элементов из QML-кода, хранящегося в файлах или на серверах, можно также создавать QML-объекты непосредственно из текстовых строк, содержащих QML-код. Динамически созданные элементы после инстанцирования обрабатываются по аналогии.

## Динамическая загрузка и инстанцирование элементов

При загрузке фрагмента QML он сначала интерпретируется как компонент. Это включает в себя загрузку зависимостей и проверку кода. Местом расположения загружаемого QML может быть как локальный файл, так и ресурс Qt или даже удаленное сетевое местоположение, заданное URL. Это означает, что время загрузки может быть от мгновенного, например, Qt-ресурса, расположенного в оперативной памяти без каких-либо незагруженных зависимостей, до очень длительного, то есть кусок кода, расположенного на медленном сервере и имеющего множество зависимостей, которые необходимо загрузить.

Состояние создаваемого компонента можно отследить по его свойству `status`. Доступны следующие значения: `Component.Null`, `Component.Loading`, `Component.Ready` и `Component.Error`. Обычным является поток `Null - Loading - Ready`. На любом этапе статус может измениться на `Error` . В этом случае компонент не может быть использован для создания новых экземпляров объектов. Для получения читаемого пользователем описания ошибки можно использовать функцию `Component.errorString()`. 

При загрузке компонентов через медленные соединения может быть полезно свойство `progress`. Оно варьируется от 0.0 , что означает, что ничего не загружено, до 1.0, указывая на то, что все они были загружены. Когда статус компонента меняется на `Ready`, компонент можно использовать для инстанцирования объектов. Приведенный ниже код демонстрирует, как это можно сделать, учитывая событие готовности компонента или невозможность его непосредственного создания, а также случай, когда компонент готов несколько позже.

```js
var component;

function createImageObject() {
	component = Qt.createComponent("dynamic-image.qml");
	
	if (component.status === Component.Ready || component.statu
		finishCreation();
	} else {
		component.statusChanged.connect(finishCreation);
	}
}
		
function finishCreation() {
	if (component.status === Component.Ready) {
		var image = component.createObject(root, {"x": 100, "y"
		
		if (image === null) {
			console.log("Error creating image");
		}
	} else if (component.status === Component.Error) {
		console.log("Error loading component:", component.error
	}
}
```

Приведенный выше код хранится в отдельном исходном файле `JavaScript`, на который есть ссылка из основного файла QML.

```c++
import QtQuick
import "create-component.js" as ImageCreator

Item {
	id: root
	width: 1024
	height: 600
	Component.onCompleted: ImageCreator.createImageObject();
}
```

Функция `createObject` компонента используется для создания экземпляров объектов, как показано выше. Это относится не только к динамически загружаемым компонентам, но и к элементам `Component`, встроенным в QML-код. Полученный объект может быть использован в QML-сцене как любой другой объект. Единственное отличие заключается в том, что он не имеет идентификатора.

Функция `createObject` принимает два аргумента. Первый - родительский объект типа `Item` . Второй - список свойств и значений в формате `{"name": value, "name": value}`. Это продемонстрировано в примере ниже. Обратите внимание, что аргумент `properties` является необязательным.

```c++
var image = component.createObject(root, {"x": 100, "y": 100});
```

Динамически созданный экземпляр компонента не отличается от встроенного элемента `Component`. Элемент in-line `Component` также предоставляет функции для динамического инстанцирования объектов.

## Инкубационные компоненты

При создании компонентов с помощью `createObject` создание компонента-объекта является блокирующим. Это означает, что инстанцирование сложного элемента может заблокировать основной поток, что приведет к заметному сбою. В качестве альтернативы сложные компоненты могут быть разбиты на части и загружены поэтапно с помощью элементов [[Loader|Loader]].

Для решения этой проблемы компонент может быть инстанцирован с помощью метода `incubateObject`.  Он может работать так же, как и метод `createObject`, и возвращать экземпляр сразу, либо вызываться, когда компонент будет готов. В зависимости от конкретной настройки, этот способ может быть как хорошим, так и не очень способом решения проблем с анимацией, связанных с инстанцированием.

Чтобы использовать инкубатор, достаточно воспользоваться им как `createComponent`. Однако возвращаемый объект - это инкубатор, а не сам экземпляр объекта. Когда статус инкубатора равен `Component.Ready` , объект доступен через свойство `object` инкубатора. Все это показано в примере ниже:

```js
function finishCreate() {
	if (component.status === Component.Ready) {
		var incubator = component.incubateObject(root, {"x": 10
			if (incubator.status === Component.Ready) {
				var image = incubator.object; // Created at once
			} else {
				incubator.onStatusChanged = function(status) {
			
				if (status === Component.Ready) {
					var image = incubator.object; // Created as
				}
			};
		}
	}
}
```

## Динамическое создание элементов из текста

Иногда удобно иметь возможность инстанцировать объект из текстовой строки QML. Это быстрее, чем размещать код в отдельном исходном файле. Для этого используется функция `Qt.createQmlObject`.

Функция принимает три аргумента: `qml`, `parent` и `filepath`. Аргумент `qml` содержит строку QML-кода для инстанцирования. Аргумент `parent` содержит родительский объект для вновь создаваемого объекта. Аргумент `filepath` используется при сообщении об ошибках, возникших при создании объекта. Результатом, возвращаемым функцией, является либо новый объект, либо `null`.

> Функция `createQmlObject` всегда возвращается немедленно. Для успешной работы функции необходимо, чтобы все зависимости вызова были загружены. Это означает, что если код, переданный функции, ссылается на незагруженный компонент, то вызов будет неудачным и вернет `null` . Чтобы лучше справиться с этой проблемой, необходимо использовать подход `createComponent/createObject`.

Объекты, созданные с помощью функции `Qt.createQmlObject`, похожи на любой другой динамически создаваемый объект. Это означает, что он идентичен любому другому QML-объекту, за исключением того, что не имеет идентификатора . В примере ниже, новый элемент `Rectangle` инстанцируется из встроенного QML-кода после создания корневого элемента.

```c++
import QtQuick

Item {
	id: root
	width: 1024
	height: 600
	
	function createItem() {
		Qt.createQmlObject("import QtQuick 2.5; Rectangle { x:
	}
	
	Component.onCompleted: root.createItem()
}
```

## Управление динамически создаваемыми элементами

С динамически создаваемыми объектами можно обращаться так же, как и с любыми другими объектами в сцене QML. Однако здесь есть несколько подводных камней, о которых необходимо знать. Наиболее важным из них является понятие контекста создания.

Контекст создания динамически создаваемого объекта - это контекст, в котором он создается. Это не обязательно тот же контекст, в котором существует родитель. Когда контекст создания разрушается, разрушаются и привязки, касающиеся объекта. Это означает, что важно реализовать создание динамических объектов в том месте
кода, которое будет инстанцироваться в течение всего времени жизни объектов.

Динамически созданные объекты могут быть также динамически уничтожены. При этом существует правило: никогда не пытайтесь уничтожить объект, который вы не создавали. Сюда также относятся элементы, которые были созданы, но не с помощью динамического механизма, такого как `Component.createObject` или `createQmlObject`.

Уничтожение объекта осуществляется вызовом его функции `destroy`. Функция принимает необязательный аргумент, представляющий собой целое число, указывающее, сколько миллисекунд должен существовать объект до его уничтожения. Это удобно, например, для того, чтобы дать объекту завершить последний переход.

```js
item = Qt.createQmlObject(...)
	...
item.destroy()
```

> Можно уничтожить объект изнутри, что позволяет, например, создавать саморазрушающиеся всплывающие окна.

## Отслеживание динамических объектов

При работе с динамическими объектами часто возникает необходимость отслеживать созданные объекты. Другой распространенной особенностью является возможность сохранения и восстановления состояния динамических объектов. Обе эти задачи легко решаются с помощью динамически заполняемой модели `XmlListModel`.

В приведенном ниже примере два типа элементов, ракеты и НЛО, могут быть созданы и перемещены пользователем. Для того чтобы иметь возможность манипулировать всей сценой с динамически создаваемыми элементами, мы используем модель для отслеживания элементов.

Модель, `XmlListModel` , заполняется по мере создания элементов. Ссылка на объект отслеживается вместе с URL-адресом источника, использованным при его создании. Последний не является обязательным для отслеживания объектов, но пригодится в дальнейшем.

```c++
import QtQuick
import "create-object.js" as CreateObject

Item 
{
	id: root
	
	ListModel {
		id: objectsModel
	}
	
	function addUfo() {
		CreateObject.create("ufo.qml", root, itemAdded)
	}
	
	function addRocket() {
		CreateObject.create("rocket.qml", root, itemAdded)
	}
	
	function itemAdded(obj, source) {
		objectsModel.append({"obj": obj, "source": source})
	}
}
```

Как видно из приведенного примера, `create-object.js` представляет собой более обобщенную форму представленного ранее `JavaScript`. Метод `create` использует три аргумента: исходный URL-адрес, корневой элемент и обратный вызов, который должен быть вызван после завершения работы. Обратный вызов вызывается с двумя аргументами: ссылкой на только что созданный объект и используемым исходным URL.

Это означает, что при каждом вызове функций `addUfo` или `addRocket` после создания нового объекта будет вызываться функция `itemAdded`. Последняя добавит ссылку на объект и URL источника в модель `objectsModel`.

Модель `objectsModel` может быть использована различными способами. В рассматриваемом примере на нее опирается функция `clearItems` . Эта функция демонстрирует две вещи. Во-первых, как выполнить итерацию по модели и выполнить задачу, т.е. вызвать функцию `destroy` для каждого элемента, чтобы удалить его. Во-вторых, она демонстрирует тот факт, что модель не обновляется при
уничтожении объектов.

Вместо удаления элемента модели, связанного с рассматриваемым объектом, свойство `obj` этого элемента модели устанавливается в `null` . Чтобы исправить это, код должен явно очищать элемент модели по мере удаления объектов.

```c++
function clearItems() {
	while(objectsModel.count > 0) {
		objectsModel.get(0).obj.destroy()
		objectsModel.remove(0)
	}
}
```

Имея модель, представляющую все динамически создаваемые объекты, легко создать функцию, которая сериализует эти объекты. В коде примера сериализованная информация состоит из исходного URL каждого объекта и его свойства `x` и `y` . Именно эти свойства могут быть изменены пользователем. Полученная информация используется для построения строки XML-документа.

```c++
function serialize() {
	var res = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<sce
	
	for(var ii=0; ii < objectsModel.count; ++ii) {
		var i = objectsModel.get(ii)
		res += " <item>\n <source>" + i.source + "</source>
	}
	
	res += "</scene>"
	return res
}
```

> В настоящее время в модели [[XmlListModel|XmlListModel]] из Qt 6 отсутствуют свойство `xml` и функция `get()`, необходимые для работы сериализации и десериализации.

Строка XML-документа может быть использована с моделью [[XmlListModel|XmlListModel]] путем установки свойства `xml` модели. В приведенном ниже коде модель показана вместе с функцией десериализации. Функция `deserialize` запускает десериализацию, устанавливая `dsIndex` для ссылки на первый элемент модели, а затем вызывая создание этого элемента. Обратный вызов, `dsItemAdded`, устанавливает свойства `x` и `y` вновь созданного объекта. Затем обновляется индекс и создается следующий объект, если таковой имеется.

```c++
XmlListModel {
	id: xmlModel
	query: "/scene/item"
	
	XmlListModelRole { name: "source"; elementName: "source" }
	XmlListModelRole { name: "x"; elementName: "x" }
	XmlListModelRole { name: "y"; elementName: "y" }
}

function deserialize() {
	dsIndex = 0
	CreateObject.create(xmlModel.get(dsIndex).source, root, dsI
}
						
function dsItemAdded(obj, source) {
	itemAdded(obj, source)
	obj.x = xmlModel.get(dsIndex).x
	obj.y = xmlModel.get(dsIndex).y
	dsIndex++
	
	if (dsIndex < xmlModel.count) {
		CreateObject.create(xmlModel.get(dsIndex).source, root,
	}
}
							
property int dsIndex
```

Пример демонстрирует, как можно использовать модель для отслеживания созданных элементов и как легко сериализовать и десериализовать такую информацию. Это может быть использовано для хранения динамически заполняемой сцены, например набора виджетов. В примере для отслеживания каждого элемента использовалась модель.

Альтернативным решением может быть использование свойства `children` корня сцены для отслеживания элементов. Однако для этого необходимо, чтобы сами элементы знали исходный URL для их повторного создания. Это также требует от нас реализации способа, позволяющего отличать динамически создаваемые элементы от элементов, являющиеся частью исходной сцены, что позволяет избежать попыток сериализации и последующей десериализации исходных элементов.

## Резюме

Было рассмотрено динамическое создание элементов QML. Это позволяет нам свободно создавать QML-сцены, открывая возможности для создания конфигурируемых пользователем архитектур и архитектур на основе подключаемых модулей.

Самый простой способ динамической загрузки QML-элемента - это
использование [[Loader|Loader]] элемент. Он служит в качестве заполнителя для загружаемого содержимого. 

Для более динамичного подхода можно использовать функцию `Qt.createQmlObject` для инстанцирования строки QML. Однако такой подход имеет свои ограничения. Полноценным решением является динамическое создание Компонента с помощью функции `Qt.createComponent`. Затем объекты создаются путем вызова функции
`createObject` компонента.

Поскольку привязки и сигнальные соединения зависят от существования идентификатора объекта или доступа к инстанциям объекта, для динамически создаваемых объектов необходимо использовать альтернативный подход. Для создания привязки используется элемент [[Binding|Binding]]. Элемент `Connections` позволяет подключаться к сигналам динамически создаваемого объекта.

Одна из трудностей работы с динамически создаваемыми элементами заключается в том, чтобы отслеживать их. Это можно сделать с помощью модели. Имея модель, отслеживающую динамически создаваемые элементы, можно реализовать функции для сериализации и десериализации, что позволит хранить и восстанавливать динамически создаваемые сцены.







