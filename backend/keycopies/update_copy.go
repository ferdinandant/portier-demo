package keycopies

import (
	"database/sql"
	"encoding/json"
	"errors"

	"github.com/ferdinandant/portier-demo/utils"
	"github.com/go-sql-driver/mysql"
)

type UpdateCopyRequest struct {
	KeyID   string `json:"keyID"`
	StaffID string `json:"staffID"`
}

type UpdateCopyResponse struct {
}

func UpdateCopy(mysqlConfig mysql.Config, reqJson []byte) (*UpdateCopyResponse, error) {
	// Read input
	var reqObj UpdateCopyRequest
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
	_, err = db.Exec(
		`
		UPDATE keycopies
		SET staff_id = ?
		WHERE key_id = ?
		`,
		utils.NewNullString(reqObj.StaffID),
		reqObj.KeyID,
	)
	if err != nil {
		return nil, err
	}

	return &UpdateCopyResponse{}, nil
}
