
[[#std semaphore]]
[[#Семафоры (стандарт C++ 20)|Семафоры (стандарт C++ 20)]] 3.7




# std::semaphore

Семафоры представляют собой механизм управления одновременным доступом к общему ресурсу (и в этом отношении отчасти сходны с [[mutex#std mutex|мьютексами]]). Семафор снабжён целочисленным счётчиком, который должен быть не отрицательным. Счётчик инициализируется в конструкторе. Каждый захват семафора уменьшает счётчик на единицу, а освобождение – увеличивает. Если поток пытается зайти под семафор (т. е. захватить его), когда счётчик равен нулю, поток блокируется до тех пор, пока какой-то другой поток не освободит семафор, тем самым нарастив счётчик.

# Семафоры (стандарт C++ 20)

**Семафоры** – это механизм синхронизации, используемый для управления одновременным доступом потоков к общему ресурсу. Считающий семафор – это разновидность семафора, ведущий счётчик потоков, которым ещё разрешается вход в критическую секцию. Конструктор семафора устанавливает начальное значение счётчика. Захват семафора уменьшает счётчик на единицу, а освобождение – увеличивает. Если поток пытается захватить семафор, когда его значение равно нулю, поток блокируется до тех пор, пока значение счётчика не увеличится в результате освобождения семафора каким-то другим потоком.

Термин «семафор» первоначально означал механическое средство сигнализации для подвижного состава на железных дорогах.

![[ParallelProg_75.png]]

Стандарт C++20 содержит тип двоичного семафора `std::binary_semaphore`, который представляет собой псевдоним для типа `std::counting_semaphore<1>`, у которого нижняя граница наибольшего значения счётчика равна 1. С помощью типа `std::binary_semaphore` можно реализовать блокировки.
```c++
using binary_semaphore = std::counting_semaphore<1>;
```

В отличие от объектов типа [[mutex|std::mutex]], семафоры не привязаны к определённым потокам. Это означает, что операции захвата и освобождения семафора могут выполняться в различных потоках. В следующей таблице показан интерфейс класса `std::counting_semaphore`.

**Функции-члены класса `std::counting_semaphore`**

| **Пример применения функции**      | **Описание**                                                                                                                                                                                                   |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `std::counting_semaphore sem{num}` | Конструктор. Создаёт семафор с начальным значением `num`                                                                                                                                                       |
| `sem.max()`                        | Статическая функция. Возвращает наибольшее возможное значение счётчика                                                                                                                                         |
| `sem.release(upd = 1)`             | Увеличивает счётчик на величину `upd` и разблокирует потоки, ожидающие этот семафор                                                                                                                            |
| `sem.acquire()`                    | Уменьшает значение счётчика или блокирует поток, пока счётчик не станет больше нуля                                                                                                                            |
| `sem.try_acquire()`                | Пытается уменьшить значение счётчика, если он больше нуля; в противном случае возвращает значение `false`                                                                                                      |
| `sem.try_acquire_for(relTime)`     | Пытается уменьшить значение счётчика, если он больше нуля; в противном случае ожидает не более заданного промежутка времени и, если семафор по-прежнему невозможно захватить, возвращает значение `false`      |
| `sem.try_acquire_until(absTime)`   | Пытается уменьшить значение счётчика, если он больше нуля; в противном случае ожидает не более, чем до заданного момента времени и, если семафор по прежнему невозможно захватить, возвращает значение `false` |

**Вызов конструктора:**
```c++
std::counting_semaphore<10> sem(5)
```

создаёт семафор с нижней границей наибольшего значения счётчика, равной `10`, и начальным значением счётчика `5`. Вызов `sem.max()` возвращает наибольшее возможное значение внутреннего счётчика. При вызове `sem.release(upd)` должны выполнятся следующие ограничения: `upd >= 0` и `upd + counter <= sem.max()`. Функция `try_acquire_for` принимает в качестве аргумента промежуток времени, тогда как функция `try_acquire_until` принимает момент времени. Функции `try_acquire`, `try_acquire_for` и `try_acquire_until` возвращают значение логического типа, выражающее успешность вызова. 

Семафоры обычно используются для организации взаимодействия между отправителями и получателями. Например, путём инициализации семафора значением `0` можно заблокировать поток-получатель на вызове функции `acquire` до тех пор, пока поток-отправитель не сформирует сообщение и не вызовет для семафора функцию `release`. Таким образом, получатель ждёт оповещения от отправителя. С помощью семафоров легко можно воплотить однократную синхронизацию потоков.

**Синхронизация потоков на основе семафора:**
```c++
// threadSynchronisationSemaphore.cpp

#include <iostream>
#include <semaphore>
#include <thread>
#include <vector>

std::vector<int> myVec{};
 std::counting_semaphore<1> prepareSignal(0);

void prepareWork() {
	myVec.insert(myVec.end(), {0, 1, 0, 3});

	std::cout << “Sender: Data prepared.” << ‘\n’;
	
	prepareSignal.release();
}

void completeWork() {
	std::cout << “Waiter: Waiting for data.” << ‘\n’;
	
	prepareSignal.acquire();

	myVec[2] = 2;

	std::cout << “Waiter: Complete the work.” << ‘\n’;
	
	for (auto i: myVec) 
		std::cout << i << “ “;

	std::cout << ‘\n’;
}

int main() {
	std::cout << ‘\n’;
	
	std::thread t1(prepareWork);
	std::thread t2(completeWork);
	
	t1.join();
	t2.join();
	
	std::cout << ‘\n’;
}
```


В строке `std::counting_semaphore<1> prepareSignal(0);` объявляется переменная `prepareSignal` типа `std::counting_semaphore`, которая может принимать лишь значения `0` и `1`. В этой программе переменная инициализируется значением `0`. Это означает, что вызов функции `release` в строке `prepareSignal.release();` установит значение счётчика в `1` и разблокирует второй поток, ожидающий на вызове функции `acquire` в строке `prepareSignal.acquire();`. Ниже представлен пример выполнения этой программы.

![[ParallelProg_76.png]]


