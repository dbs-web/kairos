import os
import json
from random import randint
import httpx

class N8nClient:
    """
    A client for handling N8N webhook callbacks and content processing
    """

    def __init__(self, token: str):
        """Initializes DiFy client by reading the token from argument and url from environment variables

        Args:
            token (str): Token of DiFy Agent

        Raises:
            ValueError: Dify Agent token must be set
        """
        self.token = token
        if not self.token:
            raise ValueError("Dify token must be set")

        self.KAIROS_API_SECRET = os.getenv("API_SECRET")
        if not self.KAIROS_API_SECRET:
            raise ValueError("Kairos Api Secret must be set")

        self.CONTENT_CALLBACK_URL = os.getenv("CONTENT_CALLBACK_URL")
        if not self.CONTENT_CALLBACK_URL:
            raise ValueError("Content callback url must be set")

        self.url = {
            "agent": "https://api.dify.ai/v1/chat-messages",
            "workflow": "https://api.dify.ai/v1/workflows/run",
        }

        self.headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }

    def build_payload_workflow(self, message: str, custom_args: dict = None):
        self.payload = {
            "inputs": {
                "text": message,
            },
            "response_mode": "blocking",
            "user": randint(1, 100000000)
        }
        if custom_args:
            # Mescla os argumentos custom na chave "inputs"
            self.payload["inputs"].update(custom_args)

    def build_payload_agent(self, message: str, custom_args: dict = None):
        self.payload = {
            "query": message,
            "inputs": custom_args if custom_args else {},
            "response_mode": "streaming",
            "user": randint(1, 100000000)
        }


    async def send_message(self, message, custom_args: dict = None):
        self.build_payload_workflow(message, custom_args)
        async with httpx.AsyncClient() as client:
            return await client.post(
                self.url["workflow"], 
                headers=self.headers, 
                json=self.payload, 
                timeout=300
            )

    async def chat_agent(self, message):
        """Send a message to the agent endpoint in streaming mode,
        process as streaming, and concats the 'agent_message'events as a
        single message, like a blocking mode.
        """
        self.build_payload_agent(message)
        final_answer = ""
        async with httpx.AsyncClient() as client:
            async with client.stream("POST", self.url["agent"], headers=self.headers, json=self.payload, timeout=300) as response:
                if response.status_code != 200:
                    content = await response.aread()
                    raise Exception(f"Error calling DiFy API: {content.decode()}")
                # Itera sobre cada linha da resposta (cada linha é um evento JSON)
                async for line in response.aiter_lines():
                    if line.strip():
                        if line.startswith("data: "):
                            line = line[len("data: "):]
                        try:
                            data = json.loads(line)
                        except Exception:
                            continue  # Pula linhas que não forem JSON válidos
                        event_type = data.get("event")
                        # Se for mensagem do agent, concatena a resposta
                        if event_type == "agent_message":
                            answer = data.get("answer", "")
                            final_answer += answer
                        # Quando o evento message_end for recebido, encerra a leitura
                        if event_type == "message_end":
                            break
        return final_answer

    async def send_response_to_callback(self, briefing_id, response_text, source):
        try:
            headers = {
                "Content-Type": "application/json",
                "x-api-key": self.KAIROS_API_SECRET,
            }
            payload = {
                "briefingId": briefing_id,
                "text": response_text,
                "sources": source
            }
            async with httpx.AsyncClient() as client:
                response = await client.post(self.CONTENT_CALLBACK_URL, headers=headers, json=payload, timeout=30)
            if response.status_code != 200:
                raise Exception(f"Error sending callback: {response.text}")
        except Exception as e:
            print("Error on sending response to callback: ", e)


    async def send_message_without_callback(self, message, custom_args: dict = None):
        self.build_payload_workflow(message, custom_args)
        async with httpx.AsyncClient() as client:
            print(f"Payload: {self.payload}")
            response = await client.post(
                self.url["workflow"], 
                headers=self.headers, 
                json=self.payload, 
                timeout=60
            )
        if response.status_code != 200:
            error_detail = (
                response.json() 
                if response.headers.get("Content-Type") == "application/json" 
                else response.text
            )
            raise Exception(f"Error calling DiFy API: {error_detail}")
        return response

    async def send_message_and_wait_for_callback(self, message, briefing_id, custom_args: dict = None):
        response = await self.send_message(message, custom_args)
        if response.status_code != 200:
            error_detail = (
                response.json() 
                if response.headers.get("Content-Type") == "application/json" 
                else response.text
            )
            raise Exception(f"Error calling DiFy API: {error_detail}")
        try:
            data = response.json()
            text = data["data"]["outputs"]["saida"]
            source = ""
            if "outputs" in data["data"] and "pesquisa" in data["data"]["outputs"]:
                source = data["data"]["outputs"]["pesquisa"]
        except Exception as e:
            raise Exception("Error on response parsing", e)
        await self.send_response_to_callback(
            briefing_id=briefing_id, response_text=text, source=source
        )
