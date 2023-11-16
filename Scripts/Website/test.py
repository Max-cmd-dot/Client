from dateutil.parser import parse
from pymongo import MongoClient

# Connect to MongoDB
mongoClient = MongoClient("mongodb+srv://maximiliannobis:kICNweoQqqRrTHoJ@cluster0.dhq8xia.mongodb.net/")
db = mongoClient.Website
collection_data = db.datas

# Iterate over each document in the datas collection
for document in collection_data.find():
    # Convert the time field from a string to a datetime object
    time = parse(document['time'])

    # Update the document with the new datetime object
    collection_data.update_one({'_id': document['_id']}, {'$set': {'time': time}})

mongoClient.close()