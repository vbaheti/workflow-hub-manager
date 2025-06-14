
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStateContext } from "../contexts/StateContext";
import { MapPin } from "lucide-react";

const StateSelector: React.FC = () => {
  const { selectedState, setSelectedState, states } = useStateContext();

  return (
    <div className="min-w-[200px]">
      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1">
        <MapPin className="w-4 h-4" />
        State Filter
      </label>
      <Select value={selectedState} onValueChange={setSelectedState}>
        <SelectTrigger>
          <SelectValue placeholder="Select a state" />
        </SelectTrigger>
        <SelectContent>
          {states.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StateSelector;
