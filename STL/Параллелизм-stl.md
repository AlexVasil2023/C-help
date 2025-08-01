
1. [[#Введение|Введение]] 18.1
2. [[#Задачи и thread|Задачи и thread]] 18.2
	1. [[#Передача аргументов|Передача аргументов]] 18.2.1
	2. [[#Возвращение результатов|Возвращение результатов]] 18.2.2
3. [[#Обмен данными|Обмен данными]] 18.3
	1. [[#mutex и блокировки|mutex и блокировки]] 18.3.1
	2. [[#atomic|atomic]] 18.3.2
4. [[#Ожидание событий|Ожидание событий]] 18.4
5. [[#Коммуникации задач|Коммуникации задач]] 18.5
	1. [[#future и promise|future и promise]] 18.5.1
	2. [[#packaged_task|packaged_task]] 18.5.2
	3. [[#async()|async()]] 18.5.3
	4. [[#Остановка thread|Остановка thread]] 18.5.4
6. [[#Корутины (сопрограммы)|Корутины (сопрограммы)]] 18.6


# Введение

***===Параллелизм===*** – выполнение нескольких задач одновременно – широко используется для повышения пропускной способности (за счет использования нескольких процессоров для одного вычисления) или для повышения быстродействия (позволяя одной части программы выполнять работу, в то время как другая ожидает ответа). Все современные языки программирования обеспечивают поддержку этого. Поддержка, предоставляемая стандартной библиотекой C++, является переносимым и типобезопасным вариантом того, что используется в C++ уже более 20 лет и почти повсеместно поддерживается современным оборудованием. Поддержка стандартной библиотеки в первую очередь направлена на поддержку параллелизма на системном уровне, а не на прямое предоставление сложных моделей параллелизма более высокого уровня; они могут поставляться в виде библиотек, созданных с использованием средств стандартной библиотеки.

Стандартная библиотека напрямую поддерживает одновременное выполнение нескольких потоков в одном адресном пространстве. Чтобы обеспечить это, C++ предоставляет подходящую модель памяти и набор атомарных операций. Атомарные операции позволяют программировать без блокировок. Модель памяти гарантирует, что до тех пор, пока программист избегает состояния гонки за данные (неконтролируемый параллельный доступ к изменяемым данным), все работает так, как можно было бы наивно ожидать. Однако большинство пользователей увидят параллелизм только в терминах стандартной библиотеки и библиотек, построенных поверх нее. В этом разделе кратко приведены примеры основных средств поддержки параллелизма стандартной библиотеки: [[thread|thread]], [[mutex|mutex]], операции [[lock|lock()]], [[packaged_task|packaged_task]] и [[future|future]]. Эти функции основаны непосредственно на том, что предлагают операционные системы, и не приводят к снижению производительности по сравнению с ними. Они также не гарантируют значительного повышения производительности по сравнению с тем, что предлагает операционная система.

Не рассматривайте параллелизм как панацею. Если задачу можно выполнять последовательно, то часто это делается проще и быстрее. Передача информации из одного потока в другой может оказаться на удивление дорогостоящей.

В качестве альтернативы использованию явных функций параллелизма мы часто можем использовать [[Алгоритмы - STL#Параллельные алгоритмы|параллельный алгоритм]] для использования [[Числовые вычисления#Многопоточные численные алгоритмы|нескольких механизмов выполнения для повышения производительности]].

Наконец, C++ поддерживает [[Особенности сопрограмм|корутины (сопрограммы)]], то есть функции, которые сохраняют свое состояние между вызовами.

# Задачи и thread

Мы называем вычисление, которое потенциально может выполняться одновременно с другими вычислениями, [[task|задачей (task)]]. [[thread|Поток (thread)]]- это представление задачи в программе на системном уровне. Задача, которая должна выполняться одновременно с другими задачами, запускается путем создания [[thread|thread]] (находящегося в `<thread>`) с задачей в качестве аргумента. Задача - это функция или функциональный объект:
```c++
void f();               // function

struct F {              // function object
	void operator()();  // F's call operator
};

void user()
{
	thread t1 {f};      // f() executes in separate thread
	thread t2 {F{}};    // F{}() executes in separate thread

	t1.join();          // wait for t1
	t2.join();          // wait for t2
}
```

Функции `join()` гарантируют, что мы не выйдем из `user()` до завершения потоков. “Присоединиться” к потоку означает “дождаться завершения потока”.

Легко забыть `join()`, и результаты этого обычно плохие, поэтому стандартная библиотека предоставляет [[thread#std jthread|jthread]], который является “присоединённым thread”, который следует `RAII` вызывая [[thread#Функции join и detach|join()]] с помощью своего деструктора:
```c++
void user()
{
	jthread t1 {f};    // f() executes in separate thread
	jthread t2 {F{}};  // F{}() executes in separate thread
}
```

Присоединение к потоку выполняется деструкторами, поэтому порядок построения обратный. Здесь мы ждем завершения `t2` до `t1`.

Потоки программы совместно используют одно адресное пространство. В этом потоки отличаются от процессов, которые обычно напрямую не обмениваются данными. Поскольку потоки совместно используют адресное пространство, они могут взаимодействовать через общие объекты ( #§18_3). Такая связь обычно контролируется блокировками или другими механизмами для предотвращения состояние гонки за данные (неконтролируемый параллельный доступ к переменной).

Программирование параллельных задач может быть очень сложным делом. Рассмотрим возможные реализации задач `f` (функция) и `F` (функциональный объект):
```c++
void f()
{
	cout << "Hello ";
}

struct F {
	void operator()() { cout << "Parallel World!\n"; }
};
```

Это пример серьезной ошибки: здесь и `f`, и `F{}` используют объект `cout` без какой-либо формы синхронизации. Результирующий вывод был бы непредсказуемым и мог бы варьироваться при различных выполнениях программы, поскольку порядок выполнения отдельных операций в двух задачах не определен. Программа может выдавать “странный” вывод, например
```
PaHerallllel o World!
```

Только определённая в стандарте гарантия спасает нас от гонки данных в рамках определения [[stream#std ostream|ostream]], которая может привести к сбою.

Чтобы избежать подобных проблем с выходными потоками, либо попросите только один [[thread|thread]] использовать выходной поток, либо используйте [[syncstream#osyncstream|osyncstream]].

При определении задач многопоточной программы наша цель состоит в том, чтобы полностью разделить задачи, за исключением случаев, когда они взаимодействуют простыми и очевидными способами. Самый простой способ представить параллельную задачу как функцию, которая выполняется одновременно с вызывающей ее. Чтобы это сработало, нам просто нужно передать аргументы, вернуть результат и убедиться, что между ними нет использования общих данных (никаких соревнований за данные).

## Передача аргументов

Как правило, для работы задачи требуются данные. Мы можем легко передавать данные (или указатели, или ссылки на данные) в качестве аргументов. Рассмотрим:
```c++
void f(vector<double>& v);   // function: do something with v

struct F {                   // function object: do something with v
	vector<double>& v;
	F(vector<double>& vv) :v{vv} { }
	void operator()();       // application operator
};

int main()
{
	vector<double> some_vec {1, 2, 3, 4, 5, 6, 7, 8, 9};
	vector<double> vec2 {10, 11, 12, 13, 14};

	// f(some_vec) executes in a separate thread
	jthread t1 {f, ref(some_vec)};
	// F(vec2)() executes in a separate thread	
	jthread t2 {F{vec2}};
}
```

`F{vec2}` принимает ссылку на вектор в качестве аргумента в `F`. Теперь `F` может использовать этот вектор, и, надеюсь, никакая другая задача не обращается к `vec2` во время выполнения `F`. Передача `vec2` по значению устранила бы этот риск.

Инициализация с помощью `{f, ref(some_vec)}` использует конструктор вариадик шаблона [[thread|thread]], который может принимать [[Концепты и обобщенное программирование - STL#Шаблоны с переменным числом аргументов|произвольную последовательность аргументов]]. `ref()` - это функция типа из `<functional>`, которая, к сожалению, необходима для указания [[Вариативные шаблоны#Вариативные шаблоны|вариадик шаблону]] обрабатывать `some_vec` как ссылку, а не как объект. Без `ref()` аргумент `some_vec` передавался бы по значению. Компилятор проверяет, что первый аргумент может быть вызван с учетом следующих аргументов, и создает необходимый объект функции для передачи потоку. Таким образом, если `F::operator()()` и `f()` выполняют один и тот же алгоритм, то обработка двух задач примерно эквивалентна: в обоих случаях создается функциональный объект для запуска [[thread|thread]].

# Возвращение результатов

[[Параллелизм-stl#Передача аргументов|В примере]], я передаю аргументы по [[По значению или по ссылке#Передача с помощью неконстантной ссылки|неконстантной ссылке]]. Я делаю это только в том случае, если ожидаю, что [[Программы - STL#Указатели, Массивы и Ссылки|задача изменит значение упомянутых данных]]. Это несколько хитрый, но нередкий способ вернуть результат. Более явный метод заключается в передаче входных данных по [[const|const]] ссылке и передаче указателя или ссылки на местоположение результата в качестве отдельного аргумента:
```c++
// take input from v; place result in *res
void f(const vector<double>& v, double* res);

class F {
	public:
		F(const vector<double>& vv, double* p) :v{vv}, res{p} { }
		void operator()();        // place result in *res
	
	private:
		const vector<double>& v;  // source of input
		double* res;              // target for output
};

double g(const vector<double>&);  // use return value

void user(vector<double>& vec1, vector<double> vec2, vector<double> vec3)
{
	double res1;
	double res2;
	double res3;

	// f(vec1,&res1) executes in a separate thread
	thread t1 {f,cref(vec1),&res1}; 
	// F{vec2,&res2}() executes in a separate thread
	thread t2 {F{vec2,&res2}};
	// capture local variables by reference
	thread t3 { [&](){ res3 = g(vec3); } };

	t1.join();
	t2.join();
	t3.join();
	
	// join before using results
	cout << res1 << ' ' << res2 << ' ' << res3 << '\n';
}
```

Здесь `cref(vec1)` передает [[const|const]] ссылку на `vec1` в качестве аргумента для `t1`.

Это работает, и техника очень распространена, но я не считаю возврат результатов через ссылки особенно элегантным, поэтому я возвращаюсь к этой теме в #§18_5_1.

# Обмен данными

Иногда задачам требуется обмениваться данными. В этом случае доступ должен быть синхронизирован таким образом, чтобы одновременно имела доступ не более чем одна задача. Опытные программисты воспримут это как упрощение (например, нет проблем с одновременным чтением многими задачами неизменяемых данных), но подумайте, как обеспечить, чтобы не более чем одна задача одновременно имела доступ к заданному набору объектов.

## mutex и блокировки

[[mutex|mutex]], “объект взаимного исключения”, является ключевым элементом общего обмена данными между [[thread|thread]]. [[thread|thread]] получает [[mutex|mutex]] с помощью операции [[mutex#Захват мьютексов в различном порядке|lock()]]:
```c++
mutex m;                   // controlling mutex
int sh;                    // shared data

void f()
{
	scoped_lock lck {m};   // acquire mutex
	sh += 7;               // manipulate shared data
}
						   // release mutex implicitly
```

Тип `lck` выводится как [[lock#Тип std scoped_lock|scoped_lock<mutex>]]. Конструктор [[lock#Тип std scoped_lock|scoped_lock]] получает мьютекс (посредством вызова `m.lock()`). Если другой поток уже получил мьютекс, поток ожидает (“блокируется”) до тех пор, пока другой поток не завершит свой доступ. Как только поток завершает свой доступ к общим данным, [[lock#Тип std scoped_lock|scoped_lock]] освобождает [[mutex|mutex]] (вызовом `m.unlock()`). Когда [[mutex|mutex]] освобождается, [[thread|thread]], ожидающие его, возобновляют выполнение (“пробуждаются”). Средства взаимного исключения и блокировки находятся в `<mutex>`.

Обратите внимание на [[Основные операции#Управление ресурсами|использование RAII]]. Использование дескрипторов ресурсов, таких как [[lock#Тип std scoped_lock|scoped_lock]] и [[lock#Тип std unique_lock|unique_lock]], проще и намного безопаснее, чем явная блокировка и разблокировка [[mutex|mutex]].

Соответствие между общими данными и [[mutex|mutex]] зависит от соглашения: программист должен знать, какой [[mutex|mutex]] должен соответствовать каким данным. Очевидно, что это чревато ошибками, и столь же очевидно, что мы стараемся сделать соответствие понятным с помощью различных языковых средств. Например:
```c++
class Record {
	public:
		mutex rm;
	// ...
};
```

Не нужно быть гением, чтобы догадаться, что для `Record` с именем `rec` вы должны захватить `rec.rm`, прежде чем получить доступ к остальной части `rec`, хотя комментарий или более подходящее название могли бы помочь читателю.

Нередки случаи, когда для выполнения какого-либо действия требуется одновременный доступ к нескольким ресурсам. Это может привести к тупиковой ситуации. Например, если `thread1` получает `mutex1`, а затем пытается получить `mutex2`, в то время как `thread2` получает `mutex2`, а затем пытается получить `mutex1`, то ни одна из задач никогда не будет продолжена дальше. [[lock#Тип std scoped_lock|scoped_lock]] помогает, позволяя нам получать несколько блокировок одновременно:
```c++
void f()
{
	scoped_lock lck {mutex1,mutex2,mutex3}; // acquire all three locks
	// ... manipulate shared data ...
} // implicitly release all mutexes
```

Этот [[lock#Тип std scoped_lock|scoped_lock]] будет запущен только после получения всех его аргументов [[mutex|mutex]] и никогда не будет блокироваться (“переходить в спящий режим”) при удержании [[mutex|mutex]]. Деструктор для [[lock#Тип std scoped_lock|scoped_lock]] гарантирует, что [[mutex|mutex]] будут освобождены, когда [[thread|thread]] покинет область видимости.

Обмен информацией через совместно используемые данные – довольно низкоуровневое средство. В частности, программист должен разработать способы узнать, какая задача была выполнена, а какая нет в рамках различных задач. В этом отношении использование общих данных уступает понятию вызова и возврата. С другой стороны, некоторые люди убеждены, что совместное использование должно быть более эффективным, чем копирование аргументов и возвращаемых данных. Это действительно может быть так, когда речь идет о больших объемах данных, но блокировка и разблокировка являются относительно дорогостоящими операциями. Кроме того, современные машины очень хорошо копируют данные, особенно компактные, такие как элементы [[vector|vector]]. Поэтому не выбирайте общие данные для обмена информацией бездумно, из-за “эффективности” и, желательно, проводите измерения быстродействия.

Базовый [[mutex|mutex]] позволяет одному потоку одновременно получать доступ к данным. Один из наиболее распространенных способов обмена данными - это обмен между многими читающими и одним пишущим потоком. Эта идиома ”блокировка читающий-пишущий" поддерживается [[mutex#std shared_mutex|shared_mutex]]. Читающий поток получит мьютекс `“shared”`, чтобы другие читающие все еще могли получить доступ, в то время как пишущий поток будет требовать эксклюзивного доступа. Например:
```c++
shared_mutex mx;          // a mutex that can be shared

void reader()
{
	shared_lock lck {mx}; // willing to share access with other readers
						  // ... read ...
}

void writer()
{
	unique_lock lck {mx}; // needs exclusive (unique) access
						  // ... write ...
}
```

## atomic

[[mutex|mutex]] - это довольно тяжелый механизм, задействующий операционную систему. Он позволяет выполнять произвольные объемы работы без состояний гонки за данные. Однако существует гораздо более простой и дешевый механизм для выполнения лишь небольшого объема работы: [[atomic|atomic переменная]]. Например, вот простой вариант классической блокировки с двойной проверкой:
```c++
mutex mut;
atomic<bool> init_x;   // initially false.
X x;                   // variable that requires nontrivial initialization

if (!init_x) {
	lock_guard lck {mut};
	if (!init_x) {
		// ... do nontrivial initialization of x ...
		init_x = true;
	}
}

// ... use x ...
```

[[atomic|atomic]] избавляет нас от большинства вариантов использования гораздо более дорогого [[mutex|mutex]]. Если бы `init_x` не был [[atomic|atomic]], эта инициализация завершалась бы неудачей очень редко, вызывая загадочные и трудновыявляемые ошибки, потому что происходило бы соревнование за данные в `init_x`.

Здесь я использовал [[lock#Тип std lock_guard|lock_guard]], а не [[lock#Тип std scoped_lock|scoped_lock]], потому что мне нужен был только один [[mutex|mutex]], поэтому было достаточно простейшей блокировки ([[lock#Тип std lock_guard|lock_guard]]).

# Ожидание событий

Иногда [[thread|thread]] необходимо дождаться какого-либо внешнего события, например, завершения другим [[thread|thread]] задачи или истечения определенного промежутка времени. Самое простое “событие” - это просто течение времени. Используя средства для работы времени, найденные в `<chrono>`, я могу написать:
```c++
using namespace chrono;

auto t0 = high_resolution_clock::now();
this_thread::sleep_for(milliseconds{20});

auto t1 = high_resolution_clock::now();
cout << duration_cast<nanoseconds>(t1-t0).count() << " nanoseconds passed\n";
```

Мне даже не нужно было запускать [[thread|thread]]; по умолчанию `this_thread` может ссылаться на один-единственный поток.

Я использовал [[Chrono#std duration_cast|duration_cast]], чтобы настроить единицы измерения часов на нужные мне наносекунды.

Базовая поддержка обмена данными с использованием внешних событий обеспечивается [[condition_variable|condition_variable]], находящимся в `<condition_variable>`. `condition_variable` - это механизм, позволяющий одному [[thread|thread]] ожидать другой [[thread|thread]]. В частности, это позволяет [[thread|thread]] ожидать возникновения некоторого условия (часто называемого событием) в результате работы, выполняемой другими [[thread|thread]].

Использование [[condition_variable|condition_variable]] поддерживает множество форм элегантного и эффективного совместного использования, но может быть довольно сложным. Рассмотрим классический пример взаимодействия двух [[thread|thread]] путем передачи сообщений через [[queue|queue]]. Для простоты я объявляю [[queue|queue]] и механизм предотвращения условий соревнований в этой [[queue|queue]] глобальными для производителя и потребителя:
```c++
class Message {            // object to be communicated
	// ...
};

queue<Message> mqueue;     // the queue of messages
condition_variable mcond;  // the variable communicating events
mutex mmutex;              // for synchronizing access to mcond
```

Типы [[queue|queue]], [[condition_variable|condition_variable]] и [[mutex|mutex]] предоставляются стандартной библиотекой. `consumer()` читает и обрабатывает `Message`:
```c++
void consumer()
{
	while(true) {
		unique_lock lck {mmutex};   // acquire mmutex
		
		// release mmutex and wait; re-acquire mmutex upon wakeup
		// don't wake up unless mqueue is non-empty
		mcond.wait(lck,[] { return !mqueue.empty(); }); 
			
		auto m = mqueue.front();    // get the message
		mqueue.pop();
		lck.unlock();               // release mmutex
		// ... process m ...
	}
}
```

Здесь я явно защищаю операции с [[queue|queue]] и с [[condition_variable|condition_variable]] с помощью [[lock#Тип std unique_lock|unique_lock]] для [[mutex|mutex]]. Ожидание [[condition_variable|condition_variable]] освобождает его аргумент блокировки до тех пор, пока ожидание не закончится (чтобы очередь не была пустой), а затем повторно запрашивает его. Явная проверка условия, здесь `!mqueue.empty()`, защищает от пробуждения только для того, чтобы обнаружить, что какая-то другая задача “добралась туда первой”, так что условие больше не выполняется.

Я использовал [[lock#Тип std unique_lock|unique_lock]], а не [[lock#Тип std scoped_lock|scoped_lock]] по двум причинам:
>
> Нам нужно передать блокировку в `condition_variable wait()`. [[lock#Тип std scoped_lock|scoped_lock]]  нельзя переместить, а [[lock#Тип std unique_lock|unique_lock]] можно
> 
> Мы хотим разблокировать [[mutex|mutex]], защищающий переменную условия, перед обработкой сообщения. [[lock#Тип std unique_lock|unique_lock]] предлагает операции, такие как `lock()` и `unlock()`, для низкоуровневого управления синхронизацией.

С другой стороны, [[lock#Тип std unique_lock|unique_lock]] может обрабатывать только один [[mutex|mutex]].

Соответствующий `producer` выглядит следующим образом:
```c++
void producer()
{
	while(true) {
		Message m;
		// ... fill the message ...
		scoped_lock lck {mmutex};
		mqueue.push(m);
		mcond.notify_one();
	}
}
```

# Коммуникации задач

Стандартная библиотека предоставляет несколько возможностей, позволяющих программистам работать на концептуальном уровне задач (работа, которая потенциально может выполняться одновременно), а не непосредственно на более низком уровне потоков и блокировок:
>
> [[future|future]] и [[promise|promise]] для возврата значения из задачи, созданной в отдельном потоке
> 
> [[packaged_task|packaged_task]], помогающий запускать задачи и подключать механизмы для возврата результата
> 
> [[async|async()]] для запуска задачи способом, очень похожим на вызов функции

Эти объекты находятся в `<future>`.

## future и promise

Важным моментом в отношении [[Promise and Future|future и promise]] является то, что они позволяют передавать значение между двумя задачами без явного использования блокировки; “система” эффективно реализует передачу. Основная идея проста: когда задача хочет передать значение другой, она помещает это значение в [[promise|promise]]. Каким-то образом реализация заставляет это значение отображаться в соответствующей [[future|future]], из которой оно может быть прочитано (обычно с помощью средства запуска задачи). Мы можем представить это графически:
![[image/stl_18.png]]

Если у нас есть `future<X>` с именем `fx`, мы можем `get()` из него значение типа `X`:
```c++
X v = fx.get();    // if necessary, wait for the value to get computed
```

Если значения еще нет, наш поток блокируется до тех пор, пока оно не поступит. Если значение не может быть вычислено, функция `get()` может бросить исключение (из системы или переданное из [[promise|promise]]).

Основное назначение [[promise|promise]] - обеспечить простые операции “назначения” (называемые `set_value()` и `set_exception()`) соответствующие `future get()`. Названия “будущее(future)” и “обещание(promise)” являются историческими; пожалуйста, не вините меня и не приписывайте мне заслуг. Они являются еще одним благодатным источником каламбуров.

Если у вас есть [[promise|promise]] и вам нужно отправить результат типа `X` в [[future|future]], вы можете сделать одну из двух вещей: передать значение или передать исключение. Например:
```c++
void f(promise<X>& px)        // a task: place the result in px
{
	// ...
	
	try {
		X res;
		// ... compute a value for res ...
		px.set_value(res);
	}
	catch (...) { // oops: couldn't compute res
		px.set_exception(current_exception());
		// pass the exception to the
		// future's thread
	}
}
```

`current_exception()` ссылается на перехваченное исключение.

Чтобы справиться с исключением, переданным через [[future|future]], вызывающий `get()` должен быть готов перехватить его где-нибудь. Например:
```c++
void g(future<X>& fx)        // a task: get the result from fx
{
	// ...
	try {
		// if necessary, wait for the value to get computed
		X v = fx.get(); 

		// ... use v ...
	}
	catch (...) {  	         // oops: someone couldn't compute v
		// ... handle error ...
	}
}
```

Если ошибка не должна обрабатываться самой `g()`, код сводится к минимальному:
```c++
void g(future<X>& fx)         // a task: get the result from fx
{
	// ...
	X v = fx.get();    // if necessary, wait for the value to be computed
	// ... use v ...
}
```

Теперь исключение, генерируемое функцией `fx` (`f()`), неявно передается вызывающему `g()`, точно так же, как это было бы, если бы `g()` вызывал `f()` напрямую.

## packaged_task

Как нам включить [[future|future]] в задачу, которой нужен результат, и соответствующий [[promise|promise]] в поток, который должен выдать этот результат? Тип [[packaged_task|packaged_task]] предусмотрен для упрощения настройки задач, связанных с [[Promise and Future|future и promise]] для запуска в [[thread|thread]]. [[packaged_task|packaged_task]] предоставляет код-обертку для помещения возвращаемого значения или исключения из задачи в [[promise|promise]] ([[Параллелизм-stl#future и promise|подобно коду]]). Если вы запросите его, вызвав `get_future`, [[packaged_task|packaged_task]] выдаст вам [[future|future]], соответствующее его [[promise|promise]]. Например, мы можем настроить две задачи, чтобы каждая добавляла половину элементов `vector<double>`, используя [[accumulate|accumulate()]] стандартной библиотеки:
```c++
double accum(vector<double>::iterator beg, vector<double>::iterator end, 
				double init)
	// compute the sum of [beg:end) starting with the initial value init
{
	return accumulate(&*beg, &*end, init);
}

double comp2(vector<double>& v)
{
	packaged_task pt0 {accum};        // package the task (i.e., accum)
	packaged_task pt1 {accum};
	future<double> f0 {pt0.get_future()}; // get hold of pt0's future
	future<double> f1 {pt1.get_future()}; // get hold of pt1's future

	double* first = &v[0];
	// start a thread for pt0
	thread t1 {move(pt0), first, first+v.size()/2, 0};
	// start a thread for pt1
	thread t2 {move(pt1), first+v.size()/2, first+v.size(), 0}; 

	// ...
	return f0.get()+f1.get();    // get the results
}
```

Шаблон [[packaged_task|packaged_task]] принимает тип задачи в качестве аргумента шаблона (здесь `double` (`double*`, `double*`, `double`)) и задачу в качестве аргумента конструктора (здесь `accum`). Операции [[move|move()]] необходимы, поскольку [[packaged_task|packaged_task]] не может быть скопирован. Причина, по которой [[packaged_task|packaged_task]] не может быть скопирован, заключается в том, что это дескриптор ресурса: он владеет своим [[promise|promise]] и (косвенно) несет ответственность за любые ресурсы, которыми может владеть его задача.

Пожалуйста, обратите внимание на отсутствие явного упоминания о блокировках в этом коде: мы можем сосредоточиться на задачах, которые необходимо выполнить, а не на механизмах, используемых для управления их передачей. Эти две задачи будут выполняться в отдельных потоках и, таким образом, потенциально параллельно.

## async()

Подход, которого я придерживался в этой главе, который я считаю самым простым, но в то же время одним из самых действенных: рассматривайте задачу как функцию, которая может выполняться одновременно с другими задачами. Это далеко не единственная модель, поддерживаемая стандартной библиотекой C++, но она хорошо подходит для широкого спектра нужд. При необходимости можно использовать более тонкие и хитроумные модели (например, стили программирования, основанные на совместно используемой памяти).

Чтобы запустить задачи, которые потенциально могут выполняться асинхронно, мы можем использовать [[async|async()]]:
```c++
	// spawn many tasks if v is large enough
double comp4(vector<double>& v)
{
	if (v.size()<10'000)      // is it worth using concurrency?
		return accum(v.begin(), v.end(), 0.0);
		
	auto v0 = &v[0];
	auto sz = v.size();
	
	auto f0 = async(accum, v0, v0+sz/4, 0.0);         // first quarter
	auto f1 = async(accum, v0+sz/4, v0+sz/2, 0.0);    // second quarter
	auto f2 = async(accum, v0+sz/2, v0+sz*3/4, 0.0);  // third quarter
	auto f3 = async(accum, v0+sz*3/4, v0+sz, 0.0);    // fourth quarter

		// collect and combine the results
	return f0.get()+f1.get()+f2.get()+f3.get(); 
}
```

По сути, [[async|async()]] отделяет “вызываемую часть” функции от “части получения результата” и отделяет и то, и другое от фактического выполнения задачи. Используя [[async|async()]], вам не нужно думать о потоках и блокировках. Вместо этого вы мыслите в терминах задач, которые потенциально вычисляют свои результаты асинхронно. Существует очевидное ограничение: даже не думайте использовать [[async|async()]] для задач, которые совместно используют ресурсы, нуждающиеся в блокировке. С помощью [[async|async()]] вы даже не знаете, сколько [[thread|thread]] будет использоваться, потому что это зависит от [[async|async()]], чтобы решить, основываясь на том, что он знает о системных ресурсах, доступных во время вызова. Например, [[async|async()]] может проверить, доступны ли какие-либо незанятые ядра (процессоры), прежде чем принимать решение о том, сколько [[thread|thread]] использовать.

Использование предположения о стоимости вычислений относительно стоимости запуска [[thread|thread]], такого как `v.size()<10 000`, очень примитивно и подвержено грубым ошибкам в отношении производительности. Однако здесь не подхлдящее место для обсуждения того, как управлять [[thread|thread]]. Не воспринимайте эту оценку как нечто большее, чем простое и, вероятно, неверное предположение.

Редко возникает необходимость вручную распараллеливать алгоритм стандартной библиотеки, такой как [[accumulate|accumulate()]], поскольку [[Числовые вычисления#Многопоточные численные алгоритмы|параллельные алгоритмы]] (например, [[reduce|reduce(par_unseq,/*...*/)]]) обычно справляются с этим лучше. Однако эта методика носит общий характер.

Пожалуйста, обратите внимание, что [[async|async()]] - это не просто механизм, специализирующийся на параллельных вычислениях для повышения производительности. Например, он также может быть использован для запуска задачи по получению информации от пользователя, оставляя “основную программу” активной с чем-то другим.

## Остановка thread

Иногда мы хотим остановить [[thread|thread]], потому что нас больше не интересует его результат. Просто “убить” его обычно неприемлемо, поскольку [[thread|thread]] может владеть ресурсами, которые должны быть освобождены (например, блокировками, подпотоками и подключениями к базе данных). Вместо этого стандартная библиотека предоставляет механизм для вежливого запроса [[thread|thread]] на очистку и уход: `stop_token`. [[thread|thread]] может быть запрограммирован на завершение, если у него есть `stop_token` и запрошена остановка.

Рассмотрим параллельный алгоритм [[find_any|find_any()]], который порождает множество [[thread|thread]], ищущих результат. Когда [[thread|thread]] возвращается с ответом, мы хотели бы остановить остальные [[thread|thread]]. Каждый [[thread|thread]], порожденный функцией [[find_any|find_any()]], вызывает функцию [[find|find()]] для выполнения реальной работы. Эта функция [[find|find()]] является очень простым примером общего стиля задачи, где есть основной цикл, в который мы можем вставить тест на то, следует ли продолжать или останавиться:
```c++
atomic<int> result = -1; // put a resulting index here

// a way of passing a range of Ts
template<class T> struct Range { T* first; T* last; };
void find(stop_token tok, const string* base, const Range<string> r, 
			const string target)
{
	for (string* p = r.first; p!=r.last && !tok.stop_requested(); ++p)
		// match() applies some matching criteria to the two strings
		if (match(*p, target)) {
			result = p - base;     // the index of the found element
			return;
		}
}
```

Здесь `!tok.stop_requested()` проверяет, запросил ли какой-либо другой [[thread|thread]] завершение этого [[thread|thread]]. `stop_token` - это механизм для безопасной (без состояний гонки за данные) передачи такого запроса.

Вот тривиальная функция [[find_any|find_any()]], которая порождает всего два [[thread|thread]], выполняющих функцию [[find|find()]]:
```c++
void find_all(vector<string>& vs, const string& key)
{
	int mid = vs.size()/2;
	string* pvs = &vs[0];
	
	stop_source ss1{};
	// first half of vs
	jthread t1(find, ss1.get_token(), pvs, Range{pvs,pvs+mid}, key);

	stop_source ss2{};
	// second half of vs
	jthread t2(find, ss2.get_token(), pvs, Range{pvs+mid,pvs+vs.size()}, 
				key);

	while (result == -1)
		this_thread::sleep_for(10ms);

	ss1.request_stop(); // we have a result: stop all threads
	ss2.request_stop();

	// ... use result ...
}
```

`stop_source` создает `stop_token`, через которые запросы на остановку передаются [[thread|thread]].

Синхронизация и возврат результата - это самое простое, что я мог придумать: поместите результат в [[atomic|atomic]] переменную и выполняйте проверку в бесконечном цикле.

Конечно, мы могли бы доработать этот простой пример, чтобы использовать множество потоков поиска, сделать возврат результатов более общим и использовать различные типы элементов. Однако это скрыло бы основную роль `stop_source` и `stop_token`.

# Корутины (сопрограммы)










