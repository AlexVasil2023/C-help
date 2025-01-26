# std::apply C++17#

Вызывает объект класса Callable с кортежем аргументов.
```c++
auto add = [] (int x, int y) {
  return x + y;
};

std::apply(add, std::make_tuple( 1, 2 )); // == 3
```
