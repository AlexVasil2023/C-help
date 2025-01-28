
[[#QGraphicsEffect]]
1. [[#Класс QGraphicsEffect|Класс QGraphicsEffect]] 9.6.1
2. [[#Тень (QGraphicsDropShadowEffect)|Тень (QGraphicsDropShadowEffect)]] 9.6.2
3. [[#Размытие (QGraphicsBlurEffect)|Размытие (QGraphicsBlurEffect)]] 9.6.3
4. [[#Изменение цвета (QGraphicsColorizeEffect)|Изменение цвета (QGraphicsColorizeEffect)]] 9.6.4
5. [[#Изменение прозрачности (QGraphicsOpacityEffect)|Изменение прозрачности (QGraphicsOpacityEffect)]] 9.6.5
6. 
7. 

# QGraphicsEffect

К графическим объектам можно применить различные эффекты, например: изменить прозрачность или цвет, отобразить тень или сделать объект размытым. Наследуя класс `QGraphicsEffect` и переопределяя метод `draw()`, можно создать свой эффект.

Для установки эффекта и получения указателя на него предназначены следующие методы из класса `QGraphicsItem`:

> **setGraphicsEffect()** — устанавливает эффект. Прототип метода:
```c++
void setGraphicsEffect(QGraphicsEffect *effect)
```

> **graphicsEffect()** — возвращает указатель на эффект или нулевой указатель, если эффект не был установлен. Прототип метода:
```c++
QGraphicsEffect *graphicsEffect() const
```

## Класс QGraphicsEffect

Класс `QGraphicsEffect` является базовым классом для всех эффектов. Иерархия наследования выглядит так:
```
QObject — QGraphicsEffect
```

Формат конструктора класса:
```c++
#include <QGraphicsEffect>

QGraphicsEffect(QObject *parent = nullptr)
```

Класс `QGraphicsEffect` содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **draw()** — производит рисование эффекта. Этот абстрактный метод должен быть переопределен в производных классах. Прототип метода:
```c++
virtual void draw(QPainter *painter) = 0
```

> **setEnabled()** — если в качестве параметра указано значение `false`, то эффект отключен. Значение `true` разрешает использование эффекта. Метод является слотом. Прототип метода:
```c++
void setEnabled(bool enable)
```

> **isEnabled()** — возвращает значение `true`, если эффект разрешено использовать, и `false` — в противном случае. Прототип метода:
```c++
bool isEnabled() const
```

> update() — вызывает перерисовку эффекта. Метод является слотом. Прототип метода:
```c++
void update()
```

Класс `QGraphicsEffect` содержит сигнал `enabledChanged(bool)`, который генерируется при изменении статуса эффекта. Внутри обработчика через параметр доступно значение `true`, если эффект разрешено использовать, и `false` — в противном случае.

## Тень (QGraphicsDropShadowEffect)

см. [[QGraphicsDropShadowEffect|Тень (QGraphicsDropShadowEffect)]]

## Размытие (QGraphicsBlurEffect)

см. [[QGraphicsBlurEffect#Размытие(QGraphicsBlurEffect)|Размытие(QGraphicsBlurEffect)]]

## Изменение цвета (QGraphicsColorizeEffect)

см. [[QGraphicsColorizeEffect#Изменение цвета (QGraphicsColorizeEffect)|Изменение цвета (QGraphicsColorizeEffect)]]

##  Изменение прозрачности (QGraphicsOpacityEffect)

см. [[QGraphicsOpacityEffect#Изменение прозрачности (QGraphicsOpacityEffect)|Изменение прозрачности (QGraphicsOpacityEffect)]]

