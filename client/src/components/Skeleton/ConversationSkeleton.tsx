import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const ConversationSkeleton = ({ count_message }: { count_message: number }) => {
  return Array(count_message)
    .fill(0)
    .map((_, i) => (
      <div key={i}>
        <div className="flex items-center justify-start gap-2">
          <Skeleton circle height={56} width={56} />
          <div className="flex flex-col gap-1 items-center">
            <Skeleton height={20} width={200} />
            <Skeleton height={20} width={200} />
          </div>
        </div>
      </div>
    ));
};

export default ConversationSkeleton;
