BEGIN;
INSERT INTO migrations (ref) VALUES (5);

CREATE INDEX idx_member_user    ON member(user_id);
CREATE INDEX idx_team_client    ON team(client_id);
CREATE INDEX idx_project_team   ON project(team_id);
CREATE INDEX idx_project_member ON project(member_id);

CREATE INDEX idx_node_project   ON node(project_id);
CREATE INDEX idx_edge_a         ON edge(node_a_id);
CREATE INDEX idx_edge_b         ON edge(node_b_id);

CREATE INDEX idx_node_artifact_node    ON node_artifact(node_id);
CREATE INDEX idx_node_artifact_artifact ON node_artifact(artifact_id);

COMMIT; 