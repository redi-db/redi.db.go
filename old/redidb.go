package redidb

import (
	"encoding/json"
	"errors"
	"reflect"
	"strconv"

	"github.com/valyala/fasthttp"
)

var (
	CONNECTION_FAILED   = errors.New("Connection to database failed")
	AUTHORIZATION_ERROR = errors.New("Authorization to database failed")

	CONNECTION_NOT_CHECKED = errors.New("Connection not checked, please use .Connect()")

	DECODE_ERROR = errors.New("Failed to decode json answer from server")
)

var (
	NOT_SELECTED = errors.New("Collection is not set")
	NOT_FOUND    = errors.New("Not Found")

	TWO_ARGS_GIVED = errors.New("Only the key or filter can be set")

	UNKNOWN = errors.New("Unknown error:")
)

type Filter map[string]any
type Response map[string]any
type CreateData map[string]any
type UpdateData map[string]any

type DB struct {
	Login    string `json:"login"`
	Password string `json:"password"`

	Ip   string
	Port int

	connected bool
	url       string
}

func (this DB) isConnected() error {
	if !this.connected {
		return CONNECTION_NOT_CHECKED
	}

	return nil
}

func (this *DB) Connect() error {
	req := fasthttp.AcquireRequest()
	req.SetBody(toJson(struct {
		Login    string `json:"login"`
		Password string `json:"password"`
	}{
		this.Login, this.Password,
	}))

	req.Header.SetMethod("POST")
	req.Header.SetContentType("application/json")
	req.SetRequestURI("http://" + this.Ip + ":" + strconv.Itoa(this.Port) + "/db/admin/test/search")
	res := fasthttp.AcquireResponse()
	if err := fasthttp.Do(req, res); err != nil {
		return CONNECTION_FAILED
	}

	fasthttp.ReleaseRequest(req)
	data, err := getAnswer(res)
	if err != nil {
		return err
	}

	if data["data"] == nil {
		return AUTHORIZATION_ERROR
	}

	this.connected = true
	this.url = "http://" + this.Ip + ":" + strconv.Itoa(this.Port) + "/db/"
	return nil
}

func (this *DB) Database(database string) collection {
	if database == "" {
		panic("Database is not set")
	}

	return collection{
		db:       this,
		database: database,
	}
}

type collection struct {
	db         *DB
	database   string
	collection string
	url        string

	collectionCreated bool
}

func (this *collection) isCreated() error {
	if !this.collectionCreated {
		return NOT_SELECTED
	}

	return nil
}

func (this *collection) Collection(collection string) collection {
	if collection == "" {
		panic("Collection is not set")
	}

	this.collection = collection
	this.url = this.db.url + this.database + "/" + this.collection
	return *this
}

func (this *collection) Create(key string, createData CreateData) (map[string]any, error) {
	if err := this.db.isConnected(); err != nil {
		return nil, err
	}

	var d []map[string]any
	d = append(d, map[string]any{"key": key, "value": createData})

	req := fasthttp.AcquireRequest()
	req.SetBody(toJson(struct {
		Login    string `json:"login"`
		Password string `json:"password"`

		Data []map[string]any `json:"data"`
	}{
		this.db.Login, this.db.Password, d,
	}))

	req.Header.SetMethod("POST")
	req.Header.SetContentType("application/json")
	req.SetRequestURI(this.url + "/create")
	res := fasthttp.AcquireResponse()
	if err := fasthttp.Do(req, res); err != nil {
		return nil, CONNECTION_FAILED
	}

	fasthttp.ReleaseRequest(req)
	data, err := getAnswer(res)
	if err != nil {
		return nil, err
	}

	if !data["success"].(bool) {
		return nil, errors.New(data["message"].(string))
	}

	return data["data"].([]interface{})[0].(map[string]any), nil
}

func (this *collection) CreateMany(createData []CreateData) (map[string]any, error) {
	if err := this.db.isConnected(); err != nil {
		return nil, err
	}

	var toAdd []map[string]any
	for _, create := range createData {
		if create["_key"] != nil {
			key := create["_key"]
			delete(create, "_key")

			toAdd = append(toAdd, map[string]any{
				"key":   key,
				"value": create,
			})
		} else {
			toAdd = append(toAdd, map[string]any{
				"key":   "",
				"value": create,
			})
		}
	}

	req := fasthttp.AcquireRequest()
	req.SetBody(toJson(struct {
		Login    string `json:"login"`
		Password string `json:"password"`

		Data []map[string]any `json:"data"`
	}{
		this.db.Login, this.db.Password, toAdd,
	}))

	req.Header.SetMethod("POST")
	req.Header.SetContentType("application/json")
	req.SetRequestURI(this.url + "/create")
	res := fasthttp.AcquireResponse()
	if err := fasthttp.Do(req, res); err != nil {
		return nil, CONNECTION_FAILED
	}

	fasthttp.ReleaseRequest(req)
	data, err := getAnswer(res)
	if err != nil {
		return nil, err
	}

	if !data["success"].(bool) {
		return nil, errors.New(data["message"].(string))
	}

	return data["data"].([]interface{})[0].(map[string]any), nil
}

