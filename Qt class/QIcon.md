# QIcon

Класс `QIcon` описывает значки в различных размерах, режимах и состояниях. Обратите внимание на то, что класс `QIcon` не наследует класс [[QPaintDevice|QPaintDevice]], следовательно, мы не можем использовать его как поверхность для рисования. Форматы конструктора:
```c++
#include <QIcon>

QIcon()
QIcon(const QString &fileName)
QIcon(const QPixmap &pixmap)
QIcon(QIconEngine *engine)
QIcon(const QIcon &other)
QIcon(QIcon &&other)
```

Первый конструктор создает нулевой объект значка. Второй конструктор предназначен для загрузки значка из файла. Обратите внимание на то, что файл загружается при первой попытке использования, а не сразу. Третий конструктор создает значок на основе экземпляра класса [[QPixmap|QPixmap]].

Класс `QIcon` содержит следующие методы (перечислены только основные методы; полный список смотрите в документации):

> **isNull()** — возвращает значение `true`, если объект является нулевым, и `false` — в противном случае. Прототип метода:
```c++
bool isNull() const
```

> **addFile()** — добавляет значок для указанного размера, режима и состояния. Можно добавить несколько значков, вызывая метод с разными значениями параметров. Параметр `size` задает размер значка (с помощью экземпляра класса [[QSize|QSize]]). Так как загрузка значка производится при первой попытке использования, заранее размер значка неизвестен. В параметре mode можно указать следующие константы: `QIcon::Normal`, `QIcon::Disabled`, `QIcon::Active` или `QIcon::Selected`. В параметре `state` указываются константы `QIcon::Off` или `QIcon::On`. Прототип метода:
```c++
void addFile(const QString &fileName,
						const QSize &size = QSize(), QIcon::Mode mode = Normal,
						QIcon::State state = Off)
```

> **addPixmap()** — добавляет значок для указанного режима и состояния. Значок загружается из экземпляра класса [[QPixmap|QPixmap]]. Прототип метода:
```c++
void addPixmap(const QPixmap &pixmap, QIcon::Mode mode = Normal,
											QIcon::State state = Off)
```

> **availableSizes()** — возвращает доступные размеры (список с экземплярами класса [[QSize|QSize]]) значков для указанного режима и состояния. Прототип метода:
```c++
QList<QSize> availableSizes(QIcon::Mode mode = Normal,
											QIcon::State state = Off) const
```

> **actualSize()** — возвращает фактический размер (экземпляр класса [[QSize|QSize]]) для указанного размера, режима и состояния. Фактический размер может быть меньше размера, указанного в первом параметре, но не больше. Прототип метода:
```c++
QSize actualSize(const QSize &size, QIcon::Mode mode = Normal,
											QIcon::State state = Off) const
```

> **pixmap()** — возвращает значок (экземпляр класса `QPixmap`), который примерно соответствует указанному размеру, режиму и состоянию. Прототипы метода:
```c++
QPixmap pixmap(int w, int h, QIcon::Mode mode = Normal,
					QIcon::State state = Off) const
QPixmap pixmap(const QSize &size, QIcon::Mode mode = Normal,
					QIcon::State state = Off) const
QPixmap pixmap(int extent, QIcon::Mode mode = Normal,
					QIcon::State state = Off) const
QPixmap pixmap(const QSize &size, qreal devicePixelRatio,
					QIcon::Mode mode = Normal, QIcon::State state = Off) const
```

Вместо загрузки значка из файла можно воспользоваться одним из встроенных значков. Загрузить стандартный значок позволяет следующий код:
```c++
// #include <QIcon>
// #include <QStyle>

QIcon ico = window.style()->standardIcon(QStyle::SP_MessageBoxCritical);
window.setWindowIcon(ico);
```

Посмотреть список всех встроенных значков можно в документации к классу [[QStyle|QStyle]].

