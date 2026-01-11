"use client";

import React, { useMemo } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  SortingStrategy,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import useMounted from "@/hooks/useMounted";

type IdGetter<Item> = (item: Item) => UniqueIdentifier;

interface DragAndDropProps<Item> {
  items: Item[];
  getItemId: IdGetter<Item>;
  renderItem: (params: { item: Item; isDragging: boolean }, index:number) => React.ReactNode;
  onReorder: (nextItems: Item[]) => void;
  activationDistance?: number;
  strategy?: SortingStrategy;
  disabled?: boolean;
}

export default function DragAndDrop<Item>(props: DragAndDropProps<Item>) {

  const mounted = useMounted()
  

  const { items, getItemId, renderItem, onReorder, activationDistance = 6, strategy = verticalListSortingStrategy } = props;

  const itemIds = useMemo(() => items.map(getItemId), [items, getItemId]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: activationDistance } })
    // useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    const oldIndex = items.findIndex((item) => getItemId(item) === active.id);
    const newIndex = items.findIndex((item) => getItemId(item) === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const nextItems = arrayMove(items, oldIndex, newIndex);
    onReorder(nextItems);
  };
  
  if (!mounted) {
      return (
          <>
              {items.map((item, index) => (
                  <div key={String(getItemId(item))} style={{ width: "100%", opacity:0 }}>
                      {renderItem({ item, isDragging: false }, index )}
                  </div>
              ))}
          </>
      )
  }
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={itemIds} strategy={strategy}>
        {items.map((item, index) => (
          <SortableRow
            key={String(getItemId(item))}
            id={getItemId(item)}
            item={item}
            renderItem={renderItem}
            index={index}
            disabled={props.disabled}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}

interface SortableRowProps<Item> {
  id: UniqueIdentifier;
  item: Item;
  renderItem: (params: { item: Item; isDragging: boolean }, index: number) => React.ReactNode;
  index: number;
  disabled?: boolean;
}

function SortableRow<Item>(props: SortableRowProps<Item>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props.id,
    disabled: props.disabled
  });

  const transformWithoutScale = transform ? { ...transform, scaleX: 1, scaleY: 1 } : null;

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transformWithoutScale),
    transition,
    touchAction: "manipulation",
    opacity: isDragging ? 0.4 : undefined,
    width: "100%",
    
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.renderItem({ item: props.item, isDragging }, props.index)}
    </div>
  );
}
