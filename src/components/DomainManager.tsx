import React, { useState } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
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
    onUpdate: (index: number, domain: string) => Promise<boolean>;
    onRemove: (index: number) => Promise<boolean>;
}

export const DomainManager: React.FC<DomainManagerProps> = ({
    domains,
    isLoading,
    feedback,
    onAdd,
    onUpdate,
    onRemove,
}) => {
    const [inputValue, setInputValue] = useState('');
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!inputValue.trim()) return;

        setIsSubmitting(true);
        try {
            const success =
                editingIndex !== null
                    ? await onUpdate(editingIndex, inputValue)
                    : await onAdd(inputValue);

            if (success) {
                setInputValue('');
                setEditingIndex(null);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setInputValue('');
        setEditingIndex(null);
    };

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setInputValue(domains[index]);
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

            <div className="space-y-2">
                {domains.length === 0 ? (
                    <p className="text-xs text-gray-500 py-2">No domains configured.</p>
                ) : (
                    <div className="space-y-2">
                        {domains.map((domain, index) => (
                            <div
                                key={index}
                                className={`flex items-center justify-between p-2 rounded border ${editingIndex === index
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                                    : 'border-gray-200 dark:border-gray-700'
                                    }`}
                            >
                                <span className="text-sm font-medium">{domain}</span>
                                <div className="flex gap-1">
                                    <Button
                                        onClick={() => handleEdit(index)}
                                        disabled={isFormDisabled}
                                        variant="ghost"
                                        size="sm"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        onClick={async () => {
                                            setIsSubmitting(true);
                                            await onRemove(index);
                                            setIsSubmitting(false);
                                        }}
                                        disabled={isFormDisabled || domains.length <= 1}
                                        variant="ghost"
                                        size="sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
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
                        {editingIndex !== null ? 'Save' : 'Add'}
                    </Button>
                    {editingIndex !== null && (
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
