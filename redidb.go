package redidb

import (
	"encoding/json"
	"errors"
	"reflect"
	"strconv"

	"github.com/valyala/fasthttp"
)

var (
	CONNECTION_FAILED = errors.New("Connection to database failed")
	DECODE_ERROR      = errors.New("Failed to decode json answer from server")
)

var (
	NOT_FOUND = errors.New("Not Found")
)

type Filter map[string]any
type CreateData map[string]any
type UpdateData map[string]any

type DB struct {
	Login    string `json:"login"`
	Password string `json:"password"`

	Ip   string
	Port int

	url string
}

func (this *DB) Database(database string) collection {
	if database == "" {
		panic("Database is not set")
	}

	this.url = "http://" + this.Ip + ":" + strconv.Itoa(this.Port) + "/"
	return collection{
		db:       this,
		database: database,
	}
}

type collection struct {
	db         *DB
	database   string
	collection string
}

func (this *collection) Collection(collection string) collection {
	if collection == "" {
		panic("Collection is not set")
	}

	this.collection = collection
	return *this
}

func (this *collection) Create(createData ...CreateData) ([]interface{}, error) {
	req := fasthttp.AcquireRequest()
	req.SetBody(toJson(struct {
		Database    string `json:"database"`
		Collection string `json:"collection"`

		Login    string `json:"login"`
		Password string `json:"password"`

		Data []CreateData `json:"data"`
	}{
		this.database, this.collection, this.db.Login, this.db.Password, createData,
	}))

	req.Header.SetMethod("POST")
	req.Header.SetContentType("application/json")
	req.SetRequestURI(this.db.url + "/create")
	res := fasthttp.AcquireResponse()
	if err := fasthttp.Do(req, res); err != nil {
		return nil, CONNECTION_FAILED
	}

	fasthttp.ReleaseRequest(req)
	data, err := getAnswer(res)
	if err != nil {
		return nil, err
	}

	if reflect.TypeOf(data).String() != "[]interface {}" {
		if !data.(map[string]interface{})["success"].(bool) {
			return nil, errors.New(data.(map[string]interface{})["message"].(string))
		}
	}

	return data.([]interface{}), nil
}

func (this *collection) Search(filter Filter) ([]interface{}, error) {
	req := fasthttp.AcquireRequest()
	req.SetBody(toJson(struct {
		Database    string `json:"database"`
		Collection string `json:"collection"`

		Login    string `json:"login"`
		Password string `json:"password"`

		Filter Filter `json:"filter"`
	}{
		this.database, this.collection, this.db.Login, this.db.Password, filter,
	}))

	req.Header.SetMethod("POST")
	req.Header.SetContentType("application/json")
	req.SetRequestURI(this.db.url + "/search")
	res := fasthttp.AcquireResponse()
	if err := fasthttp.Do(req, res); err != nil {
		return nil, CONNECTION_FAILED
	}

	fasthttp.ReleaseRequest(req)
	data, err := getAnswer(res)
	if err != nil {
		return nil, err
	}

	if reflect.TypeOf(data).String() != "[]interface {}" {
		if !data.(map[string]interface{})["success"].(bool) {
			return nil, errors.New(data.(map[string]interface{})["message"].(string))
		}
	}

	if len(data.([]interface{})) == 0 {
		return nil, NOT_FOUND
	}

	return data.([]interface{}), nil
}

func (this *collection) SearchOne(filter Filter) (interface{}, error) {
	filter["$max"] = 1

	req := fasthttp.AcquireRequest()
	req.SetBody(toJson(struct {
		Database    string `json:"database"`
		Collection string `json:"collection"`

		Login    string `json:"login"`
		Password string `json:"password"`

		Filter Filter `json:"filter"`
	}{
		this.database, this.collection, this.db.Login, this.db.Password, filter,
	}))

	req.Header.SetMethod("POST")
	req.Header.SetContentType("application/json")
	req.SetRequestURI(this.db.url + "/search")
	res := fasthttp.AcquireResponse()
	if err := fasthttp.Do(req, res); err != nil {
		return nil, CONNECTION_FAILED
	}

	fasthttp.ReleaseRequest(req)
	data, err := getAnswer(res)
	if err != nil {
		return nil, err
	}

	if reflect.TypeOf(data).String() != "[]interface {}" {
		if !data.(map[string]interface{})["success"].(bool) {
			return nil, errors.New(data.(map[string]interface{})["message"].(string))
		}
	}

	if len(data.([]interface{})) == 0 {
		return nil, NOT_FOUND
	}

	return data.([]interface{})[0], nil
}

