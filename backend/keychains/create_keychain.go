package keychains

import (
	"database/sql"
	"encoding/json"
	"errors"

	"github.com/go-sql-driver/mysql"
	"github.com/google/uuid"
)

type CreateKeychainRequest struct {
	Description string `json:"description"`
}

type CreateKeychainResponse struct {
	KeychainId string
}

func CreateKeychain(mysqlConfig mysql.Config, reqJson []byte) (*CreateKeychainResponse, error) {
	// Read input
	var reqObj CreateKeychainRequest
	err := json.Unmarshal(reqJson, &reqObj)
	if err != nil {
		return nil, err
	}

	// Validate
	if reqObj.Description == "" {
		return nil, errors.New("description is required")
	}

	// Open connection
	db, err := sql.Open("mysql", mysqlConfig.FormatDSN())
	if err != nil {
		return nil, err
	}

	// Insert to table
	keychainID := uuid.New().String()
	_, err = db.Exec(
		`INSERT INTO keychains (keychain_id, description) VALUES (?, ?)`,
		keychainID,
		reqObj.Description,
	)
	if err != nil {
		return nil, err
	}

	// Create a new key copy
	keyID := uuid.New().String()
	_, err = db.Exec(
		`INSERT INTO keycopies (key_id, keychain_id) VALUES (?, ?)`,
		keyID,
		keychainID,
	)
	if err != nil {
		return nil, err
	}

	return &CreateKeychainResponse{
		KeychainId: keychainID,
	}, nil
}
