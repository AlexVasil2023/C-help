# dynamic_cast C++11 #

используется для преобразования указателей. Чаще всего можно обойтись без данного преобразования. Пример использования:
```C++
struct A {int value; };
struct B: A { void Print(){}; };
A* a = new B();
dynamic_cast<B*>(a)->Print();
```


