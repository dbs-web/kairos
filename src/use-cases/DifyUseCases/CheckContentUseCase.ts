import DifyAdapter from "@/adapters/DifyAdapter";
import { UseCaseError } from "@/shared/errors";

export default class CheckContentUseCase{
    constructor(private difyAdapter: DifyAdapter){}
    async execute(text : string){
        const res = await this.difyAdapter.securityCheck({text})
        try {
            const json = res?.data?.outputs?.saida.replaceAll("`", "").replace("json", "")
            const data = JSON.parse(json)
            
            if(data.status?.toLowerCase() === "reprovado"){
                throw new UseCaseError(data?.justificativa)
            }

        }catch(error){
            throw new UseCaseError(`${error instanceof Error ? error.message : error}`)
        }
    }
}