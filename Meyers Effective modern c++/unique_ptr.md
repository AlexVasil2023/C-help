#std_unique_ptr
# std::unique_ptr C++11
```c++
std::unique_ptr<int> p1{ new int }; 
std::unique_ptr<int> p2 = p1; // ошибка - нельзя копировать уникальные указатели
std::unique_ptr<int> p3 = std::move(p1); // перемещает `p1` в `p3` 
			// теперь небезопасно разыменовывать объект, удерживаемый `p1`
```

# Используйте std::unique_ptr для управления ресурсами путем исключительноrо владения
Когда вы обращаетесь к интеллектуальным указателям, обычно ближе других под рукой должен находиться `std::unique_ptr`. Разумно предположить, что по умолчанию `std::unique_ptr` имеет тот же размер, что и обычный указатель, и для большинства операций (включая разыменования) выполняются точно такие же команды. Это означает, что такие указатели можно использовать даже в ситуациях, когда важны расход памяти и процессорного времени. Если встроенные указатели для вас достаточно малы и быстры, то почти наверняка такими же будут для вас и указатели `std::unique_ptr`.

Интеллектуальные указатели `std::unique_ptr` воплощают в себе семантику исключительного владения. Ненулевой `std::unique_ptr` всегда владеет тем, на что указывает. Перемещение `std::unique_ptr` передает владение от исходного указателя целевому. (Исходный указатель при этом становится нулевым.) Копирование `std::unique_ptr` не разрешается, так как если вы можете копировать `std::unique_ptr`, то у вас будут два `std::unique_ptr`, указывающих на один и тот же ресурс, и каждый из них будет считать, что именно он владеет этим ресурсом (а значит, должен его уничтожить). Таким образом, `std::unique_ptr` является только перемещаемым типом. При деструкции ненулевой `std::unique_ptr` освобождает ресурс, которым владеет. По умолчанию освобождение ресурса выполняется с помощью оператора `delete`, примененного ко встроенному указателю в `std::unique_ptr`.

Обычное применение `std::unique_ptr` - возвращаемый тип фабричных функций для объектов иерархии. Предположим, что у нас имеется иерархия типов инвестиций (например, акции, облигации, недвижимость и т.п.) с базовым классом `Investment`.
```c++
class Investment { ... } ;

class Stock: public Investment {...};
class Bond: public Investment {...};
class RealEstate: public Investment {...};
```
Фабричная функция для такой иерархии обычно выделяет объект в динамической памяти и возвращает указатель на него, так что за удаление объекта по завершении работы с ним отвечает вызывающая функция. Это в точности соответствует интеллектуальному указателю `std::unique_ptr`, поскольку вызывающий код получает ответственность за ресурс, возвращенный фабрикой (т.е. исключительное владение ресурсом), и `std::unique_ptr` автоматически удаляет то, на что указывает, при уничтожении указателя `std::unique_ptr`. Фабричная функция для иерархии `Investment` может быть объявлена следующим образом:
```c++
template<typename ... Ts>              // Возвращает std::unique_ptr
std::unique_ptr<Investment>            // на объект, созданный из
makeInvestment(Ts&& ... params);       // данных аргументов
```
Вызывающий код может использовать возвращаемый `std::unique_ptr` как в одной области видимости,
```c++
{
	...
	auto pInvestment =                // pinvestment имеет тип
		makelnvestment(arguments);    // std::unique_ptr<Investment>
}                                     // Уничтожение *plnvestment
```
так и в сценарии передачи владения, таком, как когда `std::unique_ptr`, возвращенный фабрикой, перемещается в контейнер, элемент контейнера впоследствии перемещается в член-данные объекта, а этот объект позже уничтожается. Когда это происходит, член­-данные `std::unique_ptr` объекта также уничтожается, что приводит к освобождению ресурса, полученного от фабрики. Если цепочка владения прерывается из-за исключения или иного нетипичного потока управления (например, раннего возврата из функции или
из-за `break` в цикле), для `std::unique_ptr`, владеющего ресурсом, в конечном итоге вызывается деструктор, и тем самым освобождается захваченный ресурс.

