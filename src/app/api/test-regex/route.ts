import { NextResponse } from 'next/server';

export async function GET() {
    const testUrl = "https://files2.heygen.ai/aws_pacific/avatar_tmp/b7dd102e96fd480e882e18a7135e028c/22d1b4018b9940f4bcb574e2dbf3e76f.mp4?Expires=1753276636&Signature=XZZRmd5ZXvivChuXCvuF2FjDyVB4MzzGZTpwdxtcaBml8Rl4NZZ9oXcYkLrKD8ZCimn7SjLi8IJr8VHDfgP32WyWqE78HYZISE8IbL60f4qQG6JAO-p6e3qexsNGcVzaIKsu~3VBZyQBdfFTBsJWhxydyVnkE9CJT7qSQa93wzOvbNdblLdaWyuzuG6eINo3E7RKA0IVSbdKrpH~jJiegEZBSvaNrMHfkcnnRpgF4Mr5q7hjRBdXK6m74b4FYFEg7WRT0-rk5fRmykTKhm63SlMiCq2BKp2EHXQiyOkMewoTKBYMaVemzj8ZnfLdjb9db02BCQxbHbbVFGrOZQ8h7w__&Key-Pair-Id=K38HBHX5LX3X2H";
    
    const urlWithoutQuery = testUrl.split('?')[0];
    const videoIdMatch = urlWithoutQuery.match(/([a-f0-9]{32})\.mp4$/);
    
    let permanentUrl = testUrl;
    if (videoIdMatch) {
        const extractedVideoId = videoIdMatch[1];
        permanentUrl = `https://resource2.heygen.ai/video/transcode/${extractedVideoId}/1280x720.mp4`;
    }
    
    return NextResponse.json({
        originalUrl: testUrl,
        urlWithoutQuery,
        videoIdMatch: videoIdMatch ? videoIdMatch[1] : null,
        permanentUrl,
        conversionWorked: videoIdMatch !== null
    });
}