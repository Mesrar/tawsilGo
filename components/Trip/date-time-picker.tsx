// components/ui/date-time-picker.tsx
'use client'
import { Calendar } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function DateTimePicker({
  selected,
  onSelect,
}: {
  selected: Date
  onSelect: (date: Date | null) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <Calendar className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP HH:mm") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <DatePicker
          selected={selected}
          onChange={onSelect}
          inline
          showTimeSelect
          dateFormat="MMMM d, yyyy h:mm aa"
        />
      </PopoverContent>
    </Popover>
  )
}