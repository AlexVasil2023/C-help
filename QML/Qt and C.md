# Qt и C++

Qt - это инструментарий на языке C++ с расширением для QML и Javascript. Существует множество языковых связок для Qt, но поскольку сам Qt разработан на C++, дух C++ можно обнаружить во всех классах. С помощью C++ можно расширять и контролировать среду выполнения, предоставляемую QML.

![[QML Cpp.png]]

## Qt C++

Если подойти к Qt с точки зрения языка C++, то можно обнаружить, что Qt обогащает C++ рядом современных языковых возможностей, которые обеспечиваются за счет доступности данных интроспекции. Это стало возможным благодаря использованию базового класса `QObject` . Данные интроспекции, или метаданные, сохраняют информацию о классах во время выполнения, чего не делает обычный C++. Это позволяет динамически запрашивать у объектов информацию о таких деталях, как их свойства и доступные методы.

Qt использует эту метаинформацию для реализации очень слабо связанной концепции обратного вызова с использованием сигналов и слотов. Каждый сигнал может быть связан с любым количеством слотов или даже других сигналов. Когда от экземпляра объекта исходит сигнал, вызываются связанные с ним слоты. Поскольку
объекту, излучающему сигнал , не нужно ничего знать об объекте, владеющем слотом, и наоборот, этот механизм используется для создания очень многократно используемых компонентов с очень малым количеством межкомпонентных зависимостей.

## Qt для Python

