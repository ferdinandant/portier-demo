package keychains

import (
	"database/sql"
	"encoding/json"
	"errors"

	"github.com/go-sql-driver/mysql"
)

type ViewKeychainRequest struct {
	KeychainID string `json:"keychainID"`
}

type ViewKeychainResponse struct {
	KeychainID  string
	Description string
	DateCreated string
}

func ViewKeychain(mysqlConfig mysql.Config, reqJson []byte) (*ViewKeychainResponse, error) {
	// Read input
	var reqObj ViewKeychainRequest
	err := json.Unmarshal(reqJson, &reqObj)
	if err != nil {
		return nil, err
	}

	// Validate
	if reqObj.KeychainID == "" {
		return nil, errors.New("parameter KeychainID is required")
	}

	// Open connection
	db, err := sql.Open("mysql", mysqlConfig.FormatDSN())
	if err != nil {
		return nil, err
	}

	// Query for total
	row := db.QueryRow(
		`
		SELECT keychain_id, description, date_created
		FROM keychains
		WHERE keychain_id = ?
		`,
		reqObj.KeychainID,
	)
	var res ViewKeychainResponse
	err = row.Scan(&res.KeychainID, &res.Description, &res.DateCreated)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	// Return
	return &res, nil
}
