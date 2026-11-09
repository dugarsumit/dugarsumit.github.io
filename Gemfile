source "https://rubygems.org"

# github-pages forces safe mode, so this cannot live in _plugins.
# Liquid 4.0.3 still calls Object#tainted?, which Ruby 3.2 removed.
require_relative "ruby_compat"

# Hello! This is where you manage which Jekyll version is used to run.
# When you want to use a different version, change it below, save the
# file and run `bundle install`. Run Jekyll with `bundle exec`, like so:
#
#     bundle exec jekyll serve
#
# This will help ensure the proper Jekyll version is running.
# Happy Jekylling!

gem "github-pages", group: :jekyll_plugins

# Removed from Ruby's default gems; Jekyll 3.9 still requires them.
gem "csv"
gem "bigdecimal"
gem "webrick"

# If you want to use Jekyll native, uncomment the line below.
# To upgrade, run `bundle update`.

# gem "jekyll"

gem "wdm", "~> 0.1.0" if Gem.win_platform?

# If you have any plugins, put them here!
group :jekyll_plugins do
  # gem "jekyll-archives"
  gem "jekyll-feed"
  gem 'jekyll-sitemap'
  gem 'hawkins'
end
