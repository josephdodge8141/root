BEGIN;
INSERT INTO migrations (ref) VALUES (1);

-- identifiers as BIGSERIAL for simplicity; names as TEXT
CREATE TABLE "user" (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

CREATE TABLE client (
  id BIGSERIAL PRIMARY KEY
);

CREATE TABLE member (
  id BIGSERIAL PRIMARY KEY,
  first_name TEXT,
  last_name  TEXT,
  user_id BIGINT REFERENCES "user"(id)
);

CREATE TABLE team (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  client_id BIGINT REFERENCES client(id)
);

-- many-to-many with role between team and member
CREATE TABLE team_member (
  team_id   BIGINT NOT NULL REFERENCES team(id)   ON DELETE CASCADE,
  member_id BIGINT NOT NULL REFERENCES member(id) ON DELETE CASCADE,
  role      TEXT,
  PRIMARY KEY (team_id, member_id)
);

COMMIT; 