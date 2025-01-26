
[[#Типы std promise и std future]]
1. [[promise#std promise|Тип std::promise]] 3.9.4.1
2. [[future#std future|Тип std::future]] 3.9.4.2
	1. [[future#Состояние фьючерса|Состояние фьючерса]] 3.9.4.2.1
	
# Типы std::promise и std::future

Шаблоны классов [[promise#std promise|std::promise]] и [[future#std future|std::future]] предоставляют программисту полную власть над асинхронными заданиями. Вместе они составляют могучую пару. [[promise#std promise|Обещание (std::promise)]] позволяет поместить значение, исключение или просто оповещение в канал обработки данных. Одно обещание может поставлять данные одновременно для множества [[future#std future|фьючерсов]]. В будущих версиях стандарта могут появиться [[future#Расширенные фьючерсы|расширения фьючерсов]], поддерживающие композицию.

Ниже показан простейший пример использования [[promise#std promise|обещаний]] и [[future#std future|фьючерсов]]. Работа с двумя концами канала обработки данных может происходить в различных потоках – в этом случае канал обеспечивает взаимодействие между
потоками.

Использование [[promise#std promise|обещаний]] и [[future#std future|фьючерсов]]:
```c++
// promiseFuture.cpp

#include <future>
#include <iostream>
#include <thread>
#include <utility>

void product(std::promise<int>&& intPromise, int a, int b){
	intPromise.set_value(a*b);
}

struct Div{
	void operator() (std::promise<int>&& intPromise, int a, int b) const {
		intPromise.set_value(a/b);
	}
};

int main(){
	int a = 20;
	int b = 10;

	std::cout << std::endl;

	// define the promises
	std::promise<int> prodPromise;
	std::promise<int> divPromise;

	// get the futures
	std::future<int> prodResult = prodPromise.get_future();
	std::future<int> divResult = divPromise.get_future();

	// calculate the result in a separate thread
	std::thread prodThread(product, std::move(prodPromise), a, b);
	
	Div div;
	std::thread divThread(div, std::move(divPromise), a, b);

	// get the result
	std::cout << “20*10 = “ << prodResult.get() << std::endl;
	std::cout << “20/10 = “ << divResult.get() << std::endl;

	prodThread.join();
	divThread.join();
	
	std::cout << std::endl;
}
```

Поток `prodThread` создаётся в строке `std::thread prodThread(product, std::move(prodPromise), a, b);`, в качестве параметров ему передаются функция `product`, обещание `prodPromise` (строка `std::promise<int> prodPromise;`) и два числа: `a` и `b`. Чтобы понять назначение этих параметров, нужно присмотреться к сигнатуре функции. Первым аргументом конструктор потока всегда принимает вызываемый объект. Здесь это функция `product`. Функции `product`, в свою очередь, нужны обещание, причём непременно по ссылке [[rvalue|rvalue]], и два числа. Они и составляют последние три аргумента, передаваемые при создании потока `prodThread`. Остальное довольно просто. Поток `divThread`, создаваемый в строке `std::thread divThread(div, std::move(divPromise), a, b);`, делит одно число на другое. Для этой цели он использует функциональный объект – экземпляр `div` типа `Div`. Наконец, вызов функции-члена `get` извлекает из [[future#std future|фьючерсов]] результаты асинхронных вычислений. Работа программы показана на рисунке.

![[ParallelProg_87.png]]


