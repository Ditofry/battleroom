require 'faye/websocket'
require 'thread'
# require 'redis'
require 'json'
require 'erb'

module MultiPlayer
  class Server
    KEEPALIVE_TIME = 15 # in seconds
    CHANNEL        = "server"

    def initialize(app)
      @app     = app
      @clients = []
    end

    def call(env)
      if Faye::WebSocket.websocket?(env)
        # If we don't Ping and this connection is idle for 55 seconds
        # Heroku will terminate the connection
        ws = Faye::WebSocket.new(env, nil, {ping: KEEPALIVE_TIME })
        ws.on :open do |event|
          # For console demonstration purposes
          p [:open, ws.object_id]
          @clients << ws
        end

        ws.on :message do |event|
          p [:message, event.data]
          @clients.each {|client| client.send(event.data) }
          # When we want to scale
          # @redis.publish(CHANNEL, sanitize(event.data))
        end

        ws.on :close do |event|
          p [:close, ws.object_id, event.code, event.reason]
          @clients.delete(ws)
          ws = nil
        end

        # Return async Rack response
        ws.rack_response

      else
        @app.call(env)
      end
    end

    private
    def sanitize(message)
      json = JSON.parse(message)
      json.each {|key, value| json[key] = ERB::Util.html_escape(value) }
      JSON.generate(json)
    end
  end
end
