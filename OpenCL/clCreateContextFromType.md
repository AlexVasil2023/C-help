# clCreateContextFromType
#clCreateContextFromType

```c++
cl_context clCreateContextFromType (
		const cl_context_properties *properties ,
		cl_device_type device_type ,
		void (CL_CALLBACK *pfn_notify )(
				const char *errinfo ,
				const void *private_info , size_t cb ,
				void *user_data ),
		void *user_data ,
		cl_int *errcode_ret 
);
```










