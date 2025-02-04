
# Окно для вывода сообщения об ошибке

Класс `QErrorMessage` реализует немодальное диалоговое окно для вывода сообщения об ошибке (рис.). Окно содержит текстовое поле, в которое можно вставить текст сообщения об ошибке, и флажок. Если пользователь снимает флажок, то окно больше отображаться не будет. Иерархия наследования для класса `QErrorMessage` выглядит так:
```
(QObject, QPaintDevice) — QWidget — QDialog — QErrorMessage
```

![[gui_9.png]]

Формат конструктора класса `QErrorMessage`:
```c++
#include <QErrorMessage>

QErrorMessage(QWidget *parent = nullptr)
```

Для отображения окна предназначен метод `showMessage()`. Метод является слотом. Прототипы метода:
```c++
void showMessage(const QString &message)
void showMessage(const QString &message, const QString &type)
```
