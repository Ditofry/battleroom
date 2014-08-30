require './impact'
require './middlewares/multiplayer_server'

use MultiPlayer::Server

run Sinatra::Application