По умолчанию это освобождение выполняется посредством оператора `delete`, но в процессе конструирования объект `std::unique_ptr` можно настроить для использования пользовательских удалителей (custom deleters): произвольных функций (или функциональных объектов, включая получающиеся из лямбда-выражений), вызываемых для освобождения ресурсов. Если объект, созданный с помощью `makeInvestment`, не должен быть удален непосредственно с помощью `delete`, а сначала должна быть внесена запись в журнал, `makeInvestment` можно реализовать следующим образом (пояснения приведены после кода, так что не беспокойтесь, если вы увидите что-то не совсем очевидное для вас).
```c++
auto delinvmt = [](Investment* pInvestment)  // Пользовательский
			{                                // удалитель .
				makeLogEntry(pInvestment);   // (Лямбда - выражение )
				delete pInvestment;
			};
			
template<typename ... Ts>                    // Исправленный
std::unique_ptr<Investment,                  // возвращаемый тип
				decltype (delinvmt)>
makelnvestment(Ts&& ... params)
{
	std::unique_ptr<Investment,
				decltype(delinvmt)>          // Возвращаемый
		pInv(nullptr, delInvmt);             // указатель
		
	if( /* Должен быть создан объект Stock */ )
	{
		pInv.reset(new Stock(std::forward<Ts>(params) ...));
	}
	else if ( /* Должен быть создан объект Bond */ )
	{
		pInv.reset(new Bond(std::forward<Ts>(params) ...));
	}
	else if ( /* Должен быть создан объект RealEstate */ )
	{
		pInv.reset(new RealEstate(std::forward<Ts>(params) ...));
	}
	
	return pInv;
};
```
Сейчас я поясню вам, как это работает, но сначала рассмотрим, как все это выглядит с точки зрения вызывающей функции. Предположим, что вы сохраняете результат вызова `makeinvestment` в переменной, объявленной как `auto`, и тем самым остаетесь в блаженном неведении о том, что используемый вами ресурс требует специальной обработки в процессе удаления. Вы просто купаетесь в этом блаженстве, поскольку использование `std::unique_ptr` означает, что вам не надо рассматривать самостоятельно вопросы освобождения ресурса, тем более не требуется беспокоиться о том, чтобы это уничтожение выполнялось в точности один раз на каждом пути в программе. Обо всем этом `std::unique_ptr` заботится автоматически. С точки зрения клиента интерфейс `makeinvestment` - просто конфетка.

Реализация очень красивая, если вы понимаете следующее:
> - `delInvmt` представляет собой пользовательский удалитель для объекта, возвращаемого функцией `makeinvestment`. Все функции пользовательских удалителей принимают обычный указатель на удаляемый объект и затем выполняют все необходимые действия по его удалению. В нашем случае действие заключается в вызове `makeLogEntry` и последующем применении `delete`. Применение лямбда-выражения для создания `delInvmt` удобно, но, как вы вскоре увидите, оно также гораздо эффективнее написания обычной функции.
> 
> - Когда используется пользовательский удалитель, его тип должен быть указан в качестве второго аргумента типа `std::unique_ptr`. В нашем случае это тип `delInvmt`, и именно поэтому возвращаемым типом `makeInvestment` является `std::unique_ptr<Investment, decltype(delInvmt)>`. (О том, [[decltуре|что такое decltype]]).
> 
> - Основная стратегия `makeInvestment` состоит в создании нулевого указателя `std::unique_ptr`, после чего он делается указывающим на объект соответствующего типа и возвращается из функции. Для связи пользовательского удалителя `delInvmt` с `pinv` мы передаем его в качестве второго аргумента конструктора.
> 
> - Попытка присвоить обычный указатель (например, возвращенный оператором `new`) указателю `std::unique_ptr` компилироваться не будет, поскольку она будет содержать неявное преобразование обычного указателя в интеллектуальный. Такие неявные преобразования могут быть проблематичными, так что интеллектуальные указатели С++11 их запрещают. Вот почему для того, чтобы `pinv` взял на себя владение объектом, созданным с помощью оператора `new`, применяется вызов `reset`.
> 
> - С каждым использованием `new` мы применяем `std::forward` для прямой передачи аргументов, переданных в `makeinvestment` ([[Использование move и forward|см.]]). Это делает всю информацию, предоставляемую вызывающей функцией, доступной конструкторам создаваемых объектов.
> 
> - Пользовательский удалитель получает параметр типа `Investment*`. Независимо от фактического типа объекта, создаваемого в функции `makeinvestment` (т.е. `Stock`, `Bond` или `RealEstate`) , он в конечном итоге будет удален с помощью оператора `delete` в лямбда-выражении как объект `Investment *`. Это означает, что мы удаляем производный класс через указатель на базовый класс. Чтобы это сработало, базовый класс `Investment` должен иметь виртуальный деструктор:

```c++
class Investment
	public:
		virtual ~Investment();            // Важная часть дизайна
};
```
В С++14 существование вывода [[decltуре|возвращаемого типа функции]] означает,
что `makeinvestment` можно реализовать проще и несколько более инкапсулированно:

