# QMainWindow

Класс `QMainWindow` реализует главное окно приложения, содержащее меню, панели инструментов, прикрепляемые панели, центральный компонент и строку состояния. Иерархия наследования для класса `QMainWindow` выглядит так:
```
(QObject, QPaintDevice) — QWidget — QMainWindow
```

Конструктор класса `QMainWindow` имеет следующий формат:

```c++
#include <QMainWindow>
QMainWindow(QWidget *parent = nullptr, Qt::WindowFlags flags = Qt::WindowFlags())
```

В параметре `parent` передается указатель на родительское окно. Какие именно значения можно указать в параметре `flags`, [[QWidget#Указание типа окна|см.]].












