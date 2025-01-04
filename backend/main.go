package main

import (
	"encoding/json"
	"io"
	"net/http"
	"os"

	"github.com/ferdinandant/portier-demo/keychains"
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
	defer mysqlSecretFile.Close()
	if err != nil {
		panic("mysql secret file is not found")
	}
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

	r.POST("/api/keychains/list", func(c *gin.Context) {
		reqJson, err := io.ReadAll(c.Request.Body)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"errors":  []string{err.Error()},
			})
			return
		}
		// Query
		data, err := keychains.ListKeychains(mysqlConfig, reqJson)
		// Response
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"errors":  []string{err.Error()},
			})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data":    data,
		})
	})

	// listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
	r.Run(":4200")
}
