
[[#inline|inline]]
[[#Шаблоны и inline|Шаблоны и inline]]


# inline
#inline




# noinline
#noinline



# always_inline
#always_inline






# Шаблоны и inline

Объявление функций встраиваемыми является распространенным способом улучшить время работы программы. Спецификатор [[#inline|inline]] задумывался как подсказка реализации о том, что встраивание тела функции в точку вызова предпочтительнее, чем механизм вызова обычной функции.

Однако реализация может игнорировать эту подсказку. Следовательно, единственным гарантированным эффектом от [[#inline|inline]] является возможность многократного определения функции в программе (обычно из-за того, что оно находится в заголовочном файле, который включается в нескольких местах).

Как и встраиваемые функции, шаблоны функций могут быть определены в нескольких единицах трансляции. Обычно это достигается путем размещения определения в заголовочном файле, который включается в несколько СРР-файлов.

Это, однако, не означает, что шаблоны функции используют встраивание по умолчанию. Это полностью зависит от компилятора и того, предпочтительнее ли встраивание тела шаблона функции в точку вызова, чем механизм вызова обычной функции. Возможно, это покажется удивительным, но компиляторы куда лучше, чем программисты, оценивают возможность встраивания, и выясняют, приведет оно к повышению производительности или нет. В результате точная стратегия компилятора в отношении к [[#inline|inline]] зависит от компилятора и даже от параметров компилятора, выбранных для конкретной компиляции.

Тем не менее, используя соответствующие средства наблюдения за производительностью программы, программист может иметь более полную информацию, чем компилятор, и поэтому может пожелать переопределить решение компилятора (например, при настройке программного обеспечения для конкретных платформ, таких как мобильные телефоны, или для особых входных данных). Иногда это возможно только с помощью специальных нестандартных атрибутов компилятора, например [[#noinline|noinline]] или [[#always_inline|always_inline]].

Стоит отметить, что полные специализации шаблонов функций в этом отношении действуют как обычные функции: их определение может появляться
лишь однократно, если только они не определены как [[#inline|inline]] (см. #раздел_16_3). Более подробный обзор этой темы представлен в #приложении_А, “Правило одного определения”.
