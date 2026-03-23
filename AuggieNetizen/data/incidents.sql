-- =============================================

--  AuggieNETICEN — Database Schema

--  Run this to set up your tables

-- =============================================

-- Incidents table

-- Stores every report submitted on campus

CREATE TABLE IF NOT EXISTS incidents (

    id          INTEGER PRIMARY KEY AUTOINCREMENT,

    type        TEXT    NOT NULL,

    title       TEXT    NOT NULL,

    description TEXT,

    lat         REAL,

    lng         REAL,

    address     TEXT,

    severity    TEXT    DEFAULT 'medium',   -- low | medium | high | critical

    status      TEXT    DEFAULT 'unverified', -- unverified | active | resolved

    reported_by TEXT,

    upvotes     INTEGER DEFAULT 0,

    created_at  TEXT    DEFAULT (datetime('now'))

);

-- Comments table

-- Stores comments linked to a specific incident

CREATE TABLE IF NOT EXISTS comments (

    id          INTEGER PRIMARY KEY AUTOINCREMENT,

    incident_id INTEGER REFERENCES incidents(id) ON DELETE CASCADE,

    username    TEXT,

    text        TEXT NOT NULL,

    created_at  TEXT DEFAULT (datetime('now'))

);

-- =============================================

--  Sample Data — Augsburg Campus

-- =============================================

INSERT INTO incidents (type, title, description, lat, lng, address, severity, status, upvotes) VALUES

    ('suspicious_activity', 'Suspicious person near Murphy Square',    'Individual in all-black near bike racks for 20+ min.',  44.9431, -93.1678, 'Murphy Square Park, Minneapolis MN',       'high',     'active',   14),

    ('fire',                'Fire alarm — Christensen Center',         'Pulled alarm, no smoke. MPLS Fire confirmed false.',    44.9418, -93.1685, 'Christensen Center, Augsburg University',   'medium',   'resolved',  8),

    ('car_accident',        'Fender bender on 7th St & 21st Ave',      'Two vehicles. No injuries. Right lane blocked.',        44.9405, -93.1660, '7th St & 21st Ave S, Minneapolis MN',       'low',      'active',    5),

    ('medical',             'Medical emergency — Anderson Hall',        'Student down near main entrance. EMS called.',          44.9425, -93.1672, 'Anderson Hall, Augsburg University',        'critical', 'resolved', 21),

    ('break_in',            'Attempted break-in — Science Hall lot',   'Car window smashed. Police en route.',                  44.9440, -93.1690, 'Science Hall Lot, Augsburg University',    'high',     'active',    9);