```c++
template<typename ... Ts>
auto makeInvestment(Ts&& ... params)                    // С++14
{
	auto delInvmt = [] (Investment* pInvestment)
	{									// Теперь размещается в
		makeLogEntry (pInvestment);     // пределах makeInvestment
		delete pInvestment;
	};
	
	std::unique_ptr<Investment, decltype(delInvmt)>
		pInv(nullptr, delInvmt);        // Как и ранее
		if (...)                        // Как и ранее
		{
			pInv.reset(new Stock(std::forward<Ts>(params) ...));
		}
		else if (...)                   // Как и ранее
		{
			pInv.reset(new Bond(std::forward<Ts>(params) ...));
		}
		else if(...)                    // Как и ранее
		{
			pInv.reset(new RealEstate(std::forward<Ts>(params) ...));
		}
		
		return pinv;                    // Как и ранее
```
Ранее отмечалось, что при использовании удалителя по умолчанию (т.е. `delete`) можно разумно предположить, что объекты `std::unique_ptr` имеют тот же размер, что и обычные указатели. Когда в игру вступают пользовательские указатели, это предположение перестает быть верным. Удалители являются указателями на функции, которые в общем случае приводят к увеличению размера `std::unique_ptr` на слово или два. Для удалителей, являющихся функциональными объектами, изменение размера зависит от того, какое состояние хранится в функциональном объекте. Функциональные объекты без состояний (например, получающиеся из лямбда-выражений без захватов) не приводят к увеличению размеров, а это означает что когда пользовательский удалитель может быть реализован как функция или как лямбда-выражение, то реализация в виде лямбда-выражения предпочтительнее:
```c++
auto delInvmt1 = [](Investment *pInvestment)
{                                     // Пользовательский удалитель
	makeLogEntry(pInvestment);        // как лямбда - выражение
	delete pInvestment;               // без состояния
};

template<typename ... Ts>             // Возвращаемый тип имеет размер
std::unique_ptr<Investment,           // Investment* 
	decltype (delInvmt1)>
makelnvestment(Ts&& ... args);

void delInvmt2 (Investment* pInvestment) // Пользовательский
{                                        // удалитель как
	makeLogEntry(pInvestment);           // функция
	delete pInvestment;
}

template<typename ... Ts>             // Возвращаемый тип имеет размер
std::unique_ptr<Investment,           // Investment* плюс как минимум
	void (*) (Investment*)>           // размер указателя на функцию!
makelnvestment(Ts&& ... args);
```
Удалители в виде функциональных объектов с большим размером состояния могут привести к значительным размерам объектов `std::unique_ptr`. Если вы обнаружите, что пользовательский удалитель делает ваш интеллектуальный указатель `std::unique_ptr` неприемлемо большим, вам, вероятно, стоит изменить свой дизайн.

Фабричные функции - не единственный распространенный способ использования `std::unique_ptr`. Эти интеллектуальные указатели еще более популярны в качестве механизма реализации идиомы `Pimpl` (указателя на реализацию). Соответствующий код не сложен, [[идиомы указателя|рассмотрен тут]].

Интеллектуальный указатель `std::unique_ptr` имеет две разновидности: одну - для индивидуальных объектов (`std::unique_ptr<T>`), а другую - для массивов (`std::unique_ptr<T[]>`). В результате никогда не возникает неясность в том, на какую сущность указывает `std::unique_ptr`. API `std::unique_ptr` разработан так, чтобы соответствовать используемой разновидности. Например, в случае указателя для одного объекта отсутствует оператор индексирования (`operator[]`), в то время как в случае указателя для массива отсутствуют операторы разыменования (`operator*` и `operator->`).

Существование `std::unique_ptr` для массивов должно представлять только интеллектуальный интерес, поскольку [[Array|std::array]], [[vector|std::vector]] и [[string~std::string]] почти всегда оказываются лучшим выбором, чем встроенные массивы. Я могу привести только одну ситуацию, когда `std::unique_ptr<T[]>` имеет смысл - при использовании С-образного API, который возвращает встроенный указатель на массив в динамической памяти, которым вы будете владеть.

Интеллектуальный указатель `std::unique_ptr` представляет собой способ выражения исключительного владения на С++11, но одной из наиболее привлекательных возможностей является та, что его можно легко и эффективно преобразовать в `std::shared_ptr`:
```c++
std::shared_ptr<Investment> sp =   // Конвертация std::unique_ptr
	makeInvestment(arguments);     // в std::shared_ptr
```

Это ключевой момент, благодаря которому `std::unique_ptr` настолько хорошо подходит для возвращаемого типа фабричных функций. Фабричные функции не могут знать, будет ли вызывающая функция использовать семантику исключительного владения возвращенным объектом или он будет использоваться совместно (т.е. `std::shared_ptr`). Возвращая `std::unique_ptr`, фабрики предоставляют вызывающим функциям наиболее эффективный интеллектуальный указатель, но не мешают им заменить этот указатель более гибким. ([[shared_ptr|Информация об интеллектуальном указателе std::shared_ptr]].)

> - `std::unique_ptr` представляет собой маленький, быстрый, предназначенный только для перемещения интеллектуальный указатель для управления ресурсами с семантикой исключительного владения.
> 
> - По умолчанию освобождение ресурсов выполняется с помощью оператора `delete`, но могут применяться и пользовательские удалители. Удалители без состояний и указатели на функции в качестве удалителей увеличивают размеры объектов `std::unique_ptr`.
> 
> - Интеллектуальные указатели `std::unique_ptr` легко преобразуются в интеллектуальные указатели `std::shared_ptr`.



