
[[#Библиотека для работы со временем|Библиотека для работы со временем]] 14
1. [[#Взаимосвязь моментов, промежутков времени и часов|Взаимосвязь моментов, промежутков времени и часов]] 14.1
2. [[#std chrono time_point (Моменты времени)|std::chrono::time_point (Моменты времени)]] 14.2
	1. [[#Перевод моментов времени в календарный формат|Перевод моментов времени в календарный формат]] 14.2.1
	2. [[#Выход за пределы допустимого диапазона часов|Выход за пределы допустимого диапазона часов]] 14.2.2
3. [[#Промежутки времени|Промежутки времени]] 14.3
	1. [[#Вычисления с промежутками времени|Вычисления с промежутками времени]] 14.3.1
4. [[#Типы часов|Типы часов]] 14.4
	1. [[#Точность и монотонность часов|Точность и монотонность часов]] 14.4.1
	2. [[#Нахождение точки отсчёта часов|Нахождение точки отсчёта часов]] 14.4.2
5. [[#Приостановка и ограниченное ожидание|Приостановка и ограниченное ожидание]] 14.5
	1. [[#Соглашения об именовании|Соглашения об именовании]] 14.5.1
	2. [[#Стратегии ожидания|Стратегии ожидания]] 14.5.2

[[#std chro­no system_clock|std::chro­no::system_clock]]
[[#std chrono steady_clock|std::chrono::steady_clock]]
[[#std chrono high_resolution_clock|std::chrono::high_resolution_clock]]
[[#std chrono duration|std::chrono::duration]]
[[#std literals chrono_literals|std::literals::chrono_literals]]


# Библиотека для работы со временем

## Взаимосвязь моментов, промежутков времени и часов

**Момент времени** определяется точкой отсчёта – так называемым началом эпохи – и промежутком времени, отсчитываемым от начала эпохи.

**Промежуток времени** – это промежуток между двумя моментами времени. Он измеряется количеством определённых единиц.

**Часы** характеризуются начальной точкой и единицей измерения. Они позволяют определить текущий момент времени как промежуток от начальной точки, измеренный в данных единицах.

Моменты времени можно между собой сравнивать. Также можно к моменту времени прибавить промежуток и получить другой момент времени. Единица измерения определяет точность, с которой часы могут измерять промежутки времени. Например, в нашей традиции за начало эпохи берут год предполагаемого рождения Христа; для многих практических задач подходящей единицей измерения является год.

Эти три понятия можно проиллюстрировать на примере биографии Денниса Ритчи. Создатель языка C родился в 1941 году и ушёл из жизни в 2011 го­ду. Для простоты будем считать время лишь с точностью до года.

![[ParallelProg_256.png]]

За начало нашей эры берётся Рождество Христово. Тогда точки, отмеченные числами 1941 и 2011, определяются началом отсчёта и принятой в данном контексте единицей измерения. Конечно же, начало эпохи тоже представляет собой момент времени. Если вычесть момент времени 1941 из момента 2011, получим промежуток времени. В нашем примере продолжительность измеряется с точностью до года. Как видно из этого вычисления, Деннис Ритчи прожил 70 лет.

Перейдём к более подробному рассмотрению компонентов этой библиотеки.

## std::chrono::time_point (Моменты времени)

Моменты времени моделируются объектами типа std::chrono::time_point. Это шаблон с двумя параметрами. Первый параметр задаёт тип часов. Второй параметр – тип промежутка времени – необязательный: по умолчанию тип промежутка берётся из типа часов.

**Шаблон класса std::chrono::time_point:**
```c++
template<class Clock, class Duration= typename Clock::duration>
class time_point;
```

С часами связаны четыре особых момента времени:
* **epoch** – точка отсчёта часов;
* **now** – текущий момент времени;
* **min** – наименьший (наиболее давний) момент времени, который может быть измерен этими часами;
* **max** – наибольший момент времени, который может быть измерен этими часами.

Точность, наименьший и наибольший моменты времени могут быть различны у разных часов. В стандартной библиотеке имеются часы [[#std chro­no system_clock|std::chro­no::system_clock]], [[#std chrono steady_clock|std::chrono::steady_clock]] и [[#std chrono high_resolution_clock|std::chrono::high_resolution_clock]]. Стандарт языка C++ не даёт гарантий относительно точности, точки отсчёта и диапазона часов. За начало отсчёта часов [[#std chro­no system_clock|std::chrono::system_clock]] обычно берётся 1 января 1970 года – начало эпохи UNIX. Как явствует из названия, часы [[#std chrono high_resolution_clock|std::chrono::high_resolution_clock]] имеют наибольшую точность.

### Перевод моментов времени в календарный формат

У часов [[#std chro­no system_clock|std::chrono::system_clock]] есть функция `to_time_t`, которая позволяет преобразовывать моменты времени, отмеренные с помощью этих часов, в значения типа [[time_t|std::time_t]]. Это значение, в свою очередь, можно преобразовать функцией `std::gmtime` в календарное время, выраженное в стандарте UTC (всемирное координированное время). Наконец, это календарное время можно передать функции [[asctime|std::asctime]], чтобы получить текстовое представление даты и времени.

**Отображение даты и времени в текстовом виде:**
```c++
// timepoint.cpp

#include <chrono>
#include <ctime>
#include <iostream>
#include <string>

int main() {
	std::cout << std::endl;

	std::chrono::time_point<std::chrono::system_clock> sysTimePoint;
	std::time_t tp= std::chrono::system_clock::to_time_t(sysTimePoint);
	std::string sTp= std::asctime(std::gmtime(&tp));
	std::cout << “Epoch: “ << sTp << std::endl;

	tp= std::chrono::system_clock::to_time_t(sysTimePoint.min());
	sTp= std::asctime(std::gmtime(&tp));
	std::cout << “Time min: “ << sTp << std::endl;

	tp= std::chrono::system_clock::to_time_t(sysTimePoint.max());
	sTp= std::asctime(std::gmtime(&tp));
	std::cout << “Time max: “ << sTp << std::endl;

	sysTimePoint= std::chrono::system_clock::now();
	tp= std::chrono::system_clock::to_time_t(sysTimePoint);
	sTp= std::asctime(std::gmtime(&tp));
	std::cout << “Time now: “ << sTp << std::endl;
}
```

Эта программа выводит на печать допустимый диапазон часов [[#std chro­no system_clock|std::chrono::system_clock]]. На компьютере автора под управлением ОС Linux эти часы имеют своей точкой отсчёта начало эры UNIX и могут представлять даты в интервале от 1677 до 2262 года.

![[time_1.png]]

К моментам времени можно прибавлять промежутки времени. Прибавление промежутка, выводящее момент времени за пределы допустимого диапазона часов, представляет собой неопределённое поведение.

### Выход за пределы допустимого диапазона часов

Следующая программа берёт текущий момент времени и прибавляет или отнимает от него 1000 лет. Для простоты не будем обращать внимания на високосные годы и положим, что каждый год содержит ровно 365 дней.

**Выход за пределы допустимого диапазона часов:**
```c++
// timepointAddition.cpp

#include <chrono>
#include <ctime>
#include <iostream>
#include <string>

using namespace std::chrono;
using namespace std;

string timePointAsString(const time_point<system_clock>& timePoint){
	time_t tp= system_clock::to_time_t(timePoint);
	return asctime(gmtime(&tp));
}

int main(){
	cout << endl;

	time_point<system_clock> nowTimePoint= system_clock::now();
	cout<< “Now:“<< timePointAsString(nowTimePoint)<< endl;

	const auto thousandYears= hours(24*365*1000);
	time_point<system_clock> historyTimePoint =
			nowTimePoint – thousandYears;
	cout<< “Now – 1000 years: “
			<< timePointAsString(historyTimePoint)<< endl;

	time_point<system_clock> futureTimePoint =
			nowTimePoint + thousandYears;
	cout<< “Now + 1000 years: “
			<< timePointAsString(futureTimePoint)<< endl;
}
```

Для удобства чтения пространство имён `std::chrono` предполагается по умолчанию. Запуск программы демонстрирует, что переполнение счётчика ведёт к неверным результатам. Вычитание тысячи лет из текущего момента времени даёт момент времени в будущем, а прибавление тысячи лет – напротив, переносит в прошлое.

![[time_2.png]]

Два разных момента времени, измеренных по одним часам, различаются промежутком, отделяющим момент времени от начала отсчёта. Промежутки поддерживают основные арифметические операции и могут быть представлены в различных единицах измерения.

## Промежутки времени

Для моделирования промежутков времени предназначен шаблон класса [[#std chrono duration|std::chrono::duration]], принимающий два параметра: арифметический тип `Rep` для количества единиц времени и тип `Period`, который определяет единицу времени относительно секунды.

**Шаблон класса std::chrono::duration:**
```c++
template<class Rep,class Period = std::ratio<1>> 
class duration;
```

По умолчанию за единицу измерения берётся тип `std::ratio<1>`, что соответствует одной секунде и может также быть записано в виде `std::ratio<1, 1>`. Остальное довольно просто: тип `std::ratio<60>` соответствует минуте, а тип `std::ratio<1, 1000>` – миллисекунде. Если в качестве типа `Rep` взят тип с плавающей запятой, возможно измерять время также дробным числом единиц.

В стандарте языка C++ предопределены следующие наиболее важные типы промежутков времени:
```c++
typedef duration<signed int, nano> nanoseconds;
typedef duration<signed int, micro> microseconds;
typedef duration<signed int, millT> milliseconds;
typedef duration<signed int> seconds;
typedef duration<signed int, ratio< 60>> minutes;
typedef duration<signed int, ratio<3600>> hours;
```

Попытаемся определить, сколько времени прошло с начала эры UNIX (т. е. с 1 января 1970 года). Благодаря псевдонимам для различных типов промежутков времени ответить на этот вопрос довольно просто. Для простоты не будем принимать во внимание високосные годы и примем длительность года за 365 дней.

**Измерение промежутка времени в разных единицах:**
```c++
// timeSinceEpoch.cpp

#include <chrono>
#include <iostream>

using namespace std;

int main() {
	cout << fixed << endl;

	cout << “Time since 1.1.1970:\n” << endl;

	const auto timeNow= chrono::system_clock::now();
	const auto duration= timeNow.time_since_epoch();
	
	cout << duration.count() << “ nanoseconds “ << endl;

	typedef chrono::duration<long double, ratio<1, 1000000>>
			MyMicroSecondTick;
	MyMicroSecondTick micro(duration);
	cout << micro.count() << “ microseconds” << endl;


	typedef chrono::duration<long double, ratio<1, 1000>>
			MyMilliSecondTick;
	MyMilliSecondTick milli(duration);
	cout << milli.count() << “ milliseconds” << endl;

	typedef chrono::duration<long double> MySecondTick;
	MySecondTick sec(duration);
	cout << sec.count() << “ seconds “ << endl;

	typedef chrono::duration<double, ratio<60>> MyMinuteTick;
	MyMinuteTick myMinute(duration);
	cout << myMinute.count() << “ minutes” << endl;

	typedef chrono::duration<double, ratio<60*60>> MyHourTick;
	MyHourTick myHour(duration);
	cout << myHour.count() << “ hours” << endl;

	typedef chrono::duration<double, ratio<60*60*24*365>> MyYearTick;
	MyYearTick myYear(duration);
	cout << myYear.count() << “ years” << endl;

	typedef chrono::duration<double, ratio<60*45>> MyLessonTick;
	MyLessonTick myLesson(duration);
	cout << myLesson.count() << “ lessons” << endl;

	cout << endl;
}
```

В этой программе объявляются собственные типы, соответствующие единицам измерения времени: микросекунде, миллисекунде, секунде, минуте, часу и году. Кроме того, объявляется ещё одна единица времени – академический час (45 минут). Результат работы программы показан на рисунке.

![[time_3.png]]

Проводить вычисления с промежутками времени довольно удобно, этому будет посвящён следующий раздел.

### Вычисления с промежутками времени

Типы промежутков времени поддерживают основные арифметические операции. В частности, промежуток времени можно умножать или делить на число. Конечно, промежутки можно сравнивать между собой. Следует подчеркнуть, что все эти операции проводятся с учётом единиц измерения.

Начиная со стандарта C++ 14 работа с промежутками времени становится ещё удобнее. В этой версии стандарта появились литералы для единиц измерения времени.

**Предопределённые литералы для единиц времени:**

| **Тип**                     | **Суффикс** | **Пример** |
| --------------------------- | ----------- | ---------- |
| `std::chrono::hours`        | h           | 5h         |
| `std::chrono::minutes`      | min         | 5min       |
| `std::chrono::seconds`      | s           | 5s         |
| `std::chrono::milliseconds` | ms          | 5ms        |
| `std::chrono::microseconds` | us          | 5us        |
| `std::chrono::nanoseconds`  | ns          | 5ns        |

Автор заинтересовался, сколько времени его семнадцатилетний сын Мариус посвящает учёбе школе каждый день. Следующая программа вычисляет ответ и выводит его в различных единицах.

**Продолжительность школьного дня в разных единицах:**
```c++
// schoolDay.cpp

#include <iostream>
#include <chrono>

using namespace std::literals::chrono_literals;
using namespace std::chrono;
using namespace std;

int main(){
	cout << endl;

	constexpr auto schoolHour= 45min;
	constexpr auto shortBreak= 300s;
	constexpr auto longBreak= 0.25h;
	constexpr auto schoolWay= 15min;
	constexpr auto homework= 2h;

	constexpr auto schoolDaySec =
		2 * schoolWay +
		6 * schoolHour +
		4 * shortBreak +
		longBreak + homework;

	cout << “School day in seconds: “ << schoolDaySec.count() << endl;

	constexpr duration<double, ratio<3600>> schoolDayHour = schoolDaySec;
	constexpr duration<double, ratio<60>> schoolDayMin = schoolDaySec;
	constexpr duration<double, ratio<1,1000>> schoolDayMilli= 
			schoolDaySec;

	cout << “School day in hours: “ << schoolDayHour.count() << endl;
	cout << “School day in minutes: “ << schoolDayMin.count() << endl;
	cout << “School day in milliseconds: “ << schoolDayMilli.count() 
			<< endl;

	cout << endl;
}
```

Здесь объявлены единицы времени, соответствующие академическому часу, короткой перемене, длинной перемене, продолжительности дороги в школу или из школы, а также продолжительности подготовки домашних заданий. Результат вычислений доступен даже на этапе компиляции. Результат запуска программы показан на рисунке.

![[time_4.png]]

> **Вычисления на этапе компиляции**
>
> Промежутки времени, заданные литералами, результат вычислений в секундах `schoolDaySec`, а также этот промежуток, выраженные в других единицах, являются константами этапа компиляции, о чём свидетельствует ключевое слово [[constexpr|constexpr]]. Таким образом, все вычисления выполняются при сборке программы, и лишь вывод результата происходит на этапе выполнения.

Точность, с которой можно измерить промежутки времени, зависит от используемых для этого часов. В стандартной библиотеке языка C++ определены три типа часов, о них пойдёт речь в следующем разделе.

## Типы часов

Наличие в стандарте трёх типов часов не может не вызвать вопрос, чем они между собой отличаются.

Тип [[#std chro­no system_clock|std::chrono::system_clock]] соответствует общесистемным часам реального времени или, как их ещё называют, настенным часам системы. Только этот тип обладает статическими функциями `to_time_t` и `from_time_t`, позволяющими преобразовывать измеренные этими часами моменты времени в календарное время и обратно.

Тип [[#std chrono steady_clock|std::chrono::steady_clock]] – единственный тип часов, гарантирующий монотонность показаний. В отличие от общесистемных часов, которые пользователь может перевести назад, эти часы переводить нельзя. Следовательно, именно эти часы лучше всего использовать для измерения промежутков времени между событиями.

Тип [[#std chrono high_resolution_clock|std::chrono::high_resolution_clock]] – это часы с наибольшей доступной точностью, однако это может быть псевдоним для одного из двух предыдущих типов.

> **Отсутствие гарантий у стандартных часов**
>
> Стандарт языка C++ не предоставляет никаких гарантий относительно точности, точки отсчёта или допустимого диапазона этих типов часов. Чаще всего в типе [[#std chro­no system_clock|std::chrono::system_clock]] используется начало эры UNIX (1 января 1970 года), а в типе [[#std chrono steady_clock|std::chro­no::steady_clock]] за точку отсчёта берётся время запуска операционной системы на машине пользователя.

### Точность и монотонность часов

Весьма интересно узнать, какие из часов монотонны и какую точность измерений они обеспечивают. Монотонность означает, что часы не могут быть переведены, т. е. что их показания не могут уменьшаться. Ответы на эти вопросы можно получить у самих часов.

**Точность и монотонность трёх типов часов:**
```c++
// clockProperties.cpp

#include <chrono>
#include <iomanip>
#include <iostream>

using namespace std::chrono;
using namespace std;

template <typename T>
void printRatio() {
	cout << “ precision: “<< T::num<< “/”
			<< T::den<< “ second “<< endl;

	typedef typename ratio_multiply<T,kilo>::type MillSec;
	typedef typename ratio_multiply<T,mega>::type MicroSec;

	cout << fixed;
	cout << “     “
			<< static_cast<double>(MillSec::num)/MillSec::den
			<< “ milliseconds “ << endl;
	cout << “     “
			<< static_cast<double>(MicroSec::num)/MicroSec::den
			<< “ microseconds “ << endl;
}

int main(){
	cout << boolalpha << endl;
	cout << “std::chrono::system_clock: “ << endl;
	cout << “ is steady: “ << system_clock::is_steady << endl;

	printRatio<chrono::system_clock::period>();

	cout << endl;

	cout << “std::chrono::steady_clock: “ << endl;
	cout << “ is steady: “ << chrono::steady_clock::is_steady << endl;
	
	printRatio<chrono::steady_clock::period>();

	cout << endl;

	cout << “std::chrono::high_resolution_clock: “ << endl;
	cout << “ is steady: “ << chrono::high_resolution_clock::is_steady
				<< endl;

	printRatio<chrono::high_resolution_clock::period>();

	cout << endl;
}
```

Для каждого типа часов эта программа сначала печатает, являются ли они монотонными. Функция `printRatio` немного труднее для понимания. В первую очередь она печатает точность часов в секундах в виде простой дроби. Затем с помощью шаблона функции `std::ratio_multiply` и констант `std::kilo` и `std::mega` эта величина приводится к миллисекундам и микросекундам и выводится в виде десятичной дроби. Подробности о вычислениях с рациональными числами можно найти на сайте-справочнике cppreference.com.

Программа ведёт себя различным образом в системах Linux и Windows. Часы [[#std chro­no system_clock|std::chrono::system_clock]] намного точнее в системе Linux, а в системе Windows часы [[#std chrono high_resolution_clock|std::chrono::high_resultion_clock]] оказываются монотонными.

![[time_5.png]]

![[time_6.png]]

Стандарт языка C++ ничего не говорит о том, какой момент времени должен быть взят за точку отсчёта в тех или иных часах. Это значение можно вычислить в программе.

### Нахождение точки отсчёта часов

Благодаря вспомогательной функции `time_since_epoch` у часов каждого типа можно узнать, сколько времени прошло с начала их эпохи.

**Вычисление точки отсчёта каждого типа часов:**
```c++
// now.cpp

#include <chrono>
#include <iomanip>
#include <iostream>

using namespace std::chrono;

template <typename T>
void durationSinceEpoch(const T dur) {
	std::cout << “Counts since epoch: “<< dur.count()<< std::endl;

	typedef duration<double, std::ratio<60>> MyMinuteTick;
	const MyMinuteTick myMinute(dur);
	std::cout << std::fixed;
	std::cout << “Minutes since epoch: “<< myMinute.count()<< std::endl;

	typedef duration<double, std::ratio<60*60*24*365>> MyYearTick;
	const MyYearTick myYear(dur);
	std::cout<< “Years since epoch: “<< myYear.count()<< std::endl;
}

int main() {
	std::cout << std::endl;

	system_clock::time_point timeNowSysClock = system_clock::now();
	system_clock::duration timeDurSysClock =
				timeNowSysClock.time_since_epoch();

	std::cout << “system_clock: “ << std::endl;
	durationSinceEpoch(timeDurSysClock);
	std::cout << std::endl;

	const auto timeNowStClock = steady_clock::now();
	const auto timeDurStClock= timeNowStClock.time_since_epoch();

	std::cout << “steady_clock: “ << std::endl;
	durationSinceEpoch(timeDurStClock);
	std::cout << std::endl;

	const auto timeNowHiRes = high_resolution_clock::now();
	const auto timeDurHiResClock= timeNowHiRes.time_since_epoch();
	
	std::cout << “high_resolution_clock: “ << std::endl;
	durationSinceEpoch(timeDurHiResClock);
	std::cout << std::endl;
}
```

Переменные `timeDurSysClock`, `timeDurStClock` и `timeDurHiResClock` содержат промежутки времени, прошедшие после начала эпохи соответствующих часов. Если бы не ключевое слово `auto` и автоматический вывод типов, типы моментов времени и промежутков пришлось бы записывать в явном виде, что слишком многословно. Функция `durationSinceEpoch` отображает промежуток времени в различных единицах: сначала в собственных единицах самих часов, затем в минутах и, наконец, в годах. При этом для простоты продолжительность года взята за 365 дней, високосные годы не учитываются. Выводимые программой данные различаются в системах Linux и Windows.

![[time_7.png]]

![[time_8.png]]

Чтобы правильно проинтерпретировать полученные данные, нужно отметить, что компьютер под управлением ОС Linux к моменту запуска программы был включен около 5 часов (305 минут), а компьютер с ОС Windows работал около 6 часов (391 минуту).

По этим рисункам видно, что на машине с ОС Linux часы [[#std chro­no system_clock|std::chrono::system_clock]] и [[#std chrono high_resolution_clock|std::chrono::high_resolution_clock]] ведут отсчёт от начала эры UNIX, а часы [[#std chrono steady_clock|std::chrono::steady_clock]] – от включения компьютера. Если в ОС Linux часы [[#std chrono high_resolution_clock|std::high_resolution_clock]], по-видимому, представляют собой псевдоним для часов [[#std chro­no system_clock|std::system_clock]], то под ОС Windows это похоже на псевдоним для часов [[#std chrono steady_clock|std::chrono::steady_clock]]. Этот вывод хорошо согласуется с результатами, полученными в предыдущем разделе при определении точности и монотонности часов.

Библиотечные средства для работы со временем удобно использовать для погружения потока в сон. В качестве аргумента соответствующим функциям передаются моменты времени и промежутки времени.

## Приостановка и ограниченное ожидание

Многочисленные функции для ожидания блокировщиков, переменных условия, фьючерсов имеют одну общую особенность: все они так или иначе работают со временем.

### Соглашения об именовании

Имена функций, погружающих поток в ограниченное по времени ожидание, в основном образованы по единому шаблону. Функции, имена которых заканчиваются на `«_for»`, принимают в качестве параметра промежуток времени; функции же с именами, заканчивающимися на `«_until»`, принимают момент времени. Имена некоторых функций, впрочем, не имеют таких суффиксов. Пусть `in2min` – это момент времени в будущем, отстоящий на две минуты от настоящего (несмотря на использование ключевого слова `auto`, эта запись всё равно выглядит излишне многословной):
```c++
using _ = std::chrono;
auto in2min = _::steady_clock::now() + _::minutes(2);
```

Ниже приведён перечень таких функций-членов из разных классов, относящихся к управлению потоками, примитивами блокировки и заданиями.

| **Сущность**                 | **Функция _until**          | **Функция _for**    |
| ---------------------------- | --------------------------- | ------------------- |
| `std::thread th`             | `th.sleep_until(in2min)`    | `th.sleep_for(2s)`  |
| `std::unique_lock lk`        | `lk.try_lock_until(in2min)` | `lk.try_lock(2s)`   |
| `std::condition_variable cv` | `cv.wait_until(in2min)`     | `cv.wait_for(2s)`   |
| `std::future fu`             | `fu.wait_until(in2min)`     | `fu.wait_for(2s)`   |
| `std::shared_future shFu`    | `shFu.wait_until(in2min)`   | `shFu.wait_for(2s)` |

Здесь очень пригодились появившиеся в стандарте C++14 литералы для единиц времени: запись `2s` в этом примере означает 2 секунды.

Рассмотрим теперь различные стратегии ожидания.

### Стратегии ожидания

Основная идея следующей программы состоит в том, что один и тот же объект-обещание поставляет результат четырём фьючерсам. Это возможно, если фьючерсы имеют тип [[future#std shared_future|std::shared_future]]. Каждый из четырёх фьючерсов использует свою стратегию ожидания. Как обещание, так и все фьючерсы выполняются в отдельных потоках. Для простоты будем далее говорить об ожидающих потоках, хотя на самом деле ожидает оповещения именно фьючерс. [[asyncVersus#Асинхронные задания|Подробные сведения об обещаниях и фьючерсах]]. Ожидающие потоки используют следующие четыре стратегии:
* ждать обещания не более 4 секунд;
* ждать обещания до 20 секунд;
* запросить результат обещания и, если он не готов, заснуть на 700 миллисекунд, затем повторить;
* запросить результат обещания и, если он не готов, заснуть сперва на одну миллисекунду, при каждой следующей попытке удваивая время ожидания.

**Различные стратегии ожидания:**
```c++
// sleepAndWait.cpp

#include <utility>
#include <iostream>
#include <future>
#include <thread>
#include <utility>

using namespace std;
using namespace std::chrono;

mutex coutMutex;
long double getDifference(const steady_clock::time_point& tp1,
		const steady_clock::time_point& tp2)
{
	const auto diff= tp2 – tp1;
	const auto res= duration <long double, milli> (diff).count();
	return res;
}

void producer(promise<int>&& prom) {
	cout << “PRODUCING THE VALUE 2011\n\n”;
	this_thread::sleep_for(seconds(5));
	prom.set_value(2011);
}

void consumer(shared_future<int> fut, steady_clock::duration dur)
{
	const auto start = steady_clock::now();
	future_status status = fut.wait_until(steady_clock::now() + dur);

	if ( status == future_status::ready ) {
		lock_guard<mutex> lockCout(coutMutex);
		
		cout << this_thread::get_id() << “ ready => Result: “ << fut.get()
			<< endl;
	}
	else{
		lock_guard<mutex> lockCout(coutMutex);
		
		cout<< this_thread::get_id()<< “ stopped waiting.”<< endl;
	}
	
	const auto end = steady_clock::now();
	lock_guard<mutex> lockCout(coutMutex);

	cout<< this_thread::get_id()<< “ waiting time: “
		<< getDifference(start,end)<< “ ms”<< endl;
}

void consumePeriodically(shared_future<int> fut) {
	const auto start = steady_clock::now();
	
	future_status status;
	do {
		this_thread::sleep_for(milliseconds(700));
		status = fut.wait_for(seconds(0));

		if (status == future_status::timeout) {
			lock_guard<mutex> lockCout(coutMutex);
			cout<< “ “ << this_thread::get_id() << “ still waiting.”
				<< endl;
		}

		if (status == future_status::ready) {
			lock_guard<mutex> lockCout(coutMutex);
			cout << “ “<< this_thread::get_id() 
				<< “ waiting done => Result: “
				<< fut.get()<< endl;
		}
	} while (status != future_status::ready);

	const auto end = steady_clock::now();
	lock_guard<mutex> lockCout(coutMutex);
	cout << “ “ << this_thread::get_id() << “ waiting time: “
		<< getDifference(start,end)<< “ ms” << endl;
}

void consumeWithBackoff(shared_future<int> fut) {
	const auto start = steady_clock::now();
	future_status status;
	auto dur = milliseconds(1);
	
	do {
		this_thread::sleep_for(dur);
		status = fut.wait_for(seconds(0));
		dur *= 2;

		if (status == future_status::timeout) {
			lock_guard<mutex> lockCout(coutMutex);
			cout << “  “ << this_thread::get_id() << “ still waiting.”
				<< endl;
		}

		if (status == future_status::ready) {
			lock_guard<mutex> lockCout(coutMutex);
			cout<< “  “ << this_thread::get_id()
				<< “ waiting done => Result: “
				<< fut.get() << endl;
		}
	} while (status != future_status::ready);

	const auto end = steady_clock::now();
	lock_guard<mutex> lockCout(coutMutex);
	cout<< “  “ << this_thread::get_id() << “ waiting time: “
		<< getDifference(start,end)<< “ ms”<< endl;
}

int main() {
	cout << endl;
	promise<int> prom;
	shared_future<int> future = prom.get_future();
	thread producerThread(producer, move(prom));

	thread consumerThread1(consumer, future, seconds(4));
	thread consumerThread2(consumer, future, seconds(20));
	thread consumerThread3(consumePeriodically, future);
	thread consumerThread4(consumeWithBackoff, future);

	consumerThread1.join();
	consumerThread2.join();
	consumerThread3.join();
	consumerThread4.join();
	producerThread.join();

	cout << endl;
}
```

В главной функции, создаётся объект-обещание. Затем на основе обещания в строке создаётся фьючерс, а обещание перемещается в отдельный поток (строка `thread producerThread(producer, move(prom));`). Обещание необходимо именно перемес­тить, поскольку обещания не поддерживают копирование. Для фьючерсов типа [[future#std shared_future|std::shared_future]] копирование разрешено, это выполняется в строках `thread consumerThread1(consumer, future, seconds(4));` – `thread consumerThread4(consumeWithBackoff, future);`.

Прежде чем перейти к описанию алгоритмов, выполняющихся в потоках, нужно сказать несколько слов о вспомогательной функции `getDifference`. Эта функция принимает два аргумента – момента времени – и возвращает длительность промежутка между ними в миллисекундах. Эта функция используется в программе несколько раз. Созданные в главной функции потоки выполняют каждый свой алгоритм.

* Поток `producerThread` выполняет функцию `producer` (строки `void producer(promise<int>&& prom) { ... }`), которая устанавливает результат объекта-обещания спустя 5 секунд ожидания. Именно этого результата ожидают фьючерсы.
* Поток `consumerThread` выполняет функцию consumer (строки `void consumer(shared_future<int> fut, steady_clock::duration dur) { ... }`), которая ждёт результата от фьючерса не более 4 секунд и продолжает работу. Этого времени недостаточно, чтобы поток-производитель завершил свою работу и опубликовал результат.
* Поток `consumerThread2` выполняет ту же функцию `consumer`, но на этот раз она ожидает появления результата не более 20 секунд.
* Поток `consumerThread3` выполняет функцию `consumePeriodically` (строки `void consumePeriodically(shared_future<int> fut) { ... }`). Она засыпает на 700 миллисекунд (строка `this_thread::sleep_for(milliseconds(700));`), затем без ожидания проверяет наличие результата в обещании (строка `status = fut.wait_for(seconds(0));`). Если результат фьючерса имеется в наличии, он выводится на печать, в противном случае функция повторяет цикл ожидания.
* Поток `consumerThread4` выполняет функцию `consumeWithBackoff` (строки `void consumeWithBackoff(shared_future<int> fut) { ... }`). В первый раз она выжидает одну миллисекунду, затем увеличивает этот интервал вдвое на каждой итерации цикла ожидания. Во всём остальном стратегия подобна предыдущей.

Теперь необходимо разобраться, как в этой программе происходит синхронизация потоков. Как часы, измеряющие реальное время выполнения программы, так и объект [[cout|std::cout]] доступны всем потокам, но это ещё не делает синхронизацию необходимой. Во-первых, функция `now` потокобезопасна. Во-вторых, стандарт гарантирует, что каждая операция вывода в объект [[cout|std::cout]] потокобезопасна. Блокировка с мьютексом требуется только там, где подряд осуществляется несколько операций вывода.

Несмотря на то что потоки выводят свои сообщения последовательно, один за другим, общий результат работы программы оказывается непростым для понимания.

![[time_9.png]]

Первым выводится сообщение от потока-производителя, который управляет объектом-обещанием. Все остальные сообщения исходят от потоков-потребителей, которые запрашивают результат обещания через фьючерсы. Поток-потребитель `consumerThread4` пытается получить результат из фьючерса. Помимо прочего, он выводит идентификатор потока. Его сообщения сдвинуты вправо на 8 символов. Затем со сдвигом на 4 символа следует сообщение от потока `consumerThread3`. Сообщения от потоков `consumerThread1` и `consumerThread2` выводятся без отступа.
* Поток `consumerThread1` безуспешно ждёт 4000,18 мс и завершается, так и не получив результата от фьючерса.
* Поток `consumerThread2` имеет право ждать до 20 с, но получает ожидаемое значение уже через 5000,3 мс.
* Поток `consumerThread3` получает значение из фьючерса спустя 5601,76 мс. Это примерно равно 5600 мс, т. е. он 8 раз выполняет цикл ожидания по 700 мс.
* Наконец, поток `consumerThread4` завершается через 8193,81 мс. Иными словами, он ждёт лишних 3 с после того, как результат уже появляется во фьючерсе.

# std::chro­no::system_clock
#std_chro­no_system_clock

# std::chrono::steady_clock
#std_chrono_steady_clock

# std::chrono::high_resolution_clock
#std_chrono_high_resolution_clock

# std::chrono::duration
#std_chrono_duration


# std::literals::chrono_literals
#std::literals::chrono_literals

суффиксы обозначающие: `y` - годы, `d` - дни, `h` - часы, `min` - минуты, `ms` - миллисекунды, `ns` - наносекунды, `s` - секунды и `us` - микросекунды











