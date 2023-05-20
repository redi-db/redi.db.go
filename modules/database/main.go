package database

import (
	"RediPast/modules/config"

	redidb "github.com/redi-db/redi.db.go"
)

var _db = redidb.DB{
	Ip: config.Get().Database.IP,
	Port: config.Get().Database.Port,

	Login: config.Get().Database.Login,
	Password: config.Get().Database.Password,
}

var db = _db.Database(config.Get().Database.Name)