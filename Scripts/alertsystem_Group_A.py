from pymongo import MongoClient
import pymongo
from datetime import datetime, timedelta
import time
from bson import json_util
# Threshold for low temperature
AIR_TEMPERATURE_THRESHOLD = 20.0  # Adjust the threshold value as needed
SOIL_MOISTURE_AREA_1_THRESHOLD = 1000

def check_last_message():
    # Connect to MongoDB
    mongoClient2 = MongoClient("mongodb+srv://maximiliannobis:kICNweoQqqRrTHoJ@cluster0.dhq8xia.mongodb.net/")
    db2 = mongoClient2.Website
    collection2 = db2.datas

    # Calculate the timestamp 15 minutes ago
    fifteen_minutes_ago2 = datetime.now() - timedelta(minutes=15)

    # Query the database for temperature values within the last 15 minutes
    query2 = {
        'time': {'$gte': fifteen_minutes_ago2},
        'group': 'Group A'
    }
    projection2 = {
        'value': 1,
        '_id': 0
    }

    result2 = collection2.find(query2, projection2).sort('time', pymongo.DESCENDING).limit(1)
    result_list2 = list(result2)
    mongoClient2.close()
    mongoClient3 = MongoClient("mongodb+srv://maximiliannobis:kICNweoQqqRrTHoJ@cluster0.dhq8xia.mongodb.net/")
    db3 = mongoClient3.Website
    collection3 = db3.notifications

    # Check if there is any temperature data within the last 15 minutes
    if len(result_list2) == 0:
        print("----------data_check--------")
        print("No data received in the last 15 minutes.")
        # Perform your alert action here
        # For example, send an email or trigger a notification
        receiveTime = datetime.now()
        receiveTime = receiveTime.replace(microsecond=0)
        post = {
            'time': receiveTime,
            'message': 'No data received in the last 15 minutes.',
            'status': 'not handeled',
            'ignore': 'false',
            'group': 'Group A'
        }
        
        collection3.insert_one(post)
    else:
        print("----------data_check--------")
        print("Received data in the past 15 minutes.")
        return True

def check_temperature():
# Connect to MongoDB
    mongoClient = MongoClient("mongodb+srv://maximiliannobis:kICNweoQqqRrTHoJ@cluster0.dhq8xia.mongodb.net/")
    db = mongoClient.Website
    collection = db.datas
    
    # Calculate the timestamp 15 minutes ago
    fifteen_minutes_ago = datetime.now() - timedelta(minutes=15)
    
    # Query the database for temperature values within the last 15 minutes
    query = {
        'time': {'$gte': fifteen_minutes_ago},
        'topic': 'esp/air/temperature',
        'group': 'Group A'
    }
    projection = {
        'value': 1,
        '_id': 0
    }

    result = collection.find(query, projection).sort('time', pymongo.DESCENDING).limit(1)
    result_list = list(result)
    mongoClient.close()
    mongoClient3 = MongoClient("mongodb+srv://maximiliannobis:kICNweoQqqRrTHoJ@cluster0.dhq8xia.mongodb.net/")
    db3 = mongoClient3.Website
    collection3 = db3.notifications
    # Check if there is any temperature data within the last 15 minutes
    if len(result_list) == 0:
        print("No temperature data received in the last 15 minutes.")
        receiveTime = datetime.now()
        post={
            'time': receiveTime,
            'message': 'No temperature data received in the last 15 minutes.',
            'status': 'not handeled',
            'ignore': 'false',
            'group': 'Group A'
            }
        collection3.insert_one(post)

    else:
        latest_data = result_list[0]
        temperature = float(latest_data['value'])
        
        if temperature < AIR_TEMPERATURE_THRESHOLD:
            print("----------Temperature--------")
            print("Temperature too high!")
            print("Last temperature: ", temperature)
            print("Temperature max set to:", AIR_TEMPERATURE_THRESHOLD)
            receiveTime = datetime.now()
            post={
            'time':  receiveTime,
            'message': 'Temperature too high!',
            'Treshold': AIR_TEMPERATURE_THRESHOLD,
            'status': 'not handeled',
            'ignore': 'false',
            'group': 'Group A'
            }
            
            collection3.insert_one(post)

        else:
            print("----------Temperature--------")
            print("Last temperature: ", temperature)
            print("Temperature max set to:", AIR_TEMPERATURE_THRESHOLD)
            print("Temperature ok.")
    
    # Close the MongoDB connection
    mongoClient.close()

        
