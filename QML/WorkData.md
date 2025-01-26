# Работа с данными

В этом документе будет рассмотрено, как хранить и извлекать данные из Qt Quick. Qt Quick предлагает лишь ограниченные возможности для непосредственного хранения локальных данных. В этом смысле он больше похож на браузер. Во многих проектах хранение данных осуществляется в бэкенде на языке C++, а необходимая функциональность экспортируется во фронтенд Qt Quick. Qt Quick не предоставляет доступа к файловой системе хоста для чтения и записи файлов, как это принято на стороне Qt C++. Поэтому задача бэкенд-инженера - написать такой плагин или, возможно, использовать сетевой канал для связи с локальным сервером, предоставляющим такие возможности.

Каждое приложение нуждается в постоянном хранении все более мелкой и крупной информации. Это может быть сделано локально в файловой системе или удаленно на сервере. Часть информации будет структурированной и простой (например, настройки), часть - большой и сложной, например, файлы документации, а часть - большой и структурированной и потребует подключения к базе данных. Здесь мы рассмотрим в основном встроенные возможности Qt Quick по хранению данных, а также сетевые способы.

# Настройки

Qt поставляется с элементом `Settings` для загрузки и хранения настроек. Он все еще находится в модуле лаборатории, что означает, что API может сломаться в будущем. Поэтому будьте внимательны. 

Приведем небольшой пример, который применяет значение цвета к базовому прямоугольнику. Каждый раз, когда пользователь щелкает по окну, генерируется новый случайный цвет. При закрытии и повторном запуске приложения должен отображаться последний цвет. По умолчанию должен использоваться цвет, первоначально установленный для корневого прямоугольника.

```c++
import QtQuick
import Qt.labs.settings 1.0

Rectangle {
	id: root
	width: 320
	height: 240
	color: '#fff' // default color

	Settings {
		property alias color: root.color
	}

	MouseArea {
		anchors.fill: parent
		// random color
		onClicked: root.color = Qt.hsla(Math.random(), 0.5, 0.5
	}
}
```

Значение настроек сохраняется при каждом изменении значения. Это может быть не всегда нужно. Чтобы сохранять настройки только при необходимости, можно использовать стандартные свойства в сочетании с функцией, которая изменяет настройки при вызове.

```c++
Rectangle {
	id: root
	color: settings.color
	
	Settings {
		id: settings
		property color color: '#000000'
	}
	
	function storeSettings() { // executed maybe on destruction
		settings.color = root.color
	}
}
```

Также можно сгруппировать настройки по различным категориям с помощью
кнопки свойство категории.

```c++
Settings {
	category: 'window'
	
	property alias x: window.x
	property alias y: window.x
	property alias width: window.width
	property alias height: window.height
}
```

Настройки хранятся в соответствии с именем вашего приложения, организации и домена. Обычно эта информация задается в главной функции вашего кода на языке C++.

```c++
int main(int argc, char** argv) {
	...
		QCoreApplication::setApplicationName("Awesome Application")
		QCoreApplication::setOrganizationName("Awesome Company");
		QCoreApplication::setOrganizationDomain("org.awesome");
	...
}
```

Если вы пишете чистое QML-приложение, то те же самые атрибуты можно задать с помощью глобальных свойств `Qt.application.name`, `Qt.application.organization` и `Qt.application.domain`.

## Локальное хранилище - SQL

Qt Quick поддерживает API локального хранилища, известный из веб-браузеров как
API локального хранилища. API доступен в разделе `"import QtQuick.LocalStorage 2.0"`.

В общем случае она сохраняет содержимое в базе данных SQLite в специфическом для системы месте в уникальном файле с идентификатором, основанным на заданном имени и версии базы данных. Перечисление или удаление существующих баз данных невозможно. Место хранения можно узнать с помощью функции `QQmlEngine::offlineStoragePath() `.

При использовании API сначала создается объект базы данных, а затем создаются транзакции с этой базой. Каждая транзакция может содержать один или несколько SQL-запросов. Транзакция откатывается назад, если внутри транзакции произошел сбой SQL- запроса.

Например, для чтения из простой таблицы заметок с текстовым столбцом можно использовать локальное хранилище следующим образом:

```c++
import QtQuick
import QtQuick.LocalStorage 2.0

Item {
	Component.onCompleted: {
		const db = LocalStorage.openDatabaseSync("MyExample", "
		
		db.transaction( function(tx) {
			const result = tx.executeSql('select * from notes')
			
			for(let i = 0; i < result.rows.length; i++) {
				print(result.rows[i].text)
			}
		})
```

## Сумасшедший прямоугольник

В качестве примера предположим, что мы хотим хранить положение прямоугольника на нашей сцене.

