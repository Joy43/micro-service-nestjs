export const KAFKA_BROKER = process.env.KAFKA_BROKER ?? 'localhost:9092';
export const KAFKA_CLIENT_ID = 'eventflowapp';
export const KAFKA_CONSUMER_GROUP = 'eventflowapp-consumer';

//  kafka topics
export const KAFKA_TOPICS={
USER_REGISTERED:'user-registered',

// event topics
EVENT_UPDATED:'event-updated',
EVENT_CREATED:'event-created',
EVENT_DELETED:'event-deleted',
EVENT_CANCELLED:'event-cancelled',
// ticket topics
TICKET_CREATED:'ticket-created',
TICKET_UPDATED:'ticket-updated',
TICKET_DELETED:'ticket-deleted',
TICKET_CANCELLED:'ticket-cancelled',
TICKET_PURCHASED:'ticket-purchased',
TICKET_CHECKED_IN:'ticket-checked-in',
TICKET_CHECKED_OUT:'ticket-checked-out',
// PAYMENT EVENTS
PAYMENT_PROCESSED:'payment-processed',
PAYMENT_FAILED:'payment-failed',
PAYMENT_REFUNDED:'payment-refunded',
PAYMENT_COMPLETED:'payment-completed',
//  notification topics
SEND_EMAIL:'notification.send-email',
SEND_SMS:'notification.send-sms',
SEND_PUSH:'notification.send-push',

} as const;
export type KafkaTopics = (typeof KAFKA_TOPICS)[keyof typeof KAFKA_TOPICS];