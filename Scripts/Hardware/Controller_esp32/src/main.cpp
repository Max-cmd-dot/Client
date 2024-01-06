#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
const char *ssid = "5551 2771";
const char *password = "a16c41b0f19cd116c4f1672ebe";

const char *host = "eu-central-1.aws.data.mongodb-api.com";
String url = "/app/data-vycfd/endpoint/data/v1";
String apiKey = "wvNMOVt8Ad5sd3surfPXFePxxPIJLYe29bSnETeQqwIH7smcbzUM2Lt2t9fbOiDb";

// Define the LED pins
const int led_1 = 12;
const int led_2 = 14;
const int led_3 = 27;
const int led_4 = 16;
const int ledRoof1 = 18;
const int led_5 = 17;

void setup()
{
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Initialize the LED pins as output
  pinMode(led_1, OUTPUT);
  pinMode(led_2, OUTPUT);
  pinMode(led_3, OUTPUT);
  pinMode(led_4, OUTPUT);
  pinMode(ledRoof1, OUTPUT);
  pinMode(led_5, OUTPUT);
}

void loop()
{
  if (WiFi.status() == WL_CONNECTED)
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
          digitalWrite(led_1, value == "on" ? HIGH : LOW);
        else if (object == "pump_2")
          digitalWrite(led_2, value == "on" ? HIGH : LOW);
        else if (object == "pump_3")
          digitalWrite(led_3, value == "on" ? HIGH : LOW);
        else if (object == "ventilator_1")
          digitalWrite(led_4, value == "on" ? HIGH : LOW);
        else if (object == "roof_1")
          digitalWrite(ledRoof1, value == "on" ? HIGH : LOW);
        else if (object == "humidifyer_1")
          digitalWrite(led_5, value == "on" ? HIGH : LOW);
      }
    }
    else
    {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  }
  else
  {
    Serial.println("Error in WiFi connection");
  }

  delay(10000); // Send a request every 10 seconds
}