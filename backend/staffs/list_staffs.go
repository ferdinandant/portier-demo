package staffs

import (
	"database/sql"
	"encoding/json"
	"math"

	"github.com/go-sql-driver/mysql"
)

type ListStaffsRequest struct {
	Filter string `json:"filter"`
	Page   int    `json:"page"`
}

type ListStaffsResponse struct {
	Count    int
	MaxPage  int
	PageSize int
	Staffs   []Staff
}

func ListStaffs(mysqlConfig mysql.Config, reqJson []byte) (*ListStaffsResponse, error) {
	pageSize := 10

	// Read input
	var reqObj ListStaffsRequest
	err := json.Unmarshal(reqJson, &reqObj)
	if err != nil {
		return nil, err
	}

	// Open connection
	db, err := sql.Open("mysql", mysqlConfig.FormatDSN())
	if err != nil {
		return nil, err
	}

	// Query for total
	countRow := db.QueryRow(
		`
		SELECT COUNT(*)
		FROM staffs
		WHERE name LIKE CONCAT('%', ?, '%')
		`,
		reqObj.Filter,
	)
	var rowCount int
	countRow.Scan(&rowCount)

	// Query for data
	offset := pageSize * (reqObj.Page - 1)
	staffRows, err := db.Query(
		`
		SELECT staff_id, name
		FROM staffs
		WHERE name LIKE CONCAT('%', ?, '%')
		ORDER BY name
		LIMIT ? OFFSET ?
		`,
		reqObj.Filter,
		pageSize,
		offset,
	)
	if err != nil {
		return nil, err
	}
	defer staffRows.Close()
	// Parse
	staffs := make([]Staff, 0)
	for staffRows.Next() {
		var staff Staff
		err = staffRows.Scan(&staff.StaffID, &staff.Name)
		if err != nil {
			return nil, err
		}
		staffs = append(staffs, staff)
	}

	// Return
	return &ListStaffsResponse{
		Count:    rowCount,
		MaxPage:  int(math.Ceil(float64(rowCount) / float64(pageSize))),
		PageSize: pageSize,
		Staffs:   staffs,
	}, nil
}
