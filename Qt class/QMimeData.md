# QMimeData

Перемещаемые данные и сведения о MIME-типе должны быть представлены классом `QMimeData`. Экземпляр этого класса необходимо передать в метод `setMimeData()` класса [[QDrag|QDrag]]. Создание экземпляра класса `QMimeData` выглядит так:

```c++
// #include <QMimeData>
QMimeData *data = new QMimeData();
```

Класс `QMimeData` содержит следующие методы (перечислены только основные
методы; полный список смотрите в документации по классу `QMimeData`):

> **setText()** — устанавливает текстовые данные (MIME-тип — text/plain). Прототип метода:
```c++
void setText(const QString &text)
```
> Пример указания значения:
```c++
data->setText("Перетаскиваемый текст");
```

> **text()** — возвращает текстовые данные (MIME-тип — text/plain). Прототип метода:
```c++
QString text() const
```

> **hasText()** — возвращает значение `true`, если объект содержит текстовые данные (MIME-тип — text/plain), и `false` — в противном случае. Прототип метода:
```c++
bool hasText() const
```

> **setHtml()** — устанавливает текстовые данные в формате HTML (MIME-тип — text/html). Прототип метода:
```c++
void setHtml(const QString &html)
```
> Пример указания значения:
```c++
data->setHtml("<b>Перетаскиваемый HTML-текст</b>");
```

> **html()** — возвращает текстовые данные в формате HTML (MIME-тип — text/html). Прототип метода:
```c++
QString html() const
```

> **hasHtml()** — возвращает значение `true`, если объект содержит текстовые данные в формате HTML (MIME-тип — text/html), и `false` — в противном случае. Прототип метода:
```c++
bool hasHtml() const
```

> **setUrls()** — устанавливает список URI-адресов (MIME-тип — text/uri-list). В качестве значения указывается список с экземплярами класса [[QUrl|QUrl]]. С помощью этого MIME-типа можно обработать перетаскивание файлов. Прототип метода:
```c++
void setUrls(const QList<QUrl> &urls)
```
> Пример указания значения:
```c++
QList<QUrl> list;
list << QUrl("http://google.ru/");
data->setUrls(list);
```

> **urls()** — возвращает список URI-адресов (MIME-тип — text/uri-list). Прототип метода:
```c++
QList<QUrl> urls() const
```
> Пример получения первого URI-адреса:
```c++
setText(e->mimeData()->urls()[0].toString());
```

> **hasUrls()** — возвращает значение `true`, если объект содержит список URI-адресов (MIME-тип — text/uri-list), и `false` — в противном случае. Прототип метода:
```c++
bool hasUrls() const
```

> **setImageData()** — устанавливает изображение (MIME-тип — image/*). В качестве значения можно указать, например, экземпляр класса [[QImage|QImage]] или [[QPixmap|QPixmap]]. Прототип метода:
```c++
void setImageData(const QVariant &image)
```
Пример указания значения:
```c++
data->setImageData(QImage("C:\\cpp\\projectsQt\\Test\\pixmap.png"));
```

> **imageData()** — возвращает объект изображения. Прототип метода:
```c++
QVariant imageData() const
```
> Пример:
```c++
QImage image = qvariant_cast<QImage>(e->mimeData()->imageData());
setPixmap(QPixmap::fromImage(image));
```

> **hasImage()** — возвращает значение `true`, если объект содержит изображение (MIME-тип — image), и `false` — в противном случае. Прототип метода:
```c++
bool hasImage() const
```

> **setData()** — позволяет установить данные пользовательского MIME-типа. В первом параметре указывается MIME-тип в виде строки, а во втором параметре — экземпляр класса [[QByteArray|QByteArray]] с данными. Метод можно вызвать несколько раз с различными MIME-типами. Прототип метода:
```c++
void setData(const QString &mimeType, const QByteArray &data
```

> **data()** — возвращает экземпляр класса [[QByteArray|QByteArray]] с данными, соответствующими указанному MIME-типу. Прототип метода:
```c++
QByteArray data(const QString &mimeType) const
```

> **hasFormat()** — возвращает значение `true`, если объект содержит данные в указанном MIME-типе, и `false` — в противном случае. Прототип метода:
```c++
virtual bool hasFormat(const QString &mimeType) const
```

> **formats()** — возвращает список с поддерживаемыми объектом MIME-типами. Прототип метода:
```c++
virtual QStringList formats() const
```

> **removeFormat()** — удаляет данные, соответствующие указанному MIME-типу.
Прототип метода:
```c++
void removeFormat(const QString &mimeType)
```

> **clear()** — удаляет все данные и информацию о MIME-типе. Прототип метода:
```c++
void clear()
```

Если необходимо перетаскивать данные какого-либо специфического типа, то нужно наследовать класс QMimeData и переопределить методы retrieveData() и
formats(). За подробной информацией по этому вопросу обращайтесь к докумен-
тации.


