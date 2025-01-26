# Обработка сигналов и событий

При взаимодействии пользователя с окном происходят события. В ответ на события система генерирует определенные сигналы. **Сигналы** — это своего рода извещения системы о том, что пользователь выполнил какое-либо действие или в самой системе возникло некоторое условие. Сигналы являются важнейшей составляющей приложения с графическим интерфейсом, поэтому необходимо знать, как назначить обработчик сигнала, как удалить обработчик, а также уметь правильно обработать событие. Какие сигналы генерирует тот или иной компонент, мы будем рассматривать при изучении конкретного компонента.

## Назначение обработчиков сигналов

Чтобы обработать какой-либо сигнал, необходимо сопоставить ему метод класса, который будет вызван при наступлении события. Назначить обработчик позволяет статический метод `connect()` из класса [[QObject|QObject]] . Прототипы метода:
```c++
static QMetaObject::Connection connect(const QObject *sender, const char *signal, 
					const QObject *receiver, const char *method, 
					Qt::ConnectionType type = Qt::AutoConnection)

static QMetaObject::Connection connect(const QObject *sender,
					const QMetaMethod &signal, const QObject *receiver,
					const QMetaMethod &method,
					Qt::ConnectionType type = Qt::AutoConnection)
							
static QMetaObject::Connection connect(const QObject *sender,
					PointerToMemberFunction signal, const QObject *receiver,
					PointerToMemberFunction method,
					Qt::ConnectionType type = Qt::AutoConnection)
							
static QMetaObject::Connection connect(const QObject *sender,
					PointerToMemberFunction signal, Functor functor)

static QMetaObject::Connection connect(const QObject *sender,
					PointerToMemberFunction signal, const QObject *context,
					Functor functor, Qt::ConnectionType type = Qt::AutoConnection)
```

Кроме того, существует обычный (нестатический) метод `connect()`:
```c++
QMetaObject::Connection connect(const QObject *sender,
					const char *signal, const char *method,
					Qt::ConnectionType type = Qt::AutoConnection) const
```

Наиболее часто используются следующие форматы:
```c++
connect(<Объект1>, <Сигнал>, <Объект2>, <Слот>)
connect(<Объект1>, <Сигнал>, <Слот>)
```

При нажатии кнопки закроем окно:
```c++
QPushButton *button = new QPushButton("Закрыть окно", &window);

QObject::connect(button, SIGNAL(clicked()),
				&window, SLOT(close()));
```

Метод позволяет назначить обработчик сигнала `<Сигнал>`, возникшего при изменении статуса объекта `<Объект1>`. В первом параметре передается указатель на объект `<Объект1>`. В параметре `<Сигнал>` указывается результат выполнения макроса `SIGNAL()` . Формат макроса:
```c++
SIGNAL(<Название сигнала>([Тип параметров]))
```

Каждый компонент имеет определенный набор сигналов, например при щелчке по кнопке генерируется сигнал, имеющий следующий формат:
```c++
void clicked(bool checked = false)
```

Внутри круглых скобок могут быть указаны типы параметров, которые передаются в обработчик. Если параметров нет, то указываются только круглые скобки. Пример указания сигнала без параметров:
```c++
SIGNAL(clicked())
```

В этом случае обработчик не принимает никаких параметров. Указание сигнала с параметром выглядит следующим образом:
```c++
SIGNAL(clicked(bool))
```

В этом случае обработчик должен принимать один параметр, значение которого всегда будет равно `false`, т. к. это значение по умолчанию для сигнала `clicked()`.

В параметре `<Объект2>` передается указатель на объект, метод которого должен быть вызван. В параметре `<Сигнал>` указывается результат выполнения макроса `SLOT()`. Формат макроса:
```c++
SLOT(<Название слота>([Тип параметров]))
```

Пример слота без параметров:
```c++
SLOT(close()))
```

Пример слота с одним параметром:
```c++
SLOT(on_btn1_clicked(bool)))
```

Пользовательские слоты должны объявляться внутри объявления класса в секции:
```c++
<Модификатор доступа> slots:
```

Пример объявления закрытого слота внутри класса:
```c++
private slots:
	void on_btn1_clicked();
```

Создадим окно с двумя кнопками. Для кнопок назначим обработчики нажатия разными способами. Содержимое файла `widget.h`, `widget.cpp` и `main.cpp` ниже

```c++
widget.h

#ifndef WIDGET_H
#define WIDGET_H

#include <QApplication>
#include <QWidget>
#include <QPushButton>
#include <QVBoxLayout>

class Widget : public QWidget
{
	Q_OBJECT
	
	public:
		Widget(QWidget *parent=nullptr);
		~Widget();
		
	private slots:
		void on_btn1_clicked();
		void on_btn2_clicked(bool);
		
	private:
		QPushButton *btn1;
		QPushButton *btn2;
		QVBoxLayout *vbox;
};
#endif // WIDGET_H
```

```c++
widget.cpp

#include "widget.h"

Widget::Widget(QWidget *parent)
	: QWidget(parent)
{
	btn1 = new QPushButton("Кнопка 1");
	btn2 = new QPushButton("Кнопка 2");
	vbox = new QVBoxLayout();
	
	vbox->addWidget(btn1);
	vbox->addWidget(btn2);
	setLayout(vbox);
	
	connect(btn1, SIGNAL(clicked()), this, SLOT(on_btn1_clicked()));
	connect(btn2, SIGNAL(clicked(bool)), SLOT(on_btn2_clicked(bool)));
}

void Widget::on_btn1_clicked()
{
	qDebug() << "Нажата кнопка 1";
}

void Widget::on_btn2_clicked(bool a)
{
	qDebug() << "Нажата кнопка 2" << a;
}

Widget::~Widget() {}
```

```c++
main.cpp

#include "widget.h"

int main(int argc, char *argv[])
{
	QApplication app(argc, argv);
	
	Widget window;
	window.setWindowTitle("Назначение обработчиков сигналов");
	window.resize(350, 120);
	window.show();
	
	return app.exec();
}
```

Назначение обработчика для первой кнопки выглядит так:
```c++
connect(btn1, SIGNAL(clicked()), this, SLOT(on_btn1_clicked()));
```

Здесь мы воспользовались статическим методом `connect()`, хотя и получили доступ к нему, как к обычному методу класса. Класс [[QWidget|QWidget]] наследует класс [[QObject|QObject]], поэтому такая запись возможна. Иначе нужно написать так:
```c++
QObject::connect(btn1, SIGNAL(clicked()), this, SLOT(on_btn1_clicked()));
```

Можно также назначить обработчик следующим образом:
```c++
QObject::connect(btn1, &QPushButton::clicked, this, &Widget::on_btn1_clicked);
```

При назначении обработчика нажатия второй кнопки мы опустили передачу указателя `this`:
```c++
connect(btn2, SIGNAL(clicked(bool)), SLOT(on_btn2_clicked(bool)));
```

В качестве обработчика может выступать обычная функция или [[Lambda|лямбда-выражение]]:

```c++
#include <QApplication>
#include <QWidget>
#include <QPushButton>
#include <QVBoxLayout>

void on_clicked() {
	qDebug() << "Нажата кнопка 1. on_clicked()";
}

void on_clicked2() {
	qDebug() << "Нажата кнопка 1. on_clicked2()";
}

int main(int argc, char *argv[])
{
	QApplication app(argc, argv);
	
	QWidget window;
	window.setWindowTitle("Назначение обработчиков сигналов");
	window.resize(350, 70);
	
	QPushButton *btn1 = new QPushButton("Кнопка 1");
	QPushButton *btn2 = new QPushButton("Кнопка 2");
	QVBoxLayout *vbox = new QVBoxLayout();
	
	vbox->addWidget(btn1);
	vbox->addWidget(btn2);
	window.setLayout(vbox);
	
	QObject::connect(btn1, &QPushButton::clicked, on_clicked);
	QObject::connect(btn1, &QPushButton::clicked, on_clicked2);
	QObject::connect(btn2, &QPushButton::clicked, 
				[=]() { qDebug() << "Нажата кнопка 2";});
				
	window.show();
	
	return app.exec();
}
```

Обратите внимание: для одного сигнала можно назначить несколько обработчиков, которые будут вызываться в порядке назначения в программе. Можно также связать один сигнал с другим сигналом. При нажатии первой кнопки сгенерируем сигнал нажатия второй кнопки и обработаем его:

```c++
#include <QApplication>
#include <QWidget>
#include <QPushButton>
#include <QVBoxLayout>

int main(int argc, char *argv[])
{
	QApplication app(argc, argv);
	
	QWidget window;
	window.setWindowTitle("Назначение обработчиков сигналов");
	window.resize(350, 100);
	
	QPushButton *btn1 = new QPushButton("Кнопка 1");
	QPushButton *btn2 = new QPushButton("Кнопка 2");
	QVBoxLayout *vbox = new QVBoxLayout();
	
	vbox->addWidget(btn1);
	vbox->addWidget(btn2);
	window.setLayout(vbox);
	
	QObject::connect(btn1, SIGNAL(clicked()), btn2, SIGNAL(clicked()));
	QObject::connect(btn2, &QPushButton::clicked, 
						[=]() { qDebug() << "Нажата кнопка 2"; });

	window.show();
	
	return app.exec();
}
```

Необязательный параметр `type` определяет тип соединения между сигналом и обработчиком. На этот параметр следует обратить особое внимание при использовании нескольких потоков в приложении, т. к. изменять GUI-поток из другого потока нельзя. В параметре можно указать одну из следующих констант:

> **Qt::AutoConnection** — значение по умолчанию. Если источник сигнала и обработчик находятся в одном потоке, то эквивалентно значению `Qt::DirectConnection`, а если в разных потоках, то — `Qt::QueuedConnection`;
> 
> **Qt::DirectConnection** — обработчик вызывается сразу после генерации сигнала. Обработчик выполняется в потоке источника сигнала;
> 
> **Qt::QueuedConnection** — сигнал помещается в очередь обработки событий. Обработчик выполняется в потоке приемника сигнала;
> 
> **Qt::BlockingQueuedConnection** — аналогично значению `Qt::QueuedConnection`, но, пока сигнал не обработан, поток будет заблокирован. Обратите внимание на то, что источник сигнала и обработчик должны быть обязательно расположены в разных потоках;
> 
> **Qt::UniqueConnection** — обработчик можно назначить, только если он не был назначен ранее;
> 
> **Qt::SingleShotConnection** — обработчик будет вызываться только один раз.

Пример:

```c++
QObject::connect(btn1, SIGNAL(clicked()),
				this, SLOT(on_btn1_clicked()),
				Qt::SingleShotConnection);
```

## Блокировка и удаление обработчика