def check_water_area_1():
# Connect to MongoDB
    mongoClient = MongoClient("mongodb+srv://maximiliannobis:kICNweoQqqRrTHoJ@cluster0.dhq8xia.mongodb.net/")
    db = mongoClient.Website
    collection = db.datas
    
    # Calculate the timestamp 15 minutes ago
    fifteen_minutes_ago = datetime.now() - timedelta(minutes=15)
    
    # Query the database for soil moisture values within the last 15 minutes
    query = {
        'time': {'$gte': fifteen_minutes_ago},
        'topic': 'esp/ground/moisture/1',
        'group': 'Group A'
    }
    projection = {
        'value': 1,
        '_id': 0
    }

    result = collection.find(query, projection).sort('time', pymongo.DESCENDING).limit(1)
    result_list = list(result)
    mongoClient.close()
    mongoClient3 = MongoClient("mongodb+srv://maximiliannobis:kICNweoQqqRrTHoJ@cluster0.dhq8xia.mongodb.net/")
    db3 = mongoClient3.Website
    collection3 = db3.notifications
    # Check if there is any soil moisture data within the last 15 minutes
    if len(result_list) == 0:
        print("----------Soil Moisture 1--------")
        print("No soil moisture 1 data received in the last 15 minutes.")
        receiveTime = datetime.now()
        post={
            'time': receiveTime,
            'message': 'No soil moisture 1 data received in the last 15 minutes.',
            'status': 'not handeled',
            'ignore': 'false',
            'group': 'Group A'
            }
        collection3.insert_one(post)
        
    else:
        latest_data = result_list[0]
        soil_moisture_area_1 = float(latest_data['value'])
        
        if soil_moisture_area_1 > SOIL_MOISTURE_AREA_1_THRESHOLD:
            print("----------Soil Moisture 1--------")
            print("Last soil moisture: ", soil_moisture_area_1)
            print("Soil moisture threshhold set to", SOIL_MOISTURE_AREA_1_THRESHOLD)
            print("Soil moisture 1 to less!")
            receiveTime = datetime.now()
            post={
            'time': receiveTime,
            'message': 'Soil moisture 1 to less!',
            'Treshold': AIR_TEMPERATURE_THRESHOLD,
            'status': 'not handeled',
            'ignore': 'false',
            'group': 'Group A'
            }
            collection3.insert_one(post)
        else:
            print("----------Soil Moisture 1--------")
            print("Last soil moisture: ", soil_moisture_area_1)
            print("Soil moisture threshhold set to", SOIL_MOISTURE_AREA_1_THRESHOLD)
            print("Soil moisture 1 ok.")
    mongoClient.close()

