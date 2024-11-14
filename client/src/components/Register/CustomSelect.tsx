import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomInputProps {
  name: string;
  time: number;
  setTime: (time: number) => void;
  listData: number[];
}
const CustomSelect = ({ name, time, setTime, listData }: CustomInputProps) => {
  return (
    <Select
      value={time.toString()}
      onValueChange={(value) => {
        setTime(+value);
      }}
    >
      <SelectTrigger className="w-[125px]">
        <SelectValue placeholder={name} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup className="h-[200px] overflow-y-scroll">
          {listData.map((time, idx) => (
            <SelectItem key={idx} value={time.toString()}>
              {name === "month" ? `Tháng ${time}` : time}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CustomSelect;
