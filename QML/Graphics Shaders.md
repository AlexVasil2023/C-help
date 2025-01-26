# Graphics Shaders
Для отрисовки графики используется конвейер рендеринга, разбитый на этапы. Существует несколько API для управления рендерингом графики. Qt поддерживает `OpenGL`, `Metal`, `Vulcan` и `Direct3D`. Рассматривая упрощенный конвейер `OpenGL`, мы можем заметить вершинный и фрагментный шейдеры. Эти понятия существуют и для
всех остальных конвейеров рендеринга.

![[QML shaders.png]]

В конвейере вершинный шейдер получает вершинные данные, т.е. расположение углов каждого элемента, составляющего сцену, и вычисляет `gl_Position`. Это означает, что вершинный шейдер может перемещать графические элементы. На следующем этапе вершины обрезаются, трансформируются и растеризуются для вывода пикселей. Затем пиксели, также известные как фрагменты, пропускаются через фрагментный шейдер, который вычисляет цвет каждого пикселя. Полученный цвет возвращается через переменную `gl_FragColor`.

Вкратце: вершинный шейдер вызывается для каждой угловой точки многоугольника (vertex = point in 3D) и отвечает за любые 3D-манипуляции с этими точками. Фрагментный шейдер (fragment = pixel) вызывается для каждого пикселя и определяет цвет этого пикселя.

Поскольку Qt не зависит от базового API рендеринга, то для написания шейдеров Qt полагается на стандартный язык. Инструменты Qt Shader Tools опираются на Vulcan-совместимый GLSL. Более подробно мы рассмотрим это в примерах данной главы.

## Shader Elements

Для программирования шейдеров Qt Quick предоставляет два элемента. `ShaderEffectSource` и `ShaderEffect`. Эффект шейдера применяет пользовательские шейдеры, а источник эффекта шейдера преобразует QML-элемент в текстуру и отображает ее. Эффект шейдера может применять пользовательские шейдеры к прямоугольной форме и использовать источники для работы шейдера. Источником может быть изображение, которое используется в качестве текстуры или источника шейдерного эффекта. 

Шейдер по умолчанию использует исходный текст и отображает его без изменений. Ниже мы впервые видим QML-файл с двумя элементами `ShaderEffect` . Один из них не содержит никаких шейдеров, а другой явно указывает на вершинные и фрагментные шейдеры по умолчанию. Шейдеры мы рассмотрим в ближайшее время.

```c++
import QtQuick

Rectangle {
	width: 480; height: 240
	color: '#1e1e1e'
	
	Row {
		anchors.centerIn: parent
		spacing: 20
		
		Image {
			id: sourceImage
			width: 80; height: width
			source: '../assets/tulips.jpg'
		}
		
		ShaderEffect {
			id: effect
			width: 80; height: width
			property variant source: sourceImage
		}
		
		ShaderEffect {
			id: effect2
			width: 80; height: width
			property variant source: sourceImage
			vertexShader: "default.vert.qsb"
			fragmentShader: "default.frag.qsb"
		}
	}
}
```

![[QML shaders_2.png]]

В приведенном примере мы имеем ряд из 3 изображений. Первое - реальное изображение. Второе отрисовано с использованием шейдера по умолчанию, а третье - с использованием кода шейдера для фрагмента и вершины, как показано ниже. Давайте посмотрим на шейдеры.

Вершинный шейдер принимает текстурную координату, `qt_MultiTexCoord0` , и передает ее в переменную `qt_TexCoord0`. Он также принимает позицию `qt_Vertex`, умножает ее на матрицу трансформации Qt, `ubuf.qt_Matrix`, и возвращает через переменную `gl_Position`. При этом положение текстуры и вершины на экране остается неизменным.

```c++
layout(location=0) in vec4 qt_Vertex;
layout(location=1) in vec2 qt_MultiTexCoord0;
layout(location=0) out vec2 qt_TexCoord0;

layout(std140, binding=0) uniform buf {
	mat4 qt_Matrix;
	float qt_Opacity;
} ubuf;

out gl_PerVertex {
	vec4 gl_Position;
};

void main() {
	qt_TexCoord0 = qt_MultiTexCoord0;
	gl_Position = ubuf.qt_Matrix * qt_Vertex;
}
```

