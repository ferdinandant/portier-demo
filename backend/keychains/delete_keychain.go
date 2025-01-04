package keychains

import (
	"database/sql"
	"encoding/json"
	"errors"

	"github.com/go-sql-driver/mysql"
)

type DeleteKeychainRequest struct {
	KeychainID string `json:"keychainID"`
}

type DeleteKeychainResponse struct {
}

func DeleteKeychain(mysqlConfig mysql.Config, reqJson []byte) (*DeleteKeychainResponse, error) {
	// Read input
	var reqObj DeleteKeychainRequest
	err := json.Unmarshal(reqJson, &reqObj)
	if err != nil {
		return nil, err
	}

	// Validate
	if reqObj.KeychainID == "" {
		return nil, errors.New("keychain ID is required")
	}

	// Open connection
	db, err := sql.Open("mysql", mysqlConfig.FormatDSN())
	if err != nil {
		return nil, err
	}

	// Update table
	_, err = db.Exec(
		`
		DELETE FROM keychains
		WHERE keychain_id = ?
		`,
		reqObj.KeychainID,
	)
	if err != nil {
		return nil, err
	}

	return &DeleteKeychainResponse{}, nil
}
