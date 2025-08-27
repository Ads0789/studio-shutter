"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, PlusCircle } from "lucide-react";
import type { WeddingEvent } from "@/types/invoice";

interface EventsModuleProps {
  events: WeddingEvent[];
  onEventChange: (id: string, field: keyof WeddingEvent, value: string) => void;
  onAddEvent: () => void;
  onRemoveEvent: (id: string) => void;
}

export const EventsModule: React.FC<EventsModuleProps> = ({
  events,
  onEventChange,
  onAddEvent,
  onRemoveEvent,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Wedding Events</CardTitle>
        <Button size="sm" variant="outline" onClick={onAddEvent}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {events.map((event) => (
          <div key={event.id} className="p-4 border rounded-lg relative space-y-4">
             <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveEvent(event.id)}
                className="absolute top-2 right-2"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`event-name-${event.id}`}>Event Name</Label>
                <Input
                  id={`event-name-${event.id}`}
                  value={event.name}
                  onChange={(e) => onEventChange(event.id, "name", e.target.value)}
                  placeholder="e.g., Haldi, Mehendi"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`event-team-${event.id}`}>Team Members</Label>
                <Input
                  id={`event-team-${event.id}`}
                  value={event.team}
                  onChange={(e) => onEventChange(event.id, "team", e.target.value)}
                  placeholder="Comma-separated names"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`event-deliverables-${event.id}`}>Deliverables</Label>
              <Textarea
                id={`event-deliverables-${event.id}`}
                value={event.deliverables}
                onChange={(e) => onEventChange(event.id, "deliverables", e.target.value)}
                placeholder="One deliverable per line"
                rows={3}
              />
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No events added. Click 'Add Event' to start.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
