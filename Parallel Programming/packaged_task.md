
# std::packaged_task

Тип `std::packaged_task` представляет собой обёртку над вызываемым объектом, которая позволяет вызывать его асинхронно. Функция `get_future` позволяет получить связанный с обёрткой [[future|фьючерс]]. Перегруженная операция вызова для объекта `std::packaged_task` запускает выполнение завёрнутого в него вызываемого объекта.

Работа с объектами типа `std::packaged_task` обычно состоит из следующих четырёх шагов.

1. Завернуть действия, которые предполагается выполнить, в объект:
	```c++
	std::packaged_task<int(int, int)> sumTask(
									[](int a, int b){ return a + b; });
	```

2. Создать фьючерс:
	```c++
	std::future<int> sumResult = sumTask.get_future();
	```

3. Запустить вычисление:
	```c++
	sumTask(2000, 11);
	```

4. Запросить результат вычисления:
	```c++
	sumResult.get();
	```

**Параллельные вычисления с помощью типа `std::packaged_task`:**
```c++
// packagedTask.cpp

#include <utility>
#include <future>
#include <iostream>
#include <thread>
#include <deque>

class SumUp{
	public:
		int operator()(int beg, int end){
			long long int sum{0};

			for (int i = beg; i < end; ++i ) 
				sum += i;

			return sum;
		}
};

int main(){
	std::cout << std::endl;

	SumUp sumUp1;
	SumUp sumUp2;
	SumUp sumUp3;
	SumUp sumUp4;

	// wrap the tasks
	std::packaged_task<int(int, int)> sumTask1(sumUp1);
	std::packaged_task<int(int, int)> sumTask2(sumUp2);
	std::packaged_task<int(int, int)> sumTask3(sumUp3);
	std::packaged_task<int(int, int)> sumTask4(sumUp4);

	// create the futures
	std::future<int> sumResult1 = sumTask1.get_future();
	std::future<int> sumResult2 = sumTask2.get_future();
	std::future<int> sumResult3 = sumTask3.get_future();
	std::future<int> sumResult4 = sumTask4.get_future();

	// push the tasks on the container
	std::deque<std::packaged_task<int(int,int)>> allTasks;
	allTasks.push_back(std::move(sumTask1));
	allTasks.push_back(std::move(sumTask2));
	allTasks.push_back(std::move(sumTask3));
	allTasks.push_back(std::move(sumTask4));

	int begin{1};
	int increment{2500};
	int end = begin + increment;

	// perform each calculation in a separate thread
	while (not allTasks.empty()){
		std::packaged_task<int(int, int)> myTask =
									std::move(allTasks.front());
		allTasks.pop_front();

		std::thread sumThread(std::move(myTask), begin, end);
		begin = end;
		end += increment;
		sumThread.detach();
	}

	// pick up the results
	auto sum = sumResult1.get() + sumResult2.get() +
								sumResult3.get() + sumResult4.get();

	std::cout << “sum of 0 .. 10000 = “ << sum << std::endl;

	std::cout << std::endl;
}
```

Назначение этой программы – вычислить сумму всех чисел от 0 до 10000 с помощью четырёх асинхронных заданий, выполняемых посредством объектов типа `std::packaged_task` в отдельных потоках. Чтобы получить окончательный результат, остаётся просуммировать промежуточные результаты четырёх [[future|фьючерсов]]. Конечно, если бы речь не шла об учебном примере, для решения этой задачи лучше подошла бы «формула Гаусса-малыша».

