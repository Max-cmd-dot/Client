
#include <esp32fota.h>
#include <WiFi.h>

// esp32fota esp32fota("<Type of Firme for this device>", <this version>, <validate signature>);
esp32FOTA esp32FOTA("esp32-fota-http", "1.0.1", false);

const char *manifest_url = "http://192.168.178.121:8080/api/hardware/update";
const char *ssid = "5551 2771";                      // your network SSID (name)
const char *password = "a16c41b0f19cd116c4f1672ebe"; // your network password

void setup_wifi()
{
  delay(10);
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println(WiFi.localIP());
}

void setup()
{
  Serial.begin(115200);
  esp32FOTA.setManifestURL(manifest_url);
  esp32FOTA.printConfig();
  setup_wifi();
}

void loop()
{

  bool updatedNeeded = esp32FOTA.execHTTPcheck();
  if (updatedNeeded)
  {
    esp32FOTA.execOTA();
  }

  delay(2000);
}