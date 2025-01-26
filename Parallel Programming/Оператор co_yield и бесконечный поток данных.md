
# Оператор co_yield и бесконечный поток данных

Благодаря оператору `co_yield` становится возможным реализовать генератор бесконечного потока данных, из которого клиент может получить одно за другим сколь угодно много значений. Тип возвращаемого значения функции `generatorForNumbers` указан как `generator<int>`. Объект этого типа должен содержать в себе объект-обещание `p`, причём оператор `co_yield i` превращается компилятором в выражение `co_await p.yield_value(i)`. Оператор `co_yield i` может быть выполнен сколь угодно много раз, и каждый раз выполнение сопрограммы должно приостанавливаться.

Следующая программа генерирует бесконечный поток данных. Сопрограмма `getNext` посредством оператора `co_yield` выдаёт числа, начиная со значения `start`, увеличивая каждое следующее значение на величину `step`.

**Бесконечный поток данных:**
```c++
// infiniteDataStream.cpp

#include <coroutine>
#include <memory>
#include <iostream>

template<typename T>
struct Generator {
	struct promise_type;
	using handle_type = std::coroutine_handle<promise_type>;

	Generator(handle_type h): coro(h) {}

	handle_type coro;
	std::shared_ptr<T> value;

	~Generator() {
		if ( coro ) 
			coro.destroy();
	}

	Generator(const Generator&) = delete;

	Generator& operator = (const Generator&) = delete;

	Generator(Generator&& oth): coro(oth.coro) {
		oth.coro = nullptr;
	}

	Generator& operator = (Generator&& oth) {
		coro = oth.coro;
		oth.coro = nullptr;

		return *this;
	}

	int getValue() {
		return coro.promise().current_value;
	}

	bool next() {
		coro.resume();
		return not coro.done();
	}

	struct promise_type {
		promise_type() = default;

		~promise_type() = default;

		auto initial_suspend() {
			return std::suspend_always{};
		}

		auto final_suspend() noexcept {
			return std::suspend_always{};
		}

		auto get_return_object() {
			return Generator{handle_type::from_promise(*this)};
		}

		auto return_void() {
			return std::suspend_never{};
		}

		auto yield_value(int value) {
			current_value = value;
			return std::suspend_always{};
		}

		void unhandled_exception() {
			std::exit(1);
		}

		T current_value;
	};
};

Generator<int> getNext(int start = 0, int step = 1) {
	auto value = start;

	while (true) {
		co_yield value;
		value += step;
	}
}

int main() {
	std::cout << ‘\n’;

	std::cout << “getNext():”;

	auto gen = getNext();
	for (int i = 0; i <= 10; ++i) {
		gen.next();

		std::cout << “ “ << gen.getValue();
	}

	std::cout << “\n\n”;

	std::cout << “getNext(100, -10):”;
	
	auto gen2 = getNext(100, -10);
	for (int i = 0; i <= 20; ++i) {
		gen2.next();
		
		std::cout << “ “ << gen2.getValue();
	}
	std::cout << ‘\n’;
}
```

В функции `main` создаются две сопрограммы. Первая из них, названная `gen` (строка `auto gen = getNext();`), возвращает значения от 0 и далее по возрастанию, а программа выбирает из них первые 11 элементов: до числа 10 включительно. Вторая, названная `gen2` (строка `auto gen2 = getNext(100, -10);`), выдаёт значения, начиная со `100` и с шагом `–10`, программа из них выбирает 21 элемент, т. е. значения от 100 до –100. Прежде чем погрузиться в разбор того, как работает эта программа, посмотрим на результат её работы, полученный благодаря интерактивной системе `Wandbox`.

![[ParallelProg_111.png]]

Функционирование программы начинается с такой последовательности шагов.
1. Создаётся объект-обещание.
2. Вызывается функция `promise.get_return_object()`, её результат сохраняется в переменной.
3. Создаётся генератор `gen` или `gen2`.
4. Вызывается функция `promise.initial_suspend()`. Генератор работает по ленивой стратегии, поэтому всегда начинает свою работу с приостановки. Управление при этом передаётся клиентскому коду.
5. Клиентский код запрашивает у генератора следующее значение. Управление передаётся сопрограмме.
6. Сопрограмма выполняет оператор `co_yield`. Он вырабатывает значение для возврата, выполнение сопрограммы приостанавливается, а управление передаётся клиентскому коду.
7. Клиентский код обрабатывает полученное от генератора значение. На последующих итерациях цикла выполняются только шаги 5–7. 

