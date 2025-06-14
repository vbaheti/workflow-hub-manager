
import React from "react";
import { useStateContext } from "../contexts/StateContext";
import { Check, ChevronDown, MapPin } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const StateSelector: React.FC = () => {
  const { selectedStates, setSelectedStates, states } = useStateContext();

  const handleToggle = (state: string) => {
    if (selectedStates.includes(state)) {
      setSelectedStates(selectedStates.filter(s => s !== state));
    } else {
      setSelectedStates([...selectedStates, state]);
    }
  };

  // Label to display selected, or fallback
  const displayLabel =
    selectedStates.length === 0
      ? "Select state(s)"
      : selectedStates.length === 1
      ? selectedStates[0]
      : `${selectedStates.length} selected`;

  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1">
        <MapPin className="w-4 h-4" />
        State Filter
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-between min-w-[200px]">
            <span className="truncate">{displayLabel}</span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="p-0 w-60">
          <div>
            {states.map((state) => (
              <button
                type="button"
                key={state}
                className={`flex w-full items-center px-3 py-2 text-sm hover:bg-muted-foreground/10 transition ${
                  selectedStates.includes(state) ? "bg-primary/10 font-semibold" : ""
                }`}
                onClick={() => handleToggle(state)}
              >
                <span className="flex-1 text-left">{state}</span>
                {selectedStates.includes(state) && (
                  <Check className="inline ml-2 h-4 w-4 text-green-600" />
                )}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap px-3 pb-2 pt-2">
            {selectedStates.length > 0 &&
              selectedStates.map((state) => (
                <Badge
                  key={state}
                  variant="outline"
                  className="pr-1 pl-2 py-1 text-xs flex items-center gap-1"
                >
                  {state}
                  <button
                    onClick={() => handleToggle(state)}
                    className="hover:text-red-600 ml-1"
                    aria-label={`Remove ${state}`}
                  >
                    ×
                  </button>
                </Badge>
              ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default StateSelector;
