# QFile

`QFile` фактически является [[QObject|QObject]] , но в большинстве случаев он создается на стеке. `QFile` содержит сигналы, информирующие пользователя о том, когда данные могут быть прочитаны. Это позволяет читать фрагменты данных асинхронно, пока не будет прочитан весь файл. Для удобства, также позволяет читать данные в блокирующем режиме. Это следует использовать только для небольших объемов данных, а не для больших файлов. К счастью, в этих примерах мы используем только небольшие объемы данных. 

Помимо чтения исходных данных из файла в массив [[QByteArray|QByteArray]] можно также читать типы данных с помощью [[QDataStream|QDataStream]] и строки `Unicode` с помощью [[QTextStream|QTextStream]] . 

```c++
QStringList data({"a", "b", "c"});
{ // запись бинарных файлов
	QFile file("out.bin");
	
	if(file.open(QIODevice::WriteOnly)) {
		QDataStream stream(&file); 
		stream << data;
	}
}

{ // чтение бинарного файла
	QFile file("out.bin");
	
	if(file.open(QIODevice::ReadOnly)) {
		QDataStream stream(&file);
		QStringList data2;
		stream >> data2;
		
		QCOMPARE(data, data2);
	}
}

{ // запись текстового файла
	QFile file("out.txt");
	
	if(file.open(QIODevice::WriteOnly)) {
		QTextStream stream(&file);
		QString sdata = data.join(",");
		stream << sdata;
	}
}

{ // чтение текстового файла
	QFile file("out.txt");
	
	if(file.open(QIODevice::ReadOnly)) {
		QTextStream stream(&file);
		QStringList data2;
		QString sdata;
		
		stream >> sdata;
		data2 = sdata.split(",");
		QCOMPARE(data, data2);
	}
}
```

















