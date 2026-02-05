"use client";

import { ReactNode } from "react";
import { Typography, Button } from "@mui/material";
import { Actions, IconWrapper, Root } from "./EmptyState.styles";

export interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: ReactNode;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({ title, description, icon, actionLabel, onAction }: EmptyStateProps) {
    return (
        <Root>
            {icon && <IconWrapper>{icon}</IconWrapper>}

            <Typography variant="h6">{title}</Typography>

            {description && (
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            )}

            {actionLabel && onAction && (
                <Actions>
                    <Button variant="contained" onClick={onAction}>
                        {actionLabel}
                    </Button>
                </Actions>
            )}
        </Root>
    );
}
