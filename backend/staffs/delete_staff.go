package staffs

import (
	"database/sql"
	"encoding/json"
	"errors"

	"github.com/go-sql-driver/mysql"
)

type DeleteStaffRequest struct {
	StaffID string `json:"staffID"`
}

type DeleteStaffResponse struct {
}

func DeleteStaff(mysqlConfig mysql.Config, reqJson []byte) (*DeleteStaffResponse, error) {
	// Read input
	var reqObj DeleteStaffRequest
	err := json.Unmarshal(reqJson, &reqObj)
	if err != nil {
		return nil, err
	}

	// Validate
	if reqObj.StaffID == "" {
		return nil, errors.New("argument StaffID is required")
	}

	// Open connection
	db, err := sql.Open("mysql", mysqlConfig.FormatDSN())
	if err != nil {
		return nil, err
	}

	// Update table
	result, err := db.Exec(
		`
		DELETE FROM staffs
		WHERE staff_id = ?
		`,
		reqObj.StaffID,
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
		return nil, errors.New("the keychain was not found")
	}

	return &DeleteStaffResponse{}, nil
}
