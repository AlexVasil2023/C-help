
1. [[#Введение|Введение]] (14.1 - STL)
2. [[Представления - STL#Представления|Представления]] (14.2 - STL)
3. [[Генераторы - STL#Генераторы|Генераторы]]  (14.3 - STL)
4. [[Конвейеры - STL#Конвейеры|Конвейеры]] 14.4 (STL)
5. [[Concepts#Обзор концептов|Обзор концептов]] 14.5 (STL) 
	1. [[Concepts#Концепты типов|Концепты типов]] 14.5.1 (STL)
	2. [[Concepts#Концепты итераторов|Концепты итераторов]] 14.5.2 (STL)
	3. [[Concepts#Концепты диапазонов|Концепты диапазонов]] 14.5.3 (STL)

[[#range]]
[[#range_value_t]]
[[#equal_range|equal_range]]

# Введение

Стандартная библиотека предлагает алгоритмы как [[Концепты и обобщенное программирование - STL|ограниченные при помощи концептов]], так и без ограничений (для совместимости). Ограниченные ([[Concepts|концептами]]) версии находятся в `<ranges>` в пространстве имён `ranges`. Естественно, я предпочитаю версии, использующие [[Concepts|концепты]]. `range` - это обобщение последовательностей из C++98, определённых парами {[[begin|begin()]], [[end|end()]]}; диапазон определяет, что требуется для того, чтобы быть последовательностью элементов. `range` может быть определен с помощью:
>
> Пары итераторов {[[begin|begin()]], [[end|end()]]}
> 
> Пары `{begin, n}`, где `begin` это итератор, а `n` это количество элементов
> 
> Пары `{begin, pred}`, где `begin` это итератор, а `pred` это предикат; если `pred(p)` возвращает `true` для итератора `p`, когда мы достигли конца диапазона. Это позволяет нам иметь бесконечные диапазоны, которые генерируются “на лету” ( #§14_3).

Этот концепт `range` позволяет нам написать `sort(v)`, а не `sort(v.begin(), v.end())`, как мы привыкли использовать STL с 1994 года. Мы можем сделать то же самое для наших собственных алгоритмов:
```c++
template<forward_range R>
requires sortable<iterator_t<R>>
void my_sort(R& r) // modern, concept-constrained version of my_sort
{
	return my_sort(r.begin(),end()); // use the 1994-style sort
}
```

Диапазоны позволяют нам более точно выразить примерно 99% распространенных применений алгоритмов. В дополнение к удобству записи, диапазоны предлагают некоторые возможности для оптимизации и устраняют класс “глупых ошибок”, таких как `sort(v1.begin(), v2.end())` и `sort(v.end(), v.begin())`. Да, такие ошибки были замечены “в дикой природе”.

Естественно, существуют различные типы диапазонов, соответствующие различным типам итераторов. В частности, [[#input_range|input_range]], [[#forward_range|forward_range]], [[#bidirectional_range|bidirectional_range]], [[#random_access_range|random_access_range]] и [[#contiguous_range|contiguous_range]] представлены как концепты ( #§14_5).

# Представления

[[Представления - STL#Представления|см. Представления]]

# Генераторы

[[Генераторы - STL#Генераторы|см. Генераторы]] 

# Конвейеры

[[Конвейеры - STL#Конвейеры|см. Конвейеры]]

# Обзор концептов

[[Concepts#Обзор концептов| см. Обзор концептов]] 

## Концепты типов

[[Concepts#Концепты типов|см. Концепты типов]] 

## Концепты итераторов

[[Concepts#Концепты итераторов|см. Концепты итераторов]]

## Концепты диапазонов
[[Concepts#Концепты диапазонов|см. Концепты диапазонов]]

# range
#range

# range_value_t
#range_value_t


# equal_range
#equal_range


# input_range
#input_range


# forward_range
#forward_range


# bidirectional_range
#bidirectional_range


# random_access_range
#random_access_range


# contiguous_range
#contiguous_range

