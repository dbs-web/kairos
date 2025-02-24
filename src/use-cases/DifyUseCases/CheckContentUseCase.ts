import DifyAdapter from "@/adapters/DifyAdapter";
import { UseCaseError } from "@/shared/errors";

export default class CheckContentUseCase{
    constructor(private difyAdapter: DifyAdapter){}
    async execute(text : string){
        const res = await this.difyAdapter.securityCheck({text})
        if(!res.status){
            throw new UseCaseError("Text rejected by security bot.")
        }
    }
}