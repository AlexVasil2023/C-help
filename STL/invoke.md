
[[#std invoke|std::invoke]]
[[#std invoke_result|std::invoke_result]]
[[#std invoke C++17]]
[[Обобщенные библиотеки#Работа с функциями-членами и дополнительными аргументами|Шаблоны. Работа с функциями-членами и дополнительными аргументами]]
[[Обобщенные библиотеки#Оборачивание вызовов функций|Шаблоны. Оборачивание вызовов функций]]

# std::invoke
#std_invoke

# std::invoke_result
#std_invoke_result

# std::invoke C++17
#std_invoke

Вызывает `Callable` объект (**[[function|std::function]]** или **[[bind|std::bind]]**) с параметрами.
```c++
class Proxy {
    Callable c;
public:
    Proxy(Callable c): c(c) {}
    
    template <class... Args>
    decltype(auto) operator()(Args&&... args) {
        // ...
        return std::invoke(c, std::forward<Args>(args)...);
    }
};

auto add = [] (int x, int y) {
  return x + y;
};

Proxy<decltype(add)> p{ add };
p(1, 2); // == 3
```

# Шаблоны. Работа с функциями-членами и дополнительными аргументами

[[Обобщенные библиотеки#Работа с функциями-членами и дополнительными аргументами|см. тут]]

# Шаблоны. Оборачивание вызовов функций

[[Обобщенные библиотеки#Оборачивание вызовов функций|см. тут]]