def check_water_area_2():
# Connect to MongoDB
    mongoClient = MongoClient("mongodb+srv://maximiliannobis:kICNweoQqqRrTHoJ@cluster0.dhq8xia.mongodb.net/")
    db = mongoClient.Website
    collection = db.datas
    
    # Calculate the timestamp 15 minutes ago
    fifteen_minutes_ago = datetime.now() - timedelta(minutes=15)
    
    # Query the database for soil moisture values within the last 15 minutes
    query = {
        'time': {'$gte': fifteen_minutes_ago},
        'topic': 'esp/ground/moisture/2',
        'group': 'Group A'
    }
    projection = {
        'value': 1,
        '_id': 0
    }

    result = collection.find(query, projection).sort('time', pymongo.DESCENDING).limit(1)
    result_list = list(result)
    mongoClient.close()
    mongoClient3 = MongoClient("mongodb+srv://maximiliannobis:kICNweoQqqRrTHoJ@cluster0.dhq8xia.mongodb.net/")
    db3 = mongoClient3.Website
    collection3 = db3.notifications
    
    # Check if there is any soil moisture 2 data within the last 15 minutes
    if len(result_list) == 0:
        print("----------Soil Moisture 2--------")
        print("No soil moisture 2 data received in the last 15 minutes.")
        receiveTime = datetime.now()
        post={
            'time': receiveTime,
            'message': 'No soil moisture 2 data received in the last 15 minutes.',
            'status': 'not handeled',
            'ignore': 'false',
            'group': 'Group A'
            }
        collection3.insert_one(post)
        
    else:
        latest_data = result_list[0]
        soil_moisture_area_2 = float(latest_data['value'])
        
        if soil_moisture_area_2 > SOIL_MOISTURE_AREA_1_THRESHOLD:
            print("----------Soil Moisture 2--------")
            print("Last soil moisture: ", soil_moisture_area_2)
            print("Soil moisture threshhold set to: ", SOIL_MOISTURE_AREA_1_THRESHOLD)
            print("Soil moisture 2 to less!")
            receiveTime = datetime.now()
            post={
            'time': receiveTime,
            'message': 'Soil moisture 2 to less!',
            'Treshold': SOIL_MOISTURE_AREA_1_THRESHOLD,
            'status': 'not handeled',
            'ignore': 'false',
            'group': 'Group A'
            }
            collection3.insert_one(post)
        else:
            print("----------Soil Moisture 2--------")
            print("Last soil moisture: ", soil_moisture_area_2)
            print("Soil moisture threshhold set to: ", SOIL_MOISTURE_AREA_1_THRESHOLD)
            print("Soil moisture 2 ok.")

    # Close the MongoDB connection
    mongoClient.close()

def check_water_area_3():
    # Connect to MongoDB
    mongoClient = MongoClient("mongodb+srv://maximiliannobis:kICNweoQqqRrTHoJ@cluster0.dhq8xia.mongodb.net/")
    db = mongoClient.Website
    collection = db.datas
    
    # Calculate the timestamp 15 minutes ago
    fifteen_minutes_ago = datetime.now() - timedelta(minutes=15)
    
    # Query the database for soil moisture values within the last 15 minutes
    query = {
        'time': {'$gte': fifteen_minutes_ago},
        'topic': 'esp/ground/moisture/3',
        'group': 'Group A'
    }
    projection = {
        'value': 1,
        '_id': 0
    }
    result = collection.find(query, projection).sort('time', pymongo.DESCENDING).limit(1)
    result_list = list(result)
    mongoClient.close()
    mongoClient3 = MongoClient("mongodb+srv://maximiliannobis:kICNweoQqqRrTHoJ@cluster0.dhq8xia.mongodb.net/")
    db3 = mongoClient3.Website
    collection3 = db3.notifications
    
    # Check if there is any soil moisture 3 data within the last 15 minutes
    if len(result_list) == 0:
        print("----------Soil Moisture 3--------")
        print("No soil moisture 3 data received in the last 15 minutes.")
        receiveTime = datetime.now()
        post={
            'time': receiveTime,
            'message': 'No soil moisture 3 data received in the last 15 minutes.',
            'status': 'not handeled',
            'ignore': 'false',
            'group': 'Group A'
            }
        collection3.insert_one(post)
    else:
        latest_data = result_list[0]
        soil_moisture_area_3 = float(latest_data['value'])
        if soil_moisture_area_3 > SOIL_MOISTURE_AREA_1_THRESHOLD:
            print("----------Soil Moisture 3--------")
            print("Last soil moisture: ", soil_moisture_area_3)
            print("Soil moisture threshhold set to: ", SOIL_MOISTURE_AREA_1_THRESHOLD)
            print("Soil moisture 3 to less!")
            receiveTime = datetime.now()
            post={
            'time': receiveTime,
            'message': 'No data received in the last 15 minutes.',
            'Treshold': SOIL_MOISTURE_AREA_1_THRESHOLD,
            'status': 'not handeled',
            'ignore': 'false',
            'group': 'Group A'
            }
            collection3.insert_one(post)
        else:
            print("----------Soil Moisture 3--------")
            print("Last soil moisture: ", soil_moisture_area_3)
            print("Soil moisture threshhold set to: ", SOIL_MOISTURE_AREA_1_THRESHOLD)
            print("Soil moisture 3 ok.")
    # Close the MongoDB connection
    mongoClient.close()

while True:
   
    if check_last_message() == True:
        check_temperature()
        check_water_area_1()
        check_water_area_2()
        check_water_area_3()

    time.sleep(900)  