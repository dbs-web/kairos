import StudioFilter from './StudioFilter';
import StudioTabs from './StudioTabs';

export default function StudioTools() {
    return (
        <div className="flex w-full items-center justify-between">
            <StudioTabs />
            <StudioFilter />
        </div>
    );
}
