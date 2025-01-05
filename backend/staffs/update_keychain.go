package staffs

import (
	"database/sql"
	"encoding/json"
	"errors"

	"github.com/go-sql-driver/mysql"
)

type UpdateStaffRequest struct {
	StaffID string `json:"staffID"`
	Name    string `json:"name"`
}

type UpdateStaffResponse struct {
}

func UpdateStaff(mysqlConfig mysql.Config, reqJson []byte) (*UpdateStaffResponse, error) {
	// Read input
	var reqObj UpdateStaffRequest
	err := json.Unmarshal(reqJson, &reqObj)
	if err != nil {
		return nil, err
	}

	// Validate
	if reqObj.StaffID == "" {
		return nil, errors.New("argument StaffID is required")
	}
	if reqObj.Name == "" {
		return nil, errors.New("argument Name is required")
	}

	// Open connection
	db, err := sql.Open("mysql", mysqlConfig.FormatDSN())
	if err != nil {
		return nil, err
	}

	// Update table
	_, err = db.Exec(
		`
		UPDATE staffs
		SET name = ?
		WHERE keychain_id = ?
		`,
		reqObj.Name,
		reqObj.StaffID,
	)
	if err != nil {
		return nil, err
	}

	return &UpdateStaffResponse{}, nil
}
