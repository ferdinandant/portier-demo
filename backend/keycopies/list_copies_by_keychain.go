package keycopies

import (
	"database/sql"
	"encoding/json"
	"errors"
	"math"

	"github.com/go-sql-driver/mysql"
)

type ListCopiesByKeychainRequest struct {
	KeychainID string `json:"keychainID"`
	Filter     string `json:"filter"`
	Page       int    `json:"page"`
}

type ListCopiesByKeychainResponse struct {
	Count     int
	MaxPage   int
	PageSize  int
	KeyCopies []KeyCopyInKeychain
}

type KeyCopyInKeychain struct {
	KeyID       string
	DateCreated string
	StaffID     sql.NullString
	StaffName   sql.NullString
}

func ListCopiesByKeychain(mysqlConfig mysql.Config, reqJson []byte) (*ListCopiesByKeychainResponse, error) {
	pageSize := 5

	// Read input
	var reqObj ListCopiesByKeychainRequest
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

	// Query for total
	countRow := db.QueryRow(
		`
		SELECT COUNT(*) FROM keycopies
		LEFT JOIN staffs ON
		  staffs.staff_id = keycopies.staff_id
		  AND keycopies.keychain_id = ?
		WHERE
		  keycopies.keychain_id = ?
		  AND (
		    keycopies.key_id LIKE CONCAT('%', ?, '%')
		    OR staffs.staff_id LIKE CONCAT('%', ?, '%')
		    OR staffs.name LIKE CONCAT('%', ?, '%')
	      )
		`,
		reqObj.KeychainID,
		reqObj.KeychainID,
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
		SELECT keycopies.key_id, keycopies.date_created, staffs.staff_id, staffs.name FROM keycopies
		LEFT JOIN staffs ON
		  staffs.staff_id = keycopies.staff_id
		  AND keycopies.keychain_id = ?
		WHERE
		  keycopies.keychain_id = ?
		  AND (
		    keycopies.key_id LIKE CONCAT('%', ?, '%')
		    OR staffs.staff_id LIKE CONCAT('%', ?, '%')
		    OR staffs.name LIKE CONCAT('%', ?, '%')
	      )
		ORDER BY keycopies.date_created DESC
		LIMIT ? OFFSET ?
		`,
		reqObj.KeychainID,
		reqObj.KeychainID,
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
	keyCopies := make([]KeyCopyInKeychain, 0)
	for keychainRows.Next() {
		var keyCopy KeyCopyInKeychain
		err = keychainRows.Scan(
			&keyCopy.KeyID,
			&keyCopy.DateCreated,
			&keyCopy.StaffID,
			&keyCopy.StaffName,
		)
		if err != nil {
			return nil, err
		}
		keyCopies = append(keyCopies, keyCopy)
	}

	// Return
	return &ListCopiesByKeychainResponse{
		Count:     rowCount,
		MaxPage:   int(math.Ceil(float64(rowCount) / float64(pageSize))),
		PageSize:  pageSize,
		KeyCopies: keyCopies,
	}, nil
}
