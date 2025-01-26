
[[#Защёлки и барьеры (стандарт C++20)]] 3.8
1. [[#Класс std latch|Класс std::latch]] 3.8.1
2. [[#Класс std barrier|Класс std::barrier]] 3.8.2

# Защёлки и барьеры (стандарт C++20)

Защёлки и барьеры – это средства синхронизации, позволяющие заблокировать поток до тех пор, пока некоторый счётчик не достигнет нуля. Нужно сразу же подчеркнуть, что барьеры, о которых идёт речь здесь, не имеют ничего общего с [[barrier|барьерами памяти]]. В стандарте C++20 барьеры и защёлки представлены двумя классами: [[#Класс std latch|std::latch]] и [[#Класс std barrier|std::barrier]]. Одновременный вызов функций-членов для одного и того же объекта какого-либо из этих классов не приводит к гонке данных.

Начнём с ответов на два вопроса.
1.	В чём различие между этими двумя механизмами координации потоков? Объект типа [[#Класс std latch|std::latch]] можно использовать лишь один раз, тогда как класс [[#Класс std barrier|std::barrier]] допускает многократное использование. Объект типа [[#Класс std latch|std::latch]] может быть полезен в случаях, когда несколько потоков совместно решают единственную задачу. Тип [[#Класс std barrier|std::barrier]] помогает управлять выполнением повторяющихся задач в нескольких потоках. Кроме того, класс [[#Класс std barrier|std::barrier]] позволяет выполнить определённую функцию-обработчик на так называемом заключительном шаге (т. е. когда значение счётчика достигает нуля).
2.	Какие новые сценарии использования допускают защёлки и барьеры, которых нельзя было бы реализовать средствами стандартов C++11 и C++14, комбинируя различным образом [[future|фьючерсы]], [[thread|потоки]], [[variable conditions|переменные условия]] и [[lock|блокировщики]]? Никаких принципиально новых возможностей эти два класса не добавляют, однако они гораздо удобнее в использовании. Также они оказываются более эффективными, так как их внутренняя реализация часто основывается на неблокирующих механизмах.

## Класс std::latch

Рассмотрим подробнее интерфейс класса std::latch.

**Функции-члены класса `std::latch`:**

| **Функция**            | **Описание**                                                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `std::latch lat{cnt}`  | Создать защёлку, задав начальное значение счётчика                                                                      |
| `count_down(upd)`      | Атомарным образом уменьшить значение счётчика на величину `upd` (по умолчанию `1`), не блокируя вызывающий поток        |
| `try_wait`             | Возвращает значение `true`, если счётчик равен нулю                                                                     |
| `wait`                 | Возвращает управление, если счётчик равен нулю. Иначе – блокирует выполнение до тех пор, пока счётчик на достигнет нуля |
| `arrive_and_wait(upd)` | Эквивалентно `count_down(upd)`; `wait()`;                                                                               |
| `max`                  | Статическая. Возвращает наибольшее значение счётчика, поддерживаемое реализацией                                        |

Аргумент `upd` в обеих функциях можно опускать, по умолчанию его значение равно `1`. Если значение этого аргумента больше, чем текущее значение счётчика, или отрицательно, программа обладает неопределённым поведением. Выполнение функции `try_wait` никогда не приводит к ожиданию, вопреки её названию.

В следующей программе показано, как с помощью двух защёлок организовать взаимодействие потоков по типу «начальник–подчинённые». Для синхронизированного вывода на консоль служит функция `synchronizedOut` – так удобнее будет проследить ход выполнения программы.

**Взаимодействие начальника и подчинённых на основе защёлок:**
```c++
// bossWorkers.cpp

#include <iostream>
#include <mutex>
#include <latch>
#include <thread>

std::latch workDone(6);
std::latch goHome(1);

std::mutex coutMutex;

void synchronizedOut(const std::string s) {
	std::lock_guard<std::mutex> lo(coutMutex);
	
	std::cout << s;
}

class Worker {
	public:
		Worker(std::string n): name(n) { };

		void operator() (){
			// notify the boss when work is done
			synchronizedOut(name + “: “ + “Work done!\n”);
			workDone.count_down();

			// waiting before going home
			goHome.wait();
			synchronizedOut(name + “: “ + “Good bye!\n”);
		}
	private:
		std::string name;
};

int main() {
	std::cout << ‘\n’;
	
	std::cout << “BOSS: START WORKING! “ << ‘\n’;

	Worker herb(“ Herb”);
	std::thread herbWork(herb);
	
	Worker scott(“ Scott”);
	std::thread scottWork(scott);
	
	Worker bjarne(“ Bjarne”);
	std::thread bjarneWork(bjarne);
	
	Worker andrei(“ Andrei”);
	std::thread andreiWork(andrei);
	
	Worker andrew(“ Andrew”);
	std::thread andrewWork(andrew);
	
	Worker david(“ David”);
	std::thread davidWork(david);
	
	workDone.wait();
	
	std::cout << ‘\n’;
	
	goHome.count_down();
	
	std::cout << “BOSS: GO HOME!” << ‘\n’;

	herbWork.join();
	scottWork.join();
	bjarneWork.join();
	andreiWork.join();
	andrewWork.join();
	davidWork.join();
}
```

Идея взаимодействия потоков вполне очевидна. Каждый из шести потоков, `herb`, `scott`, `bjarne`, `andrei`, `andrew` и `david`, созданных, должен выполнить свою работу. Закончив, поток уменьшает счётчик `workDone` типа `std::latch` (строка `workDone.count_down()`). Главный поток программы, выполняющий роль начальника, блокируется в строке `workDone.wait()` до тех пор, пока счётчик не достигнет нуля. Когда это произойдёт, т. е. когда последний поток-подчинённый рапортует о завершении своей работы, начальник командует работникам расходиться по домам, используя для этого вторую защёлку: `goHome`. У этой защёлки начальное значение счётчика равно 1 (строка `std::latch goHome(1)`). Все потоки-подчинённые ждут, заблокированные на функции `wait`, до тех пор, пока этот счётчик не обнулится. Пример выполнения программы показан на рисунке.

![[ParallelProg_77.png]]

Присмотревшись внимательнее к протоколу взаимодействия этих потоков, можно заметить, что работники могут обойтись и без начальника. Код программы представлен ниже.

**Взаимодействие работников на основе защёлок:**

```c++
// workers.cpp

#include <iostream>
#include <barrier>
#include <mutex>
#include <thread>

std::latch workDone(6);
std::mutex coutMutex;

void synchronizedOut(const std::string& s) {
	std::lock_guard<std::mutex> lo(coutMutex);
	std::cout << s;
}

class Worker {
	public:
		Worker(std::string n): name(n) { };

		void operator() () {
			synchronizedOut(name + “: “ + “Work done!\n”);
	
			workDone.arrive_and_wait(); // wait until all work is done
			
			synchronizedOut(name + “: “ + “See you tomorrow!\n”);
		}
	private:
		std::string name;
};

int main() {
	std::cout << ‘\n’;

	Worker herb(“ Herb”);
	std::thread herbWork(herb);
	
	Worker scott(“ Scott”);
	std::thread scottWork(scott);
	
	Worker bjarne(“ Bjarne”);
	std::thread bjarneWork(bjarne);
	
	Worker andrei(“ Andrei”);
	std::thread andreiWork(andrei);
	
	Worker andrew(“Andrew”);
	std::thread andrewWork(andrew);
	
	Worker david(“ David”);
	std::thread davidWork(david);

	herbWork.join();
	scottWork.join();
	bjarneWork.join();
	andreiWork.join();
	andrewWork.join();
	davidWork.join();
}
```

Не так много остаётся добавить к этой упрощённой программе. Вызов функции `arrive_and_wait` эквивалентен вызову двух функций: сначала `count_down`, затем `wait`. При таком подходе потоки сами координируют свою работу, необходимости в отдельном потоке-начальнике, как в предыдущей программе, более нет.

![[ParallelProg_78.png]]

## Класс std::barrier

Между классами [[#Класс std latch|std::latch]] и `std::barrier` есть два главных различия. Во-первых, объект класса `std::barrier` можно использовать много раз; во-вторых, значение счётчика можно заново устанавливать перед новым использованием. Начальное значение счётчика устанавливается в конструкторе. Вызовы функций `arrive`, `arrive_and_wait` и `arrive_and_drop` уменьшают значение счётчика. Кроме того, функция `arrive_and_drop` уменьшает на единицу значение, которое станет начальным для счётчика на последующих фазах. Сразу после завершения текущей фазы, когда счётчик достигает нуля, запускается так называемый заключительный шаг. На этом шаге запускается заданный в конструкторе вызываемый объект – обработчик.

Заключительный шаг выполняется следующим образом:
>	1) потоки заблокированы в ожидании на функциях `arrive`;
>	2) из этих потоков произвольным образом выбирается один, и в нём выполняется обработчик. Обработчик должен иметь спецификацию [[noexcept|noexcept]] и не может выбрасывать исключения;
>	3) когда обработчик завершает работу, все ожидающие потоки разблокируются.

**Функции-члены класса `std::barrier`:**

| **Функция**                   | **Описание**                                                                     |
| ----------------------------- | -------------------------------------------------------------------------------- |
| `std::barrier bar{cnt}`       | Конструктор. Создаёт объект-барьер с начальным значением счётчика                |
| `std::barrier bar{cnt, call}` | Конструктор. Создаёт объект-барьер с начальным значением счётчика и обработчиком |
| `bar.arrive(upd)`             | Атомарным образом уменьшает значение счётчика на заданную величину               |
| `bar.wait()`                  | Блокирует поток до обнуления счётчика и выполнения обработчика                   |
| `bar.arrive_and_wait()`       | Эквивалентна конструкции `wait(arrive())`                                        |
| `bar.arrive_and_drop()`       | Уменьшает счётчик и уменьшает начальное значение счётчика для последующих фаз    |
| `std::barrier::max`           | Статическая. Возвращает наибольшее значение счётчика, поддерживаемое реализацией |

Вызов функции `arrive_and_drop` приводит к тому, что следующая фаза начнётся с на единицу меньшего начального значения счётчика. В следующей программе количество работников уменьшается наполовину во второй фазе.

**Работники на полную ставку и на полставки:**
```c++
// fullTimePartTimeWorkers.cpp

#include <iostream>
#include <barrier>
#include <mutex>
#include <string>
#include <thread>

std::barrier workDone(6);
std::mutex coutMutex;

void synchronizedOut(const std::string& s) noexcept {
	std::lock_guard<std::mutex> lo(coutMutex);

	std::cout << s;
}

class FullTimeWorker {
	public:
		FullTimeWorker(std::string n): name(n) { };

		void operator() () {
			synchronizedOut(name + “: “ + “Morning work done!\n”);
			
			workDone.arrive_and_wait(); 
									// Wait until morning work is done

			synchronizedOut(name + “: “ + “Afternoon work done!\n”);

			workDone.arrive_and_wait(); 
									// Wait until afternoon work is done
		}
	private:
		std::string name;
};

class PartTimeWorker {
	public:
		PartTimeWorker(std::string n): name(n) { };

		void operator() () {
			synchronizedOut(name + “: “ + “Morning work done!\n”);
			
			workDone.arrive_and_drop(); // Wait until morning work is done
		}
	private:
		std::string name;
};

int main() {
	std::cout << ‘\n’;

	FullTimeWorker herb(“ Herb”);
	std::thread herbWork(herb);

	FullTimeWorker scott(“ Scott”);
	std::thread scottWork(scott);

	FullTimeWorker bjarne(“ Bjarne”);
	std::thread bjarneWork(bjarne);

	PartTimeWorker andrei(“ Andrei”);
	std::thread andreiWork(andrei);

	PartTimeWorker andrew(“ Andrew”);
	std::thread andrewWork(andrew);

	PartTimeWorker david(“ David”);
	std::thread davidWork(david);

	herbWork.join();
	scottWork.join();
	bjarneWork.join();
	andreiWork.join();
	andrewWork.join();
	davidWork.join();
}
```

Эта программа моделирует организацию, в которой есть два вида работников: одни трудятся на полную ставку (`class FullTimeWorker`), другие (`class PartTimeWorker`) – на полставки. Первые работают весь день, вторые – только до обеда. Соответственно, первые дважды вызывают функцию `arrive_and_wait`, тогда как вторым довольно один раз вызвать функцию `arrive_and_drop`. Именно этот вызов позволяет работнику пропустить вторую половину рабочего дня. На первой фазе (соответствует первой половине дня) число сотрудников, от которых ожидается работа, равно шести, а на второй (моделирует вторую половину дня) – трём. Результат работы программы представлен на рисунке.

![[ParallelProg_79.png]]

