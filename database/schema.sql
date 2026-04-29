-- =====================================================================
-- National Freelance Platform - Module 5: Collaboration & Team Workspace
-- Database Schema
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS WORKSPACES (
    workspace_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    created_by UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS WORKSPACE_ROLES (
    role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES WORKSPACES(workspace_id),
    role_name VARCHAR(100) NOT NULL,
    permissions JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (workspace_id, role_name)
);

CREATE TABLE IF NOT EXISTS WORKSPACE_MEMBERS (
    workspace_id UUID NOT NULL REFERENCES WORKSPACES(workspace_id),
    user_id UUID NOT NULL,
    role_id UUID NOT NULL REFERENCES WORKSPACE_ROLES(role_id),
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (workspace_id, user_id)
);

CREATE TABLE IF NOT EXISTS WORKSPACE_INVITATIONS (
    invitation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES WORKSPACES(workspace_id),
    invited_by UUID NOT NULL,
    invitee_user_id UUID NULL,
    invitee_email VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    invited_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMPTZ NULL,
    UNIQUE (workspace_id, invitee_email)
);

CREATE TABLE IF NOT EXISTS TASKS (
    task_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES WORKSPACES(workspace_id),
    parent_task_id UUID NULL REFERENCES TASKS(task_id),
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    status VARCHAR(20) DEFAULT 'TODO',
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    assigned_to UUID NULL,
    created_by UUID NOT NULL,
    deadline TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS FILES (
    file_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES WORKSPACES(workspace_id),
    task_id UUID NULL REFERENCES TASKS(task_id),
    uploaded_by UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    mime_type VARCHAR(100) NULL,
    file_size_bytes BIGINT NOT NULL,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS ACTIVITY_LOGS (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES WORKSPACES(workspace_id),
    actor_user_id UUID NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    old_value JSONB NULL,
    new_value JSONB NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
