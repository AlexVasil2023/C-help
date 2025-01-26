# explicit(логическое выражение) 
### C++17
```c++
struct MyInt
{
    int val = 0;

    // explicit if the int type coming in
    // is bigger than what we can hold.
    // eg explicit if you pass a long,
    //    implicit if you pass a short
    // TODO: handle unsigned...
    template <typename Init,
    std::enable_if_t<(sizeof(Init) > sizeof(int)), int> = 0>
    explicit MyInt(Init init)
        : val(static_cast<int>(init))
    {
    }
    
    template <typename Init,
    std::enable_if_t<(sizeof(Init) <= sizeof(int)), int> = 0>
    MyInt(Init init)
        : val(static_cast<int>(init))
    {
    }
};
```
### C++20
```c++
struct MyInt
{
    int val = 0;

    // explicit if the int type coming in
    // is bigger than what we can hold.
    // eg explicit if you pass a long,
    //    implicit if you pass a short
    // (TODO: check for unsigned...) 
    template <typename Init>
    explicit(sizeof(Init) > sizeof(int))
    MyInt(Init init)
        : val(static_cast<int>(init))
    {
    }
};
```
Это может быть полезно само по себе. Но интересным следствием является "явное (false)". Какой смысл в этом по сравнению с "эквивалентом" того, чтобы вообще не говорить "явное"? Явно говорится о неявном конструкторе. Например:
### Questionable C++
```c++
struct Foo
{
    Foo(Bar b);
};
```
### Better C++
```c++
struct Foo
{
    /* yes, implicit*/ Foo(Bar b);
};
```
### C++20
```c++
struct Foo
{
    explicit(false) Foo(Bar b);
};
```

В обзоре кода первого примера я бы, вероятно, спросил, должен ли конструктор быть явным - общее правило таково, что большинство конструкторов должно быть явным (это еще одно значение по умолчанию, которое C ++ ввел неправильно). (поскольку неявные преобразования часто приводят к ошибочным преобразованиям, что приводит к ошибкам), поэтому некоторые люди оставляют комментарии, чтобы было понятно. Но комментарии, которые просто объясняют синтаксис (а не _почему_), лучше делать в виде более понятного кода.
Использование `explicit(false)` показывает, что имплицитность была не случайным упущением, а реальным дизайнерским решением. (Возможно, вы все же захотите оставить комментарий о том, _почему_ это правильное дизайнерское решение.)








