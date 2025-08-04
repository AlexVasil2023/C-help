# CMake

**CMake** - это инструмент, созданный компанией Kitware. Компания Kitware известна своим программным обеспечением для 3D-визуализации VTK, а также `CMake`, кроссплатформенным генератором `makefile`. Он использует серию файлов для генерации make-файлов, специфичных для конкретной платформы. `CMake` используется в проекте KDE и, соответственно, имеет особые отношения с сообществом Qt и, начиная с версии 6, является предпочтительным способом сборки проектов Qt.

[[CMakeLists.txt|CMakeLists.txt]] - это файл, используемый для хранения конфигурации проекта. Для простого hello world, использующего Qt Core, файл проекта будет выглядеть следующим образом:

```sh
// ensure cmake version is at least 3.16.0
cmake_minimum_required(VERSION 3.16.0)

// определяет проект с версией project(foundation_tests
VERSION 1.0.0 LANGUAGES CXX)

// выбираем используемый стандарт C++, в данном случае
C++17 set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

// указать CMake на автоматический запуск Qt-инструментов moc, rcc и
uic set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

// настраиваем модули Qt 6 core и test
find_package(Qt6 COMPONENTS Core REQUIRED)
find_package(Qt6 COMPONENTS Test REQUIRED)

// определить исполняемый файл, собранный из исходного файла
add_executable(foundation_tests
tst_foundation.cpp
)

// указываем cmake, что нужно связать исполняемый файл с ядром Qt 6 и
тестом target_link_libraries(foundation_tests PRIVATE Qt6::Core Qt6::T
```

В результате будет создан исполняемый файл `foundations_tests`,
использующий `tst_foundation.cpp` и установить связь с библиотеками `Core` и `Test` из
Qt 6. 

`CMake` - мощный, но сложный инструмент, и требуется некоторое время, чтобы привыкнуть к его синтаксису. `CMake` очень гибкий инструмент, и в больших и сложных проектах он проявляет себя с лучшей стороны.









