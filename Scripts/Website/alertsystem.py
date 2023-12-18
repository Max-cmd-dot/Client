from pymongo import MongoClient
import pymongo
from datetime import datetime, timedelta

# Constants
CONNECTION_STRING = "mongodb+srv://maximiliannobis:kICNweoQqqRrTHoJ@cluster0.dhq8xia.mongodb.net/"
AIR_TEMPERATURE_THRESHOLD = 20.0
SOIL_MOISTURE_AREA_1_THRESHOLD = 1000
count_water_sensors = 3

# Open a single MongoDB connection
mongoClient = MongoClient(CONNECTION_STRING)
db = mongoClient.Website

def get_all_groups():
    collection_groups_get = db.groups
    all_groups = collection_groups_get.find()
    group_names = [group['name'] for group in all_groups]
    return group_names

def check_last_message(group):
    collection_data = db.datas
    collection_notifications = db.notifications
    collection_alarms = db.alarms

    # Calculate the timestamp 1 hour ago
    one_hour_ago = datetime.now() - timedelta(hours=1)

    # Query the database for temperature values within the last 1 hour
    query = {
        'time': {'$gte': one_hour_ago},
        'group': group
    }
    projection = {
        'value': 1,
        '_id': 0
    }

    result = collection_data.find(query, projection).sort('time', pymongo.DESCENDING).limit(1)
    result_list = list(result)

    # Check if there is any temperature data within the last 1 hour
    if len(result_list) == 0:
        # Perform your alert action here
        # For example, send an email or trigger a notification
        receiveTime = datetime.now()
        receiveTime = receiveTime.replace(microsecond=0)
        post = {
            'time': receiveTime,
            'message': 'No data received in the last 1 hour.',
            'status': 'not handeled',
            'ignore': 'false',
            'group': group
        }
        
        collection_notifications.insert_one(post)
        
        # Update the document in the alarms collection
        query_alarm = {
            'topic': 'No data received'
        }
        update_alarm = {
            '$set': {
                'time': receiveTime,
                'state': 'active',
                'message': 'No data received for 1 hour.'
            }
        }
        collection_alarms.find_one_and_update(query_alarm, update_alarm, upsert=True)
        
    else:
        # Update the document in the alarms collection
        query_alarm = {
            'topic': 'No data received'
        }
        update_alarm = {
            '$set': {
                'time': datetime.now(),
                'state': 'passive',
                'message': 'Received data in the last hour.'
            }
        }
        collection_alarms.find_one_and_update(query_alarm, update_alarm, upsert=True)
        return True
    
def check_temperature(group):
        collection_data = db.datas
        collection_notifications = db.notifications
        collection_alarms = db.alarms

        # Calculate the timestamp 15 minutes ago
        fifteen_minutes_ago = datetime.now() - timedelta(minutes=15)

        # Query the database for temperature values within the last 15 minutes
        query = {
            'time': {'$gte': fifteen_minutes_ago},
            'topic': 'esp/air/temperature',
            'group': group
        }
        projection = {
            'value': 1,
            '_id': 0
        }

        result = collection_data.find(query, projection).sort('time', pymongo.DESCENDING).limit(1)
        result_list = list(result)

        # Check if there is any temperature data within the last 15 minutes
        if len(result_list) == 0:
            # Perform your alert action here
            # For example, send an email or trigger a notification
            receiveTime = datetime.now()
            post = {
                'time': receiveTime,
                'message': 'No temperature data received in the last 15 minutes.',
                'status': 'not handeled',
                'ignore': 'false',
                'group': group
            }
            collection_notifications.insert_one(post)

            # Update the document in the alarms collection
            query_alarm = {
                'topic': 'Temperature'
            }
            update_alarm = {
                '$set': {
                    'time': receiveTime,
                    'state': 'active',
                    'message': 'No temperature data received in the last 15 minutes.'
                }
            }
            collection_alarms.find_one_and_update(query_alarm, update_alarm, upsert=True)

        else:
            latest_data = result_list[0]
            temperature = float(latest_data['value'])

            if temperature < AIR_TEMPERATURE_THRESHOLD:
                # Perform your alert action here
                # For example, send an email or trigger a notification
                receiveTime = datetime.now()
                post = {
                    'time': receiveTime,
                    'message': 'Temperature too high!',
                    'treshhold': AIR_TEMPERATURE_THRESHOLD,
                    'status': 'not handeled',
                    'ignore': 'false',
                    'group': group
                }
                collection_notifications.insert_one(post)

                # Update the document in the alarms collection
                query_alarm = {
                    'topic': 'Temperature'
                }
                update_alarm = {
                    '$set': {
                        'time': receiveTime,
                        'state': 'active',
                        'message': 'Temperature too high!'
                    }
                }
                collection_alarms.find_one_and_update(query_alarm, update_alarm, upsert=True)

            else:
                # Update the document in the alarms collection
                query_alarm = {
                    'topic': 'Temperature'
                }
                update_alarm = {
                    '$set': {
                        'time': datetime.now(),
                        'state': 'passive',
                        'message': 'Temperature ok.'
                    }
                }
                collection_alarms.find_one_and_update(query_alarm, update_alarm, upsert=True)

