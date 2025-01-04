package keychains

import (
	"database/sql"

	"github.com/go-sql-driver/mysql"
)

func ListKeychains(mysqlConfig mysql.Config) ([]Keychain, error) {
	// Open connection
	db, err := sql.Open("mysql", mysqlConfig.FormatDSN())
	if err != nil {
		return nil, err
	}

	// Query
	rows, err := db.Query("SELECT keychain_id, description FROM keychains")
	if err != nil {
		if err != nil {
			return nil, err
		}
	}
	defer rows.Close()

	// Parse
	var keychains []Keychain
	for rows.Next() {
		var row Keychain
		// for each row, scan the result into our tag composite object
		err = rows.Scan(&row.KeychainID, &row.Description)
		if err != nil {
			return nil, err
		}
		keychains = append(keychains, row)
	}
	return keychains, nil
}
