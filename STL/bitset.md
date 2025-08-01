# bitset

Такие аспекты системы, как состояние входного потока, часто представляются в виде набора флагов, указывающих бинарные условия, такие как "хорошо/плохо", "истина/ложь" и "включено/выключено". C++ эффективно поддерживает понятие небольших наборов флагов с помощью [[Программы - STL#Область видимости и время жизни|побитовых операций над целыми числами]]. Класс `bitset<N>` обобщает это понятие, предоставляя операции с последовательностью из `N` бит `[0:N)`, где `N` известно во время компиляции. Для наборов битов, которые не помещаются в `long long int` (часто 64 бита), использовать `bitset` гораздо удобнее, чем использовать целые числа напрямую. Для небольших наборов `bitset` обычно оптимизируется. Если вы хотите присвоить битам имена, а не нумеровать их, вы можете [[map#std map|использовать set]] или [[enum|перечисление]].

`bitset` может быть инициализирован целым числом или строкой:
```c++
bitset<9> bs1 {"110001111"};
bitset<9> bs2 {0b1'1000'1111}; // binary literal using digit separators
```

Могут быть применены [[Программы - STL#Область видимости и время жизни|обычные побитовые операторы]] и операторы сдвига влево и вправо (`<<` и `>>`):
```c++
bitset<9> bs3 = ~bs1;        // complement: bs3=="001110000"
bitset<9> bs4 = bs1&bs3;     // all zeros
bitset<9> bs5 = bs1<<2;      // shift left: bs5 = "000111100"
```

Операторы сдвига (здесь, `<<`) “сдвигают” нули.

Операции `to_ullong()` и `to_string()` предоставляют конструкторам обратные операции.  Например, мы могли бы записать двоичное представление `int`:
```c++
void binary(int i)
{
	bitset<8*sizeof(int)> b = i;         // assume 8-bit byte
	cout << b.to_string() << '\n';       // write out the bits of i
}
```

Этот код выводит биты, представленные в виде `1` и `0`, слева направо, причем самый старший бит находится крайним слева, так что аргумент `123` даст на выходе:
```
00000000000000000000000001111011
```

В этом примере проще напрямую использовать оператор вывода `bitset`:
```c++
void binary2(int i)
{
	bitset<8*sizeof(int)> b = i;           // assume 8-bit byte
	cout << b << \'n';                     // write out the bits of i
}
```

`bitset` предлагает множество функций для использования наборов битов и манипулирования ими, таких как `all()`, `any()`, `none()`, `count()`, `flip()`.


