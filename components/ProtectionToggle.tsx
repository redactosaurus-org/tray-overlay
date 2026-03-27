import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { StatusDot } from './StatusDot';

interface ProtectionToggleProps {
    checked: boolean;
    disabled: boolean;
    onChange: (enabled: boolean) => void;
    isDark: boolean;
    statusText: string;
}

export const ProtectionToggle: React.FC<ProtectionToggleProps> = ({
    checked,
    disabled,
    onChange,
    isDark,
    statusText,
}) => {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Checkbox
                        id="protection"
                        checked={checked}
                        disabled={disabled}
                        onCheckedChange={onChange}
                    />
                    <Label htmlFor="protection" className="cursor-pointer">
                        Protection
                    </Label>
                </div>
                protectionEnabled={checked}
                serviceEnabled={true}
                isPaused={false}
                isDark={isDark}
                />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{statusText}</p>
        </div>
    );
};
