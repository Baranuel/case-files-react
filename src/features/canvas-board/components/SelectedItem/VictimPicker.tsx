    import { Content, Element, ZeroSchema } from "@/schema";
    import { useZero } from "@rocicorp/zero/react";
    import { DatePicker, Switch } from "antd";
import dayjs from "dayjs";

    export const VictimPicker = ({
    element,
    }: {
    element: Element & { content: Content };
    }) => {
    const z = useZero<ZeroSchema>();

    const handleVictimDateChange = (date: number) => {
        z.mutate.content.update({
        id: element.contentId!,
        timeOfDeath: date,
        });
    };

    const handleVictimChange = (victim: boolean) => {
        z.mutate.content.update({
        id: element.contentId!,
        victim: victim,
        });
    };

    return (
        <div className="flex gap-2 w-full">
        <div className="flex flex-col justify-between gap-2 bg-[#ECD5B8] rounded-lg p-3 w-1/3">
            <label htmlFor="victim" className={`block font-bold text-[#8B4513] mb-2 ${!element?.content?.victim ? "opacity-50" : ""}`}>Is Victim</label>
            <Switch
            checked={element?.content?.victim}
            onChange={(checked) => handleVictimChange(checked)}
            className="max-w-10"
            />
        </div>

        <div className="flex flex-col justify-between gap-2 bg-[#ECD5B8] rounded-lg p-3 w-2/3">
            <label htmlFor="victim"   className={`block font-bold text-[#8B4513] mb-2 ${!element?.content?.victim ? "opacity-50" : ""}`}>Victim Date</label>
            <DatePicker
            showTime
            defaultPickerValue={dayjs().year(1890)}
            disabled={!element?.content?.victim}
            id="timeOfDeath"
            value={
                element?.content?.timeOfDeath
                ? dayjs.unix(element?.content?.timeOfDeath)
                : null
            }
            onChange={(date) =>
                handleVictimDateChange(date.unix())
            }
            allowClear={false}
            format="MMM DD - HH:mm"
            picker="date"
            />
        </div>
        </div>
    );
    };
