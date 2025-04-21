#clGetPlatformIDs

```c++
cl_int clGetPlatformIDs(  
			cl_uint num_entries ,  
			cl_platform_id *platforms ,  
			cl_uint *num_platforms 
);
```

Часто она вызывается приложением дважды. Первый вызов использует лишь указатель `num_platforms` на переменную, куда возвращается количество обнаруженных платформ;  параметры `num_entries` и `platforms` при этом принимают «неопределённые» значения 0 и `NULL` соответственно.





