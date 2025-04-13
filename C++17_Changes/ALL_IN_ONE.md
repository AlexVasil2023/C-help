
На самом деле в C++17 более 100 изменений, здесь перечислены только некоторые из них. 
# if-init
### C++
```c++
{
   if (Foo * ptr = get_foo())
      use(*ptr);
      
   more_code();
}
```

Но что вы делаете, когда оно не преобразуется в логическое значение?
### C++
```c++
{
   {
      QVariant var = getAnswer();
      if (var.isValid())
         use(var);
   }
   
   more_code();
}
```

### C++
```c++
{
   {
      QVariant var = getAnswer();
      if (var.isValid())
         use(var);
   }
   
   more_code();
}
```

### C++17
```c++
{   
   if (QVariant var = getAnswer(); var.isValid())
      use(var);
      
   more_code();
}
```

Переключайте операторы тоже!
### C++17
```c++
{
   switch (Device dev = get_device(); dev.state())
   {
	   case sleep: /*...*/ break;
	   case ready: /*...*/ break;
	   case bad: /*...*/ break;
   }
}
```

# Структурированные привязки
### C++14
```c++
tuple<int, string> func();
   
auto tup = func();
int i = get<0>(tup);
string s = get<1>(tup);

use(s, ++i);
```
### C++14
```c++
tuple<int, string> func();

int i;
string s;
std::tie(i,s) = func();

use(s, ++i);
```
### C++17
```c++
tuple<int, string> func();

auto[i, s] = func();

use(s, ++i);
```
### C++17
```c++
pair<int, string> func();

auto[i, s] = func();
use(s, ++i);
```
### compiler
```c++
pair<int, string> func();

auto __tmp = func();
auto & i = get<0>(__tmp);
auto & s = get<1>(__tmp);

use(s, ++i);
```

Обратите внимание, что в приведенном выше примере `__tmp` - это копия, но `i` и `s` - это ссылки. Или я должен сказать "ссылки" в кавычках. Не совсем ссылки, но настоящие синонимы компилятора для членов. (Они не являются реальными ссылками, поскольку такие вещи, как `decltype`, "просматривают" ссылки на фактические элементы.)
Таким образом, хотя `auto [i,s] = func();` нигде не содержит `&`, ссылки все равно присутствуют. Например:
### C++17
```c++
#include <string>
#include <iostream>

struct Foo
{
   int x = 0;
   std::string str = "world";
   ~Foo() { std::cout << str; }
};

int main()
{
    auto[i, s] = Foo();
    std::cout << "hello ";
    s = "structured bindings";
}
```
### compiler
```c++
#include <string>
#include <iostream>

struct Foo
{
   int x = 0;
   std::string str = "world";
   ~Foo() { std::cout << str; }
};

int main()
{
    auto __tmp = Foo();
    std::cout << "hello ";
    __tmp.str = "structured bindings";
}
```

обратите внимание, что `s = "structured bindings";` изменяет `Foo::str` _внутри временного (скрытого) `Foo`, так что, когда временный `Foo` уничтожается, его деструктор выводит `structured bindings` вместо `world`.
Итак, что же делает символ "&" в объявлении структурированной привязки? 
Он применяется к скрытой переменной `__tmp`:
### C++17
```c++
struct X { int i = 0; };
X makeX();

X x;

auto [ b ] = makeX();
b++;
auto const [ c ] = makeX();
c++;
auto & [ d ] = makeX();
d++;
auto & [ e ] = x;
e++;
auto const & [ f ] = makeX();
f++;
```
### compiler
```c++
   struct X { int i = 0; };
   X makeX();
   
   X x;
   
   auto __tmp1 = makeX();
   __tmp1.i++;
   auto const __tmp2 = makeX();
   __tmp2.i++; //error: can't modify const
   auto & __tmp3 = makeX(); //error: non-const ref cannot bind to temp
   
   auto & _tmp3 = x;
   x.i++;
   auto const & _tmp4 = makeX();
   __tmp4.i++; //error: can't modify const
```

