import { addDays } from "date-fns"

import { Calendar } from "@/components/ui/calendar"

export default function ComponentCalendar() {
  const today = new Date()

  return (
    <div>
      <Calendar
        mode="range"
        disabled={[
          { before: new Date() }, // Dates before today
          new Date(), // Today
          { dayOfWeek: [0, 6] }, // Weekends
          {
            from: addDays(today, 14), // 14th day from now
            to: addDays(today, 16), // 16th day from now
          },
          {
            from: addDays(today, 23), // 23th day from now
            to: addDays(today, 24), // 24th day from now
          },
        ]}
        excludeDisabled
        className="rounded-md border p-2"
      />
    </div>
  )
}
