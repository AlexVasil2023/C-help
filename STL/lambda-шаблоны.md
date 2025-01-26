# TL; DR
C++14 предоставил нам _общие лямбды,_ где `auto` использовался вместо фиксированного типа, превратив лямбду во что-то вроде шаблона. ie
```c++
auto inc = [](auto thing) { thing++; } // works on anything that can be incremented!
```
Но вы не могли бы делать кучу других шаблонных вещей, таких как `typename T`, а затем использовать `T` и т.д. Теперь вы можете.
## Бонус?
Является `[]<>(){}` допустимым синтаксисом? Не совсем. `<>` Не может быть пустым, по крайней мере пока. Некоторые из нас хотят сделать это допустимым ... каким-то образом :-)
## Примеры
Ограничьте использование лямбда-выражения только для работы с вектором. Помимо того, что это делает _намерение_ более понятным, ошибка компилятора слева (если вы не передаете вектор) будет намного хуже, чем справа.
### C++
```c++
template<typename T>
struct is_vector                 : std::false_type{};
template<typename T>
struct is_vector<std::vector<T>> : std::true_type{};

auto f = [](auto vector) {
   static_assert(is_vector<decltype(vector)>::value, "");
   //...
};
```
### C++20
```c++
auto f = []<typename T>(std::vector<T> vector) {
   //...
};
```
Использование _типов_ внутри универсального лямбда-выражения было сложным, подробным, раздражающим:
### C++
```c++
// luckily vector gives you a way to get its inner type,
// most templates don't!
auto f = [](auto vector) {
   using T = typename decltype(vector)::value_type;
   //...
};
```
### C++20
```c++
auto f = []<typename T>(std::vector<T> vector) {
   //...
};
```







