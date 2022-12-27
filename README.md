# Redi.DB.go
Library for working with RediDB in GoLang
## Installation

```bash
go get github.com/redi-db/redi.db.go
```
<br><br>
**Init database**
```go
var db = redidb.DB{
	Login:    "root",
	Password: "root",

	Ip:   "localhost",
	Port: 5000,
}
```
<br><br>
```go
func main() {
  if err := db.Connect(); err != nil {
		if err == redidb.CONNECTION_FAILED {
			panic("Failed to connect to the database :(")
		} else if err == redidb.AUTHORIZATION_ERROR {
			panic("Invalid login or password :(")
		}
	}

  exampleDatabase := db.Database("ExampleProject")
  exampleCollection := exampleDatabase.Collection("exampleCollection")
}
```

<br><br>
**Creating**
```go
  // The first argument can be empty, so only the filter will be accepted, or vice versa
  response, err := exampleCollection.Create("key", redidb.CreateData{"id": 1})
  if err != nil {
    panic(err)
  }
  
  fmt.Println(response)
  response, err = exampleCollection.CreateMany([]redidb.CreateData{
  	{
	    "id": 2
	},
	
	{
	    "_key": "user3" // key (_id)
	    "id": 3
	},
  })
  if err != nil {
    panic(err)
  }

  fmt.Println(response)
```
<br><br>
**Search**
```go
  response, err := exampleCollection.Search(redidb.Filter{})
  if err != nil {
    panic(err)
  }

  fmt.Println(response)
```

<br><br>
**Search one**
```go
  response, err := exampleCollection.SearchOne(redidb.Filter{})
  if err == redidb.NOT_FOUND {
    panic("Nothing was found :(")
  }

  fmt.Println(response)
```

<br><br>
**Deleting**
```go
  // The first argument can be empty, so only the filter will be accepted, or vice versa
  deleteCount, err := exampleCollection.Delete("", redidb.Filter{})
  if err != nil {
    panic(err)
  }

  fmt.Println(deleteCount)
```

<br><br>
**Updating**
```go
  updated, err := exampleCollection.Update(redidb.Filter{
    "username": "test1",
  }, []redidb.UpdateData{
    {
      "username": "test2",
    },
  })
  
  if err == redidb.NOT_FOUND {
    panic("Nothing was found with this filter :(")
  }

  fmt.Println(updated)
```
