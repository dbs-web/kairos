import { Suggestion as PrismaSuggestion } from '@prisma/client';
import { mapStatus } from './mapStatus';

// Entities
import { ISuggestion } from '@/domain/entities/suggestion';

export function mapSuggestion(prismaSuggestion: PrismaSuggestion): ISuggestion {
    const { 
        id, 
        post_url, 
        user_photo, 
        post_image, 
        name_profile, 
        post_text, 
        socialmedia_name, 
        date, 
        userId, 
        status 
    } = prismaSuggestion;
    
    return { 
        id, 
        post_url, 
        user_photo, 
        post_image, 
        name_profile, 
        post_text, 
        socialmedia_name, 
        date, 
        userId, 
        status: mapStatus(status) 
    };
}
