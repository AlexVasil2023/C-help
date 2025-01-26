# QHash

```c++
QHash<QString, int> hash({{"b",2},{"c",3},{"a",1}});
qDebug() << hash.keys(); // a,b,c - неупорядоченные
qDebug() << hash.values(); // 1,2,3 - неупорядоченные, но такие же, как ord

QVERIFY(hash["a"] == 1);
QVERIFY(hash.value("a") == 1);
QVERIFY(hash.contains("c") == true);

{ // JAVA итератор
	int sum =0;
	QHashIterator<QString, int> i(hash);
	
	while (i.hasNext()) {
		i.next();
		sum+= i.value();
		qDebug() << i.key() << " = " << i.value();
	}
	
	QVERIFY(sum == 6);
}

{ // STL итератор
	int sum = 0;
	QHash<QString, int>::const_iterator i = hash.constBegin();
	
	while (i != hash.constEnd()) {
		sum += i.value();
		qDebug() << i.key() << " = " << i.value();
		i++;
	}
	
	QVERIFY(sum == 6);
}

hash.insert("d", 4);
QVERIFY(hash.contains("d") == true);

hash.remove("d");
QVERIFY(hash.contains("d") == false);

{ // поиск хэша не удался
	QHash<QString, int>::const_iterator i = hash.find("e");
	QVERIFY(i == hash.end());
}

{ // успешный поиск хэша
	QHash<QString, int>::const_iterator i = hash.find("c");
	
	while (i != hash.end()) {
		qDebug() << i.value() << " = " << i.key();
		i++;
	}
}
```



















