
# Использование enable_if<>

Мы можем использовать [[enable_if#enable_if|enable_if<>]] для решения нашей проблемы с шаблоном конструктора [[Семантика перемещения - Шаблоны специальных функций-членов|см. тут]].

Задача, которую мы должны решить, — это отключение объявления шаблонного конструктора
```c++
template<typename STR>
Person(STR&& n);
```

если переданный аргумент `STR` имеет правильный тип (является [[string|std::string]] или типом, преобразуемым в [[string|std::string]]).

Для этого мы воспользуемся еще одним стандартным свойством типа [[is_convertible#std is_convertible|std::is_convertible<FROM, ТО>]]. Начиная с С++17, соответствующее объявление имеет следующий вид:
```c++
template<typename STR, 
		typename = std::enable_if__t<
				std::is_convertible_v<STR, std::string>>>
Person(STR&& n) ;
```

Если тип `STR` может быть преобразован в тип [[string|std::string]], полное объявление раскрывается в
```c++
template<typename STR, typename = void>
Person(STR&& n);
```

Если тип `STR` не может быть преобразован в [[string|std::string]], весь шаблон функции игнорируется.

И вновь для ограничения с помощью шаблона псевдонима можно определить собственное имя:
```c++
template<typename Т>
using EnableifString = std::enable_if_t <
	std::is_convertible_v<T, std::string>>;
template<typename STR, typename = EnableifString<STR>>
Person(STR && n);
```

Таким образом, весь класс `Person` должен имеет следующий вид:






