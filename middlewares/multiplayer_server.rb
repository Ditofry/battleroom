require 'faye/websocket'
require 'thread'
# require 'redis'
require 'json'
require 'erb'

module MultiPlayer
  class Server
    KEEPALIVE_TIME = 15 # in seconds
    CHANNEL        = "server"

    attr_reader :players

    def initialize(app)
      @app     = app
      @players = []
    end

    def call(env)
      if Faye::WebSocket.websocket?(env)
        # If we don't Ping and this connection is idle for 55 seconds
        # Heroku will terminate the connection
        ws = Faye::WebSocket.new(env, nil, {ping: KEEPALIVE_TIME })

        ws.on :open do |event|
          @players << ws
        end

        ws.on :message do |event|
          @players.each { |player| player.send(event.data) }
        end

        ws.on :close do |event|
          p [:close, ws.object_id, event.code, event.reason]
          @players.delete(ws)
          ws = nil
        end

        # async Rack response WEEEEW!
        ws.rack_response

      else
        @app.call(env)
      end
    end

  end
end
