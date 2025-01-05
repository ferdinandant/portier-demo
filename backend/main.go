package main

import (
	"encoding/json"
	"io"
	"os"

	"github.com/ferdinandant/portier-demo/keychains"
	"github.com/ferdinandant/portier-demo/keycopies"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/go-sql-driver/mysql"
)

type MySqlSecret struct {
	Address      string `json:"address"`
	Username     string `json:"username"`
	Password     string `json:"password"`
	DatabaseName string `json:"databaseName"`
}

func main() {
	// ================================================================================
	// SETUP DATABASE
	// ================================================================================

	// Read mysql secret
	mysqlSecretFile, err := os.Open("./secrets/mysql.json")
	if err != nil {
		panic("mysql secret file is not found")
	}
	defer mysqlSecretFile.Close()
	mysqlSecretBytes, _ := io.ReadAll(mysqlSecretFile)
	// Parse config
	var mysqlSecret MySqlSecret
	err = json.Unmarshal(mysqlSecretBytes, &mysqlSecret)
	if err != nil {
		panic("unable to parse mysql secret file")
	}

	// Configure connection
	// https://github.com/go-sql-driver/mysql/pull/644
	mysqlConfig := mysql.Config{
		User:                 mysqlSecret.Username,
		Passwd:               mysqlSecret.Password,
		Net:                  "tcp",
		Addr:                 mysqlSecret.Address,
		DBName:               mysqlSecret.DatabaseName,
		AllowNativePasswords: true,
	}

	// ================================================================================
	// REGISTER ROUTES
	// ================================================================================

	r := gin.Default()
	r.Use(cors.Default())

	// Keychain handlers
	r.POST("/api/keychains/list", func(c *gin.Context) {
		wrapHandler(c, func(c *gin.Context, reqJson []byte) (interface{}, error) {
			return keychains.ListKeychains(mysqlConfig, reqJson)
		})
	})
	r.POST("/api/keychains/create", func(c *gin.Context) {
		wrapHandler(c, func(c *gin.Context, reqJson []byte) (interface{}, error) {
			return keychains.CreateKeychain(mysqlConfig, reqJson)
		})
	})
	r.POST("/api/keychains/view", func(c *gin.Context) {
		wrapHandler(c, func(c *gin.Context, reqJson []byte) (interface{}, error) {
			return keychains.ViewKeychain(mysqlConfig, reqJson)
		})
	})
	r.POST("/api/keychains/update", func(c *gin.Context) {
		wrapHandler(c, func(c *gin.Context, reqJson []byte) (interface{}, error) {
			return keychains.UpdateKeychain(mysqlConfig, reqJson)
		})
	})
	r.POST("/api/keychains/delete", func(c *gin.Context) {
		wrapHandler(c, func(c *gin.Context, reqJson []byte) (interface{}, error) {
			return keychains.DeleteKeychain(mysqlConfig, reqJson)
		})
	})

	// Key copy handlers
	r.POST("/api/keycopies/list-by-keychain", func(c *gin.Context) {
		wrapHandler(c, func(c *gin.Context, reqJson []byte) (interface{}, error) {
			return keycopies.ListCopiesByKeychain(mysqlConfig, reqJson)
		})
	})
	r.POST("/api/keycopies/create", func(c *gin.Context) {
		wrapHandler(c, func(c *gin.Context, reqJson []byte) (interface{}, error) {
			return keycopies.CreateCopy(mysqlConfig, reqJson)
		})
	})

	// ================================================================================
	// SERVE
	// ================================================================================

	r.Run(":4200")
}
