# enum

В дополнение к классам, C++ поддерживает простую форму пользовательского типа, для которой мы можем перечислять значения:
```c++
enum class Color { red, blue, green };
enum class Traffic_light { green, yellow, red };

Color col = Color::red;
Traffic_light light = Traffic_light::red;
```

Обратите внимание, что перечислители (например, `red`) находятся в области видимости их `enum class`, так что их можно многократно использовать в разных `enum class` без путаницы. Например, `Color::red` - это `red` класса `Color`, который отличается от `Traffic_light::red`.

Перечисления используются для представления небольших наборов целочисленных значений. Перечисления нужны чтобы сделать код более читаемым и менее подверженным ошибкам, чем при использовании литералов, а не символических (и мнемонических) имён перечислителей.

`class` после `enum` указывает, что перечисление строго типизировано и что его перечислители ограничены пространством имён класса. Будучи отдельными типами, `enum class` помогают предотвратить случайное неправильное использование констант. В частности, мы не можем смешивать значения `Traffic_light` и `Color`:
```c++
Color x1 = red;                        // error: which red?
Color y2 = Traffic_light::red;         // error: that red is not a Color
Color z3 = Color::red;                 // OK
auto x4 = Color::red;                  // OK: Color::red is a Color
```

Аналогично, мы не можем неявно смешивать Color и целочисленные значения:
```c++
int i = Color::red;                     // error: Color::red is not an int
Color c = 2;                            // initialization error: 2 is not a Color
```

Перехват попыток преобразования в `enum` является хорошей защитой от ошибок, но часто мы хотим инициализировать `enum` значением из его базового типа (по умолчанию это `int`), так что это разрешено, как и явное преобразование из базового типа:
```c++
Color x = Color{5};              // OK, but verbose
Color y {6};                     // also OK
```

Аналогично, мы можем явно преобразовать значение `enum` в его базовый тип:
```c++
int x = int(Color::red);
```

По умолчанию в `enum class` определены присваивание, инициализация и сравнения (например, `==` и `<`; #§_1_4), и только они. Однако перечисление - это пользовательский тип, поэтому мы можем определить для него операторы ( #§6_4):
```c++
Traffic_light& operator++(Traffic_light& t)   // prefix increment: ++
{
	switch (t) {
		case Traffic_light::green: return t=Traffic_light::yellow;
		case Traffic_light::yellow: return t=Traffic_light::red;
		case Traffic_light::red: return t=Traffic_light::green;
	}
}

auto signal = Traffic_light::red;
Traffic_light next = ++signal;               // next becomes Traffic_light::green
```

Если повторение имени перечисления, `Traffic_light`, становится слишком утомительным, мы можем сократить его в области видимости:
```c++
Traffic_light& operator++(Traffic_light& t) // prefix increment: ++
{
	using enum Traffic_light; // here, we are using Traffic_light
	switch (t) {
		case green: return t=yellow;
		case yellow: return t=red;
		case red: return t=green;
	}
}
```

Если вы никогда не захотите явно указывать имена перечислителей и хотите, чтобы значения перечислителя были `int` (без необходимости явного преобразования), вы можете удалить `class` из `enum class`, чтобы получить “простое” перечисление `enum`. Перечислители из “простого” `enum` вводятся в ту же область видимости, что и имя их `enum`, и неявно преобразуются в их целочисленные значения. Например:
```c++
enum Color { red, green, blue };
int col = green;
```

Здесь `col` получает значение 1. По умолчанию целочисленные значения счетчиков начинаются с 0 и увеличиваются на единицу для каждого следующего перечислителя. “Простые” перечисления `enum` были в C++ (и C) с самых первых дней, поэтому, несмотря на то, что они ведут себя менее корректно, они распространены в текущем коде.

