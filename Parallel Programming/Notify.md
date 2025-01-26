
# Оповещения

Асинхронные задания представляют собой безопасную замену [[variable conditions|переменным условия]]. У этих механизмов довольно много общего, [[promise#std promise|обещания]] и [[future#std future|фьючерсы]] также можно использовать для синхронизации потоков. В большинстве случаев [[promise#std promise|обещаниям]] и [[future#std future|фьючерсам]] следует отдавать предпочтение.

Прежде чем рассмотреть пример программы, приведём сравнение двух механизмов оповещения.

| **Критерий**                         | **Переменные условия** | **Асинхронные задания** |
| ------------------------------------ | ---------------------- | ----------------------- |
| Многократная синхронизация           | +                      | -                       |
| Критическая секция                   | +                      | -                       |
| Обработка ошибок на приёмной стороне | -                      | +                       |
| Опасность ложных пробуждений         | +                      | -                       |
| Опасность утерянного пробуждения     | +                      | -                       |

Преимущество [[variable conditions|переменных условия]] перед механизмом [[promise#std promise|обещаний]] и [[future#std future|фьючерсов]] состоит в том, что одну [[variable conditions|переменную условия]] можно использовать многократно. [[promise#std promise|Обещание]], напротив, может послать оповещение лишь один раз; поэтому для имитации функциональных возможностей [[variable conditions#Переменные условия|переменных условия]] пришлось бы использовать множество пар обещание–фьючерс. Однако если требуется однократная синхронизация потоков, использовать переменную условия оказывается гораздо более хлопотно. Паре из [[promise|обещания]] и [[future|фьючерса]] не нужна переменная в общем доступе, а значит, не нужен и вспомогательный объект-блокировщик, она не подвержена опасности утерянных и ложных пробуждений. Кроме того, [[asyncVersus#Асинхронные задания|асинхронные задания]] умеют обрабатывать исключения. Таким образом, имеется множество причин предпочесть [[asyncVersus#Асинхронные задания|асинхронные задания]] [[variable conditions#Переменные условия|переменным условия]].

```c++
void waitingForWork() {
	std::cout << “Worker: Waiting for work.” << ‘\n’;

	std::unique_lock<std::mutex> lck(mutex_);
	condVar.wait(lck, []{ return dataReady; });
	doTheWork();

	std::cout << “Work done.” << ‘\n’;
}

void setDataReady() {
	std::lock_guard<std::mutex> lck(mutex_);
	dataReady=true;

	std::cout << “Sender: Data is ready.” << ‘\n’;
	
	condVar.notify_one();
}
```

Функция `setDataReady` отправляет оповещение, а функция `waitingForWork` ждёт его. Ниже показано, как добиться того же результата с помощью [[asyncVersus#Асинхронные задания|асинхронных заданий]].

**Синхронизация потоков посредством асинхронных заданий:**
```c++
// promiseFutureSynchronize.cpp

#include <future>
#include <iostream>
#include <utility>

void doTheWork(){
	std::cout << “Processing shared data.” << std::endl;
}

void waitingForWork(std::future<void>&& fut){
	std::cout << “Worker: Waiting for work.” << std::endl;
	
	fut.wait();
	doTheWork();

	std::cout << “Work done.” << std::endl;
}

void setDataReady(std::promise<void>&& prom){
	std::cout << “Sender: Data is ready.” << std::endl;

	prom.set_value();
}

int main(){
	std::cout << std::endl;

	std::promise<void> sendReady;
	auto fut = sendReady.get_future();

	std::thread t1(waitingForWork, std::move(fut));
	std::thread t2(setDataReady, std::move(sendReady));

	t1.join();
	t2.join();

	std::cout << std::endl;
}
```

Эта программа выглядит довольно просто. Из обещания `sendReady`, объявленного в строке `std::promise<void> sendReady;`, программа получает [[future#std future|фьючерс]] `fut` (строка `auto fut = sendReady.get_future();`). Поскольку [[promise|обещание]] имеет тип `void`, оно может передавать не значения, а лишь оповещения. Объекты, составляющие передающий и приёмный концы канала, перемещаются в потоки `t1` и `t2` (строки `std::thread t1(waitingForWork, std::move(fut));` и `std::thread t2(setDataReady, std::move(sendReady));`). Первый поток с помощью функции `wait` [[future#std future|фьючерса]] `fut` в строке `fut.wait();` ждёт оповещения, которое второй поток отправляет через объект-обещание `prom` функцией `set_value` (строка `prom.set_value();`).

Устройство и поведение этой программы – такие же, как у [[variable conditions#Переменные условия|соответствующей программы]]. Пример работы программы показан на рисунке.

![[ParallelProg_92.png]]

