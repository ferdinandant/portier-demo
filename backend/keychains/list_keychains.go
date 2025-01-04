package keychains

import (
	"database/sql"
	"encoding/json"
	"math"

	"github.com/go-sql-driver/mysql"
)

type ListKeychainsRequest struct {
	Filter string `json:"filter"`
	Page   int    `json:"page"`
}

type ListKeychainsResponse struct {
	Count     int
	MaxPage   int
	Keychains []Keychain
}

func ListKeychains(mysqlConfig mysql.Config, reqJson []byte) (*ListKeychainsResponse, error) {
	// Read input
	var reqObj ListKeychainsRequest
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
		FROM keychains
		WHERE description LIKE CONCAT('%', ?, '%')
		`,
		reqObj.Filter,
	)
	var rowCount int
	countRow.Scan(&rowCount)

	// Query for data
	offset := 10 * (reqObj.Page - 1)
	keychainRows, err := db.Query(
		`
		SELECT keychain_id, description
		FROM keychains
		WHERE description LIKE CONCAT('%', ?, '%')
		ORDER BY description
		LIMIT 10 OFFSET ?
		`,
		reqObj.Filter,
		offset,
	)
	if err != nil {
		if err != nil {
			return nil, err
		}
	}
	defer keychainRows.Close()
	// Parse
	keychains := make([]Keychain, 0)
	for keychainRows.Next() {
		var keychain Keychain
		err = keychainRows.Scan(&keychain.KeychainID, &keychain.Description)
		if err != nil {
			return nil, err
		}
		keychains = append(keychains, keychain)
	}

	// Return
	return &ListKeychainsResponse{
		Count:     rowCount,
		MaxPage:   int(math.Ceil(float64(rowCount) / 10)),
		Keychains: keychains,
	}, nil
}
