
# clEnqueueNDRangeKernel
#clEnqueueNDRangeKernel

```c++
cl_int clEnqueueNDRangeKernel (
		cl_command_queue command_queue ,
		cl_kernel kernel ,
		cl_uint work_dim ,
		const size_t *global_work_offset ,
		const size_t *global_work_size ,
		const size_t *local_work_size ,
		cl_uint num_events_in_wait_list ,
		const cl_event *event_wait_list ,
		cl_event *event 
);
```
Минимально необходимыми здесь параметрами являются: очередь команд `command_queue`, объект ядра `kernel`, количество измерений `work_dim` рабочего размера и сам глобальный рабочий размер `global_work_size` с таким числом измерений. Поэтому довольно часто вызов этой функции выглядит примерно так (одномерный размер здесь выбран вполне произвольно):
```c++
size_t gsize[1] = { 1000000 };
err = clEnqueueNDRangeKernel(queue, krnl, 1, NULL, gsize, NULL, 0, NULL, NULL);
```




