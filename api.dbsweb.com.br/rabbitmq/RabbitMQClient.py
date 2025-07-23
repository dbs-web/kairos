import pika
import json

class RabbitMQClient:
    def __init__(self, host,port, queue_name, user, password):
        self.host = host
        self.queue_name = queue_name

        self.credentials = pika.PlainCredentials(user, password)
        self.parameters = pika.ConnectionParameters(host, port, "/",self.credentials)
        self.connection = pika.BlockingConnection(self.parameters)
        
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=self.queue_name)

    
    def publish(self, message: dict):
        self.channel.basic_publish(
            exchange="",
            routing_key=self.queue_name,
            body=json.dumps(message)
        )

    def consume(self, callback):
        self.channel.basic_qos(prefetch_count=3)
        self.channel.basic_consume(queue=self.queue_name, on_message_callback=callback)
        self.channel.start_consuming()