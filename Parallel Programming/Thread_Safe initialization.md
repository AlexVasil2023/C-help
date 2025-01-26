
[[#Потокобезопасная инициализация]] 3.3.4
1. [[#Константные выражения]] 3.3.4.1
2. [[#Функция std call_once и флаг std once_flag]] 3.3.4.2
3. [[#Локальные статические переменные]] 3.3.4.3

# Потокобезопасная инициализация

Если значение переменной никогда не изменяется, нет нужны синхронизировать доступ к ней с помощью дорогостоящих механизмов блокировки или даже атомарных переменных. Нужно лишь присвоить ей начальное значение потокобезопасным способом.

В языке C++ есть три способа потокобезопасной инициализации:

* константные выражения;
* функция `std::call_once` вместе с флагом `std::once_flag`;
* локальная статическая переменная.

> **Безопасная инициализация в главном потоке**
>
> Самый простой способ инициализировать переменную потокобезопасным образом – инициализировать её в главном потоке до создания всех остальных потоков.

## Константные выражения

Константные выражения – это выражения, значение которых может быть вычислено на этапе компиляции. Их вычисление неявно потокобезопасно. Ключевое слово [[constexpr|constexpr]], помещённое в начало объявления переменной, делает её константным выражением. Такая переменная должна быть проинициализирована при объявлении, например:

```c++
constexpr double pi = 3.14;
```

Помимо встроенных в язык типов, константными выражениями могут быть и объекты пользовательских типов. Чтобы объекты можно было вычислять во время компиляции, типы должны удовлетворять некоторым ограничениям:

> Стоит упомянуть ещё некоторые из перечисленных в стандарте ограничений. Функция `constexpr`, за исключением конструктора, должна содержать ровно один оператор `return`. Все параметры, возвращаемое значение (помимо конструктора) и локальные переменные такой функции должны иметь литеральный тип. В теле функции `constexpr` нельзя использовать операторы перехода `goto`, блоки `try` (до стандарта C++20), объявление переменной со статическим временем жизни или временем жизни потока. Конечно же, в теле функции `constexpr` нельзя вызывать функции, не являющиеся `constexpr`, – а таковы функции ввода-вывода и управления динамической памятью.  Возможности спецификатора `constexpr` сильно расширены в стандарте C++20: появилось даже понятия деструктора `constexpr`. За многочисленными подробностями рекомендуется обратиться к справочнику.

* тип не должен содержать ни виртуальных функций-членов, ни виртуальных базовых классов;
* конструктор должен быть объявлен с ключевым словом `constexpr`;
* все базовые классы и все нестатические члены-данные должны быть проинициализированы;
* все функции-члены, которые предполагается вычислять на этапе компиляции, должны также быть объявлены с ключевым словом `constexpr`.

Представленный ниже класс `MyDouble` удовлетворяет всем перечисленным условиям. Поэтому его экземпляры можно создавать на этапе компиляции. Инициализация переменных `constexpr` этого типа потокобезопасна.

**Вычисление констант пользовательского типа во время компиляции:**
```c++
// constexpr.cpp

#include <iostream>

class MyDouble{
	private:
		double myVal1;
		double myVal2;
	
	public:
		constexpr MyDouble(double v1,double v2):myVal1(v1),myVal2(v2){}
		constexpr double getSum() const { return myVal1 + myVal2; }
};

int main() {
	constexpr double myStatVal = 2.0;
	constexpr MyDouble myStatic(10.5, myStatVal);
	constexpr double sumStat = myStatic.getSum();
}
```

## Функция std::call_once и флаг std::once_flag

С помощью функции `std::call_once` можно зарегистрировать вызываемый объект, а с помощью флага `std::once_flag` – убедиться, что вызывается ровно один из них, и только один раз. На один флаг `std::once_flag` можно зарегистрировать сколько угодно вызываемых объектов (в частности, функций).

Функция `std::call_once` обладает следующими свойствами:

* выполняется только одна из зарегистрированных функций, и только один раз. Какая именно функция из множества зарегистрированных выбирается для выполнения, не определено. Выбранная функция выполняется в том же потоке, из которого вызвана функция `std::call_once`;
* из всех одновременных вызовов функции `std::call_once` ни один не завершается раньше, чем вызов выбранной для выполнения функции, о которой говорилось в предыдущем пункте;
* если выбранная для выполнения функция завершает работу с исключением, оно выбрасывается наружу из вызова функции `std::call_once` в вызвавший контекст. В этом случае для выполнения выбирается другая функция.

Следующий короткий пример иллюстрирует применение функции `std::call_once` с флагом `std::once_flag`. И функция, и тип объявлены в заголовочном файле `<mutex>`.

**Использование однократных действий:**
```c++
// callOnce.cpp

#include <iostream>
#include <thread>
#include <mutex>

std::once_flag onceFlag;

void do_once(){
	std::call_once(onceFlag, [](){ std::cout 
									<< “Only once.” << std::endl; });
}

void do_once2(){
	std::call_once(onceFlag, [](){ std::cout 
									<< “Only once2.” << std::endl; });
}

int main(){
	std::cout << std::endl;

	std::thread t1(do_once);
	std::thread t2(do_once);
	
	std::thread t3(do_once2);
	std::thread t4(do_once2);

	t1.join();
	t2.join();
	t3.join();
	t4.join();

	std::cout << std::endl;
}
```

В этой программе запускаются четыре потока. Два из них вызывают функцию `do_once`, а два других – функцию `do_once2`. Ожидаемый результат работы этой программы состоит в том, что на печать будет выведено ровно одно из сообщений: `«Only once»` (только раз) или `«Only once2»`.

Широко известный шаблон проектирования `«Одиночка»` (англ. singleton) призван гарантировать, что у некоторого класса создаётся только один экземпляр. Реализация этого шаблона в многопоточной среде оказывается непростым делом. Однако при наличии функции `std::call_once` и флага `std::once_flag` задача становится элементарной. Ниже показано, как инициализировать единичный экземпляр потокобезопасным образом.

**Инициализация единичного экземпляра класса:**
```c++
// singletonCallOnce.cpp

#include <iostream>
#include <mutex>

using namespace std;

class MySingleton{
	private:
		static once_flag initInstanceFlag;
		static MySingleton* instance;

		MySingleton() = default;
		~MySingleton() = default;

		static void initSingleton(){
			instance = new MySingleton();
		}

	public:
		MySingleton(const MySingleton&) = delete;
		MySingleton& operator=(const MySingleton&) = delete;

		static MySingleton* getInstance(){
			call_once(initInstanceFlag, MySingleton::initSingleton);
			
			return instance;
		}
};

MySingleton* MySingleton::instance = nullptr;
once_flag MySingleton::initInstanceFlag;

int main(){
	cout << endl;
	
		cout << “MySingleton::getInstance(): “
								<< MySingleton::getInstance() << endl;
		cout << “MySingleton::getInstance(): “
								<< MySingleton::getInstance() << endl;
	
	cout << endl;
}
```

Посмотрим сначала на статическую переменную-член `initInstanceFlag`, объявленную `static once_flag initInstanceFlag;` и проинициализированную в строке `once_flag MySingleton::initInstanceFlag;`. Этот флаг используется в статической функции-члене `getInstance` для гарантии того, что статическая функция-член `initSingleton` вызывается ровно один раз. В функции `initSingleton` создаётся единственный экземпляр класса.

> **Ключевые слова `default` и `delete`**
>
>Программист может заказать у компилятора некоторые особые функции-члены, указав ключевое слово `default`. Эти функции особенны тем, что компилятор может самостоятельно создать их реализации.
>
> Объявление функции-члена ключевым словом `delete`, напротив, означает исключение этой функции из интерфейса класса, подавляет создание реализации компилятором и, как следствие, делает невозможным её вызов. Попытка вызвать такую функцию-член приводит к ошибке компиляции. Подробности о ключевых словах `default` и `delete` можно найти в справочнике.

Функция `getIstance` выводит на печать адрес единственного экземпляра. Ниже показан пример запуска программы.

![[ParallelProg_65.png]]

## Локальные статические переменные

Статические переменные, локальные для блока, инициализируются один раз ленивым образом. Это означает, что инициализируются они непосредственно перед первым использованием. Это свойство составляет основу реализации так называемого мейерсовского одиночки, названного в честь Скотта Мейерса. На сегодняшний день это самая элегантная реализация шаблона «Одиночка» на языке C++. В стандарте C++11 для локальных статических переменных появилась новая гарантия: их инициализация потокобезопасна. Ниже представлен пример реализации одиночки по Мейерсу.

**Мейерсовская реализация шаблона «Одиночка»:**
```c++
// meyersSingleton.cpp

class MySingleton{
	public:
		static MySingleton& getInstance() {
			static MySingleton instance;
			return instance;
		}
		
	private:
		MySingleton();
		~MySingleton();
		
		MySingleton(const MySingleton&)= delete;
		MySingleton& operator=(const MySingleton&) = delete;
};

MySingleton::MySingleton()= default;
MySingleton::~MySingleton()= default;

int main(){
	MySingleton::getInstance();
}
```

> **Поддержка статических переменных**
>
> Используя мейерсовскую реализацию шаблона «Одиночка» в многопоточной среде, нужно убедиться, что компилятор реализует требование стандарта C++11 о потокобезопасной инициализации статических переменных. Нередко бывает, что программист полагается на описанные в стандарте гарантии, но оказывается, что компилятор не в полной мере им соответствует. В данном случае это может привести к созданию более чем одного объекта.

У данных с потоковой длительностью хранения нет никаких трудностей с многопоточностью. Поговорим теперь о них.
