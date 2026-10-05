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

  private
  
  def story_params
    params.require(:story).permit(
      :caption,
      :media
    )
  end
end
