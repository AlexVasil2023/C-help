# Объект QObject

Как было описано во введении, `QObject` позволяет реализовать многие основные функции Qt, такие как сигналы и слоты. Это реализуется с помощью интроспекции, которую и обеспечивает `QObject`. `QObject` является базовым классом почти всех классов в Qt. Исключение составляют такие типы значений, как [[QColor]] , [[QString]] и [[QList]].

Объект Qt - это стандартный объект C++, но с дополнительными возможностями. Их можно разделить на две группы: интроспекция и управление памятью. Первое означает, что объект Qt знает имя своего класса, его отношение к другим классам, а также свои методы и свойства. Концепция управления памятью означает, что каждый объект Qt может быть родителем дочерних объектов. Родитель владеет дочерними объектами, и когда родитель уничтожается, он отвечает за уничтожение своих дочерних объектов. 

Лучший способ понять, как способности `QObject` влияют на класс - это взять стандартный класс C++ и включить в него Qt. Приведенный ниже класс представляет собой обычный такой класс. 

Класс `person` представляет собой класс данных со свойствами `name` и `gender`. Класс `person` использует объектную систему Qt для добавления метаинформации к классу c++. Это позволяет пользователям объекта `person` подключаться к слотам и получать уведомления об изменении свойств.

```c++
class Person : public QObject
{
	Q_OBJECT // enabled meta object abilities
	
	// property declarations required for QML
	Q_PROPERTY(QString name READ name WRITE setName NOTIFY name
	Q_PROPERTY(Gender gender READ gender WRITE setGender NOTIFY
	
	// enables enum introspections
	Q_ENUM(Gender)

	// makes the type creatable in QML
	QML_ELEMENT
	
	public:
		// standard Qt constructor with parent for memory managemen
		Person(QObject *parent = 0);
		
		enum Gender { Unknown, Male, Female, Other };

		QString name() const;
		Gender gender() const;
		
	public slots: // slots can be connected to signals, or called
	
		void setName(const QString &);
		void setGender(Gender);
		
	signals: // signals can be emitted
		void nameChanged(const QString &name);
		void genderChanged(Gender gender);
		
	private:
		// data members
		QString m_name;
		Gender m_gender;
};
```

Конструктор передает родителя суперклассу и инициализирует его члены. Классы значений Qt инициализируются автоматически. В данном случае `QString` будет инициализироваться нулевой строкой (`QString::isNull()`), а член `gender` будет явно инициализирован неизвестным полом.

```c++
Person::Person(QObject *parent)
	: QObject(parent)
	, m_gender(Person::Unknown)
{ }
```

Функция `getter` называется по имени свойства и обычно является базовой функцией [[const|const]]. При изменении свойства сеттер выдает сигнал `changed`. Чтобы убедиться, что значение действительно изменилось, мы вставляем защитную функцию, которая сравнивает текущее значение с новым. Только когда значение отличается, мы присваиваем его переменной-члену и подаем сигнал `change`.

```c++
QString Person::name() const
{
	return m_name;
}

void Person::setName(const QString &name)
{
	if (m_name != name) // guard
	{
		m_name = name;
		emit nameChanged(m_name);
	}
}
```

Имея класс, производный от `QObject` , мы получили дополнительные возможности метаобъекта, которые можно исследовать с помощью метода [[metaObject|metaObject()]] . Например, получение имени класса из объекта.

```c++
Person* person = new Person();
person->metaObject()->className(); // "Person"
Person::staticMetaObject.className(); // "Person"
```

Существует множество других возможностей, доступ к которым можно получить с помощью базового класса `QObject` и метаобъекта. Пожалуйста, ознакомьтесь с документацией по [[metaObject|QMetaObject]]. 

> - `QObject`, а макрос `Q_OBJECT` имеет облегченного собрата: `Q_GADGET` . Макрос `Q_GADGET` может быть вставлен в секцию `private` классов, не являющихся производными от `QObject`, для раскрытия свойств и вызываемых методов. Следует иметь в виду, что объект `Q_GADGET` не может иметь сигналов, поэтому свойства не могут предоставлять сигнал уведомления об изменении. Тем не менее, это может быть полезно для обеспечения QML-подобного интерфейса к структурам данных, передаваемым из C++ в QML, без затрат на полноценный `QObject` .


























