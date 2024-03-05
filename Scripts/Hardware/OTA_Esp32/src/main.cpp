#include <Arduino.h>
#include <WiFi.h>
#include <Wire.h>
#include <Adafruit_TCS34725.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <time.h>
#include <esp32fota.h>
#include <FS.h>
#include <SPIFFS.h>
#include <WiFiManager.h>
#include <Adafruit_BME680.h>
// https://dronebotworkshop.com/wifimanager/
//  JSON configuration file

// Define WiFiManager Object
WiFiManager wm;
String version = "1.0.4";
// esp32fota esp32fota("<Type of Firme for this device>", <this version>, <validate signature>);
esp32FOTA esp32FOTAmy("esp32-fota-http", version, false);
unsigned long lastHttpResponseTime = 0;
unsigned long httpResponseInterval = 5000; // 5 seconds

unsigned long lastSensorDataTime = 0;
unsigned long sensorDataInterval = 5000; // 5 seconds
// unsigned long sensorDataInterval = 60000; // 1 minute
const char *manifest_url = "http://192.168.178.121:8080/api/hardware/update";
// const char *manifest_url = "https://backend.nexaharvest.com/api/hardware/update";

// getting the current time
const char *ntpServer = "pool.ntp.org";

// define the timeout for the http request
const int timeout = 5000; // 5 seconds
const int maxRetries = 50;

// backend server //for mongodb credentials
const char *hostBackendHardware = "http://192.168.178.121:8080/api/hardware";
// const char *hostBackendHardware = "https://backend.nexaharvest.com/api/hardware";

// const int deviceId = 1;
String deviceId = String(ESP.getEfuseMac(), HEX); // Convert uint64_t to String
// digital sensors
Adafruit_BME680 bme; // I2C
Adafruit_TCS34725 tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_614MS, TCS34725_GAIN_1X);

// start values
long lastMsg = 0;
int value = 0;

// define sensor pins
#define AOUT_PIN 35
#define AOUT_PIN2 34
#define AOUT_PIN3 33

// define BME680 pins
#define BME_SCK 13
#define BME_MISO 12
#define BME_MOSI 11
#define BME_CS 10

// define button pin
#define BUTTON_PIN 15

// define sensor variables
float temperature = 0;
float humidity = 0;
float pressure = 0;
float moisture_1 = 0;
float moisture_2 = 0;
float gasResistance = 0;
float iaq = 0;
float iaqAccuracy = 0;
float rawTemperature = 0;
float rawHumidity = 0;
float staticIaq = 0;
float co2Equivalent = 0;
float breathVocEquivalent = 0;
float gasPercentage = 0;

// Define the LED pins
const int relay_1 = 27;
const int relay_2 = 14;
const int relay_3 = 16;
const int relay_4 = 17;

// status led
const int ledStatusError = 18;
const int ledStatusOnline = 19;

// Define the API key
String apiKey, hostMongo, url, group;

void initializeNTP()
{
  configTime(0, 0, ntpServer);
  setenv("TZ", "CET-1CEST,M3.5.0,M10.5.0/3", 1);
  tzset();
}
void makeRequest()
{
  HTTPClient http;
  http.setTimeout(timeout);

  int retries = 0;
  int httpCode = 0;

  do
  {

    http.begin(String(hostBackendHardware)); // Specify the URL
    http.addHeader("Content-Type", "application/json");
    http.addHeader("deviceId", String(deviceId));
    http.addHeader("updateVersion", version);
    http.addHeader("lastactive", String(millis())); // convert millis() to String and added to the header

    httpCode = http.GET(); // Make the request
    String response = http.getString();

    if (httpCode == 200 && response != "{\"message\":\"Invalid device ID or device not found\"}")
    { // Check for the returning code
      Serial.println("Data received successfully from backend server");
      // Parse JSON
      DynamicJsonDocument doc(1024);
      // Deserialize the JSON document
      DeserializationError error = deserializeJson(doc, response);

      // Test if parsing succeeds.
      if (error)
      {
        Serial.print("deserializeJson() failed: ");
        Serial.println(error.f_str());
        digitalWrite(ledStatusError, HIGH);
        return;
      }

      hostMongo = doc["host"].as<String>();
      url = doc["url"].as<String>();
      apiKey = doc["apiKey"].as<String>();
      group = doc["group"].as<String>();
    }
    else
    {
      Serial.println("[Backend Hardware] Error on HTTP request: " + String(http.errorToString(httpCode)));
      retries++;
      digitalWrite(ledStatusError, HIGH);
      delay(1000); // wait for a second before retrying
    }

    http.end(); // Free the resources
  } while (httpCode != 200 && retries < maxRetries);
}
std::vector<const char *> wmMenuItems = {"wifi", "info", "param", "exit"}; //"erase"

