# std:: chrono C++11
Библиотека chrono содержит набор служебных функций и типов, которые имеют дело с длительностью, часами и временными точками.
```c++
std::chrono::time_point<std::chrono::steady_clock> start, end; 
start = std::chrono::steady_clock::now(); 
	// Некоторые вычисления... 
end = std::chrono::steady_clock::now(); 

std::chrono::duration<double> elapsed_seconds = end-start;
elapsed_seconds.count(); // t количество секунд с типом `double`
```

