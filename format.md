# std::format
`std::format` это новый способ форматирования текста, который
- отделяет форматирование от вывода
- более типобезопасен
- позволяет изменять порядок
### C++17
```c++
std::printf("%d baskets of %s", n, desc);
//OR
std::cout << n << " baskets of " << desc;
```
### C++20
```c++
std::cout << std::format("{} baskets of {}", n, desc);
```

**Упорядочивание**

### whoops!
```c++
std::printf("%s! %d baskets left", n, desc);
```
### Apples! 5 baskets left
```c++
std::cout << std::format("{1}! {0} baskets left", n, desc);
```

# Форматирование
Подробное форматирование похоже на **printf**, но на самом деле основано на Python.
Общая форма такова
_fill-and-align sign `#` `0` width precision `L` type_
(каждая часть необязательна).
### format
```c++
std::string s;
// fill-and-align

s = std::format("{:6}",   123); //default
s = std::format("{:<6}",  123); //left
s = std::format("{:^6}",  123); //center
s = std::format("{:>6}",  123); //right

s = std::format("{:6}",  "abc"); //default
s = std::format("{:<6}", "abc"); //left
s = std::format("{:^6}", "abc"); //center
s = std::format("{:>6}", "abc"); //right

s = std::format("{:$^6}", "abc"); //fill with

// sign

s = std::format("{}",    123); //default
s = std::format("{}",   -123); //default

s = std::format("{:-}",  123); //same as def
s = std::format("{:-}", -123); //same as def

s = std::format("{:+}",  123); //always sign
s = std::format("{:+}", -123); //always sign

s = std::format("{: }",  123); //space if pos
s = std::format("{: }", -123); //space if pos
```
### result
```c++
// results...
// fill-and-align

assert(s == "   123"); // numbers >
assert(s == "123   ");
assert(s == " 123  "); // slightly <
assert(s == "   123");

assert(s == "abc   "); // strings <
assert(s == "abc   ");
assert(s == " abc  "); // slightly <
assert(s == "   abc");

assert(s == "$abc$$"); // fill with $

// sign

/* {} */ assert(s == "123");
/* {} */ assert(s == "-123");

/*{:-}*/ assert(s == "123");
/*{:-}*/ assert(s == "-123");

/*{:+}*/ assert(s == "+123");
/*{:+}*/ assert(s == "-123");

/*{: }*/ assert(s == " 123");
/*{: }*/ assert(s == "-123");
```
# Chrono
### C++20
```c++
std::cout << std::format("The time is {}", std::system_clock::now());
```





