# std::function

`std::function` - шаблон стандартной библиотеки С++11 , который обобщает идею указателя на функцию. В то время как указатели на функции могут указывать только на функции, объект `std::function` может ссылаться на любой вызываемый объект, т.е. на все, что может быть вызвано как функция. Так же как при создании указателя на функцию вы должны указать тип функции, на которую указываете (т.е. сигнатуру функции, на которую хотите указать), вы должны указать тип функции, на которую будет ссылаться создаваемый объект `std::function`. Это делается с помощью параметра шаблона `std::function`. Например, для объявления объекта `std::function` с именем `func`, который может ссылаться на любой вызываемый объект, действующий так, как если бы ero сигнатура была
```c++
bool(const std::unique_ptr<Widget> &,       // Сигнатура C++11 для
     const std::unique_ptr<Widget>& )       // функции сравнения
                                            // std::unique_ptr<Widget>
```
следует написать следующее:
```c++
std::function<bool(const std::unique_ptr<Widqet>& ,
                   const std::unique_ptr<Widqet>&)> func;
```


