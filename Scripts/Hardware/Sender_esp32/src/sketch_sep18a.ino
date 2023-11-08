#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <Adafruit_BME280.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_TCS34725.h>

// Replace the next variables with your SSID/Password combination
const char *ssid = "5551 2771";
const char *password = "a16c41b0f19cd116c4f1672ebe";

// Add your MQTT Broker IP address, example:
// const char* mqtt_server = "192.168.1.144";
const char *mqtt_server = "192.168.178.95";

WiFiClient espClient;
PubSubClient client(espClient);
Adafruit_BME280 bme; // I2C
Adafruit_TCS34725 tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_614MS, TCS34725_GAIN_1X);
long lastMsg = 0;
int value = 0;

#define AOUT_PIN 35
#define AOUT_PIN2 34
#define AOUT_PIN3 33

float temperature = 0;
float humidity = 0;
float pressure = 0;
float moisture = 0;
float moistureb = 0;
float moisturec = 0;

void setup()
{
  Serial.begin(115200);
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
  client.setServer(mqtt_server, 1883);
}

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

void reconnect()
{
  Serial.println("reconnect function called");
  delay(5000);
  while (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP8266Client"))
    {
      Serial.println("connected");
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 1 second");
      delay(1000);
    }
  }
}

void loop()
{
  if (!client.connected())
  {
    Serial.println("loop wifi reconnect");
    setup_wifi();
    delay(5000);
    reconnect();
    delay(5000);
  }

  Serial.println("entering loop");
  client.loop();
  // temperature
  temperature = bme.readTemperature();
  char tempString[8];
  dtostrf(temperature, 1, 2, tempString);
  Serial.print("Temperature: ");
  Serial.print(tempString);
  Serial.println(" *C");
  String temperatureTopic = "esp/air/temperature";
  String temperaturePayload = String(tempString) + "," + "Group A";
  client.publish(temperatureTopic.c_str(), temperaturePayload.c_str());
  // humidity
  humidity = bme.readHumidity();
  char humString[8];
  dtostrf(humidity, 1, 2, humString);
  Serial.print("Humidity: ");
  Serial.print(humString);
  Serial.println(" %");
  String humidityTopic = "esp/air/humidity";
  String humidityPayload = String(humString) + "," + "Group A";
  client.publish(humidityTopic.c_str(), humidityPayload.c_str());
  // pressure
  pressure = (bme.readPressure() / 100.0F);
  char preString[8];
  dtostrf(pressure, 1, 2, preString);
  Serial.print("Pressure: ");
  Serial.print(preString);
  Serial.println(" hPa");
  String pressureTopic = "esp/air/pressure";
  String pressurePayload = String(preString) + "," + "Group A";
  client.publish(pressureTopic.c_str(), pressurePayload.c_str());
  // moisture/1
  moisture = analogRead(AOUT_PIN);
  Serial.println(moisture);
  char moiString[8];
  dtostrf(moisture, 1, 2, moiString);
  Serial.print("Moisture: ");
  Serial.println(moiString);
  String moistureTopic = "esp/ground/moisture/1";
  String moisturePayload = String(moiString) + "," + "Group A";
  client.publish(moistureTopic.c_str(), moisturePayload.c_str());
  // moisture/2
  moistureb = analogRead(AOUT_PIN2);
  char moibString[8];
  dtostrf(moistureb, 1, 2, moibString);
  Serial.print("Moisture: ");
  Serial.println(moibString);
  String moisturebTopic = "esp/ground/moisture/2";
  String moisturebPayload = String(moibString) + "," + "Group A";
  client.publish(moisturebTopic.c_str(), moisturebPayload.c_str());
  // moisture/3
  moisturec = analogRead(AOUT_PIN3);
  char moicString[8];
  dtostrf(moisturec, 1, 2, moicString);
  Serial.print("Moisture: ");
  Serial.println(moicString);
  String moisturecTopic = "esp/ground/moisture/3";
  String moisturecPayload = String(moicString) + "," + "Group A";
  client.publish(moisturecTopic.c_str(), moisturecPayload.c_str());
  // colorTemp = tcs.calculateColorTemperature(r, g, b);
  uint16_t r, g, b, c, colorTemp, lux;
  tcs.getRawData(&r, &g, &b, &c);
  colorTemp = tcs.calculateColorTemperature_dn40(r, g, b, c);
  lux = tcs.calculateLux(r, g, b);
  // light/colorTemo
  char colorTempString[8];
  dtostrf(colorTemp, 1, 2, colorTempString);
  Serial.print("Color Temp: ");
  Serial.println(colorTemp, DEC);
  String colorTempTopic = "esp/ground/light/colorTemp";
  String colorTempPayload = String(colorTempString) + "," + "Group A";
  client.publish(colorTempTopic.c_str(), colorTempPayload.c_str());
  // light/lux
  char luxString[8];
  dtostrf(lux, 1, 2, luxString);
  Serial.print("Lux: ");
  Serial.println(lux, DEC);
  String luxTopic = "esp/ground/light/lux";
  String luxPayload = String(luxString) + "," + "Group A";
  client.publish(luxTopic.c_str(), luxPayload.c_str());
  // light/red
  char rString[8];
  dtostrf(r, 1, 2, rString);
  Serial.print("R: ");
  Serial.println(r, DEC);
  String rTopic = "esp/ground/light/red";
  String rPayload = String(rString) + "," + "Group A";
  client.publish(rTopic.c_str(), rPayload.c_str(), DEC);
  // light/green
  char gString[8];
  dtostrf(g, 1, 2, gString);
  Serial.print("G: ");
  Serial.println(g, DEC);
  String gTopic = "esp/ground/light/green";
  String gPayload = String(gString) + "," + "Group A";
  client.publish(gTopic.c_str(), gPayload.c_str(), DEC);
  // light/blue
  char bString[8];
  dtostrf(b, 1, 2, bString);
  Serial.print("B: ");
  Serial.println(b, DEC);
  String bTopic = "esp/ground/light/blue";
  String bPayload = String(bString) + "," + "Group A";
  client.publish(bTopic.c_str(), bPayload.c_str(), DEC);
  // light/clear
  char cString[8];
  dtostrf(c, 1, 2, cString);
  Serial.print("C: ");
  Serial.println(c, DEC);
  String cTopic = "esp/ground/light/clear";
  String cPayload = String(cString) + "," + "Group A";
  client.publish(cTopic.c_str(), cPayload.c_str(), DEC);
  delay(5000);
}