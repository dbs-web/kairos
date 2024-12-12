import { IBriefing } from '@/types/briefing';
import BriefingCard from './BriefingCard';

const data: IBriefing[] = [
    {
        _id: '1',
        title: 'Título da Sugestão 1',
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        date: new Date(),
        status: 'em-analise',
        user: '1',
        suggestion: '1',
    },
];

export default function BriefingGrid() {
    return (
        <div className="grid grid-cols-4 px-12">
            {data?.length > 0 &&
                data.map((briefing) => <BriefingCard briefing={briefing} key={briefing._id} />)}
        </div>
    );
}
