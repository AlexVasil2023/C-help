# Рисование фигур
Некоторые проблемы лучше визуализировать. Если рассматриваемая проблема отдаленно напоминает геометрические объекты, то графическое представление Qt является хорошим кандидатом. Графическое представление организует простые геометрические фигуры в сцене. Пользователь может взаимодействовать с этими фигурами, либо они располагаются с помощью алгоритма. Для наполнения графического представления необходимо графическое
представление и графическая сцена. Сцена прикрепляется к представлению и заполняется графическими элементами.

Приведем небольшой пример. Сначала заголовочный файл с
объявлением вида и сцены
``` c++
class CustomWidgetV2 : public QWidget
{
	Q_OBJECT
	public:
		explicit CustomWidgetV2(QWidget *parent = 0);
	private:
		QGraphicsView *m_view;
		QGraphicsScene *m_scene;
};
```
В реализации сцена сначала прикрепляется к представлению. Представление является виджетом и размещается в нашем виджете-контейнере. В конце мы добавляем в виджет
небольшой прямоугольник в сцене, который затем отображается на экране.
```c++
include "customwidgetv2.h"

CustomWidget::CustomWidget(QWidget *parent) 
: QWidget(parent)
{
	m_view = new QGraphicsView(this);
	m_scene = new QGraphicsScene(this);
	
	m_view->setScene(m_scene);
	QVBoxLayout *layout = new QVBoxLayout(this);
	layout->setMargin(0);
	layout->addWidget(m_view);
	setLayout(layout);
	
	QGraphicsItem* rect1 = m_scene->addRect(0,0, 40, 40, Qt::No
	rect1->setFlags(QGraphicsItem::ItemIsFocusable|QGraphicsIte
}
```



