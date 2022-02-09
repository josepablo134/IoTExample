#include <Arduino.h>
#include <string.h>

namespace esp8266_http_client{
  extern const String host;
  extern void init(void);
  extern String request( String &endpoint);
}
