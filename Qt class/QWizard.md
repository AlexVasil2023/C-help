
# Класс QWizard

Класс `QWizard` реализует набор страниц, отображаемых последовательно или в произвольном порядке. Иерархия наследования для класса `QWizard` выглядит так:
```
(QObject, QPaintDevice) — QWidget — QDialog — QWizard
```

Формат конструктора класса `QWizard`:
```c++
#include <QWizard>

QWizard(QWidget *parent = nullptr, Qt::WindowFlags flags = Qt::WindowFlags())
```

Класс `QWizard` наследует все методы из базовых классов и содержит следующие дополнительные методы (перечислены только основные методы; полный список смотрите в документации):

> **addPage()** — добавляет страницу в конец мастера и возвращает ее идентификатор. Прототип метода:
```c++
int addPage(QWizardPage *page)
```

> **setPage()** — добавляет страницу в указанную позицию. Прототип метода:
```c++
void setPage(int id, QWizardPage *page)
```

> **removePage()** — удаляет страницу с указанным идентификатором. Прототип метода:
```c++
void removePage(int id)
```

> **page()** — возвращает указатель на страницу (экземпляр класса [[QWizardPage|QWizardPage]]), соответствующую указанному идентификатору, или нулевой указатель, если страницы не существует. Прототип метода:
```c++
QWizardPage *page(int id) const
```

> **pageIds()** — возвращает список с идентификаторами страниц. Прототип метода:
```c++
QList<int> pageIds() const
```

> **currentId()** — возвращает идентификатор текущей страницы. Прототип метода:
```c++
int currentId() const
```

> **currentPage()** — возвращает указатель на текущую страницу (экземпляр класса [[QWizardPage|QWizardPage]]) или нулевой указатель, если страницы не существует. Прототип метода:
```c++
QWizardPage *currentPage() const
```

> **setStartId()** — задает идентификатор начальной страницы. Прототип метода:
```c++
void setStartId(int id)
```

> **startId()** — возвращает идентификатор начальной страницы. Прототип метода:
```c++
int startId() const
```

> **visitedIds()** — возвращает список с идентификаторами посещенных страниц или пустой список. Прототип метода:
```c++
QList<int> visitedIds() const
```

> **hasVisitedPage()** — возвращает значение `true`, если страница была посещена, и `false` — в противном случае. Прототип метода:
```c++
bool hasVisitedPage(int id) const
```

> **back()** — имитирует нажатие кнопки `Back`. Метод является слотом. Прототип метода:
```c++
void back()
```

> **next()** — имитирует нажатие кнопки `Next`. Метод является слотом. Прототип метода:
```c++
void next()
```

> **restart()** — перезапускает мастера. Метод является слотом. Прототип метода:
```c++
void restart()
```

> **nextId()** — этот метод следует переопределить в классе, наследующем класс `QWizard`, если необходимо изменить порядок отображения страниц. Метод вызывается при нажатии кнопки `Next`. Метод должен возвращать идентификатор следующей страницы или значение –1. Прототип метода:
```c++
virtual int nextId() const
```

> **initializePage()** — этот метод следует переопределить в классе, наследующем класс `QWizard`, если необходимо производить настройку свойств компонентов на основе данных, введенных на предыдущих страницах. Метод вызывается при нажатии кнопки `Next` на предыдущей странице, но до отображения следующей страницы. Если установлена опция `IndependentPages`, то метод вызывается только при первом отображении страницы. Прототип метода:
```c++
virtual void initializePage(int id)
```

> **cleanupPage()** — этот метод следует переопределить в классе, наследующем класс `QWizard`, если необходимо контролировать нажатие кнопки `Back`. Метод вызывается при нажатии кнопки `Back` на текущей странице, но до отображения предыдущей страницы. Если установлена опция `IndependentPages`, то метод не вызывается. Прототип метода:
```c++
virtual void cleanupPage(int id)
```

