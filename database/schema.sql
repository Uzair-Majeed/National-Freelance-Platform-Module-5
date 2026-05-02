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
