# std::forward C++11
Может принимать на вход lvalue или rvalue и возвращать их как есть, без изменений, включает cv-квалификацию:

> - `Т& &` становится `Т&`;
> - `Т& &&` становится `Т&`;
> - `Т&& &` становится `Т&`;
> - `T&& &&` становится `T&&`;

Определение `std:forward`:
```c++
template <typename T> 
T&& forward(typename remove_reference<T>::type& arg) { 
	return static_cast<T&&>(arg); 
}
```

Пример функции `wrapper`, которая просто пересылает другие `A` объекты в новый конструктор копирования или перемещения объекта `A`:
```c++
struct A {
  A() = default;
  A(const A& o) { std::cout << "copied" << std::endl; }
  A(A&& o) { std::cout << "moved" << std::endl; }
};

template <typename T>
A wrapper(T&& arg) {
  return A{ std::forward<T>(arg) };
}

wrapper(A{}); // moved
A a{};
wrapper(a); // copied
wrapper(std::move(a)); // moved
```

[[move#Азы std move и std forward|более детально см. тут]]



