# Nexaharvest
## Contents
 - [Purpose](#purpose)
 - [How it looks](#how-it-looks)
 - [Reference](#reference)
 - [Installation](#installation)
 - [Disclaimer](#disclaimer)
## Purpose
Automation and monitoring of plants. With this Hard and software you can collect percisely all sensor Data view it from anywhere and analyse it. Furthermore you can Set alerts and much more!

## How it looks:
| Notifications | History |
|:-------------:|:-------:|
| <img width="1466" alt="notifications" src="https://github.com/Max-cmd-dot/Nexaharvest/assets/60576883/5ed7ed38-5ce2-41b4-ba20-e6dc59209ce7"> | <img width="1466" alt="history" src="https://github.com/Max-cmd-dot/Nexaharvest/assets/60576883/e594370e-f7fb-4260-ad08-c6f1668b5ab7"> |

| Dashboard | Actions |
|:---------:|:-------:|
| <img width="1466" alt="dashboard" src="https://github.com/Max-cmd-dot/Nexaharvest/assets/60576883/865555bb-916a-4d9d-886e-1ae8963e0fab"> | <img width="1466" alt="actions" src="https://github.com/Max-cmd-dot/Nexaharvest/assets/60576883/e402d42f-b2f3-4158-8e26-e13a2a1ca20e"> |

The software is freely available to everyone, see GPLv3 conditions.

Support is appreciated!
Whether in the form of code or through donations.
Please donate to max.nobis@nexaharvest.com

Inquiries for support contracts to max.nobis@nexaharvest.com
More information at https://nexaharvest.com


## Reference
Nexaharvest Boxes are available at

	https://shop.nexaharvest.com

## Installation

Pre-installed with ready-made modules. So there is no installation needed! https://shop.nexaharvest.com

**Installation of the software on the hardware (ESP32).**
1. First, download the required files from this repository. You can find them under Scripts/Hardware/OTA_esp32.
2. To install the software on the ESP, you can use PlatformIO, for example.

**Installation of the web server.**
1. Download the files here as well.
2. Open two terminals.
3. In the first one, navigate to the Website/Client directory using `cd`, then execute `npm install`.
4. In the second one, navigate to the Website/server directory, and also execute `npm install`.
5. then in both folders please edit the .env files as you need them
6. In both terminals, run `npm run start`.
7. Now, a window should appear with the interface as shown above.

## Disclaimer
Work involves low voltage as well as 230V. This should only be done by trained personnel. The guide is without guarantee, and any actions are at your own risk.
Misconfiguration of the software can at most result in a dying plant. Incorrectly assembled hardware can be life-threatening. In case of doubt, have this part performed by an electrician.
No warranty for the software - use at your own risk!
