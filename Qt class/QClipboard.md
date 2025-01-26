# QClipboard

для обмена данными между приложениями используется буфер обмена. Одно приложение помещает данные в буфер обмена,
а второе приложение (или то же самое) может извлечь их из буфера. Получить указатель на глобальный объект буфера обмена позволяет статический метод
`clipboard()` из класса [[QApplication|QApplication]]:
```c++
QClipboard *clipboard()
```

Пример получения текста из буфера обмена:
```c++
QString text = QApplication::clipboard()->text();
```

Класс `QClipboard` содержит следующие методы (перечислены только основные
методы; полный список смотрите в документации по классу `QClipboard`):

> **setText()** — копирует текст в буфер обмена. Прототип метода:
```c++
void setText(const QString &text, QClipboard::Mode mode = Clipboard)
```

> **text()** — возвращает текст из буфера обмена или пустую строку. Прототипы метода:
```c++
QString text(QClipboard::Mode mode = Clipboard) const
QString text(QString &subtype, QClipboard::Mode mode = Clipboard) const
```

> **setMimeData()** — позволяет сохранить в буфере данные любого типа. В качестве первого параметра указывается экземпляр класса [[QMimeData|QMimeData]]. Прототип метода:
```c++
void setMimeData(QMimeData *src, QClipboard::Mode mode = Clipboard)
```

> **mimeData()** — возвращает указатель на экземпляр класса [[QMimeData|QMimeData]]. Прототип метода:
```c++
const QMimeData *mimeData(QClipboard::Mode mode = Clipboard) const
```

> **clear()** — очищает буфер обмена. Прототип метода:
```c++
void clear(QClipboard::Mode mode = Clipboard)
```

В необязательном параметре `mode` могут быть указаны константы `Clipboard` (используется по умолчанию), `Selection` или `FindBuffer`.

Отследить изменение состояния буфера обмена позволяет сигнал `dataChanged()`. Назначить обработчик этого сигнала можно так:

```c++
connect(QApplication::clipboard(), SIGNAL(dataChanged()), this, 
								SLOT(on_change_clipboard()));
```

