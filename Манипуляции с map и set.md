# Манипуляции с map и set C++17

Перемещения элементов и слияние контейнеров без затрат на создание копий и выделение/освобождение памяти.
## Перемещение элементов из одного map в другой

```c++
std::map<int, string> src{ { 1, "one" }, { 2, "two" }, { 3, "buckle my shoe" } };
std::map<int, string> dst{ { 3, "three" } };

dst.insert(src.extract(src.find(1))); // Cheap remove and insert of { 1, "one" } from `src` to `dst`.

dst.insert(src.extract(2)); // Cheap remove and insert of { 2, "two" } from `src` to `dst`.

// dst == { { 1, "one" }, { 2, "two" }, { 3, "three" } };
```

## Вставка целого set

```c++
std::set<int> src{1, 3, 5};
std::set<int> dst{2, 4, 5};

dst.merge(src);

// src == { 5 }
// dst == { 1, 2, 3, 4, 5 }
```

## Вставка элементов без контейнера

```c++
auto elementFactory() {
  std::set<...> s;
  s.emplace(...);
  return s.extract(s.begin());
}

s2.insert(elementFactory());
```

## Изменение ключа элемента в map

```c++
std::map<int, string> m{ { 1, "one" }, { 2, "two" }, { 3, "three" } };
auto e = m.extract(2);
e.key() = 4;
m.insert(std::move(e));
// m == { { 1, "one" }, { 3, "three" }, { 4, "two" } }
```


