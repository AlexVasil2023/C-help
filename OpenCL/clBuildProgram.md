# clBuildProgram
#clBuildProgram

```c++
cl_int clBuildProgram (
		cl_program prog ,
		cl_uint num_devices ,
		const cl_device_id *device_list ,
		const char *options ,
		void (CL_CALLBACK *pfn_notify )(cl_program prog , void *udata ),
		void *udata 
);
```