Подождите, [[pair|pair]] и [[Кортежи|tuple]] - это не волшебство (просто их почти невозможно записать в STL-качестве), могут ли мои типы работать с этим?
да. Компилятор использует функцию [[get|get<N>()]], если она доступна, или может напрямую работать с простыми структурами:

**Структуры**
### C++17
```c++
struct Foo {
  int x;
  string str;
};

Foo func();
 
auto[i, s] = func();
use(s, ++i);
```
### compiler
```c++
struct Foo {
  int x;
  string str;
};

Foo func();

Foo __tmp = func();
auto & i = __tmp.x;
auto & s = __tmp.str;

use(s, ++i);
```
# Реализуйте свои собственные get(), tuple_size, tuple_element
Для любого класса /структуры, которые не работают по умолчанию, вам нужно реализовать свой собственный пользовательский метод [[get|get<>()]], а также реализовать `tuple_size` и `tuple_element`.
### C++17
```c++
class Foo {
  // ...
public:
  template <int N> auto & get() /*const?*/ { /*...*/ }
};
// or get outside class
template<int N> auto & get(Foo /*const?*/ & foo) { /*...*/ }
//...

// tuple_size/element specialized
// yes, in namespace std
namespace std {
  // how many elements does Foo have
  template<> struct tuple_size<Foo> { static const int value = 3; }
  // what type is element N
  template<int N> struct tuple_element<N, Foo> { using type = ...add code here...; }
}

Foo func();

auto [ i, s ] = func();

use(s, ++i);
```
# Arrays, std::array, etc
### etc
```c++
int arr[4] = { /*...*/ };
auto [ a, b, c, d ] = arr; 
auto [ t, u, v ] = std::array<int,3>();

// now we're talkin'
for (auto && [key, value] : my_map)
{
  //...
}
```

# Constexpr If
На самом деле, как бы кто-нибудь написал пользовательскую функцию [[get|get<>()]] для своего класса? (смотрите раздел Структурированные привязки, чтобы узнать, почему вы можете захотеть это сделать), поскольку каждый get<0>, get<1> и т.д. возвращает другой элемент, который, возможно, имеет разные типы... (о нет, шаблонное метапрограммирование...)
### C++14
```c++
class Foo {
  int myInt;
  string myString;
public:
  int const & refInt() const
  { return myInt; }
  string const & refString() const
  { return myString; }
};

namespace std
{
   template<> class tuple_size<Foo>
       : public integral_constant<int, 2>
   { };
   template<int N> class tuple_element<N, Foo>
   {
   public:
      using type =
      conditional_t<N==0,int const &,string const &>;
   };
}

template<int N> std::tuple_element_t<N,Foo>
get(Foo const &);

// here's some specializations (the real stuff)
template<> std::tuple_element_t<0,Foo>
get<0>(Foo const & foo)
{
  return foo.refInt();
}
template<> std::tuple_element_t<1,Foo>
get<1>(Foo const & foo)
{
  return foo.refString();
}
```
### C++17
```c++
class Foo {
  int myInt;
  string myString;
public:
  int const & refInt() const
  { return myInt; }
  string const & refString() const
  { return myString; }
};

namespace std
{
   template<> class tuple_size<Foo>
       : public integral_constant<int, 2>
   { };
   template<int N> class tuple_element<N, Foo>
   {
   public:
      using type =
      conditional_t<N==0,int const &,string const &>;
   };
}


template<int N> auto & get(Foo const & foo)
{
  static_assert(0 <= N && N < 2, "Foo only has 2 members");

  if constexpr (N == 0)  // !! LOOK HERE !!
     return foo.refInt();
  else if constexpr (N == 1)    // !! LOOK HERE !!
     return foo.refString();
}
```
P.S. `if constexpr (выражение)` не проверяет, является ли выражение `constexpr`. Выражение должно быть `constexpr` (иначе оно не скомпилируется). Часть, которая является `constexpr`, выполняет if. Не думайте об этом и о том, какой синтаксис мог бы быть лучше. Комитет спорил об этом достаточно долго.
# Deduction Guides
Кстати, о [[pair|pair]] и [[Кортежи|кортеже tuple]].
### C++14
```c++
pair<int, string> is1 = pair<int, string>(17, "hello");
auto is2 = std::pair<int, string>(17, "hello");
auto is3 = std::make_pair(17, string("hello"));
auto is4 = std::make_pair(17, "hello"s);
```
### C++17
```c++
pair<int, string> is1 = pair(17, "hello");
auto is2 = pair(17, "hello"); // !! pair<int, char const *>
auto is3 = pair(17, string("hello"));
auto is4 = pair(17, "hello"s);
```

