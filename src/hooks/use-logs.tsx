import { IApiLog} from "@/types/api"
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query"

const fetchLogs = async():Promise<IApiLog[]> => {
    const res = await fetch("/api/logs")
    const data = await res.json()
    return data.data;
}

export const useApiLogs = () => {
    const {data: logs} = useQuery({
        queryKey: ["logs"],
        queryFn: () => fetchLogs()
    });

    return {
        logs: logs ?? []
    }
}