func (this *collection) Delete(filter Filter) ([]interface{}, error) {
	req := fasthttp.AcquireRequest()
	req.SetBody(toJson(struct {
		Database    string `json:"database"`
		Collection string `json:"collection"`

		Login    string `json:"login"`
		Password string `json:"password"`

		Filter Filter `json:"filter"`
	}{
		this.database, this.collection, this.db.Login, this.db.Password, filter,
	}))

	req.Header.SetMethod("DELETE")
	req.Header.SetContentType("application/json")
	req.SetRequestURI(this.db.url)
	res := fasthttp.AcquireResponse()
	if err := fasthttp.Do(req, res); err != nil {
		return nil, CONNECTION_FAILED
	}

	fasthttp.ReleaseRequest(req)
	data, err := getAnswer(res)
	if err != nil {
		return nil, err
	}

	if reflect.TypeOf(data).String() != "[]interface {}" {
		if !data.(map[string]interface{})["success"].(bool) {
			return nil, errors.New(data.(map[string]interface{})["message"].(string))
		}
	}

	return data.([]interface{}), nil
}

func (this *collection) Update(filter Filter, update UpdateData) ([]interface{}, error) {
	req := fasthttp.AcquireRequest()
	req.SetBody(toJson(struct {
		Database    string `json:"database"`
		Collection string `json:"collection"`

		Login    string `json:"login"`
		Password string `json:"password"`

		Data map[string]any `json:"data"`
	}{
		this.database, this.collection, this.db.Login, this.db.Password, map[string]any{
			"filter": filter,
			"update": update,
		},
	}))

	req.Header.SetMethod("PUT")
	req.Header.SetContentType("application/json")
	req.SetRequestURI(this.db.url)
	res := fasthttp.AcquireResponse()
	if err := fasthttp.Do(req, res); err != nil {
		return nil, CONNECTION_FAILED
	}

	fasthttp.ReleaseRequest(req)
	data, err := getAnswer(res)
	if err != nil {
		return nil, err
	}

	if reflect.TypeOf(data).String() != "[]interface {}" {
		if !data.(map[string]interface{})["success"].(bool) {
			return nil, errors.New(data.(map[string]interface{})["message"].(string))
		}
	}

	if len(data.([]interface{})) == 0 {
		return nil, NOT_FOUND
	}

	return data.([]interface{}), nil
}

func (this *collection) SearchOrCreate(filter Filter, create CreateData) (map[string]interface{}, error) {
	req := fasthttp.AcquireRequest()
	req.SetBody(toJson(struct {
		Database    string `json:"database"`
		Collection string `json:"collection"`

		Login    string `json:"login"`
		Password string `json:"password"`

		Filter Filter     `json:"filter"`
		Data   CreateData `json:"data"`
	}{
		this.database, this.collection, this.db.Login, this.db.Password, filter, create,
	}))

	req.Header.SetMethod("POST")
	req.Header.SetContentType("application/json")
	req.SetRequestURI(this.db.url + "/searchOrCreate")
	res := fasthttp.AcquireResponse()
	if err := fasthttp.Do(req, res); err != nil {
		return nil, CONNECTION_FAILED
	}

	fasthttp.ReleaseRequest(req)
	data, err := getAnswer(res)
	if err != nil {
		return nil, err
	}

	if reflect.TypeOf(data).String() == "map[string]interface {}" {
		if data.(map[string]interface{})["success"] != nil && !data.(map[string]interface{})["success"].(bool) {
			return nil, errors.New(data.(map[string]interface{})["message"].(string))
		}
	}

	return data.(map[string]interface{}), nil
}

func getAnswer(response *fasthttp.Response) (any, error) {
	var data interface{}
	if err := json.Unmarshal(response.Body(), &data); err != nil {
		return nil, DECODE_ERROR
	}

	return data, nil
}

func toJson(_struct any) []byte {
	res, err := json.Marshal(_struct)
	if err != nil {
		return []byte(string("{}"))
	}

	return []byte(string(res))
}
