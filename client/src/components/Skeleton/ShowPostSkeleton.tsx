import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const ShowPostSkeleton = ({ count_post }: { count_post: number }) => {
  return Array(count_post)
    .fill(0)
    .map((_, i) => (
      <div key={i}>
        <div className="w-full rounded-lg bg-white border h-[264px]">
          <div className="w-[64px] pt-4 px-4 flex items-center justify-start gap-2">
            <Skeleton circle height={40} width={40} />
            <div className="flex flex-col gap-1 justify-center">
              <Skeleton height={10} width={100} />
              <Skeleton height={10} width={200} />
            </div>
          </div>
          <div className="pt-[174px] px-4 pb-4">
            <div className="flex items-center justify-around">
              <Skeleton height={10} width={66} />
              <Skeleton height={10} width={66} />
              <Skeleton height={10} width={66} />
            </div>
          </div>
        </div>
      </div>
    ));
};

export default ShowPostSkeleton;
