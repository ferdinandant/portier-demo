package keycopies

import (
	"database/sql"
	"encoding/json"
	"errors"

	"github.com/go-sql-driver/mysql"
)

type DeleteCopyRequest struct {
	KeyID string `json:"keyID"`
}

type DeleteCopyResponse struct {
}

func DeleteCopy(mysqlConfig mysql.Config, reqJson []byte) (*DeleteCopyResponse, error) {
	// Read input
	var reqObj DeleteCopyRequest
	err := json.Unmarshal(reqJson, &reqObj)
	if err != nil {
		return nil, err
	}

	// Validate
	if reqObj.KeyID == "" {
		return nil, errors.New("argument KeyID is required")
	}

	// Open connection
	db, err := sql.Open("mysql", mysqlConfig.FormatDSN())
	if err != nil {
		return nil, err
	}

	// Update table
	result, err := db.Exec(
		`
		DELETE FROM keycopies
		WHERE key_id = ?
		`,
		reqObj.KeyID,
	)
	if err != nil {
		return nil, err
	}
	// Check update
	rows, err := result.RowsAffected()
	if err != nil {
		return nil, err
	}
	if rows == 0 {
		return nil, errors.New("no row was affected")
	}

	return &DeleteCopyResponse{}, nil
}
