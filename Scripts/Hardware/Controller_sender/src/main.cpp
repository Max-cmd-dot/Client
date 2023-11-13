#include <WiFi.h>
#include <Wire.h>
#include <Adafruit_BME280.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_TCS34725.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
// Replace the next variables with your SSID/Password combination
const char *ssid = "5551 2771";
const char *password = "a16c41b0f19cd116c4f1672ebe";

// mongodb server
const char *host = "eu-central-1.aws.data.mongodb-api.com";
String url = "/app/data-vycfd/endpoint/data/v1";
String apiKey = "wvNMOVt8Ad5sd3surfPXFePxxPIJLYe29bSnETeQqwIH7smcbzUM2Lt2t9fbOiDb";

// digital sensors
Adafruit_BME280 bme; // I2C
Adafruit_TCS34725 tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_614MS, TCS34725_GAIN_1X);
long lastMsg = 0;
int value = 0;

// define sensor pins
#define AOUT_PIN 35
#define AOUT_PIN2 34
#define AOUT_PIN3 33

// define sensor variables
float temperature = 0;
float humidity = 0;
float pressure = 0;
float moisture = 0;
float moisture_2 = 0;
float moisture_3 = 0;

// Define the LED pins
const int ledPump1 = 12;
const int ledPump2 = 14;
const int ledPump3 = 27;
const int ledVentilator1 = 16;
const int ledRoof1 = 18; // change this to system led
const int ledHumidifyer1 = 17;

void setup_wifi()
{
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  int dotCounter = 0;
  int maxRetryCount = 10;

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
    dotCounter++;

    if (dotCounter > 20)
    {
      dotCounter = 0;
      if (maxRetryCount > 0)
      {
        maxRetryCount--;
        Serial.println("\nConnection timeout. Restarting...");
        WiFi.disconnect();
        delay(1000);
        WiFi.begin(ssid, password);
      }
      else
      {
        Serial.println("\nMax retry count reached. Connection failed.");
        break;
      }
    }
  }

  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
  }
}
void setup()
{
  // Start the serial connection
  Serial.begin(115200);

  // Initialize the LED pins as output
  pinMode(ledPump1, OUTPUT);
  pinMode(ledPump2, OUTPUT);
  pinMode(ledPump3, OUTPUT);
  pinMode(ledVentilator1, OUTPUT);
  pinMode(ledRoof1, OUTPUT);
  pinMode(ledHumidifyer1, OUTPUT);

  // Initialize I2C communication
  Wire.begin();

  // Check BME280 sensor connection
  if (!bme.begin(0x76))
  { // Replace 0x76 with the appropriate sensor address
    Serial.println("Failed to connect to the BME280 sensor. Please check the wiring.");
    while (1)
      ; // Halt the program if the sensor connection fails
  }

  // Check TCS34725 sensor connection
  if (!tcs.begin())
  {
    Serial.println("Failed to connect to the TCS34725 sensor. Please check the wiring.");
    while (1)
      ; // Halt the program if the sensor connection fails
  }
  setup_wifi();
}

