BEGIN;
INSERT INTO migrations (ref) VALUES (4);

-- relationship_type is constrained to the three values defined by you
CREATE TABLE edge (
  node_a_id BIGINT NOT NULL REFERENCES node(id) ON DELETE CASCADE,
  node_b_id BIGINT NOT NULL REFERENCES node(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL CHECK (relationship_type IN ('contains','point','parent')),
  PRIMARY KEY (node_a_id, node_b_id, relationship_type)
);

COMMIT; 