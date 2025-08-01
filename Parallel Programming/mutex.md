
[[#std mutex]] 3.3.1
1. [[#Затруднения с мьютексами|Затруднения с мьютексами]] 3.3.1.1
2. [[#Исключения и неизвестный код]] 3.3.1.2
3. [[#Захват мьютексов в различном порядке|Захват мьютексов в различном порядке]] 3.3.1.3
[[#std recursive_mutex|std::recursive_mutex]]
[[#std shared_timed_mutex|std::shared_timed_mutex]]

# std::mutex

`Мьютекс` (mutex, от англ. mutual exclusion – взаимное исключение) позволяет гарантировать, что только один поток может получить доступ к общей переменной в каждый момент времени. Мьютекс запирает и открывает критическую секцию, внутри которой происходит работа с общей переменной. В стандартной библиотеке языка C++ определены пять различных видов мьютексов. Они позволяют блокировать выполнение рекурсивно, с запросом состояния блокировки, с ограничением времени ожидания или без такого ограничения. Особый вид мьютекса даёт возможность даже нескольким потокам входить в критическую секцию одновременно.

С появлением мьютекса хаос в рабочем коллективе сменяется гармонией.

**Синхронизированный вывод в поток `std::cout`:**
```c++
// coutSynchronised.cpp

#include <chrono>
#include <iostream>
#include <mutex>
#include <thread>

std::mutex coutMutex;

class Worker{
	public:
		Worker(std::string n):name(n){};
		
		void operator() (){
			for (int i = 1; i <= 3; ++i){
				// begin work
				std::this_thread::sleep_for(
										std::chrono::milliseconds(200));
				// end work
				
				coutMutex.lock();
					std::cout << name << “: “ << “Work “ << i 
											<< “ done !!!” << std::endl;
				coutMutex.unlock();
			}
		}

	private:
		std::string name;
};

int main(){
	std::cout << std::endl;
	std::cout << “Boss: Let’s start working.” << “\n\n”;

	std::thread herb= std::thread(Worker(“Herb”));
	std::thread andrei= std::thread(Worker(“ Andrei”));
	std::thread scott= std::thread(Worker(“Scott”));
	std::thread bjarne= std::thread(Worker(“Bjarne”));
	std::thread bart= std::thread(Worker(“Bart”));
	std::thread jenne= std::thread(Worker(“Jenne”));

	herb.join();
	andrei.join();
	scott.join();
	bjarne.join();
	bart.join();
	jenne.join();

	std::cout << “\n” << “Boss: Let’s go home.” << std::endl;
	std::cout << std::endl;
}
```

Теперь поток `std::cout` защищён мьютексом `coutMutex`, объявленным в строке `std::mutex coutMutex`. Запирание мьютекса функцией `lock` в строке `coutMutex.lock()` и отпирание функцией `unlock` в строке `coutMutex.unlock()` гарантируют, что работники докладывают о завершении заданий не хором, а по одному.

![[ParallelProg_58.png]]

> **Потокобезопасность объекта `std::cout`**
> 
> Стандарт C++11 гарантирует, что защищать объект `std::cout` от одновременного доступа из нескольких потоков не нужно. Каждое значение выводится атомарным образом. Однако между соседними операциями вывода может вклиниваться вывод из других потоков. Путаница, однако, здесь исключительно визуальная: поведение программы в целом хорошо определено. Это справедливо для всех глобальных потоков ввода-вывода ([[cout|std::cout]], [[cin|std::cin]], [[cerr|std::cerr]], [[clog|std::clog]]): отправка данных в эти потоки и получение данных из них потокобезопасны.
> 
> Говоря более формальным языком, одновременная запись в поток [[cout|std::cout]] из нескольких потоков представляет собой состояние гонки, но не гонку данных. Это озна­чает, что результат вывода программы зависит от порядка выполнения потоков.

В стандарте C++11 определены четыре различных мьютекса, которые могут работать рекурсивно, допускать обработку неудач, а также ограничивать время ожидания.

**Виды мьютексов в стандартной библиотеке:**

| **Функция**      | **mutex** | **recursive_mutex** | **timed_mutex** | **recursive_timed_mutex** |
| ---------------- | --------- | ------------------- | --------------- | ------------------------- |
| `lock`           | +         | +                   | +               | +                         |
| `try_lock`       | +         | +                   | +               | +                         |
| `try_lock_for`   |           |                     | +               | +                         |
| `try_lock_until` |           |                     | +               | +                         |
| `unlock`         | +         | +                   | +               | +                         |

Рекурсивный мьютекс (тип `std::recursive_mutex`) можно многократно запирать из одного и того же потока. Мьютекс останется в запертом состоянии до тех пор, пока он не будет открыт ровно столько же раз, сколько и заперт. Максимальное количество раз, которое можно запирать рекурсивный мьютекс, стандартом не определено. Если этот максимум достигнут, выбрасывается исключение `std::system_error`.

В стандарте C++14 появился тип `std::shared_timed_mutex`, а в стандарте C++17 – тип `std::shared_mutex`. Эти типы весьма похожи между собой. Оба могут использоваться как для исключительной, так и для совместной (англ. `shared`) блокировки. Кроме того, тип `std::shared_timed_mutex` позволяет задать предельный момент времени или предельный срок ожидания.

**Виды мьютексов с совместной блокировкой:**

| **Функция**             | **shared_timed_mutex** | **shared_mutex** |
| ----------------------- | ---------------------- | ---------------- |
| `lock`                  | +                      | +                |
| `try_lock`              | +                      | +                |
| `try_lock_for`          | +                      |                  |
| `try_lock_until`        | +                      |                  |
| `unlock`                | +                      | +                |
| `lock_shared`           | +                      | +                |
| `try_lock_shared`       | +                      | +                |
| `try_lock_shared_for`   | +                      |                  |
| `try_lock_shared_until` | +                      |                  |
| `unlock_shared`         | +                      | +                |

Тип `std::shared_timed_mutex` (или `std::shared_mutex`) позволяет реализовать шаблон «читателей и писателей» благодаря наличию двух режимов блокировки: исключительного и совместного. Мьютекс захватывается в исключительном режиме, если к объекту применяется блокировщик типа [[lock#Тип std lock_guard|std::lock_guard]] или [[lock#Тип std unique_lock|std::unique_lock]], тогда как блокировщик типа [[lock#Блокировщик std shared_lock|std::shared_lock]] захватывает объект в совместном режиме. Функции-члены `try_lock_for` и `try_lock_shared_for` в качестве аргумента принимают промежуток времени, по истечении которого попытка захвата завершается неудачей. Функции же `try_lock_until` и `try_lock_shared_until` принимают абсолютное значение – момент времени, до которого можно ожидать.

> Поясним смысл этого часто применяемого на практике шаблона «читателей и писателей». К данным, находящимся в общем доступе, потоки могут обращаться либо с целью чтения, либо с целью записи. Очевидно, что читать общие данные может одновременно сколь угодно много потоков – при условии что ни один поток в это время не выполняет их запись. С другой стороны, писать данные может только один поток – и лишь в случае, если ни один поток не осуществляет чтение. Таким образом, в любой момент времени должно соблюдаться условие: с данными работает либо один писатель и ни одного читателя, либо ни одного писателя и любое число читателей. Обычно это ограничение дополняют следующим. Если какой-либо поток изъявил желание модифицировать общие данные, он должен получить такую возможность независимо от прихода новых читателей. Это означает, что если один или несколько потоков стоят в очереди на право стать писателями и какой-либо поток желает получить доступ на чтение, он вынужден ждать, пока не закончится обслуживание всех писателей. Иными словами, если поток подаёт заявку на запись, пока данными пользуются несколько читателей, заход новых читателей блокируется; имеющиеся читатели рано или поздно заканчивают свою работу и покидают общие данные; с уходом последнего читателя начинается обслуживание писателей по одному; все потоки, желающие получить доступ на чтение, отправляются в ожидание; наконец, с уходом последнего писателя все такие потоки одновременно приступают к чтению. Легко понять, что доступ в режиме писателя – исключительный, а в режиме читателя – совместный. 

Функции `try_lock` и `try_lock_shared` пытаются захватить мьютекс и немедленно возвращают управление. Если захват удался, они возвращают значение `true`, а если мьютекс уже захвачен другими потоками – значение `false`. В отличие от них, функции `try_lock_for`, `try_lock_shared_for`, `try_lock_until` и `try_lock_shared_until` блокируют поток до тех пор, пока мьютекс не станет доступен либо пока не истечёт предельное время ожидания. Задавать предельное время ожидания следует с использованием монотонных часов (`std::chrono::steady_clock`), которые гарантируют неубывающую последовательность показаний. 

Мьютексы не стоит использовать в программе напрямую, вместо этого рекомендуется оборачивать их в объекты-блокировщики. В следующем разделе подробно рассматриваются причины этого.

### Затруднения с мьютексами

Большая часть трудностей, возникающих при использовании мьютексов, сводится к одной главной проблеме – мёртвой блокировке.

> Мёртвая блокировка – это состояние, в котором каждый из двух или более потоков заблокирован в ожидании ресурса, занятого другим потоком, и до своей разблокировки не может освободить ресурс, которого ожидает другой поток.

Результат мёртвой блокировки – полная остановка работы потоков. Все потоки, вовлечённые в мёртвую блокировку, а часто и вся программа, блокируются навечно. Создать такую ситуацию очень просто. Посмотрим, как это может произойти.

### Исключения и неизвестный код

В следующем крошечном фрагменте кода таится множество подводных камней.
```c++
std::mutex m;

m.lock();
	sharedVariable = getVar();
m.unlock();
```

2. Если функция `getVar` выбросит исключение, мьютекс `m` никогда не будет освобождён.
3. Никогда, ни в коем случае нельзя вызывать из-под мьютекса функцию, внутреннее устройство которой неизвестно. Если функция `getVar` пытается захватить мьютекс `m`, поведение программы не определено, так как этот мьютекс – не рекурсивный. В большинстве подобных случаев неопределённое поведение выражается в мёртвой блокировке.
4. Вызывать функции из-под блокировки опасно ещё по одной причине. Если функция определена в сторонней библиотеке, в новой её версии реализация и поведение функции могут измениться. Даже если первоначально опасности мёртвой блокировки не было, она может появиться в будущем.

Чем больше в программе блокировок, тем труднее становится уследить за всеми, и эта зависимость весьма нелинейна.

### Захват мьютексов в различном порядке

На следующем рисунке показан типичный пример попадания в мёртвую блокировку по причине захвата мьютексов в различном порядке.

![[ParallelProg_59.png]]

Каждому из двух потоков требуется для работы доступ к двум ресурсам, для защиты которых используются два отдельных мьютекса. Проблема возникает, когда потоки захватывают их в разном порядке: поток 1 захватывает сначала 1-й мьютекс, затем 2-й, а поток 2 – наоборот: сначала мьютекс 2, потом мьютекс 1. Тогда операции двух потоков перемежаются следующим образом: сначала поток 1 захватывает мьютекс 1, а поток 2 – мьютекс 2, а затем наступает взаимная блокировка. Каждый из двух потоков хочет захватить мьютекс, захваченный другим потоком, но этот последний не может отпустить мьютекс, так как сам заблокирован. Для этой ситуации хорошо подходит выражение «смертельные объятия».

Превратить эту картинку в код довольно просто.

**Захват мьютексов в различном порядке:**
```c++
// deadlock.cpp

#include <iostream>
#include <chrono>
#include <mutex>
#include <thread>

struct CriticalData{
	std::mutex mut;
};

void deadLock(CriticalData& a, CriticalData& b){
	a.mut.lock();
	std::cout << “get the first mutex” << std::endl;
	
	std::this_thread::sleep_for(std::chrono::milliseconds(1));
	
	b.mut.lock();
	std::cout << “get the second mutex” << std::endl;
	// do something with a and b

	a.mut.unlock();
	b.mut.unlock();
}

int main(){
	CriticalData c1;
	CriticalData c2;
	
	std::thread t1([&]{deadLock(c1,c2);});
	std::thread t2([&]{deadLock(c2,c1);});
	
	
	t1.join();
	t2.join();
}
```

В потоках `t1` и `t2` выполняется функция `deadlock`. Эта функция получает ссылки на переменные `c1` и `c2` типа `CriticalData`. Поскольку эти объекты нуждаются в защите от одновременного доступа, каждый из них содержит внутри мьютекс (для простоты кода класс `CriticalData` никаких других данных или функций-членов не содержит). Задержки всего на одну миллисекунду в строке `std::this_thread::sleep_for(std::chrono::milliseconds(1))` оказывается достаточно, чтобы вызвать мёртвую блокировку.

![[ParallelProg_60.png]]

Единственный способ сдвинуть программу с мёртвой точки – это прервать
её выполнение, нажав `CTRL+C`.

# std::recursive_mutex
#std_recursive_mutex

# std::shared_timed_mutex
#std_shared_timed_mutex


# std::shared_mutex
#std_shared_mutex

