# QStackedWidget

Класс `QStackedWidget` также реализует стек компонентов, но создает новый компонент, а не контейнер, как [[QStackedLayout]]. Иерархия наследования выглядит так:
```
(QObject, QPaintDevice) — QWidget — QFrame — QStackedWidget
```

Создать экземпляр класса `QStackedWidget` позволяет следующий конструктор:
```c++
#include <QStackedWidget>
QStackedWidget(QWidget *parent = nullptr)
```

Класс `QStackedWidget` содержит методы `addWidget()`, `insertWidget()`, `removeWidget()`, `count()`, `currentIndex()`, `currentWidget()`, `widget()`, `setCurrentIndex()` и `setCurrentWidget()`, которые выполняют аналогичные действия, что и одноименные методы в классе [[QStackedLayout|QStackedLayout]]. Кроме того, класс `QStackedWidget` наследует все методы из базовых классов и содержит метод `indexOf()`, который возвращает индекс компонента, указатель на который указан в параметре. Прототип метода: 
```c++
int indexOf(const QWidget *widget) const
```

Чтобы отследить изменения внутри компонента, следует назначить обработчики сигналов `currentChanged(int)` и `widgetRemoved(int)`.










