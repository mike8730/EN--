class DashboardController < ApplicationController
  def index
    @user = current_user
    @stories = Story
    .includes(:user)
    .where("expires_at > ?", Time.current)
    .order(created_at: :desc)
    @story_groups = @stories.group_by(&:user)
  end
end
