-- 1. Cleanup: Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS ACTIVITY_LOGS;
DROP TABLE IF EXISTS FILES;
DROP TABLE IF EXISTS TASKS;
DROP TABLE IF EXISTS WORKSPACE_INVITATIONS;
DROP TABLE IF EXISTS WORKSPACE_MEMBERS;
DROP TABLE IF EXISTS WORKSPACE_ROLES;
DROP TABLE IF EXISTS WORKSPACES;
DROP TABLE IF EXISTS USERS;
-- =====================================================================
-- National Freelance Platform - Module 5: Collaboration & Team Workspace
-- Database Schema
-- =====================================================================
-- =====================================================================
-- National Freelance Platform - Module 5: Collaboration & Team Workspace
-- Database Schema (Standardized with workspace_ prefix)
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Identity mapping)
CREATE TABLE IF NOT EXISTS workspace_users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Workspace Registry
CREATE TABLE IF NOT EXISTS workspace_list (
    workspace_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    created_by UUID NOT NULL REFERENCES workspace_users(user_id),
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL
);

-- 3. Roles and Permissions
CREATE TABLE IF NOT EXISTS workspace_roles (
    role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspace_list(workspace_id),
    role_name VARCHAR(100) NOT NULL,
    permissions JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (workspace_id, role_name)
);

-- 4. Membership Mapping
CREATE TABLE IF NOT EXISTS workspace_members (
    workspace_id UUID NOT NULL REFERENCES workspace_list(workspace_id),
    user_id UUID NOT NULL REFERENCES workspace_users(user_id),
    role_id UUID NOT NULL REFERENCES workspace_roles(role_id),
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (workspace_id, user_id)
);

-- 5. Invitations
CREATE TABLE IF NOT EXISTS workspace_invitations (
    invitation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspace_list(workspace_id),
    invited_by UUID NOT NULL REFERENCES workspace_users(user_id),
    invitee_user_id UUID NULL REFERENCES workspace_users(user_id),
    invitee_email VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    invited_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMPTZ NULL,
    UNIQUE (workspace_id, invitee_email)
);

-- 6. Task Management
CREATE TABLE IF NOT EXISTS workspace_tasks (
    task_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspace_list(workspace_id),
    parent_task_id UUID NULL REFERENCES workspace_tasks(task_id),
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    status VARCHAR(20) DEFAULT 'TODO',
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    assigned_to UUID NULL REFERENCES workspace_users(user_id),
    created_by UUID NOT NULL REFERENCES workspace_users(user_id),
    deadline TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL
);

-- 7. File Management
CREATE TABLE IF NOT EXISTS workspace_files (
    file_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspace_list(workspace_id),
    task_id UUID NULL REFERENCES workspace_tasks(task_id),
    uploaded_by UUID NOT NULL REFERENCES workspace_users(user_id),
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    mime_type VARCHAR(100) NULL,
    file_size_bytes BIGINT NOT NULL,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL
);

-- 8. Audit Logs
CREATE TABLE IF NOT EXISTS workspace_activity_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspace_list(workspace_id),
    actor_user_id UUID NOT NULL REFERENCES workspace_users(user_id),
    action_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    old_value JSONB NULL,
    new_value JSONB NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);




-- CHAT MODULE

-- REFINED MODULE 6 SCHEMA FOR SUPABASE INTEGRATION
-- Linked to your existing 'users' and 'workspaces' tables
-- 1. CLEANUP: Drop existing chat tables (Order matters due to foreign keys)-- 1. FORCED CLEANUP (CASCADE handles any hidden dependencies)
DROP TABLE IF EXISTS chat_message_receipts CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_room_members CASCADE;
DROP TABLE IF EXISTS chat_rooms CASCADE;

-- 2. RE-DEPLOYMENT WITH CORRECT TYPES

-- Chat Rooms
CREATE TABLE chat_rooms (
    id SERIAL PRIMARY KEY,
    uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    room_type VARCHAR(10) NOT NULL CHECK (room_type IN ('direct', 'group')),
    room_name VARCHAR(100),
    workspace_id UUID NOT NULL,     -- Matches your workspace_list(workspace_id)
    created_by UUID NOT NULL,       -- Matches workspace_users(user_id)
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CHECK ((room_type = 'direct' AND room_name IS NULL) OR (room_type = 'group' AND room_name IS NOT NULL))
);

-- Chat Messages
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    room_id INTEGER NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL,        -- Matches workspace_users(user_id)
    reply_to_msg_id INTEGER REFERENCES chat_messages(id) ON DELETE SET NULL,
    message_type VARCHAR(15) DEFAULT 'text' CHECK (message_type IN ('text', 'media', 'meeting_link', 'system', 'file')),
    content TEXT,
    media_id UUID,                  -- Matches workspace_files(file_id)
    status VARCHAR(10) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. INDEXES
CREATE INDEX idx_chat_rooms_workspace ON chat_rooms(workspace_id);
CREATE INDEX idx_chat_messages_room ON chat_messages(room_id);
CREATE INDEX idx_chat_messages_sender ON chat_messages(sender_id);
