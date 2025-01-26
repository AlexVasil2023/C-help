# std::tie C++11
#std_tie

Создает кортеж lvalue-элементов. Полезно для распаковки объектов `std::pair` и `std::tuple`.
```c++
std::string playerName; 

std::tie(std::ignore, playerName, std::ignore) = std::make_tuple(91, "John Tavares", "NYI"); 

std::string yes, no; 

std::tie(yes, no) = std::make_pair("yes", "no");
```
