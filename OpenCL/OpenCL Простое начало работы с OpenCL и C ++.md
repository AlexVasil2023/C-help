
[[#Простое начало работы с OpenCL и C ++|Простое начало работы с OpenCL и C ++]]

# Простое начало работы с OpenCL и C ++

Сначала вам нужно установить библиотеки OpenCL и другие файлы. У AMD есть приложение AMD APP для процессоров и графических процессоров: [http://developer.amd.com/tools-and-sdks/heterogeneous-computing/amd-accelerated-parallel-processing-app-sdk/downloads/](http://developer.amd.com/tools-and-sdks/heterogeneous-computing/amd-accelerated-parallel-processing-app-sdk/downloads/). У Intel есть библиотеки OpenCL по адресу [http://software.intel.com/en-us/vcsource/tools/opencl-sdk](http://software.intel.com/en-us/vcsource/tools/opencl-sdk). А у Nvidia есть всё необходимое на [https://developer.nvidia.com/cuda-downloads](https://developer.nvidia.com/cuda-downloads). В некоторых случаях графические драйверы уже содержат все необходимые файлы. Я рекомендую вам перейти к следующему шагу, а если что-то пойдёт не так, вернуться к этому шагу и установить необходимые наборы инструментов OpenCL SDK.  
 
Мы будем программировать на C++11. Чтобы упростить задачу, мы будем использовать привязку OpenCL C++ 1.1 с [www.khronos.org/registry/cl/api/1.1/cl.hpp](http://www.khronos.org/registry/cl/api/1.1/cl.hpp). Руководство по этой привязке доступно по адресу [www.khronos.org/registry/cl/specs/opencl-cplusplus-1.1.pdf](http://www.khronos.org/registry/cl/specs/opencl-cplusplus-1.1.pdf). Возможно, cl.hpp уже установлен на вашем компьютере. Если нет, просто скачайте привязку C++ в папку вашего проекта. Не забудьте включить C++11. В случае с QtCreator добавьте следующую строку в файл .pro:
```c++
QMAKE_CXXFLAGS += -std=c++0x
```

Также не забудьте использовать библиотеку OpenCL. В случае с QtCreator добавьте в файл .pro следующую строку:
```c++
LIBS+= -lOpenCL
```

Если вы получаете какие-либо ошибки, вам нужно настроить системную переменную, чтобы она указывала на папку с установкой OpenCL. Вы также можете вручную задать путь к библиотеке OpenCL:
```c++
LIBS+= -Lпуть_к_библиотекам_openCL
```

Или вы можете просто написать жестко запрограммированный путь к библиотеке OpenCL:
```c++
LIBS+=/usr/.../libOpenCL.so
```

Давайте начнем с программирования. Мы будем создавать простую консольную программу, которая будет использовать OpenCL для суммирования двух массивов типа `C = A + B`. Для oвашего простого примера нам понадобятся только два заголовка:
```c++
#include <iostream>
#include <CL/cl.hpp>
```

Все остальное будет происходить внутри основной функции. Для начала нам нужно получить доступ к одной из платформ OpenCL. По сути, это драйвер, который вы установили ранее. Таким образом, платформа может быть от Nvidia, Intel, AMD...
```c++
int main(){
    //get all platforms (drivers)
	std::vector<cl::Platform> all_platforms;
	cl::Platform::get(&all_platforms);
	
	if(all_platforms.size()==0){
		std::cout<<" No platforms found. Check OpenCL installation!\n"
					 << std::endl;
		exit(1);
	}
	
	cl::Platform default_platform=all_platforms[0];
	std::cout << "Using platform: "
				<<default_platform.getInfo<CL_PLATFORM_NAME>()<<"\n"
				<< std::endl;
```

Как только мы выберем первую платформу (**default_platform**), мы будем использовать ее на следующих этапах. Теперь нам нужно получить устройство нашей платформы. Например, платформа AMD поддерживает несколько устройств (процессоров и графических процессоров). Теперь мы выберем первое устройство (**default_device**):
```c++
//get default device of the default platform
std::vector<cl::Device> all_devices;
default_platform.getDevices(CL_DEVICE_TYPE_ALL, &all_devices);

if(all_devices.size()==0){
	std::cout<<" No devices found. Check OpenCL installation!\n" 
				<< std::endl;
	exit(1);
}

cl::Device default_device=all_devices[0];

std::cout<< "Using device: "<<default_device.getInfo<CL_DEVICE_NAME>()
			<<"\n" << std::endl;
```

Теперь нам нужно создать контекст. Представьте, что контекст — это ссылка на наше устройство и платформу во время выполнения:
```c++
cl::Context context({default_device});
```

Далее нам нужно создать программу, которую мы хотим запустить на нашем устройстве:
```c++
cl::Program::Sources sources;
```

Актуальный исходный код нашей программы (**ядро**) находится там:
```c++
// ядро вычисляется для каждого C=A+B

std::string kernel_code=
	" void kernel simple_add(global const int* A, global const int* B, global int* C){ "
	" C[get_global_id(0)]=A[get_global_id(0)]+B[get_global_id(0)]; "
	" } ";
```

Этот код просто вычисляет `C = A + B`. Поскольку мы хотим, чтобы один поток вычислял сумму только одного элемента, мы используем `get_global_id(0)`. `get_global_id(0)` означает получение идентификатора текущего потока. Идентификаторы могут варьироваться от 0 до `get_global_size(0) - 1`. `get_global_size(0)` означает количество потоков. Что такое `0`? `0` означает первое измерение. OpenCL поддерживает выполнение ядер для `1D-`, `2D-` и `3D-`задач. Мы будем использовать `1D`-массив! Это означает `1D`-задачу.  
  
Далее нам нужно собрать исходные коды ядра. Мы также проверяем наличие ошибок при сборке:
```c++
sources.push_back({kernel_code.c_str(), kernel_code.length()});

cl::Program program(context,sources);
if(program.build({default_device})!=CL_SUCCESS){
	std::cout<<" Error building: "
			<<program.getBuildInfo<CL_PROGRAM_BUILD_LOG>(default_device)
			<<"\n" << std::endl;
	exit(1);
}
```

Для массивов `A`, `B`, `C` нам нужно выделить место на устройстве:
```c++
    // создание буферов на устройстве
    cl::Buffer buffer_A(context,CL_MEM_READ_WRITE,sizeof(int)*10);
    cl::Buffer buffer_B(context,CL_MEM_READ_WRITE,sizeof(int)*10);
    cl::Buffer buffer_C(context,CL_MEM_READ_WRITE,sizeof(int)*10);
```

Массивы будут содержать 10 элементов. Мы хотим вычислить сумму следующих массивов (`A, B`).
```c++
int A[] = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9};
int B[] = {0, 1, 2, 0, 1, 2, 0, 1, 2, 0};
```

Нам нужно скопировать массивы из `A` и `B` на устройство. Это означает, что мы будем копировать массивы с хоста на устройство. Сначала нам нужно создать очередь, в которую будут помещаться команды, которые мы будем отправлять на наше устройство:
```c++
// создание очереди, в которую будем отправлять команды для устройства.

cl::CommandQueue queue(context,default_device);
```

Теперь мы можем скопировать данные из массивов `A` и `B` в `buffer_A` и `buffer_B`, которые представляют собой память на устройстве:
```c++
// запись массивов A и B на в буферы на устройстве

queue.enqueueWriteBuffer(buffer_A,CL_TRUE,0,sizeof(int)*10,A);
queue.enqueueWriteBuffer(buffer_B,CL_TRUE,0,sizeof(int)*10,B);
```

Теперь мы можем запустить ядро, которое параллельно суммирует `A` и `B` и записывает результат в `C`. Мы делаем это с помощью `KernelFunctor`, который запускает ядро на устройстве. Взгляните на `simple_add` это название нашего ядра, которое мы написали ранее. Вы можете увидеть число `10`. Оно соответствует количеству потоков, которые мы хотим запустить (размер нашего массива равен `10`):
```c++
// создание ядра
cl::KernelFunctor simple_add(
					cl::Kernel(program,"simple_add"),
					queue,
					cl::NullRange,
					cl::NDRange(10),
					cl::NullRange
);

// запуск ядра на устройстве
simple_add(buffer_A, buffer_B, buffer_C);
```

===Альтернативный способ запуска ядра:===
```c++
cl_int vErr;
cl::Kernel kernel_add=cl::Kernel(program,"simple_add", &vErr);
if(vErr != CL_SUCCESS){
	std::cerr << "Failed KernelFunctor " << std::endl;
	exit(1);
}

kernel_add.setArg(0,buffer_A);
kernel_add.setArg(1,buffer_B);
kernel_add.setArg(2,buffer_C);

queue.enqueueNDRangeKernel(kernel_add,
							cl::NullRange,
							cl::NDRange(10),
							cl::NullRange
);
queue.finish();
```

В конце мы хотим вывести на печать содержимое памяти `C` на нашем устройстве. Сначала нам нужно передать данные с устройства в нашу программу (хост):
```c++
// расчет и вывод результата

int C[10];

//read result C from the device to array C
queue.enqueueReadBuffer(buffer_C, CL_TRUE, 0, sizeof(int)*10, C);

std::cout<<" result: \n";
for(int i=0;i<10;i++){
	std::cout<<C[i]<<" ";
}
```