void WifiManager()
{
  // Explicitly set WiFi mode
  WiFi.mode(WIFI_STA);
  delay(10);
  wm.setTimeout(60); // 1 minute
  wm.setMenu(wmMenuItems);
  wm.setTitle("Nexaharvest");                // brand name
  int buttonState = digitalRead(BUTTON_PIN); // Read the state of the button

  Serial.println("[Wifi] Resetting Wifi-Settings. Buttonstate:" + String(buttonState));
  if (buttonState == LOW)
  {                                              // If the button is pressed (connects the pin to GND)
    wm.startConfigPortal("NexaBox", "password"); // Start the
  }
  else
  {
    if (!wm.autoConnect("NexaBox", "password")) // brand name
    {
      Serial.println("[Wifi] failed to connect and hit timeout");
      delay(3000);
      // if we still have not connected restart and try all over again
      ESP.restart();
      delay(5000);
    }
    else
    {
      // if you get here you have connected to the WiFi
      Serial.println("[Wifi] connected...yeey :)");
      digitalWrite(ledStatusOnline, HIGH);
    }
  }

  // If we get here, we are connected to the WiFi
  Serial.println("[Wifi] WiFi connected");
  Serial.print("[Wifi] IP address: ");
  Serial.println(WiFi.localIP());
  Serial.print("[Wifi] MAC address: ");
  Serial.println(WiFi.macAddress());
}
void setup()
{
  // Start the serial connection
  Serial.begin(115200);
  delay(1000);

  // Initialize the LED pins as output and set them to LOW
  pinMode(relay_1, OUTPUT);
  digitalWrite(relay_1, HIGH);

  pinMode(relay_2, OUTPUT);
  digitalWrite(relay_2, HIGH);

  pinMode(relay_3, OUTPUT);
  digitalWrite(relay_3, HIGH);

  pinMode(relay_4, OUTPUT);
  digitalWrite(relay_4, HIGH);

  pinMode(ledStatusError, OUTPUT);
  digitalWrite(ledStatusError, LOW);

  pinMode(ledStatusOnline, OUTPUT);
  digitalWrite(ledStatusOnline, LOW);
  // reset button
  pinMode(BUTTON_PIN, INPUT_PULLUP);

  // Initialize I2C communication
  Wire.begin();

  // Check TCS34725 sensor connection
  if (!tcs.begin())
  {
    Serial.println("[Wiring] Failed to connect to the TCS34725 sensor. Please check the wiring.");
    digitalWrite(ledStatusError, HIGH);
    while (1)
      ; // Halt the program if the sensor connection fails
  }

  // Check BME680 sensor connection
  if (!bme.begin())
  {
    Serial.println("[Wiring] Failed to connect to the BME680 sensor. Please check the wiring.");
    digitalWrite(ledStatusError, HIGH);
    while (1)
      ; // Halt the program if the sensor connection fails
  }
  // Set up oversampling and filter initialization
  bme.setTemperatureOversampling(BME680_OS_8X);
  bme.setHumidityOversampling(BME680_OS_2X);
  bme.setPressureOversampling(BME680_OS_4X);
  bme.setIIRFilterSize(BME680_FILTER_SIZE_3);
  bme.setGasHeater(320, 150); // 320*C for 150 ms

  // call the wifi manager
  WifiManager();

  // check for update

  // set update things
  esp32FOTAmy.setManifestURL(manifest_url);
  esp32FOTAmy.printConfig();

  // init and get the time
  initializeNTP();

  // get the mongodb credentials
  makeRequest();
}

