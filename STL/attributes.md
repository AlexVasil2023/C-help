
[[#Аттрибуты|Аттрибуты]]
1. [[#Атрибуты C++11|Атрибуты C++11]]
2. [[#Аттрибут no_unique_address|Аттрибут no_unique_address]]
	1. [[#C++17]]
	2. [[#C++20]]
3. [[#Аттрибут likely and unlikely]]
	1. [[#C++17]]
	2. [[#C++20]]
4. [[#Аттрибут fallthrough]]
	1. [[#C++14]]
	2. [[#C++17]]
5. [[#Аттрибут nodiscard]]
	1. [[#C++17]]
	2. [[#C++14]]
6. [[#Аттрибут maybe_unused]]
	1. [[#C++14]]
	2. [[#C++17]]


# Аттрибуты
#Аттрибуты



# Атрибуты C++11
Атрибуты создают универсальный синтаксис над **`__attribute__(...)`**, **`__declspec`** и т. п.
```c++
// `noreturn` атрибут указывает, что' f` не возвращается
[[ noreturn ]] void f() {
  throw "error";
}
```

# Аттрибут no_unique_address
Если элемент данных не обязательно должен иметь отдельный адрес, компилятор может оптимизировать его, чтобы он не занимал места.
Чтобы объект не занимал места, должны применяться следующие требования:
1. Объект пуст.  
	1. Объекты типа [[allocator|std::allocator]] фактически ничего не хранят (распределители без состояния) 
	2. Пустая структура / класс
2. Второй объект - это нестатический элемент данных из того же класса, который должен быть:  
    1. Другого типа или иметь другой адрес в памяти
### C++17
```c++
struct Empty {}; 
 
template < typename T, typename S >
struct Test {
    T t;
    S s;
};

int main() {

    static_assert(sizeof(Test< Empty,char >) >= sizeof(char) + 1); // 2
    static_assert(sizeof(Test< Empty,int >) >= sizeof(int) + 1);   // 8
}
```
### C++20
```c++
struct Empty {}; 
 
template < typename T, typename S >
struct Test {
    [[no_unique_address]] T t;
    [[no_unique_address]] S s;
};

int main() {
    // Different type of objects 
    static_assert(sizeof(Test< Empty,char >) == sizeof(char)); // 1
    static_assert(sizeof(Test< Empty,int >) == sizeof(int));   // 4

    // Same objects
    static_assert(sizeof(Test< Empty,Empty >) == 2);   
}
```
# Аттрибут likely and unlikely
Использование этих атрибутов помогает компилятору оптимизировать для случая, когда пути выполнения более или менее вероятны, чем любые альтернативные пути выполнения, которые не включают использование этих атрибутов.
### C++17
```c++
{
    const auto start = std::chrono::high_resolution_clock::now();
    for (int i = 1; i <= 9000; i++) {
        if (i % 5 == 0) {
            std::cout << i << " is div by 5" << std::endl;
        }
        else {
            continue;
        }
    }
    const std::chrono::duration diff = std::chrono::high_resolution_clock::now() - start;
    std::cout << "Time: " << diff.count() << " sec " << std::endl;
}
// When using a number < 9000, the attributes did not seem to have much of an impact
```
### C++20
```c++
{
    const auto start = std::chrono::high_resolution_clock::now();
    for (int i = 1; i <= 9000; i++) {
        if (i % 5 == 0) [[unlikely]] {
            std::cout << i << " is div by 5" << std::endl;
        }
        else [[likely]] {
            continue;
        }
    }
    const std::chrono::duration diff = 
			    std::chrono::high_resolution_clock::now() - start;
			    
    std::cout << "Time: " << diff.count() << " sec " << std::endl;
}
```
Оба атрибута необязательно использовать, достаточно использовать только один из **\[\[likely]]** или **\[\[unlikely]]**.
Они также могут использоваться в операторах **switch** .

```c++
bool enoughCoffee(int coffeeLeft) {
    switch(coffeeLeft){
        case 0: return false;
        [[likely]] case 1: return false;
    }
    return true;
}
```

# Аттрибут fallthrough
## C++14
```c++
switch (device.status())
{
case sleep:
   device.wake();
   // fall thru
case ready:
   device.run();
   break;
case bad:
   handle_error();
   break;
}
```
## C++17
```c++
switch (device.status())
{
case sleep:
   device.wake();
   [[fallthrough]];
case ready:
   device.run();
   break;
case bad:
   handle_error();
   break;
}
```
# Аттрибут nodiscard
В функциях:
```c++
struct SomeInts
{
   bool empty();
   void push_back(int);
   //etc
};

void random_fill(SomeInts & container,
      int min, int max, int count)
{
   container.empty(); // empty it first
   for (int num : gen_rand(min, max, count))
      container.push_back(num);
}
```
## C++17
```c++
struct SomeInts
{
   [[nodiscard]] bool empty();
   void push_back(int);
   //etc
};

void random_fill(SomeInts & container,
      int min, int max, int count)
{
   container.empty(); // empty it first
   for (int num : gen_rand(min, max, count))
      container.push_back(num);
}
```

В классах или структурах:
## C++14
```c++
struct MyError {
  std::string message;
  int code;
};

MyError divide(int a, int b) {
  if (b == 0) {
    return {"Division by zero", -1};
  }

  std::cout << (a / b) << '\n';

  return {};
}

divide(1, 2);
```
## C++17
```c++
struct [[nodiscard]] MyError {
  std::string message;
  int code;
};

MyError divide(int a, int b) {
  if (b == 0) {
    return {"Division by zero", -1};
  }

  std::cout << (a / b) << '\n';

  return {};
}

divide(1, 2);
```

Совет: используйте `[[nodiscard]]` **с осторожностью**. т.е. только тогда, когда действительно нет причин игнорировать это значение.

# Аттрибут maybe_unused
## C++14
```c++
bool res = step1();
assert(res);
step2();
etc();
```
## C++17
```c++
[[maybe_unused]] bool res = step1();
assert(res);
step2();
etc();
```
## C++17
```c++
[[maybe_unused]] void f()
{
  /*...*/
}

int main()
{
}
```








