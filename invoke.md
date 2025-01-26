# std::invoke C++17#

Вызывает `Callable` объект (**`std::function`** или **`std::bind`**) с параметрами.
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



