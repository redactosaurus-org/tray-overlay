import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DomainManagerProps {
    domains: string[];
    isLoading: boolean;
    feedback: {
        message: string;
        tone: 'idle' | 'error' | 'success';
    };
    onAdd: (domain: string) => Promise<boolean>;
    onRemove: (index: number) => Promise<boolean>;
}

export const DomainManager: React.FC<DomainManagerProps> = ({
    domains,
    isLoading,
    feedback,
    onAdd,
    onRemove,
}) => {
    const [inputValue, setInputValue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!inputValue.trim()) return;

        setIsSubmitting(true);
        try {
            const success = await onAdd(inputValue);

            if (success) {
                setInputValue('');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setInputValue('');
    };

    const isFormDisabled = isLoading || isSubmitting;

    return (
        <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Protected Domains</h3>
                <Badge variant="secondary">
                    {domains.length} domain{domains.length !== 1 ? 's' : ''}
                </Badge>
            </div>

            <div>
                {domains.length === 0 ? (
                    <p className="text-xs text-gray-500 py-2">No domains configured.</p>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {domains.map((domain, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity px-3 py-1.5"
                            >
                                <span>{domain}</span>
                                <button
                                    onClick={async () => {
                                        setIsSubmitting(true);
                                        await onRemove(index);
                                        setIsSubmitting(false);
                                    }}
                                    disabled={isFormDisabled || domains.length <= 1}
                                    className="ml-1 text-current opacity-70 hover:opacity-100 transition-opacity"
                                    aria-label={`Remove ${domain}`}
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSubmit();
                            } else if (e.key === 'Escape') {
                                handleCancel();
                            }
                        }}
                        placeholder="Enter domain (e.g., chatgpt.com)"
                        disabled={isFormDisabled}
                    />
                    <Button
                        onClick={handleSubmit}
                        disabled={isFormDisabled || !inputValue.trim()}
                    >
                        <Check className="w-4 h-4 mr-1" />
                        Add
                    </Button>
                    {inputValue && (
                        <Button
                            onClick={handleCancel}
                            disabled={isFormDisabled}
                            variant="outline"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {feedback.message && (
                    <Alert variant={feedback.tone === 'error' ? 'destructive' : feedback.tone === 'success' ? 'success' : 'default'}>
                        <AlertDescription>
                            {feedback.message}
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
};