Для блокировки и удаления обработчиков предназначены следующие методы из класса [[[QObject|QObject]]:

> **blockSignals()** — временно блокирует прием сигналов, если параметр имеет значение `true`, и снимает блокировку, если параметр имеет значение `false`. Метод возвращает логическое представление предыдущего состояния соединения. Прототип метода:
```c++
bool blockSignals(bool block)
```

> **signalsBlocked()** — метод возвращает значение `true`, если блокировка установлена, и `false` — в противном случае. Прототип метода:
```c++
bool signalsBlocked() const
```

> **disconnect()** — удаляет обработчик. Метод является статическим и доступен без создания экземпляра класса. Прототипы метода:
```c++
static bool disconnect(const QObject *sender, const char *signal,
						const QObject *receiver, const char *method)
						
static bool disconnect(const QObject *sender, const QMetaMethod &signal, 
					   const QObject *receiver, const QMetaMethod &method)
					   
static bool disconnect(const QMetaObject::Connection &connection)

static bool disconnect(const QObject *sender, PointerToMemberFunction signal, 
					   const QObject *receiver, PointerToMemberFunction method)
```

Существует также нестатический метод `disconnect()`. Прототипы метода:

```c++
bool disconnect(const char *signal = nullptr,
				const QObject *receiver = nullptr,
				const char *method = nullptr) const
				
bool disconnect(const QObject *receiver,
				const char *method = nullptr) const
```

Если обработчик успешно удален, то метод `disconnect()` возвращает значение `true`. Значения, указанные в методе `disconnect()`, должны совпадать со значениями, используемыми при назначении обработчика. Например, если обработчик назначался таким образом:

```c++
connect(btn1, SIGNAL(clicked()), this, SLOT(on_btn1_clicked()));
```

то удалить его можно следующим образом:

```c++
disconnect(btn1, SIGNAL(clicked()), this, SLOT(on_btn1_clicked()));
```

Создадим окно с четырьмя кнопками. Для кнопки `Нажми меня` назначим обработчик для сигнала `clicked()`. Чтобы информировать о нажатии кнопки, выведем сообщение в окно консоли. Для кнопок `Блокировать`, `Разблокировать` и `Удалить` обработчик создадим обработчики, которые будут изменять статус обработчика для кнопки `Нажми меня`. Содержимое файлов `widget.h`, `widget.cpp` и `main.cpp` приведено ниже:

```c++
widget.h

#ifndef WIDGET_H
#define WIDGET_H

#include <QApplication>
#include <QWidget>
#include <QPushButton>
#include <QVBoxLayout>

class Widget : public QWidget
{
	Q_OBJECT
	
	public:
		Widget(QWidget *parent=nullptr);
		~Widget();
		
	private slots:
		void on_btn1_clicked();
		void on_btn2_clicked();
		void on_btn3_clicked();
		void on_btn4_clicked();
		
	private:
		QPushButton *btn1;
		QPushButton *btn2;
		QPushButton *btn3;
		QPushButton *btn4;
		QVBoxLayout *vbox;
};
#endif // WIDGET_H
```

```c++
widget.cpp

#include "widget.h"

Widget::Widget(QWidget *parent)
: QWidget(parent)
{
	btn1 = new QPushButton("Нажми меня");
	btn2 = new QPushButton("Блокировать");
	btn3 = new QPushButton("Разблокировать");
	btn4 = new QPushButton("Удалить обработчик");
	
	btn3->setEnabled(false);
	
	vbox = new QVBoxLayout();
	vbox->addWidget(btn1);
	vbox->addWidget(btn2);
	vbox->addWidget(btn3);
	vbox->addWidget(btn4);
	setLayout(vbox);
	
	connect(btn1, SIGNAL(clicked()), this, SLOT(on_btn1_clicked()));
	connect(btn2, SIGNAL(clicked()), this, SLOT(on_btn2_clicked()));
	connect(btn3, SIGNAL(clicked()), this, SLOT(on_btn3_clicked()));
	connect(btn4, SIGNAL(clicked()), this, SLOT(on_btn4_clicked()));
}

void Widget::on_btn1_clicked()
{
	qDebug() << "Нажата кнопка 1";
}

void Widget::on_btn2_clicked()
{
	btn1->blockSignals(true);
	btn2->setEnabled(false);
	btn3->setEnabled(true);
}

void Widget::on_btn3_clicked()
{
	btn1->blockSignals(false);
	btn2->setEnabled(true);
	btn3->setEnabled(false);
}

void Widget::on_btn4_clicked()
{
	disconnect(btn1, SIGNAL(clicked()),
	this, SLOT(on_btn1_clicked()));
	btn2->setEnabled(false);
	btn3->setEnabled(false);
	btn4->setEnabled(false);
}

Widget::~Widget() {}
```

```c++
main.cpp

#include "widget.h"

int main(int argc, char *argv[])
{
	QApplication app(argc, argv);

	Widget window;
	window.setWindowTitle("Блокировка и удаление обработчика");
	window.resize(350, 150);
	window.show();
	
	return app.exec();
}
```

Если после отображения окна нажать кнопку `Нажми меня`, то в окно консоли будет выведена строка `Нажата кнопка 1`. Нажатие кнопки `Блокировать` производит блокировку обработчика. Теперь при нажатии кнопки `Нажми меня` никаких сообщений в окно консоли не выводится. Отменить блокировку можно с помощью кнопки `Разблокировать`. Нажатие кнопки `Удалить обработчик` производит полное удаление обработчика. В этом случае, чтобы обрабатывать нажатие кнопки `Нажми меня`, необходимо заново назначить обработчик.

Отключить генерацию сигнала можно также, сделав компонент недоступным с помощью следующих методов из класса [[QWidget|QWidget]]:

> **setEnabled()** — если в параметре указано значение `false`, то компонент станет недоступным. Чтобы сделать компонент опять доступным, следует передать значение `true`. Метод является слотом. Прототип метода: 
```c++
void setEnabled(bool)
```

> **setDisabled()** — если в параметре указано значение `true`, то компонент станет недоступным. Чтобы сделать компонент опять доступным, следует передать значение `false`. Метод является слотом. Прототип метода:
```c++
void setDisabled(bool)
```

Проверить, доступен компонент или нет, позволяет метод `isEnabled()`. Метод возвращает значение `true`, если компонент доступен, и `false` — в противном случае. Прототип метода:
```c++
bool isEnabled() const
```

## Генерация сигнала из программы

В некоторых случаях необходимо вызвать сигнал из программы. Например, при заполнении последнего текстового поля и нажатии клавиши `<Enter>` можно имитировать нажатие кнопки и тем самым запустить обработчик этого сигнала. Выполнить генерацию сигнала из программы позволяет инструкция `emit`. Формат инструкции:

```c++
emit [Объект->]<Сигнал>([<Данные через запятую>])
```

Пользовательские сигналы должны объявляться внутри секцией `signals` в объявлении класса. Методы сигналов никогда не возвращают значения и не требуют создания определения. Пример:

```c++
signals:
	void mysignal(int, int);
```

В качестве примера создадим окно с двумя кнопками. Для этих кнопок назначим обработчики сигнала `clicked()` (нажатие кнопки). Внутри обработчика щелчка на первой кнопке сгенерируем два сигнала. Первый сигнал будет имитировать нажатие второй кнопки, а второй сигнал будет пользовательским. Внутри обработчиков
выведем сообщения в окно консоли. Содержимое файла `widget.h`, `widget.cpp` и файла `main.cpp`ниже:

```c++
widget.h

#ifndef WIDGET_H
#define WIDGET_H

#include <QApplication>
#include <QWidget>
#include <QPushButton>
#include <QVBoxLayout>

class Widget : public QWidget
{
	Q_OBJECT
	
	public:
		Widget(QWidget *parent=nullptr);
		~Widget();
	
	signals:
		void mysignal(int, int);
		
	private slots:
		void on_btn1_clicked();
		void on_btn2_clicked();
		void on_mysignal(int, int);
		
	private:
		QPushButton *btn1;
		QPushButton *btn2;
		QVBoxLayout *vbox;
};
#endif // WIDGET_H
```

```c++
widget.cpp

#include "widget.h"

Widget::Widget(QWidget *parent)
: QWidget(parent)
{
	btn1 = new QPushButton("Нажми меня");
	btn2 = new QPushButton("Кнопка 2");
	
	vbox = new QVBoxLayout();
	vbox->addWidget(btn1);
	vbox->addWidget(btn2);
	setLayout(vbox);
	
	connect(btn1, SIGNAL(clicked()), this, SLOT(on_btn1_clicked()));
	connect(btn2, SIGNAL(clicked()), this, SLOT(on_btn2_clicked()));
	connect(this, SIGNAL(mysignal(int,int)), this, SLOT(on_mysignal(int,int)));
}
//=====================================

void Widget::on_btn1_clicked()
{
	qDebug() << "Нажата кнопка 1";
	// Генерируем сигналы
	emit btn2->clicked();
	emit mysignal(10, 20);
}
//=====================================

void Widget::on_btn2_clicked()
{
	qDebug() << "Нажата кнопка 2";
}
//=====================================

void Widget::on_mysignal(int a, int b)
{
	qDebug() << "on_mysignal" << a << b;
}
//=====================================

Widget::~Widget() {}
```

```c++
main.cpp

#include "widget.h"
int main(int argc, char *argv[])
{
	QApplication app(argc, argv);
	
	Widget window;
	window.setWindowTitle("Генерация сигнала из программы");
	window.resize(350, 150);
	window.show();
	
	return app.exec();
}
```

Результат выполнения после нажатия первой кнопки:
```
Нажата кнопка 1
Нажата кнопка 2
on_mysignal 10 20
```

Сгенерировать сигнал можно не только с помощью `emit`. Некоторые компоненты предоставляют методы, которые посылают сигнал. Например, у кнопок существует метод `click()`. Используя этот метод, инструкцию

```c++
emit btn2->clicked();
```

можно записать следующим образом:

```c++
btn2->click();
```

Более подробно такие методы мы будем рассматривать при изучении конкретных компонентов.

## Использование таймеров

Таймеры позволяют через определенный интервал времени выполнять метод с предопределенным названием `timerEvent()`. Для назначения таймера используется метод `startTimer()` из класса [[QObject|QObject]]. Прототипы метода:
```c++
int startTimer(int interval, Qt::TimerType timerType = Qt::CoarseTimer)

int startTimer(std::chrono::milliseconds time, 
				Qt::TimerType timerType = Qt::CoarseTimer)
```

Метод `startTimer()` возвращает идентификатор таймера, с помощью которого можно остановить таймер. Первый параметр задает промежуток времени в миллисекундах, по истечении которого выполняется метод `timerEvent()`. Прототип метода:
```c++
virtual void timerEvent(QTimerEvent *event)
```

Внутри метода `timerEvent()` можно получить идентификатор таймера с помощью метода `timerId()` объекта класса [[QTimerEvent|QTimerEvent]]. Прототип метода:
```c++
int timerId() const
```

Минимальное значение интервала зависит от операционной системы. Если в первом параметре указать значение 0 , то таймер будет срабатывать много раз при отсутствии других необработанных событий.

Чтобы остановить таймер, необходимо воспользоваться методом `killTimer()` из класса [[QObject|QObject]]. Прототип метода:
```c++
void killTimer(int id)
```

В качестве параметра указывается идентификатор, возвращаемый методом `startTimer()`.

Создадим часы в окне, которые будут отображать текущее системное время с точностью до секунды, и добавим возможность запуска и остановки часов с помощью кнопок. Содержимое файлов widget.h, widget.cpp и main.cpp приведено ниже:

```c++
widget.h

#ifndef WIDGET_H
#define WIDGET_H

#include <QApplication>
#include <QWidget>
#include <QLabel>
#include <QPushButton>
#include <QVBoxLayout>
#include <QTimerEvent>
#include <QTime>

class Widget : public QWidget
{
	Q_OBJECT
	public:
		Widget(QWidget *parent=nullptr);
		~Widget();
		
	protected:
		void timerEvent(QTimerEvent *event) override;
		
	private slots:
		void on_btn1_clicked();
		void on_btn2_clicked();
		
	private:
		QLabel *label;
		QPushButton *btn1;
		QPushButton *btn2;
		QVBoxLayout *vbox;
		int timer_id;
};
#endif // WIDGET_H
```

```c++
widget.cpp

Widget::Widget(QWidget *parent)
: QWidget(parent)
{
	timer_id = -1;

	label = new QLabel("");
	label->setAlignment(Qt::AlignCenter);
	
	btn1 = new QPushButton("Запустить");
	btn2 = new QPushButton("Остановить");
	btn2->setEnabled(false);
	
	vbox = new QVBoxLayout();
	vbox->addWidget(label);
	vbox->addWidget(btn1);
	vbox->addWidget(btn2);
	setLayout(vbox);
	
	connect(btn1, SIGNAL(clicked()), this, SLOT(on_btn1_clicked()));
	connect(btn2, SIGNAL(clicked()), this, SLOT(on_btn2_clicked()));
}
//================================

void Widget::on_btn1_clicked()
{
	timer_id = startTimer(1000); // 1 секунда
	btn1->setEnabled(false);
	btn2->setEnabled(true);
}
//================================

void Widget::on_btn2_clicked()
{
	if (timer_id != -1) {
		killTimer(timer_id);
		timer_id = -1;
	}
	
	btn1->setEnabled(true);
	btn2->setEnabled(false);
}

void Widget::timerEvent(QTimerEvent *event)
{
	// qDebug() << "ID =" << event->timerId();
	QTime t = QTime::currentTime();
	label->setText(t.toString("HH:mm:ss"));
}

Widget::~Widget() {}
```

```c++
main.cpp

#include "widget.h"
int main(int argc, char *argv[])
{
	QApplication app(argc, argv);

	Widget window;
	window.setWindowTitle("Часы в окне");
	window.resize(350, 100);
	window.show();
	
	return app.exec();
}
```

## Класс QTimer: таймер

Вместо методов `startTimer()` и `killTimer()` можно воспользоваться классом [[QTimer|QTimer]].

## Перехват всех событий

В предыдущих разделах мы рассмотрели обработку сигналов, которые позволяют обмениваться сообщениями между компонентами. Обработка внешних событий, например нажатий клавиш, осуществляется несколько иначе. Чтобы обработать событие, необходимо наследовать класс и переопределить в нем метод со специальным названием. Например, чтобы обработать нажатие клавиши, следует переопределить метод `keyPressEvent()`. Специальные методы принимают объект, содержащий детальную информацию о событии, например код нажатой клавиши. Все эти объекты являются наследниками класса [[QEvent|QEvent]] и наследуют следующие методы:

> **accept()** — устанавливает флаг, который является признаком согласия с дальнейшей обработкой события. Например, если в методе `closeEvent()` вызывать метод `accept()` через объект события, то окно будет закрыто. Флаг обычно устанавливается по умолчанию. Прототип метода:
```c++
void accept()
```

> **ignore()** — сбрасывает флаг. Например, если в методе `closeEvent()` вызывать метод `ignore()` через объект события, то окно закрыто не будет. Прототип метода:
```c++
void ignore()
```

> `setAccepted()` — если в качестве параметра указано значение `true`, то флаг будет установлен (аналогично вызову метода `accept()`), а если `false`, то сброшен (аналогично вызову метода `ignore()` ). Прототип метода:
```c++
virtual void setAccepted(bool accepted)
```

> **isAccepted()** — возвращает текущее состояние флага. Прототип метода:
```c++
bool isAccepted() const
```

> **registerEventType()** — позволяет зарегистрировать пользовательский тип события. Метод возвращает идентификатор зарегистрированного события. В качестве параметра можно указать значение в пределах от `QEvent::User` (1000) до `QEvent::MaxUser(65 535)`. Метод является статическим. Прототип метода:
```c++
static int registerEventType(int hint = -1)
```

> **spontaneous()** — возвращает `true`, если событие сгенерировано системой, и `false`, если событие сгенерировано внутри программы искусственно. 
> Прототип метода:
```c++
bool spontaneous() const
```

> **type()** — возвращает тип события. Прототип метода:
```c++
QEvent::Type type() const
```

Перечислим основные типы событий (полный список смотрите в документации по классу [[QEvent|QEvent]]):

* 0 — **None** — нет события;
* 1 — **Timer** — событие таймера;
* 2 — **MouseButtonPress** — нажата кнопка мыши;
* 3 — **MouseButtonRelease** — отпущена кнопка мыши;
* 4 — **MouseButtonDblClick** — двойной щелчок мышью;
* 5 — **MouseMove** — перемещение мыши;
* 6 — **KeyPress** — клавиша клавиатуры нажата;
* 7 — **KeyRelease** — клавиша клавиатуры отпущена;
* 8 — **FocusIn** — получен фокус ввода с клавиатуры;
* 9 — **FocusOut** — потерян фокус ввода с клавиатуры;
* 10 — **Enter** — указатель мыши входит в область компонента;
* 11 — **Leave** — указатель мыши покидает область компонента;
* 12 — **Paint** — перерисовка компонента;
* 13 — **Move** — позиция компонента изменилась;
* 14 — **Resize** — изменился размер компонента;
* 17 — **Show** — компонент отображен;
* 18 — **Hide** — компонент скрыт;
* 19 — **Close** — окно закрыто;
* 24 — **WindowActivate** — окно стало активным;
* 25 — **WindowDeactivate** — окно стало неактивным;
* 26 — **ShowToParent** — дочерний компонент отображен;
* 27 — **HideToParent** — дочерний компонент скрыт;
* 31 — **Wheel** — прокручено колесико мыши;
* 40 — **Clipboard** — содержимое буфера обмена изменено;
* 60 — **DragEnter** — указатель мыши входит в область компонента при операции перетаскивания;
* 61 — **DragMove** — производится операция перетаскивания;
* 62 — **DragLeave** — указатель мыши покидает область компонента при операции перетаскивания;
* 63 — **Drop** — операция перетаскивания завершена;
* 68 — **ChildAdded** — добавлен дочерний компонент;
* 69 — **ChildPolished** — производится настройка дочернего компонента;
* 71 — **ChildRemoved** — удален дочерний компонент;
* 74 — **PolishRequest** — компонент настроен;
* 82 — **ContextMenu** — событие контекстного меню;
* 99 — **ActivationChange** — изменился статус активности окна верхнего уровня;
* 103 — **WindowBlocked** — окно блокировано модальным окном;
* 104 — **WindowUnblocked** — текущее окно разблокировано после закрытия модального окна;
* 105 — **WindowStateChange** — статус окна изменился;
* 1000 — **User** — пользовательское событие;
* 65535 — **MaxUser** — максимальный идентификатор пользовательского события.

Перехват всех событий осуществляется с помощью метода с предопределенным названием `event()`. Прототип метода:
```c++
virtual bool event(QEvent *e)
```

Через параметр доступен объект с дополнительной информацией о событии. Этот объект отличается для разных типов событий, например для события `MouseButtonPress` объект будет экземпляром класса [[QMouseEvent|QMouseEvent]], а для события `KeyPress` — экземпляром класса [[QKeyEvent|QKeyEvent]]. Какие методы содержат эти классы, мы рассмотрим в следующих разделах.

Внутри метода `event()` следует вернуть значение `true`, если событие принято, и `false` — в противном случае. Если возвращается значение `true`, то родительский компонент не получит событие. Чтобы продолжить распространение события, необходимо вызвать метод `event()` базового класса и передать ему текущий объект события. Обычно это делается так:
```c++
return QWidget::event(e);
```

В этом случае пользовательский класс является наследником класса [[QWidget|QWidget]] и переопределяет метод `event()`. Если вы наследуете другой класс, то необходимо вызывать метод именно этого класса. Например, при наследовании класса [[QLabel|QLabel]] инструкция будет выглядеть так: 
```c++
return QLabel::event(e);
```

Рассмотрим пример перехвата нажатия клавиши, щелчка мышью и закрытия окна. Содержимое файла widget.h, widget.cpp и main.cpp приведено ниже:

```c++
widget.h

#ifndef WIDGET_H
#define WIDGET_H

#include <QApplication>
#include <QWidget>
#include <QKeyEvent>
#include <QMouseEvent>

class Widget : public QWidget
{
	Q_OBJECT
	
	public:
		Widget(QWidget *parent=nullptr);
		~Widget();
	
		bool event(QEvent *e) override;
};
#endif // WIDGET_H
```

```c++
widget.cpp

#include "widget.h"

Widget::Widget(QWidget *parent)
: QWidget(parent)
{}
//==============================

bool Widget::event(QEvent *e)
{
	if (e->type() == QEvent::KeyPress) {
		qDebug() << "Нажата клавиша на клавиатуре";
		QKeyEvent *k = static_cast<QKeyEvent*>(e);
		qDebug() << "Код:" << k->key() << "текст:" << k->text();
	}
	else if (e->type() == QEvent::Close) {
		qDebug() << "Окно закрыто";
	}
	else if (e->type() == QEvent::MouseButtonPress) {
		qDebug() << "Щелчок мышью";
		QMouseEvent *m = static_cast<QMouseEvent*>(e);
		qDebug() << "Координаты:" << m->position();
	}

	return QWidget::event(e); // Отправляем дальше
}
//==============================

Widget::~Widget() {}
```

```c++
main.cpp

#include "widget.h"

int main(int argc, char *argv[])
{
	QApplication app(argc, argv);
	
	Widget window;
	window.setWindowTitle("Обработка событий");
	window.resize(350, 100);
	window.show();
	
	return app.exec();
}
```

## События окна

Перехватывать все события следует только в самом крайнем случае. В обычных ситуациях нужно использовать методы, предназначенные для обработки определенного события. Например, чтобы обработать закрытие окна, достаточно переопределить метод `closeEvent()`. Какие методы требуется переопределять для обработки событий окна, мы сейчас и рассмотрим.

### Изменение состояния окна

Отследить изменение состояния окна (сворачивание, разворачивание, сокрытие и отображение) позволяют следующие методы:

> **changeEvent()** — вызывается при изменении состояния окна, приложения или компонента. Иными словами, метод вызывается не только при изменении статуса окна, но и при изменении заголовка окна, палитры, статуса активности окна верхнего уровня, языка, локали и др. (полный список смотрите в документации). При обработке события `WindowStateChange` через параметр доступен экземпляр класса `QWindowStateChangeEvent`. Этот класс содержит только метод `oldState()`, с помощью которого можно получить предыдущий статус окна. Прототипы методов:
```c++
virtual void changeEvent(QEvent *event)
Qt::WindowStates oldState() const
```

> **showEvent()** — вызывается при отображении компонента. Через параметр доступен экземпляр класса `QShowEvent`. Прототип метода:
```c++
virtual void showEvent(QShowEvent *event)
```

> **hideEvent()** — вызывается при сокрытии компонента. Через параметр доступен экземпляр класса `QHideEvent`. Прототип метода:
```c++
virtual void hideEvent(QHideEvent *event)
```

Для примера выведем текущее состояние окна в консоль при сворачивании, разворачивании, сокрытии и отображении окна. Содержимое файла `widget.h`, `widget.cpp` и `main.cpp` приведено ниже:

```c++
widget.h

#ifndef WIDGET_H
#define WIDGET_H

#include <QApplication>
#include <QWidget>
#include <QShowEvent>
#include <QHideEvent>
#include <QPushButton>
#include <QVBoxLayout>

class Widget : public QWidget
{
	Q_OBJECT
	
	public:
		Widget(QWidget *parent=nullptr);
		~Widget();
		
	protected:
		void changeEvent(QEvent *e) override;
		void showEvent(QShowEvent *e) override;
		void hideEvent(QHideEvent *e) override;
		
	private:
		QPushButton *btn1;
		QPushButton *btn2;
		QVBoxLayout *vbox;
};
#endif // WIDGET_H
```

```c++
#include "widget.h"

Widget::Widget(QWidget *parent)
: QWidget(parent)
{
	btn1 = new QPushButton("Полноэкранный режим");
	btn2 = new QPushButton("Нормальный режим");
	
	vbox = new QVBoxLayout();
	vbox->addWidget(btn1);
	vbox->addWidget(btn2);
	setLayout(vbox);
	
	QObject::connect(btn1, SIGNAL(clicked()), this, SLOT(showFullScreen()));
	QObject::connect(btn2, SIGNAL(clicked()), this, SLOT(showNormal()));
}
//================================

void Widget::changeEvent(QEvent *e)
{
	if (e->type() == QEvent::WindowStateChange) {
		if (isMinimized()) {
			qDebug() << "Окно свернуто";
		}
		else if (isMaximized()) {
			qDebug() << "Окно раскрыто до максимальных размеров";
		}
		else if (isFullScreen()) {
			qDebug() << "Полноэкранный режим";
		}
		else if (isActiveWindow()) {
			qDebug() << "Окно находится в фокусе ввода";
		}
	}
	
	QWidget::changeEvent(e); // Отправляем дальше
}
//================================

void Widget::showEvent(QShowEvent *e)
{
	qDebug() << "Окно отображено";
	QWidget::showEvent(e); // Отправляем дальше
}
//================================

void Widget::hideEvent(QHideEvent *e)
{
	qDebug() << "Окно скрыто";
	QWidget::hideEvent(e); // Отправляем дальше
}
//================================

Widget::~Widget() {}
```

```c++
#include "widget.h"

int main(int argc, char *argv[]
{
	QApplication app(argc, argv);
	
	Widget window;
	window.setWindowTitle("Отслеживание состояния окна");
	window.resize(350, 100);
	window.show();
	
	return app.exec();
}
```

### Изменение положения окна и его размеров

При перемещении окна и изменении размеров вызываются следующие методы:

> **moveEvent()** — вызывается непрерывно при перемещении окна. Через параметр доступен экземпляр класса [[QMoveEvent|QMoveEvent]]. Прототип метода:
```c++
virtual void moveEvent(QMoveEvent *event)
```

Получить координаты окна позволяют следующие методы из класса [[QMoveEvent|QMoveEvent]]:
* **pos()** — возвращает экземпляр класса [[QPoint|QPoint]] с текущими координатами;
* **oldPos()** — возвращает экземпляр класса [[QPoint|QPoint]] с предыдущими координатами.

Прототипы методов:
```c++
const QPoint &pos() const
const QPoint &oldPos() const
```

> **resizeEvent()** — вызывается непрерывно при изменении размеров окна. Через параметр доступен экземпляр класса [[QResizeEvent|QResizeEvent]]. Прототип метода:
```c++
virtual void resizeEvent(QResizeEvent *event)
```

Получить размеры окна позволяют следующие методы из класса [[QResizeEvent|QResizeEvent]]:
* **size()** — возвращает экземпляр класса [[QSize|QSize]] с текущими размерами;
* **oldSize()** — возвращает экземпляр класса [[QSize|QSize]] с предыдущими размерами.

Прототипы методов:
```c++
const QSize &size() const
const QSize &oldSize() const
```

Рассмотрим пример обработки изменения положения окна и его размеров. Содержимое файлов `widget.h`, `widget.cpp` и файла `main.cpp` приведено ниже

```c++
widget.h

#ifndef WIDGET_H
#define WIDGET_H

#include <QApplication>
#include <QWidget>
#include <QMoveEvent>
#include <QResizeEvent>

class Widget : public QWidget
{
	Q_OBJECT
	
	public:
		Widget(QWidget *parent=nullptr);
		~Widget();
		
	protected:
		void moveEvent(QMoveEvent *e) override;
		void resizeEvent(QResizeEvent *e) override;
};
#endif // WIDGET_H
```

```c++
widget.cpp

#include "widget.h"

Widget::Widget(QWidget *parent)
: QWidget(parent)
{}
//===================================

void Widget::moveEvent(QMoveEvent *e)
{
	qDebug() << "moveEvent" << e->pos().x() << e->pos().y();
	QWidget::moveEvent(e);
}
//===================================

void Widget::resizeEvent(QResizeEvent *e)
{
	qDebug() << "resizeEvent"
	<< e->size().width() << e->size().height();
	QWidget::resizeEvent(e);
}
//===================================

Widget::~Widget() {}
```

```c++
main.cpp

#include "widget.h"
int main(int argc, char *argv[])
{
	QApplication app(argc, argv);
	
	Widget window;
	window.setWindowTitle("Изменение положения окна и его размеров");
	window.resize(350, 100);
	window.show();
	
	return app.exec();
}
```

### Перерисовка окна или его части

Когда компонент (или его часть) становится видимым, требуется выполнить перерисовку компонента или только его части. В этом случае вызывается метод с названием `paintEvent()`. Прототип метода:
```c++
virtual void paintEvent(QPaintEvent *event)
```

Через параметр доступен экземпляр класса [[QPaintEvent|QPaintEvent]], который содержит следующие методы:

> **rect()** — возвращает экземпляр класса [[QRect|QRect]] с координатами и размерами прямоугольной области, которую требуется перерисовать. Прототип метода:
```c++
const QRect &rect() const
```

> **region()** — возвращает экземпляр класса [[QRegion|QRegion]] с регионом, требующим перерисовки. Прототип метода:
```c++
const QRegion &region() const
```

С помощью этих методов можно получать координаты области, которая, например, была ранее перекрыта другим окном и теперь оказалась в зоне видимости. Перерисовывая только область, а не весь компонент, можно достичь более эффективного расходования ресурсов компьютера. Следует также заметить, что в целях эффективности последовательность событий перерисовки может быть объединена в одно событие с общей областью перерисовки.

В некоторых случаях перерисовку окна необходимо выполнить вне зависимости от внешних действий системы или пользователя, например при изменении каких-либо значений нужно обновить график. Вызвать событие перерисовки компонента позволяют следующие методы из класса [[QWidget|QWidget]]:

> **repaint()** — незамедлительно вызывает метод `paintEvent()` для перерисовки компонента при условии, что компонент не скрыт и обновление не запрещено с помощью метода `setUpdatesEnabled()`. Прототипы методов (первый прототип является слотом):
```c++
void repaint()
void repaint(int x, int y, int w, int h)
void repaint(const QRect &rect)
void repaint(const QRegion &rgn)
void setUpdatesEnabled(bool enable)
```

> **update()** — посылает сообщение о необходимости перерисовки компонента при условии, что компонент не скрыт и обновление не запрещено. Событие будет обработано на следующей итерации основного цикла приложения. Если посылаются сразу несколько сообщений, то они объединяются в одно сообщение. Благодаря этому можно избежать неприятного мерцания. Метод `update()` предпочтительнее использовать вместо метода `repaint()`. Прототипы метода (первый прототип является слотом):
```c++
void update()
void update(int x, int y, int w, int h)
void update(const QRect &rect)
void update(const QRegion &rgn)
```

### Предотвращение закрытия окна

При нажатии кнопки Закрыть в заголовке окна или при вызове метода `close()` вызывается метод `closeEvent()`. Прототип метода:
```c++
virtual void closeEvent(QCloseEvent *event)
```

Через параметр доступен экземпляр класса [[QCloseEvent|QCloseEvent]]. Чтобы предотвратить закрытие окна, необходимо вызвать метод `ignore()` через объект события, в противном случае — метод `accept()`.

В качестве примера при нажатии кнопки Закрыть в заголовке окна выведем стандартное диалоговое окно с запросом подтверждения закрытия окна. Если пользователь нажимает кнопку `Yes`, то закроем окно, а если кнопку `No` или просто закрывает диалоговое окно, то прервем закрытие окна. Содержимое файлов `widget.h`, `widget.cpp` и `main.cpp` приведено ниже:

```c++
widget.h

#ifndef WIDGET_H
#define WIDGET_H

#include <QApplication>
#include <QWidget>
#include <QCloseEvent>
#include <QMessageBox>

class Widget : public QWidget
{
	Q_OBJECT
	
	public:
		Widget(QWidget *parent=nullptr);
		~Widget();
		
	protected:
	void closeEvent(QCloseEvent *e) override;
};
#endif // WIDGET_H
```

```c++
widget.cpp

#include "widget.h"

Widget::Widget(QWidget *parent)
: QWidget(parent)
{}
//======================================

void Widget::closeEvent(QCloseEvent *e)
{
	QMessageBox::StandardButton result;
	result = QMessageBox::question(this,
				"Подтверждение закрытия окна",
				"Вы действительно хотите закрыть окно?",
				QMessageBox::Yes | QMessageBox::No,
				QMessageBox::No);
				
	if (result == QMessageBox::Yes) {
		e->accept();
		QWidget::closeEvent(e);
	}
	else {
		e->ignore();
	}
}
//======================================

Widget::~Widget() {}
```

```c++
#include "widget.h"

int main(int argc, char *argv[])
{
	QApplication app(argc, argv);
	
	Widget window;
	window.setWindowTitle("Обработка закрытия окна");
	window.resize(350, 100);
	window.show();
	
	return app.exec();
}
```

## События клавиатуры

События клавиатуры очень часто обрабатываются внутри приложений. Например, при нажатии клавиши `<F1>` можно вывести справочную информацию, при нажатии клавиши `<Enter>` в однострочном текстовом поле можно перенести фокус ввода на другой компонент и т. д. Рассмотрим события клавиатуры подробно.

### Установка фокуса ввода

В один момент времени только один компонент (или вообще ни одного) может иметь фокус ввода. Для управления фокусом ввода предназначены следующие методы из класса [[QWidget|QWidget]]:

> **setFocus()** — устанавливает фокус ввода, если компонент находится в активном окне. Прототипы метода (первый прототип является слотом):
```c++
void setFocus()
void setFocus(Qt::FocusReason reason)
```

В параметре reason можно указать причину изменения фокуса ввода. Указываются следующие константы:

* **Qt::MouseFocusReason** — фокус изменен с помощью мыши;
* **Qt::TabFocusReason** — нажата клавиша `<Tab>`;
* **Qt::BacktabFocusReason** — нажата комбинация клавиш `<Shift>+<Tab>`;
* **Qt::ActiveWindowFocusReason** — окно стало активным или неактивным;
* **Qt::PopupFocusReason** — открыто или закрыто всплывающее окно;
* **Qt::ShortcutFocusReason** — нажата комбинация клавиш быстрого доступа;
* **Qt::MenuBarFocusReason** — фокус изменился из-за меню;
* **Qt::OtherFocusReason** — другая причина;

> **clearFocus()** — убирает фокус ввода с компонента. Прототип метода: 
```c++
void clearFocus()
```

> **hasFocus()** — возвращает значение `true`, если компонент находится в фокусе ввода, и `false` — в противном случае. Прототип метода:
```c++
bool hasFocus() const
```

> **focusWidget()** — возвращает указатель на последний компонент, для которого вызывался метод `setFocus()`. Для компонентов верхнего уровня возвращается указатель на компонент, который получит фокус после того, как окно станет активным. Прототип метода:
```c++
QWidget *focusWidget() const
```

> **setFocusProxy()** — позволяет передать указатель на компонент, который будет получать фокус ввода вместо текущего компонента. Прототип метода:
```c++
void setFocusProxy(QWidget *w)
```

> **focusProxy()** — возвращает указатель на компонент, который обрабатывает фокус ввода вместо текущего компонента. Если компонента нет, то метод возвращает нулевой указатель. Прототип метода:
```c++
QWidget *focusProxy() const
```

> **focusNextChild()** — находит следующий компонент, которому можно передать фокус, и передает фокус. Аналогично нажатию клавиши `<Tab>`. Метод возвращает значение `true`, если компонент найден, и `false` — в противном случае. Прототип метода:
```c++
protected:
	bool focusNextChild()
```

> **focusPreviousChild()** — находит предыдущий компонент, которому можно передать фокус, и передает фокус. Аналогично нажатию комбинации клавиш `<Shift>+<Tab>`. Метод возвращает значение `true`, если компонент найден, и `false` — в противном случае. Прототип метода:
```c++
protected:
	bool focusPreviousChild()
```

> **focusNextPrevChild()** — если в параметре указано значение `true`, то метод аналогичен методу `focusNextChild()`. Если в параметре указано значение `false`, то метод аналогичен методу `focusPreviousChild()`. Метод возвращает значение `true`, если компонент найден, и `false` — в противном случае. Прототип метода:
```c++
protected:
	virtual bool focusNextPrevChild(bool next)
```

> **setTabOrder()** — позволяет задать последовательность смены фокуса при нажатии клавиши `<Tab>`. Метод является статическим. Прототип метода:
```c++
static void setTabOrder(QWidget *first, QWidget *second)
```

В параметре `second` передается указатель на компонент, на который переместится фокус с компонента `first`. Если компонентов много, то метод вызывается несколько раз. Пример указания цепочки перехода `widget1 -> widget2 -> widget3
-> widget4`
```c++
QWidget::setTabOrder(widget1, widget2)
QWidget::setTabOrder(widget2, widget3)
QWidget::setTabOrder(widget3, widget4)
```

> **setFocusPolicy()** — задает способ получения фокуса компонентом. Прототип метода:
```c++
void setFocusPolicy(Qt::FocusPolicy policy)
```

В качестве параметра указываются следующие константы:

* **Qt::NoFocus** — компонент не может получать фокус;
* **Qt::TabFocus** — получает фокус с помощью клавиши `<Tab>`;
* **Qt::ClickFocus** — получает фокус с помощью щелчка мышью;
* **Qt::StrongFocus** — получает фокус с помощью клавиши `<Tab>` и щелчка мышью;
* **Qt::WheelFocus** — получает фокус с помощью клавиши `<Tab>`, щелчка мышью и колесика мыши;

> **focusPolicy()** — возвращает текущий способ получения фокуса. Прототип метода:
```c++
Qt::FocusPolicy focusPolicy() const
```

> **grabKeyboard()** — захватывает ввод с клавиатуры. Другие компоненты не будут получать события клавиатуры, пока не будет вызван метод `releaseKeyboard()`. Прототип метода:
```c++
void grabKeyboard()
```

> **releaseKeyboard()** — освобождает захваченный ранее ввод с клавиатуры. Прототип метода:
```c++
void releaseKeyboard()
```

Получить указатель на компонент, находящийся в фокусе ввода, позволяет статический метод `focusWidget()` из класса [[QApplication|QApplication]] . Прототип метода:
```c++
static QWidget *focusWidget()
```

Если ни один компонент не имеет фокуса ввода, то метод возвращает нулевой указатель. Не путайте этот метод с одноименным методом из класса [[QWidget|QWidget]].

Обработать получение и потерю фокуса ввода позволяют следующие методы:
> **focusInEvent()** — вызывается при получении фокуса ввода. Прототип метода:
```c++
virtual void focusInEvent(QFocusEvent *event)
```

> **focusOutEvent()** — вызывается при потере фокуса ввода. Прототип метода:
```c++
virtual void focusOutEvent(QFocusEvent *event)
```

Через параметр доступен экземпляр класса [[QFocusEvent|QFocusEvent]], который содержит следующие методы:

**gotFocus()** — возвращает значение `true`, если тип события `QEvent::FocusIn`, и
`false` — в противном случае. Прототип метода:
```c++
bool gotFocus() const
```

> **lostFocus()** — возвращает значение `true`, если тип события `QEvent::FocusOut`, и `false` — в противном случае. Прототип метода:
```c++
bool lostFocus() const
```

> **reason()** — возвращает причину установки фокуса. Значение аналогично значению параметра `reason` в методе `setFocus()` . Прототип метода:
```c++
Qt::FocusReason reason() const
```

Создадим окно с кнопкой и двумя однострочными полями ввода. Для полей ввода обработаем получение и потерю фокуса ввода, а при нажатии кнопки установим фокус ввода на второе поле. Кроме того, зададим последовательность перехода при нажатии клавиши `<Tab>`. Содержимое файлов `mylineedit.h`, `mylineedit.cpp`, `widget.h`, `widget.cpp` и файла `main.cpp` ниже:

```c++
mylineedit.h

#ifndef MYLINEEDIT_H
#define MYLINEEDIT_H

#include <QWidget>
#include <QLineEdit>
#include <QFocusEvent>

class MyLineEdit : public QLineEdit
{
	Q_OBJECT
	public:
		MyLineEdit(int id, QWidget *parent=nullptr);
		
	protected:
		void focusInEvent(QFocusEvent *e) override;
		void focusOutEvent(QFocusEvent *e) override;
		
	private:
		int id_;
};
#endif // MYLINEEDIT_H
```

```c++
 mylineedit.cpp
 
#include "mylineedit.h"

MyLineEdit::MyLineEdit(int id, QWidget *parent)
	: QLineEdit(parent), id_(id)
{}
//================================

void MyLineEdit::focusInEvent(QFocusEvent *e)
{
	qDebug() << "Получен фокус полем" << id_;
	QLineEdit::focusInEvent(e);
}
//================================

void MyLineEdit::focusOutEvent(QFocusEvent *e)
{
	qDebug() << "Потерян фокус полем" << id_;
	QLineEdit::focusOutEvent(e);
}
```

```c++
widget.h

#ifndef WIDGET_H
#define WIDGET_H

#include <QApplication>
#include <QWidget>
#include <QPushButton>
#include <QVBoxLayout>
#include "mylineedit.h"

class Widget : public QWidget
{
	Q_OBJECT
	public:
		Widget(QWidget *parent=nullptr);
		~Widget();
		
	private:
		MyLineEdit *line1;
		MyLineEdit *line2;
		QPushButton *btn1;
		QVBoxLayout *vbox;
};
#endif // WIDGET_H
```

```c++
widget.cpp

#include "widget.h"

Widget::Widget(QWidget *parent)
: QWidget(parent)
{
	line1 = new MyLineEdit(1);
	line2 = new MyLineEdit(2);
	
	btn1 = new QPushButton("Установить фокус на поле 2");
	vbox = new QVBoxLayout();
	vbox->addWidget(btn1);
	vbox->addWidget(line1);
	vbox->addWidget(line2);
	setLayout(vbox);
	
	QObject::connect(btn1, SIGNAL(clicked()), line2, SLOT(setFocus()));
	
	// Задаем порядок обхода с помощью клавиши <Tab>
	QWidget::setTabOrder(line1, line2);
	QWidget::setTabOrder(line2, btn1);
}

Widget::~Widget() {}
```

```c++
#include "widget.h"

int main(int argc, char *argv[])
{
	QApplication app(argc, argv);

	Widget window;
	window.setWindowTitle("Установка фокуса ввода");
	window.resize(350, 100);
	window.show();
	
	return app.exec();
}
```

### Назначение клавиш быстрого доступа

Клавиши быстрого доступа (иногда их также называют горячими клавишами) позволяют установить фокус ввода с помощью нажатия специальной клавиши (например, `<Alt>` или `<Ctrl>`) и какой-либо дополнительной клавиши. Если после нажатия клавиш быстрого доступа в фокусе окажется кнопка (или пункт меню), то она будет нажата.

Чтобы задать клавиши быстрого доступа, следует в тексте надписи указать символ `&` перед буквой. В этом случае буква, перед которой указан символ `&`, будет подчеркнута, что является подсказкой пользователю. При одновременном нажатии клавиши `<Alt>` и подчеркнутой буквы компонент окажется в фокусе ввода. Некоторые компоненты, например текстовое поле, не имеют надписи. Чтобы задать клавиши быстрого доступа для таких компонентов, необходимо отдельно создать надпись и связать ее с компонентом с помощью метода `setBuddy()` из класса [[QLabel|QLabel]].

Прототип метода:
```c++
void setBuddy(QWidget *buddy)
```

Если же создание надписи не представляется возможным, то можно воспользоваться следующими методами из класса [[QWidget|QWidget]]:

> **grabShortcut()** — регистрирует клавиши быстрого доступа и возвращает идентификатор, с помощью которого можно управлять ими в дальнейшем. Прототип метода:
```c++
int grabShortcut(const QKeySequence &key, 
				 Qt::ShortcutContext context = Qt::WindowShortcut)
```

В параметре `key` указывается экземпляр класса [[QKeySequence|QKeySequence]]. Создать экземпляр этого класса для комбинации `<Alt>+<E>` можно, например, так:

```c++
QKeySequence::mnemonic("&e")
QKeySequence("Alt+e")
QKeySequence(Qt::ALT | Qt::Key_E)
```

В параметре `context` можно указать константы `Qt::WidgetShortcut`, `Qt::WidgetWithChildrenShortcut`, `Qt::WindowShortcut` (значение по умолчанию) и `Qt::ApplicationShortcut`:

> **releaseShortcut()** — удаляет комбинацию с идентификатором id . Прототип метода:
```c++
void releaseShortcut(int id)
```

> **setShortcutEnabled()** — если в качестве параметра `enable` указано значение `true` (значение по умолчанию), то клавиши быстрого доступа с идентификатором `id` разрешены. Значение `false` запрещает использование клавиш быстрого доступа. Прототип метода:
```c++
void setShortcutEnabled(int id, bool enable = true)
```

При нажатии клавиш быстрого доступа генерируется событие `QEvent::Shortcut`, которое можно обработать в методе `event()`. Через параметр доступен экземпляр класса [[QShortcutEvent|QShortcutEvent]] , который содержит следующие методы:

> **shortcutId()** — возвращает идентификатор комбинации клавиш. Прототип метода:
```c++
int shortcutId() const
```

> **isAmbiguous()** — возвращает значение `true`, если событие отправлено сразу нескольким компонентам и `false` — в противном случае. Прототип метода:
```c++
bool isAmbiguous() const
```

> **key()** — возвращает экземпляр класса QKeySequence . Прототип метода:
```c++
const QKeySequence &key() const
```

Создадим окно с надписью, двумя однострочными текстовыми полями и кнопкой. Для первого текстового поля назначим комбинацию клавиш (`<Alt>+<В>`) через надпись, а для второго поля (`<Alt>+<Е>`) — с помощью метода `grabShortcut()`. Для кнопки назначим комбинацию клавиш (`<Alt>+<У>`) обычным образом через надпись на кнопке. Содержимое файла `mylineedit.h`, `mylineedit.cpp`, `widget.h`, `widget.cpp` и `main.cpp` ниже:

```c++
mylineedit.h

#ifndef MYLINEEDIT_H
#define MYLINEEDIT_H

#include <QWidget>
#include <QLineEdit>
#include <QShortcutEvent>

class MyLineEdit : public QLineEdit
{
	Q_OBJECT
	public:
		MyLineEdit(QWidget *parent=nullptr);
		
	protected:
		bool event(QEvent *e) override;
		
	public:
		int id;
};
#endif // MYLINEEDIT_H
```

```c++
mylineedit.cpp

#include "mylineedit.h"

MyLineEdit::MyLineEdit(QWidget *parent)
	: QLineEdit(parent), id(-1)
{}

bool MyLineEdit::event(QEvent *e)
{
	if (e->type() == QEvent::Shortcut) {
		QShortcutEvent *s = static_cast<QShortcutEvent*>(e);
		
		if (id == s->shortcutId()) {
			setFocus(Qt::ShortcutFocusReason);
			return true;
		}
	}

	return QLineEdit::event(e);
}
```

```c++
 widget.h

#ifndef WIDGET_H
#define WIDGET_H

#include <QApplication>
#include <QWidget>
#include <QLabel>
#include <QPushButton>
#include <QVBoxLayout>
#include "mylineedit.h"

class Widget : public QWidget
{
	Q_OBJECT
	
	public:
		Widget(QWidget *parent=nullptr);
		~Widget();
		
	private slots:
		void on_btn1_clicked();

	private:
		QLabel *label;
		QLineEdit *line1;
		MyLineEdit *line2;
		QPushButton *btn1;
		QVBoxLayout *vbox;
};
#endif // WIDGET_H
```

```c++
 widget.cpp

#include "widget.h"

Widget::Widget(QWidget *parent)
	: QWidget(parent)
{
	label = new QLabel("Устано&вить фокус на поле 1");
	line1 = new QLineEdit();
	label->setBuddy(line1);
	
	line2 = new MyLineEdit();
	line2->id = line2->grabShortcut(QKeySequence::mnemonic("&е"));
	
	btn1 = new QPushButton("&Убрать фокус с поля 1");
	vbox = new QVBoxLayout();
	vbox->addWidget(label);
	vbox->addWidget(line1);
	vbox->addWidget(line2);
	vbox->addWidget(btn1);
	setLayout(vbox);
	
	QObject::connect(btn1, SIGNAL(clicked()), this, SLOT(on_btn1_clicked()));
}

void Widget::on_btn1_clicked()
{
	line1->clearFocus();
}

Widget::~Widget() {}
```

```c++
main.cpp

#include "widget.h"

int main(int argc, char *argv[])
{
	QApplication app(argc, argv);
	
	Widget window;
	window.setWindowTitle("Назначение клавиш быстрого доступа");
	window.resize(350, 150);
	window.show();
	
	return app.exec();
}
```

Помимо рассмотренных способов для назначения клавиш быстрого доступа можно воспользоваться классом [[QShortcut|QShortcut]]. В этом случае назначение клавиш для первого текстового поля будет выглядеть так:

```c++
// widget.h
QShortcut *shortcut;

// widget.cpp
line1 = new QLineEdit();

shortcut = new QShortcut(QKeySequence::mnemonic("&ф"), this);
shortcut->setContext(Qt::WindowShortcut);

QObject::connect(shortcut, SIGNAL(activated()), line1, SLOT(setFocus()));
```

Назначить комбинацию быстрых клавиш позволяет также класс [[QAction|QAction]]. Назначение клавиш для первого текстового поля выглядит следующим образом:

```c++
// widget.h
QAction *action;

// widget.cpp
line1 = new QLineEdit();
action = new QAction(this);
action->setShortcut(QKeySequence::mnemonic("&ф"));

QObject::connect(action, SIGNAL(triggered()), line1, SLOT(setFocus()));

addAction(action);
```

### Нажатие и отпускание клавиши клавиатуры

При нажатии и отпускании клавиши вызываются следующие методы:

> **keyPressEvent()** — вызывается при нажатии клавиши клавиатуры. Если клавишу удерживать нажатой, то событие генерируется постоянно, пока клавиша не будет отпущена. Прототип метода:
```c++
virtual void keyPressEvent(QKeyEvent *event)
```

> **keyReleaseEvent()** — вызывается при отпускании ранее нажатой клавиши. Прототип метода:
```c++
virtual void keyReleaseEvent(QKeyEvent *event)
```

Через параметр доступен экземпляр класса [[QKeyEvent|QKeyEvent]], который позволяет получить дополнительную информацию о событии. Класс [[QKeyEvent|QKeyEvent]] содержит следующие методы (перечислены только основные методы; полный список смотрите в документации по классу [[QKeyEvent|QKeyEvent]]):

> **key()** — возвращает код нажатой клавиши. Прототип метода:
```c++
int key() const
```
Пример определения клавиши:
```c++
if (e->key() == Qt::Key_B) {
	qDebug() << "Нажата клавиша <B>";
}
```

> **text()** — возвращает текстовое представление символа в кодировке `Unicode`. Если клавиша является специальной, то возвращается пустая строка. Прототип метода:
```c++
QString text() const
```

> **modifiers()** — позволяет определить, какие клавиши-модификаторы (`<Shift>`, `<Ctrl>`, `<Alt>` и др.) были нажаты вместе с клавишей. Прототип метода:
```c++
Qt::KeyboardModifiers modifiers() const
```

Может содержать значения следующих констант (или комбинацию значений):
* ==Qt::NoModifier== — модификаторы не нажаты;
* ==Qt::ShiftModifier== — нажата клавиша `<Shift>`;
* ==Qt::ControlModifier== — нажата клавиша `<Ctrl>`;
* ==Qt::AltModifier== — нажата клавиша `<Alt>`;
* ==Qt::MetaModifier== — нажата клавиша `<Meta>`;
* ==Qt::KeypadModifier==;
* ==Qt::GroupSwitchModifier==.

Пример определения модификатора `<Shift>`:
```c++
if (e->modifiers() & Qt::ShiftModifier) {
	qDebug() << "Нажат модификатор Shift";
}
```

> **isAutoRepeat()** — возвращает значение `true`, если событие вызвано повторно удержанием клавиши нажатой, и `false` — в противном случае. Прототип метода:
```c++
bool isAutoRepeat() const
```

> **matches()** — возвращает значение `true`, если нажата специальная комбинация клавиш, соответствующая указанному значению и `false` — в противном случае. Прототип метода:
```c++
bool matches(QKeySequence::StandardKey key) const
```

В качестве значения указываются константы из класса [[QKeySequence|QKeySequence]], например ==QKeySequence::Copy== для комбинации клавиш `<Ctrl>+<C>` (копировать). Полный список констант смотрите в документации по классу [[QKeySequence|QKeySequence]]. Пример:
```c++
if (e->matches(QKeySequence::Copy)) {
	qDebug() << "Нажата комбинация <Ctrl>+<C>";
}
```

При обработке нажатия клавиш следует учитывать, что:

> компонент должен иметь возможность принимать фокус ввода. Некоторые компоненты не могут принимать фокус ввода по умолчанию, например надпись. Чтобы изменить способ получения фокуса, следует воспользоваться методом `setFocusPolicy()`;

> чтобы захватить эксклюзивный ввод с клавиатуры, следует воспользоваться методом `grabKeyboard()`, а чтобы освободить ввод — методом `releaseKeyboard()`;

> можно перехватить нажатие любых клавиш, кроме клавиши `<Tab>` и комбинации `<Shift>+<Tab>`. Эти клавиши используются для передачи фокуса следующему и предыдущему компоненту соответственно. Перехватить нажатие этих клавиш можно только в методе `event()`:

> если событие обработано, то нужно вызвать метод `accept()` через объект события. Чтобы родительский компонент мог получить событие, вместо метода `accept()` необходимо вызвать метод `ignore()`.

## События мыши

События мыши обрабатываются не реже, чем события клавиатуры. С помощью специальных методов можно обработать нажатие и отпускание кнопки мыши, перемещение указателя, а также вхождение указателя в область компонента и выхода из этой области. В зависимости от ситуации можно изменить вид указателя, например при выполнении длительной операции отобразить указатель в виде песочных часов. В этом разделе мы рассмотрим изменение вида указателя мыши как для отдельного компонента, так и для всего приложения.

### Нажатие и отпускание кнопки мыши

При нажатии и отпускании кнопки мыши вызываются следующие методы:

> **mousePressEvent()** — вызывается при нажатии кнопки мыши. Прототип метода:
```c++
virtual void mousePressEvent(QMouseEvent *event)
```

> **mouseReleaseEvent()** — вызывается при отпускании ранее нажатой кнопки мыши. Прототип метода:
```c++
virtual void mouseReleaseEvent(QMouseEvent *event)
```

> **mouseDoubleClickEvent()** — вызывается при двойном щелчке мышью в области компонента. Прототип метода:
```c++
virtual void mouseDoubleClickEvent(QMouseEvent *event)
```

Следует учитывать, что двойному щелчку предшествуют другие события. Последовательность событий при двойном щелчке выглядит так:

```
Событие MouseButtonPress
Событие MouseButtonRelease
Событие MouseButtonDblClick
Событие MouseButtonPress
Событие MouseButtonRelease
```

Задать интервал двойного щелчка позволяет метод `setDoubleClickInterval()` из класса [[QApplication|QApplication]]. Получить значение интервала можно с помощью метода `doubleClickInterval()`. Прототипы методов:

```c++
void setDoubleClickInterval(int)
int doubleClickInterval()
```

Через параметр доступен экземпляр класса `QMouseEvent`, который позволяет получить дополнительную информацию о событии. Класс `QMouseEvent` содержит следующие методы:

> **position()** — возвращает экземпляр класса [[QPoint#QPointF|QPointF]] с вещественными координатами в пределах области компонента. Прототип метода:
```c++
QPointF position() const
```

> **scenePosition()** — возвращает координаты относительно окна или сцены. Прототип метода:
```c++
QPointF scenePosition() const
```

> **globalPosition()** — возвращает экземпляр класса QPointF с координатами в пределах экрана. Прототип метода:
```c++
QPointF globalPosition() const
```

> **button()** — позволяет определить, какая кнопка мыши вызвала событие. Прототип метода:
```c++
Qt::MouseButton button() const
```

Возвращает значение одной из следующих констант:

* **Qt::NoButton** — кнопки не нажаты. Это значение возвращается методом `button()` при перемещении указателя мыши;
* **Qt::LeftButton** — нажата левая кнопка мыши;
* **Qt::RightButton** — нажата правая кнопка мыши;
* **Qt::MiddleButton** — нажата средняя кнопка мыши;

> **buttons()** — позволяет определить все кнопки, которые нажаты одновременно. Возвращает комбинацию значений констант `Qt::LeftButton`, `Qt::RightButton` и `Qt::MiddleButton`. Прототип метода:
```c++
Qt::MouseButtons buttons() const
```

Пример определения кнопки мыши:

```c++
if (e->buttons() & Qt::LeftButton) {
	qDebug() << "Нажата левая кнопка мыши";
}
```

> **modifiers()** — позволяет определить, какие клавиши-модификаторы (`<Shift>`, `<Ctrl>`, `<Alt>` и др.) были нажаты вместе с кнопкой мыши. Прототип метода:
```c++
Qt::KeyboardModifiers modifiers() const
```

Если событие обработано, то нужно вызвать метод `accept()` через объект события. Чтобы родительский компонент мог получить событие, вместо метода `accept()` необходимо вызвать метод `ignore()`.

Если для компонента опция `Qt::WA_NoMousePropagation` установлена в истинное значение, то событие мыши не будет передаваться родительскому компоненту. Значение можно изменить с помощью метода `setAttribute()`:
```c++
setAttribute(Qt::WA_NoMousePropagation, true);
```

По умолчанию событие мыши перехватывает компонент, над которым произведен щелчок мышью. Чтобы перехватывать нажатие и отпускание мыши вне компонента, следует захватить мышь с помощью метода `grabMouse()`. Освободить захваченную ранее мышь позволяет метод `releaseMouse()`. Прототипы методов:
```c++
void grabMouse()
void grabMouse(const QCursor &cursor)
void releaseMouse()
```

### Перемещение указателя

Чтобы обработать перемещение указателя мыши, необходимо переопределить метод `mouseMoveEvent()`. Прототип метода:

```c++
virtual void mouseMoveEvent(QMouseEvent *event)
```

Через параметр доступен экземпляр класса [[QMoveEvent|QMouseEvent]], который позволяет получить дополнительную информацию о событии. Методы этого класса мы рассматривали в предыдущем разделе. Следует учитывать, что метод `button()` при перемещении мыши возвращает значение константы `Qt::NoButton`.

По умолчанию метод `mouseMoveEvent()` вызывается только в том случае, если при перемещении удерживается нажатой какая-либо кнопка мыши. Это сделано специально, чтобы не создавать лишних событий при обычном перемещении указателя мыши. Если необходимо обрабатывать любые перемещения указателя в пределах компонента, то следует вызвать метод `setMouseTracking()` из класса [[QWidget|QWidget]] и передать ему значение `true`. Чтобы обработать все перемещения внутри окна, нужно дополнительно захватить мышь с помощью метода `grabMouse()`. Прототипы методов:

```c++
void setMouseTracking(bool enable)
void grabMouse()
void grabMouse(const QCursor &cursor)
```

Метод `position()` объекта события возвращает позицию точки в системе координат компонента. Чтобы преобразовать эти координаты точки в систему координат родительского компонента или в глобальную систему координат, следует воспользоваться следующими методами из класса [[QWidget|QWidget]]:

> **mapToGlobal()** — преобразует координаты точки из системы координат компонента в глобальную систему координат. Прототипы метода:
```c++
QPoint mapToGlobal(const QPoint &pos) const
QPointF mapToGlobal(const QPointF &pos) const
```

> **mapFromGlobal()** — преобразует координаты точки из глобальной системы координат в систему координат компонента. Прототипы метода:
```c++
QPoint mapFromGlobal(const QPoint &pos) const
QPointF mapFromGlobal(const QPointF &pos) const
```

> **mapToParent()** — преобразует координаты точки из системы координат компонента в систему координат родительского компонента. Если компонент не имеет родителя, то метод аналогичен методу `mapToGlobal()`. Прототипы метода:
```c++
QPoint mapToParent(const QPoint &pos) const
QPointF mapToParent(const QPointF &pos) const
```

> **mapFromParent()** — преобразует координаты точки из системы координат родительского компонента в систему координат данного компонента. Если компонент не имеет родителя, то метод аналогичен методу `mapFromGlobal()`. Прототипы метода:
```c++
QPoint mapFromParent(const QPoint &pos) const
QPointF mapFromParent(const QPointF &pos) const
```

> **mapTo()** — преобразует координаты точки из системы координат компонента в систему координат родительского компонента parent. Прототипы метода:
```c++
QPoint mapTo(const QWidget *parent, const QPoint &pos) const
QPointF mapTo(const QWidget *parent, const QPointF &pos) const
```

> **mapFrom()** — преобразует координаты точки из системы координат родительского компонента parent в систему координат данного компонента. Прототипы метода:
```c++
QPoint mapFrom(const QWidget *parent, const QPoint &pos) const
QPointF mapFrom(const QWidget *parent, const QPointF &pos) const
```

### Наведение и выведение указателя

Обработать наведение указателя мыши на компонент и выведение указателя позволяют следующие методы:

> **enterEvent()** — вызывается при наведении указателя мыши на область компонента. Прототип метода:
```c++
virtual void enterEvent(QEnterEvent *event)
```

> **leaveEvent()** — вызывается, когда указатель мыши покидает область компонента. Прототип метода:
```c++
virtual void leaveEvent(QEvent *event)
```

### Прокрутка колесика мыши

Некоторые мыши комплектуются колесиком, которое обычно используется для управления прокруткой некоторой области. Обработать поворот этого колесика позволяет метод `wheelEvent()`. Прототип метода:

```c++
virtual void wheelEvent(QWheelEvent *event)
```

Через параметр доступен экземпляр класса [[QWheelEvent|QWheelEvent]], который позволяет получить дополнительную информацию о событии. Класс [[QWheelEvent|QWheelEvent]] содержит следующие методы:

> **angleDelta()** — возвращает угол поворота колесика по осям `X` и `Y`. Значение может быть положительным или отрицательным в зависимости от направления поворота. Прототип метода:
```c++
QPoint angleDelta() const
```

> **position()** — возвращает экземпляр класса [[QPoint#QPointF|QPointF]] с вещественными координатами в пределах области компонента. Прототип метода:
```c++
QPointF position() const
```

> **scenePosition()** — возвращает координаты относительно окна или сцены. Прототип метода:
```c++
QPointF scenePosition() const
```

> **globalPosition()** — возвращает экземпляр класса [[QPoint#QPointF|QPointF]] с координатами в пределах экрана. Прототип метода:
```c++
QPointF globalPosition() const
```

> **buttons()** — позволяет определить все кнопки, которые нажаты одновременно. Возвращает комбинацию значений констант `Qt::LeftButton`, `Qt::RightButton` и `Qt::MiddleButton`. Прототип метода:
```c++
Qt::MouseButtons buttons() const
```

Пример определения кнопки мыши:

```c++
if (e->buttons() & Qt::LeftButton) {
	qDebug() << "Нажата левая кнопка мыши";
}
```

> **modifiers()** — позволяет определить, какие клавиши-модификаторы (`<Shift>`, `<Ctrl>`, `<Alt>` и др.) были нажаты вместе с кнопкой мыши. [[process signal and event#Нажатие и отпускание клавиши клавиатуры|Возможные значения]]. Прототип метода:
```c++
Qt::KeyboardModifiers modifiers() const
```

Если событие обработано, то нужно вызвать метод `accept()` через объект события. Чтобы родительский компонент мог получить событие, вместо метода `accept()` необходимо вызвать метод `ignore()`.

### Изменение внешнего вида указателя мыши

Для изменения внешнего вида указателя мыши при вхождении указателя в область компонента предназначены следующие методы из класса [[QWidget|QWidget]]:

> **setCursor()** — задает внешний вид указателя мыши для компонента. Прототип метода:
```c++
void setCursor(const QCursor &)
```

В качестве параметра указывается экземпляр класса [[QCursor|QCursor]]. Конструктору класса можно передать следующие константы: `Qt::ArrowCursor` (стандартная стрелка), `Qt::UpArrowCursor` (стрелка, направленная вверх), `Qt::CrossCursor` (крестообразный указатель), `Qt::WaitCursor` (курсор выполнения операции, например песочные часы), `Qt::IBeamCursor` (I-образный указатель), `Qt::SizeVerCursor` (стрелки, направленные вверх и вниз), `Qt::SizeHorCursor` (стрелки, направленные влево и вправо), `Qt::SizeBDiagCursor`, `Qt::SizeFDiagCursor`, `Qt::SizeAllCursor` (стрелки, направленные вверх, вниз, влево и вправо), `Qt::BlankCursor` (пустой указатель), `Qt::SplitVCursor`, `Qt::SplitHCursor`, `Qt::PointingHandCursor` (указатель в виде руки), `Qt::ForbiddenCursor` (перечеркнутый круг), `Qt::OpenHandCursor` (разжатая рука), `Qt::ClosedHandCursor` (сжатая рука), `Qt::WhatsThisCursor` (стрелка с вопросительным знаком), `Qt::BusyCursor` (стрелка с песочными часами или вращающимся кругом), `Qt::DragMoveCursor`, `Qt::DragCopyCursor` и `Qt::DragLinkCursor`. Пример:

```c++
setCursor(QCursor(Qt::WaitCursor));
```

> **unsetCursor()** — отменяет установку указателя для компонента. В результате внешний вид указателя мыши будет наследоваться от родительского компонента. Прототип метода:
```c++
void unsetCursor()
```

> **cursor()** — возвращает экземпляр класса [[QCursor|QCursor]] с текущим курсором. Прототип метода:
```c++
QCursor cursor() const
```

Управлять текущим видом курсора для всего приложения сразу можно с помощью следующих статических методов из класса [[QApplication|QApplication]]:

> **setOverrideCursor()** — задает внешний вид указателя мыши для всего приложения. Прототип метода:
```c++
static void setOverrideCursor(const QCursor &cursor)
```

В качестве параметра указывается экземпляр класса [[QCursor|QCursor]]. Для отмены установки необходимо вызвать метод `restoreOverrideCursor()`;

> **restoreOverrideCursor()** — отменяет изменение внешнего вида курсора для всего приложения. Прототип метода:
```c++
static void restoreOverrideCursor()
```

Пример:

```c++
QApplication::setOverrideCursor(QCursor(Qt::WaitCursor));

// Выполняем длительную операцию
QApplication::restoreOverrideCursor();
```

> **changeOverrideCursor()** — изменяет внешний вид указателя мыши для всего приложения. Если до вызова этого метода не вызывался метод `setOverrideCursor()`, то указанное значение игнорируется. В качестве параметра указывается экземпляр класса [[QCursor|QCursor]]. Прототип метода:
```c++
static void changeOverrideCursor(const QCursor &cursor)
```

> **overrideCursor()** — возвращает указатель на экземпляр класса [[QCursor|QCursor]] с текущим курсором или нулевой указатель. Прототип метода:
```c++
static QCursor *overrideCursor()
```

Изменять внешний вид указателя мыши для всего приложения принято на небольшой промежуток времени, обычно на время выполнения какой-либо операции, в процессе которой приложение не может нормально реагировать на действия пользователя. Чтобы информировать об этом пользователя, указатель принято выводить в виде песочных часов или вращающегося круга (константа `Qt::WaitCursor`).

Метод `setOverrideCursor()` может быть вызван несколько раз. В этом случае курсоры помещаются в стек. Каждый вызов метода `restoreOverrideCursor()` удаляет последний курсор, добавленный в стек. Для нормальной работы приложения необходимо вызывать методы `setOverrideCursor()` и `restoreOverrideCursor()` одинаковое количество раз.

Класс [[QCursor|QCursor]] позволяет создать объект курсора с изображением любой формы. Прототипы конструкторов:

```c++
QCursor()
QCursor(Qt::CursorShape shape)
QCursor(const QPixmap &pixmap, int hotX = -1, int hotY = -1)
QCursor(const QBitmap &bitmap, const QBitmap &mask, int hotX = -1,
		int hotY = -1)
QCursor(const QCursor &c)
QCursor(QCursor &&other
```

Чтобы загрузить изображение, следует передать путь к файлу конструктору класса [[QPixmap|QPixmap]]. Чтобы создать объект курсора, необходимо передать конструктору класса [[QCursor|QCursor]] в первом параметре экземпляр класса [[QPixmap|QPixmap]], а во втором и третьем параметрах — координаты «горячей» точки. Пример создания и установки пользовательского курсора:

```c++
QPixmap pix("C:\\cpp\\projectsQt\\Test\\cursor.png");
setCursor(QCursor(pix, 0, 0));
```

Класс [[QCursor|QCursor]] содержит также два статических метода:

> **pos()** — возвращает экземпляр класса [[QPoint|QPoint]] с координатами указателя мыши относительно экрана. Прототипы метода:
```
static QPoint pos()
static QPoint pos(const QScreen *screen)
```

Пример:
```c++
qDebug() << QCursor::pos(); // QPoint(1024,520)
```

> **setPos()** — позволяет задать позицию указателя мыши. Прототипы метода:
```c++
static void setPos(int x, int y)
static void setPos(const QPoint &p)
static void setPos(QScreen *screen, int x, int y)
static void setPos(QScreen *screen, const QPoint &p)
```

## Технология drag & drop

Технология `drag&drop` позволяет обмениваться данными различных типов между компонентами как одного приложения, так и разных приложений путем перетаскивания и сбрасывания объектов с помощью мыши. Типичным примером использования технологии служит перемещение файлов в программе Проводник в Windows.

Чтобы переместить файл в другой каталог, достаточно нажать левую кнопку мыши над значком файла и, не отпуская кнопку, перетащить файл на значок каталога, а затем отпустить кнопку мыши. Если необходимо скопировать файл, а не переместить, то следует дополнительно удерживать нажатой клавишу `<Ctrl>`.

### Запуск перетаскивания

Операция перетаскивания состоит из двух частей. Первая часть запускает процесс, а вторая часть обрабатывает момент сброса объекта. Обе части могут обрабатываться как одним приложением, так и двумя разными приложениями. Запуск перетаскивания осуществляется следующим образом:

> внутри метода `mousePressEvent()` запоминаются координаты щелчка левой кнопкой мыши;
> 
> внутри метода `mouseMoveEvent()` вычисляется пройденное расстояние или измеряется время операции. Это необходимо сделать, чтобы предотвратить случайное перетаскивание. Управлять задержкой позволяют следующие статические методы класса [[QApplication|QApplication]]:
>  > - **startDragDistance()** — возвращает минимальное расстояние, после прохождения которого можно запускать операцию перетаскивания;
>  > 
>  > - **setStartDragDistance()** — задает расстояние;
>  > -
>  > - **startDragTime()** — возвращает время задержки в миллисекундах перед запуском операции перетаскивания;
>  > 
>  > - **setStartDragTime()** — задает время задержки;
>
> Прототипы методов:
```c++
static int startDragDistance()
static void setStartDragDistance(int l)
static int startDragTime()
static void setStartDragTime(int ms)
```

> если пройдено минимальное расстояние или истек минимальный промежуток времени, то создается экземпляр класса [[QDrag|QDrag]] и вызывается метод `exec()`, который после завершения операции возвращает действие, выполненное с данными (например, данные скопированы или перемещены)

Создать экземпляр класса [[QDrag|QDrag]] можно так:
```c++
QDrag *drag = new QDrag(this);
```

Класс [[QDrag|QDrag]] содержит следующие методы:

> **exec()** — запускает процесс перетаскивания и возвращает действие, которое было выполнено по завершении операции. Прототипы метода:
```c++
Qt::DropAction exec(Qt::DropActions supportedActions = Qt::MoveAction)
Qt::DropAction exec(Qt::DropActions supportedActions,
					Qt::DropAction defaultDropAction)
```
> В параметре `supportedActions` указывается комбинация допустимых действий, а в параметре `defaultDropAction` — действие, которое используется, если не нажаты клавиши-модификаторы. Возможные действия могут быть заданы следующими константами: `Qt::CopyAction` (копирование), `Qt::MoveAction` (перемещение), `Qt::LinkAction` (ссылка), `Qt::IgnoreAction` (действие проигнорировано), `Qt::TargetMoveAction`. Пример:
```c++
Qt::DropAction action = 
				drag->exec(Qt::MoveAction | Qt::CopyAction, Qt::MoveAction);
```

> **setMimeData()** — позволяет задать перемещаемые данные. В качестве значения указывается экземпляр класса [[QMimeData|QMimeData]]. Прототип метода:
```c++
void setMimeData(QMimeData *data)
```
> Пример передачи текста:
```c++
QMimeData *data = new QMimeData();
data->setText("Перетаскиваемый текст");
QDrag *drag = new QDrag(this);
drag->setMimeData(data);
```

> **mimeData()** — возвращает указатель на экземпляр класса [[QMimeData|QMimeData]] с перемещаемыми данными. Прототип метода:
```c++
QMimeData *mimeData() const
```

> **setPixmap()** — задает изображение, которое будет перемещаться вместе с указателем мыши. В качестве параметра указывается экземпляр класса [[QPixmap|QPixmap]]. Прототип метода:
```c++
void setPixmap(const QPixmap &pixmap)
```
> Пример:
```c++
drag->setPixmap(QPixmap("C:\\cpp\\projectsQt\\Test\\pixmap.png"));
```

> **pixmap()** — возвращает экземпляр класса [[QPixmap|QPixmap]] с изображением, которое перемещается вместе с указателем. Прототип метода:
```c++
QPixmap pixmap() const
```

> **setHotSpot()** — задает координаты «горячей» точки на перемещаемом изображении. В качестве параметра указывается экземпляр класса [[QPoint|QPoint]]. Прототип метода:
```c++
void setHotSpot(const QPoint &hotspot)
```
> Пример:
```c++
drag->setHotSpot(QPoint(40, 40));
```

> **hotSpot()** — возвращает экземпляр класса [[QPoint|QPoint]] с координатами «горячей» точки на перемещаемом изображении. Прототип метода:
```c++
QPoint hotSpot() const
```

> **setDragCursor()** — позволяет изменить внешний вид указателя мыши для действия, указанного во втором параметре. Прототип метода:
```c++
void setDragCursor(const QPixmap &cursor, Qt::DropAction action)
```
> В первом параметре указывается экземпляр класса [[QPixmap|QPixmap]], а во втором параметре — константы `Qt::CopyAction`, `Qt::MoveAction` или `Qt::LinkAction`. Пример изменения указателя для перемещения:
```c++
drag->setDragCursor(QPixmap("C:\\cpp\\projectsQt\\Test\\cursor.png"),
					Qt::MoveAction);
```

> **source()** — возвращает указатель на компонент-источник. Прототип метода:
```c++
QObject *source() const
```

> **target()** — возвращает указатель на компонент-приемник или нулевой указатель, если компонент находится в другом приложении. Прототип метода:
```c++
QObject *target() const
```

Класс [[QDrag|QDrag]] поддерживает два сигнала:
> **actionChanged(Qt::DropAction)** — генерируется при изменении действия;
> 
> **targetChanged(QObject*)** — генерируется при изменении принимающего компонента.

Пример назначения обработчика сигнала `actionChanged()`:

```c++
connect(drag, SIGNAL(actionChanged(Qt::DropAction)),
						this, SLOT(on_action_changed(Qt::DropAction)));
```

### Класс QMimeData

[[QMimeData|см. QMimeData]]

#### Обработка сброса

Прежде чем обрабатывать перетаскивание и сбрасывание объекта, необходимо сообщить системе, что компонент может обрабатывать эти события. Для этого внутри конструктора компонента следует вызвать метод `setAcceptDrops()` из класса [[QWidget|QWidget]] и передать ему значение `true`. Прототип метода:
```c++
void setAcceptDrops(bool on)
```

Пример:
```c++
setAcceptDrops(true);
```

Обработка перетаскивания и сброса объекта выполняется следующим образом:
> внутри метода `dragEnterEvent()` проверяется MIME-тип перетаскиваемых данных и действие. Если компонент способен обработать сброс этих данных и соглашается с предложенным действием, то необходимо вызвать метод `acceptProposedAction()` через объект события. Если нужно изменить действие, то методу `setDropAction()` передается новое действие, а затем вызывается метод `accept()`, а не метод `acceptProposedAction()`;
>
> если необходимо ограничить область сброса некоторым участком компонента, то можно дополнительно определить метод `dragMoveEvent()`. Этот метод будет постоянно вызываться при перетаскивании внутри области компонента. При согласии со сбрасыванием следует вызвать метод `accept()`, которому можно передать экземпляр класса [[QRect|QRect]] с координатами и размером участка. Если параметр указан, то при перетаскивании внутри участка метод `dragMoveEvent()` повторно вызываться не будет;
>
> внутри метода `dropEvent()` производится обработка сброса.

Обработать события, возникающие при перетаскивании и сбрасывании объектов, позволяют следующие методы:
> **dragEnterEvent()** — вызывается, когда перетаскиваемый объект входит в область компонента. Через параметр доступен указатель на экземпляр класса [[QDragEnterEvent|QDragEnterEvent]]. Прототип метода:
```c++
virtual void dragEnterEvent(QDragEnterEvent *event)
```

> **dragLeaveEvent()** — вызывается, когда перетаскиваемый объект покидает область компонента. Через параметр доступен указатель на экземпляр класса [[QDragLeaveEvent|QDragLeaveEvent]]. Прототип метода:
```c++
virtual void dragLeaveEvent(QDragLeaveEvent *event)
```

> **dragMoveEvent()** — вызывается при перетаскивании объекта внутри области компонента. Через параметр доступен указатель на экземпляр класса [[QDragMoveEvent|QDragMoveEvent]]. Прототип метода:
```c++
virtual void dragMoveEvent(QDragMoveEvent *event)
```

> **dropEvent()** — вызывается при сбрасывании объекта в области компонента. Через параметр доступен указатель на экземпляр класса [[QDropEvent|QDropEvent]]. Прототип метода:
```c++
virtual void dropEvent(QDropEvent *event)
```

Некоторые компоненты в Qt по умолчанию поддерживают технологию `drag & drop`, например в однострочное текстовое поле можно перетащить текст из другого приложения. Поэтому, прежде чем изобретать свой «велосипед», убедитесь, что поддержка технологии в компоненте не реализована.

## Работа с буфером обмена

Помимо технологии `drag&drop` для обмена данными между приложениями используется буфер обмена [[QClipboard|см. QClipboard]]. 

















































