import { truncateText } from "@/utils/utils"
import Image from "next/image"

type JournalWidgetProps = {
  journalName: string
  journalId: number
}



export default function JournalWidget({ journalName, journalId }: JournalWidgetProps) {
  return (
    <a className="rounded-2xl border border-gray-300 w-52 h-52 p-4 flex flex-col justify-between" href={`/journal/${journalId}`}>
      <div className="flex flex-col gap-3">
        <Image src="/assets/JournalIcon.svg" height={24} width={24} alt="JournalIcon" />
        <p className="font-medium text-gray-700 leading-snug">
          {truncateText(journalName, 80)}
        </p>
      </div>

      <div className="flex justify-end">
          <Image src="/assets/ArrowRight.svg" height={10} width={10} alt="ArrowRight" />
      </div>
    </a>
  )
}
