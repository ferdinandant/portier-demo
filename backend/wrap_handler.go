package main

import (
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler func(c *gin.Context, reqJson []byte) (interface{}, error)

func wrapHandler(c *gin.Context, handler Handler) {
	reqJson, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"errors":  []string{err.Error()},
		})
		return
	}
	// Query
	data, err := handler(c, reqJson)
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
}
