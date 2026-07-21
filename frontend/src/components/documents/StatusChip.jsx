import { Chip } from '@mui/material';
import {
    CloudUpload,
    Settings,
    CheckCircle,
    Error as ErrorIcon,
} from '@mui/icons-material';

const STATUS_CONFIG = {
    UPLOADING: { label: 'Uploading', color: 'info', icon: <CloudUpload sx={{ fontSize: 14 }} /> },
    PROCESSING: { label: 'Processing', color: 'warning', icon: <Settings sx={{ fontSize: 14 }} /> },
    READY: { label: 'Ready', color: 'success', icon: <CheckCircle sx={{ fontSize: 14 }} /> },
    FAILED: { label: 'Failed', color: 'error', icon: <ErrorIcon sx={{ fontSize: 14 }} /> },
};

export function StatusChip({ status }) {
    const config = STATUS_CONFIG[status] || { label: status, color: 'default' };
    return (
        <Chip
            label={config.label}
            color={config.color}
            size="small"
            icon={config.icon}
            sx={{ fontWeight: 500, fontSize: '0.7rem', height: 22 }}
        />
    );
}