void sendToServer(String topic, String group, String value)
{
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo))
  {
    Serial.println("[Sensor Data Server] Failed to obtain time");
    digitalWrite(ledStatusError, HIGH);
    return;
  }
  char timeStringBuff[50]; // 50 chars should be enough
  strftime(timeStringBuff, sizeof(timeStringBuff), "%Y-%m-%dT%H:%M:%S.000Z", &timeinfo);
  String timeStr = String(timeStringBuff);

  // Create a JSON object
  String json = "{\"topic\":\"" + topic + "\",\"group\":\"" + group + "\",\"value\":\"" + value + "\",\"time\":{\"$date\":\"" + timeStr + "\"}}";
  HTTPClient http;
  http.begin("https://" + hostMongo + url + "/action/insertOne");
  http.addHeader("Content-Type", "application/ejson");
  http.addHeader("Accept", "application/json");
  http.addHeader("api-key", apiKey); // Specify content-type header
  String requestData = "{\"collection\":\"datas\",\"database\":\"Website\",\"dataSource\":\"Cluster0\",\"document\":" + json + "}";
  int httpResponseCode = http.POST(requestData);

  if (httpResponseCode == 200 || httpResponseCode == 201)
  {
    Serial.println("[Sensor Data Server] Data sent successfully");
    String response = http.getString();
  }
  else
  {
    Serial.print("[Sensor Data Server] Error on sending POST (error nor clear): ");
    digitalWrite(ledStatusError, HIGH);
    String response = http.getString();
    Serial.println(response);
  }

  http.end(); // Free resources
}
void processHttpResponse()
{
  HTTPClient http;
  http.begin("https://" + hostMongo + url + "/action/find");
  Serial.println("[Get Actions] from: https://" + hostMongo + url + "/action/find");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Access-Control-Request-Headers", "*");
  http.addHeader("api-key", apiKey);

  String requestData = "{\"collection\":\"actions\",\"database\":\"Website\",\"dataSource\":\"Cluster0\"}";
  int httpResponseCode = http.POST(requestData);
  String response = http.getString();
  Serial.println(response);
  if (httpResponseCode == 200)
  {
    // Check if the response is not empty
    Serial.println("[Get Actions] Data received successfully");
    if (response.length() > 0)
    {
      // Parse the JSON response
      DynamicJsonDocument doc(3500); // change this if we change the schema of actions
      DeserializationError error = deserializeJson(doc, response);

      // Check for errors in parsing
      if (error)
      {
        Serial.print(F("[Get Actions] deserializeJson() failed with code "));
        Serial.println(error.c_str());
        Serial.println(response);
        digitalWrite(ledStatusError, HIGH);
      }
      else
      {
        // Loop through each document in the response
        for (JsonObject document : doc["documents"].as<JsonArray>())
        {
          String object = document["object"];
          String value = document["value"];

          // Turn on or off the LED based on the object value
          if (object == "pump_1")
          {
            digitalWrite(relay_1, value == "on" ? LOW : HIGH);
            Serial.println(value == "on" ? "[Backend status] Pump 1 is turned on" : "[Backend status] Pump 1 is turned off");
          }
          else if (object == "led_1")
          { // Corrected object name
            digitalWrite(relay_2, value == "on" ? LOW : HIGH);
            Serial.println(value == "on" ? "[Backend status] Led 1 is turned on" : "[Backend status] Led 1 is turned off");
          }
          else if (object == "ventilator_1")
          {
            digitalWrite(relay_3, value == "on" ? LOW : HIGH);
            Serial.println(value == "on" ? "[Backend status] Ventilator 1 is turned on" : "[Backend status] Ventilator 1 is turned off");
          }
          else if (object == "ventilator_2")
          {
            digitalWrite(relay_4, value == "on" ? LOW : HIGH);
            Serial.println(value == "on" ? "[Backend status] Ventilator 2 is turned on" : "[Backend status] Ventilator 2 is turned off");
          }
        }
      }
    }
    else
    {
      Serial.println("[Get Actions] Empty response received");
    }
  }
  else
  {
    Serial.print("[Get Actions] Error on sending POST to get actions Data: ");
    digitalWrite(ledStatusError, HIGH);
    String response = http.getString();
    Serial.println(response);
  }

  http.end();
}
// Structure to hold sensor data
struct SensorData
{
  float value;
  const char *topic;
};

