
[[#any|any]] 15.4.3 (STL)
[[#std any C++17|std::any C++17]]
[[#std any_of|std::any_of]]
[[#std any_cast|std::any_cast]]


# any

`any` может содержать произвольный тип и знать, какой тип (если таковой имеется) он содержит. По сути, это неограниченная версия [[variant|variant]]:
```c++
any compose_message(istream& s)
{
	string mess;

	// ... read from s and compose message ...

	if (no_problems)
		return mess;             // return a string
	else
		return error_number;     // return an int
}
```

Когда вы присваиваете или инициализируете `any` значением, он запоминает тип этого значения. Позже мы сможем извлечь значение, хранящееся в `any`, указав ожидаемый тип значения. Например:
```c++
auto m = compose_message(cin);
string& s = any_cast<string>(m);
cout << s;
```

Если мы попытаемся получить доступ к `any`, содержащему тип, отличный от ожидаемого, будет брошено исключение `bad_any_access`.

# std::any C++17

Предоставляет типобезопасный контейнер для единственного значения любого типа (при условии, что оно обладает конструктором при копировании). Можно проверить содержимое **std::any** и достать из него значение, использовав **[[any#std any_cast|std::any_cast]]**:
```c++
#include <experimental/any> 

using namespace std::experimental; 

std::vector<any> v { 1, 2.2, false, "hi!" }; 

auto& t = v[1].type(); // Что содержится в этом std::any? 

if (t == typeid(double)) 
	std::cout << "We have a double" << "\n"; 
else 
	std::cout << "We have a problem!" << "\n"; 

std::cout << any_cast<double>(v[1]) << std::endl;
```

Также можно применить **type()** при проверке содержимого, чтобы не получить исключение.

Можно воспользоваться членом `type()`, чтобы получить объект `type_info`, сообщающий, что содержится в `any`. Требуется точное соответствие между типами, в противном случае программа выбросит исключение `std::bad_any_cast`:

```c++
try {
  std::cout << any_cast<int>(v[1]) << std::endl;
} catch(std::bad_any_cast&) {
  std::cout << "wrong type" << std::endl;
}
```

Когда может пригодиться такой тип данных? Простой ответ – во всех случаях, когда можно было бы воспользоваться указателем `void*`, но в данном случае гарантируется типобезопасность. Например, вам могут понадобиться разные представления базового значения: допустим, представить '5' и в виде целого числа, и в виде строки. Подобные случаи распространены в интерпретируемых языках, но могут пригодиться и в случаях, когда требуется представление, которое не будет автоматически преобразовываться.

В то время как [[variant|std::variant<A,B,C>]] может содержать A, B или C, `std::any` может содержать (почти) все, что угодно!

### C++14

```c++
void * v = ...;

if (v != nullptr) {
   // hope and pray it is an int:
   int i = *reinterpret_cast<int*>(v);
}
```

### C++17

```c++
std::any v = ...;

if (v.has_value()) {
   // throws if not int
   int i = any_cast<int>(v);
}
```

### C++17

```c++
std::any v = ...;

if (v.type() == typeid(int)) {
   // definitely an int
   int i = any_cast<int>(v);
}
```

**Примечание**: `std::any` НЕ является шаблоном. Он может содержать любые типы и изменять тип во время выполнения.

### C++14

```c++
// can hold Circles, Squares, Triangles,...
std::vector<Shape *> shapes;
```

### C++17

```c++
// can hold Circles, Squares, Triangles, ints, strings,...
std::vector<any> things;
```

# std::any_of
#std_any_of




# std::any_cast
#std_any_cast






