import { Link } from "react-router-dom";

interface SidebarItemProps {
  image: string;
  name: string;
  url: string;
}
const SidebarItem = ({ image, name, url }: SidebarItemProps) => {
  return (
    <div className="mx-2 flex items-center">
      <Link
        to={url}
        className="p-2 h-[52px] flex items-center gap-[14px] hover:bg-[#E4E6E9] hover:rounded-lg"
      >
        <img src={image} alt={name} className="w-8 h-8 rounded-full" />
        <span className="py-3 text-[#050505] text-[15px] font-medium">
          {name}
        </span>
      </Link>
    </div>
  );
};

export default SidebarItem;
