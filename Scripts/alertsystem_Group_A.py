from pymongo import MongoClient
import pymongo
from datetime import datetime, timedelta
import time
from bson import json_util
# Threshold for low temperature
AIR_TEMPERATURE_THRESHOLD = 20.0  # Adjust the threshold value as needed
SOIL_MOISTURE_AREA_1_THRESHOLD = 1000
count_water_sensors = 3

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
    collection4 = db3.alarms

    # Check if there is any temperature data within the last 15 minutes
    if len(result_list2) == 0:
        print("----------data_check--------")
        print("[",datetime.now(),"] ","No data received in the last 15 minutes.")
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
        
        # Update the document in the alarms collection
        query3 = {
            'topic': 'No data received'
        }
        update3 = {
            '$set': {
                'time': receiveTime,
                'state': 'active',
                'message': 'No data received in the last 15 minutes.'
            }
        }
        collection4.find_one_and_update(query3, update3)
        
    else:
        print("----------data_check--------")
        print("Received data in the past 15 minutes.")
        # Update the document in the alarms collection
        query3 = {
            'topic': 'No data received'
        }
        update3 = {
            '$set': {
                'time': datetime.now(),
                'state': 'passive',
                'message': 'Received data in the past 15 minutes.'
            }
        }
        collection4.find_one_and_update(query3, update3)
        return True
    mongoClient3.close()

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
    collection4 = db3.alarms
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
        
        # Update the document in the alarms collection
        query3 = {
            'topic': 'Temperatre'
        }
        update3 = {
            '$set': {
                'time': receiveTime,
                'state': 'active',
                'message': 'No temperature data received in the last 15 minutes.'
            }
        }
        collection4.find_one_and_update(query3, update3)

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
            'treshhold': AIR_TEMPERATURE_THRESHOLD,
            'status': 'not handeled',
            'ignore': 'false',
            'group': 'Group A'
            }
            
            collection3.insert_one(post)
            # Update the document in the alarms collection
            query3 = {
                'topic': 'Temperature'
            }
            update3 = {
                '$set': {
                    'time': receiveTime,
                    'state': 'active',
                    'message': 'Temperature too high!'
                }
            }
            collection4.find_one_and_update(query3, update3)

        else:
            print("----------Temperature--------")
            print("Last temperature: ", temperature)
            print("Temperature max set to:", AIR_TEMPERATURE_THRESHOLD)
            print("Temperature ok.")
            # Update the document in the alarms collection
            query3 = {
                'topic': 'Temperature'
            }
            update3 = {
                '$set': {
                    'time': receiveTime,
                    'state': 'passive',
                    'message': 'Temperature ok.'
                }
            }
            collection4.find_one_and_update(query3, update3)
    
    # Close the MongoDB connection
    mongoClient3.close()
def check_water_area(sensor_number):
    # Connect to MongoDB
    mongoClient = MongoClient("mongodb+srv://maximiliannobis:kICNweoQqqRrTHoJ@cluster0.dhq8xia.mongodb.net/")
    db = mongoClient.Website
    collection = db.datas
    
    # Calculate the timestamp 15 minutes ago
    fifteen_minutes_ago = datetime.now() - timedelta(minutes=15)
    
    # Query the database for soil moisture values within the last 15 minutes
    query = {
        'time': {'$gte': fifteen_minutes_ago},
        'topic': f'esp/ground/moisture/{sensor_number}',
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
    collection4 = db3.alarms
    
    # Check if there is any soil moisture data within the last 15 minutes
    if len(result_list) == 0:
        print(f"----------Soil Moisture {sensor_number}--------")
        print(f"No soil moisture {sensor_number} data received in the last 15 minutes.")
        receiveTime = datetime.now()
        post={
            'time': receiveTime,
            'message': f'No soil moisture {sensor_number} data received in the last 15 minutes.',
            'status': 'not handeled',
            'ignore': 'false',
            'group': 'Group A'
            }
        collection3.insert_one(post)
        query3 = {
                'topic': f'water_{sensor_number}'
            }
        update3 = {
            '$set': {
                'time': receiveTime,
                'state': 'active',
                'message': f'No soil moisture {sensor_number} data received in the last 15 minutes.'
            }
        }
        collection4.find_one_and_update(query3, update3)
        
        
    else:
        latest_data = result_list[0]
        soil_moisture_area = float(latest_data['value'])
        
        if soil_moisture_area > SOIL_MOISTURE_AREA_1_THRESHOLD:
            print(f"----------Soil Moisture {sensor_number}--------")
            print(f"Last soil moisture: {soil_moisture_area}")
            print(f"Soil moisture threshhold set to {SOIL_MOISTURE_AREA_1_THRESHOLD}")
            print(f"Soil moisture {sensor_number} too less!")
            receiveTime = datetime.now()
            post={
            'time': receiveTime,
            'message': f'Soil moisture {sensor_number} too less!',
            'treshhold': AIR_TEMPERATURE_THRESHOLD,
            'status': 'not handeled',
            'ignore': 'false',
            'group': 'Group A'
            }
            collection3.insert_one(post)
            query3 = {
                'topic': f'water_{sensor_number}'
            }
            update3 = {
              '$set': {
                  'time': receiveTime,
                  'state': 'active',
                  'message': f'Soil moisture {sensor_number} too less!'
                }
            }
            collection4.find_one_and_update(query3, update3)
        else:
            print(f"----------Soil Moisture {sensor_number}--------")
            print(f"Last soil moisture: {soil_moisture_area}")
            print(f"Soil moisture threshhold set to {SOIL_MOISTURE_AREA_1_THRESHOLD}")
            print(f"Soil moisture {sensor_number} ok.")
            query3 = {
                'topic': f'water_{sensor_number}'
            }
            update3 = {
                '$set': {
                    'time': receiveTime,
                    'state': 'passive',
                    'message': f'Soil moisture {sensor_number} ok.'
                }
            }
            collection4.find_one_and_update(query3, update3)

    # Close the MongoDB connection
    mongoClient3.close()
        
while True:
    now = datetime.now()
    wait_time = (60 - now.minute) * 60 - now.second
    time.sleep(wait_time)
    if check_last_message() == True:
        check_temperature()
        for i in range(1, count_water_sensors + 1):
            check_water_area(i)
        
#for half an hour        
#while True:
#    now = datetime.now()
#    wait_time = (30 - now.minute % 30) * 60 - now.second
#    time.sleep(wait_time)
#    
#    if check_last_message() == True:
#        check_temperature()
#        check_water_area_1()
#        check_water_area_2()
#        check_water_area_3()