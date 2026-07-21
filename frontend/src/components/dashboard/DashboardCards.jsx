import { Box, Card, Typography, Stack } from '@mui/material';
import { Description, Chat, CheckCircle, Bolt } from '@mui/icons-material';

const ICONS = { documents: Description, chats: Chat, ready: CheckCircle, activity: Bolt };

function StatCard({ icon, label, value, color }) {
    const Icon = ICONS[icon];
    return (
        <Card
            variant="outlined"
            sx={{
                p: 2.5,
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                height: '100%',
            }}
        >
            <Box
                sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    bgcolor: `${color}.main`,
                    opacity: 0.95,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}
            >
                <Icon sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    {value}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {label}
                </Typography>
            </Box>
        </Card>
    );
}

export function DashboardCards({ documentCount = 0, readyCount = 0, sessionCount = 0, messageCount = 0 }) {
    const cards = [
        { icon: 'documents', label: 'Documents uploaded', value: documentCount, color: 'primary' },
        { icon: 'ready', label: 'Ready to chat', value: readyCount, color: 'success' },
        { icon: 'chats', label: 'Chat sessions', value: sessionCount, color: 'secondary' },
        { icon: 'activity', label: 'Messages sent', value: messageCount, color: 'warning' },
    ];

    return (
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', '& > *': { flex: '1 1 220px' } }}>
            {cards.map((c) => (
                <StatCard key={c.icon} {...c} />
            ))}
        </Stack>
    );
}
