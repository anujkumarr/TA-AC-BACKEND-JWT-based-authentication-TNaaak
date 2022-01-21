
# Endpoints.
### Authentication:

`POST /api/v1/users/login`

Example request body:
```JSON
{
  "user":{
    "email": "jake@jake.jake",
    "password": "jakejake"
  }
}
```

No authentication required, returns a User.

Required fields: `email`, `password`


### Registration:

`POST /api/v1/users/signup`

Example request body:
```JSON
{
  "user":{
      "name": "Jacob",
    "username": "jacob",
    "email": "jake@jake.jake",
    "password": "jakejake"
  }
}
```

No authentication required, returns a User.

Required fields: `email`, `username`, `password`



### Get Current User

`GET /api/v1/user`

Authentication required, returns a User.



### Update User

`PUT /api/v1/user`

Example request body:
```JSON
{
  "user":{
    "email": "jake@jake.jake",
    "bio": "I like to skateboard",
    "image": "https://i.stack.imgur.com/xHWG8.jpg"
  }
}
```

Authentication required, returns the User.


Accepted fields: `email`, `username`, `password`, `image`, `bio`



### Get Profile

`GET /api/v1/profiles/:username`

Authentication optional, returns a Profile.



### Follow user

`POST /api/profiles/:username/follow`

Authentication required, returns a Profile.

No additional parameters required



### Unfollow user

`DELETE /api/v1/profiles/:username/follow`

Authentication required, returns a Profile.

No additional parameters required



### List Articles

`GET /api/v1/articles`

Returns most recent articles globally by default, provide `tag`, `author` or `favorited` query parameter to filter results

Query Parameters:

Filter by tag:

`?tag=AngularJS`

Filter by author:

`?author=jake`

Favorited by user:

`?favorited=jake`

Limit number of articles (default is 20):

`?limit=20`

Offset/skip number of articles (default is 0):

`?offset=0`

Authentication optional, will return multiple articles.



### Feed Articles

`GET /api/v1/articles/feed`

Can also take `limit` and `offset` query parameters like List Articles.

Authentication required, will return multiple articles. Created by followed users, ordered by most recent first.


### Get Article

`GET /api/v1/articles/:slug`

No authentication required, will return Single Article.

### Create Article

`POST /api/v1/articles`

Example request body:

```JSON
{
  "article": {
    "title": "How to train your dragon",
    "description": "Ever wonder how?",
    "body": "You have to believe",
    "tagList": ["reactjs", "angularjs", "dragons"]
  }
}
```

Authentication required, will return an Article.

Required fields: `title`, `description`, `body`

Optional fields: `tagList` as an array of Strings



### Update Article

`PUT /api/v1/articles/:slug`

Example request body:

```JSON
{
  "article": {
    "title": "Did you train your dragon?"
  }
}
```

Authentication required, returns the Updated Article.

Optional fields: `title`, `description`, `body`

The `slug` also gets updated when the `title` is changed


### Delete Article

`DELETE /api/v1/articles/:slug`

Authentication required



### Add Comments to an Article

`POST /api/v1/articles/:slug/comments`

Example request body:

```JSON
{
  "comment": {
    "body": "His name was my name too."
  }
}
```

Authentication required, returns the created Comment.

Required field: `body`



### Get Comments from an Article

`GET /api/v1/articles/:slug/comments`

Authentication optional, returns Multiple Comments.



### Delete Comment

`DELETE /api/v1/articles/:slug/comments/:id`

Authentication required



### Favorite Article

`POST /api/v1/articles/:slug/favorite`

Authentication required, returns the Article.

No additional parameters required



### Unfavorite Article

`DELETE /api/v1/articles/:slug/favorite`

Authentication required, returns the Article.

No additional parameters required



### Get Tags

`GET /api/v1/tags`

No authentication required, returns a List of Tags.