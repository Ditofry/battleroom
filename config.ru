require './impact'
require './middlewares/multiplayer_backend'

use MultiPlayer::Server

run Sinatra::Application

# require 'bundler'
# Bundler.require
# require './impact'
#
# run Sinatra::Application