// Function to send sensor data to server
void sendSensorData(float value, const char *topic)
{
  char valueString[8];
  dtostrf(value, 1, 2, valueString);
  String payload = String(valueString);
  sendToServer(topic, group, payload);
}

// Function to send all sensor data
void sendAllSensorData(SensorData sensorData[], int size)
{
  for (int i = 0; i < size; i++)
  {
    sendSensorData(sensorData[i].value, sensorData[i].topic);
  }
}

// Function to send sensor data
void sendSensorData()
{
  printf("[Sensor Data] running 1\n");

  // Update the sensor values
  if (!bme.performReading())
  {
    printf("Failed to read from BME680 sensor\n");
    return;
  }

  printf("[Sensor Data] running 2\n");

  // Array to hold all sensor data
  SensorData sensorData[] = {
      {static_cast<float>(bme.temperature), "esp/air/temperature"},
      {static_cast<float>(bme.humidity), "esp/air/humidity"},
      {static_cast<float>(bme.pressure / 100.0), "esp/air/pressure"},             // Convert Pa to hPa
      {static_cast<float>(bme.gas_resistance / 1000.0), "esp/air/gasResistance"}, // Convert Ohms to KOhms
      {static_cast<float>(analogRead(AOUT_PIN)), "esp/ground/moisture/1"},
      {static_cast<float>(analogRead(AOUT_PIN2)), "esp/ground/moisture/2"}};

  // Get light sensor data
  uint16_t r, g, b, c, colorTemp, lux;
  tcs.getRawData(&r, &g, &b, &c);
  colorTemp = tcs.calculateColorTemperature_dn40(r, g, b, c);
  lux = tcs.calculateLux(r, g, b);

  // Array to hold light sensor data
  SensorData lightData[] = {
      {static_cast<float>(colorTemp), "esp/ground/light/colorTemp"},
      {static_cast<float>(lux), "esp/ground/light/lux"},
      {static_cast<float>(r), "esp/ground/light/red"},
      {static_cast<float>(g), "esp/ground/light/green"},
      {static_cast<float>(b), "esp/ground/light/blue"},
      {static_cast<float>(c), "esp/ground/light/clear"}};

  // Send all sensor data
  sendAllSensorData(sensorData, sizeof(sensorData) / sizeof(SensorData));
  sendAllSensorData(lightData, sizeof(lightData) / sizeof(SensorData));
}

void loop()
{
  bool updatedNeeded = esp32FOTAmy.execHTTPcheck();
  if (updatedNeeded)
  {
    esp32FOTAmy.execOTA();
  }

  unsigned long currentMillis = millis();
  if (currentMillis - lastHttpResponseTime >= httpResponseInterval)
  {
    lastHttpResponseTime = currentMillis;
    printf("[System loop] Processing http response...\n");
    processHttpResponse();
  }

  if (currentMillis - lastSensorDataTime >= sensorDataInterval)
  {
    lastSensorDataTime = currentMillis;
    printf("[System loop] Sending data to server...\n");
    sendSensorData();
    printf("[System loop] Data sent to server\n");
  }
}