> **validateCurrentPage()** — этот метод следует переопределить в классе, наследующем класс `QWizard`, если необходимо производить проверку данных, введенных на текущей странице. Метод вызывается при нажатии кнопки `Next` или `Finish`. Метод должен возвратить значение `true`, если данные корректны, и `false` — в противном случае. Если метод возвращает значение `false`, то переход на следующую страницу не производится. Прототип метода:
```c++
virtual bool validateCurrentPage()
```

> **setField()** — устанавливает значение указанного свойства. Создание свойства производится с помощью метода `registerField()` из класса [[QWizardPage|QWizardPage]]. С помощью этого метода можно изменять значения компонентов, расположенных на разных страницах мастера. Прототип метода:
```c++
void setField(const QString &name, const QVariant &value)
```

> **field()** — возвращает значение указанного свойства. Создание свойства производится с помощью метода `registerField()` из класса [[QWizardPage|QWizardPage]]. С помощью этого метода можно получить значения компонентов, расположенных на разных страницах мастера. Прототип метода:
```c++
QVariant field(const QString &name) const
```

> **setWizardStyle()** — задает стилевое оформление мастера. Прототип метода:
```c++
void setWizardStyle(QWizard::WizardStyle style)
```

В качестве параметра указываются следующие константы:
* **QWizard::ClassicStyle**;
* **QWizard::ModernStyle**;
* **QWizard::MacStyle**;
* **QWizard::AeroStyle;**

> **setTitleFormat()** — задает формат отображения названия страницы. Прототип метода:
```c++
void setTitleFormat(Qt::TextFormat format)
```

В качестве параметра указываются следующие константы:
* **Qt::PlainText** — простой текст;
* **Qt::RichText** — форматированный текст;
* **Qt::AutoText** — автоматическое определение (режим по умолчанию). Если текст содержит теги, то используется режим `RichText`, в противном случае — режим `PlainText`;

> **setSubTitleFormat()** — задает формат отображения описания страницы. Допустимые значения см. в описании метода setTitleFormat(). Прототип метода:
```c++
void setSubTitleFormat(Qt::TextFormat format)
```

> **setButton()** — добавляет кнопку для указанной роли. Прототип метода:
```c++
void setButton(QWizard::WizardButton which, QAbstractButton *button)
```

В первом параметре указываются следующие константы:
* **QWizard::BackButton** — кнопка `Back`;
* **QWizard::NextButton** — кнопка `Next`;
* **QWizard::CommitButton** — кнопка `Commit`;
* **QWizard::FinishButton** — кнопка `Finish`;
* **QWizard::CancelButton** - кнопка `Cancel` (если установлена опция `NoCancelButton`, то кнопка не отображается);
* **QWizard::HelpButton** — кнопка `Help` (чтобы отобразить кнопку, необходимо установить опцию `HaveHelpButton`);
* **QWizard::CustomButton1** — первая пользовательская кнопка (чтобы отобразить кнопку, необходимо установить опцию `HaveCustomButton1`);
* **QWizard::CustomButton2** — вторая пользовательская кнопка (чтобы отобразить кнопку, необходимо установить опцию `HaveCustomButton2`);
* **QWizard::CustomButton3** — третья пользовательская кнопка (чтобы отобразить кнопку, необходимо установить опцию `HaveCustomButton3`);

> **button()** — возвращает указатель на кнопку с заданной ролью. Прототип метода:
```c++
QAbstractButton *button(QWizard::WizardButton which) const
```

> **setButtonText()** — устанавливает текст надписи для кнопки с указанной ролью. Прототип метода:
```c++
void setButtonText(QWizard::WizardButton which, const QString &text)
```

> **buttonText()** — возвращает текст надписи кнопки с указанной ролью. Прототип метода:
```c++
QString buttonText(QWizard::WizardButton which) const
```

