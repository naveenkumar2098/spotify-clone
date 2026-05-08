"use client";

import * as Tooltip from '@radix-ui/react-tooltip';

interface ActionTooltipProps {
    children: React.ReactNode;
    label: string;
}

const ActionTooltip: React.FC<ActionTooltipProps> = ({
    children,
    label
}) => {
    return (
        <Tooltip.Provider delayDuration={50}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    {children}
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        side="top"
                        align="center"
                        sideOffset={10}
                        className="bg-neutral-800 text-white text-xs font-semibold px-3 py-1.5 rounded shadow-lg z-50 border border-neutral-700 pointer-events-none"
                    >
                        {label}
                        <Tooltip.Arrow className="fill-neutral-800" />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    )
}

export default ActionTooltip;
