class DashboardController < ApplicationController
  def index
    @user = current_user
    @stories = Story
    .where("expires_at > ?", Time.current)
    .order(created_at: :desc)
  end
end
