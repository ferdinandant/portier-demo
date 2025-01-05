package staffs

import (
	"database/sql"
	"encoding/json"
	"errors"

	"github.com/go-sql-driver/mysql"
)

type ViewStaffRequest struct {
	StaffID string `json:"staffID"`
}

type ViewStaffResponse struct {
	StaffID     string
	Name        string
	DateCreated string
}

func ViewStaff(mysqlConfig mysql.Config, reqJson []byte) (*ViewStaffResponse, error) {
	// Read input
	var reqObj ViewStaffRequest
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

	// Query for total
	row := db.QueryRow(
		`
		SELECT staff_id, name, date_created
		FROM staffs
		WHERE staff_id = ?
		`,
		reqObj.StaffID,
	)
	var res ViewStaffResponse
	err = row.Scan(&res.StaffID, &res.Name, &res.DateCreated)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	} else if err != nil {
		return nil, err
	}

	// Return
	return &res, nil
}