> **setButtonLayout()** — задает порядок отображения кнопок. В качестве параметра указывается список с ролями кнопок. Список может также содержать значение константы `Stretch`, которая задает фактор растяжения. Прототип метода:
```c++
void setButtonLayout(const QList<QWizard::WizardButton> &layout)
```

> **setPixmap()** — добавляет изображение для указанной роли. Прототип метода:
```c++
void setPixmap(QWizard::WizardPixmap which, const QPixmap &pixmap)
```

В первом параметре указываются следующие константы:
* **QWizard::WatermarkPixmap** — изображение, которое занимает всю левую сторону при использовании стилей `ClassicStyle` или `ModernStyle`;
* **QWizard::LogoPixmap** — небольшое изображение, отображаемое в правой части заголовка при использовании стилей `ClassicStyle` или `ModernStyle`;
* **QWizard::BannerPixmap** — фоновое изображение, отображаемое в заголовке страницы при использовании стиля `ModernStyle`;
* **QWizard::BackgroundPixmap** — фоновое изображение при использовании стиля `MacStyle`;

> **setOption()** — если во втором параметре указано значение `true`, то производит установку опции, указанной в первом параметре, а если указано значение `false`, то сбрасывает опцию. Прототип метода:
```c++
void setOption(QWizard::WizardOption option, bool on = true)
```

В первом параметре указываются следующие константы:
* **QWizard::IndependentPages** — страницы не зависят друг от друга. Если опция установлена, то метод `initializePage()` будет вызван только при первом отображении страницы, а метод `cleanupPage()` не вызывается;
* **QWizard::IgnoreSubTitles** — не отображать описание страницы в заголовке;
* **QWizard::ExtendedWatermarkPixmap**;
* **QWizard::NoDefaultButton** — не делать кнопки `Next` и `Finish` кнопками по умолчанию;
* **QWizard::NoBackButtonOnStartPage** — не отображать кнопку `Back` на стартовой странице;
* **QWizard::NoBackButtonOnLastPage** — не отображать кнопку `Back` на последней странице;
* **QWizard::DisabledBackButtonOnLastPage** — сделать кнопку `Back` неактивной на последней странице;
* **QWizard::HaveNextButtonOnLastPage** — показать неактивную кнопку `Next` на последней странице;
* **QWizard::HaveFinishButtonOnEarlyPages** — показать неактивную кнопку `Finish` на не последних страницах;
* **QWizard::NoCancelButton** — не отображать кнопку `Cancel`;
* **QWizard::CancelButtonOnLeft** — поместить кнопку **Cancel** слева от кнопки `Back` (по умолчанию кнопка расположена справа от кнопок `Next` и `Finish`);
* **QWizard::HaveHelpButton** — показать кнопку `Help`;
* **QWizard::HelpButtonOnRight** — поместить кнопку `Help` у правого края окна;
* **QWizard::HaveCustomButton1** — показать пользовательскую кнопку с ролью `CustomButton1`;
* **QWizard::HaveCustomButton2** — показать пользовательскую кнопку с ролью **CustomButton2**;
* **QWizard::HaveCustomButton3** — показать пользовательскую кнопку с ролью **CustomButton3**;
* **QWizard::NoCancelButtonOnLastPage** — не отображать кнопку `Cancel` на последней странице;

> **setOptions()** — устанавливает несколько опций. Прототип метода:
```c++
void setOptions(QWizard::WizardOptions options)
```

Класс `QWizard` содержит следующие сигналы:

> **currentIdChanged(int)** — генерируется при изменении текущей страницы. Внутри обработчика через параметр доступен идентификатор текущей страницы;
> 
> **customButtonClicked(int)** — генерируется при нажатии кнопок с ролями `CustomButton1`, `CustomButton2` и `CustomButton3`;
> 
> **helpRequested()** — генерируется при нажатии кнопки `Help`;
> 
> **pageAdded(int)** — генерируется при добавлении страницы;
> 
> **pageRemoved(int)** — генерируется при удалении страницы.
