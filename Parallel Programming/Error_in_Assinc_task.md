
# Обработка исключений в асинхронных заданиях

Если вызываемый объект, превращённый в [[asyncVersus#Асинхронные задания|асинхронное задание]] функцией [[async#std async|std::async]] или классом [[packaged_task#std packaged_task|std::packaged_task]], выбрасывает исключение, это исключение запоминается в [[future#Состояние фьючерса|состоянии фьючерса]] и повторно выбрасывается из него при попытке взять из [[future|фьючерса]] результат функцией `get`. Код, использующий [[future|фьючерс]], должен позаботиться об обработке исключения.

Класс [[promise#std promise|std::promise]] позволяет запомнить исключение в состоянии асинхронного задания, для чего служит функция-член `set_exception`, в качестве аргумента которой обычно передают значение, полученное из функции `std::current_exception()`.

Деление на ноль ведёт к неопределённому поведению. В следующем примере функция `executeDivision` отображает результат деления или исключение.

**Обработка исключений в асинхронных заданиях:**
```c++
// promiseFutureException.cpp

#include <exception>
#include <future>
#include <iostream>
#include <thread>
#include <utility>

struct Div{
	void operator()(std::promise<int>&& intPromise, int a, int b) {
		try {
			if ( b==0 ) {
				std::string errMess = 
						std::string(“Illegal division by zero: “) + 
						std::to_string(a) + “/” + std::to_string(b);
				
				throw std::runtime_error(errMess);
			}
			intPromise.set_value(a/b);
		}
		catch ( ... ) {
			intPromise.set_exception(std::current_exception());
		}
	}
};

void executeDivision(int nom, int denom) {
	std::promise<int> divPromise;
	std::future<int> divResult= divPromise.get_future();

	Div div;
	std::thread divThread(div,std::move(divPromise), nom, denom);

	// get the result or the exception
	try {
		std::cout << nom << “/” << Denom << “ = “
			<< divResult.get() << std::endl;
	}
	catch (std::runtime_error& e){
		std::cout << e.what() << std::endl;
	}

	divThread.join();
}

int main() {
	std::cout << std::endl;

	executeDivision(20, 0);
	executeDivision(20, 10);

	std::cout << std::endl;
}
```

Обещание используется для обработки как нормального случая, так и случая, когда делитель равен нулю. В этом последнем случае вместо возвращаемого значения в обещание сохраняется исключение (строка `intPromise.set_exception(std::current_exception());`). Фьючерс в блоке try-catch обрабатывает это исключение. На рисунке представлен результат работы программы.

![[ParallelProg_91.png]]

> **Функции `std::current_exception` и `std::make_exception_ptr`:**
>
> Функция `std::current_exception` превращает текущее исключение в значение типа `std::exception_ptr`. Этот тип позволяет хранить либо объект-исключение, либо ссылку на него. Если данную функцию вызывать в такой момент, когда никакое исключение не находится в процессе обработки, она возвращает пустое значение типа `std::exception_ptr`.
> 
> Вместо того чтобы выбрасывать исключение в блоке `try`, сразу ловить его в блоке `catch` и превращать в значение типа `std::exception_ptr`, можно воспользоваться функцией `std::make_exception_ptr`, например:
```c++
intPromise.set_exception(
	std::make_exception_ptr(
		std::runtime_error(errMess)
));
```

Если объект типа [[promise|std::promise]] разрушается по окончании времени жизни, притом что для него не вызывалась функция-член из семейства `set_`, или если объект типа [[packaged_task|std::packaged_task]] разрушается, не будучи вызванным, в связанном с ними состоянии сохраняется исключение типа `std::future_error` с кодом `std::future_errc::broken_promise`.

