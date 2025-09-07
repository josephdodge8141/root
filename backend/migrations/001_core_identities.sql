BEGIN;
INSERT INTO migrations (ref) VALUES (1);

-- identifiers as BIGSERIAL for simplicity; names as TEXT
CREATE TABLE "user" (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE client (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE member (
  id BIGSERIAL PRIMARY KEY,
  first_name TEXT,
  last_name  TEXT,
  user_id BIGINT REFERENCES "user"(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE team (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  client_id BIGINT REFERENCES client(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- many-to-many with role between team and member
CREATE TABLE team_member (
  team_id   BIGINT NOT NULL REFERENCES team(id)   ON DELETE CASCADE,
  member_id BIGINT NOT NULL REFERENCES member(id) ON DELETE CASCADE,
  role      TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (team_id, member_id)
);

COMMIT; 