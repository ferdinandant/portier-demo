package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/ferdinandant/portier-demo/keychains"
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
	fmt.Printf("%+v\n", mysqlSecret)

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

	r.GET("/api/keychains/list", func(c *gin.Context) {
		// Query
		data, err := keychains.ListKeychains(mysqlConfig)
		// Response
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"errors":  []string{err.Error()},
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": true,
			"data":    data,
		})
	})

	// listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
	r.Run(":4200")
}
