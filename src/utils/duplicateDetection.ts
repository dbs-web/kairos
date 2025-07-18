import crypto from 'crypto';
import { INews } from '@/domain/entities/news';
import { ISuggestion } from '@/domain/entities/suggestion';

/**
 * Normalizes text content for consistent hashing
 * Removes extra whitespace, converts to lowercase, and trims
 */
function normalizeContent(content: string): string {
    return content
        .toLowerCase()
        .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
        .trim();
}

/**
 * Generates a content hash for news items based on title and text
 */
export function generateNewsContentHash(news: Omit<INews, 'id'>): string {
    const normalizedTitle = normalizeContent(news.title);
    const normalizedText = normalizeContent(news.text);
    const combinedContent = `${normalizedTitle}|${normalizedText}`;
    
    return crypto.createHash('md5').update(combinedContent, 'utf8').digest('hex');
}

/**
 * Generates a content hash for suggestion items based on post text
 */
export function generateSuggestionContentHash(suggestion: Omit<ISuggestion, 'id'>): string {
    const normalizedPostText = normalizeContent(suggestion.post_text);
    
    return crypto.createHash('md5').update(normalizedPostText, 'utf8').digest('hex');
}

/**
 * Filters out duplicate news items based on content hash
 */
export function filterDuplicateNews(
    newNewsItems: Omit<INews, 'id'>[],
    existingContentHashes: Set<string>
): Omit<INews, 'id'>[] {
    const seenHashes = new Set<string>();
    const filteredNews: Omit<INews, 'id'>[] = [];

    for (const newsItem of newNewsItems) {
        const contentHash = generateNewsContentHash(newsItem);
        
        // Skip if we've already seen this hash in the current batch or it exists in DB
        if (!seenHashes.has(contentHash) && !existingContentHashes.has(contentHash)) {
            seenHashes.add(contentHash);
            filteredNews.push(newsItem);
        }
    }

    return filteredNews;
}

/**
 * Filters out duplicate suggestion items based on content hash
 */
export function filterDuplicateSuggestions(
    newSuggestionItems: Omit<ISuggestion, 'id'>[],
    existingContentHashes: Set<string>
): Omit<ISuggestion, 'id'>[] {
    const seenHashes = new Set<string>();
    const filteredSuggestions: Omit<ISuggestion, 'id'>[] = [];

    for (const suggestionItem of newSuggestionItems) {
        const contentHash = generateSuggestionContentHash(suggestionItem);
        
        // Skip if we've already seen this hash in the current batch or it exists in DB
        if (!seenHashes.has(contentHash) && !existingContentHashes.has(contentHash)) {
            seenHashes.add(contentHash);
            filteredSuggestions.push(suggestionItem);
        }
    }

    return filteredSuggestions;
}
