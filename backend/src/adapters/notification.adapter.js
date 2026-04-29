/**
 * EXTERNAL INTEGRATION LAYER - NotificationAdapter
 * Abstracts integration with the external Notification Service.
 * Supports Email and Push notification channels.
 */

/**
 * Sends a push notification to a user.
 * @param {string} userId - Target user UUID
 * @param {Object} payload - Notification payload { title, body, data }
 */
const sendPush = async (userId, payload) => {
  // TODO: Integrate with push notification service (e.g., Firebase FCM)
  console.log(`[NotificationAdapter] Push notification to user ${userId}:`, payload);
};

/**
 * Sends an email notification to a user.
 * @param {string} userId - Target user UUID
 * @param {Object} payload - Email payload { subject, body }
 */
const sendEmail = async (userId, payload) => {
  // TODO: Integrate with email service (e.g., SendGrid, AWS SES)
  console.log(`[NotificationAdapter] Email notification to user ${userId}:`, payload);
};

/**
 * Dispatches a notification based on event type and user preferences.
 * @param {string} userId - Target user UUID
 * @param {string} eventType - Event type (e.g., 'TASK_ASSIGNED', 'ROLE_UPDATED')
 * @param {Object} payload - Event-specific data
 */
const dispatchNotification = async (userId, eventType, payload) => {
  const message = { eventType, ...payload };
  // TODO: Fetch user preferences and route accordingly
  await sendPush(userId, message);
};

module.exports = { sendPush, sendEmail, dispatchNotification };