Возможности интроспекции также используются для создания динамических привязок к языку , позволяя отобразить экземпляр объекта C++ в QML и сделать функции C++ вызываемыми из Javascript. Существуют и другие привязки для Qt C++. Кроме стандартной привязки для Javascript, официальной является привязка для Python, называемая PySide6 (https://www.qt.io/qt-for-python) .

## Кросс-платформа

В дополнение к этой центральной концепции Qt делает возможной разработку кроссплатформенных приложений с использованием языка C++. Qt C++ обеспечивает абстракцию платформы на различных операционных системах, что позволяет разработчику сконцентрироваться на поставленной задаче, а не на деталях того, как открыть файл в разных операционных системах. Это означает, что вы можете перекомпилировать один и тот же исходный код для Windows, OS X и Linux, а Qt позаботится о различных способах работы ОС с определенными вещами. В итоге получаются встроенные приложения с внешним видом, соответствующим целевой платформе. Поскольку мобильный компьютер - это новый рабочий стол, новые версии Qt также могут работать с несколькими мобильными платформами, используя один и тот же исходный код, например, iOS, Android, Jolla, BlackBerry, Ubuntu Phone, Tizen.

Что касается повторного использования, то не только исходный код может быть использован повторно, но и навыки разработчиков также могут быть использованы повторно. Команда, знающая Qt, может охватить гораздо больше платформ, чем команда, ориентированная только на одну платформу, а поскольку Qt очень гибок, команда может создавать различные компоненты системы, используя одну и ту же
технологию.

Для всех платформ Qt предлагает набор базовых типов, например, строки с полной поддержкой Unicode, списки, векторы, буферы. Кроме того, он предоставляет общую абстракцию для главного цикла целевой платформы, а также кроссплатформенную поддержку потоков и сетей. Общая философия заключается в том, что для разработчика приложений Qt поставляется со всей необходимой функциональностью. Для решения специфических задач, таких как взаимодействие с родными библиотеками, Qt поставляется с несколькими вспомогательными классами, облегчающими эту задачу.

## Шаблонное приложение

Лучший способ понять Qt - начать с небольшого примера. Это приложение создает простую строку "Hello World!" и записывает ее в файл с использованием символов Unicode.

```c++
#include <QCoreApplication>
#include <QString>
#include <QFile>
#include <QDir>
#include <QTextStream>
#include <QDebug>

int main(int argc, char *argv[])
{
	QCoreApplication app(argc, argv);

	// prepare the message
	QString message("Hello World!");
	
	// prepare a file in the users home directory named out.txt
	QFile file(QDir::home().absoluteFilePath("out.txt"));
	
	// try to open the file in write mode
	if(!file.open(QIODevice::WriteOnly)) {
		qWarning() << "Can not open file with write access";
		return -1;
	}
	
	// as we handle text we need to use proper text codecs
	QTextStream stream(&file);
	
	// write message to file via the text stream
	stream << message;

	// do not start the eventloop as this would wait for extern
	// app.exec();
	// no need to close file, closes automatically when scope e
	return 0;
}
```

Пример демонстрирует использование доступа к файлам и запись текста в файл с помощью текстовых кодеков, используя текстовый поток. Для двоичных данных существует кроссплатформенный двоичный поток [[QDataStream|QDataStream]] , который заботится о концевых значениях и других деталях. Различные классы, которые мы используем, включаются в файл с помощью имени класса в верхней части файла. Вы также можете включить классы, используя имя модуля и класса, например, `#include <QtCore/QFile>`. Для ленивых есть возможность включить все классы из модуля с помощью команды `#include <QtCore>`. Например, в `QtCore` находятся наиболее распространенные классы, используемые в приложении и не связанные с пользовательским интерфейсом. Посмотрите список классов QtCore (http://doc.qt.io/qt-5/qtcore-module.html) или обзор QtCore (http://doc.qt.io/qt-5/qtcore-index.html) .

Сборка приложения выполняется с помощью `CMake` и `make`.` CMake` считывает файл проекта,` CMakeLists.txt`, и генерирует `Makefile`, который используется для сборки приложения. `CMake` поддерживает и другие системы сборки, например, `ninja`. Файл проекта не зависит от платформы, и `CMake` имеет некоторые правила для применения специфических для платформы настроек к генерируемому makefile. Проект также может содержать платформенные диапазоны для правил, специфичных для конкретной платформы, которые требуются в некоторых специфических случаях.

Ниже приведен пример простого файла проекта, сгенерированного Qt Creator. Обратите внимание, что Qt пытается создать файл, совместимый как с `Qt 5`, так и с `Qt 6`, а также с различными платформами, такими как Android, OS X и т.д.

```c++
cmake_minimum_required(VERSION 3.14)
project(projectname VERSION 0.1 LANGUAGES CXX)

set(CMAKE_INCLUDE_CURRENT_DIR ON)
set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# QtCreator supports the following variables for Android, which
# Check https://doc.qt.io/qt/deployment-android.html for more i
# They need to be set before the find_package(...) calls below.

#if(ANDROID)
# set(ANDROID_PACKAGE_SOURCE_DIR "${CMAKE_CURRENT_SOURCE_DIR
# if (ANDROID_ABI STREQUAL "armeabi-v7a")
# set(ANDROID_EXTRA_LIBS
# ${CMAKE_CURRENT_SOURCE_DIR}/path/to/libcrypto.so
# ${CMAKE_CURRENT_SOURCE_DIR}/path/to/libssl.so)
# endif()
#endif()

find_package(QT NAMES Qt6 Qt5 COMPONENTS Core Quick REQUIRED)
find_package(Qt${QT_VERSION_MAJOR} COMPONENTS Core Quick REQUIR

set(PROJECT_SOURCES
		main.cpp
		qml.qrc
)

if(${QT_VERSION_MAJOR} GREATER_EQUAL 6)
	qt_add_executable(projectname
	MANUAL_FINALIZATION
	${PROJECT_SOURCES}
)
else()
	add_executable(projectname
		${PROJECT_SOURCES}
)
 	endif()
endif()
//-----------------------------------
			 
target_compile_definitions(projectname
	PRIVATE $<$<OR:$<CONFIG:Debug>,$<CONFIG:RelWithDebInfo>>:QT_Q

target_link_libraries(projectname PRIVATE Qt${QT_VERSION_MAJOR}::Core Qt${QT_VERSION_MAJOR}::Qu::Core Qt${QT_VERSION_MAJOR}::Qu

set_target_properties(projectname PROPERTIES
	MACOSX_BUNDLE_GUI_IDENTIFIER my.example.com
	MACOSX_BUNDLE_BUNDLE_VERSION ${PROJECT_VERSION}
	MACOSX_BUNDLE_SHORT_VERSION_STRING ${PROJECT_VERSION_MAJOR}
)
					  
if(QT_VERSION_MAJOR EQUAL 6)
	qt_import_qml_plugins(projectname)
	qt_finalize_executable(projectname)
endif()
```

Мы не будем углубляться в глубины этого файла. Просто запомните, что Qt использует файлы `CMakeLists.txt` для генерации специфических для платформы make-файлов, которые затем используются для сборки проекта. В разделе "Система сборки" мы рассмотрим более простые, рукописные файлы CMake. 

Приведенный выше пример просто записывает текст и выходит из приложения. Для инструмента командной строки этого достаточно. Для пользовательского интерфейса необходим цикл событий, который ожидает ввода пользователя и каким-то образом планирует операции рисования. Ниже приведен тот же пример, но теперь для запуска записи используется кнопка.

Наш `main.cpp` удивительным образом стал меньше. Мы перенесли код в отдельный класс, чтобы иметь возможность использовать сигналы и слоты Qt для пользовательского ввода, т.е. для обработки щелчок по кнопке. Механизм сигналов и слотов обычно требует наличия экземпляра объекта, как вы увидите в ближайшее время, но он также может быть использован с ламбдами языка Си++.

```c++
#include <QtCore>
#include <QtGui>
#include <QtWidgets>
#include "mainwindow.h"

int main(int argc, char** argv)
{
	QApplication app(argc, argv);
	MainWindow win;
	win.resize(320, 240);
	win.setVisible(true);
	
	return app.exec();
}
```

В функции `main` мы создаем объект приложения - окно, а затем запускаем цикл событий с помощью функции `exec()`. Пока что приложение находится в цикле событий и ожидает ввода данных пользователем.

```c++
int main(int argc, char** argv)
{
	QApplication app(argc, argv); // init application
		// create the ui
	return app.exec(); // execute event loop
}
```

Используя Qt, можно создавать пользовательские интерфейсы как на QML, так и на `Widgets`. В этой книге мы сосредоточимся на QML, но в этой главе мы рассмотрим виджеты. Это позволяет Мы создаем программу только на языке C++.

```c++
#ifndef MAINWINDOW_H
#define MAINWINDOW_H
#include <QtWidgets>

class MainWindow : public QMainWindow
{
	public:
		MainWindow(QWidget* parent=0);
		~MainWindow();

	public slots:
		void storeContent();

	private:
		QPushButton *m_button;
};
#endif // MAINWINDOW_H
```

Кроме того, мы определяем публичный слот `storeContent()` в пользовательской секции заголовочного файла. Слоты могут быть `public`, `protected` или `private` и могут вызываться так же, как и любой другой метод класса. Вы также можете встретить секцию `signals` с набором сигнатур сигналов. Эти методы должны не вызываются и не должны быть реализованы. Как сигналы, так и слоты обрабатываются метаинформационной системой Qt и могут быть интроспективно обнаружены и динамически вызваны во время выполнения программы.

Назначение слота `storeContent()` состоит в том, чтобы он вызывался при нажатии на кнопку. Давайте сделаем так, чтобы это произошло!

```c++
#include "mainwindow.h

MainWindow::MainWindow(QWidget *parent)
: QMainWindow(parent)
{
	m_button = new QPushButton("Store Content", this);
	setCentralWidget(m_button);
	connect(m_button, &QPushButton::clicked, this, &MainWindow:
}
//===============

MainWindow::~MainWindow()
{}
//===============

void MainWindow::storeContent()
{
	qDebug() << "... store content";
	QString message("Hello World!");
	
	QFile file(QDir::home().absoluteFilePath("out.txt"));
	if(!file.open(QIODevice::WriteOnly)) {
		qWarning() << "Can not open file with write access";
		return;
	}
	
	QTextStream stream(&file);
	stream << message;
}
```

В главном окне мы сначала создаем кнопку, а затем регистрируем сигнал `clicked()` в слоте `storeContent()` с помощью метода `connect`. Каждый раз, когда раздается сигнал `clicked`, вызывается слот `storeContent()`. И теперь связь между двумя объектами осуществляется через сигналы и слоты, несмотря на то, что они не знают друг о друге. Это называется свободной связью и становится возможным благодаря использованию базового класса `QObject`, от которого происходит большинство классов Qt.

