func (this *collection) Search(filter Filter) (Response, error) {
	if err := this.db.isConnected(); err != nil {
		return nil, err
	}

	req := fasthttp.AcquireRequest()
	req.SetBody(toJson(struct {
		Login    string `json:"login"`
		Password string `json:"password"`

		Filter Filter `json:"filter"`
	}{
		this.db.Login, this.db.Password, filter,
	}))

	req.Header.SetMethod("POST")
	req.Header.SetContentType("application/json")
	req.SetRequestURI(this.url + "/search")
	res := fasthttp.AcquireResponse()
	if err := fasthttp.Do(req, res); err != nil {
		return nil, CONNECTION_FAILED
	}

	fasthttp.ReleaseRequest(req)
	data, err := getAnswer(res)
	if err != nil {
		return nil, err
	}

	if data["data"] == nil {
		return nil, AUTHORIZATION_ERROR
	}

	return data, nil
}

func (this *collection) SearchOne(filter Filter) (map[string]any, error) {
	if err := this.db.isConnected(); err != nil {
		return nil, err
	}

	req := fasthttp.AcquireRequest()
	req.SetBody(toJson(struct {
		Login    string `json:"login"`
		Password string `json:"password"`

		Filter Filter `json:"filter"`
	}{
		this.db.Login, this.db.Password, filter,
	}))

	req.Header.SetMethod("POST")
	req.Header.SetContentType("application/json")
	req.SetRequestURI(this.url + "/searchOne")
	res := fasthttp.AcquireResponse()
	if err := fasthttp.Do(req, res); err != nil {
		return nil, CONNECTION_FAILED
	}

	fasthttp.ReleaseRequest(req)
	data, err := getAnswer(res)
	if err != nil {
		return nil, err
	}

	if data["data"] == nil {
		return nil, AUTHORIZATION_ERROR
	}

	if len(data["data"].([]interface{})) == 0 {
		return nil, NOT_FOUND
	}

	return data["data"].([]interface{})[0].(map[string]any)["value"].(map[string]any), nil
}

func (this *collection) Delete(key string, filter Filter) (float64, error) {
	if err := this.db.isConnected(); err != nil {
		return 0, err
	}

	if key != "" && len(filter) > 0 {
		return 0, TWO_ARGS_GIVED
	}

	req := fasthttp.AcquireRequest()
	req.SetBody(toJson(struct {
		Login    string `json:"login"`
		Password string `json:"password"`

		Key    string `json:"key"`
		Filter Filter `json:"filter"`
	}{
		this.db.Login, this.db.Password, key, filter,
	}))

	req.Header.SetMethod("POST")
	req.Header.SetContentType("application/json")
	req.SetRequestURI(this.url + "/delete")
	res := fasthttp.AcquireResponse()
	if err := fasthttp.Do(req, res); err != nil {
		return 0, CONNECTION_FAILED
	}

	fasthttp.ReleaseRequest(req)
	data, err := getAnswer(res)
	if err != nil {
		return 0, err
	}

	if data["data"] != nil {
		return 0, AUTHORIZATION_ERROR
	}

	if !data["success"].(bool) {
		return 0, errors.New(data["message"].(string))
	}

	return data["deleteCount"].(float64), nil
}

func (this *collection) Update(filter Filter, data []UpdateData) ([]interface{}, error) {
	if err := this.db.isConnected(); err != nil {
		return nil, err
	}

	var toChange []UpdateData
	for _, update := range data {
		toChange = append(toChange, UpdateData{
			"key":   update["key"],
			"value": update,
			"where": filter,
		})
	}

	req := fasthttp.AcquireRequest()
	req.SetBody(toJson(struct {
		Login    string `json:"login"`
		Password string `json:"password"`

		Data []UpdateData `json:"data"`
	}{
		this.db.Login, this.db.Password, toChange,
	}))

	req.Header.SetMethod("POST")
	req.Header.SetContentType("application/json")
	req.SetRequestURI(this.url + "/update")
	res := fasthttp.AcquireResponse()
	if err := fasthttp.Do(req, res); err != nil {
		return nil, CONNECTION_FAILED
	}

	fasthttp.ReleaseRequest(req)
	response, err := getAnswer(res)
	if err != nil {
		return nil, err
	}

	if response["data"] == nil {
		return nil, AUTHORIZATION_ERROR
	}

	if len(response["data"].([]interface{})) == 0 {
		return nil, NOT_FOUND
	}

	return response["data"].([]interface{}), nil
}

func (this *collection) FindOrCreate(filter Filter, create CreateData) map[string]any {
	response, err := this.SearchOne(filter)
	if err != nil {
		if _, err := this.Create("", create); err != nil {
			println(UNKNOWN)
			panic(err)
		}
		return create
	}

	return response
}

func getAnswer(response *fasthttp.Response) (Response, error) {
	var data interface{}
	if err := json.Unmarshal(response.Body(), &data); err != nil {
		return nil, DECODE_ERROR
	}

	if reflect.TypeOf(data).String() == "[]interface {}" {
		return map[string]interface{}{"data": data}, nil
	}

	return data.(map[string]any), nil
}

func toJson(_struct any) []byte {
	res, err := json.Marshal(_struct)
	if err != nil {
		return []byte(string("{}"))
	}

	return []byte(string(res))
}