![[QML SaveData.png]]

Вот основа примера. Она содержит прямоугольник `crazy`, который можно перетаскивать и отображать его текущее положение по `x` и `y` в виде текста.

```c++
Item {
	width: 400
	height: 400
	
	Rectangle {
		id: crazy
		objectName: 'crazy'
		width: 100
		height: 100
		x: 50
		y: 50
		color: "#53d769"
		border.color: Qt.lighter(color, 1.1)
		
		Text {
			anchors.centerIn: parent
			text: Math.round(parent.x) + '/' + Math.round(paren
		}
		
		MouseArea {
			anchors.fill: parent
			drag.target: parent
		}
	}
}
// ...
```

Прямоугольник можно свободно перетаскивать. При закрытии приложения и его повторном запуске прямоугольник будет находиться в том же положении. Теперь мы хотим добавить, что положение `x/y` прямоугольника хранится в SQL-базе. Для этого нам необходимо добавить функции `init`, `read` и функция хранения базы данных. Эти функции вызываются при завершении работы компонента и при его уничтожении

```c++
import QtQuick
import QtQuick.LocalStorage 2.0

Item {
	// reference to the database object
	property var db
	
	function initDatabase() {
	// initialize the database object
	}
	
	function storeData() {
	// stores data to DB
	}
	
	function readData() {
	// reads and applies data from DB
	}
	
	Component.onCompleted: {
		initDatabase()
		readData()
	}
	
	Component.onDestruction: {
		storeData()
	}
}
```

Можно также вынести код БД в собственную JS-библиотеку, которая будет выполнять всю логику. Этот способ будет предпочтительным, если логика будет более сложной.

В функции инициализации базы данных мы создаем объект DB и обеспечиваем создание таблицы SQL. Обратите внимание, что функции базы данных достаточно разговорчивы, чтобы можно было следить за ними на консоли.

```c++
function initDatabase() {
	// initialize the database object
	print('initDatabase()')
	db = LocalStorage.openDatabaseSync("CrazyBox", "1.0", "A bo
	
	db.transaction( function(tx) {
		print('... create table')
		tx.executeSql('CREATE TABLE IF NOT EXISTS data(name TEX
	})
}
```

Далее приложение вызывает функцию `read` для чтения существующих данных из базы данных. Здесь нам необходимо определить, есть ли уже данные в таблице. Для проверки мы смотрим, сколько строк вернул оператор `select`.

```c++
function readData() {
	// reads and applies data from DB
	print('readData()')
	if(!db) { return }
	
	db.transaction(function(tx) {
		print('... read crazy object')
		const result = tx.executeSql('select * from data where
		
		if(result.rows.length === 1) {
			print('... update crazy geometry')
			// get the value column
			const value = result.rows[0].value
			// convert to JS object
			const obj = JSON.parse(value)
			// apply to object
			crazy.x = obj.x
			crazy.y = obj.y
		}
	})
}
```

Мы ожидаем, что данные будут храниться в строке JSON внутри столбца `value`. Это не похоже на типичный SQL, но хорошо сочетается с JS-кодом. Поэтому вместо того, чтобы хранить `x,y` как свойства в таблице, мы сохраняем их как полный JS-объект, используя методы `JSON stringify/parse`. В итоге мы получаем корректный JS-объект со свойствами `x` и `y`, который мы можем применить к нашему безумному
прямоугольнику.

Для хранения данных нам необходимо различать случаи `update` и `insert`. Мы используем `update`, если запись уже существует, и `insert`, если записи с именем "crazy" не существует.

```c++
function storeData() {
	// stores data to DB
	print('storeData()')
	
	if(!db) { return }
	
	db.transaction(function(tx) {
		print('... check if a crazy object exists')
		var result = tx.executeSql('SELECT * from data where na
		// prepare object to be stored as JSON
		var obj = { x: crazy.x, y: crazy.y }
		
		if(result.rows.length === 1) { // use update
			print('... crazy exists, update it')
			result = tx.executeSql('UPDATE data set value=? whe
		} else { // use insert
			print('... crazy does not exists, create it')
			result = tx.executeSql('INSERT INTO data VALUES (?,
		}
	}
}
```

Вместо выборки всего набора записей мы могли бы также использовать функцию `SQLite count` следующим образом: `SELECT COUNT(*) from data where name = "crazy"`, которая вернула бы одну строку с количеством строк, затронутых запросом `select`. В остальном это обычный SQL-код. В качестве дополнительной возможности мы используем привязку значений SQL с помощью символа `?` в запросе. 

Теперь можно перетаскивать прямоугольник, а при выходе из приложения база данных сохраняет положение x/y и применяет его при следующем запуске приложения.























