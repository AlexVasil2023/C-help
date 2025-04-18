# std::make_unique C++14

**`std::make_unique`** рекомендуется использовать для создания экземпляров **[[make_unique|std::unique_ptr]]**, так как эта функция позволяет:
> - избежать использования оператора `new`;
> - предотвратить дублирование кода при указании базового типа, который должен содержать указатель;
> - обеспечить безопасность при исключениях.

Предположим, мы вызываем функцию `foo` следующим образом:
```c++
foo(std::unique_ptr<T>{ new T{} }, function_that_throws(), std::unique_ptr<T>{ new T{} });
```

Поскольку мы выделили данные в куче в первой конструкции `T`, здесь происходит утечка. `std::make_unique` обеспечивает безопасность при выбросе исключений:
```c++
foo(std::make_unique<T>(), function_that_throws(), std::make_unique<T>());
```

# std::make_shared C++11

`std::make_shared` рекомендуется использовать для создания экземпляров **[[shared_ptr|std::shared_ptr]]**, так как эта функция позволяет:

> - избежать использования оператора `new`;
> - предотвратить дублирование кода при указании базового типа, который должен содержать указатель;
> - обеспечить безопасность при исключениях;
> - предотвратить повторное выделение памяти.
# Предпочитайте использование std::make_unique и std::make_shared непосредственному использованию оператора new
Начнем с выравнивания игровой площадки для игры `std::make_unique` и `std::make_shared` против обычных указателей. Функция `std::make_shared` является частью C++11, но, увы, `std::make_unique` таковой не является. Она вошла в стандарт только начиная с С++14. Если вы используете С++11, не переживайте, потому что базовую версию `std::make_unique` легко написать самостоятельно. Смотрите сами:
```c++
template<typename Т, typename ... Ts>
std::unique_ptr<T> make_unique(Ts&& ... params)
{
	return std::unique_ptr<T> (
		new T(std::forward<Ts>(params) ...));
}
```
Как вы можете видеть, `make_unique` просто выполняет прямую передачу своих параметров в конструктор создаваемого объекта, создает `std::unique_ptr` из обычного указателя, возвращаемого оператором `new`, и возвращает этот указатель `std::unique_ptr`. Функция в данном виде не поддерживает массивы или пользовательские удалители ([[unique_ptr|см.]]), но зато демонстрирует, как с минимальными усилиями можно при необходимости создать `make_unique`. Только не помещайте вашу версию в пространство имен `std`, поскольку иначе вы можете столкнуться с коллизией имен при обновлении реализации стандартной библиотеки до С++14.

Функции `std::make_unique` и `std::make_shared` представляют собой две из трех
`mаkе`-функций, т.е. функций, которые принимают произвольное количество аргументов, выполняют их прямую передачу конструктору объекта, создаваемого в динамической памяти, и возвращают интеллектуальный указатель на этот объект. Третья `mаkе` функция [[allocate_shared|std::allocate_shared]]. Она работает почти так же, как и `std::make_shared`, за исключением того, что первым аргументом является объект распределителя, использующийся для выделения динамической памяти.

Даже самое тривиальное сравнение создания интеллектуального указателя с помощью `mаkе`-функции и без участия таковой показывает первую причину, по которой применение таких функций является предпочтительным. Рассмотрим следующий код.
```c++
auto upw1(std::make_unique<Widget>());            // С mаkе - функцией
std::unique_ptr<Widget>upw2(new Widget);          // Без mаkе - функции

auto spw1(std::make_shared<Widget>());            // С mаkе -функцией
std::shared_ptr<Widget>spw2(new Widget);          // Без mаkе - функции
```
Версия с применением оператора `new` повторяет созданный тип, в то время как `mаkе`-функции этого не делают. Повторение типа идет вразрез с основным принципом разработки программного обеспечения: избегать дублирования кода. Дублирование в исходном тексте увеличивает время компиляции, может вести к раздутому объектному коду и в общем случае приводит к коду, с которым сложно работать. Зачастую это ведет к несогласованному коду, а несогласованности в коде часто ведут к ошибкам. Кроме того, чтобы набрать на клавиатуре что-то дважды, надо затратить в два раза больше усилий, чем для единственного набора, а кто из нас не любит сократить эту работу?

