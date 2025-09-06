BEGIN;
INSERT INTO migrations (ref) VALUES (3);

-- Node: metadata as JSONB (Postgres), all other fields per diagram
CREATE TABLE node (
  id BIGSERIAL PRIMARY KEY,
  metadata JSONB,         -- free-form
  project_id BIGINT REFERENCES project(id),
  type  TEXT,
  label TEXT,
  description TEXT
);

CREATE TABLE artifact (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  base_url_id BIGINT REFERENCES url(id),
  url_identifier TEXT NOT NULL
);

-- many-to-many Node <-> Artifact
CREATE TABLE node_artifact (
  node_id BIGINT NOT NULL REFERENCES node(id)       ON DELETE CASCADE,
  artifact_id BIGINT NOT NULL REFERENCES artifact(id) ON DELETE CASCADE,
  PRIMARY KEY (node_id, artifact_id)
);

COMMIT; 