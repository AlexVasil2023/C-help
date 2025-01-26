
[[#Оператор co_await|Оператор co_await]] 5.8
1. [[#Запуск задания по запросу|Запуск задания по запросу]] 5.8.1

# Оператор co_await

Оператор `co_await` управляет приостановкой и последующим возобновлением работы сопрограммы. В операторе `co_await exp` выражение `exp` должно быть так называемым прообразом ожидания (англ. awaitable). Он должен поддерживать преобразование в контроллер ожидания (англ. awaiter), который, в свою очередь, должен реализовывать определённый интерфейс, состоящий из трёх функций: `await_ready`, `await_suspend` и `await_resume`. Типичный пример ситуации, когда стоит использовать оператор `co_await`, даёт сервер, ожидающий входящих запросов и отвечающий на них. Традиционная реализация могла бы выглядеть так:

**Блокирующий сервер:**
```c++
Acceptor acceptor{443};

while (true) {
	Socket socket = acceptor.accept();         // блокирует
	auto request = socket.read();              // блокирует
	auto response = handleRequest(request);
	socket.write(response);                    // блокирует
}
```

Этот сервер очень прост, так как он всего лишь отвечает на все запросы последовательно в одном и том же потоке. Сервер слушает порт `443`, принимает соединение (строка `Socket socket = acceptor.accept();`), читает данные, присланные клиентом (строка `auto request = socket.read();`), и посылает клиенту ответ (строка `socket.write(response);`). 

Благодаря оператору `co_await` эти блокирующие вызовы можно заменить сопрограммами с приостановкой и возобновлением работы.

**Ожидающий сервер:**
```c++
Acceptor acceptor{443};

while (true) {
	Socket socket = co_await acceptor.accept();
	auto request = co_await socket.read();
	auto response = handleRequest(request);
	co_await socket.write(response);
}
```

Перед тем как представить усложнённый пример синхронизации потоков с использованием сопрограмм, начнём с чего-то более простого: с запуска задания по запросу.

## Запуск задания по запросу

Следующая сопрограмма проста настолько, насколько это вообще возможно. Она приостанавливается и ожидает возможности продолжить выполнение, причём в роли контроллера ожидания выступает объект предопределённого типа `std::suspend_never()`.

**Запуск задания по запросу:**
```c++
// startJob.cpp

#include <coroutine>
#include <iostream>

struct Job {
	struct promise_type;
	using handle_type = std::coroutine_handle<promise_type>;
	handle_type coro;

	Job(handle_type h)
		: coro(h)
	{}

	~Job() {
		if ( coro ) 
			coro.destroy();
	}

	void start() {
		coro.resume();
	}

	struct promise_type {
		auto get_return_object() {
			return Job{handle_type::from_promise(*this)};
		}

		std::suspend_always initial_suspend() {
			std::cout << “Preparing job” << ‘\n’;
	
			return {};
		}
	
		std::suspend_always final_suspend() noexcept {
			std::cout << “Performing job” << ‘\n’;
			
			return {};
		}
	
		void return_void() 
		{}
	
		void unhandled_exception() 
		{}
	};
};

 Job prepareJob() {
	co_await std::suspend_never();
}

int main() {
	std::cout << “Before job” << ‘\n’;

	auto job = prepareJob();
	job.start();

	std::cout << “After job” << ‘\n’;
}
```

Читатель может подумать, что сопрограмма `prepareJob`, объявленная в строке `Job prepareJob()`, совершенно бесполезна, потому что она якобы пытается ожидать чего-то, но контроллер ожидания велит ей не приостанавливать выполнения. Однако она вовсе не бесполезна! Функция `prepareJob` – это по меньшей мере фабрика сопрограмм, которая выполняет оператор `co_yield` (строка `co_await std::suspend_never();`) и возвращает объект-сопрограмму. Вызов функции `prepareJob` в строке `auto job = prepareJob();` приводит к созданию объекта-сопрограммы типа `Job`. Если же теперь присмотреться к реализации класса `Job`, легко убедиться, что объект-сопрограмма сразу после создания приостанавливает своё выполнение, поскольку функция-член `initial_suspend` объекта-обещания возвращает контроллер ожидания `std::suspend_always` (строка `std::suspend_always initial_suspend()`). Именно поэтому для фактического запуска сопрограммы нужен вызов в строке `job.start();` функции-члена `job.start`. Функция-член `final_suspend`, объявленная в строке `std::suspend_always final_suspend() noexcept`, также возвращает контроллер ожидания `std::suspend_always`. Ниже представлен результат запуска программы.

![[ParallelProg_112.png]]


