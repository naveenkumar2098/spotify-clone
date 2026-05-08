"use client";

import React from "react";
import Modal from "./modal";
import useQueueModal from "@/hooks/useQueueModal";
import usePlayer from "@/hooks/usePlayer";
import useGetSongsByIds from "@/hooks/useGetSongsByIds";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import MediaItem from "./mediaItem";
import MediaItemSkeleton from "./mediaItemSkeleton";

const SortableSongItem = ({ id, song, isActive }: { id: string, song: any, isActive: boolean }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            {...attributes} 
            {...listeners} 
            className={`touch-none rounded-md border ${isActive ? 'border-green-500 bg-neutral-800' : 'border-transparent'}`}
        >
            <MediaItem data={song} />
        </div>
    );
}

const QueueModal = () => {
    const { isOpen, onClose } = useQueueModal();
    const player = usePlayer();
    
    const activeList = player.isShuffle ? player.shuffledIds : player.ids;
    // Cap rendering at 50 to prevent performance lag on massive playlists
    const queueIds = activeList.slice(0, 50);

    const { songs, isLoading } = useGetSongsByIds(queueIds);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = activeList.indexOf(active.id as string);
            const newIndex = activeList.indexOf(over.id as string);
            if (oldIndex !== -1 && newIndex !== -1) {
                player.reorderQueue(oldIndex, newIndex);
            }
        }
    }

    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    };

    return (
        <Modal
            title="Up Next Queue"
            description={player.isShuffle ? "Shuffle is ON" : "Playing sequentially"}
            isOpen={isOpen}
            onChange={onChange}
        >
            <div className="flex flex-col gap-y-2 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                {isLoading ? (
                    <div className="flex flex-col gap-y-2">
                        <MediaItemSkeleton />
                        <MediaItemSkeleton />
                        <MediaItemSkeleton />
                        <MediaItemSkeleton />
                    </div>
                ) : songs.length === 0 ? (
                    <p className="text-neutral-400">Queue is empty.</p>
                ) : (
                    <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext 
                            items={activeList}
                            strategy={verticalListSortingStrategy}
                        >
                            {songs.map((song) => (
                                <SortableSongItem 
                                    key={song.id} 
                                    id={song.id.toString()} 
                                    song={song} 
                                    isActive={player.activeId === song.id.toString()}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </Modal>
    );
}

export default QueueModal;
