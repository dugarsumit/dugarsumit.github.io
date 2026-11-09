# Liquid 4.0.3 (pinned by github-pages) calls Object#tainted?, removed in Ruby 3.2.
class Object
  def tainted?
    false
  end unless method_defined?(:tainted?)
end
