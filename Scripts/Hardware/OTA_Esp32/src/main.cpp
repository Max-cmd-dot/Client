#include <Arduino.h>
#include <Adafruit_TCS34725.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <esp32fota.h>
#include <WiFiManager.h>
#include <Adafruit_BME680.h>
// lvgl
#include <ui.h>
#include "ui_helpers.h"
// display
#include <SPI.h>
#include <TFT_eSPI.h> // Hardware-specific library

// multitask

TaskHandle_t Task1;
TaskHandle_t Task2;
/*Change to your screen resolution*/
static const uint16_t screenWidth = 320;
static const uint16_t screenHeight = 240;

static lv_disp_draw_buf_t draw_buf;
static lv_color_t buf[screenWidth * screenHeight / 10];
TFT_eSPI tft = TFT_eSPI(screenHeight, screenWidth); /* TFT instance */

// Define WiFiManager Object
WiFiManager wm;
String version = "1.0.4";
// esp32fota esp32fota("<Type of Firme for this device>", <this version>, <validate signature>);
esp32FOTA esp32FOTAmy("esp32-fota-http", version, false);
unsigned long lastHttpResponseTime = 0;
unsigned long httpResponseInterval = 5000; // 5 seconds

unsigned long lastSensorDataTime = 0;
unsigned long sensorDataInterval = 5000; // 5 seconds

unsigned long lastDisplayUpdateTime = 0;
const unsigned long displayUpdateInterval = 5; // Update display every 5ms
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
#define GROUNDSENSOR_PIN 35
#define GROUNDSENSOR_PIN2 34

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

// Define the relay pins
const int relay_1 = 27;
const int relay_2 = 14;
const int relay_3 = 16;
const int relay_4 = 17;

// Given maximum limits
const float Temp_max = 40.0;
const float Hum_max = 100.0;
const float Moisture_max = 2700.0;
const float Lux_max = 20000.0;

// Define the API key
String apiKey, hostMongo, url, group;

// This is the file name used to store the calibration data
// You can change this to create new calibration files.
// The SPIFFS file name must start with "/".
#define CALIBRATION_FILE "/TouchCalData1"

const char *LOG_FILE = "/Log Text"; // File name

// Set REPEAT_CAL to true instead of false to run calibration
// again, otherwise it will only be done once.
// Repeat calibration if you change the screen rotation.
#define REPEAT_CAL false

/* Display flushing */
void my_disp_flush(lv_disp_drv_t *disp, const lv_area_t *area, lv_color_t *color_p)
{
  uint32_t w = (area->x2 - area->x1 + 1);
  uint32_t h = (area->y2 - area->y1 + 1);

  tft.startWrite();
  tft.setAddrWindow(area->x1, area->y1, w, h);
  tft.pushColors((uint16_t *)&color_p->full, w * h, true);
  tft.endWrite();

  lv_disp_flush_ready(disp);
}

