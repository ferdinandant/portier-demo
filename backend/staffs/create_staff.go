package staffs

import (
	"database/sql"
	"encoding/json"
	"errors"

	"github.com/go-sql-driver/mysql"
	"github.com/google/uuid"
)

type CreateStaffRequest struct {
	Name string `json:"name"`
}

type CreateStaffResponse struct {
	StaffID string
}

func CreateStaff(mysqlConfig mysql.Config, reqJson []byte) (*CreateStaffResponse, error) {
	// Read input
	var reqObj CreateStaffRequest
	err := json.Unmarshal(reqJson, &reqObj)
	if err != nil {
		return nil, err
	}

	// Validate
	if reqObj.Name == "" {
		return nil, errors.New("argument Name is required")
	}

	// Open connection
	db, err := sql.Open("mysql", mysqlConfig.FormatDSN())
	if err != nil {
		return nil, err
	}

	// Insert to table
	staffID := uuid.New().String()
	_, err = db.Exec(
		`INSERT INTO staffs (staff_id, name) VALUES (?, ?)`,
		staffID,
		reqObj.Name,
	)
	if err != nil {
		return nil, err
	}

	return &CreateStaffResponse{
		StaffID: staffID,
	}, nil
}