void sendToServer(String topic, String group, String value)
{
  // Create a JSON object
  String json = "{\"topic\":\"" + topic + "\",\"group\":\"" + group + "\",\"value\":\"" + value + "\"}";
  HTTPClient http;
  http.begin("https://eu-central-1.aws.data.mongodb-api.com/app/data-vycfd/endpoint/data/v1/action/insertOne");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Access-Control-Request-Headers", "*");
  http.addHeader("api-key", apiKey); // Specify content-type header
  String requestData = "{\"collection\":\"datas\",\"database\":\"Website\",\"dataSource\":\"Cluster0\",\"document\":" + json + "}";
  int httpResponseCode = http.POST(requestData);
  if (httpResponseCode > 0)
  {
    String response = http.getString(); // Get the response to the request
    Serial.println(httpResponseCode);   // Print return code
    Serial.println(response);           // Print request answer
  }
  else
  {
    Serial.print("Error on sending POST: ");
    Serial.println(httpResponseCode);
  }

  http.end(); // Free resources
}
void processHttpResponse()
{
  HTTPClient http;
  http.begin("https://eu-central-1.aws.data.mongodb-api.com/app/data-vycfd/endpoint/data/v1/action/find");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Access-Control-Request-Headers", "*");
  http.addHeader("api-key", apiKey);

  String requestData = "{\"collection\":\"actions\",\"database\":\"Website\",\"dataSource\":\"Cluster0\"}";
  int httpResponseCode = http.POST(requestData);

  if (httpResponseCode > 0)
  {
    String response = http.getString();
    Serial.println(response);

    // Parse the JSON response
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, response);

    // Loop through each document in the response
    for (JsonObject document : doc["documents"].as<JsonArray>())
    {
      String object = document["object"];
      String value = document["value"];

      // Turn on or off the LED based on the object value
      if (object == "pump_1")
        digitalWrite(ledPump1, value == "on" ? HIGH : LOW);
      else if (object == "pump_2")
        digitalWrite(ledPump2, value == "on" ? HIGH : LOW);
      else if (object == "pump_3")
        digitalWrite(ledPump3, value == "on" ? HIGH : LOW);
      else if (object == "ventilator_1")
        digitalWrite(ledVentilator1, value == "on" ? HIGH : LOW);
      else if (object == "roof_1")
        digitalWrite(ledRoof1, value == "on" ? HIGH : LOW);
      else if (object == "humidifyer_1")
        digitalWrite(ledHumidifyer1, value == "on" ? HIGH : LOW);
    }
  }
  else
  {
    Serial.print("Error on sending POST: ");
    Serial.println(httpResponseCode);
  }

  http.end();
}
void sendSensorData()
{

  // temperature
  temperature = bme.readTemperature();
  char tempString[8];
  dtostrf(temperature, 1, 2, tempString);
  String temperatureTopic = "esp/air/temperature";
  String temperaturePayload = String(tempString) + "," + "Group A";
  sendToServer(temperatureTopic, "Group A", temperaturePayload);

  // humidity
  humidity = bme.readHumidity();
  char humString[8];
  dtostrf(humidity, 1, 2, humString);
  String humidityTopic = "esp/air/humidity";
  String humidityPayload = String(humString) + "," + "Group A";
  sendToServer(humidityTopic, "Group A", humidityPayload);
  delay(1000);

  // pressure
  pressure = (bme.readPressure() / 100.0F);
  char preString[8];
  dtostrf(pressure, 1, 2, preString);
  String pressureTopic = "esp/air/pressure";
  String pressurePayload = String(preString) + "," + "Group A";
  sendToServer(pressureTopic, "Group A", pressurePayload);

  // moisture/1
  moisture = analogRead(AOUT_PIN);
  char moiString[8];
  dtostrf(moisture, 1, 2, moiString);
  String moistureTopic = "esp/ground/moisture/1";
  String moisturePayload = String(moiString) + "," + "Group A";
  sendToServer(moistureTopic, "Group A", moisturePayload);

  // moisture/2
  moisture_2 = analogRead(AOUT_PIN);
  char moiString_2[8];
  dtostrf(moisture_2, 1, 2, moiString_2);
  String moistureTopic_2 = "esp/ground/moisture/2";
  String moisturePayload_2 = String(moiString) + "," + "Group A";
  sendToServer(moistureTopic_2, "Group A", moisturePayload_2);

  // moisture/3
  moisture_3 = analogRead(AOUT_PIN);
  char moiString_3[8];
  dtostrf(moisture, 1, 2, moiString);
  String moistureTopic_3 = "esp/ground/moisture/3";
  String moisturePayload_3 = String(moiString) + "," + "Group A";
  sendToServer(moistureTopic, "Group A", moisturePayload);

  // light/colorTemp
  uint16_t r, g, b, c, colorTemp, lux;
  tcs.getRawData(&r, &g, &b, &c);
  colorTemp = tcs.calculateColorTemperature_dn40(r, g, b, c);
  char colorTempString[8];
  dtostrf(colorTemp, 1, 2, colorTempString);
  String colorTempTopic = "esp/ground/light/colorTemp";
  String colorTempPayload = String(colorTempString) + "," + "Group A";
  sendToServer(colorTempTopic, "Group A", colorTempPayload);

  // light/lux
  char luxString[8];
  dtostrf(lux, 1, 2, luxString);
  String luxTopic = "esp/ground/light/lux";
  String luxPayload = String(luxString) + "," + "Group A";
  sendToServer(luxTopic, "Group A", luxPayload);

  // light/red
  char rString[8];
  dtostrf(r, 1, 2, rString);
  String rTopic = "esp/ground/light/red";
  String rPayload = String(rString) + "," + "Group A";
  sendToServer(rTopic, "Group A", rPayload);

  // light/green
  char gString[8];
  dtostrf(g, 1, 2, gString);
  String gTopic = "esp/ground/light/green";
  String gPayload = String(gString) + "," + "Group A";
  sendToServer(gTopic, "Group A", gPayload);

  // light/blue
  char bString[8];
  dtostrf(b, 1, 2, bString);
  String bTopic = "esp/ground/light/blue";
  String bPayload = String(bString) + "," + "Group A";
  sendToServer(bTopic, "Group A", bPayload);

  // light/clear
  char cString[8];
  dtostrf(c, 1, 2, cString);
  String cTopic = "esp/ground/light/clear";
  String cPayload = String(cString) + "," + "Group A";
  sendToServer(cTopic, "Group A", cPayload);
}

void loop()
{
  if (WiFi.status() == WL_CONNECTED)
  {

    printf("Processing http response...\n");
    processHttpResponse();
    printf("Sending data to server...\n");
    sendSensorData();

    delay(20000);
  }
  else
  {
    setup_wifi();
  }
}