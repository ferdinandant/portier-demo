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
	_, err = db.Exec(
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

	return &UpdateKeychainResponse{}, nil
}