> **Шаг 1:** создать обёртки. Работа, которую предстоит выполнить, запаковывается в четыре объекта типа `std::packaged_task` (строки `std::packaged_task<int(int, int)> sumTask1(sumUp1);` – `std::packaged_task<int(int, int)> sumTask4(sumUp4);`). Задания на работу представлены экземплярами класса `SumUp`, объявленного `class SumUp{ ... }`. Собственно работа выполняется в перегруженной операции вызова. Эта функция вычисляет и возвращает сумму чисел от `beg` до `end-1`. Объекты-обёртки, объявленные в строках `std::packaged_task<int(int, int)> sumTask1(sumUp1);` – `std::packaged_task<int(int, int)> sumTask4(sumUp4);`, могут управлять такими вызываемыми объектами, у которых два аргумента и возвращаемое значение типа `int`.
> 
> **Шаг 2:** создать [[future|фьючерсы]]. Имея объекты-обёртки типа `std::packaged_task`, нужно теперь получить из них [[future|фьючерсы]]. Это делается в строках `std::future<int> sumResult1 = sumTask1.get_future()` – `std::future<int> sumResult4 = sumTask4.get_future()`. В канале, по которому проходят данные, объект `std::packaged_task` играет роль обещания. В этом примере тип [[future|фьючерса]] указан явно (`std::future<int>`), хотя вывод типа можно поручить и компилятору, воспользовавшись ключевым словом `auto`.
>
> **Шаг 3:** запустить вычисление. Теперь пора выполнить работу. Объекты типа `packaged_task` помещаются в контейнер [[deque|std::deque]] (в строках `std::deque<std::packaged_task<int(int,int)>> allTasks`; – `allTasks.push_back(std::move(sumTask4));`). Затем каждое задание запускается на выполнение в строках `while (not allTasks.empty()){ ... }`. Для этого объект-обёртка из начала очереди перемещается во временную переменную (`std::packaged_task<int(int, int)> myTask = std::move(allTasks.front());`) и запускается в новом потоке (`std::thread sumThread(std::move(myTask), begin, end);`), после чего поток продолжает выполняться в фоновом режиме (`sumThread.detach();`). Тип `std::packaged_task` не поддерживает копирования, поэтому использована семантика перемещения (`std::move`). Такое же ограничение имеет место для [[promise|обещаний]], а также для [[future|фьючерсов]] и [[thread#std thread|потоков]]. Единственным исключением из этого правила является тип [[future#std shared_future|std::shared_future]].
> 
> **Шаг 4:** запросить результат вычисления. На заключительном шаге нужно получить результат вычислений из каждого [[future|фьючерса]] и просуммировать их – это происходит в строке `auto sum = sumResult1.get() + sumResult2.get() + sumResult3.get() + sumResult4.get();`.

Пример работы программы показан на рисунке.

![[ParallelProg_85.png]]

> Частный случай формулы для суммы арифметической прогрессии с нулевым первым членом и единичной разностью, т. е. суммы натуральных чисел от 0 до некоторого `n`, выведенный Карлом Фридрихом Гауссом в возрасте девяти лет. Когда учитель задал ученикам вычислить сумму чисел от 1 до 100, ученик Гаусс заметил, что утомительных и кропотливых вычислений можно избежать, если суммируемые числа разбить на пары: 
> `(1 + 100) + (2 + 99) + (3 + 98) + … + (50 + 51)`.
> Каждая пара слагаемых даёт в сумме 101, всего же таких пар имеется 50. Следовательно, искомая сумма составляет `51 × 101`.

В следующей таблице показан интерфейс класса `std::packaged_task`.

| **Функция-член**            | **Описание**                                                                                                   |
| --------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `swap`                      | Меняет местами содержимое двух объектов. Вызов `pack.swap(pack2)` эквивалентен вызову `std::swap(pack, pack2)` |
| `valid`                     | Проверяет, содержит ли обёртка в себе функцию (или вызываемый объект)                                          |
| `get_future`                | Возвращает фьючерс, связанный с асинхронным заданием                                                           |
| `make_ready_at_thread_exit` | Выполняет содержащуюся в обёртке функцию. Результат становится доступен по завершении потока                   |
| `reset`                     | Сбрасывает состояние объекта-обёртки, очищая сохранённый результат предыдущего запуска                         |

В отличие от объектов типа [[future|std::future]] или [[promise|std::promise]], асинхронные задания типа `std::packaged_task` можно очищать и использовать повторно. В следующем примере показан такой способ обращения с заданиями.

**Повторное использование асинхронных заданий:**
```c++
// packagedTaskReuse.cpp

#include <functional>

#include <future>
#include <iostream>
#include <utility>
#include <vector>

void calcProducts(std::packaged_task<int(int, int)>& task,
					const std::vector<std::pair<int, int>>& pairs)
{
	for (auto& pair: pairs){
		auto fut = task.get_future();
		task(pair.first, pair.second);

		std::cout<< pair.first << “ * “<< pair.second<< “ = “
							<< fut.get() << std::endl; task.reset();
	}
}

int main(){
	std::cout << std::endl;

	std::vector<std::pair<int, int>> allPairs;
	allPairs.push_back(std::make_pair(1, 2));
	allPairs.push_back(std::make_pair(2, 3));
	allPairs.push_back(std::make_pair(3, 4));
	allPairs.push_back(std::make_pair(4, 5));

	std::packaged_task<int(int, int)> task{
						[](int fir, int sec){ return fir * sec; }};

	calcProducts(task, allPairs);

	std::cout << std::endl;

	std::thread t(calcProducts, std::ref(task), allPairs);
	t.join();

	std::cout << std::endl;
}
```

Функция `calcProducts`, получает два аргумента: асинхронное задание и вектор пар целых чисел. Задание используется для того, чтобы вычислять произведение каждой пары чисел (строка `task(pair.first, pair.second);`). В конце каждой итерации (строка `task.reset();`) состояние объекта-задания очищается, чтобы на следующей итерации его можно было использовать заново. Функция `calcProducts` выполняется один раз в главном потоке (строка `calcProducts(task, allPairs);`) и второй раз – в отдельном потоке (строка `std::thread t(calcProducts, std::ref(task), allPairs);`). Результат работы программы показан на рисунке.

![[ParallelProg_86.png]]


