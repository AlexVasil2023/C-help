
# Окно для выбора шрифта

Окно для выбора шрифта реализуется с помощью статического метода `getFont()` из класса `QFontDialog`. Прототипы метода:
```c++
#include <QFontDialog>
static QFont getFont(bool *ok, QWidget *parent = nullptr)
static QFont getFont(bool *ok, const QFont &initial,
		QWidget *parent = nullptr, const QString &title = QString(),
		QFontDialog::FontDialogOptions options = FontDialogOptions())
```

В параметре `parent` передается указатель на родительское окно или нулевой указатель. Параметр `initial` задает начальный шрифт. В параметре `options` могут быть указаны константы `NoButtons`, `DontUseNativeDialog` и др. Статус операции доступен через параметр `ok` (переменная будет иметь значение `true`, если шрифт был выбран). Метод возвращает экземпляр класса [[QFont#QFont|QFont]] с выбранным шрифтом. Пример:
```c++
bool ok;
QFont font = QFontDialog::getFont(&ok, QFont("Tahoma", 16),
			this, "Заголовок окна");

if (ok) {
	qDebug() << font.family() << font.pointSize();
}
```

Результат выполнения этого кода показан на рис.

![[gui_8.png]]

