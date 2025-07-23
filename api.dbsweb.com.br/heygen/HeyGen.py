import os
import requests
from typing import Any, Dict

class HeyGenClient:
    """
    A client for interacting with the HeyGen API to generate videos.
    """

    def __init__(self):
        """
        Initializes the HeyGenClient by reading the API key from environment variables.
        """
        self.api_key = os.getenv('HEYGEN_API_KEY')
        if not self.api_key:
            print("Nao encontrou a key")
            raise ValueError("HEYGEN_API_KEY environment variable is not set.")

        self.endpoint = "https://api.heygen.com/v2/video/generate"
        self.headers = {
            "X-Api-Key": self.api_key,
            "Content-Type": "application/json"
        }

    def generate_video(
        self,
        avatar_id: str,
        text: str,
        voice_id: str,
        callback_url: str,
        width: int,
        height: int
    ) -> Dict[str, Any]:
        """
        Generates a video using the HeyGen API.

        Args:
            avatar_id (str): The ID of the avatar to use.
            text (str): The input text for the voice.
            voice_id (str): The ID of the voice to use.
            callback_url (str): The URL to receive callbacks.
            width (int): The width of the video.
            height (int): The height of the video.

        Returns:
            Dict[str, Any]: The JSON response from the HeyGen API.

        Raises:
            requests.HTTPError: If the request to HeyGen fails.
        """
        payload = {
            "video_inputs": [
                {
                    "character": {
                        "type": "avatar",
                        "avatar_id": avatar_id,
                        "avatar_style": "normal"
                    },
                    "voice": {
                        "type": "text",
                        "input_text": text,
                        "voice_id": voice_id
                    }
                }
            ],
            "callback_id": callback_url,
            "dimension": {
                "width": width,
                "height": height
            }
        }

        try:
            print("Iniciando requisicao")
            response = requests.post(
                self.endpoint,
                headers=self.headers,
                json=payload,
                timeout=30  # Timeout after 30 seconds
            )
            response.raise_for_status()  # Raise an exception for HTTP errors
            return response.json()
        except requests.exceptions.RequestException as e:
            # Log the error or handle it as needed
            print(f"Erro na requisição {e}")
            raise requests.HTTPError(f"Failed to generate video: {e}") from e

