# For-циклы по коллекциям С++11

Синтаксический сахар для перебора элементов контейнера (range-based for).
```c++
std::array<int, 5> a{ 1, 2, 3, 4, 5 };

for (int& x : a) 
	x *= 2;
	
// a == { 2, 4, 6, 8, 10 }
```

Обратите внимание на разницу при использовании `int`, а не `int&`:
```c++
std::array<int, 5> a{ 1, 2, 3, 4, 5 };

for (int x : a) 
	x *= 2;
	
// a == { 1, 2, 3, 4, 5 }
```

# for основанный на диапазоне, с инициализацией

C++17 предоставил нам инструкции `if` с инициализаторами, такими как:
### C++17
```c++
{
   // обратите внимание на точку с запятой
   if (QVariant var = getAnswer();  var.isValid())
      use(var);
      
   more_code();
}
```

C++20 добавляет аналогичный `init` для операторов на основе диапазона `for`
### C++
```c++
{
   T thing = f();
   for (auto& x : thing.items()) {
      // Note: “for (auto& x : f().items())” is WRONG
      mutate(&x);
      log(x);
   }
}
```
### C++20
```c++
for (T thing = f();  auto& x : thing.items()) {
   mutate(&x);
   log(x);
}
```

Также помогает с "комбинированными" циклами **index-y** и **range-y**:
### c++
```c++
{
   std::size_t i = 0;
   for (const auto& x : foo()) {
      bar(x, i);
      ++i;
   }
}
```
### C++20
```c++
for (std::size_t i = 0;  const auto& x : foo()) {
   bar(x, i);
   ++i;
}
```