Волшебство, стоящее за всем вышесказанным, называется "руководства по дедукции". В частности, руководства по простой дедукции и руководства по явной дедукции.
## Explicit Deduction Guides
```c++
template<typename T>
struct Thingy
{
  T t;
};

// !! LOOK HERE !!
Thingy(const char *) -> Thingy<std::string>;

Thingy thing{"A String"}; // thing.t is a `std::string`.
```
## Implicit Deduction Guides
Для любой структуры `template<typename T, typename U, etc> struct`... (или класса!) если есть конструктор, который принимает `T` и `U` таким образом, что он может вычислять все типы, то этот конструктор формирует "неявное (implicit)" руководство по дедукции. т.е. точно так же, как в явном виде описано выше, но компилятор делает это за вас.
Что еще более важно, в приведенном выше тексте должно быть указано **for all** шаблонизированных типов... т.е. хотите вы этого или нет.
# template\<auto>
### C++14
```c++
template <typename T, T v>
struct integral_constant
{
   static constexpr T value = v;
};
integral_constant<int, 2048>::value
integral_constant<char, 'a'>::value
```
### C++17
```c++
template <auto v>
struct integral_constant
{
   static constexpr auto value = v;
};
integral_constant<2048>::value
integral_constant<'a'>::value
```
# Складывающиеся выражения
Как вы пишете `sum()` ?
```c++
auto x = sum(5, 8);
auto y = sum(a, b, 17, 3.14, etc);
```
### C++14
```c++
auto sum() { return 0; }

template <typename T>
auto sum(T&& t) { return t; }

template <typename T, typename... Rest>
auto sum(T&& t, Rest&&... r) {
   return t + sum(std::forward<Rest>(r)...);
}
```
### C++17
```c++
template <typename... Args>
auto sum(Args&&... args) {
   return (args + ... + 0);
}
```
# Вложенные пространства имен
### C++14
```c++
namespace A {
      namespace B {
         namespace C {
            struct Foo { };
            //...
        }
    }
}
```
### C++17
```c++
namespace A::B::C {
  struct Foo { };
  //...
}
```
# static_assert
### C++14
```c++
static_assert(sizeof(short) == 2, "sizeof(short) == 2")
```
### C++17
```c++
static_assert(sizeof(short) == 2)
```
Вывод: static assertion failure: sizeof(short) == 2
# Inline переменные
### C++14
```c++
// foo.h
extern int foo;

// foo.cpp
int foo = 10;
```
### C++17
```c++
// foo.h
inline int foo = 10;
```
### C++14
```c++
// foo.h
struct Foo {
   static int foo;
};

// foo.cpp
int Foo::foo = 10;
```
### C++17
```c++
// foo.h
struct Foo {
   static inline int foo = 10;
};
```
# Гарантированное удаление копий
### C++17
```c++
// header <mutex>
namespace std
{
   template <typename M>
   struct lock_guard
   {
      explicit lock_guard(M & mutex);
      // not copyable, not movable:
      lock_guard(lock_guard const & ) = delete;
      //...
   }
}

// your code
lock_guard<mutex> grab_lock(mutex & mtx)
{
   return lock_guard<mutex>(mtx);
}

mutex mtx;

void foo()
{
   auto guard = grab_lock(mtx);
   /* do stuff holding lock */
}
```

