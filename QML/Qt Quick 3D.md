# Qt Quick 3D

Модуль Qt Quick 3D позволяет использовать возможности QML в третьем измерении. С помощью Qt Quick 3D можно создавать трехмерные сцены и использовать привязки свойств, управление состояниями, анимацию и многое другое из QML для придания сцене интерактивности. Можно даже смешивать 2D- и 3D-содержимое для
создания смешанной среды.

Подобно тому, как Qt предоставляет абстракцию для 2D-графики, Qt Quick 3D опирается на слой абстракции для различных поддерживаемых API рендеринга. Для использования Qt Quick 3D рекомендуется применять платформу, поддерживающую хотя бы один из следующих API:
> - OpenGL 3.3+ (поддержка с версии 3.0)
> - OpenGL ES 3.0+ (ограниченная поддержка OpenGL ES 2) Direct3D 11.1
> - Вулкан 1.0+
> - Metal 1.2+


Qt Quick Software Adaption, т.е. стек рендеринга только для программного обеспечения, не поддерживает трехмерное содержимое.

В этой главе мы рассмотрим основы Qt Quick 3D, позволяющие создавать интерактивные 3D-сцены на основе встроенных сеток, а также активов, созданных с помощью внешних инструментов. Мы также рассмотрим анимацию и смешивание 2D- и 3D-содержимого.

## Основы

В этом разделе мы рассмотрим основы работы с Qt Quick 3D. Сюда входит работа со встроенными формами (сетками), использование освещения и трансформации в 3D.

### Базовая сцена

3D-сцена состоит из нескольких стандартных элементов:

 - ***View3D***, который является QML-элементом верхнего уровня, представляющим всю 3D-сцену.
 - ***SceneEnvironment***, управляет отрисовкой сцены, в том числе отрисовкой фона, или небесного поля.
 - ***PerspectiveCamera*** - камера в сцене. Также может быть `OrthographicCamera` или даже пользовательская камера с пользовательской матрицей проекции.

Кроме того, сцена обычно содержит экземпляры `Model`, представляющие объекты в трехмерном пространстве, и освещение.

Мы рассмотрим взаимодействие этих элементов, создав сцену, показанную ниже.

![[QML Scene.png]]

Прежде всего, в QML-коде устанавливается `View3D` в качестве основного элемента, заполняющего окно. Мы также импортируем модуль `QtQuick3D`.

Элемент `View3D` можно рассматривать как любой другой элемент Qt Quick, просто внутри него будет визуализироваться 3D-содержимое.

```c++
import QtQuick
import QtQuick3D

Window {
	width: 640
	height: 480
	visible: true
	title: qsTr("Basic Scene")
	
	View3D {
		anchors.fill: parent
		// ...
	}
}
```

Затем мы устанавливаем в `SceneEnvironment` сплошной цвет фона. Это делается внутри элемента `View3D`.

```c++
environment: SceneEnvironment {
	clearColor: "#222222"
	backgroundMode: SceneEnvironment.Color
}
```

`SceneEnvironment` может использоваться для управления множеством других параметров рендеринга, но сейчас мы используем его только для установки цвета сплошного фона.

Следующим шагом является добавление сетки в сцену. Сетка представляет собой объект в трехмерном пространстве. Каждая сетка создается с помощью QML-элемента `Model`.

Модель может быть использована для загрузки 3D-активов, но есть несколько встроенных сеток, позволяющих нам начать работу без привлечения сложностей управления 3D-активами. В приведенном ниже коде мы создаем `#Cone` и `#Sphere`.

Помимо формы сетки, мы позиционируем их в 3D-пространстве и снабжаем материалом с простым, диффузным базовым цветом. Подробнее о материалах мы поговорим в разделе "Материалы и освещение".

При позиционировании элементов в трехмерном пространстве координаты выражаются в виде `Qt.vector3d(x, y, z)`, где ось `x` управляет горизонтальным перемещением, `y` - вертикальным, а `z` - тем, насколько близко или далеко находится объект. 

По умолчанию положительное направление оси `x` - вправо, положительное
`y` - влево. направлена вверх, а положительная `z` - за пределы экрана. Я говорю "по
умолчанию", потому что это зависит от проекционной матрицы камеры.

