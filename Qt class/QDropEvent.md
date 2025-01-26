# QDropEvent

Класс [[QDropEvent|QDropEvent]] содержит следующие методы:

> **mimeData()** — возвращает указатель на экземпляр класса [[QMimeData|QMimeData]] с перемещаемыми данными и информацией о MIME-типе. Прототип метода:
```c++
const QMimeData *mimeData() const
```

> **position()** — возвращает экземпляр класса [[QPoint#QPointF|QPointF]] с координатами сбрасывания объекта. Прототип метода:
```c++
QPointF position() const
```

> **possibleActions()** — возвращает комбинацию возможных действий при сбрасывании. Прототип метода:
```c++
Qt::DropActions possibleActions() const
```
> Пример определения значений:
```c++
if (e->possibleActions() & Qt::MoveAction) {
	qDebug() << "MoveAction";
}

if (e->possibleActions() & Qt::CopyAction) {
	qDebug() << "CopyAction";
}
```

> **proposedAction()** — возвращает действие по умолчанию при сбрасывании. Прототип метода:
```c++
Qt::DropAction proposedAction() const
```

> **acceptProposedAction()** — устанавливает флаг готовности принять перемещаемые данные и согласия с действием, возвращаемым методом `proposedAction()`. Метод `acceptProposedAction()` (или метод `accept()`) необходимо вызвать внутри метода `dragEnterEvent()`, иначе метод `dropEvent()` вызван не будет. Прототип метода:
```c++
void acceptProposedAction()
```

> **setDropAction()** — позволяет изменить действие при сбрасывании. После изменения действия следует вызвать метод `accept()`, а не `acceptProposedAction()`. Прототип метода:
```c++
void setDropAction(Qt::DropAction action)
```

> **dropAction()** — возвращает действие, которое должно быть выполнено при сбрасывании. Возвращаемое значение может не совпадать со значением, возвращаемым методом `proposedAction()`, если действие было изменено с помощью метода `setDropAction()`. Прототип метода:
```c++
Qt::DropAction dropAction() const
```

> **modifiers()** — позволяет определить, какие клавиши-модификаторы (`<Shift>`, `<Ctrl>`, `<Alt>` и др.) были нажаты вместе с кнопкой мыши. [[process signal and event#Нажатие и отпускание клавиши клавиатуры|Возможные значения]]. Прототип метода:
```c++
Qt::KeyboardModifiers modifiers() const
```

> **buttons()** — позволяет определить кнопки мыши, которые нажаты. Прототип метода:
```c++
Qt::MouseButtons buttons() const
```

> **source()** — возвращает указатель на компонент внутри приложения, являющийся источником события, или нулевой указатель. Прототип метода:
```c++
QObject *source() const
```


















