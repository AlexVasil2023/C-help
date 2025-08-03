# Аутентификация с использованием OAuth

**OAuth** - это открытый протокол, позволяющий осуществлять безопасную авторизацию простым и стандартным способом из веб-приложений, мобильных и настольных систем. **OAuth** используется для аутентификации клиента в таких распространенных веб-сервисах, как Google, Facebook и Twitter.

> Для пользовательского веб-сервиса можно также использовать стандартную HTTP-аутентификацию, например, с помощью имени пользователя и пароля `XMLHttpRequest` в методе `get` (например, xhr.open(verb, url, true, username, password) ).

В настоящее время `OAuth` не является частью QML/JS API. Поэтому необходимо написать код на языке C++ и экспортировать аутентификацию в QML/JS. Другой проблемой является безопасное хранение маркера доступа.

## Пример интеграции

В этом разделе мы рассмотрим пример интеграции OAuth с использованием Spotify API (https://developer.spotify.com/documentation/web-api/) . В данном примере используется комбинация классов C++ и QML/JS. [[Введение в систему управления|Подробнее об этой интеграции]].

Задача этого приложения - получить десять самых любимых исполнителей аутентифицированного пользователя.

### Создание приложения

Сначала необходимо создать специальное приложение на портале разработчиков Spotify (https://developer.spotify.com/dashboard/applications) .

![[QML Auth.png]]

После создания приложения вы получите два ключа: `client id` и ключ `client secret`.

![[QML Auth_2.png]]

### Файл QML

Процесс разделен на две фазы:
1. Приложение подключается к API Spotify, который, в свою очередь, запрашивает у пользователя авторизацию;
2. В случае авторизации приложение отображает список десяти любимых исполнителей пользователя.

#### Авторизация приложения

Начнем с первого шага:

```c++
import QtQuick
import QtQuick.Window
import QtQuick.Controls
import Spotify
```

При запуске приложения мы сначала импортируем пользовательскую библиотеку Spotify, которая определяет компонент SpotifyAPI (об этом мы поговорим позже). Затем этот компонент будет инстанцирован:

```c++
ApplicationWindow {
	width: 320
	height: 568
	visible: true
	title: qsTr("Spotify OAuth2")
	
	BusyIndicator {
		visible: !spotifyApi.isAuthenticated
		anchors.centerIn: parent
	}
	
	SpotifyAPI {
		id: spotifyApi
		onIsAuthenticatedChanged: if(isAuthenticated) spotifyMo
	}
```

После загрузки приложения компонент SpotifyAPI запросит авторизацию в Spotify:

```c++
Component.onCompleted: {
	spotifyApi.setCredentials("CLIENT_ID", "CLIENT_SECRET")
	spotifyApi.authorize()
}
```

Пока авторизация не будет предоставлена, в центре приложения будет отображаться индикатор занятости.

#### Вывод списка любимых исполнителей пользователя

Следующий шаг происходит после того, как авторизация была получена. Для отображения списка исполнителей мы будем использовать паттерн Model/View/Delegate:

```c++
SpotifyModel {
	id: spotifyModel
	spotifyApi: spotifyApi
}

ListView {
	visible: spotifyApi.isAuthenticated
	width: parent.width
	height: parent.height
	model: spotifyModel
	
	delegate: Pane {
		id: delegate
		required property var model
		topPadding: 0
		
		Column {
			width: 300
			spacing: 10
			
			Rectangle {
				height: 1
				width: parent.width
				color: delegate.model.index > 0 ? "#3d3d3d" : "
			}
			
			Row {
				spacing: 10
			
				Item {
					width: 20
					height: width

					Rectangle {
						width: 20
						height: 20
						anchors.top: parent.top
						anchors.right: parent.right
						color: "black"
						
						Label {
							anchors.centerIn: parent
							font.pointSize: 16
							text: delegate.model.index + 1
							color: "white"
						}
					}
				}
				
				Image {
					width: 80
					height: width
					source: delegate.model.imageURL
					fillMode: Image.PreserveAspectFit
				}
			
				Column {
					Label {
						text: delegate.model.name
						font.pointSize: 16
						font.bold: true
					}
					
					Label { text: "Followers: " + delegate.mode
				}
			}
		}
	}
}
```

Модель `SpotifyModel` определена в библиотеке `Spotify`. Для правильной работы ей необходим SpotifyAPI . `ListView` отображает вертикальный список исполнителей. Исполнитель представлен именем, изображением и общим количествомподписчиков.

### SpotifyAPI

Теперь немного углубимся в процесс аутентификации. 
Класс `SpotifyAPI`, `QML_ELEMENT`, определенный на стороне C++.

```c++
#ifndef SPOTIFYAPI_H
#define SPOTIFYAPI_H

#include <QtCore>
#include <QtNetwork>
#include <QtQml/qqml.h>
#include <QOAuth2AuthorizationCodeFlow>

class SpotifyAPI: public QObject
{
	Q_OBJECT
	QML_ELEMENT
	Q_PROPERTY(bool isAuthenticated READ isAuthenticated WRITE
	
	public:
		SpotifyAPI(QObject *parent = nullptr);
		
		void setAuthenticated(bool isAuthenticated) {
			if (m_isAuthenticated != isAuthenticated) {
				m_isAuthenticated = isAuthenticated;
				emit isAuthenticatedChanged();
			}
		}

		bool isAuthenticated() const {
			return m_isAuthenticated;
		}
		
		QNetworkReply* getTopArtists();
		
	public slots:
		void setCredentials(const QString& clientId, const QString&
		void authorize();
	
	signals:
		void isAuthenticatedChanged();

	private:
		QOAuth2AuthorizationCodeFlow m_oauth2;
		bool m_isAuthenticated;
};
#endif // SPOTIFYAPI_H
```

Сначала мы импортируем класс `<QOAuth2AuthorizationCodeFlow>`. Этот класс является частью модуля `QtNetworkAuth`, который содержит различные реализации `OAuth `.

```c++
#include <QOAuth2AuthorizationCodeFlow>
```

Наш класс, `SpotifyAPI`, определит свойство `isAuthenticated`:

```c++
Q_PROPERTY(bool isAuthenticated READ isAuthenticated WRITE setA
```

Два общедоступных слота, которые мы использовали в файлах QML:

```c++
void setCredentials(const QString& clientId, const QString& cli
void authorize();
```

И частный член, представляющий поток аутентификации:

```c++
QOAuth2AuthorizationCodeFlow m_oauth2;
```

На стороне реализации мы имеем следующий код:

```c++
#include "spotifyapi.h"
#include <QtGui>
#include <QtCore>
#include <QtNetworkAuth>

SpotifyAPI::SpotifyAPI(QObject *parent)
	: QObject(parent)
	, m_isAm_oauth2.setAuthorizationUrl(QUrl("https://accounts.spotify
	, m_oauth2.setAccessTokenUrl(QUrl("https://accounts.spotify.c
	, m_oauth2.setScope("user-top-read");
	, m_oauth2.setReplyHandler(new QOAuthHttpServerReplyHandler(8
	, m_oauth2.setModifyParametersFunction([&](QAbstractOAuth::St
	{
		if(stage == QAbstractOAuth::Stage::RequestingAuthorizat
			parameters->insert("duration", "permanent");
		}
	});
	
	connect(&m_oauth2, &QOAuth2AuthorizationCodeFlow::authorize
	connect(&m_oauth2, &QOAuth2AuthorizationCodeFlow::statusCha
	
		if (status == QAbstractOAuth::Status::Granted) {
			setAuthenticated(true);
		} else {
			setAuthenticated(false);
		}
	});
}

void SpotifyAPI::setCredentials(const QString& clientId, const
	m_oauth2.setClientIdentifier(clientId);
	m_oauth2.setClientIdentifierSharedKey(clientSecret);
}

void SpotifyAPI::authorize() {
	m_oauth2.grant();
}

QNetworkReply* SpotifyAPI::getTopArtists() {
	return m_oauth2.get(QUrl("https://api.spotify.com/v1/me/top
}
```

Задача конструктора состоит в основном в настройке потока аутентификации. Сначала мы определяем маршруты Spotify API, которые будут служить в качестве аутентификаторов.

```c++
	m_oauth2.setAuthorizationUrl(QUrl("https://accounts.spotify.com
	m_oauth2.setAccessTokenUrl(QUrl("https://accounts.spotify.com/a
```

Затем мы выбираем область действия (= авторизации Spotify), которую мы хотим использовать

```c++
m_oauth2.setScope("user-top-read");
```

Поскольку OAuth - это двусторонний процесс взаимодействия, мы создаем специальный локальный сервер для обработки ответов:

```c++
m_oauth2.setReplyHandler(new QOAuthHttpServerReplyHandler(8000,
```

Наконец, мы настраиваем два сигнала и слоты.

```c++
connect(&m_oauth2, &QOAuth2AuthorizationCodeFlow::authorizeWith
connect(&m_oauth2, &QOAuth2AuthorizationCodeFlow::statusChanged
```

Первая настраивает авторизацию в веб-браузере (через `&QDesktopServices::openUrl` ), а вторая обеспечивает уведомление о завершении процесса авторизации.

Метод `authorize()` - это только место для вызова метода `grant()`, лежащего в основе потока аутентификации. Именно этот метод запускает процесс.

```c++
void SpotifyAPI::authorize() {
	m_oauth2.grant();
}
```

Наконец, функция `getTopArtists()` вызывает web api, используя контекст авторизации, предоставленный менеджером сетевого доступа `m_oauth2`.

```c++
QNetworkReply* SpotifyAPI::getTopArtists() {
	return m_oauth2.get(QUrl("https://api.spotify.com/v1/me/top
}
```

### Модель Spotify

Этот класс представляет собой QML_ELEMENT , который является подклассом `QAbstractListModel` для представления нашего списка исполнителей. Он использует SpotifyAPI для получения исполнителей с удаленной конечной точки.

```c++
#ifndef SPOTIFYMODEL_H
#define SPOTIFYMODEL_H
#include <QtCore>
#include "spotifyapi.h"

QT_FORWARD_DECLARE_CLASS(QNetworkReply)

class SpotifyModel : public QAbstractListModel
{
	Q_OBJECT
	QML_ELEMENT
	Q_PROPERTY(SpotifyAPI* spotifyApi READ spotifyApi WRITE set

	public:
		SpotifyModel(QObject *parent = nullptr);
		
		void setSpotifyApi(SpotifyAPI* spotifyApi) {
			if (m_spotifyApi != spotifyApi) {
				m_spotifyApi = spotifyApi;
				emit spotifyApiChanged();
			}
		}

		SpotifyAPI* spotifyApi() const {
			return m_spotifyApi;
		}
		
		enum {
			NameRole = Qt::UserRole + 1,
			ImageURLRole,
			FollowersCountRole,
			HrefRole,
		};
		
		QHash<int, QByteArray> roleNames() const override;
		int rowCount(const QModelIndex &parent) const override;
		int columnCount(const QModelIndex &parent) const override;
		QVariant data(const QModelIndex &index, int role) const ove
		
	signals:
		void spotifyApiChanged();
		void error(const QString &errorString);
	
	public slots:
		void update();
		
	private:
		QPointer<SpotifyAPI> m_spotifyApi;
		QList<QJsonObject> m_artists;
};
#endif // SPOTIFYMODEL_H
```

Этот класс определяет свойство `spotifyApi`:

```c++
Q_PROPERTY(SpotifyAPI* spotifyApi READ spotifyApi WRITE setSpot
```

Перечисление ролей (в соответствии с `QAbstractListModel`):

```c++
enum {
	NameRole = Qt::UserRole + 1, // The artist's name
	ImageURLRole, // The artist's image
	FollowersCountRole, // The artist's followers c
	HrefRole, // The link to the artist's
};
```

Слот для запуска обновления списка исполнителей:

```c++
public slots:
	void update();
```

И, конечно же, список исполнителей, представленный в виде JSON-объектов:

```c++
public slots:
	QList<QJsonObject> m_artists;
```

Со стороны реализации мы имеем:

```c++
#include "spotifymodel.h"
#include <QtCore>
#include <QtNetwork>

SpotifyModel::SpotifyModel(QObject *parent): QAbstractListModel

QHash<int, QByteArray> SpotifyModel::roleNames() const {
	static const QHash<int, QByteArray> names {
		{ NameRole, "name" },
		{ ImageURLRole, "imageURL" },
		{ FollowersCountRole, "followersCount" },
		{ HrefRole, "href" },
	};

	return names;
}
//=============================

int SpotifyModel::rowCount(const QModelIndex &parent) const 
{
	Q_UNUSED(parent);
	return m_artists.size();
}
//=============================

int SpotifyModel::columnCount(const QModelIndex &parent) const
{
	Q_UNUSED(parent);
	return m_artists.size() ? 1 : 0;
}
//=============================

QVariant SpotifyModel::data(const QModelIndex &index, int role)
{
	Q_UNUSED(role);
	
	if (!index.isValid())
		return QVariant();
		
	if (role == Qt::DisplayRole || role == NameRole) {
		return m_artists.at(index.row()).value("name").toString
	}

	if (role == ImageURLRole) {
		const auto artistObject = m_artists.at(index.row());
		const auto imagesValue = artistObject.value("images");

		Q_ASSERT(imagesValue.isArray());
		const auto imagesArray = imagesValue.toArray();
		
		if (imagesArray.isEmpty())
			return "";
			
		const auto imageValue = imagesArray.at(0).toObject();
		return imageValue.value("url").toString();
	}
	
	if (role == FollowersCountRole) {
		const auto artistObject = m_artists.at(index.row());
		const auto followersValue = artistObject.value("followe
		return followersValue.value("total").toInt();
	}
	
	if (role == HrefRole) {
		return m_artists.at(index.row()).value("href").toString
	}
	
	return QVariant();
}
//=============================	

void SpotifyModel::update() {
	if (m_spotifyApi == nullptr) {
		emit error("SpotifyModel::error: SpotifyApi is not set.
		return;
	}

	auto reply = m_spotifyApi->getTopArtists();
	
	connect(reply, &QNetworkReply::finished, [=]() {
		reply->deleteLater();
		if (reply->error() != QNetworkReply::NoError) {
			emit error(reply->errorString());
			return;
		}
		
		const auto json = reply->readAll();
		const auto document = QJsonDocument::fromJson(json);

		Q_ASSERT(document.isObject());
		const auto rootObject = document.object();
		const auto artistsValue = rootObject.value("items");
		
		Q_ASSERT(artistsValue.isArray());
		const auto artistsArray = artistsValue.toArray();
		
		if (artistsArray.isEmpty())
			return;
			
		beginResetModel();
		m_artists.clear();
		
		for (const auto artistValue : qAsConst(artistsArray)) {
			Q_ASSERT(artistValue.isObject());
			m_artists.append(artistValue.toObject());
		}

		endResetModel();
	});
}
```

Метод `update()` вызывает метод `getTopArtists()` и обрабатывает его ответ, извлекая отдельные элементы из JSON-документа и обновляя список исполнителей в модели.

```c++
auto reply = m_spotifyApi->getTopArtists();

connect(reply, &QNetworkReply::finished, [=]() {
	reply->deleteLater();
	
	if (reply->error() != QNetworkReply::NoError) {
		emit error(reply->errorString());
		return;
	}
	
	const auto json = reply->readAll();
	const auto document = QJsonDocument::fromJson(json);
	
	Q_ASSERT(document.isObject());
	const auto rootObject = document.object();
	const auto artistsValue = rootObject.value("items");
	Q_ASSERT(artistsValue.isArray());
	
	const auto artistsArray = artistsValue.toArray();
	
	if (artistsArray.isEmpty())
		return;
		
	beginResetModel();
	m_artists.clear();
	
	for (const auto artistValue : qAsConst(artistsArray)) {
		Q_ASSERT(artistValue.isObject());
		m_artists.append(artistValue.toObject());
	}
	
	endResetModel();
});
```

Метод `data()` извлекает, в зависимости от запрашиваемой роли модели, соответствующие атрибуты Артиста и возвращает в виде `QVariant`:

```c++
if (role == Qt::DisplayRole || role == NameRole) {
	return m_artists.at(index.row()).value("name").toString
}

if (role == ImageURLRole) {
	const auto artistObject = m_artists.at(index.row());
	const auto imagesValue = artistObject.value("images");
	
	Q_ASSERT(imagesValue.isArray());
	const auto imagesArray = imagesValue.toArray();
	
	if (imagesArray.isEmpty())
		return "";
		
	const auto imageValue = imagesArray.at(0).toObject();
	return imageValue.value("url").toString();
}

if (role == FollowersCountRole) {
	const auto artistObject = m_artists.at(index.row());
	const auto followersValue = artistObject.value("followe
	return followersValue.value("total").toInt();
}
												   
if (role == HrefRole) {
	return m_artists.at(index.row()).value("href").toString
}
```

![[QML Auth_3.png]]










