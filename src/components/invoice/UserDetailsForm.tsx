"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserDetails } from "@/types/invoice";

interface UserDetailsFormProps {
  title: string;
  data: UserDetails;
  onDataChange: (field: keyof UserDetails, value: string) => void;
  states: string[];
}

export const UserDetailsForm: React.FC<UserDetailsFormProps> = ({
  title,
  data,
  onDataChange,
  states,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${title}-name`}>Name</Label>
          <Input
            id={`${title}-name`}
            value={data.name}
            onChange={(e) => onDataChange("name", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${title}-address`}>Address</Label>
          <Input
            id={`${title}-address`}
            value={data.address}
            onChange={(e) => onDataChange("address", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${title}-phone`}>Phone</Label>
            <Input
              id={`${title}-phone`}
              type="tel"
              value={data.phone}
              onChange={(e) => onDataChange("phone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${title}-email`}>Email</Label>
            <Input
              id={`${title}-email`}
              type="email"
              value={data.email}
              onChange={(e) => onDataChange("email", e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${title}-gstin`}>GSTIN</Label>
            <Input
              id={`${title}-gstin`}
              value={data.gstin}
              onChange={(e) => onDataChange("gstin", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${title}-state`}>State</Label>
            <Select
              value={data.state}
              onValueChange={(value) => onDataChange("state", value)}
            >
              <SelectTrigger id={`${title}-state`}>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
