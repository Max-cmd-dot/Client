#!/usr/bin/env python3
import paho.mqtt.client as mqtt
import datetime
import time
from pymongo import MongoClient
import logging

logging.basicConfig(filename='mqtt2mongodb.log', level=logging.DEBUG)

def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe("esp/#")
    logging.info('Connected with result code ' + str(rc))
    
def on_message(client, userdata, msg):
    receiveTime = datetime.datetime.now()
    print(str(receiveTime))
    message = msg.payload.decode("utf-8")
    isfloatValue = False
    try:
        # Split the message to separate the value from the group information
        parts = message.split(",")
        val = float(parts[0])  # Extract the value
        group = parts[1] if len(parts) > 1 else ""  # Extract the group information if available
        isfloatValue = True
    except:
        isfloatValue = False

    if isfloatValue:
        print(str(receiveTime) + ": " + msg.topic + " " + str(val))
        logging.info(str(receiveTime) + ": " + msg.topic + " " + str(val))
        post = {"time": receiveTime, "topic": msg.topic, "group": group, "value": val}
    else:
        print(str(receiveTime) + ": " + msg.topic + " " + message)
        logging.info(str(receiveTime) + ": " + msg.topic + " " + message)
        post = {"time": receiveTime, "topic": msg.topic, "group": group, "value": message}

    # Remove the group information from the value field
    post['value'] = str(post['value']).split(',')[0]

    collection.insert_one(post)

# Set up client for MongoDB
mongoClient = MongoClient("mongodb+srv://maximiliannobis:kICNweoQqqRrTHoJ@cluster0.dhq8xia.mongodb.net/")
db = mongoClient.Website
collection = db.datas

# Initialize the client that should connect to the Mosquitto broker
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect("127.0.0.1", 1883)

# Blocking loop to the Mosquitto broker
client.loop_start()  # Start the loop in a non-blocking thread

# Keep the main thread running to introduce the delay
while True:
    time.sleep(1)  # Wait for 1 second before processing next batch of messages
