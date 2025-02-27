// Entities
import { UserRoles } from "@/domain/entities/user";

// Use Cases
import { getUsersUseCase } from "@/use-cases/UserUseCases";
import { getVideosUseCase } from "@/use-cases/VideoUseCases";
import { createApiResponseUseCase } from "@/use-cases/ApiLogUseCases";
import { generateVideoUseCase } from "@/use-cases/HeyGen";

// Adapters
import { withAuthorization } from "@/adapters/withAuthorization";

const route = "/api/videos/redo";

interface PostBody {
    avatar: string | undefined;
    videoId: number | undefined;
    briefing: string | undefined;
}

export const POST = withAuthorization([UserRoles.USER], async (request, {id: userId}) => {
    const body = await request.json()

    try {
        const {videoId, avatar, briefing}:PostBody = body;
        
        if(!videoId || !avatar || !briefing) {
            return createApiResponseUseCase.BAD_REQUEST({
                route,
                body,
                error: "You need to provide avatar, videoId and briefing fields."
            })
        } 

        const user = await getUsersUseCase.byId(userId);
        
        const userVoiceId = user.voiceId;
        if(!userVoiceId){
            return createApiResponseUseCase.BAD_REQUEST({
                route,
                body,
                error: "User voiceId is not set, please, contact systems admins."
            })
        }

        const video = await getVideosUseCase.byId({id: videoId, userId});
        
        await generateVideoUseCase.execute({
            avatarId: avatar,
            text: video?.transcription ?? "",
            voiceId: userVoiceId,
            width: video.width,
            height: video.height
        })


        return createApiResponseUseCase.SUCCESS({
            route,
            body,
            message: "Refação de vídeo realizada com sucesso!"
        })

    }catch(error) {
        return createApiResponseUseCase.INTERNAL_SERVER_ERROR({
            route, 
            body,
            error: `${error instanceof Error ? error.message : error}`
        })
    }

})