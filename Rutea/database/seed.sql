BEGIN;
INSERT INTO roles (code) VALUES ('traveler'), ('moderator'), ('admin'), ('auditor')
ON CONFLICT DO NOTHING;
INSERT INTO policy_versions (version) VALUES ('preview-1')
ON CONFLICT DO NOTHING;
COMMIT;