/*Read the touchpad*/
void my_touchpad_read(lv_indev_drv_t *indev_driver, lv_indev_data_t *data)
{
  uint16_t touchX = 0, touchY = 0;

  bool touched = tft.getTouch(&touchX, &touchY, 400);

  if (!touched)
  {
    data->state = LV_INDEV_STATE_REL;
  }
  else
  {
    data->state = LV_INDEV_STATE_PR;

    /*Set the coordinates*/
    data->point.x = touchX;
    data->point.y = touchY;
  }
}
/*Calibrate the touchpad*/
void touch_calibrate()
{
  uint16_t calData[5];
  uint8_t calDataOK = 0;

  // check file system exists
  if (!SPIFFS.begin())
  {
    Serial.println("formatting file system");
    SPIFFS.format();
    SPIFFS.begin();
  }

  // check if calibration file exists and size is correct
  if (SPIFFS.exists(CALIBRATION_FILE))
  {
    if (REPEAT_CAL)
    {
      // Delete if we want to re-calibrate
      SPIFFS.remove(CALIBRATION_FILE);
    }
    else
    {
      File f = SPIFFS.open(CALIBRATION_FILE, "r");
      if (f)
      {
        if (f.readBytes((char *)calData, 14) == 14)
          calDataOK = 1;
        f.close();
      }
    }
  }

  if (calDataOK && !REPEAT_CAL)
  {
    // calibration data valid
    tft.setTouch(calData);
  }
  else
  {
    // data not valid so recalibrate
    tft.fillScreen(TFT_BLACK);
    tft.setCursor(20, 0);
    tft.setTextFont(2);
    tft.setTextSize(1);
    tft.setTextColor(TFT_WHITE, TFT_BLACK);

    tft.println("Touch corners as indicated");

    tft.setTextFont(1);
    tft.println();

    if (REPEAT_CAL)
    {
      tft.setTextColor(TFT_RED, TFT_BLACK);
      tft.println("Set REPEAT_CAL to false to stop this running again!");
    }

    tft.calibrateTouch(calData, TFT_MAGENTA, TFT_BLACK, 15);

    tft.setTextColor(TFT_GREEN, TFT_BLACK);
    tft.println("Calibration complete!");

    // store data
    File f = SPIFFS.open(CALIBRATION_FILE, "w");
    if (f)
    {
      f.write((const unsigned char *)calData, 14);
      f.close();
    }
  }
}
// Function to initialize NTP
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
  wm.setTimeout(60); // 1 minute
  wm.setMenu(wmMenuItems);
  wm.setTitle("Nexaharvest"); // brand name
  tft.fillScreen(TFT_BLACK);
  //  write at the top of the screen
  tft.setCursor(0, 0);
  tft.println("[System] Wifi-Manager please connect with your phone to the Wifi 'NexaharvestBox'!");

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
  }

  // If we get here, we are connected to the WiFi
  Serial.println("[Wifi] WiFi connected");
  Serial.print("[Wifi] IP address: ");
  Serial.println(WiFi.localIP());
  Serial.print("[Wifi] MAC address: ");
  Serial.println(WiFi.macAddress());
}
void sendToServer(String topic, String group, String value)
{
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo))
  {
    Serial.println("[Sensor Data Server] Failed to obtain time");
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
    String response = http.getString();
    Serial.println(response);
  }

  http.end();
}
// Function to update the display with sensor values
void updateDisplayValues(float temperature, float humidity, float soilMoisture, float lux)
{
  // Assuming you have already initialized LVGL and created the necessary objects (bars, labels, etc.)

  // Calculate percentage values
  float tempPercentage = (temperature / Temp_max) * 100.0;
  float humPercentage = (humidity / Hum_max) * 100.0;
  float moisturePercentage = (soilMoisture / Moisture_max) * 100.0;
  float luxPercentage = (lux / Lux_max) * 100.0;

  // Update temperature bar chart
  lv_bar_set_value(ui_BarTemperature, tempPercentage, LV_ANIM_OFF);

  // Update humidity bar chart
  lv_bar_set_value(ui_BarHumidity, humPercentage, LV_ANIM_OFF);

  // Update soil moisture bar chart
  lv_bar_set_value(ui_BarSoilMoisture, moisturePercentage, LV_ANIM_OFF);

  // Update lux bar chart
  lv_bar_set_value(ui_BarLux, luxPercentage, LV_ANIM_OFF);
}

void writeStringToFile(const String &content)
{
  File file = SPIFFS.open(LOG_FILE, "a"); // Open the file in append mode
  if (file)
  {
    file.println(content); // Write the entire string to the file
    file.close();
    Serial.println("String written to Log Text file.");
  }
  else
  {
    Serial.println("Error opening Log Text file for writing.");
  }
}

String readLogFileContent()
{
  String content;
  if (SPIFFS.exists(LOG_FILE))
  {
    File file = SPIFFS.open(LOG_FILE, "r");
    if (file)
    {
      content = file.readString();
      file.close();
    }
  }
  return content;
}

void updateLogText()
{
  String logContent = readLogFileContent();
  // Assuming you have an LVGL label object named ui_LabelLog
  lv_label_set_text(ui_LabelLog, logContent.c_str());
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
      {static_cast<float>(analogRead(GROUNDSENSOR_PIN)), "esp/ground/moisture/1"},
      {static_cast<float>(analogRead(GROUNDSENSOR_PIN2)), "esp/ground/moisture/2"}};

  // Get light sensor data
  uint16_t r, g, b, c, colorTemp, lux;
  tcs.getRawData(&r, &g, &b, &c);
  colorTemp = tcs.calculateColorTemperature_dn40(r, g, b, c);
  lux = tcs.calculateLux(r, g, b);
  updateDisplayValues(bme.temperature, bme.humidity, analogRead(GROUNDSENSOR_PIN), tcs.calculateLux(r, g, b));
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

// Task1code: blinks an LED every 1000 ms
void codeForTask1(void *pvParameters)
{
  for (;;)
  {
    Serial.println("checking for update");
    // Check for updates
    bool updatedNeeded = esp32FOTAmy.execHTTPcheck();
    if (updatedNeeded)
    {
      esp32FOTAmy.execOTA();
    }
    // Add some delay to allow other tasks to run
    vTaskDelay(100000 / portTICK_PERIOD_MS);
  }
}

