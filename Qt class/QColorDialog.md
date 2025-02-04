
# Окно для выбора цвета

Окно для выбора цвета (рис. ) реализуется с помощью статического метода `getColor() `из класса `QColorDialog`. 

![[gui_7.png]]

Прототип метода:
```c++
#include <QColorDialog>

static QColor getColor(const QColor &initial = Qt::white,
		QWidget *parent = nullptr, const QString &title = QString(),
		QColorDialog::ColorDialogOptions options = ColorDialogOptions())
```

В параметре `parent` передается указатель на родительское окно или нулевой указатель. Параметр `initial` задает начальный цвет. В параметре `options` могут быть указаны следующие константы (или их комбинация):

> **QColorDialog::ShowAlphaChannel** — пользователь может выбрать значение альфа- канала;
> 
> **QColorDialog::NoButtons** — кнопки `OK` и `Cancel` не отображаются;
> 
> **QColorDialog::DontUseNativeDialog**.

Метод возвращает экземпляр класса [[QColor|QColor]]. Если пользователь нажимает кнопку `Cancel`, то объект будет невалидным. Пример:
```c++
QColor color = QColorDialog::getColor(QColor(255, 0, 0), this,
				"Заголовок окна", QColorDialog::ShowAlphaChannel);

if (color.isValid()) {
	qDebug() << color.red() << color.green() << color.blue() << color.alpha();
}
```

