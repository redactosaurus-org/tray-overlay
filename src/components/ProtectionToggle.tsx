import React from 'react';
import { Switch } from '@/components/ui/switch';

interface ProtectionToggleProps {
    checked: boolean;
    disabled: boolean;
    onChange: (enabled: boolean) => void;
    isDark: boolean;
}

export const ProtectionToggle: React.FC<ProtectionToggleProps> = ({
    checked,
    disabled,
    onChange,
    isDark,
}) => {
    return (
        <Switch
            checked={checked}
            disabled={disabled}
            onCheckedChange={onChange}
            aria-label="Toggle protection"
        />
    );
};
