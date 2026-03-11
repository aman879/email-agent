// Package config manages the application configuration and env Variables
// It provides a centralzied way to access setting likes databse path and server port.
package config

import (
	"os"

	"github.com/joho/godotenv"
)

// Config holds all the global settings
type Config struct {
	Port      string
	DBPath    string
	RedisAddr string
}

// LoadConfig reads the .env file and populates the Config struct.
// It returns default values if the .env is missing.
func LoadConfig() *Config {
	_ = godotenv.Load()

	return &Config{
		Port:      getEnv("PORT", "8080"),
		DBPath:    getEnv("DB_PATH", "agent.db"),
		RedisAddr: getEnv("REDIS_ADDR", "localhost:6479"),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
