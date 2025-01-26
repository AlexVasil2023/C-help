# Qt для Python

Проект Qt for Python предоставляет инструментарий для связывания C++ и Qt с Python, а также полный Python API для Qt. Это означает, что все, что можно сделать с помощью Qt и C++, можно сделать и с помощью Qt и Python. Это включает в себя все: от безголовых сервисов до пользовательских интерфейсов на основе виджетов. В этой главе мы рассмотрим, как интегрировать QML и Python. 

В настоящее время Qt для Python доступен для всех настольных платформ, но не для мобильных. В зависимости от используемой платформы настройка Python несколько отличается, но как только у вас появляется Python (https://www.python.org/) и PyPA (https://www.pypa.io/en/latest/), можно установить Qt для Python с помощью команды pip . Более подробно это рассматривается далее.

Поскольку проект Qt for Python предоставляет совершенно новую языковую привязку для Qt, он также поставляется с новым набором документации. При изучении этого модуля полезно ознакомиться со следующими ресурсами.

> Справочная документация: https://doc.qt.io/qtforpython/
> Qt for Python wiki: https://wiki.qt.io/Qt_for_Python
> Оговорки: https://wiki.qt.io/Qt_for_Python/Considerations

Связка Qt для Python создается с помощью инструмента `Shiboken`. Иногда бывает интересно почитать и о нем, чтобы понять, что происходит. Предпочтительным местом для поиска информации о Shiboken является справочная документация (https://doc.qt.io/qtforpython/shiboken6/index.html) . Если вы хотите смешать собственный код на Си++ с Python и QML, то Shiboken - это тот инструмент, который вам нужен.

> В этой главе будет использоваться Python 3.7.

## Установка

Qt для Python доступен через PyPA с помощью pip под именем pyside6. В приведенном ниже примере мы создаем среду `venv`, в которую будем устанавливать последнюю версию Qt для Python:

```sh
mkdir qt-for-python
cd qt-for-python
python3 -m venv .
source bin/activate
(qt-for-python) $ python --version
Python 3.9.6
```

Когда среда настроена, продолжаем установку pyside6, используя pip :

```sh
(qt-for-python) $ pip install pyside6
Collecting pyside6
Downloading [ ... ] (60.7 MB)
Collecting shiboken6==6.1.2
Downloading [ ... ] (1.0 MB)
Installing collected packages: shiboken6, pyside6
Successfully installed pyside6-6.1.2 shiboken6-6.1.2
```

После установки мы можем протестировать его, запустив пример Hello World из интерактивного приглашения Python:

```sh
(qt-for-python) $ python
Python 3.9.6 (default, Jun 28 2021, 06:20:32)
[Clang 12.0.0 (clang-1200.0.32.29)] on darwin
Type "help", "copyright", "credits" or "license" for more infor
>>> from PySide6 import QtWidgets
>>> import sys
>>> app = QtWidgets.QApplication(sys.argv)
>>> widget = QtWidgets.QLabel("Hello World!")
>>> widget.show()
>>> app.exec()
0
>>>
```

В результате выполнения примера появляется окно, подобное показанному ниже. Для завершения работы программы закройте окно.

![[QML PY.png]]

## Построение приложения

В этой главе мы рассмотрим, как можно объединить Python и QML. Наиболее естественный способ совместить эти два мира - сделать это так же, как в случае с C++ и QML, т.е. реализовать логику на Python, а представление на QML.

## Запуск QML из Python

Самый первый шаг - это создание программы на языке Python, в которой может быть размещена QML-программа Hello World, показанная ниже.

```c++
import QtQuick
import QtQuick.Window

Window {
	width: 640
	height: 480
	visible: true
	title: qsTr("Hello Python World!")
}
```

Для этого нам нужен основной цикл Qt, предоставляемый [[QGuiApplication|QGuiApplication]] из модуля QtGui . Нам также необходим [[QQmlApplicationEngine|QQmlApplicationEngine]] из модуля QtQml . Для того чтобы передать ссылку на исходный файл механизму приложения QML, нам также необходим класс QUrl из модуля QtCore.

В приведенном ниже коде мы эмулируем функциональность шаблонного C++ кода, генерируемого Qt Creator для QML-проектов. Он инстанцирует объект приложения и создает движок приложения QML. Затем загружается QML и проверяется, был ли создан корневой объект. Наконец, он выходит из программы и возвращает значение, возвращенное методом exec объекта приложения.

```python
import sys
from PySide6.QtGui import QGuiApplication
from PySide6.QtQml import QQmlApplicationEngine
from PySide6.QtCore import QUrl

if __name__ == '__main__':
	app = QGuiApplication(sys.argv)
	engine = QQmlApplicationEngine()
	engine.load(QUrl("main.qml"))
	
	if not engine.rootObjects():
		sys.exit(-1)
		
	sys.exit(app.exec())
```

В результате выполнения примера появляется окно с заголовком `Hello Python World`.

![[QML Py 2.png]]

> В примере предполагается, что он выполняется из каталога, содержащего исходный файл `main.qml`. Определить местоположение выполняемого Python-файла можно с помощью переменной `file`. Это может быть использовано для определения местоположения QML-файлов относительно Python-файла, как показано в этой записи блога (http://blog.qt.io/blog/2018/05/14/qml-qt-python/) .

## Экспонирование объектов Python в QML

Наиболее простым способом обмена информацией между Python и QML является представление объекта Python в QML. Это делается путем регистрации контекста свойство через [[QQmlApplicationEngine|QQmlApplicationEngine]]. Прежде чем это сделать, необходимо определить класс, чтобы иметь объект, который мы будем экспонировать.

Классы Qt поставляются с рядом функций, которые мы хотим иметь возможность использовать. К ним относятся: сигналы, слоты и свойства. В этом первом примере мы ограничимся базовой парой сигнал-слот. Остальное будет рассмотрено в последующих примерах.

### Сигналы и слоты

Начнем с класса `NumberGenerator` . Он имеет конструктор, метод `updateNumber` и сигнал `nextNumber`. Идея заключается в том, что при вызове метода `updateNumber` выдается сигнал `nextNumber` со значением новое случайное число. Код класса приведен ниже, но сначала мы рассмотрим детали.

Прежде всего, мы убеждаемся в том, что вызов [[QObject|QObject]].init из нашего конструктора. Это очень важно, так как без этого пример работать не будет.

Затем мы объявляем сигнал, создавая экземпляр класса `Signal` из модуля `PySide6.QtCore`. В данном случае сигнал несет целочисленное значение, поэтому в качестве параметра используется [[int|int]]. Имя параметра сигнала, `number`, задается в
параметре `arguments`.

Наконец, мы украшаем метод `updateNumber` декоратором `@Slot()`, тем самым превращая его в слот. В Qt для Python нет понятия `invokables`, поэтому все вызываемые методы должны быть слотами. 

В методе `updateNumber` мы выдаем сигнал `nextNumber` с помощью метода [[emit|emit]]. Это несколько отличается от синтаксиса QML или C++, так как сигнал представлен объектом, а не вызываемой функцией.

```python
import random
from PySide6.QtCore import QObject, Signal, Slot

class NumberGenerator(QObject):
	def __init__(self):
		QObject.__init__(self)
		
	nextNumber = Signal(int, arguments=['number'])
	
@Slot()
def giveNumber(self):
	self.nextNumber.emit(random.randint(0, 99))
```

Далее необходимо объединить только что созданный класс с шаблонным кодом для объединения QML и Python, описанным ранее. В результате мы получаем следующий код начальной точки. 

Интересны строки, в которых мы сначала инстанцируем `NumberGenerator` . Затем этот объект передается в QML с помощью метода `setContextProperty` корневого контекста движка QML. При этом объект отображается в QML как глобальная переменная с именем `numberGenerator`.

```python
import sys
from PySide6.QtGui import QGuiApplication
from PySide6.QtQml import QQmlApplicationEngine
from PySide6.QtCore import QUrl

if __name__ == '__main__':
	app = QGuiApplication(sys.argv)
	engine = QQmlApplicationEngine()
	number_generator = NumberGenerator()
	engine.rootContext().setContextProperty("numberGenerator",
	engine.load(QUrl("main.qml"))
	
	if not engine.rootObjects():
		sys.exit(-1)

	sys.exit(app.exec())
```

Переходя к коду QML, можно увидеть, что мы создали пользовательский интерфейс Qt Quick Controls 2, состоящий из кнопки и метки . В обработчике `onClicked` кнопки вызывается функция `numberGenerator.updateNumber()`. Это слот объекта, инстанцированного на стороне Python. Для получения сигнала от объекта, который был инстанцирован вне QML, необходимо использовать элемент `Connections` . Это позволяет прикрепить обработчик сигнала к существующей цели.

```c++
import QtQuick
import QtQuick.Window
import QtQuick.Controls

Window {
	id: root
	width: 640
	height: 480
	visible: true
	
	title: qsTr("Hello Python World!")
		
	Flow {
		Button {
			text: qsTr("Give me a number!")
			onClicked: numberGenerator.giveNumber()
		}
		
		Label {
			id: numberLabel
			text: qsTr("no number")
		}
	}

	Connections {
		target: numberGenerator

		function onNextNumber(number) {
			numberLabel.text = number
		}
	}
}
```

### Свойства

Вместо того чтобы полагаться исключительно на сигналы и слоты, общепринятым способом представления состояния в QML являются свойства. Свойство - это комбинация сеттера, геттера и сигнала уведомления. Сеттер является необязательным, так как мы можем иметь свойства, доступные только для чтения.

Чтобы попробовать это сделать, мы обновим `NumberGenerator` из предыдущего примера до версии, основанной на свойствах. У него будет два свойства: `number` - свойство только для чтения, содержащее последнее случайное число, и `maxNumber` - свойство для чтения и записи, содержащее максимальное значение, которое может быть возвращено. Также у него будет слот `updateNumber`, который обновляет случайное число.

Прежде чем погрузиться в детали свойств, мы создадим для этого базовый класс Python. Он содержит соответствующие геттеры и сеттеры, но не Qt-сигнализацию. Собственно говоря, единственная Qt-часть здесь - это наследование от [[QObject|QObject]] . Даже имена методов написаны в стиле Python, т.е. с использованием подчеркивания вместо `camelCase`. 

Обратите внимание на знаки подчеркивания (" ") в начале метод `set_number` . Это означает, что он является приватным методом. Таким образом, даже если свойство `number` доступно только для чтения, мы предоставляем сеттер. Мы просто не сделаем его общедоступным. Это позволит нам выполнять действия при изменении значения (например, выдавать сигнал уведомления).

```python
class NumberGenerator(QObject):
	def __init__(self):
		QObject.__init__(self)
		self.__number = 42
		self.__max_number = 99
		
	def set_max_number(self, val):
		if val < 0:
			val = 0
			
		if self.__max_number != val:
			self.__max_number = val
			
		if self.__number > self.__max_number:
			self.__set_number(self.__max_number)
			
	def get_max_number(self):
		return self.__max_number
		
	def __set_number(self, val):
		if self.__number != val:
		self.__number = val
		
	def get_number(self):
		return self.__number
```

Для определения свойств нам необходимо импортировать понятия `Signal`, `Slot` и `Property` из `PySide2.QtCore`. В полном примере импортов больше, но это те, которые имеют отношение к свойствам.

```python
from PySide6.QtCore import QObject, Signal, Slot, Property
```

Теперь мы готовы определить первое свойство - `number`. Начнем с объявления сигнала `numberChanged`, который затем вызовем в функции метод `set_number`, чтобы при изменении значения выдавался сигнал.

После этого остается только инстанцировать объект `Property`. В данном случае конструктор свойств принимает три аргумента: тип (`int`), геттер (`get_number`) и сигнал уведомления, который передается в качестве именованного аргумента (`notify=numberChanged`). Обратите внимание, что геттер имеет Python-имя, т.е. использует подчеркивание, а не `camelCase`, поскольку используется для чтения значения из Python. Для QML используется имя свойства `number`.

```python
class NumberGenerator(QObject):
	# ...
	# number
	
	numberChanged = Signal(int)
	
	def __set_number(self, val):
		if self.__number != val:
			self.__number = val
			self.numberChanged.emit(self.__number)
			
	def get_number(self):
		return self.__number
		
	number = Property(int, get_number, notify=numberChanged)
```

Это приводит нас к следующему свойству, `maxNumber`. Это свойство предназначено для чтения и записи, поэтому нам необходимо предоставить сеттер, а также все то, что мы делали для свойства `number`.

Сначала мы объявим сигнал `maxNumberChanged` . На этот раз мы используем декоратор `@Signal` вместо инстанцирования объекта `Signal`. Мы также предоставляем слот сеттера `setMaxNumber` с Qt-именем (`camelCase`), который просто вызывает Python-метод `set_max_number`, а также геттер с Python-именем. Опять же, при обновлении значения сеттер издает сигнал `change`. 

Наконец, мы объединяем все эти части в свойство чтения и записи, инстанцируя объект `Property`, принимая в качестве аргументов тип, геттер, сеттер и сигнал уведомления.

```python
class NumberGenerator(QObject):
	# ...
	# maxNumber
	
	@Signal
	def maxNumberChanged(self):
		pass
		
	@Slot(int)
	def setMaxNumber(self, val):
		self.set_max_number(val)
		
	def set_max_number(self, val):
		if val < 0:
			val = 0
		
		if self.__max_number != val:
			self.__max_number = val
			self.maxNumberChanged.emit()

		if self.__number > self.__max_number:
			self.__set_number(self.__max_number)
	
	def get_max_number(self):
		return self.__max_number
		
	maxNumber = Property(int, get_max_number, set_max_number, n
```

Теперь у нас есть свойства для текущего случайного числа, `number` , и максимального случайного числа, `maxNumber`. Остался только слот для создания нового случайного числа. Он называется `updateNumber` и просто устанавливает новое случайное число.

```python
class NumberGenerator(QObject):
	# ...
	
	@Slot()
	def updateNumber(self):
		self.__set_number(random.randint(0, self.__max_number))
```

Наконец, генератор чисел отображается в QML через свойство корневого контекста.

```python
if __name__ == '__main__':
	app = QGuiApplication(sys.argv)
	engine = QQmlApplicationEngine()
	
	number_generator = NumberGenerator()
	engine.rootContext().setContextProperty("numberGenerator",
	
	engine.load(QUrl("main.qml"))
		
	if not engine.rootObjects():
		sys.exit(-1)
		
	sys.exit(app.exec())
```

В QML мы можем привязываться к свойствам `number` и `maxNumber` объекта `NumberGenerator`. В обработчике `onClicked` объекта В кнопке мы вызываем метод `updateNumber` для генерации нового случайного числа, а в обработчике `onValueChanged` слайдера устанавливаем свойство `maxNumber` с помощью метода `setMaxNumber`. Это связано с тем, что изменение свойства напрямую через Javascript приведет к разрушению привязки к свойству. Явное использование метода `setter` позволяет избежать этого.

```c++
import QtQuick
import QtQuick.Window
import QtQuick.Controls

Window {
	id: root
	width: 640
	height: 480
	visible: true
	title: qsTr("Hello Python World!")

	Column {
		
		Flow {
			
			Button {
				text: qsTr("Give me a number!")
				onClicked: numberGenerator.updateNumber()
			}

			Label {
				id: numberLabel
				text: numberGenerator.number
			}
		}
	
		Flow {
			
			Slider {
				from: 0
				to: 99
				value: numberGenerator.maxNumber
				onValueChanged: numberGenerator.setMaxNumber(va
			}
		}
	}
}
```

### Экспонирование класса Python в QML

До сих пор мы инстанцировали объект Python и использовали метод `setContextProperty` корневого контекста, чтобы сделать его доступным для QML. Возможность инстанцировать объект из QML позволяет лучше контролировать жизненный цикл объекта из QML. Для этого нам необходимо предоставить QML не объект, а класс. 

На класс, который подвергается воздействию QML, не влияет место его инстанцирования. Никаких изменений в определении класса не требуется. Однако вместо вызова `setContextProperty` используется функция [[qmlRegisterType|qmlRegisterType]] . Эта функция берется из модуля
PySide2.QtQml и принимает пять аргументов:
> - Ссылка на класс, `NumberGenerator` в примере ниже. Имя модуля, 'Generators';
> - Версия модуля, состоящая из мажорного и минорного номера, 1 и 0;
> - Значение 1 .0 ;
> - QML-имя класса,  `NumberGenerator`;

```python
import random
import sys

from PySide6.QtGui import QGuiApplication
from PySide6.QtQml import QQmlApplicationEngine, qmlRegisterTyp
from PySide6.QtCore import QUrl, QObject, Signal, Slot

class NumberGenerator(QObject):
	def __init__(self):
		QObject.__init__(self)
		
	nextNumber = Signal(int, arguments=['number'])
	
	@Slot()
	def giveNumber(self):
		self.nextNumber.emit(random.randint(0, 99))
		
	if __name__ == '__main__':
		app = QGuiApplication(sys.argv)
		engine = QQmlApplicationEngine()
		qmlRegisterType(NumberGenerator, 'Generators', 1, 0, 'Numbe

		engine.load(QUrl("main.qml"))
		
		if not engine.rootObjects():
			sys.exit(-1)
	
		sys.exit(app.exec())
```

В QML нам необходимо импортировать модуль, например Generators 1.0 , а затем инстанцировать класс в виде `NumberGenerator` { ... } . Теперь экземпляр работает как любой другой элемент QML.

```c++
import QtQuick
import QtQuick.Window
import QtQuick.Controls
import Generators

Window {
	id: root
	width: 640
	height: 480
	visible: true

	title: qsTr("Hello Python World!")
	
	Flow {
		
		Button {
			text: qsTr("Give me a number!")
			onClicked: numberGenerator.giveNumber()
		}
		
		Label {
			id: numberLabel
			text: qsTr("no number")
		}
	}
	
	NumberGenerator {
		id: numberGenerator
	}
	
	Connections {
		target: numberGenerator
		
		function onNextNumber(number) {
			numberLabel.text = number
		}
	}
}
```

### Модель на основе языка Python

Одним из наиболее интересных типов объектов или классов, которые можно передать из Python в QML, являются модели элементов. Они используются с различными представлениями или элементом Repeater для динамического построения пользовательского интерфейса на основе содержимого модели.

В этом разделе мы возьмем существующую python-утилиту для мониторинга загрузки процессора (и не только), psutil , и подключим ее к QML через пользовательскую модель элементов под названием CpuLoadModel. Ниже показана программа в действии:

![[QML py 3.png]]

> Библиотека psutil находится по адресу https://pypi.org/project/psutil/(https://pypi.org/project/psutil/) .

"psutil (process and system utilities) - кроссплатформенная библиотека для получения информации о запущенных процессах и использовании системы (процессор, память, диски, сеть, датчики) на языке Python."

Установить psutil можно с помощью `pip install psutil`.

Мы будем использовать функцию psutil.cpu_percent (документация (https://psutil.readthedocs.io/en/latest/#psutil.cpu_percent) ) для ежесекундной выборки загрузки процессора на ядро. Для управления выборкой мы используем QTimer . Все это реализуется через модель CpuLoadModel , которая представляет собой [[QAbstractListModel|QAbstractListModel]].

Модели элементов очень интересны. Они позволяют представить двумерный набор данных или даже вложенные наборы данных, если использовать [[QAbstractItemModel|QAbstractItemModel]] . Используемая нами модель [[QAbstractListModel|QAbstractListModel]] позволяет представить список элементов, поэтому одномерный набор данных. Можно реализовать вложенный набор списков, создав дерево, но мы будем создавать только один уровень.

Для реализации [[QAbstractListModel|QAbstractListModel]] необходимо реализовать методы `rowCount` и `data`. Метод `rowCount` возвращает количество ядер процессора, которое мы получаем с помощью метода `psutil.cpu_count`. Метод `data` возвращает данные для различных ролей. Мы поддерживаем только `Qt.DisplayRole`, что соответствует тому, что получается при обращении к `display` внутри элемента делегата из QML.

Если посмотреть на код модели, то можно увидеть, что фактические данные хранятся в списке `cpu_load`. Если к данным сделан корректный запрос , т.е. правильно указаны строка, столбец и роль, то мы возвращаем нужный элемент из списка `cpu_load`. В противном случае мы возвращаем `None`, что соответствует неинициализированному [[QVariant|QVariant]] на стороне Qt.

Каждый раз, когда истекает таймер обновления (`update_timer`), срабатывает метод `update`. Здесь обновляется список `cpu_load`, но при этом выдается сигнал `dataChanged`, указывающий на то, что все данные были изменены. Мы не выполняем сброс модели (`modelReset`), поскольку это также подразумевает, что количество элементов могло измениться. 

Наконец, модель `CpuLoadModel` отображается в QML как зарегистрированный тип.

```python
import psutil
import sys

from PySide6.QtGui import QGuiApplication
from PySide6.QtQml import QQmlApplicationEngine, qmlRegisterTyp
from PySide6.QtCore import Qt, QUrl, QTimer, QAbstractListModel

class CpuLoadModel(QAbstractListModel):
	def __init__(self):
		QAbstractListModel.__init__(self)
		
		self.__cpu_count = psutil.cpu_count()
		self.__cpu_load = [0] * self.__cpu_count
		
		self.__update_timer = QTimer(self)
		self.__update_timer.setInterval(1000)
		self.__update_timer.timeout.connect(self.__update)
		self.__update_timer.start()
		
		# The first call returns invalid data
		psutil.cpu_percent(percpu=True)
		
	def __update(self):
		self.__cpu_load = psutil.cpu_percent(percpu=True)
		self.dataChanged.emit(self.index(0,0), self.index(self.
		
	def rowCount(self, parent):
		return self.__cpu_count
		
	def data(self, index, role):
		if (role == Qt.DisplayRole and
		index.row() >= 0 and
		index.row() < len(self.__cpu_load) and
		index.column() == 0):
			return self.__cpu_load[index.row()]
		else:
			return None
			
if __name__ == '__main__':
	app = QGuiApplication(sys.argv)
	engine = QQmlApplicationEngine()
	qmlRegisterType(CpuLoadModel, 'PsUtils', 1, 0, 'CpuLoadMode
	engine.load(QUrl("main.qml"))
	
	if not engine.rootObjects():
		sys.exit(-1)
	
	sys.exit(app.exec())
```

На стороне QML мы используем [[ListView|ListView]] для отображения загрузки процессора. Модель привязывается к свойству `model ` Для каждого элемента модели будет инстанцирован элемент-делегат. В данном случае это прямоугольник с зеленой полосой (еще один прямоугольник ) и элемент `Text`, отображающий текущую загрузку.

```c++
import QtQuick
import QtQuick.Window
import PsUtils

Window {
	id: root
	width: 640
	height: 480
	visible: true
	
	title: qsTr("CPU Load")
	
	ListView {
		anchors.fill: parent
		
		model: CpuLoadModel { }
		
		delegate: Rectangle {
			id: delegate
			required property int display
			width: parent.width
			height: 30
			color: "white"
			
			Rectangle {
				id: bar
				width: parent.width * delegate.display / 100.0
				height: 30
				color: "green"
			}
			
			Text {
				anchors.verticalCenter: parent.verticalCenter
				x: Math.min(bar.x + bar.width + 5, parent.width
				text: delegate.display + "%"
			}
		}
	}
}
```

## Ограничения

На данный момент есть некоторые вещи, которые не так легко доступны. Одна из них заключается в том, что вы не можете легко создавать подключаемые модули QML с помощью Python. Вместо этого необходимо импортировать "модули" QML в программу на Python, а затем использовать [[qmlRegisterType|qmlRegisterType]], чтобы сделать возможным их импорт из QML.































