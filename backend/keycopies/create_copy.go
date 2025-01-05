package keycopies

import (
	"database/sql"
	"encoding/json"
	"errors"

	"github.com/go-sql-driver/mysql"
	"github.com/google/uuid"
)

type CreateCopyRequest struct {
	KeychainID string `json:"keychainID"`
}

type CreateCopyResponse struct {
	KeyID string
}

func CreateCopy(mysqlConfig mysql.Config, reqJson []byte) (*CreateCopyResponse, error) {
	// Read input
	var reqObj CreateCopyRequest
	err := json.Unmarshal(reqJson, &reqObj)
	if err != nil {
		return nil, err
	}

	// Validate
	if reqObj.KeychainID == "" {
		return nil, errors.New("argument KeychainID is required")
	}

	// Open connection
	db, err := sql.Open("mysql", mysqlConfig.FormatDSN())
	if err != nil {
		return nil, err
	}

	// Insert to table
	keyID := uuid.New().String()
	_, err = db.Exec(
		`INSERT INTO keycopies (key_id, keychain_id) VALUES (?, ?)`,
		keyID,
		reqObj.KeychainID,
	)
	if err != nil {
		return nil, err
	}

	// Return
	return &CreateCopyResponse{
		KeyID: keyID,
	}, nil
}
