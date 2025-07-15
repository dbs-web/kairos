const testData = {
    data: [
        {
            post_url: "https://instagram.com/p/ABC123",
            user_photo: "https://example.com/user.jpg",
            post_image: "https://example.com/post.jpg",
            name_profile: "@testuser",
            post_text: "This is a test social media post content",
            socialmedia_name: "instagram",
            userId: 10,
            date: "2024-01-15T00:00:00.000Z"
        }
    ]
};

fetch('http://localhost:3000/api/sugestoes', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': '6Kh8bBoBilUCUypzKD3Lftj15oQJOaFIBHLTFImAKDA1y2YBQdlFK43raubOfKDp'
    },
    body: JSON.stringify(testData)
})
.then(response => response.json())
.then(data => console.log('Response:', data))
.catch(error => console.error('Error:', error));