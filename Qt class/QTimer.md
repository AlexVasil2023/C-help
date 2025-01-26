# QTimer

Конструктор класса имеет следующий формат:
```c++
#include <QTimer>
QTimer(QObject *parent = nullptr)
```

Методы класса:

> **setInterval()** — задает промежуток времени в миллисекундах, по истечении которого генерируется сигнал `timeout()`. Минимальное значение интервала зависит от операционной системы. Если в параметре указать значение 0, то таймер будет срабатывать много раз при отсутствии других необработанных сигналов. 
> Прототипы метода:
```c++
void setInterval(int msec)
void setInterval(std::chrono::milliseconds value)
```

> **start()** — запускает таймер. В необязательном параметре можно указать промежуток времени в миллисекундах. Если параметр не указан, то используется значение, возвращаемое методом `interval()`. Метод является слотом. 
> Прототипы метода:
```c++
void start()
void start(int msec)
void start(std::chrono::milliseconds msec)
```

> **stop()** — останавливает таймер. Метод является слотом. Прототип метода:
```c++
void stop()
```

> **setSingleShot()** — если в параметре указано значение `true`, то таймер будет срабатывать только один раз, в противном случае — многократно. Прототип метода:
```c++
void setSingleShot(bool singleShot)
```

> **interval()** — возвращает установленный интервал. Прототип метода:
```c++
int interval() const
```

> **timerId()** — возвращает идентификатор таймера или значение `–1`. Прототип метода:
```c++
int timerId() const
```

> **isSingleShot()** — возвращает значение `true`, если таймер будет срабатывать только один раз, и `false` — в противном случае. Прототип метода:
```c++
bool isSingleShot() const
```

> **isActive()** — возвращает значение `true`, если таймер генерирует сигналы, и `false` — в противном случае. Прототип метода:
```c++
bool isActive() const
```

используем класс `QTimer` вместо методов `startTimer()` и `killTimer()`. Содержимое файла `widget.h`, `widget.cpp` и `main.cpp` приведено ниже:

```c++
widget.h

#ifndef WIDGET_H
#define WIDGET_H

#include <QApplication>
#include <QWidget>
#include <QLabel>
#include <QPushButton>
#include <QVBoxLayout>
#include <QTime>
#include <QTimer>

class Widget : public QWidget
{
	Q_OBJECT
	
	public:
		Widget(QWidget *parent=nullptr);
		~Widget();

	private slots:
		void on_btn1_clicked();
		void on_btn2_clicked();
		void on_timeout();
		
	private:
		QLabel *label;
		QPushButton *btn1;
		QPushButton *btn2;
		QVBoxLayout *vbox;
		QTimer *timer;
};
#endif // WIDGET_H
```

```c++
widget.cpp

#include "widget.h"

Widget::Widget(QWidget *parent)
: QWidget(parent)
{
	timer = new QTimer(this);
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
	connect(timer, SIGNAL(timeout()), this, SLOT(on_timeout()));
}

void Widget::on_btn1_clicked()
{
	timer->start(1000); // 1 секунда
	btn1->setEnabled(false);
	btn2->setEnabled(true);
}

void Widget::on_btn2_clicked()
{
	timer->stop();
	btn1->setEnabled(true);
	btn2->setEnabled(false);
}

void Widget::on_timeout()
{
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
	window.setWindowTitle("Использование класса QTimer");
	window.resize(350, 100);
	window.show();
	
	return app.exec();
}
```

Кроме перечисленных методов в классе `QTimer` определен статический метод `singleShot()`, предназначенный для вызова указанного обработчика через заданный промежуток времени. Таймер срабатывает только один раз. Прототипы метода:

```c++
static void singleShot(int msec, const QObject *receiver, const char *member)

static void singleShot(int msec, Qt::TimerType timerType,
						const QObject *receiver, const char *member)
						
static void singleShot(int msec, const QObject *receiver,
						PointerToMemberFunction method)
						
static void singleShot(int msec, Qt::TimerType timerType,
						const QObject *receiver, PointerToMemberFunction method)
						
static void singleShot(int msec, Functor functor)

static void singleShot(int msec, Qt::TimerType timerType, Functor functor)

static void singleShot(int msec, const QObject *context, Functor functor)

static void singleShot(int msec, Qt::TimerType timerType,
						const QObject *context, Functor functor)
						
static void singleShot(std::chrono::milliseconds msec,
						const QObject *receiver, const char *member)
						
static void singleShot(std::chrono::milliseconds msec,
						Qt::TimerType timerType, const QObject *receiver,
						const char *member)
```

Примеры использования статического метода `singleShot()`:

```c++
QTimer::singleShot(2000, this, SLOT(on_timeout()));
QTimer::singleShot(10000, qApp, SLOT(quit()));
```











