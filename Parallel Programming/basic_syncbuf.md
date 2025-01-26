
[[#Синхронизированные потоки вывода (стандарт С++ 20)|Синхронизированные потоки вывода (стандарт С++ 20)]]
[[#std basic_syncbuf|std basic_syncbuf]]
[[#std basic_streambuf]]
[[#std basic_osyncstream]]

# Синхронизированные потоки вывода (стандарт С++ 20)

Что происходит, если отправлять данные в поток вывода `std::cout` без всякой синхронизации?

**Несинхронизированный доступ к потоку `std::cout`:**
```c++
// coutUnsynchronised.cpp

#include <chrono>
#include <iostream>
#include <thread>

class Worker{
	public:
		Worker(std::string n)
			:name(n){};

		void operator() (){
			for (int i = 1; i <= 3; ++i){
				// begin work
					std::this_thread::sleep_for(std::chrono::
													milliseconds(200));
				// end work
					std::cout << name << “: “ << “Work “ << i
											<< “ done !!!” << std::endl;
			}
		}
	private:
		std::string name;
};

int main(){
	std::cout << std::endl;

	std::cout << “Boss: Let’s start working.\n\n”;

	std::thread herb= std::thread(Worker(“Herb”));
	std::thread andrei= std::thread(Worker(“ Andrei”));
	std::thread scott= std::thread(Worker(“  Scott”));
	std::thread bjarne= std::thread(Worker(“   Bjarne”));
	std::thread bart= std::thread(Worker(“    Bart”));
	std::thread jenne= std::thread(Worker(“     Jenne”));

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

У начальника есть шесть работников (строки `std::thread herb= std::thread(Worker(“Herb”));` – `std::thread jenne= std::thread(Worker(“     Jenne”));`). Каждому работнику нужно выполнить три задания, каждое из которых занимает 1/5 секунды (строка `std::this_thread::sleep_for(std::chrono::milliseconds(200));`). Выполнив каждое задание, работник громко кричит об этом в стандартный поток вывода (строка `std::cout << name << “: “ << “Work “ ... `). Когда все работники сделают всю работу, начальник отпускает их домой. Результат работы программы можно видеть на рисунке. Сколько путаницы для такой простой организации! Каждый работник выкрикивает свой доклад, не обращая внимания на своих коллег!

![[ParallelProg_93.png]]

Стоит напомнить, что причудливое чередование операций вывода в поток – лишь дефект наблюдаемого поведения программы, а не гонка данных.

Как справиться с этой трудностью? Стандарт C++11 предлагал единственный ответ: воспользоваться объектом-синхронизатором наподобие [[lock#Тип std lock_guard|lock_guard]] для синхронизации доступа потоков к объекту [[cout|std::cout]], как показано
в следующей программе.

**Синхронизированный доступ к потоку [[cout|std::cout]]:**
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
			for (int i = 1; i <= 3; ++i) {
				// begin work
					std::this_thread::sleep_for(
										std::chrono::milliseconds(200));
				// end work
					std::lock_guard<std::mutex> coutLock(coutMutex);

				std::cout << name << “: “ << “Work “ << i
											<< “ done !!!” << std::endl;
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
	std::thread scott= std::thread(Worker(“  Scott”));
	std::thread bjarne= std::thread(Worker(“   Bjarne”));
	std::thread bart= std::thread(Worker(“    Bart”));
	std::thread jenne= std::thread(Worker(“     Jenne”));

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

Мьютекс `coutMutex`, объявленный в строке `std::mutex coutMutex;`, защищает глобальный объект [[cout|std::cout]] от одновременного доступа. Оборачивание этого [[mutex|мьютекса]] во вспомогательный объект типа [[lock#Тип std lock_guard|std::lock_guard]] гарантирует, что [[mutex|мьютекс]] будет захвачен в его конструкторе (строка `std::lock_guard<std::mutex> coutLock(coutMutex);`) и освобождён в деструкторе при выходе из блока.

![[ParallelProg_94.png]]

С появлением стандарта C++20 синхронизированный вывод в поток [[cout|std::cout]] становится проще простого. Тип [[basic_syncbuf|std::basic_syncbuf]] представляет собой обёртку над типом [[#std basic_streambuf|std::basic_streambuf]]. Все посылаемые в него данные он не выводит, а накапливает. Объект-обёртка посылает накопленное содержимое в находящийся под её управлением объект только в момент своего разрушения. Следовательно, данные выводятся в виде непрерывной последовательности символов, и операции вывода из различных потоков между собой не перемешиваются.

Благодаря шаблону класса [[#std basic_osyncstream|std::basic_osyncstream]] становится возможным напрямую писать в поток вывода с синхронизацией. В стандарте C++20 определены две специализации этого шаблона: для символов типа [[Char|char]] и типа [[wchar_ t|wchar_t]].

```c++
std::osyncstream               std::basic_osyncstream<char>
std::wosyncstream              std::basic_osyncstream<wchar_t>
```

Эти классы-обёртки позволяют создавать именованные синхронизированные потоки вывода. Ниже показан результат переделки разобранной ранее несинхронизированной программы с использованием синхронных потоков.

**Синхронизированный вывод с помощью обёртки [[#std basic_osyncstream|std::osyncstream]]:**
```c++
// synchronizedOutput.cpp

#include <chrono>
#include <iostream>
#include <syncstream>
#include <thread>

class Worker{
	public:
		Worker(std::string n):name(n) {};

		void operator() (){
			for (int i = 1; i <= 3; ++i) {
				// begin work
					std::this_thread::sleep_for(
										std::chrono::milliseconds(200));
				// end work
					std::osyncstream syncStream(std::cout);

				syncStream << name << “: “ << “Work “ << i
												<< “ done !!!” << ‘\n’;
			}
		}
	private:
		std::string name;
};

int main() {
	std::cout << ‘\n’;

	std::cout << “Boss: Let’s start working.\n\n”;

	std::thread herb= std::thread(Worker(“Herb”));
	std::thread andrei= std::thread(Worker(“ Andrei”));
	std::thread scott= std::thread(Worker(“   Scott”));
	std::thread bjarne= std::thread(Worker(“    Bjarne”));
	std::thread bart= std::thread(Worker(“      Bart”));
	std::thread jenne= std::thread(Worker(“      Jenne”));

	herb.join();
	andrei.join();
	scott.join();
	bjarne.join();
	bart.join();
	jenne.join();

	std::cout << “\n” << “Boss: Let’s go home.” << ‘\n’;

	std::cout << ‘\n’;
}
```

Единственное отличие этой программы от программы `coutUnsynchroni­z ed.cpp` состоит в том, что теперь поток [[cout|std::cout]] обёрнут в объект типа [[#std basic_osyncstream|std::osyncstream]] (строка `std::osyncstream syncStream(std::cout);`). Чтобы пользоваться в программе типом [[#std basic_osyncstream|std::osyncstream]], нужно подключить заголовочный файл `<syncstream>`. Когда объект-обёртка заканчивает своё существование с выходом из блока, символы из него за одну операцию отправляются в поток [[cout|std::cout]]. Стоит отметить, что обращения к потоку [[cout|std::cout]] в функции `main` происходят тогда, когда все работники закончили свою работу, и эти обращения
синхронизировать не нужно.

Поскольку объект `syncStream`, объявленный в строке `std::osyncstream syncStream(std::cout);`, используется только один раз, здесь мог бы лучше подойти временный объект. В следующем фрагменте кода показано незначительное изменение.

```c++
void operator() (){
	for (int i = 1; i <= 3; ++i) {
		// begin work
			std::this_thread::sleep_for(std::chrono::milliseconds(200));
		// end work
			std::osyncstream (std::cout) << name << “: “ << “Work “ << i
												<< “ done !!!” << ‘\n’;
	}
}
```

В классе [[#std basic_osyncstream|std::basic_osyncstream]] содержатся две интересные функции:

* **emit** – осуществляет вывод всех накопленных символов и очищает буфер;
* `get_wrapped` – возвращает указатель на буфер, завёрнутый в буфер-синхронизатор.

На сайте *cppreference.com* приводится пример того, как можно управлять последовательностью вывода в поток с помощью функции-члена `get_wrapped`. 

**Управление последовательностью вывода:**
```c++
// sequenceOutput.cpp

#include <syncstream>
#include <iostream>

int main() {
	std::osyncstream bout1(std::cout);
	bout1 << “Hello, “;
	
	{
		std::osyncstream(bout1.get_wrapped())
			<< “Goodbye, “ << “Planet!” << ‘\n’;
	} // emits the contents of the temporary buffer

	bout1 << “World!” << ‘\n’;
} // emits the contents of bout1
```

Результат работы этой программы показан на рисунке.

![[ParallelProg_95.png]]

# std::basic_syncbuf
#std_basic_syncbuf

В стандарте C++20 появились синхронизированные потоки вывода. Класс `std::basic_syncbuf` представляет собой обёртку над классом [[#std basic_streambuf|std::basic_streambuf]]. Все выводимые символы он накапливает в буфере. Объект-обёртка отправляет накопленные символы в обёрнутый ею поток только в момент своего уничтожения. Следовательно, все сообщения, выведенные в синхронизированный поток, появятся в настоящем потоке вывода в виде единой, цельной последовательности символов. Сообщения из разных потоков при этом перемежаться не могут. Таким образом, из разных потоков можно выводить сообщения в поток [[stdout|stdout]], не опасаясь путаницы.

# std::basic_streambuf
#std_basic_streambuf






# std::basic_osyncstream
#std_basic_osyncstream



