```c++
Model {
	position: Qt.vector3d(0, 0, 0)
	scale: Qt.vector3d(1, 1.25, 1)
	source: "#Cone"
	materials: [ PrincipledMaterial { baseColor: "yellow"; } ]
}

Model {
	position: Qt.vector3d(80, 0, 50)
	source: "#Sphere"
	materials: [ PrincipledMaterial { baseColor: "green"; } ]
}
```

После того как в сцене появился свет, мы добавляем направленный свет (`DirectionalLight`) , который работает подобно солнцу. Он добавляет равномерный свет в заранее заданном направлении. Управление направлением осуществляется с помощью свойства `eulerRotation`, с помощью которого можно вращать направление света вокруг различных осей.

Установив свойство `castsShadow` в `true`, мы добиваемся того, чтобы свет создавал тени, как это видно на конусе, где видна тень от сферы.

```c++
DirectionalLight {
	eulerRotation.x: -20
	eulerRotation.y: 110
	castsShadow: true
}
```

Последний фрагмент головоломки - добавление камеры в сцену. Существуют различные камеры для различных перспектив, но для реалистичной проекции лучше всего использовать `ProjectionCamera`.

```c++
PerspectiveCamera {
	position: Qt.vector3d(0, 200, 300)
	Component.onCompleted: lookAt(Qt.vector3d(0, 0, 0))
}
```

![[QML Scene_2.png]]

источник света, например, `DirectionalLight`, и что-то, с помощью чего можно смотреть, например `PerspectiveCamera`.

### Встроенные сетки

В предыдущем примере мы использовали встроенные конус и сферу. Qt Quick 3D поставляется со следующими встроенными сетками:

> - `#Cube`
> - `#Cone`
> - `#Sphere`
> - `#Cylinder`
> - `#Rectangle`

Все они показаны на рисунке ниже. (Слева вверху: Куб, вверху справа: Конус, центр: Сфера, слева внизу: Цилиндр, внизу справа: Прямоугольник)

![[QML 3d.png]]

> Одна оговорка - прямоугольник `#Rectangle` является односторонним. Это означает, что он виден только с одного направления. Это означает, что свойство `eulerRotation` является важным.

При работе с реальными сценами сетки экспортируются из проекта и затем импортируется в сцену Qt Quick 3D. Более подробно мы рассмотрим это в разделе Работа с активами (/ch12- qtquick3d/assets.html)

### Светильники

Как и в случае с сетками, Qt Quick 3D поставляется с несколькими предопределенными источниками света. Они используются для освещения сцены различными способами.

Первый из них, **DirectionalLight** , должен быть знаком нам по предыдущему примеру. Он работает подобно солнцу и равномерно освещает сцену в заданном направлении. Если свойство `castsShadow` установлено в `true`, то свет будет отбрасывать тени, как показано на рисунке ниже. Это свойство доступно для всех источников света.

![[QML 3d_2.png]]

```c++
DirectionalLight {
	eulerRotation.x: 210
	eulerRotation.y: 20
	castsShadow: true
}
```

Следующим источником света является `PointLight`. Это свет, который излучается из заданной точки пространства и затем спадает в сторону темноты на основе значений свойств `constantFade`, `linearFade` и `quadraticFace`, где свет рассчитывается как 
```
constantFade + distance * (linearFade * 0.01) + distance^2 *
(quadraticFade * 0.0001)
```
По умолчанию используются значения 1.0 для постоянного и квадратичного затухания и 0.0 для линейного затухания, что означает, что свет спадает по закону обратного квадрата.

![[QML 3d_3.png]]

```c++
PointLight {
	позиция: Qt.vector3d(100, 100, 150)
	castsShadow: true
}
```

Последним из источников света является `SpotLight`, излучающий конус света в заданном направлении, подобно реальному прожектору. Конус состоит из внутреннего и внешнего конусов. Их ширина определяется параметрами `innerConeAngle` и `coneAngle`, задаваемыми в градусах от нуля до 180 градусов. Свет во внутреннем конусе ведет себя подобно `PointLight` и может управляться с помощью свойств `constantFade`, `linearFade` и `quadraticFace`. Кроме того, по мере приближения к внешнему конусу свет уменьшается в сторону темноты, что контролируется свойством `coneAngle`.

![[QML 3d_4.png]]

```c++
SpotLight {
	position: Qt.vector3d(50, 200, 50)
	eulerRotation.x: -90
	brightness: 5
	ambientColor: Qt.rgba(0.1, 0.1, 0.1, 1.0)
	castsShadow: true
}
```