// Task2code: blinks an LED every 700 ms
void codeForTask2(void *pvParameters)
{
  Serial.print("Task2 running still on core ");
  Serial.println(xPortGetCoreID());
  for (;;)
  {
    Serial.print("Task2 running still on core ");
    Serial.println(xPortGetCoreID());
    // Get current time
    unsigned long currentMillis = millis();
    // Process HTTP responses
    if (currentMillis - lastHttpResponseTime >= httpResponseInterval)
    {
      lastHttpResponseTime = currentMillis;
      printf("[System loop] Processing http response...\n");
      processHttpResponse();
      // Add some delay to allow other tasks to run
      vTaskDelay(10 / portTICK_PERIOD_MS);
    }

    // Send sensor data
    if (currentMillis - lastSensorDataTime >= sensorDataInterval)
    {
      lastSensorDataTime = currentMillis;
      printf("[System loop] Sending data to server...\n");
      sendSensorData();
      printf("[System loop] Data sent to server\n");
      // Add some delay to allow other tasks to run
      vTaskDelay(10 / portTICK_PERIOD_MS);
    }
    // Call the function to update the LVGL label
    updateLogText();
  }
}
// Callback function to handle switch state changes
static void event_handler(lv_event_t *e)
{
  lv_event_code_t code = lv_event_get_code(e);
  lv_obj_t *obj = lv_event_get_target(e);
  if (code == LV_EVENT_VALUE_CHANGED)
  {
    LV_UNUSED(obj);
    LV_LOG_USER("State: %s\n", lv_obj_has_state(obj, LV_STATE_CHECKED) ? "On" : "Off");
  }
}

void setup()
{
  Serial.begin(115200);
  // Initialize the relay pins as output and set them to LOW
  pinMode(relay_1, OUTPUT);
  digitalWrite(relay_1, HIGH);

  pinMode(relay_2, OUTPUT);
  digitalWrite(relay_2, HIGH);

  pinMode(relay_3, OUTPUT);
  digitalWrite(relay_3, HIGH);

  pinMode(relay_4, OUTPUT);
  digitalWrite(relay_4, HIGH);

  // Display start
  tft.begin();        /* TFT init */
  tft.setRotation(1); /* Landscape orientation, flipped */
  // Calibrate the touch screen and retrieve the scaling factors
  // Clear the screen
  tft.fillScreen(TFT_BLACK);
  touch_calibrate();
  Serial.println("Setup done");

  lv_init();
  lv_disp_draw_buf_init(&draw_buf, buf, NULL, screenWidth * screenHeight / 10);

  /*Initialize the display*/
  static lv_disp_drv_t disp_drv;
  lv_disp_drv_init(&disp_drv);
  /*Change the following line to your display resolution*/
  disp_drv.hor_res = screenWidth;
  disp_drv.ver_res = screenHeight;
  disp_drv.flush_cb = my_disp_flush;
  disp_drv.draw_buf = &draw_buf;
  lv_disp_drv_register(&disp_drv);

  /*Initialize the (dummy) input device driver*/
  static lv_indev_drv_t indev_drv;
  lv_indev_drv_init(&indev_drv);
  indev_drv.type = LV_INDEV_TYPE_POINTER;
  indev_drv.read_cb = my_touchpad_read;
  lv_indev_drv_register(&indev_drv);

  ui_init();

  // add an event to the switches
  lv_obj_add_event_cb(ui_Switch1, event_handler, LV_EVENT_ALL, NULL);
  // Call the function to write the string
  writeStringToFile("ESP32 Log-File-System started");

  // Initialize I2C communication
  Wire.begin();
  // Check BME680 sensor connection
  if (!bme.begin())
  {
    Serial.println("[Wiring] Failed to connect to the BME680 sensor. Please check the wiring.");
    writeStringToFile("[Wiring] Failed to connect to the BME680 sensor. Please check the wiring.");
    while (1)
      ; // Halt the program if the sensor connection fails
  }

  // Check TCS34725 sensor connection
  if (!tcs.begin())
  {
    Serial.println("[Wiring] Failed to connect to the TCS34725 sensor. Please check the wiring.");
    writeStringToFile("[Wiring] Failed to connect to the TCS34725 sensor. Please check the wiring.");
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
  writeStringToFile("[System] Wifi-Manager finished");

  // set update things
  esp32FOTAmy.setManifestURL(manifest_url);
  esp32FOTAmy.printConfig();

  // init and get the time
  initializeNTP();

  // get the mongodb credentials
  makeRequest();

  // check for update
  Serial.println("Starting task 1");
  xTaskCreatePinnedToCore(
      codeForTask1, /* Task function. */
      "Task1",      /* name of task. */
      5000,         /* Stack size of task */
      NULL,         /* parameter of the task */
      1,            /* priority of the task */
      &Task1,       /* Task handle to keep track of created task */
      1);           /* Core */
  delay(500);

  xTaskCreatePinnedToCore(
      codeForTask2, /* Task function. */
      "Task2",      /* name of task. */
      5000,         /* Stack size of task */
      NULL,         /* parameter of the task */
      1,            /* priority of the task */
      &Task2,       /* Task handle to keep track of created task */
      0);
}

void loop()
{
  // Get current time
  unsigned long currentMillis = millis();
  // Update the display every 5ms
  if (currentMillis - lastDisplayUpdateTime >= displayUpdateInterval)
  {
    lastDisplayUpdateTime = currentMillis;
    lv_timer_handler(); /* let the GUI do its work */
  }
}