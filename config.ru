require './impact'
require './middlewares/multiplayer_backend'

use MultiPlayer::Server

run Sinatra::Application
