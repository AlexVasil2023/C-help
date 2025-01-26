# Роли элементов

Каждый элемент списка содержит данные, распределенные по ролям. С помощью этих данных можно указать текст элемента, каким шрифтом и цветом отображается текст, задать текст всплывающей подсказки и многое другое. Перечислим роли элементов:

> **Qt::DisplayRole** — 0 — отображаемые данные (обычно текст);
> 
> **Qt::DecorationRole** — 1 — изображение (обычно значок);
> 
> **Qt::EditRole** — 2 — данные в виде, удобном для редактирования;
> 
> **Qt::ToolTipRole** — 3 — текст всплывающей подсказки;
> 
> **Qt::StatusTipRole** — 4 — текст для строки состояния;
> 
> **Qt::WhatsThisRole** — 5 — текст для справки;
> 
> **Qt::FontRole** — 6 — шрифт элемента. Указывается экземпляр класса [[QFont|QFont]];
> 
> **Qt::TextAlignmentRole** — 7 — выравнивание текста внутри элемента;
> 
> **Qt::BackgroundRole** — 8 — фон элемента. Указывается экземпляр класса [[QBrush|QBrush]];
> 
> **Qt::ForegroundRole** — 9 — цвет текста. Указывается экземпляр класса [[QBrush|QBrush]];
> 
> **Qt::CheckStateRole** — 10 — статус флажка. Могут быть указаны следующие константы:
>
* **Qt::Unchecked** — 0 — флажок сброшен;
* **Qt::PartiallyChecked** — 1 — флажок частично установлен;
* **Qt::Checked** — 2 — флажок установлен;

> **Qt::AccessibleTextRole** — 11 — текст для плагинов;
> 
> **Qt::AccessibleDescriptionRole** — 12 — описание элемента;
> 
> **Qt::UserRole** — 32 — любые пользовательские данные, например индекс элемента в базе данных. Пример:
```c++
comboBox->setItemData(0, QVariant(50), Qt::UserRole);

comboBox->setItemData(0, "Это текст всплывающей подсказки", Qt::ToolTipRole);
```



