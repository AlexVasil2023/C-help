# Ключевое слово consteval
Функция, указанная с ключевым словом **consteval**, является непосредственной функцией, которая выполняется во время компиляции.  
Каждый вызов этой функции должен создавать константное выражение во время компиляции.
Эта непосредственная функция должна удовлетворять всем требованиям,  применимым к функциям **constexpr**.
### C++14 - constexpr function
```c++
// executes at compile-time or run-time
constexpr int squareNumX(int n) 
{
    return n * n;
}
```
### C++20 - consteval function
```c++
// executes at compile-time
consteval int squareNumV(int n) 
{
    return n * n;
}
```
Непосредственные функции (указанные с помощью **consteval**) не могут быть применены к:
- деструкторы
- функции, которые выделяют или освобождают
### C++14
```c++
{
    int x = 100;
    const int y = 100;  
    int a = squareNumX(x);
    constexpr int b = squareNumX(x); // ERROR
    int c = squareNumX(y);
    constexpr int d = squareNumX(y);
}
// Error when x is not a constant expression but b is
```
### C++20
```c++
{
    int x = 100;
    const int y = 100;
    int a = squareNumV(x);              // ERROR
    constexpr int b = squareNumV(x);    // ERROR
    int c = squareNumV(y);
    constexpr int d = squareNumV(y);  
}
// Error when the function argument (x) is not a constant expression 
```

# Ключевое слово constinit
Применяются к переменным со статической продолжительностью хранения или продолжительностью хранения в потоке.  
**Переменные constinit** инициализируются во время компиляции.
**constinit** не подразумевает константы, такие как [[const|const]] или [[constexpr|constexpr]].
### C++14 - constexpr
```c++
// static storage duration
constexpr int a = 100;  
int main() 
{
      ++a;                      // ERROR 
      constexpr auto b = 100;   
}
// Error since constexpr or const cannot be modifed 
// constexpr or const can be created locally
```
### C++20 - constinit
```c++
// static storage duration
constinit int a = 100;  
int main()
{  
      ++a; 
      constinit auto b = 100;  // ERROR
      // b has thread storage duration
      constinit thread_local auto b = 100;
}
// Error since constinit cannot be created locally
// constinit can be modified
```



