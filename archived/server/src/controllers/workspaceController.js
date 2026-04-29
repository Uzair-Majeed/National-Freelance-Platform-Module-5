const db = require('../db');

exports.getWorkspaceDashboard = async (req, res) => {
    try {
        const { workspace_id } = req.params;
        const workspaceQuery = await db.query('SELECT * FROM WORKSPACES WHERE workspace_id = $1', [workspace_id]);
        if (workspaceQuery.rows.length === 0) return res.status(404).json({ error: 'Workspace not found' });
        
        const tasksQuery = await db.query('SELECT status FROM TASKS WHERE workspace_id = $1', [workspace_id]);
        
        const activityQuery = await db.query('SELECT * FROM ACTIVITY_LOGS WHERE workspace_id = $1 ORDER BY created_at DESC LIMIT 5', [workspace_id]);

        res.json({
            workspace: workspaceQuery.rows[0],
            tasks: tasksQuery.rows,
            activities: activityQuery.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.getWorkspaceMembers = async (req, res) => {
    try {
        const { workspace_id } = req.params;
        const membersQuery = await db.query(`
            SELECT wm.*, wr.role_name 
            FROM WORKSPACE_MEMBERS wm 
            JOIN WORKSPACE_ROLES wr ON wm.role_id = wr.role_id 
            WHERE wm.workspace_id = $1
        `, [workspace_id]);

        const invitesQuery = await db.query('SELECT * FROM WORKSPACE_INVITATIONS WHERE workspace_id = $1', [workspace_id]);

        res.json({
            members: membersQuery.rows,
            invitations: invitesQuery.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.sendInvitation = async (req, res) => {
    try {
        const { workspace_id } = req.params;
        const { invited_by, invitee_email, role_id } = req.body;

        const inviteQuery = await db.query(
            `INSERT INTO WORKSPACE_INVITATIONS (workspace_id, invited_by, invitee_email, status) 
             VALUES ($1, $2, $3, 'PENDING') RETURNING *`,
            [workspace_id, invited_by, invitee_email]
        );

        // Log Activity
        await db.query(
            `INSERT INTO ACTIVITY_LOGS (workspace_id, actor_user_id, action_type, entity_type, entity_id) 
             VALUES ($1, $2, 'CREATED', 'MEMBER', $3)`,
            [workspace_id, invited_by, inviteQuery.rows[0].invitation_id]
        );

        res.status(201).json(inviteQuery.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const { workspace_id } = req.params;
        const tasksQuery = await db.query('SELECT * FROM TASKS WHERE workspace_id = $1 ORDER BY created_at DESC', [workspace_id]);
        res.json(tasksQuery.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.createTask = async (req, res) => {
    try {
        const { workspace_id } = req.params;
        const { title, description, priority, created_by, assigned_to } = req.body;

        const taskQuery = await db.query(
            `INSERT INTO TASKS (workspace_id, title, description, priority, created_by, assigned_to, status) 
             VALUES ($1, $2, $3, $4, $5, $6, 'TODO') RETURNING *`,
            [workspace_id, title, description, priority, created_by, assigned_to]
        );

        // Log Activity
        await db.query(
            `INSERT INTO ACTIVITY_LOGS (workspace_id, actor_user_id, action_type, entity_type, entity_id) 
             VALUES ($1, $2, 'CREATED', 'TASK', $3)`,
            [workspace_id, created_by, taskQuery.rows[0].task_id]
        );

        res.status(201).json(taskQuery.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};
