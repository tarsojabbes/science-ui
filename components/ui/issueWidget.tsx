import { truncateText } from "@/utils/utils"
import Image from "next/image"

type IssueWidgetProps = {
  id: number
  number: number,
  volume: number,
  publishedDate: string
}

export default function IssueWidget({ id, number, volume, publishedDate }: IssueWidgetProps) {
  return (
    <a className="rounded-2xl border border-gray-300 w-52 h-52 p-4 flex flex-col justify-between" href={`/issue/${id}`}>
      <div className="flex flex-col gap-3">
        <Image src="/assets/JournalIcon.svg" height={24} width={24} alt="JournalIcon" />
        <p className="font-medium text-gray-700 leading-snug">
          Issue Nº {number} Vol. {volume}
        </p>
        <p className="text-gray-600 text-sm">{new Date(publishedDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })}</p>
      </div>

      <div className="flex justify-end">
          <Image src="/assets/ArrowRight.svg" height={10} width={10} alt="ArrowRight" />
      </div>
    </a>
  )
}
