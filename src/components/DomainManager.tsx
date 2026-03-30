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
        <div className="space-y-1 rounded-md border border-input bg-muted/40 p-2">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold">Protected Domains</h3>
                <Badge variant="secondary" className="px-1.5 py-0 text-[9px]">
                    {domains.length}
                </Badge>
            </div>

            <div>
                {domains.length === 0 ? (
                    <p className="py-0.5 text-[10px] text-muted-foreground">No domains.</p>
                ) : (
                    <div className="max-h-14 overflow-y-auto pr-1">
                        <div className="flex flex-wrap gap-1">
                            {domains.map((domain, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="flex items-center gap-0.5 cursor-pointer px-1.5 py-0.5 text-[9px] transition-opacity hover:opacity-80"
                                >
                                    <span className="break-all">{domain}</span>
                                    <button
                                        onClick={async () => {
                                            setIsSubmitting(true);
                                            await onRemove(index);
                                            setIsSubmitting(false);
                                        }}
                                        disabled={isFormDisabled || domains.length <= 1}
                                        className="ml-0.5 text-current opacity-70 hover:opacity-100 transition-opacity"
                                        aria-label={`Remove ${domain}`}
                                    >
                                        <X className="h-2.5 w-2.5" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <div className="flex flex-col gap-1 sm:flex-row">
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
                        placeholder="Enter domain"
                        disabled={isFormDisabled}
                        className="h-8 text-xs"
                    />
                    <Button
                        onClick={handleSubmit}
                        disabled={isFormDisabled || !inputValue.trim()}
                        className="h-8 px-2 text-[10px] sm:px-2"
                    >
                        <Check className="w-3 h-3 mr-0.5" />
                        Add
                    </Button>
                    {inputValue && (
                        <Button
                            onClick={handleCancel}
                            disabled={isFormDisabled}
                            variant="outline"
                            className="h-8 px-2 sm:w-8"
                        >
                            <X className="w-3 h-3" />
                        </Button>
                    )}
                </div>

                {feedback.message && (
                    <Alert variant={feedback.tone === 'error' ? 'destructive' : feedback.tone === 'success' ? 'success' : 'default'} className="p-1.5">
                        <AlertDescription className="text-[9px]">
                            {feedback.message}
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
};
