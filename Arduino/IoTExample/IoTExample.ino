#define PC    Serial
#define ESP   Serial1

void setup() {
  PC.begin(115200);
  ESP.begin(115200);
}

void UART_bridge(){
  while(1){
    if( PC.available() ){
      ESP.write( PC.read() );
    }
    if( ESP.available() ){
      PC.write( ESP.read() );
    }
  }
}

#define REQ_DELAY 500
void HttpRequest(){
  PC.println("HTTP Request example");
  ESP.println("AT+CIPSTART=\"TCP\",\"192.168.0.8\",3000");
    delay(REQ_DELAY);
    while(ESP.available()){
      PC.write( ESP.read() );
    }
  ESP.println("AT+CIPMODE=0");
    delay(REQ_DELAY);
    while(ESP.available()){
      PC.write( ESP.read() );
    }

  #if 0
  String req= "GET / HTTP/1.1\nConnection: close\n\n";
  #else
  String req= "GET / HTTP/1.1\nConnection: keep-alive\n\n";
  #endif
  ESP.println("AT+CIPSEND="+ String( req.length() ) );
    delay(REQ_DELAY);
    while(ESP.available()){
      PC.write( ESP.read() );
    } 
  ESP.println(req);
    delay(REQ_DELAY);
    while(ESP.available()){
      PC.write( ESP.read() );
    }
}

void loop() {
  HttpRequest();
  UART_bridge();
}
