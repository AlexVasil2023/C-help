# clCreateProgramWithSource
#clCreateProgramWithSource()

```c++
cl_program clCreateProgramWithSource (
		cl_context context ,
		cl_uint count ,
		const char **strings ,
		const size_t *lengths ,
		cl_int *errcode_ret 
);
```

Здесь `context` — контекст, `strings` — массив указателей на символьные строки (в количестве `count` ), которые могут быть как завершены нулевым символом, так и не использовать его; если «завершителя» у строк нет, их длина должна быть указана в массиве длин `lengths` . Возможные ошибочные ситуации при вызове фиксируются в переменной типа `cl_int`, указатель на которую передаётся через последний параметр `errcode_ret`.

Результатом вызова будет программный объект типа `cl_program`:



