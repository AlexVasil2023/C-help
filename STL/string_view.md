# std::string_view C++17#
#std_string_view

Ссылается на строку, но не владеет ей. Полезно для предоставления абстракции поверх строк (например, для синтаксического анализа).
```c++
// обычные строки
std::string_view cppstr{ "foo" };

// wide-строки
std::wstring_view wcstr_v{ L"baz" };

// массивы символов
char array[3] = {'b', 'a', 'r'};
std::string_view array_v(array, std::size(array));

std::string str{ "   trim me" };
std::string_view v{ str };
v.remove_prefix(std::min(v.find_first_not_of(" "), v.size()));
str; //  == "   trim me"
v; // == "trim me"
```

