### C++17
```c++
#include <vector>
#include <list>
#include <algorithm>

template <typename Container>
void sort(Container & c)
{
    std::sort(c.begin(), c.end());
}

void test()
{
    std::list ls = {3, 2, 1, 5, 4};
    sortContainer(ls);
}
```
### C++20
```c++
#include <vector>
#include <list>
#include <algorithm>
#include <ranges>

void sort(std::ranges::random_access_range auto & c)
{
    std::sort(c.begin(), c.end());
}

void test()
{
    std::list  ls = { 1, 2, 3, 4, 5, 6 };
    sortContainer(ls);
}
```