Второй причиной для предпочтения `mаkе`-функций является безопасность исключений. Предположим, что у нас есть функция для обработки `Widget` в соответствии с некоторым приоритетом:
```c++
void processWidget(std::shared_ptr<Widget>spw, int priority);
```
Передача [[shared_ptr|std::shared_ptr]] по значению может выглядеть подозрительно, но [[Subtlety#Рассмотрите передачу по значению для копируемых параметров, которые лeгкo перемещаются и всегда копируются|тут]] поясняется, что если `processWidget` всегда делает копию [[shared_ptr|std::shared_ptr]] (например, сохраняя ее в структуре данных, отслеживающей обработанные объекты `Widget`) , то это может быть разумным выбором.

Предположим теперь, что у нас есть функция для вычисления приоритета:
```c++
int computePriority();
```
и мы используем ее в вызове `processWidget`, который использует оператор `new` вместо `std::make_shared`:
```c++
processWidget (                                     // Потенциальная
std::shared_ptr<Widget>(new Widget),                // утечка
computePriority());                                 // ресурса
```
Как указывает комментарий, этот код может приводить к утечке `Widget`, вызванной применением `new`. Но почему? И вызывающий код, и вызываемая функция используют указатели [[shared_ptr|std::shared_ptr]], а [[shared_ptr|std::shared_ptr]] спроектированы для предотвращения утечек ресурсов. Они автоматически уничтожают то, на что указывают, когда исчезает последний [[shared_ptr|std::shared_ptr]]. Если все везде используют указатели [[shared_ptr|std::shared_ptr]], о какой утечке может идти речь?

Ответ связан с тем, как компиляторы транслируют исходный код в объектный. Во время выполнения аргументы функции должны быть вычислены до вызова функции, так что в вызове `processWidget` до того, как `processWidget` начнет свою работу, должно произойти следующее:

> - Выражение `new Widget` должно быть вычислено, т.е. в динамической памяти должен быть создан объект `Widget`.
> - Должен быть вызван конструктор `std::shared_ptr<Widget>`, отвечающий за управление указателем, сгенерированным оператором `new`.
> - Должна быть вызвана функция `computePriority`.

Компиляторы не обязаны генерировать код, выполняющий перечисленные действия именно в таком порядке. Выражение `new Widget` должно быть выполнено до вызова конструктора [[shared_ptr|std::shared_ptr]], поскольку результат этого оператора `new` используется в качестве аргумента конструктора, но функция `computePriority` может быть выполнена до указанных вызовов, после них или, что критично, между ними, т.е. компиляторы могут генерировать код для выполнения операций в следующем порядке.

> 1. Выполнить `new Widget`;
> 2. Выполнить `computePriority`;
> 3. Вызвать конструктор `std::shared_ptr`.

Если сгенерирован такой код и во время выполнения `computePriority` генерирует исключение, созданный на первом шаге в динамической памяти `Widget` будет потерян, так как он не будет сохранен в указателе [[shared_ptr|std::shared_ptr]], который, как предполагается, начнет управлять им на третьем шаге.

Применение `std::make_shared` позволяет избежать таких проблем. Вызывающий код имеет следующий вид:
```c++
processWidget(std::make_shared<Widget>(),        // Потенциальной
	compute Priority());                         // утечки ресурсов нет
```
Во время выполнения либо `std::make_shared`, либо `computePriority` будет вызвана первой. Если это `std::make_shared`, обычный указатель на созданный в динамической памяти `Widget` будет безопасно сохранен в возвращаемом указателе [[shared_ptr|std::shared_ptr]] до того, как будет вызвана функция `computePriority`. Если после этого функция `computePriority` сгенерирует исключение, деструктор [[shared_ptr|std::shared_ptr]] уничтожит объект `Widget`, которым владеет. А если первой будет вызвана функция `computePriority` и сгенерирует при этом исключение, то `std::make_shared` даже не будет вызвана, так что не будет создан объект `Widget`, и беспокоиться будет не о чем.

Если мы заменим [[shared_ptr|std::shared_ptr]] и `std::make_shared` указателем [[unique_ptr|std::unique_ptr]] и функцией `std::make_unique`, все приведенные рассуждения останутся в силе. Использование `std::make_unique` вместо `new` так же важно для написания безопасного с точки зрения исключений кода, как и применение `std::make_shared`.

Особенностью `std::make_shared` (по сравнению с непосредственным использованием `new`) является повышенная эффективность. Применение `std::make_shared` позволяет компиляторам генерировать меньший по размеру и более быстрый код, использующий более компактные структуры данных. Рассмотрим следующее непосредственное применение оператора `new`:
```c++
std::shared_ptr<Widget>spw(new Widget);
```
Очевидно, что этот код предполагает выделение памяти, но фактически он выполняет два выделения. [[shared_ptr|Поясняется]], что каждый указатель `std::shared_ptr` указывает на управляющий блок, содержащий, среди прочего, значение счетчика ссылок для указываемого объекта. Память для этого блока управления выделяется в конструкторе [[shared_ptr|std::shared_ptr]]. Непосредственное применение оператора `new`, таким образом, требует одного выделения памяти для `Widget` и второго - для управляющего блока.

Если вместо этого использовать `std::make_shared`:
```c++
auto spw = std::make_shared<Widget>();
```
то окажется достаточно одного выделения памяти. Дело в том, что функция `std::make_ shared` выделяет один блок памяти для хранения как объекта `Widget`, так и управляющего блока. Такая оптимизация снижает статический размер программы, поскольку код содержит только один вызов распределения памяти и повышает скорость работы выполнимого кода, так как выполняется только одно выделение памяти. Кроме того, применение `std::make_shared` устраняет необходимость в некоторой учетной информации в управляющем блоке, потенциально уменьшая общий объем памяти, требующийся для программы.

Анализ эффективности функции `std::make_shared` в равной мере применим и к
[[allocate_shared|std::аllocate_shared]], так что преимущество повышения производительности функции `std::make_shared` распространяется и на нее.

Аргументы в пользу предпочтения `mаkе`-функций непосредственному использованию оператора `new` весьма существенны. Тем не менее, несмотря на их проектные преимущества, безопасность исключений и повышенную производительность, данный раздел говорит о предпочтительном применении `mаkе`-функций, но не об их исключительном использовании. Дело в том, что существуют ситуации, когда эти функции не могут или не должны использоваться.

Например, ни одна из `mаkе`-функций не позволяет указывать пользовательские удалители ([[unique_ptr|см.]]), в то время как конструкторы [[unique_ptr|std::unique_ptr]] и [[shared_ptr|std::shared_ptr]] это позволяют. Для данного пользовательского удалителя `Widget`
```c++
auto widgetDeleter = [](Widget* pw) { ... };
```
создание интеллектуального указателя с применением оператора `new` является очень простым:
```c++
std::unique_ptr<Widget, decltype (widgetDeleter)>
	upw (new Widget, widgetDeleter);

std::shared_ptr<Widget>spw(new Widget, widgetDeleter);
```
Сделать то же самое с помощью mаkе-функции невозможно.

Второе ограничение на `mаkе`-функции проистекает из синтаксических деталей их реализации. В [[Переход к c++11, c++14#Различие между { } и ( ) при создании объектов|разделе]] поясняется, что при создании объекта, тип которого перегружает конструкторы как с параметрами [[initializer_list|std::initializer_list]], так и без них, создание объекта с использованием фигурных скобок предпочитает конструктор [[initializer_list|std::initializer_list]], в то время как создание объекта с использованием круглых скобок вызывает конструктор, у которого нет параметров [[initializer_list|std::initializer_list]]. `mаkе`-функции выполняют прямую передачу своих параметров конструктору объекта, но делается ли это с помощью круглых или фигурных скобок? Для некоторых типов ответ на этот вопрос очень важен. Например, в вызовах
```c++
auto upv = std::make_unique<std::vector<int>>(1O, 20);
auto spv = std::make_shared<std::vector<int>>(1O, 20);
```
результирующие интеллектуальные указатели должны указывать на векторы [[vector|std::vector]] с 10 элементами, значение каждого из которых - 20, или на векторы с двумя элементами, один со значением 10, а второй со значением 20? Или результат непредсказуем?

Хорошая новость в том, что результат все же предсказуем: оба вызова создают векторы [[vector|std::vector]] с 10 элементами, значение каждого из которых равно 20. Это означает что в mаkе-функциях прямая передача использует круглые, а не фигурные скобки. Плохая новость в том, что если вы хотите создавать свои указываемые объекты с помощью инициализаторов в фигурных скобках, то должны использовать оператор new непосредственно. Использование `mаkе`-функции требует способности прямой передачи инициализатора в фигурных скобках, но, как [[Познакомьтесь с случаями некорректной работы прямой передачи|поясняется]], такие инициализаторы не могут быть переданы прямо. Однако есть [[Познакомьтесь с случаями некорректной работы прямой передачи|обходной путь]]: использование [[auto#Вывод типа auto|вывода типа auto]] для создания объекта [[initializer_list|std::initializer_list]] из [[auto#Вывод типа auto|инициализатора в фигурных скобках]] с последующей передачей созданного объекта через `mаkе`-функцию:
```c++
// Создание std::initializer_list
auto initList = { 10, 20}; 

// Создание std::vector с помощью конструктора
// с параметром std::initializer_list
auto spv = std::make_shared<std::vector<int>>(initList);
```
Для [[unique_ptr|std::unique_ptr]] эти два сценария (пользовательские удалители и фигурные инициализаторы) являются единственными, когда применение `mаkе`-функции оказывается проблематичным. Что касается [[shared_ptr|std::shared_ptr]] и его `mаkе`-функций, то есть еще два сценария. Оба они являются крайними случаями, но некоторые разработчики постоянно ходят по краю, и вы можете быть одним из них.

Некоторые классы определяют собственные версии `operator new` и `operator delete`.Наличие этих функций подразумевает, что глобальные функции выделения и освобождения памяти для объектов этого типа являются неприемлемыми. Зачастую подпрограммы для конкретных классов разрабатываются только для выделения и освобождения блоков памяти, по размеру точно совпадающих с размером объектов класса; например, `operator new` и `operator delete` для класса `Widget` зачатую способны выделять и освобождать только блоки памяти размером `sizeof(Widget)`. Такие подпрограммы плохо подходят для поддержки пользовательского распределения памяти для указателей [[shared_ptr|std::shared_ptr]] (с помощью [[allocate_shared|std::allocate_shared]]) и их удаления (с помощью пользовательских удалителей), поскольку количество запрашиваемой [[allocate_shared|std::аllocate_shared]]
памяти не совпадает с размером динамически создаваемого объекта (который равен размеру этого объекта плюс размер управляющего блока). Соответственно, применение `mаkе`-функций для создания объектов типов со специфичными для данного класса версиями `operator new` и `operator delete` обычно является плохой идеей.

Преимущества размера и скорости функции [[make_shared|std::make_shared]] по сравнению с непосредственным применением оператора `new` вытекают из того факта, что управляющий блок указателя [[shared_ptr|std::shared_ptr]] размещается в том же блоке памяти, что и управляемый объект. Когда счетчик ссылок объекта становится равным нулю, объект уничтожается (т.е. вызывается его деструктор). Однако занятая им память не может быть освобождена до тех пор, пока не будет уничтожен и управляющий блок, поскольку блок динамически выделенной памяти содержит как объект, так и управляющий блок.

Управляющий блок содержит, помимо самого счетчика ссылок, некоторую учетную информацию. Счетчик ссылок отслеживает, сколько указателей [[shared_ptr|std::shared_ptr]] ссылаются на управляющий блок, но управляющий блок содержит и второй счетчик ссылок, который подсчитывает, сколько указателей [[weak_ptr|std::weak_ptr]] ссылаются на этот управляющий блок. Этот второй счетчик ссылок известен как слабый счетчик (`weak couпt`). Когда указатель [[weak_ptr|std::weak_ptr]] [[shared_ptr|проверяет, не является ли он просроченным]], он делает это путем обращения к счетчику ссылок (но не к слабому счетчику) в управляющем блоке, на который ссылается. Если счетчик ссылок равен нулю (т.е. если указываемый объект не имеет указателей [[shared_ptr|std::shared_ptr]], указывающих на него, и, таким образом, является удаленным), указатель [[weak_ptr|std::weak_ptr]] является просроченным. В противном случае он просроченным не является.

Пока указатели [[weak_ptr|std::weak_ptr]] указывают на управляющий блок (т.е. слабый счет­
чик больше нуля), этот управляющий блок должен продолжать существовать. А пока существует управляющий блок, память, его содержащая, должна оставаться выделенной. Таким образом, память, выделенная `mаkе`-функцией для [[shared_ptr|std::shared_ptr]] не может быть освобождена до тех пор, пока не будут уничтожены последний указатель [[shared_ptr|std::shared_ptr]] и последний указатель [[weak_ptr|std::weak_ptr]], ссылающиеся на объект.

Если время между уничтожением последнего [[shared_ptr|std::shared_ptr]] и последнего [[weak_ptr|std::weak_ptr]] значительно, между уничтожением объекта и занимаемой им памятью может происходить задержка, что особенно важно для типов с большим размером:
```c++
class ReallyBigType { ... };
auto pBigObj =                             // Создание большого
std::make_shared<ReallyBigType>();         // объекта с помощью
                                           // std::make_shared
                                           
// Создание указателей std::shared_ptr и std::weak_ptr
// на большой объект и работа с ними

// Уничтожение последнего указателя std::shared_ptr на
// этот объект; остаются указатели std::weak_ptr

// Во время этого периода память, ранее занятая большим
// объектом, остается занятой

// Уничтожение последнего указателя std::weak_ptr на
// объект; освобождение памяти, выделенной для
// управляющего блока и объекта
```
При непосредственном использовании `nеw` память для объекта `ReallyBigType` может быть освобождена, как только уничтожается последний указатель [[shared_ptr|std::shared_ptr]], указывающий на него:
```c++
class ReallyBigType { ... };            // Как и ранее
// Создание очень большого объекта с помощью пew:std::shared
ptr<ReallyBigType> pBigObj (new ReallyBigType);

// Как и ранее, создание указателей std::shared_ptr и
// std::weak_ptr на объект и работа с ними

// Уничтожение последнего указателя std::shared_ptr на
// этот объект; остаются указатели std::weak_ptr
// Память, выделенная для объекта, освобождается

// Во время этого периода остается занятой только память,
// ранее выделенная для управляющего блока

// Уничтожение последнего указателя std::weak_ptr на
// объект; освобождение памяти, выделенной для
// управляющего блока
```
Оказавшись в ситуации, когда использование функции `std::make_shared` невозможно или неприемлемо, вы можете захотеть защититься от ранее рассматривавшихся нами проблем, связанных с безопасностью исключений. Лучший способ сделать это - обеспечить немедленную передачу результата операции `пеw` конструктору интеллектуального указателя в инструкции, которая не делает ничего иного. Это предотвратит создание компилятором кода, который может генерировать исключение между оператором `nеw` и вызовом конструктора интеллектуального указателя, который будет управлять объектом, созданным оператором `new`.

В качестве примера рассмотрим небольшое изменение небезопасного с точки зрения исключений вызова функции `processwidget`, которую мы рассматривали ранее. В этот раз мы укажем пользовательский удалитель:
```c++
void processwidget (std::shared_ptr<Widget>spw,      // Как и ранее
		int priority);

void cusDel(Widget* ptr);
// Пользовательский удалитель
```
Вот небезопасный с точки зрения исключений вызов:
```c++
processWidget{                                    // Как и ранее,
	std::shared_ptr<Widget>(new Widget, cusDel),  // потенциальная
	computePriority()                             // утечка
};                                                // ресурса!
```
Вспомним: если `computePriority` вызывается после `new Widget`, но до конструктора [[shared_ptr|std::shared_ptr]] и если `computePriority` генерирует исключение, происходит утечка динамически созданного `Widget`.

Здесь применение пользовательского удалителя препятствует использованию
`std::make_shared`, так что избежать проблемы можно, поместив создание `Widget` в динамической памяти и конструирование [[shared_ptr|std::shared_ptr]] в собственную инструкцию, а затем вызвав функцию `processWidget` с передачей ей полученного [[shared_ptr|std::shared_ptr]]. Вот и вся суть этого метода, хотя, как мы вскоре увидим, его можно подкорректировать для повышения производительности:
```c++
std::shared_ptr<Widget>spw (new Widget, cusDel);
processWidget(spw, computePriority());          // Корректно, но не
                                                // оптимально; см. ниже
```
Этот код работает, поскольку [[shared_ptr|std::shared_ptr]] предполагает владение обычным указателем, переданным конструктору, даже если этот конструктор генерирует исключение. В данном примере, если конструктор `spw` генерирует исключение (например, из-за невозможности выделить динамическую память для управляющего блока), он все равно гарантирует вызов `cusDel` для указателя, полученного в результате операции `new Widget`.

Небольшое снижение производительности возникает из-за того, что в небезопасном с точки зрения исключений коде мы передавали функции `processWidget` [[rvalue|rvalue]]
```c++
processWidget(
	std::shared_ptr<Widget>(new Widget, cusDel),       // rvalue
	computePriority()
);
```
а в случае безопасного вызова - передаем `lvalue`:
```c++
processWidget(spw, computePriority());                 // lvalue
```
Поскольку параметр [[shared_ptr|std::shared_ptr]] функции `processWidget` передается по значению, создание из [[rvalue|rvalue]] влечет за собой только перемещение, в то время как создание из [[lvalue|lvalue]] требует копирования. Для указателя [[shared_ptr|std::shared_ptr]] разница может оказаться существенной, так как копирование [[shared_ptr|std::shared_ptr]] требует атомарного инкремента счетчика ссылок, в то время как перемещение [[shared_ptr|std::shared_ptr]] не требует никаких действий со счетчиком ссылок вообще. Чтобы безопасный с точки зрения исключений код достиг уровня производительности небезопасного кода, нам надо применить [[move|std::move]] к `spw` для того, чтобы превратить его в [[rvalue|rvalue]] ([[move#Азы std move и std forward|см.]]):
```c++
processWidget(std::move(spw),                   // Эффективно и безопасно
	computePriority());                         // в смысле исключений
```
Это интересный метод, и его стоит знать, но обычно это не имеет особого значения, поскольку вы будете редко сталкиваться с причинами не использовать `mаkе`-функцию. Если у вас нет убедительных причин поступать иначе, используйте `mаkе`-функции.

> - По сравнению с непосредственным использованием `new`, `mаkе-функции` устраняют дублирование кода, повышают безопасность кода по отношению к исключениям и в случае функций `std::make_shared` и [[allocate_shared|std::allocate_shared]] генерируют меньший по размеру и более быстрый код.
> 
> - Ситуации, когда применение `mаkе-функций` неприемлемо, включают необходимость указания пользовательских удалителей и необходимость передачи инициализаторов в фигурных скобках.
> 
> - Для указателей [[shared_ptr|std::shared_ptr]] дополнительными ситуациями, в которых применение `mаkе-функций` может быть неблагоразумным, являются классы с пользовательским управлением памятью и системы, в которых проблемы с объемом памяти накладываются на использование очень больших объектов и наличие указателей [[weak_ptr|std::weak_ptr]], время жизни которых существенно превышает время жизни указателей [[shared_ptr|std::shared_ptr]].

