1. [[#std future|Тип std::future]]
2. [[#Состояние фьючерса|Состояние фьючерса]]
3. [[#std shared_future|Тип std::shared_future]]
4. [[#Расширенные фьючерсы|Расширенные фьючерсы]] 

# std::future

Этот тип позволяет:
>
> получать значение из обещания;
> 
> узнавать у объекта-обещания, доступно ли в нём значение;
> 
> ждать оповещения от обещания, в том числе с заданной предельной продолжительностью ожидания или до заданного предельного момента времени;
> 
> создавать фьючерс для общего доступа (типа [[#std shared_future|std::shared_future]]).

Интерфейс класса показан в следующей таблице.

| **Функция-член** | **Описание**                                                                                                                                          |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `share`          | Возвращает объект типа [[#std shared_future\|std::shared_future]]. После этого вызов функции `valid` для текущего объекта возвращает значение `false` |
| `get`            | Возвращает содержащийся во фьючерсе результат или выбрасывает исключение                                                                              |
| `valid`          | Проверяет, связан ли фьючерс с состоянием (которое может быть ещё не установлено). После вызова функции `get` возвращает значение `false`             |
| `wait`           | Ожидает появления результата (в том числе исключения)                                                                                                 |
| `wait_for`       | Ожидает появления результата (в том числе исключения), но не дольше, чем заданный промежуток времени                                                  |
| `wait_until`     | Ожидает появления результата (в том числе исключения), но не дольше, чем до заданного момента времени                                                 |

В отличие от функции `wait`, которая ничего не возвращает, функции `wait_for` и `wait_until` возвращают состояние фьючерса.

## Состояние фьючерса

Функции-члены `wait_for` и `wait_until` классов [[#std future|std::future]] и [[#std shared_future|std::shared_future]] возвращают состояние [[future#std future|фьючерса]]. Всего имеется три возможных состояния, объявленных в стандартной библиотеке следующим образом:

**Состояния [[#std future|фьючерсов]]**
```c++
enum class future_status {
	ready,
	timeout,
	deferred
};
```

**Смысл этих значений разъясняется в следующей таблице.**

| **Состояние** | **Описание**                              |
| ------------- | ----------------------------------------- |
| `deferred`    | Выполнение асинхронного задания не начато |
| `ready`       | Результат задания готов                   |
| `timeout`     | Истекло предельное время ожидания         |

Благодаря наличию функций `wait_for` и `wait_until` фьючерс позволяет ожидать готовности соответствующего обещания.

**Ожидание объекта-обещания:**
```c++
// waitFor.cpp

#include <iostream>
#include <future>
#include <thread>
#include <chrono>

using namespace std::literals::chrono_literals;

 void getAnswer(std::promise<int> intPromise){
	std::this_thread::sleep_for(3s);

	intPromise.set_value(42);
}

int main(){
	std::cout << std::endl;

	std::promise<int> answerPromise;
	auto fut = answerPromise.get_future();

	std::thread prodThread(getAnswer, std::move(answerPromise));

	std::future_status status{};
	do {
		status = fut.wait_for(0.2s);
		std::cout << “... doing something else” << std::endl;
	} while (status != std::future_status::ready);
	
	std::cout << std::endl;
	
	std::cout << “The Answer: “ << fut.get() << ‘\n’;

	prodThread.join();
	
	std::cout << std::endl;
}
```

Пока фьючерс `fut` ждёт обещанного значения на вход, он может делать что-то ещё (англ. something else), как показано на рисунке.

![[ParallelProg_88.png]]

Если бы у фьючерса `fut` запросили результат более одного раза, произошло бы исключение типа `std::future_error`. Между [[promise#std promise|обещаниями]] и [[future#std future|фьючерсами]] имеет место отношение «один к одному». В отличие от обычных [[future#std future|фьючерсов]], тип [[#std shared_future|std::shared_future]] допускает совместную работу одного обещания с множеством [[future#std future|фьючерсов]].

# std::shared_future

Есть два способа создать объект этого типа.

1. Можно получить фьючерс из обещания `prom` и присвоить его в переменную типа std::shared_future:
	```c++
	std::shared_future fut = prom.get_future();
	```

2. Кроме того, можно вызвать для фьючерса `fut` функцию `share`. После этого выражение `fut.valid()` будет возвращать значение `false`.

Фьючерс совместного доступа `std::shared_future` связан со своим объектом-обещанием. Класс `std::shared_future` обладает таким же интерфейсом, как и класс [[#std future|std::future]]. Если таких фьючерсов несколько, у каждого можно запрашивать результат независимо от других.

Покажем на примере особенности работы с типом `std::shared_future`. В следующей программе объекты этого типа создаются непосредственно.

**Создание нескольких фьючерсов из одного обещания:**
```c++
// sharedFuture.cpp

#include <future>
#include <iostream>
#include <thread>
#include <utility>

std::mutex coutMutex;

struct Div{
	void operator()(std::promise<int>&& intPromise, int a, int b){
		intPromise.set_value(a/b);
	}
};

struct Requestor{
	void operator ()(std::shared_future<int> shaFut){
		// lock std::cout
		std::lock_guard<std::mutex> coutGuard(coutMutex);

		// get the thread id
		std::cout << “threadId(“ << std::this_thread::get_id() << “): “ ;
		
		std::cout << “20/10= “ << shaFut.get() << std::endl;
	}
};

int main(){
	std::cout << std::endl;

	// define the promises
	std::promise<int> divPromise;

	// get the futures
	std::shared_future<int> divResult = divPromise.get_future();

	// calculate the result in a separat thread
	Div div;
	std::thread divThread(div, std::move(divPromise), 20, 10);

	Requestor req;
	std::thread sharedThread1(req, divResult);
	std::thread sharedThread2(req, divResult);
	std::thread sharedThread3(req, divResult);
	std::thread sharedThread4(req, divResult);
	std::thread sharedThread5(req, divResult);

	divThread.join();

	sharedThread1.join();
	sharedThread2.join();
	sharedThread3.join();
	sharedThread4.join();
	sharedThread5.join();

	std::cout << std::endl;
}
```

В этом примере обещание и фьючерс используются в функциональных объектах, работающих в отдельных потоках. В строке `std::thread divThread(div, std::move(divPromise), 20, 10);` объект-обещание `divPromise` передаётся (путём перемещения) в поток `divThread`. Затем каждый из пяти потоков-потребителей получает свою копию фьючерса совместного доступа (строки `std::thread sharedThread1(req, divResult);` – `std::thread sharedThread5(req, divResult);`). Подчеркнём ещё раз: в отличие от объектов типа [[#std future|std::future]], которые можно только перемещать, объекты типа `std::shared_future` можно также копировать. Главный поток в строках `sharedThread1.join();` – `sharedThread5.join();` ждёт, пока дочерние потоки напечатают свои результаты и завершатся. Результат работы программы показан на рисунке.

![[ParallelProg_89.png]]

Как уже говорилось выше, фьючерс совместного доступа можно создавать также и вызовом функции-члена `share` для обычного фьючерса. Следующая программа демонстрирует этот способ.

**Создание фьючерса общего доступа из обычного фьючерса:**
```c++
// sharedFutureFromFuture.cpp

#include <future>
#include <iostream>
#include <thread>
#include <utility>

std::mutex coutMutex;

struct Div{
	void operator()(std::promise<int>&& intPromise, int a, int b){
		intPromise.set_value(a/b);
	}
};

struct Requestor{
	void operator()(std::shared_future<int> shaFut){
		// lock std::cout
		std::lock_guard<std::mutex> coutGuard(coutMutex);
	
		// get the thread id
		std::cout << “threadId(“ << std::this_thread::get_id() << “): “ ;
	
		std::cout << “20/10= “ << shaFut.get() << std::endl;
	}
};

int main(){
	std::cout << std::boolalpha << std::endl;

	// define the promises
	std::promise<int> divPromise;

	// get the future
	std::future<int> divResult = divPromise.get_future();

	std::cout << “divResult.valid(): “ << divResult.valid() << std::endl;

	// calculate the result in a separat thread
	Div div;
	std::thread divThread(div, std::move(divPromise), 20, 10);

	std::cout << “divResult.valid(): “ << divResult.valid() << std::endl;

	std::shared_future<int> sharedResult = divResult.share();

	std::cout << “divResult.valid(): “ << divResult.valid() << “\n\n”;

	Requestor req;
	std::thread sharedThread1(req, sharedResult);
	std::thread sharedThread2(req, sharedResult);
	std::thread sharedThread3(req, sharedResult);
	std::thread sharedThread4(req, sharedResult);
	std::thread sharedThread5(req, sharedResult);

	divThread.join();

	sharedThread1.join();
	sharedThread2.join();
	sharedThread3.join();
	sharedThread4.join();
	sharedThread5.join();
	
	std::cout << std::endl;
}
```

Первые два вызова функции `valid` для объекта `divResult` возвращают значение `true`. Ситуация меняется после вызова функции-члена `share` в строке `std::shared_future<int> sharedResult = divResult.share();`: старый фьючерс теряет своё состояние, которое теперь передаётся под управление фьючерсов совместного доступа. Результат работы программы показан на рисунке.

![[ParallelProg_90.png]]


# Расширенные фьючерсы
#Расширенные_фьючерсы

Задания, в виде [[promise|обещаний]] и фьючерсов появившиеся в стандарте C++11, приносят программистам существенную пользу, но у них есть свои недостатки: задания трудно соединять между собой в более крупные единицы. Это ограничение должно исчезнуть благодаря расширениям фьючерсов, появившимся в стандарте C++20 и запланированным в стандарте C++23. Например, функция-член `then` создаёт фьючерс, который становится готов, когда готово задание-предшественник; функция-член `when_any` – когда готов один из нескольких предшественников, а функция-член `when_all` – когда готовы все предшественники.