# std::string_view
Допустим, я пишу какой-то синтаксический анализатор:
```c++
Foo parseFoo(std::string const & input);
```
Но затем у меня есть несколько пользователей, использующих `char *` и создающих `string` только для передачи в синтаксический анализатор, поэтому я добавляю (или изменяю) этот интерфейс:
```c++
Foo parseFoo(char const * str);
```
Но этот синтаксический анализатор становится по-настоящему популярным. Некоторые встраивают Foos в середину своих собственных форматов, поэтому в конце нет null:
```c++
Foo parseFoo(char const * str, int length);
```
О, и мы используем пользовательский класс string (или QString,...)
```c++
Foo parseFoo(myString const & str);
```
и так далее! Как вы поддерживаете этот интерфейс?
### C++14
```c++
Foo parseFoo(std::string const & input);
Foo parseFoo(char const * str);

Foo parseFoo(char const * str, int length);

Foo parseFoo(MyString const & str);
```
### C++17
```c++
Foo parseFoo(std::string_view input);

// I would say don't offer this interface, but:
Foo parseFoo(char const * str, int length)
{
   return parseFoo(string_view(str,length));
}

class MyString {
   //...
   operator string_view() const
   {
      return string_view(this->data, this->length);
   }
};
```
**Example 2**

Представьте себе что-то вроде синтаксического анализатора XML, который постоянно возвращает `string` объекты для найденных им XML-сущностей. Каждая из этих строк является потенциальным распределением. Поэтому вместо этого верните `string_view`.
**Предостережения**
`string_view` не владеет строковой памятью. Он указывает на память, принадлежащую другому объекту, аналогично тому, как работает ссылка, указатель или итератор.
У него есть семантика ссылок.
# std::optional\<T>

Итак, у нас есть
```c++
Foo parseFoo(std::string_view input);
```
Что, если синтаксический анализ завершится неудачей? И вы не сможете разобрать Foo?

0. генерируемое исключение
1. возвращает значение `Foo` по умолчанию. то есть `Foo()` (если Foo является конструктивным по умолчанию)
2. `bool parseFoo(std::string_view input, Foo & output);`  // также в принципе требуется `Foo()`
3. `Foo * parseFoo(std::string_view input);` // выделение!? :-(
### C++14
```c++
// returns default Foo on error
Foo parseFoo(std::string_view in);

// throws parse_error
Foo parseFoo(std::string_view in);

// returns false on error
bool parseFoo(std::string_view in, Foo & output);

// returns null on error
unique_ptr<Foo> parseFoo(std::string_view in);

```
### C++17
```c++
std::optional<Foo> parseFoo(std::string_view in);
```
**Использование**
### C++17
```c++
optional ofoo = parseFoo(str);
if (ofoo)
   use(*ofoo);
```

```c++
// nicer with new if syntax:
if (optional ofoo = parseFoo(str); ofoo)
   use(*ofoo);
```

```c++
optional<int> oi = parseInt(str);
std::cout << oi.value_or(0);
```

Обратите внимание, что [[optional|optional]] используется не только для ошибок, и исключения по-прежнему используются для обработки ошибок. 
# std::variant\<A,B,C,...>

Более совершенные [[union|union]].
### C++14
```c++
struct Stuff
{
   union Data {
      int i;
      double d;
      string s;  // constructor/destructor???
   } data;
   enum Type { INT, DOUBLE, STRING } type;
};
```
### C++17
```c++
struct Stuff
{
   std::variant<int, double, string> data;
};

```

**Использование**
### C++14
```c++
void handleData(int i);
void handleData(double d);
void handleData(string const & s);

//...

switch (stuff.type)
{
case INT:
   handleData(stuff.data.i);
   break;
case DOUBLE:
   handleData(stuff.data.d);
   break;
case STRING:
   handleData(stuff.data.s);
   break;
}
```
### C++17
```c++
void handleData(int i);
void handleData(double d);
void handleData(string const & s);

//...

std::visit([](auto const & val) { handleData(val); }, stuff.data);

// can also switch(stuff.data.index())
```

