export const SERVICES={
    API_GATEWAY:'api-gateway',
    AUTH_SERVICE:'auth-service',
    USER_SERVICE:'user-service',
    EVENT_SERVICE:'event-service',
    NOTIFICATION_SERVICE:'notification-service',
    TICKET_SERVICE:'ticket-service',
    PAYMENT_SERVICE:'payment-service'

} as const;
export const SERVICE_PORTS={
API_GATEWAY:6000,
AUTH_SERVICE:6001,
USER_SERVICE:6002,
EVENT_SERVICE:6003,
NOTIFICATION_SERVICE:6004,
TICKET_SERVICE:6005,
PAYMENT_SERVICE:6006
} as const;