def check_water_area(sensor_number, group):
        collection_data = db.datas
        collection_notifications = db.notifications
        collection_alarms = db.alarms

        # Calculate the timestamp 15 minutes ago
        fifteen_minutes_ago = datetime.now() - timedelta(minutes=15)

        # Query the database for soil moisture values within the last 15 minutes
        query = {
            'time': {'$gte': fifteen_minutes_ago},
            'topic': f'esp/ground/moisture/{sensor_number}',
            'group': group
        }
        projection = {
            'value': 1,
            '_id': 0
        }

        result = collection_data.find(query, projection).sort('time', pymongo.DESCENDING).limit(1)
        result_list = list(result)

        # Check if there is any soil moisture data within the last 15 minutes
        if len(result_list) == 0:
            # Perform your alert action here
            # For example, send an email or trigger a notification
            receiveTime = datetime.now()
            post = {
                'time': receiveTime,
                'message': f'No soil moisture {sensor_number} data received in the last 15 minutes.',
                'status': 'not handeled',
                'ignore': 'false',
                'group': group
            }
            collection_notifications.insert_one(post)

            # Update the document in the alarms collection
            query_alarm = {
                'topic': f'water_{sensor_number}'
            }
            update_alarm = {
                '$set': {
                    'time': receiveTime,
                    'state': 'active',
                    'message': f'No soil moisture {sensor_number} data received in the last 15 minutes.'
                }
            }
            collection_alarms.find_one_and_update(query_alarm, update_alarm, upsert=True)

        else:
            latest_data = result_list[0]
            soil_moisture_area = float(latest_data['value'])

            if soil_moisture_area > SOIL_MOISTURE_AREA_1_THRESHOLD:
                # Perform your alert action here
                # For example, send an email or trigger a notification
                receiveTime = datetime.now()
                post = {
                    'time': receiveTime,
                    'message': f'Soil moisture {sensor_number} too less!',
                    'treshhold': AIR_TEMPERATURE_THRESHOLD,
                    'status': 'not handeled',
                    'ignore': 'false',
                    'group': group
                }
                collection_notifications.insert_one(post)

                # Update the document in the alarms collection
                query_alarm = {
                    'topic': f'water_{sensor_number}'
                }
                update_alarm = {
                    '$set': {
                        'time': receiveTime,
                        'state': 'active',
                        'message': f'Soil moisture {sensor_number} too less!'
                    }
                }
                collection_alarms.find_one_and_update(query_alarm, update_alarm, upsert=True)

            else:
                # Update the document in the alarms collection
                query_alarm = {
                    'topic': f'water_{sensor_number}'
                }
                update_alarm = {
                    '$set': {
                        'time': datetime.now(),
                        'state': 'passive',
                        'message': f'Soil moisture {sensor_number} ok.'
                    }
                }
                collection_alarms.find_one_and_update(query_alarm, update_alarm, upsert=True)
                
while True:
    now = datetime.now()
    wait_time = (60 - now.minute) * 60 - now.second
    #time.sleep(wait_time)
    groups = get_all_groups()
    for group in groups:
        if check_last_message(group) == True:
            check_temperature(group)
            for i in range(1, count_water_sensors + 1):
                check_water_area(i, group)
        
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