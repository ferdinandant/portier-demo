CREATE DATABASE IF NOT EXISTS portier_demo;
USE portier_demo;

INSERT INTO keychains (keychain_id, description) VALUES
  ('a7ba3f3a-528b-4325-83b8-6714a2969ebf', 'Grandmaster key'),
  ('c22be859-79ef-44db-babf-55aaf6bf4fe5', 'Office master key'),
  ('48c2c6e7-68ce-4fca-9a63-af26006fee4e', 'Warehouse master key'),
  ('30a614f4-2bbe-418f-b461-87884b4a86f1', 'Zonk keychain 1'),
  ('afb72f39-db7b-496b-b332-6389fe17197c', 'Zonk keychain 2'),
  ('099ac8e4-aec6-452a-9366-d35513d0bee4', 'Zonk keychain 3'),
  ('c72a9d9c-88f7-46a1-8528-87cf9ebdd70b', 'Zonk keychain 4'),
  ('2379a6d1-27e1-48e9-877d-8aef0079a465', 'Zonk keychain 5'),
  ('805a2af8-802c-4920-80e7-d7c8ad15e9db', 'Zonk keychain 6'),
  ('29a115b2-252a-4947-9ab9-789662a9e735', 'Zonk keychain 7'),
  ('e9a0b7ce-9ab0-46be-a836-f0d240735af5', 'Zonk keychain 8'),
  ('5890105e-6a0f-48b9-915b-61c4bb83ed2a', 'Zonk keychain 9'),
  ('1a04e628-2bab-4f8c-a90a-de32a0276345', 'Zonk keychain 10'),
  ('6a52b8b5-813c-4002-8f4d-35d670a57379', 'Zonk keychain 11'),
  ('eac3e2ab-f6ee-4b4d-83df-ededa91e85d2', 'Zonk keychain 12'),
  ('ae8d16dc-9549-47c3-8d99-3d20c8c3930b', 'Zonk keychain 13'),
  ('b7a5bbed-6cf6-4825-b5ea-e241074468b9', 'Zonk keychain 14'),
  ('8911fcb7-9312-4ff5-a284-7a994c524e55', 'Zonk keychain 15'),
  ('c3ecbad7-139a-4c32-a1a4-aaab87958d1a', 'Zonk keychain 16'),
  ('65dee31e-dbc8-43dc-bba4-7c1a7a53c903', 'Zonk keychain 17'),
  ('de0cbe66-d925-443c-b6ec-9be96a38995a', 'Zonk keychain 18'),
  ('3f142e5f-05b3-430d-8c3f-5527ffe62820', 'Zonk keychain 19'),
  ('02aa7567-0a30-4006-a802-872afefaba8a', 'Zonk keychain 20');

INSERT INTO staffs (staff_id, name) VALUES
  ('7829a4b4-3347-47bf-95d1-119df15a8624', 'Pak Pukis'),
  ('6ff99e6b-57d8-486c-ba7a-b8e0b67750df', 'Pak Pancong');

INSERT INTO keycopies (key_id, keychain_id, staff_id) VALUES
  ('cfa7b5b4-ef29-4a3d-b2f3-715f1c526e9a', 'a7ba3f3a-528b-4325-83b8-6714a2969ebf', '7829a4b4-3347-47bf-95d1-119df15a8624'),
  ('920482ca-82a3-4f7f-8aab-e2d2f471d59f', 'a7ba3f3a-528b-4325-83b8-6714a2969ebf', '6ff99e6b-57d8-486c-ba7a-b8e0b67750df'),
  ('fb798884-0ace-4d51-a16c-742114e22a9a', 'a7ba3f3a-528b-4325-83b8-6714a2969ebf', NULL);