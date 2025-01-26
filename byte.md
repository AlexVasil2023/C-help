# byte C++17 #

std::byte - Это просто единичный байт, который предназначен для работы с хранилищем данных и обеспечивает стандартный способ представления данных в двоичном виде. В отличие от `char` или `unsigned char` доступны только побитовые операции.
```c++
std::byte a {0};
std::byte b {0xFF};

int i = std::to_integer<int>(b); // 0xFF

std::byte c = a & b;

int j = std::to_integer<int>(c); // 0
```

`std::byte` - это просто перечисление, инициализация через фигурные скобки возможна благодаря [[Прямая инициализация списка перечислений|прямой инициализации перечислений]].