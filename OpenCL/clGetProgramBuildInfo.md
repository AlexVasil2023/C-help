# clGetProgramBuildInfo
#clGetProgramBuildInfo

```c++
cl_int clGetProgramBuildInfo (
		cl_program program ,
		cl_device_id device ,
		cl_program_build_info prm_name ,
		size_t prm_value_size ,
		void *prm_value ,
		size_t *prm_value_size_ret 
);
```

Нужный тип информации для программного объекта `program` и устройства `device` задаётся значением параметра `prm_name` (`CL_PROGRAM_BUILD_STATUS`, `CL_PROGRAM_BUILD_OPTIONS` или `CL_PROGRAM_BUILD_LOG`), `prm_value` — указатель на участок памяти, куда возвращается информация, `prm_value_size` — размер информации в байтах, `prm_value_size_ret` — указатель на переменную, в которую помещается размер информации в байтах при запросе, когда `prm_value` равен `NULL`; если размер уже известен, параметр `prm_value_size_ret` может иметь значение `NULL`.