В дополнение к свойству `castsShadow` все источники света имеют также широко используемые свойства `color` и `brightness`, которые управляют цветом и интенсивностью излучаемого света. У светильников также есть свойство `ambientColor`, определяющее базовый цвет, который будет применяться к материалам до того, как они будут освещены источником света. По умолчанию это свойство имеет значение `black`, но может быть использовано для создания базового освещения в сцене.

В приведенных примерах мы использовали только один источник света, но, конечно, можно объединить несколько источников света в одной сцене.

## Работа с активами

ри работе с 3D-сценами встроенные сетки быстро устаревают. Вместо этого необходим хороший поток из инструмента моделирования в QML. Qt Quick 3D поставляется с инструментом импорта активов `Balsam`, который используется для преобразования распространенных форматов активов в формат, удобный для Qt Quick 3D.

Цель `Balsam` - упростить работу с активами, созданными в таких распространенных инструментах, как `Blender` (https://www.blender.org/) , `Maya` или `3ds Max`, и использовать их из Qt Quick 3D. `Balsam` поддерживает следующие типы активов:
- COLLADA ( `*.dae`)
- FBX (` *.fbx`)
- GLTF2 (`*.gltf , *.glb`)
- STL (`*.stl`)
- Wavefront (`*.obj`)

Для некоторых форматов текстурные активы также могут быть экспортированы в формат, дружественный Qt Quick 3D, если Qt Quick 3D поддерживает данный актив.

### Блендер

Для создания актива, который мы можем импортировать, мы используем `Blender` для создания сцены с головой обезьяны. Затем мы экспортируем ее в файл `COLLADA` (https://en.wikipedia.org/wiki/COLLADA), чтобы затем преобразовать его в формат, удобный для Qt Quick 3D, с помощью `Balsam`. `Blender` доступен по адресу https://www.blender.org/. (https://www.blender.org/). 

Удалите исходный куб (выделите куб левой кнопкой мыши, нажмите `shift + x`, выберите `Delete`), добавьте сетку (с клавиатуры `shift + a`, выберите `Mesh`) и выберите для добавления обезьяну (выберите `Monkey` из списка доступных сеток). Существует ряд видеоуроков, демонстрирующих, как это сделать. Полученный пользовательский интерфейс `Blender` со сценой головы обезьяны показан ниже.

![[QML BLend.png]]

После того как голова установлена, перейдите в меню `Файл` -> `Экспорт` -> `КОЛЛАДА`.

![[QML BLend_2.png]]

В результате откроется диалог `Export COLLADA`, в котором можно экспортировать полученную сцену.

![[QML BLend_3.png]]

Как сцена из блендера, так и экспортированный файл `COLLADA`(`*.dae`) можно найти среди файлов примеров к этой главе.

### Бальзам

После сохранения файла `COLLADA` на диск мы можем подготовить его для использования в Qt Quick 3D с помощью инструмента `Balsam`. `Balsam` доступен как в виде инструмента командной строки, так и в виде графического интерфейса пользователя с помощью инструмента `balsamui`. Графический инструмент является лишь тонким слоем поверх инструмента командной строки, поэтому нет никакой разницы в том, что можно делать с помощью того или иного инструмента. 

Начнем с того, что добавим файл `monkey.dae` в раздел входных файлов и установим выходную папку по приемлемому пути. Скорее всего, ваши пути будут отличаться от тех, что показаны на скриншоте.

![[QML BLend_4.png]]

Вкладка `Настройки` в `balsamui` включает в себя все опции. Все они соответствуют опциям командной строки инструмента `balsam`. На данный момент мы оставим все эти параметры со значениями по умолчанию.

![[QML BLend_5.png]]

Теперь вернитесь на вкладку `Input` и нажмите кнопку `Convert`. В результате в разделе состояния пользовательского интерфейса появится следующий результат:

```
Converting 1 files...
[1/1] Successfully converted '/home/.../src/basicasset/monkey.d
Successfully converted all files!
```

Если вы запустили `balsamui` из командной строки, то там же вы увидите следующий вывод:

```
generated file: "/home/.../src/basicasset/Monkey.qml"
generated file: "/home/.../src/basicasset/meshes/suzanne.mesh"
```

Это означает, что `Balsam` сгенерировал файл `*.qml` и файл `*.mesh`.

## Трехмерные активы Qt Quick

Для использования файлов из проекта Qt Quick необходимо добавить их в проект. Это делается в файле CMakeLists.txt , в макросе `qt_add_qml_module`. Добавьте файлы в секции `QML_FILES` и `RESOURCES`, как показано ниже

```
qt_add_qml_module(appbasicasset
URI basicasset
VERSION 1.0
QML_FILES main.qml Monkey.qml
RESOURCES meshes/suzanne.mesh
)
```
Сделав это, мы можем заполнить View3D файлом `Monkey.qml`, как показано ниже

```c++
View3D {
	anchors.fill: parent
	
	environment: SceneEnvironment {
		clearColor: "#222222"
		backgroundMode: SceneEnvironment.Color
	}
	
	Monkey {}
}
```

`Monkey.qml` содержит всю сцену `Blender`, включая камеру и свет, поэтому в результате получается полная сцена, как показано ниже.

![[QML BLend_6.png]]

Заинтересованному читателю предлагается изучить файл `Monkey.qml`. Как вы увидите, он содержит совершенно обычную 3D-сцену Qt Quick, построенную из элементов, которые мы уже использовали в этой главе.

> Поскольку файл `Monkey.qml` генерируется программой, не следует изменять его вручную. В противном случае изменения будут перезаписаны при повторной генерации файла с помощью `Balsam`.

Альтернативой использованию всей сцены из `Blender` является использование файла `*.mesh` файл в трехмерной сцене Qt Quick. Это демонстрируется в приведенном
ниже коде.

Здесь мы помещаем `DirectionalLight` и `PerspectiveCamera` в View3D и объединяем их с сеткой с помощью элемента `Model`. Таким образом, мы можем управлять позиционированием, масштабом и освещением из QML. Мы также задаем другой, желтый, материал для головы обезьяны.

```c++
View3D {
	anchors.fill: parent
	
	environment: SceneEnvironment {
		clearColor: "#222222"
		backgroundMode: SceneEnvironment.Color
	}
		
	Model {
		source: "meshes/suzanne.mesh"
		scale: Qt.vector3d(2, 2, 2)
		eulerRotation.y: 30
		eulerRotation.x: -80
		materials: [ DefaultMaterial { diffuseColor: "yellow";
	}
	
	PerspectiveCamera {
		position: Qt.vector3d(0, 0, 15)
		Component.onCompleted: lookAt(Qt.vector3d(0, 0, 0))
	}
	
	DirectionalLight {
		eulerRotation.x: -20
		eulerRotation.y: 110
		castsShadow: true
	}
}
```

Полученный вид показан ниже

![[QML BLend_7.png]]

Здесь показано, как простая сетка может быть экспортирована из 3D-проекта инструмента, такого как `blender`, конвертируется в формат Qt Quick 3D и затем используется из QML. Следует помнить, что мы можем импортировать всю сцену как есть, т.е. используя `Monkey.qml`, или использовать только активы, например, `suzanne.mesh`. Таким образом, вы сами определяете компромисс между простым импортом сцены, и дополнительной сложности при одновременном повышении гибкости за счет настройки сцены в QML.

# Материалы и свет

До сих пор мы работали только с базовыми материалами. Для создания убедительной 3D-сцены необходимы соответствующие материалы и более совершенное освещение. Qt Quick 3D поддерживает ряд приемов для достижения этой цели, и в этом разделе мы рассмотрим некоторые из них.

## Встроенные материалы

Прежде всего, мы рассмотрим встроенные материалы. Qt Quick 3D поставляется с тремя типами материалов: `DefaultMaterial`, `PrincipledMaterial` и `CustomMaterial`. В этой главе мы рассмотрим два первых типа, в то время как последний позволяет создавать действительно пользовательские материалы, предоставляя собственные вершинные и фрагментные шейдеры. 

`DefaultMaterial` позволяет управлять внешним видом материала с помощью свойств `specular`, `roughness` и `diffuseColor`. `PrincipledMaterial` позволяет управлять внешним видом материала с помощью свойств `metalness`, `roughness` и `baseColor`.

Примеры двух типов материалов приведены ниже, при этом Слева - `PrincipledMaterial`, справа - `DefaultMaterial`.

![[QML BLend_8.png]]

Сравнивая две "Сюзанны", мы видим, как устроены оба материала. Для `DefaultMaterial` мы используем свойства `diffuseColor`, `specularTint` и `specularAmount`. Как вариации этих свойств влияют на внешний вид объектов, мы рассмотрим далее в этом разделе.

```c++
Model {
	source: "meshes/suzanne.mesh"
	position: Qt.vector3d(5, 4, 0)
	scale: Qt.vector3d(2, 2, 2)
	rotation: Quaternion.fromEulerAngles(Qt.vector3d(-80, 30, 0
	
	materials: [ DefaultMaterial {
		diffuseColor: "yellow";
		specularTint: "red";
		specularAmount: 0.7
	} ]
}
```

Для `PrincipledMaterial` мы настраиваем свойства `baseColor`, `metalness` и `roughness`. Как влияют изменения этих свойств на внешний вид, мы рассмотрим далее в этом разделе.

```c++
Model {
	source: "meshes/suzanne.mesh"
	position: Qt.vector3d(-5, 4, 0)
	scale: Qt.vector3d(2, 2, 2)
	rotation: Quaternion.fromEulerAngles(Qt.vector3d(-80, 30, 0
												 
	materials: [ PrincipledMaterial {
		baseColor: "yellow";
		metalness: 0.8
		roughness: 0.3
	} ]
}
```

## Свойства материала по умолчанию

На рисунке ниже показан материал по умолчанию с различными значениями для `specularAmount` и свойства `specularRoughness`.

![[QML BLend_9.png]]

Значение `specularAmount` варьируется от 0 ,8 (крайний слева) до 0 ,5 (в центре), до 0 ,2 (крайний справа). Значение `specularRoughness` изменяется от 0,0 (вверху), через 0,4 (в середине) до 0,8 (внизу). 

Ниже приведен код средней модели.

```c++
Model {
	source: "meshes/suzanne.mesh"
	position: Qt.vector3d(0, 0, 0)
	scale: Qt.vector3d(2, 2, 2)
	rotation: Quaternion.fromEulerAngles(Qt.vector3d(-80, 30, 0

	materials: [ DefaultMaterial {
		diffuseColor: "yellow";
		specularTint: "red";
		specularAmount: 0.5
		specularRoughness: 0.4
	} ]
}
```

## Принципиальные свойства материалов

На рисунке ниже показан принципиальный материал с различными значениями для свойства металличности и шероховатости.

![[QML BLend_10.png]]

Металличность варьируется от 0 ,8 (крайний левый), через 0 ,5 (центр) до 0,2 (крайний справа).  Шероховатость изменяется от 0 ,9 (вверху), через 0 ,6 (в середине) до 0 ,3 (внизу).

```c++
Model {
	source: "meshes/suzanne.mesh"
	position: Qt.vector3d(0, 0, 0)
	scale: Qt.vector3d(2, 2, 2)
	rotation: Quaternion.fromEulerAngles(Qt.vector3d(-80, 30, 0
	
	materials: [ PrincipledMaterial {
		baseColor: "yellow";
		metalness: 0.5
		roughness: 0.6
	} ]
}
```

## Освещение на основе изображений

Последняя деталь основного примера в этом разделе - скайбокс. В данном примере вместо одноцветного фона мы используем изображение в качестве `skybox`.

![[QML BLend_11.png]]

Чтобы создать скайбокс, присвойте свойству `LightProbe` среды `SceneEnvironment` текстуру, как показано в приведенном ниже коде. Это означает, что сцена получает свет на основе изображения, т.е. для освещения сцены используется скайбокс. Мы также настраиваем свойство `probeExposure`, которое используется для управления количеством света, проходящего через зонд, т.е. тем, насколько ярко будет освещена сцена. В этой сцене для окончательного освещения мы объединили зонд со светильником `DirectionalLight`.

```c++
environment: SceneEnvironment {
	clearColor: "#222222"
	backgroundMode: SceneEnvironment.SkyBox
	
	lightProbe: Texture {
		source: "maps/skybox.jpg"
	}
	
	probeExposure: 0.75
}
```

Кроме того, ориентация светового зонда может быть изменена с помощью вектора `probeOrientation`, а свойство `probeHorizon` может быть использовано для затемнения нижней половины окружения, имитируя, что свет идет сверху, т.е. с неба, а не со всех сторон.


