# clCreateKernel
#clCreateKernel

```c++
cl_kernel clCreateKernel (
		cl_program program ,
		const char *kernel_name ,
		cl_int *errcode_ret 
);
```

Здесь `program` — програмный объект с успешно построенным исполняемым кодом ядра, `kernel_name` — имя функции со спецификатором `__kernel`, `errcode_ret` — указатель на переменную для кода ошибки. В результате возвращается объект ядра, готовый для последующего запуска на рабочих единицах (work-item) соответствующего устройства.







