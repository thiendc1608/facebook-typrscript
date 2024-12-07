import { formatDate } from "@/utils/helpers";

interface TimelineProps {
  el: Date;
}
const Timeline = ({ el }: TimelineProps) => {
  return (
    <div className="w-full h-auto py-3 px-5 text-center">
      <span className="text-[#65686c] text-[14px]">{formatDate(el)}</span>
    </div>
  );
};

export default Timeline;
