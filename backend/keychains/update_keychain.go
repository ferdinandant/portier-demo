package keychains

import (
	"database/sql"
	"encoding/json"
	"errors"

	"github.com/go-sql-driver/mysql"
)

type UpdateKeychainRequest struct {
	KeychainID  string `json:"keychainID"`
	Description string `json:"description"`
}

type UpdateKeychainResponse struct {
}

func UpdateKeychain(mysqlConfig mysql.Config, reqJson []byte) (*UpdateKeychainResponse, error) {
	// Read input
	var reqObj UpdateKeychainRequest
	err := json.Unmarshal(reqJson, &reqObj)
	if err != nil {
		return nil, err
	}

	// Validate
	if reqObj.KeychainID == "" {
		return nil, errors.New("argument KeychainID is required")
	}
	if reqObj.Description == "" {
		return nil, errors.New("argument Description is required")
	}

	// Open connection
	db, err := sql.Open("mysql", mysqlConfig.FormatDSN())
	if err != nil {
		return nil, err
	}

	// Update table
	result, err := db.Exec(
		`
		UPDATE keychains
		SET description = ?
		WHERE keychain_id = ?
		`,
		reqObj.Description,
		reqObj.KeychainID,
	)
	if err != nil {
		return nil, err
	}
	// Check effect
	rows, err := result.RowsAffected()
	if err != nil {
		return nil, err
	}
	if rows == 0 {
		return nil, errors.New("no row was affected")
	}

	return &UpdateKeychainResponse{}, nil
}
