package structure

type Config struct {
	inited bool

	Web struct {
		Port int `yaml:"port"`
		AccessToken string `yaml:"accessToken"`
	} `yaml:"server"`

	Settings struct {
		MaxThreads int `yaml:"max_threads"`
	} `json:"settings"`

	Database struct {
		Name string `yaml:"database_name"`
		IP string `yaml:"ip"`
		Port int `yaml:"port"`
		
		Login string `yaml:"login"`
		Password string `yaml:"password"`
	} `yaml:"database"`
}

func (cfg *Config) Init() {
	cfg.inited = true
}

func (cfg *Config) GetInit() bool {
	return cfg.inited
}
