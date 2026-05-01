const pool = require('../src/config/db');
const { v4: uuidv4 } = require('uuid');

const seed = async () => {
  try {
    console.log('Starting database seeding...');

    // 1. Create dummy Workspaces
    const projectId = '123e4567-e89b-12d3-a456-426614174000';
    const creatorId = '550e8400-e29b-41d4-a716-446655440000';
    
    const workspacesToCreate = [
      { name: 'Apollo Brand Redesign', desc: 'Strategic branding audit, visual guidelines execution.' },
      { name: 'Zenith Mobile App', desc: 'Cross-platform e-commerce implementation.' },
      { name: 'Orion CRM Integration', desc: 'Connecting legacy database architectures.' }
    ];

    const workspaces = [];
    for (const ws of workspacesToCreate) {
      const res = await pool.query(
        'INSERT INTO WORKSPACES (name, project_id, created_by) VALUES ($1, $2, $3) RETURNING *',
        [ws.name, projectId, creatorId]
      );
      workspaces.push(res.rows[0]);
      console.log('✔ Workspace created:', ws.name);
    }
    
    const workspace = workspaces[0]; // Use first for roles/members for now

    // 2. Create Roles
    const rolesData = [
      { name: 'Admin', permissions: JSON.stringify({ can_edit: true, can_delete: true, can_invite: true }) },
      { name: 'Developer', permissions: JSON.stringify({ can_edit: true, can_delete: false, can_invite: false }) },
      { name: 'Viewer', permissions: JSON.stringify({ can_edit: false, can_delete: false, can_invite: false }) }
    ];

    const roles = [];
    for (const role of rolesData) {
      const roleRes = await pool.query(
        'INSERT INTO WORKSPACE_ROLES (workspace_id, role_name, permissions) VALUES ($1, $2, $3) RETURNING *',
        [workspace.workspace_id, role.name, role.permissions]
      );
      roles.push(roleRes.rows[0]);
    }
    console.log('✔ Roles created:', roles.map(r => r.role_name).join(', '));

    // 3. Add Members
    const membersData = [
      { name: 'Alex Rivera', email: 'alex@company.com', role: 'Admin' },
      { name: 'Sarah Chen', email: 'sarah@company.com', role: 'Developer' },
      { name: 'Marcus Johnson', email: 'marcus@company.com', role: 'Viewer' },
      { name: 'Elena Rostova', email: 'elena@company.com', role: 'Viewer' }
    ];

    for (const member of membersData) {
      const role = roles.find(r => r.role_name === member.role);
      // Generate a dummy user_id for each member
      const userId = '00000000-0000-0000-0000-' + Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
      
      await pool.query(
        'INSERT INTO WORKSPACE_MEMBERS (workspace_id, user_id, role_id) VALUES ($1, $2, $3)',
        [workspace.workspace_id, userId, role.role_id]
      );
    }
    console.log('✔ Members added to workspace');

    // 4. Add some Activity Logs
    const activities = [
      { type: 'TASK_COMPLETED', entity: 'TASK', detail: 'API Integration' },
      { type: 'COMMENT_ADDED', entity: 'TASK', detail: 'Design Specs' },
      { type: 'FILE_UPLOADED', entity: 'FILE', detail: 'assets_v2.zip' }
    ];

    for (const act of activities) {
      await pool.query(
        'INSERT INTO ACTIVITY_LOGS (workspace_id, actor_user_id, action_type, entity_type, entity_id, new_value) VALUES ($1, $2, $3, $4, $5, $6)',
        [workspace.workspace_id, creatorId, act.type, act.entity, '00000000-0000-0000-0000-000000000000', JSON.stringify({ detail: act.detail })]
      );
    }
    console.log('✔ Initial activity logs created');

    console.log('Seeding completed successfully! 🚀');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seed();