Фрагментный шейдер берет текстуру из исходного 2D-сэмплера, т.е. текстуру, по координате `qt_TexCoord0` и умножает ее на непрозрачность `Qt`, `ubuf.qt_Opacity`, чтобы вычислить `fragColor` - цвет, который будет использоваться для пикселя.

```c++
#version 440

layout(location=0) in vec2 qt_TexCoord0;
layout(location=0) out vec4 fragColor;

layout(std140, binding=0) uniform buf {
	mat4 qt_Matrix;
	float qt_Opacity;
} ubuf;

layout(binding=1) uniform sampler2D source;

void main() {
	fragColor = texture(source, qt_TexCoord0) * ubuf.qt_Opacity
}
```

Обратите внимание, что эти два шейдера могут послужить шаблоном для ваших собственных шейдеров. Переменные, расположение и привязка - это то, что ожидает Qt. Более подробно об этом можно прочитать в документации по шейдерным эффектам (https://doc-snapshots.qt.io/qt6-6.2/qml-qtquick-shadereffect.html#details) .

Прежде чем мы сможем использовать шейдеры, их необходимо запечь. Если шейдеры являются частью большого проекта Qt и включены в качестве ресурсов, это можно автоматизировать. Однако при работе с шейдерами и qml-файлом необходимо явно запекать их вручную. Для этого используются следующие две команды:

```c++
qsb --glsl 100es,120,150 --hlsl 50 --msl 12 -o default.frag.
qsb --glsl 100es,120,150 --hlsl 50 --msl 12 -b -o default.vert.
```

Инструмент `qsb` находится в каталоге bin вашей инсталляции Qt 6.

## Fragment Shaders

Фрагментный шейдер вызывается для каждого пикселя, подлежащего рендерингу. В этой главе мы разработаем небольшую красную линзу, которая будет увеличивать значение красного цветового канала источника.

### Setting up the scene

Сначала мы устанавливаем сцену, в поле которой центрируется сетка и выводится исходное изображение.

```c++
import QtQuick

Rectangle {
	width: 480; height: 240
	color: '#1e1e1e'
	
	Grid {
		anchors.centerIn: parent
		spacing: 20
		rows: 2; columns: 4
		
		Image {
			id: sourceImage
			width: 80; height: width
			source: '../../assets/tulips.jpg'
		}
	}
}
```

![[QML shaders_3.png]]

### A red shader
Далее добавим шейдер, который отображает красный прямоугольник, задавая для каждого фрагмента значение красного цвета.

```c++
#version 440

layout(location=0) in vec2 qt_TexCoord0;
layout(location=0) out vec4 fragColor;

layout(std140, binding=0) uniform buf {
	mat4 qt_Matrix;
	float qt_Opacity;
} ubuf;

layout(binding=1) uniform sampler2D source;

void main() {
	fragColor = vec4(1.0, 0.0, 0.0, 1.0) * ubuf.qt_Opacity;
}
```
В шейдере фрагмента мы просто присваиваем vec4(1.0, 0.0, 0.0,1.0) , представляющий собой красный цвет с полной непрозрачностью (alpha=1.0), фрагменту `fragColor` для каждого фрагмента, превращая каждый пиксель в сплошной красный.

![[QML shaders_4.png]]

### A red shader with texture
Теперь мы хотим применить красный цвет к каждому пикселю текстуры. Для этого нам нужно вернуть текстуру в вершинный шейдер. Поскольку в вершинном шейдере мы больше ничего не делаем, нам достаточно стандартного вершинного шейдера. Нам нужно только предоставить совместимый фрагментный шейдер.
```c++
#version 440
layout(location=0) in vec2 qt_TexCoord0;
layout(location=0) out vec4 fragColor;

layout(std140, binding=0) uniform buf {
	mat4 qt_Matrix;
	float qt_Opacity;
} ubuf;

layout(binding=1) uniform sampler2D source;

void main() {
	fragColor = texture(source, qt_TexCoord0) * vec4(1.0, 0.0,
}
```

Теперь полный шейдер содержит источник изображения в качестве свойства `variant`, а вершинный шейдер, который, если не указан, является вершинным шейдером по умолчанию, мы оставили без внимания.

В фрагментном шейдере мы выбираем текстуру `fragment` `texture(source, qt_TexCoord0)` и применяем к ней красный цвет.

![[QML shaders_5.png]]

### The red channel property

Не очень удобно жестко кодировать значение красного канала, поэтому мы хотели бы управлять им со стороны QML. Для этого мы добавим свойство `redChannel` в наш шейдерный эффект, а также объявим `float redChannel` внутри равномерного буфера фрагментного шейдера. Это все, что нам нужно сделать, чтобы значение со стороны QML стало доступно коду шейдера.

> Обратите внимание, что `redChannel` должен идти после неявных `qt_Matrix` и `qt_Opacity` в однородном буфере `ubuf`. Порядок следования параметров после параметров qt зависит от вас, но `qt_Matrix` и `qt_Opacity` должны идти первыми и именно в таком порядке.

```c++
#version 440
layout(location=0) in vec2 qt_TexCoord0;
layout(location=0) out vec4 fragColor;

layout(std140, binding=0) uniform buf {
	mat4 qt_Matrix;
	float qt_Opacity;
	float redChannel;
} ubuf;

layout(binding=1) uniform sampler2D source;

void main() {
	fragColor = texture(source, qt_TexCoord0) * vec4(ubuf.redCh
}
```

Чтобы линза действительно стала линзой, мы изменим `vec4 color` на `vec4(redChannel, 1.0, 1.0, 1.0)`, чтобы остальные цвета умножались на 1.0, а только красная часть умножалась на нашу переменную `redChannel`.

![[QML shaders_6.png]]

### The red channel animated
Поскольку свойство `redChannel` является обычным свойством, оно также может быть анимировано, как и все свойства в QML. Таким образом, мы можем использовать свойства QML для анимирования значений на GPU для воздействия на шейдеры. 

```c++
ShaderEffect {
	id: effect4
	width: 80; height: width
	property variant source: sourceImage
	property real redChannel: 0.3
	
	visible: root.step>3
	
	NumberAnimation on redChannel {
		from: 0.0; to: 1.0; loops: Animation.Infinite; duration
	}
	
	fragmentShader: "red3.frag.qsb"
}
```

Вот окончательный результат.

![[QML shaders_7.png]]

Эффект шейдера во втором ряду анимируется от 0,0 до 1,0 с длительностью 4 секунды. Таким образом, изображение переходит от отсутствия красной информации (0,0 красного) к нормальному изображению (1,0 красного).

### Выпечка

И снова нам необходимо запечь шейдеры. Это можно сделать следующими командами из командной строки:

```c++
qsb --glsl 100es,120,150 --hlsl 50 --msl 12 -o red1.frag.qsb re
qsb --glsl 100es,120,150 --hlsl 50 --msl 12 -o red2.frag.qsb re
qsb --glsl 100es,120,150 --hlsl 50 --msl 12 -o red3.frag.qsb re
```
## Волновой эффект

В этом более сложном примере мы создадим эффект волны с помощью фрагментного шейдера. Форма волны основана на синусоидальной кривой и влияет на текстурные координаты, используемые для цвета.

В файле qml определяются свойства и анимация.

```c++
import QtQuick 2.5

Rectangle {
	width: 480; height: 240
	color: '#1e1e1e'
	
	Row {
		anchors.centerIn: parent
		spacing: 20
		
		Image {
			id: sourceImage
			width: 160; height: width
			source: "../assets/coastline.jpg"
		}
		
		ShaderEffect {
			width: 160; height: width
			property variant source: sourceImage
			property real frequency: 8
			property real amplitude: 0.1
			property real time: 0.0
			
			NumberAnimation on time {
				from: 0; to: Math.PI*2; duration: 1000; loops:
			}
		
			fragmentShader: "wave.frag.qsb"
```

Фрагментный шейдер принимает свойства и вычисляет цвет каждого пикселя на основе этих свойств.

```c++
#version 440

layout(location=0) in vec2 qt_TexCoord0;
layout(location=0) out vec4 fragColor;

layout(std140, binding=0) uniform buf {
	mat4 qt_Matrix;
	float qt_Opacity;
	float frequency;
	float amplitude;
	float time;
} ubuf;

layout(binding=1) uniform sampler2D source;

void main() {
	vec2 pulse = sin(ubuf.time - ubuf.frequency * qt_TexCoord0)
	vec2 coord = qt_TexCoord0 + ubuf.amplitude * vec2(pulse.x,
	fragColor = texture(source, coord) * ubuf.qt_Opacity;
}
```

Расчет волны основан на импульсе и манипуляциях с координатами текстуры. Уравнение импульса дает нам синусоиду в зависимости от текущего времени и используемой координаты текстуры:

```c++
vec2 pulse = sin(ubuf.time - ubuf.frequency * qt_TexCoord0);
```

Без фактора времени мы имели бы просто искажение, но не перемещающееся искажение, каким являются волны.

Для цвета мы используем цвет в другой текстурной координате:

```c++
vec2 coord = qt_TexCoord0 + ubuf.amplitude * vec2(pulse.x, -pul
```

На текстурную координату влияет значение x нашего импульса. В результате получается движущаяся волна.

![[QML shaders_8.png]]

В данном примере мы используем фрагментный шейдер, то есть перемещаем пиксели внутри текстуры прямоугольного элемента. Если бы мы хотели, чтобы весь предмет перемещался в виде волны, нам пришлось бы использовать вершинный шейдер.

## Вершинный шейдер

Вершинный шейдер может использоваться для манипулирования вершинами, предоставляемыми шейдерным эффектом. В обычных случаях шейдерный эффект имеет 4 вершины (верхняя-левая, верхняя-правая, нижняя-левая и нижняя-правая). Каждая вершина имеет тип `vec4`. Для визуализации вершинного шейдера мы запрограммируем эффект джинна. Этот эффект используется для того, чтобы прямоугольная область окна исчезала в одной точке, подобно джинну, исчезающему в лампе.

![[QML Ver.png]]

### Настройка сцены

Сначала мы зададим сцену с изображением и шейдерным эффектом.

```c++
import QtQuick

Rectangle {
	width: 480; height: 240
	color: '#1e1e1e'

	Image {
		id: sourceImage
		width: 160; height: width
		source: "../../assets/lighthouse.jpg"
		visible: false
	}
	
	Rectangle {
		width: 160; height: width
		anchors.centerIn: parent
		color: '#333333'
	}
	
	ShaderEffect {
		id: genieEffect
		width: 160; height: width
		anchors.centerIn: parent
		property variant source: sourceImage
		property bool minimized: false
		
		MouseArea {
			anchors.fill: parent
			onClicked: genieEffect.minimized = !genieEffect.min
		}
	}
}
```
Здесь представлена сцена с темным фоном и шейдерным эффектом, использующим изображение в качестве исходной текстуры. Исходное изображение не видно на картинке, созданной нашим эффектом джинна. Дополнительно мы добавили темный прямоугольник на ту же геометрию, что и шейдерный эффект, чтобы можно было лучше определить, где нужно щелкнуть, чтобы вернуть эффект.

![[QML Ver_2.png]]

Эффект срабатывает при нажатии на изображение, которое определяется областью мыши, охватывающей эффект. В обработчике `onClicked` мы переключаем пользовательское булево свойство `minimized`. В дальнейшем мы будем использовать это свойство для переключения эффекта.

### Минимизация и нормализация

После настройки сцены мы определяем свойство типа `real` под названием `minimize`, которое будет содержать текущее значение нашей минимизации. Значение будет изменяться от 0,0 до 1,0 и управляться последовательной анимацией.

```c++
property real minimize: 0.0

SequentialAnimation on minimize {
	id: animMinimize
	running: genieEffect.minimized
	PauseAnimation { duration: 300 }
	NumberAnimation { to: 1; duration: 700; easing.type: Easing
	PauseAnimation { duration: 1000 }
}

SequentialAnimation on minimize {
	id: animNormalize
	running: !genieEffect.minimized
	NumberAnimation { to: 0; duration: 700; easing.type: Easing
	PauseAnimation { duration: 1300 }
}
```

Анимация запускается при переключении свойства `minimized`. Теперь, когда мы настроили все окружение, мы можем посмотреть на наш вершинный шейдер.

```c++
#version 440

layout(location=0) in vec4 qt_Vertex;
layout(location=1) in vec2 qt_MultiTexCoord0;
layout(location=0) out vec2 qt_TexCoord0;

layout(std140, binding=0) uniform buf {
	mat4 qt_Matrix;
	float qt_Opacity;
	float minimize;
	float width;
	float height;
} ubuf;

out gl_PerVertex {
	vec4 gl_Position;
};

void main() {
	qt_TexCoord0 = qt_MultiTexCoord0;
	vec4 pos = qt_Vertex;
	pos.y = mix(qt_Vertex.y, ubuf.height, ubuf.minimize);
	pos.x = mix(qt_Vertex.x, ubuf.width, ubuf.minimize);
	gl_Position = ubuf.qt_Matrix * pos;
}
```

Вершинный шейдер вызывается для каждой вершины, таким образом, в нашем случае четыре раза. По умолчанию в qt задаются такие параметры, как `qt_Matrix`, `qt_Vertex`, `qt_MultiTexCoord0`, `qt_TexCoord0`. Переменные мы уже обсуждали ранее. Дополнительно мы связываем переменные `minimize`, `width` и `height` из нашего шейдерного эффекта с кодом вершинного шейдера. В функции `main` мы сохраняем текущую текстурную координату в `qt_TexCoord0`, чтобы сделать ее доступной для фрагментного шейдера. Теперь мы копируем текущую позицию и изменяем положение `x` и `y` вершины:

```c++
vec4 pos = qt_Vertex;
pos.y = mix(qt_Vertex.y, ubuf.height, ubuf.minimize);
pos.x = mix(qt_Vertex.x, ubuf.width, ubuf.minimize);
```

Функция `mix(...)` обеспечивает линейную интерполяцию между первыми двумя параметрами в точке (0,0-1,0), заданной третьим параметром. Таким образом, в нашем случае мы интерполируем для `y` между текущим положением y и высотой на основе текущего минимизированного значения, аналогично для `x`. Следует помнить, что минимизированное значение анимируется нашей последовательной анимацией и перемещается от 0,0 к 1,0 (или наоборот).

![[QML Ver_3.png]]

Полученный эффект не совсем является эффектом джинна, но уже является большим шагом к нему.

### Примитивная гибка

Таким образом, мы минимизировали компоненты `x` и `y` наших вершин. Теперь мы хотели бы немного изменить манипуляцию с `x` и сделать ее зависимой от текущего значения `y`. Необходимые изменения довольно незначительны. Позиция `y` вычисляется, как и раньше. Интерполяция `x`-позиции теперь зависит от `y`-позиции вершины:
```c++
float t = pos.y/ubuf.height;
pos.x = mix(qt_Vertex.x, ubuf.width, t * minimize);
```

Это приводит к тому, что положение `x` стремится к ширине, когда положение `y` больше. Другими словами, две верхние вершины вообще не затрагиваются, так как их `y`-позиция равна 0, а `x`-позиции двух нижних вершин отклоняются в сторону ширины, поэтому они отклоняются в одну и ту же `x`-позицию.

![[QML Ver_4.png]]

### Улучшенный изгиб

Поскольку на данный момент изгиб не очень удовлетворяет, мы добавим несколько деталей для улучшения ситуации. Во-первых, мы улучшим нашу анимацию, чтобы она поддерживала собственное свойство сгибания. Это необходимо, поскольку изгиб должен происходить немедленно, а минимизация по `y` должна быть отложена на некоторое время. Обе анимации имеют в сумме одинаковую длительность (300+700+1000 и 700+1300).

Сначала мы добавим и анимируем изгиб из QML.

```c++
property real bend: 0.0
property bool minimized: false

// change to parallel animation
ParallelAnimation {
	id: animMinimize
	running: genieEffect.minimized
	
	SequentialAnimation {
		PauseAnimation { duration: 300 }

		NumberAnimation {
			target: genieEffect; property: 'minimize';
			to: 1; duration: 700;
			easing.type: Easing.InOutSine
		}
		
		PauseAnimation { duration: 1000 }
	}
	
	// adding bend animation
	SequentialAnimation {
		
		NumberAnimation {
			target: genieEffect; property: 'bend'
			to: 1; duration: 700;
			easing.type: Easing.InOutSine }
			PauseAnimation { duration: 1300 }
		}
	}
}
```

Затем мы добавляем изгиб в равномерный буфер, `ubuf`, и используем его в шейдере для достижения более плавного изгиба.

```c++
#version 440
layout(location=0) in vec4 qt_Vertex;
layout(location=1) in vec2 qt_MultiTexCoord0;
layout(location=0) out vec2 qt_TexCoord0;

layout(std140, binding=0) uniform buf {
	mat4 qt_Matrix;
	float qt_Opacity;
	float minimize;
	float width;
	float height;
	float bend;
} ubuf;

out gl_PerVertex {
	vec4 gl_Position;
};

void main() {
	qt_TexCoord0 = qt_MultiTexCoord0;
	vec4 pos = qt_Vertex;
	pos.y = mix(qt_Vertex.y, ubuf.height, ubuf.minimize);
	float t = pos.y / ubuf.height;
	t = (3.0 - 2.0 * t) * t * t;
	pos.x = mix(qt_Vertex.x, ubuf.width, t * ubuf.bend);
	gl_Position = ubuf.qt_Matrix * pos;
}
```

Кривая начинается плавно при значении 0,0, затем растет и плавно останавливается к значению 1,0. Здесь представлен график функции в указанном диапазоне. Для нас интерес представляет только диапазон от 0...1.

![[QML Ver_5.png]]

Теперь шейдерный эффект имеет равномерно распределенную сетку из 16x16 вершин вместо прежних 2x2 вершин. Благодаря этому интерполяция между вершинами выглядит гораздо более плавной.

![[QML Ver_6.png]]

Также видно влияние используемой кривой, так как изгиб хорошо сглаживается в конце. Именно здесь изгиб оказывает наиболее сильное влияние.

### Выбор сторон

В качестве последнего усовершенствования мы хотим иметь возможность переключения сторон. Сторона - это то, в какую сторону исчезает эффект джинна. До сих пор он исчезал всегда в направлении ширины. Добавив свойство `side`, мы сможем изменять точку между 0 и шириной.

```c++
ShaderEffect {
	...
	property real side: 0.5
	...
}

#version 440

layout(location=0) in vec4 qt_Vertex;
layout(location=1) in vec2 qt_MultiTexCoord0;
layout(location=0) out vec2 qt_TexCoord0;

layout(std140, binding=0) uniform buf {
	mat4 qt_Matrix;
	float qt_Opacity;
	float minimize;
	float width;
	float height;
	float bend;
	float side;
} ubuf;

out gl_PerVertex {
	vec4 gl_Position;
};

void main() {
	qt_TexCoord0 = qt_MultiTexCoord0;
	vec4 pos = qt_Vertex;
	pos.y = mix(qt_Vertex.y, ubuf.height, ubuf.minimize)
	
	float t = pos.y / ubuf.height;
	t = (3.0 - 2.0 * t) * t * t;
	
	pos.x = mix(qt_Vertex.x, ubuf.side * ubuf.width, t * ubuf.b
	
	gl_Position = ubuf.qt_Matrix * pos;;
```
![[QML Ver_7.png]]

### Упаковка
Последнее, что необходимо сделать, - это красиво упаковать наш эффект. Для этого мы извлекаем код эффекта джинна в собственный компонент под названием `GenieEffect`. В качестве корневого элемента он содержит шейдерный эффект. Мы удалили область мыши, поскольку она не должна находиться внутри компонента, так как срабатывание эффекта можно переключить с помощью свойства minimized 

```c++
// GenieEffect.qml
import QtQuick

ShaderEffect {
	id: genieEffect
	width: 160; height: width
	anchors.centerIn: parent
	property variant source
	
	mesh: GridMesh { resolution: Qt.size(10, 10) }
	
	property real minimize: 0.0
	property real bend: 0.0
	property bool minimized: false
	property real side: 1.0
	
	ParallelAnimation {
		id: animMinimize
		running: genieEffect.minimized
		
		SequentialAnimation {
			
			PauseAnimation { duration: 300 }
				
			NumberAnimation {
				target: genieEffect; property: 'minimize';
				to: 1; duration: 700;
				easing.type: Easing.InOutSine
			}
			
			PauseAnimation { duration: 1000 }
		}

		SequentialAnimation {
				
			NumberAnimation {
				target: genieEffect; property: 'bend'
				to: 1; duration: 700;
				easing.type: Easing.InOutSine 
			}
				
			PauseAnimation { duration: 1300 }
		}
	}
		
	ParallelAnimation {
		id: animNormalize
		running: !genieEffect.minimized
		
		SequentialAnimation {
			
			NumberAnimation {
				target: genieEffect; property: 'minimize';
				to: 0; duration: 700;
				easing.type: Easing.InOutSine
			}
			
			PauseAnimation { duration: 1300 }
		}
		
		SequentialAnimation {
			
			PauseAnimation { duration: 300 }

			NumberAnimation {
				target: genieEffect; property: 'bend'
				to: 0; duration: 700;
				easing.type: Easing.InOutSine 
			}
				
			PauseAnimation { duration: 1000 }
		}
	}
		
	vertexShader: "genieeffect.vert.qsb"
}
	
// genieeffect.vert
#version 440

layout(location=0) in vec4 qt_Vertex;
layout(location=1) in vec2 qt_MultiTexCoord0;
layout(location=0) out vec2 qt_TexCoord0;

layout(std140, binding=0) uniform buf {
	mat4 qt_Matrix;
	float qt_Opacity;
	float minimize;
	float width;
	float height;
	float bend;
	float side;
} ubuf;

out gl_PerVertex {
	vec4 gl_Position;
};

void main() {
	qt_TexCoord0 = qt_MultiTexCoord0;
	vec4 pos = qt_Vertex;
	pos.y = mix(qt_Vertex.y, ubuf.height, ubuf.minimize);
	float t = pos.y / ubuf.height;
	t = (3.0 - 2.0 * t) * t * t;
	pos.x = mix(qt_Vertex.x, ubuf.side * ubuf.width, t * ubuf.b
	gl_Position = ubuf.qt_Matrix * pos;
}
```

Теперь эффект можно использовать просто так:

```c++
import QtQuick

Rectangle {
width: 480; height: 240
color: '#1e1e1e'

	GenieEffect {
	
		source: Image { source: '../../assets/lighthouse.jpg' }
		
		MouseArea {
			anchors.fill: parent
			onClicked: parent.minimized = !parent.minimized
		}
	}
}
```

Мы упростили код, удалив фоновый прямоугольник, и присвоили изображение непосредственно эффекту, вместо того чтобы загружать его в отдельный элемент изображения.

## Эффект занавеса

В последнем примере для пользовательских шейдерных эффектов я хотел бы представить вам эффект занавеса. Впервые этот эффект был опубликован в мае 2011 года в рамках Qt labs for shader effects (http://labs.qt.nokia.com/2011/05/03/qml-shadereffectitem-on-qgraphicsview/) .

![[QML Ver_8.png]]

В то время мне очень нравились эти эффекты, и эффект занавеса был моим любимым из них. Мне просто нравится, как занавеска открывается и скрывает фоновый объект. В этой главе эффект был адаптирован для Qt 6. Кроме того, он был несколько упрощен, чтобы сделать его более наглядным. Изображение занавеса называется `fabric.png`. Затем эффект использует вершинный шейдер для раскачивания занавески вперед и назад и фрагментный шейдер для наложения теней, чтобы показать, как ткань складывается. На приведенной ниже схеме показана работа шейдера. Волны вычисляются через кривую `sin` с 7 периодами (`7*PI=21.99`...). Другой частью является качание. Верхняя ширина занавеса анимируется при открытии или закрытии занавеса. Нижняя ширина повторяет верхнюю ширину с помощью `SpringAnimation` . Это создает эффект свободного колебания нижней части занавеса. Вычисляемый компонент качания - это сила качания, основанная на `y`-компоненте вершин.

![[QML Ver_9.png]]

Эффект занавеса реализован в файле `CurtainEffect.qml`, где в качестве источника текстуры выступает изображение ткани. В коде QML свойство `mesh` настраивается таким образом, чтобы увеличить количество вершин для получения более гладкого результата.

```c++
import QtQuick

ShaderEffect {
	anchors.fill: parent
	
	mesh: GridMesh {
		resolution: Qt.size(50, 50)
	}
	
	property real topWidth: open?width:20
	property real bottomWidth: topWidth
	property real amplitude: 0.1
	property bool open: false
	property variant source: effectSource

	Behavior on bottomWidth {
		SpringAnimation {
			easing.type: Easing.OutElastic;
			velocity: 250; mass: 1.5;
			spring: 0.5; damping: 0.05
		}
	}
	
	Behavior on topWidth {
		NumberAnimation { duration: 1000 }
	}
	
	ShaderEffectSource {
		id: effectSource
		sourceItem: effectImage;
		hideSource: true
	}
	
	Image {
		id: effectImage
		anchors.fill: parent
		source: "../assets/fabric.png"
		fillMode: Image.Tile
	}
	
	vertexShader: "curtain.vert.qsb"
	fragmentShader: "curtain.frag.qsb"
}
```

Вершинный шейдер, показанный ниже, изменяет форму занавеса на основе свойств `topWidth` и `bottomWidth`, экстраполируя смещение на основе координаты `y`. Он также вычисляет значение тени , которое используется во фрагментном шейдере. Свойство `shade` передается через дополнительный вывод в месте 1.

```c++
#version 440
layout(location=0) in vec4 qt_Vertex;
layout(location=1) in vec2 qt_MultiTexCoord0;
layout(location=0) out vec2 qt_TexCoord0;
layout(location=1) out float shade;

layout(std140, binding=0) uniform buf {
	mat4 qt_Matrix;
	float qt_Opacity;
	float topWidth;
	float bottomWidth;
	float width;
	float height;
	float amplitude;
} ubuf;

out gl_PerVertex {
	vec4 gl_Position;
};

void main() {
	qt_TexCoord0 = qt_MultiTexCoord0;
	vec4 shift = vec4(0.0, 0.0, 0.0, 0.0);
	float swing = (ubuf.topWidth - ubuf.bottomWidth) * (qt_Vert
	shift.x = qt_Vertex.x * (ubuf.width - ubuf.topWidth + swing
	shade = sin(21.9911486 * qt_Vertex.x / ubuf.width);
	shift.y = ubuf.amplitude * (ubuf.width - ubuf.topWidth + sw
	gl_Position = ubuf.qt_Matrix * (qt_Vertex - shift);
	shade = 0.2 * (2.0 - shade) * ((ubuf.width - ubuf.topWidth
}
```

В приведенном ниже фрагментном шейдере тень берется в качестве входного сигнала в месте 1 и используется для вычисления `fragColor`, который применяется для отрисовки рассматриваемого пикселя.

```c++
#version 440
layout(location=0) in vec2 qt_TexCoord0;
layout(location=1) in float shade;
layout(location=0) out vec4 fragColor;

layout(std140, binding=0) uniform buf {
	mat4 qt_Matrix;
	float qt_Opacity;
	float topWidth;
	float bottomWidth;
	float width;
	float height;
	float amplitude;
} ubuf;

layout(binding=1) uniform sampler2D source;

void main() {
	highp vec4 color = texture(source, qt_TexCoord0);
	color.rgb *= 1.0 - shade;
	fragColor = color;
}
```

Сочетание QML-анимации и передачи переменных из вершинного шейдера во фрагментный шейдер демонстрирует, как QML и шейдеры могут использоваться вместе для создания сложных анимированных эффектов.

Сам эффект используется из файла `curtaindemo.qml`, показанного ниже.

```c++
import QtQuick
Item {
	id: root
	width: background.width; height: background.height
	
	Image {
		id: background
		anchors.centerIn: parent
		source: '../assets/background.png'
	}
	
	Text {
		anchors.centerIn: parent
		font.pixelSize: 48
		color: '#efefef'
		text: 'Qt 6 Book'
	}
	
	CurtainEffect {
		id: curtain
		anchors.fill: parent
	}
	
	MouseArea {
		anchors.fill: parent
		onClicked: curtain.open = !curtain.open
	}
}
```

Шторка открывается с помощью пользовательского свойства `open` для эффекта шторки. Мы используем область `MouseArea` для запуска открытия и закрытия завесы, когда пользователь щелкает или касается этой области.

















