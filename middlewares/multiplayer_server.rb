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
      @otherPlayers = {}
    end

    def call(env)
      if Faye::WebSocket.websocket?(env)
        # If we don't Ping and this connection is idle for 55 seconds
        # Heroku will terminate the connection
        ws = Faye::WebSocket.new(env, nil, {ping: KEEPALIVE_TIME })

        ws.on :open do |event|
          @players << ws
        end

        # Too bulky... need to set player ID from server.
        ws.on :message do |event|
          message = JSON.parse event.data
          unless @otherPlayers[message['playerId']]
            @otherPlayers[message['playerId']] = ws
          end
          @players.each { |player| player.send(event.data) }
        end

        ws.on :close do |event|
          @players.delete(ws)
          @otherPlayers.each do |p, c|
            if c == ws
              @otherPlayers.delete(p)
              left_message = {action: 'playerLeft', playerId: p}
              @players.each { |player| player.send(JSON.generate(left_message)) }
            end
          end
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
