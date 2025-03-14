# QML

Подобно HTML, QML является языком разметки. Он состоит из тегов, называемых в Qt Quick типами, которые заключены в фигурные скобки: `Item {}` . Он был разработан с нуля для создания пользовательских интерфейсов, скорости и облегчения чтения для разработчиков. Пользовательский интерфейс может быть доработан с помощью JavaScript-кода. Qt Quick легко расширяется за счет собственной функциональности с использованием Qt C++. В двух словах декларативный пользовательский интерфейс называется **front-end** а "родная" часть называется **back-end**. Это позволяет отделить вычислительную часть приложения от пользовательского интерфейса

Запускаем Qt, выбираем один из следующих шаблонов:
* Приложение Qt Quick
>		Данный шаблон добавляет некую базовую функциональность. Предполагает в качестве системы сборки только CMake. Ориентирован на использование в новых версиях Qt (6 и выше)
* Приложение Qt Quick - Пустое. 
> 		Создает "пустой" проект на языке C++ с поддержкой **cmake** и основным документом QML для отрисовки пустого окна. Это типичная стартовая точка по умолчанию для всех нативных QML-приложений.
* Приложение Qt Quick - Scroll.
>		
* Приложение Qt Quick - Stack.
>		
* Приложение Qt Quick - Swipe. 
>		
* Приложение Qt Quick - (Compat). 
>		Данный шаблон определяет только пустое окно. Позволяет выбрать в качестве системы сборки CMake или qmake. Ориентирован на использование в старых версиях Qt (до Qt 6)

Свойства типов:
* id -  это специальное необязательное свойство, содержащее идентификатор, который может быть использован для ссылки на связанный с ним тип в других местах документа. Важно: свойство **id** не может быть изменено после его установки и не может быть установлено во время выполнения. Использование свойства `root` в качестве идентификатора корневого типа - это соглашение, используемое в данной книге для того, чтобы сделать ссылки на самый верхний тип предсказуемыми в больших документах QML.
* width -  ширина в пикселях
* height - высота в пикселях
* title - 
* visible - видимость элемента
* anchors - выравнивание
	* anchors.horizontalCenter - выравнивание относительно горизонтального центра
	* anchors.bottom - выравнивание относительно низа
	* anchors.centerIn - выравнивание относительно центра объекта
	* anchors.horizontalCenterOffset - смещение типа от горизонтального центра
	* anchors.verticalCenterOffset - смещение типа от вертикального центра



При помощи QML описывается визуальный вид пользовательского интерфейса в порядке слоев и группировки, где самый верхний слой (фоновое изображение) рисуется первым, а дочерние слои рисуются поверх него в локальной системе координат содержащего типа.

## Пример 1
```c++
import QtQuick 2.14
import QtQuick.Window 2.14
import QtQuick.Controls 2.12

Window {
    visible: true
    width: 1000
    height: 1000
    title: qsTr("Hello World")
    id: root

	onWidthChanged: print(width)

    Flickable {
        anchors.fill: parent
        contentHeight: idContent.height
        contentWidth: idContent.width

        Item {
            id: idContent
            width: Math.max(parent.width, img_1.width)
            height: Math.max(parent.height, img_1.height)

            Image {
                id: img_1
                anchors.centerIn: parent
                source: "qrc:/IMG/image002.png"
            }
        }
    }

    MouseArea {
        anchors.fill: parent
        onClicked: img_1.rotation += 90
    }
}
```









