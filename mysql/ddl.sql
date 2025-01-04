CREATE DATABASE IF NOT EXISTS portier_demo;
USE portier_demo;

CREATE TABLE IF NOT EXISTS keychains (
  keychain_id VARCHAR(255) PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS keygroups (
  group_id VARCHAR(255) PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staff (
  staff_id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS keycopies (
  key_id VARCHAR(255) PRIMARY KEY,
  keychain_id VARCHAR(255) NOT NULL,
  staff_id VARCHAR(255),
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (keychain_id) REFERENCES keychains(keychain_id) ON DELETE CASCADE,
  FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS locks (
  lock_id VARCHAR(255) PRIMARY KEY,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  description VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS keygroups_locks (
  group_id VARCHAR(255) NOT NULL,
  lock_id VARCHAR(255) NOT NULL,
  PRIMARY KEY (group_id, lock_id),
  FOREIGN KEY (group_id) REFERENCES keygroups(group_id) ON DELETE CASCADE,
  FOREIGN KEY (lock_id) REFERENCES locks(lock_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS keygroups_keygroups (
  super_group_id VARCHAR(255) NOT NULL,
  sub_group_id VARCHAR(255) NOT NULL,
  PRIMARY KEY (super_group_id, sub_group_id),
  FOREIGN KEY (super_group_id) REFERENCES keygroups(group_id) ON DELETE CASCADE,
  FOREIGN KEY (sub_group_id) REFERENCES keygroups(group_id) ON DELETE CASCADE
);

SELECT keycopies.key_id, keycopies.date_created, staff.staff_id, staff.name FROM keycopies
LEFT JOIN staff ON
  staff.staff_id=keycopies.staff_id
  AND keycopies.keychain_id = 'a7ba3f3a-528b-4325-83b8-6714a2969ebf'
ORDER BY keycopies.date_created DESC
LIMIT ? OFFSET ?

SELECT keycopies.key_id, keycopies.date_created, staff.staff_id, staff.name FROM keycopies
LEFT JOIN staff ON
  staff.staff_id=keycopies.staff_id
  AND keycopies.keychain_id = 'a7ba3f3a-528b-4325-83b8-6714a2969ebf'
WHERE
  keycopies.keychain_id LIKE CONCAT('%', 'a', '%')


SELECT keycopies.key_id, keycopies.date_created, staff.staff_id, staff.name FROM keycopies
		LEFT JOIN staff ON
		  staff.staff_id = keycopies.staff_id
		  AND keycopies.keychain_id = '48c2c6e7-68ce-4fca-9a63-af26006fee4e'