Как работает приведенная выше лямбда-формула
```c++
struct ThatLambda
{
   void operator()(int const & i) { handleData(i); }
   void operator()(double const & d) { handleData(d); }
   void operator()(string const & s) { handleData(s); }
};

ThatLambda thatLambda;
std::visit(thatLambda, stuff.data);
```

**Большее использование**
### C++17
```c++
if (holds_alternative<int>(data))
   int i = get<int>(data);

// throws if not double:
double d = get<double>(data);

```

```c++
std::variant<Foo, Bar> var;  // calls Foo()
// (or doesn't compile if no Foo())

Bar bar = makeBar();
var = bar; // calls ~Foo() and Bar(Bar const &)
// (what if Bar(Bar const & b) throws?)

var = Foo(); // calls ~Bar() and move-ctor Foo(Foo &&)
// (what if Foo(Foo && b) throws? - even though moves shouldn't throw)

var = someFoo;  // calls Foo::operator=(Foo const &)


std::variant<Foo, std::string> foostr;

foostr = "hello"; // char * isn't Foo or string
// yet foostr holds a std::string
```
# namespace std::filesystem
### C++14
```c++
#include <windows.h>

void copy_foobar() {
  std::wstring dir = L"\\sandbox";
  std::wstring p = dir + L"\\foobar.txt";
  std::wstring copy = p;
  copy += ".bak";
  CopyFile(p, copy, false);
  
  std::string dir_copy = dir + ".bak";
  SHFILEOPSTRUCT s = { 0 };
  s.hwnd = someHwndFromSomewhere;
  s.wFunc = FO_COPY;
  s.fFlags = FOF_SILENT;
  s.pFrom = dir.c_str();
  s.pTo = dir_copy.c_str();
  SHFileOperation(&s);
}

void display_contents(std::wstring const & p) {
  std::cout << p << "\n";

  std::wstring search = p + "\\*";
  WIN32_FIND_DATA ffd;
  HANDLE hFind =
        FindFirstFile(search.c_str(), &ffd);
  if (hFind == INVALID_HANDLE_VALUE)
     return;
  
  do {
    if ( ffd.dwFileAttributes
         & FILE_ATTRIBUTE_DIRECTORY) {
      std::cout << "  " << ffd.cFileName << "\n";
    } else {
      LARGE_INTEGER filesize;
      filesize.LowPart = ffd.nFileSizeLow;
      filesize.HighPart = ffd.nFileSizeHigh;
      std::cout << "  " << ffd.cFileName
                << " [" << filesize.QuadPart
                << " bytes]\n";
    }
  } while (FindNextFile(hFind, &ffd) != 0);
}
```
### C++17
```c++
#include <filesystem>
#include <iostream>
namespace fs = std::filesystem;

void copy_foobar() {
  fs::path dir = "/";
  dir /= "sandbox";
  fs::path p = dir / "foobar.txt";
  fs::path copy = p;
  copy += ".bak";
  fs::copy(p, copy);
  fs::path dir_copy = dir;
  dir_copy += ".bak";
  fs::copy(dir, dir_copy, fs::copy_options::recursive);
}

void display_contents(fs::path const & p) {
  std::cout << p.filename() << "\n";

  if (!fs::is_directory(p))
    return;

  for (auto const & e: fs::directory_iterator{p}) {
    if (fs::is_regular_file(e.status())) {
      std::cout << "  " << e.path().filename()
                << " [" << fs::file_size(e) << " bytes]\n";
    } else if (fs::is_directory(e.status())) {
      std::cout << "  " << e.path().filename() << "\n";
    }
  }
}
```
### C++14 POSIX
```c++
#include <dirent.h>
#include <sys/stat.h>
#include <sys/types.h>

void copy_foobar() {

// [TODO]
// to copy file, use fread / fwrite

// how to copy directory...?
}

void display_contents(std::string const & p) {
  std::cout << p << "\n";

  struct dirent *dp;
  DIR *dfd;
  
  if ((dfd = opendir(p.c_str()) == nullptr)
    return;

  while((dp = readdir(dfd)) != nullptr) {
    struct stat st;
    string filename = p + "/" + dp->d_Name;
    if (stat(filename.c_str(), &st) == -1)
      continue;
      
    if ((st.st_mode & S_IFMT) == S_IFDIR)
      std::cout << "  " << filename << "\n";
    } else {
      std::cout << "  " << filename
                << " [" << st.st_size
                << " bytes]\n";
    }
  }
}
```
# Parallel STL

