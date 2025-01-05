package keycopies

import (
	"database/sql"
	"encoding/json"
	"errors"
	"math"

	"github.com/go-sql-driver/mysql"
)

type ListCopiesByStaffRequest struct {
	StaffID string `json:"staffID"`
	Filter  string `json:"filter"`
	Page    int    `json:"page"`
}

type ListCopiesByStaffResponse struct {
	Count     int
	MaxPage   int
	PageSize  int
	KeyCopies []KeyCopyByStaff
}

type KeyCopyByStaff struct {
	KeyID               string
	DateCreated         string
	KeychainID          string
	KeychainDescription string
}

func ListCopiesByStaff(mysqlConfig mysql.Config, reqJson []byte) (*ListCopiesByStaffResponse, error) {
	pageSize := 5

	// Read input
	var reqObj ListCopiesByStaffRequest
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
	countRow := db.QueryRow(
		`
		SELECT COUNT(*) FROM keycopies
		INNER JOIN keychains ON
		  keycopies.keychain_id = keychains.keychain_id
		WHERE
		  keycopies.staff_id = ?
		  AND (
		    keycopies.key_id LIKE CONCAT('%', ?, '%')
		    OR keychains.keychain_id LIKE CONCAT('%', ?, '%')
		    OR keychains.description LIKE CONCAT('%', ?, '%')
	      )
		ORDER BY keycopies.date_created DESC
		`,
		reqObj.StaffID,
		reqObj.Filter,
		reqObj.Filter,
		reqObj.Filter,
	)
	var rowCount int
	countRow.Scan(&rowCount)

	// Query for data
	offset := pageSize * (reqObj.Page - 1)
	keychainRows, err := db.Query(
		`
		SELECT keycopies.key_id, keycopies.date_created, keychains.keychain_id, keychains.description
		FROM keycopies
		INNER JOIN keychains ON
		  keycopies.keychain_id = keychains.keychain_id
		WHERE
		  keycopies.staff_id = ?
		  AND (
		    keycopies.key_id LIKE CONCAT('%', ?, '%')
		    OR keychains.keychain_id LIKE CONCAT('%', ?, '%')
		    OR keychains.description LIKE CONCAT('%', ?, '%')
	      )
		ORDER BY keycopies.date_created DESC
		LIMIT ? OFFSET ?
		`,
		reqObj.StaffID,
		reqObj.Filter,
		reqObj.Filter,
		reqObj.Filter,
		pageSize,
		offset,
	)
	if err != nil {
		return nil, err
	}
	defer keychainRows.Close()
	// Parse
	keyCopies := make([]KeyCopyByStaff, 0)
	for keychainRows.Next() {
		var keyCopy KeyCopyByStaff
		err = keychainRows.Scan(
			&keyCopy.KeyID,
			&keyCopy.DateCreated,
			&keyCopy.KeychainID,
			&keyCopy.KeychainDescription,
		)
		if err != nil {
			return nil, err
		}
		keyCopies = append(keyCopies, keyCopy)
	}

	// Return
	return &ListCopiesByStaffResponse{
		Count:     rowCount,
		MaxPage:   int(math.Ceil(float64(rowCount) / float64(pageSize))),
		PageSize:  pageSize,
		KeyCopies: keyCopies,
	}, nil
}
