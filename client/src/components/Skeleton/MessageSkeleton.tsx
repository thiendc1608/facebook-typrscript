import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const MessageSkeleton = ({ count_message }: { count_message: number }) => {
  return Array(count_message)
    .fill(0)
    .map((_, i) => (
      <div key={i} className="mt-3">
        <div className="flex items-end justify-start gap-2">
          <Skeleton circle height={40} width={40} />
          <div className="flex flex-col gap-1 items-center">
            <Skeleton height={16} width={200} />
            <Skeleton height={16} width={200} />
          </div>
        </div>
        <div className="flex items-end justify-end gap-2">
          <div className="flex flex-col gap-1 items-center">
            <Skeleton height={16} width={200} />
            <Skeleton height={16} width={200} />
          </div>
          <Skeleton circle height={40} width={40} />
        </div>
      </div>
    ));
};

export default MessageSkeleton;
