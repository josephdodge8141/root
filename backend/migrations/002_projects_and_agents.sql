BEGIN;
INSERT INTO migrations (ref) VALUES (2);

CREATE TABLE project (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  team_id   BIGINT REFERENCES team(id),
  member_id BIGINT REFERENCES member(id)
);

CREATE TABLE project_graph (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT REFERENCES project(id),
  persona TEXT NOT NULL
);

CREATE TABLE url (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT REFERENCES project(id),
  url TEXT NOT NULL
);

CREATE TABLE agents (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  prompt TEXT,
  temperature NUMERIC
);

COMMIT; 