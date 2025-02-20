import StudioFilter from './StudioFilter';
import StudioTabs from './StudioTabs';

export default function StudioTools() {
    return (
        <div className="flex w-full flex-wrap items-center justify-center overflow-hidden px-4 sm:px-6 md:px-12 lg:justify-between">
            <StudioTabs />
            <StudioFilter />
        </div>
    );
}
