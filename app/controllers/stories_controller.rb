class StoriesController < ApplicationController

  def new
    @story = Story.new
  end

  def create
    @story = current_user.stories.new(story_params)
    @story.expires_at = Time.current + 24.hours

    if @story.save
      redirect_to dashboard_path
    else
      render :new, status: :unprocessable_entity
    end
  end

  def show
    @story = Story.where("expires_at > ?", Time.current).find(params[:id])
    StoryRead.find_or_create_by(user: current_user, story: @story)
  end

  private
  
  def story_params
    params.require(:story).permit(
      :caption,
      :media
    )
  end
end