Множество стандартных алгоритмов теперь могут выполняться параллельно, если вы об этом попросите.

| [[difference#std adjacent_difference\|adjacent_difference]] | is_heap_until           | replace_copy_if          |
| ----------------------------------------------------------- | ----------------------- | ------------------------ |
| adjacent_find                                               | is_partitioned          | replace_if               |
| all_of                                                      | is_sorted               | reverse                  |
| any_of                                                      | is_sorted_until         | reverse_copy             |
| copy                                                        | lexicographical_compare | rotate                   |
| copy_if                                                     | max_element             | rotate_copy              |
| copy_n                                                      | merge                   | search                   |
| count                                                       | min_element             | search_n                 |
| count_if                                                    | minmax_element          | set_difference           |
| equal                                                       | mismatch                | set_intersection         |
| fill                                                        | move                    | set_symmetric_difference |
| fill_n                                                      | none_of                 | set_union                |
| find                                                        | nth_element             | sort                     |
| find_end                                                    | partial_sort            | stable_partition         |
| find_first_of                                               | partial_sort_copy       | stable_sort              |
| find_if                                                     | partition               | swap_ranges              |
| find_if_not                                                 | partition_copy          | transform                |
| generate                                                    | remove                  | uninitialized_copy       |
| generate_n                                                  | remove_copy             | uninitialized_copy_n     |
| includes                                                    | remove_copy_if          | uninitialized_fill       |
| inner_product                                               | remove_if               | uninitialized_fill_n     |
| inplace_merge                                               | replace                 | unique                   |
| is_heap                                                     | replace_copy            | unique_copy              |

**Пример**
### C++14
```c++
std::for_each(first, last,
    [](auto & x){ process(x); }
);
std::copy(first, last, output);
std::sort(first, last);
std::transform(xfirst, xlast, yfirst,
    [=](double xi, double yi){ return a * xi + yi; }
);
```
### C++17
```c++
std::for_each(std::execution::par, first, last,
    [](auto & x){ process(x); }
);
std::copy(std::execution::par, first, last, output);
std::sort(std::execution::par, first, last);
std::transform(std::execution::par_unseq, xfirst, xlast, yfirst,
    [=](double xi, double yi){ return a * xi + yi; }
);
```
## Политика выполнения

| std::execution::seq       | неопределенно упорядоченный в вызывающем потоке                                                                             |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| std::execution::par       | несколько потоков - вызовы выполняются в неопределенной последовательности относительно друг друга в пределах одного потока |
| std::execution::par_unseq | несколько потоков и могут быть векторизованы - вызовы не упорядочены по отношению друг к другу и, возможно, чередуются      |
# Концепции TS

Крупнейшее дополнение к C++ со времен sliced bread.
Теперь доступно в последней версии gcc.
В двух словах
### C++14
```c++
//
// T must be a Random Access Iterator
// otherwise you will either get the wrong answer,
// or, most likely, terrible compiler errors
//
template <typename T>
auto binarySearch(T first, T second)
{
   //...
}
```
### Concepts TS
```c++
template <RandomAccessIterator T>
auto binarySearch(T first, T second)
{
   //...
}
```
