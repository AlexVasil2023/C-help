# QMap

```c++
// QMap
QMap<QString, int> map({{"b",2},{"c",2},{"a",1}});
qDebug() << map.keys(); // a,b,c - в порядке возрастания

QVERIFY(map["a"] == 1);
QVERIFY(map.value("a") == 1);
QVERIFY(map.contains("c") == true);
```

Итераторы JAVA и STL работают так же, как и [[QHash|QHash]].










